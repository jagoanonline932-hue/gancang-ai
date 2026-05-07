import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, ArrowRight, ShieldCheck, Zap, Loader2, X } from "lucide-react";

function loadSnap(clientKey, isProd) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.snap) return resolve(window.snap);

    const script = document.createElement("script");
    script.src = isProd
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey || "");
    script.onload = () => resolve(window.snap);
    script.onerror = () => reject(new Error("Gagal load Midtrans Snap"));
    document.head.appendChild(script);
  });
}

export default function PricingPage() {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data: plansData, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const r = await fetch("/api/plans");
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
  });
  const plans = plansData?.items || [];

  async function handleCheckout() {
    if (!selected) return;
    if (!form.customer_name || !form.customer_email) {
      setError("Nama dan email wajib diisi");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const r = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_code: selected.code, ...form }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || "Gagal checkout");
      }
      const data = await r.json();

      if (data.demo_mode) {
        // Mode demo: arahkan langsung ke halaman finish
        window.location.href = `/billing/finish?order_id=${data.order_id}&demo=1`;
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
      const snap = await loadSnap(clientKey, !data.is_sandbox);

      snap.pay(data.snap_token, {
        onSuccess: () => {
          window.location.href = `/billing/finish?order_id=${data.order_id}&status=success`;
        },
        onPending: () => {
          window.location.href = `/billing/finish?order_id=${data.order_id}&status=pending`;
        },
        onError: (err) => {
          console.error(err);
          setError("Pembayaran gagal");
        },
        onClose: () => {
          setSubmitting(false);
        },
      });
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-inter text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Gancang AI</span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600">
            <a href="/#features" className="hover:text-gray-900">
              Fitur
            </a>
            <a href="/pricing" className="text-gray-900 font-medium">
              Harga
            </a>
            <a href="/dashboard/tutorial" className="hover:text-gray-900">
              Tutorial
            </a>
            <a href="/dashboard" className="hover:text-gray-900">
              Dashboard
            </a>
          </nav>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Mulai
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Pembayaran aman via Midtrans
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
            Harga jelas, tanpa biaya tersembunyi.
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Bayar bulanan, batalkan kapan saja. Semua paket sudah termasuk AI
            Customer Service yang menjawab 24 jam.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              <Zap className="h-3 w-3 text-blue-600" />
              Aktif &lt; 5 menit setelah bayar
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              VA · QRIS · Kartu Kredit · GoPay · ShopeePay
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          {isLoading && (
            <div className="text-center text-sm text-gray-500 py-10">
              Memuat paket...
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const features = Array.isArray(p.features) ? p.features : [];
              return (
                <div
                  key={p.code}
                  className={`rounded-xl border bg-white p-6 ${
                    p.is_featured ? "border-blue-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {p.name}
                    </span>
                    {p.is_featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                        Paling Populer
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold tracking-tight text-gray-900">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-gray-500">/bulan</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{p.description}</p>

                  <button
                    type="button"
                    onClick={() => setSelected(p)}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                      p.is_featured
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Pilih {p.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="mt-5 border-t border-gray-200 pt-4 space-y-1.5">
                    {features.map((f) => (
                      <div
                        key={f}
                        className="flex items-start text-sm text-gray-600 py-1"
                      >
                        <span className="text-gray-400 mr-2">-</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            FAQ Pembayaran
          </h2>
          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            {[
              {
                q: "Metode pembayaran apa saja?",
                a: "Semua metode yang didukung Midtrans: VA (BCA, BRI, Mandiri, BNI), QRIS, Kartu Kredit, GoPay, ShopeePay, dan Indomaret.",
              },
              {
                q: "Apakah ada free trial?",
                a: "Ya, kamu bisa coba dashboard dan AI Playground gratis sebelum membayar.",
              },
              {
                q: "Bisa upgrade/downgrade kapan saja?",
                a: "Bisa. Kelebihan biaya akan diprorata otomatis di siklus berikutnya.",
              },
              {
                q: "Aman tidak?",
                a: "Pembayaran ditangani 100% oleh Midtrans (PCI DSS Level 1). Kami tidak menyimpan data kartu kamu.",
              },
            ].map((f) => (
              <div key={f.q} className="py-4">
                <div className="text-sm font-semibold text-gray-900">{f.q}</div>
                <div className="mt-1 text-sm text-gray-600">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <div className="text-xs font-medium text-gray-500">
                  Checkout
                </div>
                <div className="text-base font-semibold text-gray-900">
                  Paket {selected.name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-md hover:bg-gray-50"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {selected.name} · bulanan
                  </div>
                  <div className="text-xs text-gray-500">
                    {selected.description}
                  </div>
                </div>
                <div className="text-base font-semibold text-gray-900">
                  Rp {Number(selected.price).toLocaleString("id-ID")}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    placeholder="Andi Pratama"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) =>
                      setForm({ ...form, customer_email: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="andi@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    No HP / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={form.customer_phone}
                    onChange={(e) =>
                      setForm({ ...form, customer_phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="08123456789"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-3 text-xs text-red-600">{error}</div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={submitting}
                className="mt-5 w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {submitting
                  ? "Memproses..."
                  : `Bayar Rp ${Number(selected.price).toLocaleString("id-ID")}`}
              </button>

              <div className="mt-3 text-[11px] text-gray-500 text-center">
                Pembayaran diproses oleh Midtrans. Dengan melanjutkan, kamu
                menyetujui Syarat & Kebijakan Privasi Gancang AI.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
