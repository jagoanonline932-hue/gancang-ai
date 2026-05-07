import sql from "@/app/api/utils/sql";

// Buat transaksi + dapatkan Snap Token Midtrans
export async function POST(request) {
  try {
    const body = await request.json();
    const { plan_code, customer_name, customer_email, customer_phone } = body;

    if (!plan_code || !customer_name || !customer_email) {
      return Response.json(
        { error: "plan_code, customer_name, dan customer_email wajib" },
        { status: 400 },
      );
    }

    const planRows =
      await sql`SELECT * FROM plans WHERE code = ${plan_code} AND is_active = true LIMIT 1`;
    if (planRows.length === 0) {
      return Response.json({ error: "Paket tidak ditemukan" }, { status: 404 });
    }
    const plan = planRows[0];

    const orderId = `GAI-${plan_code.toUpperCase()}-${Date.now()}`;

    // Insert subscription (pending) & transaction
    const subRows = await sql`
      INSERT INTO subscriptions (plan_code, plan_name, customer_name, customer_email, customer_phone, status)
      VALUES (${plan.code}, ${plan.name}, ${customer_name}, ${customer_email}, ${customer_phone || ""}, 'pending')
      RETURNING *
    `;
    const subscription = subRows[0];

    const txRows = await sql`
      INSERT INTO transactions (order_id, subscription_id, plan_code, plan_name, customer_name, customer_email, customer_phone, amount, status)
      VALUES (${orderId}, ${subscription.id}, ${plan.code}, ${plan.name}, ${customer_name}, ${customer_email}, ${customer_phone || ""}, ${plan.price}, 'pending')
      RETURNING *
    `;
    const transaction = txRows[0];

    // Panggil Midtrans Snap
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const baseUrl = isProd
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    let snapToken = null;
    let redirectUrl = null;
    let midtransResp = null;

    if (serverKey) {
      const auth = Buffer.from(`${serverKey}:`).toString("base64");
      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Number(plan.price),
        },
        item_details: [
          {
            id: plan.code,
            price: Number(plan.price),
            quantity: 1,
            name: `Gancang AI - ${plan.name}`,
            category: "Subscription",
          },
        ],
        customer_details: {
          first_name: customer_name,
          email: customer_email,
          phone: customer_phone || "",
        },
        credit_card: { secure: true },
      };

      const resp = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(payload),
      });

      midtransResp = await resp.json();
      if (!resp.ok) {
        console.error("Midtrans error:", midtransResp);
        return Response.json(
          { error: "Gagal membuat transaksi Midtrans", details: midtransResp },
          { status: 500 },
        );
      }
      snapToken = midtransResp.token;
      redirectUrl = midtransResp.redirect_url;

      await sql`
        UPDATE transactions
        SET snap_token = ${snapToken}, midtrans_response = ${JSON.stringify(midtransResp)}
        WHERE id = ${transaction.id}
      `;
    } else {
      // Mode demo: tidak ada server key Midtrans
      midtransResp = {
        demo: true,
        message: "MIDTRANS_SERVER_KEY belum di-set",
      };
    }

    return Response.json({
      order_id: orderId,
      transaction_id: transaction.id,
      subscription_id: subscription.id,
      amount: Number(plan.price),
      plan: { code: plan.code, name: plan.name },
      snap_token: snapToken,
      redirect_url: redirectUrl,
      is_sandbox: !isProd,
      demo_mode: !serverKey,
    });
  } catch (error) {
    console.error("POST /api/billing/checkout error:", error);
    return Response.json(
      { error: "Gagal memproses checkout: " + error.message },
      { status: 500 },
    );
  }
}
