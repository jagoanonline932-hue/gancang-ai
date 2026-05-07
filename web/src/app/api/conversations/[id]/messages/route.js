import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows =
      await sql`SELECT * FROM messages WHERE conversation_id = ${id} ORDER BY created_at ASC`;
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET messages error:", error);
    return Response.json({ error: "Gagal mengambil pesan" }, { status: 500 });
  }
}
