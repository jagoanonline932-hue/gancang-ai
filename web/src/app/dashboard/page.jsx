import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/Sidebar";
import {
  ShoppingBag,
  MessageSquare,
  Package,
  BookMarked,
  TrendingUp,
  ArrowUpRight,
  Bot,
} from "lucide-react";

function Ring({ percent = 72, color = "#EA580C" }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle
        cx="28"
        cy="28"
        r={r}
        stroke="#F3F4F6"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="28"
        cy="28"
        r={r}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
      />
      <text
        x="28"
        y="32"
        textAnchor="middle"
        className="fill-gray-900"
        fontSize="11"
        fontWeight="600"
      >
        {percent}%
      </text>
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-md bg-blue-50 flex items-center justify-center">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          live
        </span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
        {value}
      </div>
      <div className="mt-0.5 text-xs font-medium text-gray-500">{label}</div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function DashboardHome() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const r = await fetch("/api/stats");
      if (!r.ok) throw new Error("stats failed");
      return r.json();
    },
  });

  const { data: ordersData } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      const r = await fetch("/api/orders");
      if (!r.ok) throw new Error("orders failed");
      return r.json();
    },
  });

  const { data: convoData } = useQuery({
    queryKey: ["recent-convos"],
    queryFn: async () => {
      const r = await fetch("/api/conversations");
      if (!r.ok) throw new Error("convos failed");
      return r.json();
    },
  });

  const recentOrders = (ordersData?.items || []).slice(0, 5);
  const recentConvos = (convoData?.items || []).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard" />

      <main className="flex-1 lg:ml-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Workspace · Gancang AI
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Dashboard Overview
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                AI Agent aktif
              </span>
              <a
                href="/dashboard/playground"
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                <Bot className="h-3.5 w-3.5" />
                Coba AI
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={ShoppingBag}
              label="Total Orderan"
              value={stats?.orders_total ?? 0}
              sub={`${stats?.orders_today ?? 0} order hari ini`}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Revenue"
              value={`Rp ${Number(stats?.revenue ?? 0).toLocaleString("id-ID")}`}
              sub={`${stats?.orders_pending ?? 0} pending`}
            />
            <StatCard
              icon={MessageSquare}
              label="Percakapan"
              value={stats?.conversations ?? 0}
              sub="dari WhatsApp"
            />
            <StatCard
              icon={Package}
              label="Produk Aktif"
              value={stats?.products ?? 0}
              sub={`${stats?.knowledge ?? 0} knowledge`}
            />
          </div>

          {/* Health & Quick links */}
          <div className="mt-4 grid lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    AI Agent Health
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Performa balasan, akurasi maksud, dan rasio closing minggu
                    ini.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  optimal
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center">
                  <Ring percent={94} color="#16A34A" />
                  <div className="mt-2 text-xs font-medium text-gray-500">
                    Akurasi Maksud
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Ring percent={72} color="#EA580C" />
                  <div className="mt-2 text-xs font-medium text-gray-500">
                    Closing Rate
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Ring percent={88} color="#2563EB" />
                  <div className="mt-2 text-xs font-medium text-gray-500">
                    Response Time
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Cepat ke
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Aksi yang sering dipakai.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="/dashboard/agent"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50"
                >
                  <span className="text-gray-900">Setting Agent AI</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                </a>
                <a
                  href="/dashboard/knowledge"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50"
                >
                  <span className="text-gray-900">Tambah Knowledge</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                </a>
                <a
                  href="/dashboard/products"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50"
                >
                  <span className="text-gray-900">Kelola Produk</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                </a>
                <a
                  href="/dashboard/tutorial"
                  className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50"
                >
                  <span className="text-gray-900">Tutorial Pasang</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-gray-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Recent orders & chats */}
          <div className="mt-4 grid lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Order Terbaru
                </h2>
                <a
                  href="/dashboard/orders"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Lihat semua
                </a>
              </div>
              <div className="divide-y divide-gray-200">
                {recentOrders.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    Belum ada order
                  </div>
                )}
                {recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {o.customer_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {o.order_code} · {o.product_summary}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        Rp {Number(o.total_amount).toLocaleString("id-ID")}
                      </div>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${o.status === "baru" ? "bg-orange-500" : "bg-green-500"}`}
                        />
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Chat Masuk
                </h2>
                <a
                  href="/dashboard/chats"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Lihat semua
                </a>
              </div>
              <div className="divide-y divide-gray-200">
                {recentConvos.length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-gray-500">
                    Belum ada chat
                  </div>
                )}
                {recentConvos.map((c) => (
                  <a
                    key={c.id}
                    href="/dashboard/chats"
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                  >
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {(c.customer_name ||
                        c.customer_phone)?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {c.customer_name || c.customer_phone}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {c.last_message}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
