import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  BookOpen,
  Bot,
  BookMarked,
  Sparkles,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/agent", label: "Setting Agent", icon: Bot },
  { href: "/dashboard/knowledge", label: "Knowledge Base", icon: BookMarked },
  { href: "/dashboard/products", label: "Produk", icon: Package },
  { href: "/dashboard/chats", label: "Chat Masuk", icon: MessageSquare },
  { href: "/dashboard/orders", label: "Rekap Order", icon: ShoppingBag },
  { href: "/dashboard/playground", label: "AI Playground", icon: Sparkles },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/tutorial", label: "Tutorial", icon: BookOpen },
];

export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sticky top-0 z-40">
        <a href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">
            Gancang AI
          </span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md border border-gray-200 text-gray-700"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } lg:block fixed lg:sticky top-0 left-0 z-30 h-screen w-64 border-r border-gray-200 bg-white px-4 py-6 overflow-y-auto`}
      >
        <a href="/" className="hidden lg:flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 tracking-tight">
              Gancang AI
            </span>
            <span className="text-[11px] text-gray-500 -mt-0.5">
              WhatsApp AI CS
            </span>
          </div>
        </a>

        <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
          Workspace
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-8 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              AI Online
            </span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            Premium Plan
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            AI auto-reply, multi-bahasa & rekap order aktif.
          </div>
          <a
            href="/pricing"
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-100"
          >
            Upgrade Paket
          </a>
        </div>
      </aside>
    </>
  );
}
