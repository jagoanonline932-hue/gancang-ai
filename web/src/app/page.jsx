import {
  Bot,
  MessageSquare,
  Truck,
  Languages,
  ImageIcon,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  BookOpen,
} from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Cek Ongkir Otomatis",
    desc: "AI hitung ongkir ekspedisi domestik (JNE, J&T, SiCepat, AnterAja, POS) dari kota tujuan pelanggan.",
  },
  {
    icon: MessageSquare,
    title: "Paham Maksud Pelanggan",
    desc: "Memahami konteks percakapan, mengingat pesan sebelumnya, dan menjawab natural seperti CS manusia.",
  },
  {
    icon: ImageIcon,
    title: "Kirim Foto & Video Produk",
    desc: "Tampilkan katalog lengkap dengan media langsung di chat saat pelanggan bertanya soal produk.",
  },
  {
    icon: Languages,
    title: "Multi-Bahasa Otomatis",
    desc: "Mengikuti bahasa pelanggan: Indonesia, Jawa, Sunda, English, hingga 50+ bahasa lainnya.",
  },
  {
    icon: ClipboardList,
    title: "Form Order Otomatis",
    desc: "AI mengumpulkan data order, konfirmasi total + ongkir, lalu membuat orderan tanpa diminta.",
  },
  {
    icon: Sparkles,
    title: "Auto Rekap Orderan",
    desc: "Setiap order tercatat otomatis di dashboard. Pantau status, ekspor data, follow up tinggal klik.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Setting Agent",
    desc: "Atur nama agent, tone, dan upload Knowledge Base bisnis kamu dengan mudah.",
  },
  {
    num: "02",
    title: "Chat Masuk",
    desc: "AI siap merespon leads yang masuk melalui WhatsApp 24 jam tanpa istirahat.",
  },
  {
    num: "03",
    title: "AI Jawab Otomatis",
    desc: "AI menjawab pertanyaan, jelaskan produk, cek ongkir, hingga follow up calon pembeli.",
  },
  {
    num: "04",
    title: "Closing Order",
    desc: "AI mengkonfirmasi setiap pesanan secara otomatis dan menyimpan ke database.",
  },
  {
    num: "05",
    title: "Rekap Otomatis",
    desc: "Tanpa rekap manual. Semua orderan masuk ke dashboard real-time.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Rp 149rb",
    period: "/bulan",
    desc: "Cocok untuk UMKM yang baru mulai jualan online.",
    features: [
      "1 nomor WhatsApp",
      "500 chat/bulan",
      "AI auto-reply",
      "Cek ongkir domestik",
      "Rekap order dasar",
    ],
    cta: "Mulai Starter",
    highlighted: false,
  },
  {
    name: "Business",
    price: "Rp 399rb",
    period: "/bulan",
    desc: "Untuk toko aktif dengan volume chat tinggi.",
    features: [
      "3 nomor WhatsApp",
      "5,000 chat/bulan",
      "Knowledge Base unlimited",
      "Multi-bahasa",
      "Form order otomatis",
      "Foto & video produk",
    ],
    cta: "Pilih Business",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Rp 999rb",
    period: "/bulan",
    desc: "Untuk brand & agency dengan kebutuhan kustom.",
    features: [
      "Unlimited WhatsApp",
      "Unlimited chat",
      "Custom AI training",
      "API access",
      "Dedicated support",
      "SLA 99.9%",
    ],
    cta: "Hubungi Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
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
            <a
              href="#features"
              className="hover:text-gray-900 transition-colors"
            >
              Fitur
            </a>
            <a href="#how" className="hover:text-gray-900 transition-colors">
              Cara Kerja
            </a>
            <a
              href="/pricing"
              className="hover:text-gray-900 transition-colors"
            >
              Harga
            </a>
            <a
              href="/dashboard/tutorial"
              className="hover:text-gray-900 transition-colors"
            >
              Tutorial
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Login
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Mulai Gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                <Sparkles className="h-3.5 w-3.5" />
                Baru · AI Closing Otomatis
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.05]">
                WhatsApp Chatbot AI <br />
                untuk Customer Service <br />
                <span className="text-blue-600">yang menjual sendiri.</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
                Gancang AI menangani chat masuk 24 jam: jawab pertanyaan,
                jelaskan produk, hitung ongkir, hingga membuat orderan secara
                otomatis. Tanpa rekap manual.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  Coba Demo Dashboard
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Lihat Harga & Tutorial
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  500+ UMKM aktif
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                  <ShieldCheck className="h-3 w-3 text-blue-600" />
                  Data terenkripsi
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                  <Zap className="h-3 w-3 text-blue-600" />
                  Setup &lt; 10 menit
                </span>
              </div>
            </div>

            {/* Hero mock chat */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                      G
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        Gancang · AI Agent
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{" "}
                        Online
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Health 98%
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-blue-600 text-white px-3.5 py-2 text-sm max-w-[85%]">
                      Kak ongkir ke Surabaya berapa ya?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 max-w-[85%]">
                      Halo kak! Untuk berat ±1kg ke Surabaya:
                      <div className="mt-1.5 text-xs text-gray-600">
                        <div>• JNE Reguler — Rp 18.000 (2-3 hari)</div>
                        <div>• J&T Reguler — Rp 17.000 (2-3 hari)</div>
                        <div>• SiCepat Reguler — Rp 16.000 (2-3 hari)</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-blue-600 text-white px-3.5 py-2 text-sm max-w-[85%]">
                      Pakai SiCepat aja, langsung order ya
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-800 max-w-[85%]">
                      Siap kak ✅ Order ORD-48291 sudah dibuat. Total Rp
                      207.000. Ditunggu transfernya ya 🙏
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
              Fitur Inti
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Semua yang dibutuhkan tim CS modern, dijalankan AI.
            </h2>
            <p className="mt-3 text-gray-600">
              Gancang AI bukan sekadar auto-reply. AI memahami konteks, menjual
              produk, dan menyelesaikan order tanpa intervensi.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="h-9 w-9 rounded-md bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
              Cara Kerja
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Lima langkah dari chat masuk ke order rampung.
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="text-xs font-medium text-gray-500">{s.num}</div>
                <div className="mt-2 text-base font-semibold text-gray-900">
                  {s.title}
                </div>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
              Harga
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Pilihan paket transparan, tanpa biaya tersembunyi.
            </h2>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border bg-white p-6 ${
                  p.highlighted ? "border-blue-600" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {p.name}
                  </span>
                  {p.highlighted && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                      Paling Populer
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-gray-900">
                    {p.price}
                  </span>
                  <span className="text-sm text-gray-500">{p.period}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{p.desc}</p>

                <a
                  href="/pricing"
                  className={`mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                    p.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {p.cta}
                </a>

                <div className="mt-5 border-t border-gray-200 pt-4 space-y-1.5">
                  {p.features.map((f) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 sm:px-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Siap punya tim CS yang tidak pernah tidur?
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Aktifkan Gancang AI dalam 10 menit. Tidak perlu coding, tidak
              perlu server sendiri.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Pilih Paket
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/dashboard/tutorial"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
              >
                Baca Cara Pasang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-900">
              Gancang AI
            </span>
            <span className="text-xs text-gray-500">© 2026</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="hover:text-gray-900">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
