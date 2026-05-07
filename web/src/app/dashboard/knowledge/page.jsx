import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import { Plus, Trash2, BookMarked } from "lucide-react";

const CATEGORIES = [
  "umum",
  "produk",
  "pembayaran",
  "pengiriman",
  "retur",
  "promo",
];

export default function KnowledgePage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "umum",
  });
  const [error, setError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["knowledge"],
    queryFn: async () => {
      const r = await fetch("/api/knowledge");
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
  });

  const addMut = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Gagal simpan");
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["knowledge"] });
      setForm({ title: "", content: "", category: "umum" });
      setError(null);
    },
    onError: (e) => setError(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id) => {
      const r = await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Gagal hapus");
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge"] }),
  });

  const items = data?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/knowledge" />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            <div className="text-xs font-medium text-gray-500">
              Workspace · Knowledge Base
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              AI Knowledge Base
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Tambahkan informasi bisnis (FAQ, kebijakan, info produk) supaya AI
              bisa menjawab dengan akurat.
            </p>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            {/* Form */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-1">
              <h2 className="text-base font-semibold text-gray-900">
                Tambah Knowledge
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tulis informasi singkat dan jelas.
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Contoh: Jam Operasional"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Kategori
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm({ ...form, category: c })}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          form.category === c
                            ? "bg-blue-50 text-blue-600"
                            : "border border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Isi
                  </label>
                  <textarea
                    rows={5}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Toko buka setiap hari jam 08.00 - 21.00 WIB."
                  />
                </div>
                {error && <div className="text-xs text-red-600">{error}</div>}
                <button
                  type="button"
                  disabled={!form.title || !form.content || addMut.isPending}
                  onClick={() => addMut.mutate(form)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {addMut.isPending ? "Menyimpan..." : "Tambah"}
                </button>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Daftar Knowledge
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                    <BookMarked className="h-3 w-3" />
                    {items.length} entri
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
                      Belum ada knowledge. Tambah dari form di samping.
                    </div>
                  )}
                  {items.map((it) => (
                    <div key={it.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                              {it.category}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {it.title}
                            </h3>
                          </div>
                          <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                            {it.content}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => delMut.mutate(it.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
