import { useState, useRef, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function PlaygroundPage() {
  const [phone, setPhone] = useState("6281234567890");
  const [name, setName] = useState("Andi");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_phone: phone,
          customer_name: name,
          message: userMsg.content,
        }),
      });
      if (!r.ok) {
        throw new Error(`Error ${r.status}`);
      }
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      console.error(e);
      setError(e.message || "Gagal mengirim");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const SAMPLES = [
    "Halo, ada produk hijab nggak?",
    "Berapa ongkir ke Surabaya?",
    "Saya mau order Hijab Pashmina 2 pcs ke Bandung",
    "Bisa COD nggak?",
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/playground" />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Workspace · AI Playground
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Coba AI Agent
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Simulasikan chat seolah-olah pelanggan WhatsApp. AI akan
                mengikuti pengaturan, knowledge base, dan produk yang sudah kamu
                set.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
              <Sparkles className="h-3.5 w-3.5" />
              Test mode
            </span>
          </div>

          <div className="mt-6 grid lg:grid-cols-12 gap-4">
            {/* Customer profile */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 sticky top-6">
                <h3 className="text-sm font-semibold text-gray-900">
                  Profil Pelanggan Tes
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Identitas dummy untuk simulasi.
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Nama
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      No HP (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Contoh pesan
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setInput(s)}
                        className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700 hover:border-gray-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-1.5 text-sm text-gray-600">
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Pesan disimpan
                    ke database
                  </div>
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Tampil di Inbox
                    Chat
                  </div>
                  <div className="py-1">
                    <span className="text-gray-400 mr-2">-</span>Order otomatis
                    masuk Rekap
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-[640px] overflow-hidden">
                <div className="border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        AI Agent
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{" "}
                        ready
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    Reset
                  </button>
                </div>

                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 bg-gray-50"
                >
                  {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-500 py-10">
                      <Bot className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      Mulai chat untuk menguji AI Agent kamu.
                    </div>
                  )}
                  {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2`}
                      >
                        {!isUser && (
                          <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                            isUser
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                          }`}
                        >
                          {m.content}
                        </div>
                        {isUser && (
                          <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <User className="h-3.5 w-3.5 text-gray-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {loading && (
                    <div className="flex justify-start items-end gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-gray-200 px-3.5 py-2 text-sm text-gray-500">
                        <span className="inline-flex gap-1">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-gray-400"
                            style={{
                              animation: "cpdot 1s infinite ease-in-out",
                            }}
                          />
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-gray-400"
                            style={{
                              animation: "cpdot 1s infinite ease-in-out",
                              animationDelay: "120ms",
                            }}
                          />
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-gray-400"
                            style={{
                              animation: "cpdot 1s infinite ease-in-out",
                              animationDelay: "240ms",
                            }}
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 p-3 bg-white">
                  {error && (
                    <div className="text-xs text-red-600 mb-2">{error}</div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Tulis pesan seperti pelanggan..."
                      className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    />
                    <button
                      type="button"
                      onClick={send}
                      disabled={loading || !input.trim()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      Kirim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        @keyframes cpdot {
          0%, 80%, 100% { opacity: 0.3; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
