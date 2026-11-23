"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";
import { Download, Lock, Clock, FileText } from "lucide-react";

const ALL_PROGRAMS = [
  { id: "beginner-program", altIds: ["beginner-1", "beginner-2x", "beginner-3x", "beginner-4x"], name: "Beginner Program", description: "8-Week Foundation Blueprint", image: "/images/beginner.jpg", downloadPath: "/downloads/beginner-program.pdf" },
  { id: "advanced-program", altIds: ["advanced-1", "advanced-2x", "advanced-3x", "advanced-4x"], name: "Advanced Program", description: "8-Week Muscle Domination Plan", image: "/images/advanced.jpg", downloadPath: "/downloads/advanced-program.pdf" },
  { id: "nutrition-bulking", altIds: [], name: "Bulking Nutrition Plan", description: "Clean Muscle Surplus Guide", image: "/images/advanced.jpg", downloadPath: "/downloads/bulking-plan.pdf" },
  { id: "nutrition-cutting", altIds: [], name: "Cutting Nutrition Plan", description: "Shred & Definition Guide", image: "/images/beginner.jpg", downloadPath: "/downloads/cutting-plan.pdf" },
  { id: "combo-bundle", altIds: [], name: "Complete Bundle (Training + Nutrition)", description: "Full Training & Nutrition Pack", image: "/images/advanced.jpg", downloadPath: "/downloads/combo-bundle.pdf" },
  { id: "stronger-together-duo", altIds: [], name: "Stronger Together (Duo Plan)", description: "8-Week Partner Transformation", image: "/images/IMG_7392.jpg", downloadPath: "/downloads/stronger-together.pdf" },
];

type ProgramStatus = {
  status: string;
  expiresAt: string | null;
};

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { convert } = useCurrency();

  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setOrdersHistory(data);
          const statuses: Record<string, ProgramStatus> = {};

          for (const order of data) {
            const itemsArray =
              typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];

            for (const program of ALL_PROGRAMS) {
              const hasProgram = itemsArray.some(
                (item: any) => item.id === program.id || program.altIds.includes(item.id)
              );
              if (!hasProgram) continue;

              const existing = statuses[program.id];
              if (order.status === "completed" && existing?.status !== "completed") {
                statuses[program.id] = { status: "completed", expiresAt: order.expires_at || null };
              } else if (!existing) {
                statuses[program.id] = { status: order.status, expiresAt: order.expires_at || null };
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

    if (isSignedIn && user) fetchOrders();
  }, [isSignedIn, user]);

  function isExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  function formatExpiry(expiresAt: string | null): string {
    if (!expiresAt) return "";
    return new Date(expiresAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (!isLoaded || !isSignedIn || isLoadingDB) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-700 rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Loading Vault...
        </p>
      </div>
    );
  }

  const ownedPrograms = ALL_PROGRAMS.filter((p) => programStatuses[p.id]);
  const pendingOrders = ordersHistory.filter((o) => o.status.startsWith("pending_"));

  return (
    <main className="min-h-screen bg-white text-zinc-950 py-12 md:py-16 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-zinc-200 pb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-red-700 bg-zinc-100 flex-shrink-0">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                My <span className="text-red-700">Vault</span>
              </h1>
              <p className="text-zinc-500 font-bold text-xs mt-1">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <SignOutButton>
            <button className="bg-zinc-100 hover:bg-zinc-950 hover:text-white text-zinc-700 font-black uppercase tracking-wider text-[11px] px-6 py-3 rounded-xl transition-all cursor-pointer">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT: PROGRAMS */}
          <div className="lg:col-span-2 space-y-6">
            {pendingOrders.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                <Clock className="text-amber-600 flex-shrink-0" size={22} />
                <div>
                  <h4 className="font-black uppercase text-xs text-amber-800">
                    Verification Pending
                  </h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    You have {pendingOrders.length} order(s) under review. Your programs will unlock shortly.
                  </p>
                </div>
              </div>
            )}

            {ownedPrograms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ownedPrograms.map((program) => {
                  const ps = programStatuses[program.id];
                  const isCompleted = ps.status === "completed";
                  const expired = isExpired(ps.expiresAt);
                  const isActive = isCompleted && !expired;

                  return (
                    <div
                      key={program.id}
                      className="bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden flex flex-col"
                    >
                      <div className="relative h-44 w-full bg-zinc-200">
                        <Image
                          src={program.image}
                          alt={program.name}
                          fill
                          className={`object-cover ${!isActive ? "grayscale" : ""}`}
                        />
                        <span
                          className={`absolute top-3 right-3 text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                            isActive
                              ? "bg-green-600 text-white"
                              : expired
                              ? "bg-orange-600 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {isActive ? "Unlocked" : expired ? "Expired" : "Pending"}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-black uppercase text-lg leading-tight mb-1">
                            {program.name}
                          </h3>
                          <p className="text-xs text-zinc-500 mb-5">{program.description}</p>
                        </div>

                        {isActive ? (
                          <a
                            href={program.downloadPath}
                            download
                            className="w-full bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                          >
                            <Download size={15} /> Download PDF
                          </a>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-zinc-200 text-zinc-500 font-bold uppercase text-xs py-3.5 rounded-xl cursor-not-allowed"
                          >
                            {expired ? "Access Expired" : "Waiting for Approval"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50">
                <Lock className="mx-auto text-zinc-400 mb-4" size={32} />
                <h3 className="font-black uppercase text-lg mb-2">No Active Programs</h3>
                <p className="text-xs text-zinc-500 mb-6">
                  Purchase a training or nutrition plan to unlock your PDF materials here.
                </p>
                <Link
                  href="/#programs"
                  className="inline-block bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all"
                >
                  Browse Programs
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: ORDER HISTORY */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
            <h3 className="text-sm font-black uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-zinc-200">
              <FileText size={16} className="text-red-700" /> Order History
            </h3>
            <div className="space-y-4">
              {ordersHistory.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-4">No past orders</p>
              ) : (
                ordersHistory.map((order) => (
                  <div key={order.id} className="border-b border-zinc-200/70 pb-3 last:border-0">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{formatExpiry(order.created_at)}</span>
                      <span className="font-black">{convert(order.total_price)}</span>
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
                      {order.status.startsWith("pending") ? "Pending" : order.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}