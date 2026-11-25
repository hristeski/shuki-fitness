"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Search,
  Trash2,
  Eye,
  Check,
  Ban,
  ShieldCheck,
} from "lucide-react";

const ADMIN_EMAILS = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];

export default function AdminPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "revoked">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isLoaded) {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!isSignedIn || !ADMIN_EMAILS.includes(userEmail || "")) {
        router.push("/");
      } else {
        fetchOrders();
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load orders");
      setOrders(json.orders || []);
    } catch (err: any) {
      console.error("Admin fetch error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, action: "approve" | "revoke") {
    if (action === "revoke" && !window.confirm("Revoke access for this user?")) return;
    setBusyId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? json.order : o))
      );
    } catch (err: any) {
      alert(err?.message || "Error updating order");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteOrder(orderId: string) {
    if (!window.confirm("Permanently delete this order from the database?")) return;
    setBusyId(orderId);
    try {
      const res = await fetch(`/api/admin/orders?id=${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      alert(err?.message || "Error deleting order");
    } finally {
      setBusyId(null);
    }
  }

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getPaymentMethod(status: string) {
    if (status.includes("card")) return "Bank Card";
    if (status.includes("bank")) return "Bank Transfer";
    if (status.includes("crypto") || status.includes("binance")) return "Crypto (USDT)";
    return "Other";
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "pending") return order.status.startsWith("pending_");
    if (filter === "completed") return order.status === "completed";
    if (filter === "revoked")
      return order.status === "revoked" || (order.status === "completed" && isExpired(order.expires_at));
    return true;
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-evo-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-red-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 py-10 md:py-14 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-800 mb-1">
              <ShieldCheck size={13} /> Evolution Body Control
            </p>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
              Admin <span className="text-red-800">Panel</span>
            </h1>
            <p className="text-xs font-bold text-stone-500 mt-1">
              Managing {orders.length} total orders
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 bg-white border border-stone-200 hover:border-red-800 text-stone-800 text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="flex w-full lg:w-auto overflow-x-auto gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "completed", label: "Completed" },
              { id: "revoked", label: "Revoked / Expired" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab.id
                    ? "bg-red-800 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by client email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-red-800"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const expired = isExpired(order.expires_at);
            const isBusy = busyId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        order.status === "completed" && !expired
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status.startsWith("pending")
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {order.status === "completed" && expired
                        ? "Expired"
                        : order.status.startsWith("pending")
                        ? "Action Required"
                        : order.status}
                    </span>
                    <span className="bg-stone-100 text-stone-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                      {getPaymentMethod(order.status)}
                    </span>
                    <span className="text-[11px] font-bold text-stone-400">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-stone-950 truncate">
                    {order.user_email}
                  </h3>

                  <p className="text-xs font-bold text-stone-500">
                    Total: <span className="text-stone-950 font-black">${order.total_price}</span>
                    {order.promo_code && (
                      <span className="ml-2 text-emerald-700">• Promo: {order.promo_code}</span>
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {order.items?.map((item: any, idx: number) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg"
                      >
                        {item.name}
                      </span>
                    ))}

                    {order.proof_url && (
                      <a
                        href={order.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg transition-colors"
                      >
                        <Eye size={12} /> View Receipt
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {order.status !== "completed" || expired ? (
                    <button
                      disabled={isBusy}
                      onClick={() => updateOrderStatus(order.id, "approve")}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <Check size={15} /> {expired ? "Renew" : "Approve"}
                    </button>
                  ) : (
                    <button
                      disabled={isBusy}
                      onClick={() => updateOrderStatus(order.id, "revoke")}
                      className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-red-800 disabled:opacity-50 text-stone-700 hover:text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <Ban size={14} /> Revoke
                    </button>
                  )}

                  <button
                    disabled={isBusy}
                    onClick={() => deleteOrder(order.id)}
                    title="Delete order"
                    className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-red-100 disabled:opacity-50 text-stone-500 hover:text-red-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center text-xs font-black uppercase text-stone-400">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}