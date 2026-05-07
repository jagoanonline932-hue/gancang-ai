import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import { ShoppingBag, Phone, MapPin } from "lucide-react";

const STATUSES = [
  { id: "all", label: "Semua" },
  { id: "baru", label: "Baru" },
  { id: "diproses", label: "Diproses" },
  { id: "dikirim", label: "Dikirim" },
  { id: "selesai", label: "Selesai" },
  { id: "batal", label: "Batal" },
];

const STATUS_COLOR = {
  baru: "bg-orange-500",
  diproses: "bg-blue-500",
  dikirim: "bg-purple-500",
  selesai: "bg-green-500",
  batal: "bg-gray-400",
};

export default function OrdersPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["orders", status],
    queryFn: async () => {
      const r = await fetch(`/api/orders?status=${status}`);
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
  });

  const mut = useMutation({
    mutationFn: async ({ id, status }) => {
      const r = await fetch(`/api/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw new Error("Gagal update");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });

  const items = data?.items || [];
  const totalRevenue = items.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/orders" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Workspace · Rekap Order
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Auto Rekap Orderan
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Pesanan direkap otomatis oleh AI dan bisa dipantau kapan saja.
                Tanpa rekap manual.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                <ShoppingBag className="h-3 w-3" />
                {items.length} order
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                Total Rp {totalRevenue.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-5">
              {STATUSES.map((s) => {
                const isActive = status === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStatus(s.id)}
                    className={`text-sm pb-3 -mb-[1px] border-b-2 transition-colors ${
                      isActive
                        ? "text-gray-900 font-medium border-blue-600"
                        : "text-gray-500 font-normal border-transparent hover:text-gray-700"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500">
                    <th className="px-5 py-3">Kode</th>
                    <th className="px-5 py-3">Pelanggan</th>
                    <th className="px-5 py-3">Produk</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Kurir</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-10 text-center text-sm text-gray-500"
                      >
                        Memuat...
                      </td>
                    </tr>
                  )}
                  {!isLoading && items.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-gray-500"
                      >
                        Belum ada order pada filter ini.
                      </td>
                    </tr>
                  )}
                  {items.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {o.order_code}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">
                          {o.customer_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {o.customer_phone}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {o.city || "-"}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-700 max-w-xs truncate">
                        {o.product_summary}
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        Rp {Number(o.total_amount).toLocaleString("id-ID")}
                        <div className="text-xs text-gray-500 font-normal">
                          + ongkir Rp{" "}
                          {Number(o.shipping_cost).toLocaleString("id-ID")}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                          {o.courier || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[o.status] || "bg-gray-400"}`}
                          />
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            mut.mutate({ id: o.id, status: e.target.value })
                          }
                          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                        >
                          {STATUSES.filter((s) => s.id !== "all").map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
