import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import useUpload from "../../../utils/useUpload";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Package,
} from "lucide-react";

export default function ProductsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    weight_grams: 500,
    stock: 0,
    image_url: "",
    video_url: "",
  });
  const [error, setError] = useState(null);
  const [upload, { loading: uploading }] = useUpload();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const r = await fetch("/api/products");
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
  });

  const addMut = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Gagal simpan");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setForm({
        name: "",
        description: "",
        price: "",
        weight_grams: 500,
        stock: 0,
        image_url: "",
        video_url: "",
      });
      setError(null);
    },
    onError: (e) => setError(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id) => {
      const r = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Gagal hapus");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url, error: upErr } = await upload({ file });
    if (upErr) {
      setError(upErr);
      return;
    }
    setForm((f) => ({ ...f, image_url: url }));
  }

  const items = data?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/products" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            <div className="text-xs font-medium text-gray-500">
              Workspace · Produk
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Katalog Produk
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Produk yang ditambahkan di sini akan dipakai AI saat menjelaskan
              produk dan menghitung ongkir.
            </p>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">
                Tambah Produk
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Lengkapi data produk untuk AI.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Hijab Pashmina Premium"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Bahan ceruti premium, tersedia 12 warna"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Harga (Rp)
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Berat (g)
                    </label>
                    <input
                      type="number"
                      value={form.weight_grams}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          weight_grams: Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Stok
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Foto Produk
                  </label>
                  <label className="mt-1 flex items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-3 text-sm text-gray-600 hover:border-gray-400 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    {uploading
                      ? "Mengunggah..."
                      : form.image_url
                        ? "Ganti foto"
                        : "Upload foto"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="mt-2 h-32 w-full object-cover rounded-md border border-gray-200"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Link Video (opsional)
                  </label>
                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) =>
                      setForm({ ...form, video_url: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>

                {error && <div className="text-xs text-red-600">{error}</div>}
                <button
                  type="button"
                  disabled={!form.name || addMut.isPending}
                  onClick={() => addMut.mutate(form)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {addMut.isPending ? "Menyimpan..." : "Tambah Produk"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Daftar Produk
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                    <Package className="h-3 w-3" />
                    {items.length} produk
                  </span>
                </div>
                <div className="divide-y divide-gray-200">
                  {isLoading && (
                    <div className="px-5 py-10 text-sm text-gray-500">
                      Memuat...
                    </div>
                  )}
                  {!isLoading && items.length === 0 && (
                    <div className="px-5 py-12 text-center text-sm text-gray-500">
                      Belum ada produk.
                    </div>
                  )}
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="px-5 py-4 flex items-start gap-3"
                    >
                      <div className="h-14 w-14 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {p.name}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                            stok {p.stock}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                            {p.weight_grams}g
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {p.description}
                        </p>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => delMut.mutate(p.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
