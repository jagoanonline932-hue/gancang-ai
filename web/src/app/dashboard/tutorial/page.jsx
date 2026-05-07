import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import {
  BookOpen,
  Bot,
  BookMarked,
  Package,
  MessageSquare,
  Smartphone,
  Server,
  Code2,
  ShieldCheck,
  Copy,
  Check,
} from "lucide-react";

const TABS = [
  { id: "intro", label: "Pengantar" },
  { id: "setup", label: "Pasang & Setup" },
  { id: "ai", label: "Atur AI" },
  { id: "wa", label: "Hubungkan WhatsApp" },
  { id: "test", label: "Tes & Live" },
  { id: "billing", label: "Billing" },
  { id: "api", label: "API Reference" },
];

function CodeBlock({ children, label }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-3 py-1.5">
        <span className="text-[11px] font-medium text-gray-500">
          {label || "shell"}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 hover:border-gray-300"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs text-gray-800 overflow-x-auto font-mono leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function Step({ num, title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
          {num}
        </span>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="mt-3 text-sm text-gray-600 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function TutorialPage() {
  const [tab, setTab] = useState("intro");

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/tutorial" />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            <div className="text-xs font-medium text-gray-500">
              Workspace · Tutorial
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Tutorial Cara Pasang Gancang AI
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Panduan lengkap dari setup awal sampai AI siap melayani pelanggan
              WhatsApp.
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-5">
              {TABS.map((t) => {
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`text-sm pb-3 -mb-[1px] border-b-2 transition-colors ${
                      isActive
                        ? "text-gray-900 font-medium border-blue-600"
                        : "text-gray-500 font-normal border-transparent hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {tab === "intro" && (
              <>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                      <BookOpen className="h-3 w-3" />
                      Mulai dari sini
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Apa itu Gancang AI?
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Gancang AI adalah platform AI Customer Service untuk
                    WhatsApp. Kamu bisa atur agent, knowledge base, dan produk
                    dari dashboard ini. Semua chat masuk akan dijawab AI secara
                    otomatis sesuai pengaturan.
                  </p>

                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-md border border-gray-200 p-4">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="mt-2 text-sm font-semibold text-gray-900">
                        Pengaturan AI di webapp
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Tone, bahasa, knowledge base, dan produk semuanya diatur
                        dari sini.
                      </p>
                    </div>
                    <div className="rounded-md border border-gray-200 p-4">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      <div className="mt-2 text-sm font-semibold text-gray-900">
                        Anti script JS pelanggan
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        AI hanya mengikuti pengaturan kamu. Pelanggan tidak bisa
                        override perilaku AI.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Yang dibutuhkan
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="py-1">
                        <span className="text-gray-400 mr-2">-</span>Akun
                        Gancang AI (sudah aktif)
                      </div>
                      <div className="py-1">
                        <span className="text-gray-400 mr-2">-</span>Nomor
                        WhatsApp Business
                      </div>
                      <div className="py-1">
                        <span className="text-gray-400 mr-2">-</span>Akses
                        dashboard ini
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "setup" && (
              <>
                <Step num="1" title="Buka Setting Agent">
                  <p>
                    Masuk ke menu{" "}
                    <a
                      href="/dashboard/agent"
                      className="text-blue-600 hover:underline"
                    >
                      Setting Agent
                    </a>
                    . Isi nama agent (misal: <em>Sari</em>), nama bisnis, pesan
                    sambutan, dan pilih tone.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                      <Bot className="h-3 w-3" /> Identitas AI
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                      Tone & Bahasa
                    </span>
                  </div>
                </Step>

                <Step num="2" title="Tambah Knowledge Base">
                  <p>
                    Buka{" "}
                    <a
                      href="/dashboard/knowledge"
                      className="text-blue-600 hover:underline"
                    >
                      Knowledge Base
                    </a>
                    . Tambahkan info penting bisnis: jam operasional, metode
                    pembayaran, kebijakan retur, FAQ.
                  </p>
                  <p>Semakin lengkap knowledge, semakin akurat jawaban AI.</p>
                </Step>

                <Step num="3" title="Upload Produk">
                  <p>
                    Buka{" "}
                    <a
                      href="/dashboard/products"
                      className="text-blue-600 hover:underline"
                    >
                      Produk
                    </a>
                    . Tambahkan nama, harga, berat (untuk hitung ongkir), stok,
                    dan foto produk.
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Nama wajib
                      diisi
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Berat dipakai
                      untuk kalkulasi ongkir
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Foto bisa
                      langsung dikirim AI ke pelanggan
                    </div>
                  </div>
                </Step>

                <Step num="4" title="Tes di AI Playground">
                  <p>
                    Sebelum live, simulasikan chat di{" "}
                    <a
                      href="/dashboard/playground"
                      className="text-blue-600 hover:underline"
                    >
                      AI Playground
                    </a>
                    . Coba tanya soal produk, ongkir, dan order untuk memastikan
                    AI menjawab dengan benar.
                  </p>
                </Step>
              </>
            )}

            {tab === "ai" && (
              <>
                <Step num="1" title="Pilih tone yang sesuai brand">
                  <p>Tone menentukan gaya bicara AI ke pelanggan:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>
                      <b>Ramah</b>: cocok untuk fashion, F&amp;B, beauty
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>
                      <b>Profesional</b>: cocok untuk B2B, jasa, klinik
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>
                      <b>Energik</b>: cocok untuk anak muda, sport, gaming
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>
                      <b>Informatif</b>: cocok untuk teknologi, edukasi
                    </div>
                  </div>
                </Step>

                <Step num="2" title="Tulis Instruksi Khusus (System Prompt)">
                  <p>Ini adalah aturan main AI. Contoh instruksi:</p>
                  <CodeBlock label="system prompt">{`Selalu balas dengan ramah, gunakan emoji secukupnya.
Tawarkan promo bundling jika pelanggan beli >1 item.
Jangan berikan diskon di luar yang sudah ditentukan.
Jika pelanggan minta refund, arahkan untuk hubungi admin manusia.`}</CodeBlock>
                </Step>

                <Step num="3" title="Aktifkan Cek Ongkir & Closing Otomatis">
                  <p>
                    Toggle <b>Cek Ongkir</b> agar AI bisa menghitung ongkir
                    domestik (JNE, J&amp;T, SiCepat, AnterAja, POS) saat
                    pelanggan tanya. Toggle <b>Closing Order</b> agar AI bisa
                    langsung membuat orderan setelah pelanggan setuju.
                  </p>
                </Step>

                <Step num="4" title="Anti Script JS pelanggan">
                  <p>
                    AI hanya mengikuti pengaturan kamu di dashboard ini. Pesan
                    dari pelanggan diperlakukan sebagai input biasa — tidak bisa
                    mengubah perilaku AI, tidak bisa mengeksekusi kode, dan
                    tidak bisa override system prompt. Aman dari prompt
                    injection.
                  </p>
                </Step>
              </>
            )}

            {tab === "wa" && (
              <>
                <Step num="1" title="Pilih provider WhatsApp">
                  <p>Gancang AI mendukung integrasi via gateway berikut:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>WhatsApp
                      Cloud API (resmi Meta)
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Wablas /
                      Fonnte / Whacenter
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Self-hosted
                      Baileys (Node.js)
                    </div>
                  </div>
                </Step>

                <Step num="2" title="Setup webhook">
                  <p>
                    Arahkan webhook provider WhatsApp ke endpoint chat Gancang
                    AI:
                  </p>
                  <CodeBlock label="webhook URL">{`POST https://app-kamu.gancang.ai/api/chat
Content-Type: application/json

{
  "customer_phone": "628123456789",
  "customer_name": "Andi",
  "message": "halo, ada produk hijab?"
}`}</CodeBlock>
                  <p>
                    Response yang dikembalikan adalah balasan AI yang siap
                    dikirim ulang ke WhatsApp.
                  </p>
                </Step>

                <Step num="3" title="Contoh integrasi Node.js (Baileys)">
                  <CodeBlock label="bot.js">{`import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

const { state, saveCreds } = await useMultiFileAuthState("auth");
const sock = makeWASocket({ auth: state, printQRInTerminal: true });

sock.ev.on("creds.update", saveCreds);

sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text || "";
  const phone = msg.key.remoteJid.split("@")[0];

  // Forward ke Gancang AI
  const r = await fetch("https://app-kamu.gancang.ai/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_phone: phone,
      customer_name: msg.pushName,
      message: text,
    }),
  });
  const data = await r.json();

  // Kirim balasan
  await sock.sendMessage(msg.key.remoteJid, { text: data.reply });
});`}</CodeBlock>
                </Step>

                <Step num="4" title="Contoh integrasi WhatsApp Cloud API">
                  <CodeBlock label="webhook.js">{`// Verifikasi webhook (saat setup di Meta)
app.get("/wa-webhook", (req, res) => {
  const VERIFY = process.env.META_VERIFY_TOKEN;
  if (req.query["hub.verify_token"] === VERIFY) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// Terima pesan masuk
app.post("/wa-webhook", async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value;
  const msg = entry?.messages?.[0];
  if (!msg) return res.sendStatus(200);

  const phone = msg.from;
  const text = msg.text?.body || "";

  const r = await fetch("https://app-kamu.gancang.ai/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_phone: phone,
      customer_name: entry.contacts?.[0]?.profile?.name,
      message: text,
    }),
  });
  const data = await r.json();

  // Kirim balasan ke pelanggan
  await fetch(\`https://graph.facebook.com/v20.0/\${PHONE_ID}/messages\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: \`Bearer \${process.env.META_TOKEN}\`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      text: { body: data.reply },
    }),
  });

  res.sendStatus(200);
});`}</CodeBlock>
                </Step>
              </>
            )}

            {tab === "test" && (
              <>
                <Step num="1" title="Tes di Playground dulu">
                  <p>
                    Buka{" "}
                    <a
                      href="/dashboard/playground"
                      className="text-blue-600 hover:underline"
                    >
                      AI Playground
                    </a>{" "}
                    dan coba beberapa skenario:
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Tanya produk:
                      "ada hijab pashmina?"
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Tanya ongkir:
                      "ongkir ke Surabaya berapa?"
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Order: "saya
                      mau order 2 pcs ke Bandung"
                    </div>
                  </div>
                </Step>

                <Step num="2" title="Pantau Inbox">
                  <p>
                    Setiap chat dari WhatsApp masuk ke{" "}
                    <a
                      href="/dashboard/chats"
                      className="text-blue-600 hover:underline"
                    >
                      Chat Masuk
                    </a>
                    . Kamu bisa pantau real-time tanpa intervensi.
                  </p>
                </Step>

                <Step num="3" title="Cek Rekap Order">
                  <p>
                    Order yang dibuat AI otomatis masuk ke{" "}
                    <a
                      href="/dashboard/orders"
                      className="text-blue-600 hover:underline"
                    >
                      Rekap Order
                    </a>{" "}
                    dengan status awal "baru". Update statusnya saat barang
                    diproses, dikirim, hingga selesai.
                  </p>
                </Step>

                <Step num="4" title="Live!">
                  <p>
                    Setelah semua tes lulus, arahkan webhook produksi ke Gancang
                    AI. AI akan langsung melayani pelanggan 24 jam.
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    <ShieldCheck className="h-3 w-3" />
                    Siap produksi
                  </span>
                </Step>
              </>
            )}

            {tab === "billing" && (
              <>
                <Step num="1" title="Pilih paket di halaman Harga">
                  <p>
                    Buka{" "}
                    <a
                      href="/pricing"
                      className="text-blue-600 hover:underline"
                    >
                      halaman Harga
                    </a>{" "}
                    dan pilih salah satu paket: Starter, Business, atau
                    Enterprise. Klik tombol "Pilih Paket" untuk membuka form
                    checkout.
                  </p>
                </Step>

                <Step num="2" title="Bayar via Midtrans">
                  <p>
                    Pembayaran ditangani oleh Midtrans (PCI DSS Level 1). Kamu
                    bisa pakai metode favorit kamu:
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Virtual
                      Account: BCA, BRI, BNI, Mandiri, Permata
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>QRIS (semua
                      e-wallet)
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Kartu Kredit
                      / Debit
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>GoPay,
                      ShopeePay, DANA
                    </div>
                    <div className="py-1">
                      <span className="text-gray-400 mr-2">-</span>Indomaret,
                      Alfamart
                    </div>
                  </div>
                </Step>

                <Step num="3" title="Subscription auto-aktif">
                  <p>
                    Setelah pembayaran <b>settlement/capture</b>, Midtrans akan
                    mengirim notifikasi ke webhook server-to-server kami.
                    Subscription kamu otomatis aktif untuk 1 bulan dan kamu bisa
                    langsung pakai semua fitur sesuai paket.
                  </p>
                </Step>

                <Step num="4" title="Setup Midtrans (untuk admin)">
                  <p>
                    Kalau kamu self-host, tambahkan environment variable
                    berikut:
                  </p>
                  <CodeBlock label=".env">{`MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx`}</CodeBlock>
                  <p>Lalu di dashboard Midtrans, set Notification URL ke:</p>
                  <CodeBlock label="webhook">{`https://app-kamu.gancang.ai/api/billing/notification`}</CodeBlock>
                  <p>
                    Webhook ini akan memverifikasi signature SHA-512 dari
                    Midtrans dan mengaktifkan subscription otomatis ketika
                    status = settlement.
                  </p>
                </Step>

                <Step num="5" title="Lihat Riwayat & Status">
                  <p>
                    Pantau semua transaksi di{" "}
                    <a
                      href="/dashboard/billing"
                      className="text-blue-600 hover:underline"
                    >
                      menu Billing
                    </a>
                    . Filter berdasarkan status (paid/pending/failed) dan lihat
                    metode pembayaran yang dipakai.
                  </p>
                </Step>
              </>
            )}

            {tab === "api" && (
              <>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Endpoints
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Semua endpoint mengembalikan JSON.
                  </p>

                  <div className="mt-5 space-y-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          POST
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/chat
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Kirim pesan dari pelanggan, dapatkan balasan AI.
                      </p>
                      <CodeBlock label="request">{`{
  "customer_phone": "628123456789",
  "customer_name": "Andi",
  "message": "ongkir ke surabaya berapa?"
}`}</CodeBlock>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          POST
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/shipping
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Hitung ongkir domestik manual.
                      </p>
                      <CodeBlock label="request">{`{
  "destination_city": "Surabaya",
  "weight_grams": 1000
}`}</CodeBlock>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          POST
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/billing/checkout
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Buat transaksi Midtrans + dapatkan Snap Token.
                      </p>
                      <CodeBlock label="request">{`{
  "plan_code": "business",
  "customer_name": "Andi",
  "customer_email": "andi@email.com",
  "customer_phone": "08123456789"
}`}</CodeBlock>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          POST
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/billing/notification
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Webhook Midtrans (server-to-server). Verifikasi
                        signature SHA-512 dan aktivasi subscription otomatis.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          GET
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/orders
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        List semua order. Filter via <code>?status=baru</code>.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          GET
                        </span>
                        <code className="text-sm font-mono text-gray-900">
                          /api/conversations
                        </code>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        List chat masuk yang ditangani AI.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-base font-semibold text-gray-900">
                    Tool calls AI
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Saat AI memutuskan butuh tool, ia akan menyertakan blok JSON
                    di akhir balasan.
                  </p>
                  <CodeBlock label="cek ongkir">{`{"tool":"cek_ongkir","city":"Surabaya","weight_grams":1000}`}</CodeBlock>
                  <CodeBlock label="buat order">{`{"tool":"buat_order","customer_name":"Andi","customer_phone":"628...","customer_address":"Jl. Mawar 12","city":"Bandung","product_summary":"Hijab Pashmina x2","total_amount":178000,"shipping_cost":18000,"courier":"JNE"}`}</CodeBlock>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
