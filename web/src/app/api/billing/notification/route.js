import sql from "@/app/api/utils/sql";
import crypto from "crypto";

// Webhook Midtrans (server-to-server notification)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      payment_type,
      fraud_status,
    } = body;

    if (!order_id) {
      return Response.json({ error: "order_id wajib" }, { status: 400 });
    }

    // Verifikasi signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (serverKey && signature_key) {
      const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const expected = crypto.createHash("sha512").update(raw).digest("hex");
      if (expected !== signature_key) {
        console.error("Invalid Midtrans signature");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Tentukan status final
    let finalStatus = "pending";
    if (transaction_status === "capture") {
      finalStatus = fraud_status === "challenge" ? "challenge" : "paid";
    } else if (transaction_status === "settlement") {
      finalStatus = "paid";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      finalStatus = "failed";
    } else if (transaction_status === "pending") {
      finalStatus = "pending";
    }

    // Update transaction
    const txRows = await sql`
      UPDATE transactions
      SET status = ${finalStatus},
          payment_method = ${payment_type || null},
          midtrans_response = ${JSON.stringify(body)},
          paid_at = ${finalStatus === "paid" ? new Date().toISOString() : null}
      WHERE order_id = ${order_id}
      RETURNING *
    `;

    if (txRows.length === 0) {
      return Response.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }

    const tx = txRows[0];

    // Aktifkan subscription kalau paid
    if (finalStatus === "paid" && tx.subscription_id) {
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);

      await sql`
        UPDATE subscriptions
        SET status = 'active',
            starts_at = ${start.toISOString()},
            ends_at = ${end.toISOString()}
        WHERE id = ${tx.subscription_id}
      `;
    }

    return Response.json({ success: true, status: finalStatus });
  } catch (error) {
    console.error("POST /api/billing/notification error:", error);
    return Response.json(
      { error: "Gagal proses notifikasi: " + error.message },
      { status: 500 },
    );
  }
}
