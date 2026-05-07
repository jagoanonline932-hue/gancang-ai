import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM ai_settings ORDER BY id ASC LIMIT 1`;
    if (rows.length === 0) {
      const inserted = await sql`
        INSERT INTO ai_settings (agent_name, business_name, system_prompt)
        VALUES ('Sari', 'Toko Saya', 'Kamu adalah customer service yang ramah dan informatif.')
        RETURNING *
      `;
      return Response.json({ settings: inserted[0] });
    }
    return Response.json({ settings: rows[0] });
  } catch (error) {
    console.error("GET /api/ai-settings error:", error);
    return Response.json(
      { error: "Gagal mengambil pengaturan" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fields = [
      "agent_name",
      "business_name",
      "tone",
      "language",
      "system_prompt",
      "greeting_message",
      "closing_enabled",
      "shipping_enabled",
    ];

    const setClauses = [];
    const values = [];
    let i = 1;

    for (const f of fields) {
      if (body[f] !== undefined) {
        setClauses.push(`${f} = $${i}`);
        values.push(body[f]);
        i++;
      }
    }

    if (setClauses.length === 0) {
      return Response.json(
        { error: "Tidak ada field yang diupdate" },
        { status: 400 },
      );
    }

    setClauses.push(`updated_at = NOW()`);

    const existing =
      await sql`SELECT id FROM ai_settings ORDER BY id ASC LIMIT 1`;
    if (existing.length === 0) {
      const inserted = await sql`
        INSERT INTO ai_settings (agent_name, business_name, system_prompt)
        VALUES (${body.agent_name || "Sari"}, ${body.business_name || "Toko Saya"}, ${body.system_prompt || ""})
        RETURNING *
      `;
      return Response.json({ settings: inserted[0] });
    }

    const id = existing[0].id;
    const query = `UPDATE ai_settings SET ${setClauses.join(", ")} WHERE id = $${i} RETURNING *`;
    values.push(id);
    const updated = await sql(query, values);

    return Response.json({ settings: updated[0] });
  } catch (error) {
    console.error("POST /api/ai-settings error:", error);
    return Response.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 },
    );
  }
}
