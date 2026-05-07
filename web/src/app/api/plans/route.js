import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM plans WHERE is_active = true ORDER BY price ASC`;
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET /api/plans error:", error);
    return Response.json({ error: "Gagal mengambil paket" }, { status: 500 });
  }
}
