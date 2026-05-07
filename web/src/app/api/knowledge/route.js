import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM knowledge_base ORDER BY created_at DESC`;
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET /api/knowledge error:", error);
    return Response.json(
      { error: "Gagal mengambil knowledge base" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, category } = body;
    if (!title || !content) {
      return Response.json(
        { error: "Title dan content wajib" },
        { status: 400 },
      );
    }
    const inserted = await sql`
      INSERT INTO knowledge_base (title, content, category)
      VALUES (${title}, ${content}, ${category || "umum"})
      RETURNING *
    `;
    return Response.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/knowledge error:", error);
    return Response.json(
      { error: "Gagal menyimpan knowledge" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id wajib" }, { status: 400 });
    await sql`DELETE FROM knowledge_base WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/knowledge error:", error);
    return Response.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
