import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import { MessageSquare, Search } from "lucide-react";

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatsPage() {
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  const { data: convoData } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const r = await fetch("/api/conversations");
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
    refetchInterval: 5000,
  });

  const { data: msgData } = useQuery({
    queryKey: ["messages", activeId],
    queryFn: async () => {
      const r = await fetch(`/api/conversations/${activeId}/messages`);
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
    enabled: !!activeId,
    refetchInterval: 4000,
  });

  const conversations = (convoData?.items || []).filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (c.customer_name || "").toLowerCase().includes(s) ||
      (c.customer_phone || "").toLowerCase().includes(s) ||
      (c.last_message || "").toLowerCase().includes(s)
    );
  });

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgData]);

  const activeConvo = conversations.find((c) => c.id === activeId);
  const messages = msgData?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/chats" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div>
            <div className="text-xs font-medium text-gray-500">
              Workspace · Chat Masuk
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Inbox Chat
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              AI siap merespon leads yang masuk melalui WhatsApp. Pantau setiap
              percakapan di sini.
            </p>
          </div>

          <div className="mt-6 grid lg:grid-cols-12 gap-4 h-[640px]">
            {/* Conversation list */}
            <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-white flex flex-col overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
                  <Search className="h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama atau nomor..."
                    className="flex-1 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
                {conversations.length === 0 && (
                  <div className="px-5 py-12 text-center text-sm text-gray-500">
                    <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    Belum ada chat.
                    <br />
                    Coba kirim pesan dari AI Playground.
                  </div>
                )}
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                      activeId === c.id ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                      {(c.customer_name ||
                        c.customer_phone ||
                        "?")[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {c.customer_name || c.customer_phone}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {formatTime(c.updated_at)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {c.last_message}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active chat */}
            <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white flex flex-col overflow-hidden">
              {activeConvo ? (
                <>
                  <div className="border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                        {(activeConvo.customer_name ||
                          activeConvo.customer_phone ||
                          "?")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {activeConvo.customer_name ||
                            activeConvo.customer_phone}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          AI handling · {activeConvo.customer_phone}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      auto-reply
                    </span>
                  </div>

                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 bg-gray-50"
                  >
                    {messages.map((m) => {
                      const isUser = m.role === "user";
                      return (
                        <div
                          key={m.id}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                              isUser
                                ? "bg-blue-600 text-white rounded-tr-sm"
                                : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                            }`}
                          >
                            {m.content}
                            <div
                              className={`mt-1 text-[10px] ${isUser ? "text-blue-100" : "text-gray-400"}`}
                            >
                              {formatTime(m.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {messages.length === 0 && (
                      <div className="text-center text-sm text-gray-500 py-10">
                        Belum ada pesan.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 px-5 py-3 bg-white">
                    <div className="text-xs text-gray-500">
                      AI sedang menangani percakapan ini secara otomatis. Untuk
                      simulasi, gunakan{" "}
                      <a
                        href="/dashboard/playground"
                        className="text-blue-600 hover:underline"
                      >
                        AI Playground
                      </a>
                      .
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                  Pilih percakapan untuk melihat detail.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
