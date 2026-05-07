import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM conversations ORDER BY updated_at DESC`;
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET /api/conversations error:", error);
    return Response.json({ error: "Gagal mengambil chat" }, { status: 500 });
  }
}
