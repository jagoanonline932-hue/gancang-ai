import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql`
      SELECT t.*, s.starts_at, s.ends_at, s.status AS subscription_status
      FROM transactions t
      LEFT JOIN subscriptions s ON s.id = t.subscription_id
      WHERE t.order_id = ${id} OR t.id::text = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) {
      return Response.json(
        { error: "Transaksi tidak ditemukan" },
        { status: 404 },
      );
    }
    return Response.json({ item: rows[0] });
  } catch (error) {
    console.error("GET transaction error:", error);
    return Response.json(
      { error: "Gagal mengambil transaksi" },
      { status: 500 },
    );
  }
}
