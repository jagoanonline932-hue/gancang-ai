import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let rows;
    if (status && status !== "all") {
      rows =
        await sql`SELECT * FROM transactions WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
    }

    const stats = await sql`
      SELECT
        COUNT(*)::int AS total,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS revenue,
        COUNT(*) FILTER (WHERE status = 'paid')::int AS paid_count,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending_count,
        COUNT(*) FILTER (WHERE status = 'failed')::int AS failed_count
      FROM transactions
    `;

    return Response.json({ items: rows, stats: stats[0] });
  } catch (error) {
    console.error("GET /api/billing/transactions error:", error);
    return Response.json(
      { error: "Gagal mengambil transaksi" },
      { status: 500 },
    );
  }
}
