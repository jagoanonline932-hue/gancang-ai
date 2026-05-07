import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const [orders, convos, products, kb] = await sql.transaction([
      sql`SELECT COUNT(*)::int AS total, COALESCE(SUM(total_amount),0)::float AS revenue FROM orders`,
      sql`SELECT COUNT(*)::int AS total FROM conversations`,
      sql`SELECT COUNT(*)::int AS total FROM products`,
      sql`SELECT COUNT(*)::int AS total FROM knowledge_base`,
    ]);

    const today =
      await sql`SELECT COUNT(*)::int AS total FROM orders WHERE created_at::date = CURRENT_DATE`;
    const pending =
      await sql`SELECT COUNT(*)::int AS total FROM orders WHERE status = 'baru'`;

    return Response.json({
      orders_total: orders[0].total,
      revenue: orders[0].revenue,
      orders_today: today[0].total,
      orders_pending: pending[0].total,
      conversations: convos[0].total,
      products: products[0].total,
      knowledge: kb[0].total,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return Response.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 },
    );
  }
}
