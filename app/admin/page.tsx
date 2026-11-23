"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

export default function AdminPanel() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "revoked">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const adminEmails = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];

  useEffect(() => {
    if (isLoaded) {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!isSignedIn || !adminEmails.includes(userEmail || "")) {
        router.push("/");
      } else {
        fetchOrders();
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  }

  // СПЕЦИЈАЛНА ФУНКЦИЈА: Праќа мејл на сите веќе одобрени клиенти
  async function notifyAllPreviousUsers() {
    if (!window.confirm("⚠️ ДАЛИ СИ СИГУРЕН? Ова ќе испрати е-маил до СИТЕ претходно одобрени клиенти!")) return;

    const completedOrders = orders.filter(o => o.status === "completed" && !isExpired(o.expires_at));
    
    if (completedOrders.length === 0) {
      alert("Нема активни стари клиенти за испраќање.");
      return;
    }

    let sentCount = 0;
    
    for (const order of completedOrders) {
      try {
        await fetch('/api/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userEmail: order.user_email, 
            items: order.items 
          }),
        });
        
        sentCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (err) {
        console.error(`Грешка при праќање до ${order.user_email}:`, err);
      }
    }

    alert(`✅ УСПЕШНО! Испратени се ${sentCount} е-маилови до старите клиенти.`);
  }

  // ФУНКЦИЈАТА ЗА ОДОБРУВАЊЕ СО ИСПРАЌАЊЕ МЕЈЛ
  async function approveOrder(order: any) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    const { error } = await supabase
      .from("orders")
      .update({ status: "completed", expires_at: expiresAt.toISOString() })
      .eq("id", order.id);

    if (!error) {
      setOrders(orders.map((o: any) =>
        o.id === order.id
          ? { ...o, status: "completed", expires_at: expiresAt.toISOString() }
          : o
      ));

      try {
        await fetch('/api/send-approval-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userEmail: order.user_email, 
            items: order.items 
          }),
        });
      } catch (emailError) {
        console.error("Грешка при праќање е-маил:", emailError);
      }

    } else {
      alert("Грешка при одобрување: " + error.message);
    }
  }

  async function revokeOrder(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "revoked", expires_at: null })
      .eq("id", orderId);

    if (!error) {
      setOrders(orders.map((o: any) =>
        o.id === orderId
          ? { ...o, status: "revoked", expires_at: null }
          : o
      ));
    } else {
      alert("Грешка при одземање: " + error.message);
    }
  }

  async function deleteOrder(orderId: string) {
    if (!window.confirm("Are you sure? This will permanently delete the order from the database.")) return;
    
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (!error) {
      setOrders(orders.filter((o: any) => o.id !== orderId));
    } else {
      alert("Грешка при бришење: " + error.message);
    }
  }

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  function getStatusBadge(order: any) {
    if (order.status === "completed" && isExpired(order.expires_at)) {
      return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
    }
    if (order.status === "completed") return "bg-green-500/10 text-green-500 border border-green-500/20";
    if (order.status === "revoked") return "bg-red-500/10 text-red-500 border border-red-500/20";
    return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
  }

  function getStatusLabel(order: any) {
    if (order.status === "completed" && isExpired(order.expires_at)) return "expired";
    if (order.status.startsWith("pending_")) return "Action Required";
    return order.status;
  }

  function getPaymentMethod(status: string) {
    if (status.includes("bank")) return "Bank Transfer";
    if (status.includes("binance")) return "Crypto (Binance)";
    if (status.includes("paypal")) return "PayPal";
    if (status.includes("skrill")) return "Skrill";
    if (status.includes("neteller")) return "Neteller";
    if (status.includes("ria")) return "Ria Transfer";
    return "Unknown Method";
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.user_email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "pending") return order.status.startsWith("pending_");
    if (filter === "completed") return order.status === "completed";
    if (filter === "revoked") return order.status === "revoked" || (order.status === "completed" && isExpired(order.expires_at));
    
    return true; 
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-black uppercase tracking-widest animate-pulse">
        Accessing Admin Vault...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-12 md:pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-zinc-900 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Admin <span className="text-red-600">Panel</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">
              Manage {orders.length} total orders
            </p>
          </div>
          
          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* ДОДАДЕНО КОПЧЕ ЗА ИСПРАЌАЊЕ МЕЈЛ НА СТАРИ КОРИСНИЦИ */}
            <button 
              onClick={notifyAllPreviousUsers}
              className="bg-red-900/20 border border-red-900 text-red-500 hover:bg-red-600 hover:text-white p-3 px-6 rounded-xl transition-all shadow-lg font-black uppercase tracking-widest text-[10px]"
            >
              Notify Old Users
            </button>

            <button onClick={fetchOrders} className="bg-zinc-900 hover:bg-zinc-800 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
          <div className="flex w-full lg:w-auto overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {[
              { id: "all", label: "All Orders" },
              { id: "pending", label: "Pending (Action Req.)" },
              { id: "completed", label: "Completed" },
              { id: "revoked", label: "Revoked / Expired" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                  filter === tab.id 
                    ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                    : "bg-black border border-zinc-800 text-zinc-500 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-72 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-zinc-950 border border-zinc-900 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:border-zinc-700 relative group">

              <button 
                onClick={() => deleteOrder(order.id)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors p-2 md:opacity-0 md:group-hover:opacity-100"
                title="Delete Order"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div className="flex-1 min-w-0 w-full pr-10 md:pr-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${getStatusBadge(order)}`}>
                    {getStatusLabel(order)}
                  </span>
                  <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    Ordered: {formatDate(order.created_at)}
                  </span>
                  {order.expires_at && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isExpired(order.expires_at) ? "text-orange-500" : "text-zinc-500"}`}>
                      Expires: {formatDate(order.expires_at)}
                    </span>
                  )}
                  {order.status.startsWith("pending_") && (
                     <span className="bg-zinc-800 text-zinc-300 text-[9px] font-black uppercase px-2 py-1 rounded-md">
                       Via: {getPaymentMethod(order.status)}
                     </span>
                  )}
                </div>

                <h3 className="text-lg font-black uppercase text-white truncate">{order.user_email}</h3>
                
                <div className="flex items-center gap-3 mt-1 mb-4 flex-wrap">
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    Total: <span className="text-white">${order.total_price}.00</span>
                  </p>
                  {order.promo_code && (
                    <span className="bg-green-500/10 border border-green-500/20 text-green-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                      Promo: {order.promo_code}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-wrap gap-2">
                    {order.items?.map((item: any, idx: number) => (
                      <span key={idx} className="bg-zinc-900 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-300">
                        {item.name}
                      </span>
                    ))}
                  </div>

                  {order.proof_url ? (
                    <a
                      href={order.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Receipt
                    </a>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 px-2 border border-dashed border-zinc-800 rounded-lg py-1">
                      No receipt uploaded
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3 mt-4 md:mt-0 flex-shrink-0">
                {order.status !== "completed" ? (
                  <button
                    onClick={() => approveOrder(order)}
                    className="w-full md:w-48 bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to revoke access for this user?")) {
                        revokeOrder(order.id);
                      }
                    }}
                    className="w-full md:w-48 bg-black text-zinc-500 border border-zinc-800 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-red-900/30 hover:text-red-500 hover:border-red-900 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Revoke Access
                  </button>
                )}

                {order.status === "completed" && isExpired(order.expires_at) && (
                  <button
                    onClick={() => approveOrder(order)}
                    className="w-full md:w-48 bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black uppercase tracking-widest py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 text-[10px]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Renew +3mo
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-3xl">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-widest text-sm">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}