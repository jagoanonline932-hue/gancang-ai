import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let rows;
    if (status && status !== "all") {
      rows =
        await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
    }
    return Response.json({ items: rows });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return Response.json({ error: "Gagal mengambil orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      customer_address,
      city,
      product_summary,
      total_amount,
      shipping_cost,
      courier,
    } = body;

    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !product_summary
    ) {
      return Response.json(
        { error: "Data order tidak lengkap" },
        { status: 400 },
      );
    }

    const orderCode = `ORD-${Date.now().toString().slice(-8)}`;

    const inserted = await sql`
      INSERT INTO orders (order_code, customer_name, customer_phone, customer_address, city, product_summary, total_amount, shipping_cost, courier)
      VALUES (${orderCode}, ${customer_name}, ${customer_phone}, ${customer_address}, ${city || ""}, ${product_summary}, ${total_amount || 0}, ${shipping_cost || 0}, ${courier || ""})
      RETURNING *
    `;
    return Response.json({ item: inserted[0] });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ error: "Gagal menyimpan order" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) return Response.json({ error: "id wajib" }, { status: 400 });
    const updated =
      await sql`UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *`;
    return Response.json({ item: updated[0] });
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return Response.json({ error: "Gagal update order" }, { status: 500 });
  }
}
