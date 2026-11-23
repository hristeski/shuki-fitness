"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";
import {
  Download,
  Lock,
  Clock,
  FileText,
  PlayCircle,
  ChefHat,
  Dumbbell,
  ExternalLink,
  User,
} from "lucide-react";

const ALL_PROGRAMS = [
  {
    id: "men-beginner",
    altIds: ["beginner-program", "beginner-1", "men-beginner-2x", "men-beginner-3x", "men-beginner-4x"],
    name: "Men's Beginner Plan",
    description: "8-Week Foundation Blueprint",
    image: "/images/beginner.jpg",
    downloadPath: "/downloads/beginner-program.pdf",
  },
  {
    id: "men-advanced",
    altIds: ["advanced-program", "advanced-1", "men-advanced-2x", "men-advanced-3x", "men-advanced-4x"],
    name: "Men's Advanced Plan",
    description: "8-Week Muscle Domination Plan",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/advanced-program.pdf",
  },
  {
    id: "women-beginner",
    altIds: ["women-beginner-2x", "women-beginner-3x", "women-beginner-4x"],
    name: "Women's Beginner Plan",
    description: "8-Week Toning & Conditioning",
    image: "/images/beginner.jpg",
    downloadPath: "/downloads/women-beginner.pdf",
  },
  {
    id: "women-advanced",
    altIds: ["women-advanced-2x", "women-advanced-3x", "women-advanced-4x"],
    name: "Women's Advanced Plan",
    description: "8-Week Sculpted Physique Plan",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/women-advanced.pdf",
  },
  {
    id: "men-home",
    altIds: [
      "men-home-beginner-2x", "men-home-beginner-3x", "men-home-beginner-4x",
      "men-home-advanced-2x", "men-home-advanced-3x", "men-home-advanced-4x",
    ],
    name: "Men's Home Workout Plan",
    description: "8-Week Home Training Program",
    image: "/images/IMG_7392.jpg",
    downloadPath: "/downloads/men-home.pdf",
  },
  {
    id: "women-home",
    altIds: [
      "women-home-beginner-2x", "women-home-beginner-3x", "women-home-beginner-4x",
      "women-home-advanced-2x", "women-home-advanced-3x", "women-home-advanced-4x",
    ],
    name: "Women's Home Workout Plan",
    description: "8-Week Home Sculpt Program",
    image: "/images/women3.jpg",
    downloadPath: "/downloads/women-home.pdf",
  },
  {
    id: "nutrition-bulking",
    altIds: ["men-nutrition-bulking", "women-nutrition-bulking"],
    name: "Bulking Nutrition Plan",
    description: "Clean Muscle Surplus Guide",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/bulking-plan.pdf",
  },
  {
    id: "nutrition-cutting",
    altIds: ["men-nutrition-cutting", "women-nutrition-cutting"],
    name: "Cutting Nutrition Plan",
    description: "Shred & Definition Guide",
    image: "/images/beginner.jpg",
    downloadPath: "/downloads/cutting-plan.pdf",
  },
  {
    id: "combo-bundle",
    altIds: [],
    name: "Complete Transformation Package",
    description: "Training + Nutrition Bundle",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/combo-bundle.pdf",
  },
  {
    id: "stronger-together-duo",
    altIds: [],
    name: "Stronger Together (Duo Plan)",
    description: "8-Week Partner Transformation",
    image: "/images/IMG_7392.jpg",
    downloadPath: "/downloads/stronger-together.pdf",
  },
];

const MUSCLE_GROUPS = [
  { name: "Chest", url: "https://www.muscleandstrength.com/exercises/chest" },
  { name: "Back", url: "https://www.muscleandstrength.com/exercises/lats" },
  { name: "Shoulders", url: "https://www.muscleandstrength.com/exercises/shoulders" },
  { name: "Biceps & Triceps", url: "https://www.muscleandstrength.com/exercises/biceps" },
  { name: "Legs & Glutes", url: "https://www.muscleandstrength.com/exercises/quads" },
  { name: "Abs & Core", url: "https://www.muscleandstrength.com/exercises/abs" },
];

const MEMBER_RECIPES = [
  {
    category: "Cutting",
    title: "Crispy Garlic Chicken & Roasted Sweet Potato",
    kcal: 460,
    protein: "48g",
    carbs: "42g",
    fats: "10g",
    steps: "Season 180g chicken breast, air-fry 6-7 min per side, serve with 180g roasted sweet potato and broccoli.",
  },
  {
    category: "Bulking",
    title: "Anabolic Peanut Butter & Banana Protein Oats",
    kcal: 720,
    protein: "46g",
    carbs: "84g",
    fats: "21g",
    steps: "Cook 100g oats, stir in 1 scoop whey off heat, top with 1 banana and 1 tbsp peanut butter.",
  },
  {
    category: "Cutting",
    title: "Greek Yogurt Berry & Honey Power Bowl",
    kcal: 310,
    protein: "34g",
    carbs: "32g",
    fats: "4g",
    steps: "Mix 250g 0% Greek yogurt with half scoop whey, top with 80g berries and 1 tsp honey.",
  },
  {
    category: "Bulking",
    title: "Lean Beef & Jasmine Rice Power Skillet",
    kcal: 690,
    protein: "52g",
    carbs: "75g",
    fats: "18g",
    steps: "Brown 200g lean ground beef with garlic and soy sauce, fold in 220g cooked jasmine rice and peppers.",
  },
];

type ProgramStatus = {
  status: string;
  expiresAt: string | null;
};

type DashboardTab = "programs" | "videos" | "recipes" | "profile";

function DashboardContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { convert } = useCurrency();

  const [activeTab, setActiveTab] = useState<DashboardTab>("programs");
  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as DashboardTab | null;
    if (tabParam && ["programs", "videos", "recipes", "profile"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
          Loading Evolution Body Vault...
        </p>
      </div>
    );
  }

  const ownedPrograms = ALL_PROGRAMS.filter((p) => programStatuses[p.id]);
  const hasActiveSubscription = ownedPrograms.some(
    (p) =>
      programStatuses[p.id]?.status === "completed" &&
      !isExpired(programStatuses[p.id]?.expiresAt)
  );
  const pendingOrders = ordersHistory.filter((o) => o.status.startsWith("pending_"));

  return (
    <main className="min-h-screen bg-white text-zinc-950 py-10 md:py-16 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 border-b border-zinc-200 pb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-red-700 bg-zinc-100 flex-shrink-0">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-700">
                Evolution Body Member
              </p>
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

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { id: "programs", label: "My Programs", icon: Dumbbell },
            { id: "videos", label: "Exercise Videos", icon: PlayCircle },
            { id: "recipes", label: "Healthy Recipes", icon: ChefHat },
            { id: "profile", label: "Profile & Orders", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-red-700 text-white shadow-md shadow-red-700/20"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {!hasActiveSubscription && (tab.id === "videos" || tab.id === "recipes") && (
                  <Lock size={12} />
                )}
              </button>
            );
          })}
        </div>

        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 mb-8">
            <Clock className="text-amber-600 flex-shrink-0" size={22} />
            <div>
              <h4 className="font-black uppercase text-xs text-amber-800">
                Verification Pending
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                You have {pendingOrders.length} order(s) under review. Your programs, videos, and recipes will unlock shortly.
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: PROGRAMS */}
        {activeTab === "programs" &&
          (ownedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                Purchase any program to unlock your PDFs, Exercise Videos, and Healthy Recipes.
              </p>
              <Link
                href="/#programs"
                className="inline-block bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
              >
                Browse Programs
              </Link>
            </div>
          ))}

        {/* TAB 2: EXERCISE VIDEOS */}
        {activeTab === "videos" &&
          (hasActiveSubscription ? (
            <div className="space-y-6">
              <div className="bg-zinc-950 text-white rounded-3xl p-7">
                <span className="inline-block px-3 py-1 rounded-full bg-red-700/20 text-red-400 text-[10px] font-black uppercase tracking-widest mb-3">
                  Custom Evolution Body Videos — Coming Soon
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                  Exercise Video Library
                </h2>
                <p className="text-xs text-zinc-400 mb-5">
                  While Coach Andrej films our exclusive HD library, use these verified video form guides by muscle group.
                </p>
                <a
                  href="https://www.muscleandstrength.com/exercises"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl"
                >
                  Open Full Database <ExternalLink size={14} />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MUSCLE_GROUPS.map((g) => (
                  <a
                    key={g.name}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-50 border border-zinc-200 hover:border-red-700 rounded-2xl p-5 flex items-center justify-between transition-all"
                  >
                    <span className="font-black uppercase text-sm">{g.name}</span>
                    <PlayCircle className="text-red-700" size={20} />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50">
              <Lock className="mx-auto text-red-700 mb-4" size={32} />
              <h3 className="font-black uppercase text-lg mb-2">Members-Only Exercise Videos</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Purchase any training or nutrition program to unlock the Exercise Video Library.
              </p>
              <Link
                href="/#programs"
                className="inline-block bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
              >
                Unlock Access
              </Link>
            </div>
          ))}

        {/* TAB 3: HEALTHY RECIPES */}
        {activeTab === "recipes" &&
          (hasActiveSubscription ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {MEMBER_RECIPES.map((r) => (
                <div key={r.title} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                  <span className="inline-block bg-red-50 text-red-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full mb-3">
                    {r.category}
                  </span>
                  <h3 className="font-black uppercase text-base mb-3">{r.title}</h3>
                  <div className="flex gap-3 text-[11px] font-bold text-zinc-600 mb-3">
                    <span>{r.kcal} kcal</span>
                    <span>•</span>
                    <span>P: {r.protein}</span>
                    <span>C: {r.carbs}</span>
                    <span>F: {r.fats}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{r.steps}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center bg-zinc-50">
              <Lock className="mx-auto text-red-700 mb-4" size={32} />
              <h3 className="font-black uppercase text-lg mb-2">Members-Only Recipes</h3>
              <p className="text-xs text-zinc-500 mb-6">
                Purchase any program to unlock our high-protein Bulking &amp; Cutting recipes.
              </p>
              <Link
                href="/#programs"
                className="inline-block bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
              >
                Unlock Access
              </Link>
            </div>
          ))}

        {/* TAB 4: PROFILE & ORDER HISTORY */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <div className="bg-zinc-950 text-white rounded-3xl p-7 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                  Need Support?
                </p>
                <h3 className="text-2xl font-black uppercase mb-2">
                  Evolution Body Support
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  Have a question about your program, recipes, or want to upgrade to 1-on-1 coaching with Andrej Angjeleski?
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full text-center bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all"
              >
                Contact Coach
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-red-700 rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}