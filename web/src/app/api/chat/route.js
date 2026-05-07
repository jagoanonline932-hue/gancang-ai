import sql from "@/app/api/utils/sql";

// Endpoint utama AI chat - mensimulasikan flow WhatsApp
// Body: { customer_phone, customer_name, message }
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_phone, customer_name, message } = body;

    if (!customer_phone || !message) {
      return Response.json(
        { error: "customer_phone dan message wajib" },
        { status: 400 },
      );
    }

    // 1. Ambil settings, knowledge base, products
    const [settingsRows, kbRows, productRows] = await sql.transaction([
      sql`SELECT * FROM ai_settings ORDER BY id ASC LIMIT 1`,
      sql`SELECT title, content, category FROM knowledge_base ORDER BY created_at DESC LIMIT 30`,
      sql`SELECT id, name, description, price, weight_grams, stock, image_url FROM products ORDER BY created_at DESC LIMIT 30`,
    ]);

    const settings = settingsRows[0] || {
      agent_name: "Sari",
      business_name: "Toko Saya",
      tone: "ramah",
      language: "auto",
      system_prompt: "",
    };

    // 2. Cari atau buat conversation
    let convo =
      await sql`SELECT * FROM conversations WHERE customer_phone = ${customer_phone} LIMIT 1`;
    let conversationId;
    if (convo.length === 0) {
      const created = await sql`
        INSERT INTO conversations (customer_phone, customer_name, last_message, last_role)
        VALUES (${customer_phone}, ${customer_name || ""}, ${message}, 'user')
        RETURNING *
      `;
      conversationId = created[0].id;
    } else {
      conversationId = convo[0].id;
      await sql`UPDATE conversations SET last_message = ${message}, last_role = 'user', updated_at = NOW() WHERE id = ${conversationId}`;
    }

    // 3. Simpan pesan user
    await sql`INSERT INTO messages (conversation_id, role, content) VALUES (${conversationId}, 'user', ${message})`;

    // 4. Ambil history terakhir
    const history =
      await sql`SELECT role, content FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_at DESC LIMIT 12`;
    const orderedHistory = history.reverse();

    // 5. Bangun system prompt
    const productList = productRows
      .map(
        (p) =>
          `- ${p.name} | Rp ${Number(p.price).toLocaleString("id-ID")} | berat ${p.weight_grams}g | stok ${p.stock} | ${p.description || ""}`,
      )
      .join("\n");
    const kbList = kbRows
      .map((k) => `[${k.category}] ${k.title}: ${k.content}`)
      .join("\n");

    const systemPrompt = `Kamu adalah ${settings.agent_name}, customer service AI untuk ${settings.business_name}.
Tone: ${settings.tone}. Bahasa: ${settings.language === "auto" ? "ikuti bahasa pelanggan" : settings.language}.

ATURAN UTAMA:
1. Pahami maksud pelanggan dengan baik. Jawab dengan ${settings.tone}, singkat, jelas.
2. Jika pelanggan tanya produk, jelaskan dari katalog di bawah. Sebutkan harga dan stok.
3. Jika pelanggan tanya ongkir, MINTA kota tujuan & berat estimasi, lalu panggil tool CEK_ONGKIR.
4. Jika pelanggan mau order, kumpulkan: nama, no HP, alamat lengkap, kota, produk yang dipesan, jumlah. Konfirmasi total + ongkir, lalu panggil tool BUAT_ORDER.
5. Selalu balas dalam bahasa pelanggan (deteksi otomatis).
6. JANGAN mengarang harga atau produk yang tidak ada di katalog.

KATALOG PRODUK:
${productList || "(belum ada produk)"}

KNOWLEDGE BASE:
${kbList || "(belum ada)"}

INSTRUKSI KHUSUS DARI PEMILIK:
${settings.system_prompt}

FORMAT TOOL CALL (jika perlu):
- Untuk cek ongkir, balas DI AKHIR pesan dengan blok JSON: {"tool":"cek_ongkir","city":"<kota>","weight_grams":<gram>}
- Untuk buat order (setelah pelanggan setuju), balas DI AKHIR pesan dengan blok JSON: {"tool":"buat_order","customer_name":"...","customer_phone":"${customer_phone}","customer_address":"...","city":"...","product_summary":"...","total_amount":<angka>,"shipping_cost":<angka>,"courier":"..."}
- Jika tidak butuh tool, jangan tulis JSON apapun.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...orderedHistory.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    // 6. Panggil Gemini
    const aiResp = await fetch("/integrations/google-gemini-2-5-flash/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!aiResp.ok) {
      throw new Error(`AI error ${aiResp.status}`);
    }
    const aiJson = await aiResp.json();
    let aiText =
      aiJson.choices?.[0]?.message?.content ||
      "Maaf, saya sedang ada gangguan. Coba lagi sebentar ya kak.";

    // 7. Deteksi tool call
    let toolResult = null;
    const jsonMatch = aiText.match(/\{[\s\S]*"tool"[\s\S]*\}/);
    let cleanText = aiText;
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        cleanText = aiText.replace(jsonMatch[0], "").trim();

        if (parsed.tool === "cek_ongkir" && settings.shipping_enabled) {
          const shipResp = await fetch(
            `${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/api/shipping`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                destination_city: parsed.city,
                weight_grams: parsed.weight_grams || 1000,
              }),
            },
          );
          const shipData = await shipResp.json();
          toolResult = { type: "shipping", data: shipData };

          // Format hasil ongkir untuk pelanggan
          if (shipData.services) {
            const list = shipData.services
              .map(
                (s) =>
                  `• ${s.courier} ${s.service} - Rp ${s.cost.toLocaleString("id-ID")} (${s.etd})`,
              )
              .join("\n");
            cleanText += `\n\n📦 Ongkir ke ${parsed.city} (${shipData.weight_kg}kg):\n${list}\n\nMau pakai ekspedisi yang mana kak?`;
          }
        } else if (parsed.tool === "buat_order" && settings.closing_enabled) {
          const orderResp = await fetch(
            `${process.env.NEXT_PUBLIC_CREATE_APP_URL || ""}/api/orders`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parsed),
            },
          );
          const orderData = await orderResp.json();
          toolResult = { type: "order", data: orderData };
          if (orderData.item) {
            cleanText += `\n\n✅ Order berhasil dibuat!\nKode: *${orderData.item.order_code}*\nTotal: Rp ${Number(orderData.item.total_amount).toLocaleString("id-ID")}\n\nSilakan transfer ke rekening kami ya kak. Terima kasih! 🙏`;
          }
        }
      } catch (e) {
        console.error("Tool parse error:", e);
      }
    }

    // 8. Simpan balasan AI
    await sql`INSERT INTO messages (conversation_id, role, content) VALUES (${conversationId}, 'assistant', ${cleanText})`;
    await sql`UPDATE conversations SET last_message = ${cleanText}, last_role = 'assistant', updated_at = NOW() WHERE id = ${conversationId}`;

    return Response.json({
      reply: cleanText,
      conversation_id: conversationId,
      tool_result: toolResult,
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return Response.json(
      { error: "Gagal memproses chat: " + error.message },
      { status: 500 },
    );
  }
}
