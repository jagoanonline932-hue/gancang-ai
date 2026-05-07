import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle, ArrowRight, Bot } from "lucide-react";

export default function FinishPage() {
  const [params, setParams] = useState({ order_id: "", status: "", demo: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setParams({
        order_id: sp.get("order_id") || "",
        status: sp.get("status") || "",
        demo: sp.get("demo") || "",
      });
    }
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tx-finish", params.order_id],
    queryFn: async () => {
      const r = await fetch(`/api/billing/transactions/${params.order_id}`);
      if (!r.ok) throw new Error("Gagal load");
      return r.json();
    },
    enabled: !!params.order_id,
    refetchInterval: 5000,
  });

  const tx = data?.item;
  const status = tx?.status || params.status || "pending";

  const isPaid = status === "paid";
  const isPending = status === "pending" || status === "challenge";
  const isFailed = status === "failed";

  const Icon = isPaid ? CheckCircle2 : isFailed ? XCircle : Clock;
  const iconColor = isPaid
    ? "text-green-600"
    : isFailed
      ? "text-red-600"
      : "text-orange-500";
  const bgColor = isPaid
    ? "bg-green-50"
    : isFailed
      ? "bg-red-50"
      : "bg-orange-50";

  const title = isPaid
    ? "Pembayaran Berhasil"
    : isFailed
      ? "Pembayaran Gagal"
      : "Menunggu Pembayaran";
  const desc = isPaid
    ? "Subscription kamu sudah aktif. Selamat datang di Gancang AI!"
    : isFailed
      ? "Transaksi tidak berhasil. Coba pilih metode pembayaran lain."
      : params.demo
        ? "Mode demo: Midtrans belum dikonfigurasi. Set MIDTRANS_SERVER_KEY untuk pembayaran sungguhan."
        : "Selesaikan pembayaran melalui Virtual Account atau metode yang kamu pilih.";

  return (
    <div className="min-h-screen bg-white font-inter">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5">
          <a href="/" className="flex items-center gap-2 w-fit">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-gray-900">
              Gancang AI
            </span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 sm:px-6 py-16">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <div
            className={`mx-auto h-14 w-14 rounded-full ${bgColor} flex items-center justify-center`}
          >
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{desc}</p>

          {tx && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium text-gray-900">
                  {tx.order_id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paket</span>
                <span className="font-medium text-gray-900">
                  {tx.plan_name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-semibold text-gray-900">
                  Rp {Number(tx.amount).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Metode</span>
                <span className="text-gray-900">
                  {tx.payment_method || "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] text-gray-700">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isPaid ? "bg-green-500" : isFailed ? "bg-red-500" : "bg-orange-500"}`}
                  />
                  {status}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/dashboard/billing"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Lihat Riwayat Transaksi
              <ArrowRight className="h-4 w-4" />
            </a>
            {isPaid && (
              <a
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                Buka Dashboard
              </a>
            )}
            {!isPaid && (
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
              >
                Refresh status
              </button>
            )}
          </div>

          {isLoading && !tx && (
            <div className="mt-4 text-xs text-gray-500">
              Memuat detail transaksi...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
