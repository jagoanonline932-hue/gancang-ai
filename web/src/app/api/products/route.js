import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return Response.json({ error: "Gagal mengambil produk" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      weight_grams,
      image_url,
      video_url,
      stock,
    } = body;
    if (!name)
      return Response.json({ error: "Nama produk wajib" }, { status: 400 });
    const inserted = await sql`
      INSERT INTO products (name, description, price, weight_grams, image_url, video_url, stock)
      VALUES (${name}, ${description || ""}, ${price || 0}, ${weight_grams || 500}, ${image_url || null}, ${video_url || null}, ${stock || 0})
      RETURNING *
    `;
    return Response.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return Response.json({ error: "Gagal menyimpan produk" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id wajib" }, { status: 400 });
    await sql`DELETE FROM products WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return Response.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
