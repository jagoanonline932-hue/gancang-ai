import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import { Bot, Save, Sparkles } from "lucide-react";

const TONES = [
  { id: "ramah", label: "Ramah & santai" },
  { id: "profesional", label: "Profesional" },
  { id: "energik", label: "Energik" },
  { id: "informatif", label: "Informatif" },
];

const LANGUAGES = [
  { id: "auto", label: "Auto (ikuti pelanggan)" },
  { id: "id", label: "Bahasa Indonesia" },
  { id: "en", label: "English" },
  { id: "jw", label: "Bahasa Jawa" },
  { id: "su", label: "Bahasa Sunda" },
];

export default function AgentSettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["ai-settings"],
    queryFn: async () => {
      const r = await fetch("/api/ai-settings");
      if (!r.ok) throw new Error("Gagal load settings");
      return r.json();
    },
  });

  useEffect(() => {
    if (data?.settings && !form) setForm(data.settings);
  }, [data, form]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch("/api/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Gagal simpan");
      return r.json();
    },
    onSuccess: (resp) => {
      setSaved(true);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["ai-settings"] });
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (e) => {
      setError(e.message || "Gagal menyimpan");
    },
  });

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  if (isLoading || !form) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter flex">
        <Sidebar active="/dashboard/agent" />
        <main className="flex-1 px-6 py-10 text-sm text-gray-500">
          Memuat...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/agent" />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            <div className="text-xs font-medium text-gray-500">
              Workspace · Setting Agent
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Pengaturan AI Agent
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Atur Customer Service AI dan AI Knowledge Base dengan mudah.
              Pengaturan ini akan diikuti oleh AI saat membalas chat.
            </p>
          </div>

          <div className="mt-6 grid lg:grid-cols-3 gap-4">
            {/* Form */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Identitas Agent
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Bagaimana AI memperkenalkan dirinya ke pelanggan.
                </p>

                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Nama Agent
                    </label>
                    <input
                      type="text"
                      value={form.agent_name || ""}
                      onChange={(e) => update("agent_name", e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      placeholder="Sari"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Nama Bisnis
                    </label>
                    <input
                      type="text"
                      value={form.business_name || ""}
                      onChange={(e) => update("business_name", e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      placeholder="Nuansa Store"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-500">
                    Pesan Sambutan
                  </label>
                  <input
                    type="text"
                    value={form.greeting_message || ""}
                    onChange={(e) => update("greeting_message", e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Karakter & Bahasa
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tone dan bahasa default saat membalas pelanggan.
                </p>

                <div className="mt-5">
                  <label className="text-xs font-medium text-gray-500">
                    Tone
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => update("tone", t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          form.tone === t.id
                            ? "bg-blue-50 text-blue-600"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-xs font-medium text-gray-500">
                    Bahasa
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => update("language", l.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          form.language === l.id
                            ? "bg-blue-50 text-blue-600"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Instruksi Khusus (System Prompt)
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Aturan main AI. Contoh: gaya bicara, hal yang tidak boleh
                      dijawab, panduan upselling.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <Sparkles className="h-3 w-3" />
                    AI rules
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={form.system_prompt || ""}
                  onChange={(e) => update("system_prompt", e.target.value)}
                  className="mt-4 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  placeholder="Contoh: Selalu balas dengan ramah, gunakan emoji secukupnya. Tawarkan promo bundling jika pelanggan beli >1 item. Jangan berikan diskon di luar yang sudah ditentukan."
                />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Kemampuan
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Aktifkan tool yang bisa dipakai AI.
                </p>

                <div className="mt-4 divide-y divide-gray-200">
                  <label className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Cek Ongkir Otomatis
                      </div>
                      <div className="text-xs text-gray-500">
                        AI hitung ongkir ekspedisi domestik saat pelanggan
                        tanya.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!form.shipping_enabled}
                      onChange={(e) =>
                        update("shipping_enabled", e.target.checked)
                      }
                      className="h-4 w-4 accent-blue-600"
                    />
                  </label>
                  <label className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Closing Order Otomatis
                      </div>
                      <div className="text-xs text-gray-500">
                        AI buat orderan setelah pelanggan konfirmasi.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!form.closing_enabled}
                      onChange={(e) =>
                        update("closing_enabled", e.target.checked)
                      }
                      className="h-4 w-4 accent-blue-600"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                {saved && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Tersimpan
                  </span>
                )}
                {error && <span className="text-xs text-red-600">{error}</span>}
                <button
                  type="button"
                  onClick={() => mutation.mutate(form)}
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {mutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </div>

            {/* Preview card */}
            <div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Preview
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    live
                  </span>
                </div>

                <div className="mt-4 rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {form.agent_name || "Agent"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {form.business_name || "Bisnis"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800">
                    {form.greeting_message || "Halo!"}
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-gray-600">
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Tone:{" "}
                    {form.tone}
                  </div>
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Bahasa:{" "}
                    {form.language}
                  </div>
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Cek ongkir:{" "}
                    {form.shipping_enabled ? "aktif" : "nonaktif"}
                  </div>
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Auto closing:{" "}
                    {form.closing_enabled ? "aktif" : "nonaktif"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
