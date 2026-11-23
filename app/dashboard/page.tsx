"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";

// ═══════════════════════════════════════════════════
// ДОДАЈ НОВА ПРОГРАМА ОВДЕ КОГА ЌЕ ИМАШ НОВА
// ═══════════════════════════════════════════════════
const ALL_PROGRAMS = [
  {
    id: "beginner-program",
    altIds: ["beginner-1"],
    name: "Beginner Program",
    description: "12-Week Transformation Blueprint",
    image: "/images/beginner.jpg",
    downloadPath: "/downloads/beginner-program.pdf",
  },
  {
    id: "advanced-program",
    altIds: ["advanced-1"],
    name: "Master of Aesthetics",
    description: "16-Week Elite Performance Plan",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/advanced-program.pdf",
  },
];

type ProgramStatus = {
  status: string;
  expiresAt: string | null;
};

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { convert } = useCurrency();

  // Ги чуваме и статусите на програмите и целосната историја на нарачки
  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*") // Влечеме сè за да имаме податоци за историјата
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setOrdersHistory(data); // Ја зачувуваме историјата

          const statuses: Record<string, ProgramStatus> = {};

          for (const order of data) {
            const itemsArray =
              typeof order.items === "string"
                ? JSON.parse(order.items)
                : order.items || [];

            for (const program of ALL_PROGRAMS) {
              const hasProgram = itemsArray.some(
                (item: any) =>
                  item.id === program.id || program.altIds.includes(item.id)
              );

              if (!hasProgram) continue;

              const existing = statuses[program.id];

              // completed има приоритет над pending
              if (order.status === "completed" && existing?.status !== "completed") {
                statuses[program.id] = {
                  status: "completed",
                  expiresAt: order.expires_at || null,
                };
              } else if (!existing) {
                statuses[program.id] = {
                  status: order.status,
                  expiresAt: order.expires_at || null,
                };
              }
            }
          }

          setProgramStatuses(statuses);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoadingDB(false);
      }
    }

    if (isSignedIn && user) {
      fetchOrders();
    }
  }, [isSignedIn, user]);

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  function formatExpiry(expiresAt: string | null): string {
    if (!expiresAt) return "";
    return new Date(expiresAt).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  }

  if (!isLoaded || !isSignedIn || isLoadingDB) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs animate-pulse">Decrypting Vault...</p>
      </div>
    );
  }

  const ownedPrograms = ALL_PROGRAMS.filter((p) => programStatuses[p.id]);
  const hasAnyProgram = ownedPrograms.length > 0;
  const pendingOrders = ordersHistory.filter(o => o.status.startsWith("pending_"));

  return (
    <main className="min-h-screen bg-black text-white pt-12 md:pt-24 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto w-full">

        {/* ХЕДЕР СЕКЦИЈА */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-zinc-900 pb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] flex-shrink-0 bg-zinc-900">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                The <span className="text-red-600">Vault</span>
              </h1>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <SignOutButton>
            <button className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl transition-all self-start md:self-auto">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* ГЛАВЕН ЛЕЈАУТ (МРЕЖА) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* ЛЕВА КОЛОНА: ПРОГРАМИ И АЛЕРТИ */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* АЛЕРТ ЗА ЧЕКАЊЕ ОДОБРУВАЊЕ */}
            {pendingOrders.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 flex-shrink-0 animate-pulse">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm text-yellow-500">Verification Pending</h4>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mt-1">
                    You have {pendingOrders.length} order(s) under review. Access will be granted shortly.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-white">
                Active <span className="text-red-600">Programs</span>
              </h2>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                Secured Vault
              </span>
            </div>

            {/* ЛИСТА НА ПРОГРАМИ */}
            {hasAnyProgram ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ownedPrograms.map((program) => {
                  const ps = programStatuses[program.id];
                  const isCompleted = ps.status === "completed";
                  const expired = isExpired(ps.expiresAt);
                  const isActive = isCompleted && !expired;

                  return (
                    <div key={program.id} className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden group flex flex-col hover:border-zinc-600 transition-colors">
                      <div className="relative h-48 w-full bg-zinc-900 overflow-hidden border-b border-zinc-900">
                        <Image
                          src={program.image}
                          alt={program.name}
                          fill
                          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${!isActive ? 'grayscale' : ''}`}
                        />
                        {/* БЕЏОВИ ЗА СТАТУС НА СЛИКАТА */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          {isActive && (
                            <div className="bg-green-500/20 backdrop-blur-md border border-green-500/50 text-green-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                            </div>
                          )}
                          {isCompleted && expired && (
                            <div className="bg-orange-500/20 backdrop-blur-md border border-orange-500/50 text-orange-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                              Expired
                            </div>
                          )}
                          {!isCompleted && (
                            <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-500 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                              Pending
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-black uppercase text-lg mb-1 text-white leading-tight">{program.name}</h3>
                          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">{program.description}</p>
                        </div>

                        <div>
                          {ps.expiresAt && (
                            <p className={`text-[9px] font-bold uppercase tracking-widest mb-4 flex justify-between border-b border-zinc-900 pb-2 ${expired ? "text-orange-500" : "text-zinc-400"}`}>
                              <span>Status:</span>
                              <span>{expired ? "Expired" : `Ends: ${formatExpiry(ps.expiresAt)}`}</span>
                            </p>
                          )}

                          {/* КОПЧИЊА */}
                          {isActive && (
                            <a
                              href={program.downloadPath}
                              download
                              className="w-full bg-white text-black font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-3 active:scale-[0.98] text-xs shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download PDF
                            </a>
                          )}
                          {isCompleted && expired && (
                            <div className="w-full bg-zinc-900 text-zinc-500 font-bold uppercase tracking-widest py-3 rounded-xl cursor-not-allowed flex flex-col items-center justify-center gap-0.5 border border-zinc-800">
                              <span className="text-[10px] text-orange-500">Access Expired</span>
                              <span className="text-[8px] text-zinc-500">Contact support to renew</span>
                            </div>
                          )}
                          {!isCompleted && (
                            <button disabled className="w-full bg-zinc-900 text-zinc-500 font-bold uppercase tracking-widest py-3 rounded-xl cursor-not-allowed flex flex-col items-center justify-center gap-0.5 border border-zinc-800">
                              <span className="text-[10px] text-yellow-500">Processing Payment</span>
                              <span className="text-[8px] text-zinc-500">Waiting for Admin</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-zinc-950/30">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-zinc-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-black uppercase text-white text-lg mb-2 tracking-widest">No Active Programs</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8">
                  Purchase a program to unlock your materials.
                </p>
                <Link href="/" className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-3.5 px-8 rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                  Browse Store
                </Link>
              </div>
            )}
          </div>

          {/* ДЕСНА КОЛОНА: ИСТОРИЈА И ПОДДРШКА */}
          <div className="space-y-8">
            
            {/* ИСТОРИЈА НА НАРАЧКИ */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 lg:p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-zinc-900 pb-4">
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Order History
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {ordersHistory.length === 0 ? (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 text-center py-4">No past orders</p>
                ) : (
                  ordersHistory.map((order) => (
                    <div key={order.id} className="border-b border-zinc-900/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black uppercase text-zinc-300">{formatExpiry(order.created_at)}</span>
                        <span className="text-[10px] font-black text-white">{convert(order.total_price)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                          order.status === "completed" ? "bg-green-500/10 text-green-500" :
                          order.status.startsWith("pending") ? "bg-yellow-500/10 text-yellow-500" :
                          "bg-zinc-800 text-zinc-500"
                        }`}>
                          {order.status.startsWith("pending") ? "Pending" : order.status}
                        </span>
                        
                        {order.promo_code && (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                            Promo: <span className="text-red-500">{order.promo_code}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ПОДДРШКА WIDGET */}
            <div className="bg-red-600/5 border border-red-600/20 rounded-3xl p-6 text-center">
              <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-black uppercase text-sm text-white mb-2">Need Help?</h4>
              <p className="text-[9px] font-bold tracking-widest uppercase text-zinc-400 mb-6 leading-relaxed">
                Having trouble accessing your materials or need a receipt verified?
              </p>
              <Link href="/contact" className="inline-block w-full bg-zinc-950 text-white border border-zinc-800 font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-white hover:text-black hover:border-white transition-colors">
                Contact Support
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}