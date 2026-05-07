import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../../components/Sidebar";
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const STATUSES = [
  { id: "all", label: "Semua" },
  { id: "paid", label: "Paid" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
];

function StatusBadge({ status }) {
  const map = {
    paid: { color: "bg-green-500", label: "paid", icon: CheckCircle2 },
    pending: { color: "bg-orange-500", label: "pending", icon: Clock },
    challenge: { color: "bg-orange-500", label: "challenge", icon: Clock },
    failed: { color: "bg-red-500", label: "failed", icon: XCircle },
  };
  const it = map[status] || {
    color: "bg-gray-400",
    label: status,
    icon: Clock,
  };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700">
      <span className={`h-1.5 w-1.5 rounded-full ${it.color}`} />
      {it.label}
    </span>
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

export default function BillingPage() {
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["billing-tx", status],
    queryFn: async () => {
      const r = await fetch(`/api/billing/transactions?status=${status}`);
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
  });

  const items = data?.items || [];
  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <Sidebar active="/dashboard/billing" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Workspace · Billing
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Billing & Pembayaran
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Kelola subscription dan riwayat transaksi. Pembayaran diproses
                aman lewat Midtrans.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                Midtrans Secure
              </span>
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Upgrade Paket
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={TrendingUp}
              label="Total Revenue"
              value={`Rp ${Number(stats.revenue || 0).toLocaleString("id-ID")}`}
              sub={`${stats.paid_count || 0} transaksi paid`}
            />
            <StatCard
              icon={CreditCard}
              label="Total Transaksi"
              value={stats.total || 0}
              sub="lifetime"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pending_count || 0}
              sub="menunggu pembayaran"
            />
            <StatCard
              icon={XCircle}
              label="Failed"
              value={stats.failed_count || 0}
              sub="gagal/expired"
            />
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
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
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Paket</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Metode</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Tanggal</th>
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
                        Belum ada transaksi.{" "}
                        <a
                          href="/pricing"
                          className="text-blue-600 hover:underline"
                        >
                          Beli paket pertama
                        </a>
                      </td>
                    </tr>
                  )}
                  {items.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">
                        {t.order_id}
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">
                          {t.customer_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t.customer_email}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          {t.plan_name}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900">
                        Rp {Number(t.amount).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {t.payment_method || "-"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(t.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
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
