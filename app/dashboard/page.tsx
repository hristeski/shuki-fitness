"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";
import { WORKOUT_DAYS, NUTRITION_PLANS_DATA } from "../data/vaultContent";
import {
  Download,
  Lock,
  Clock,
  FileText,
  PlayCircle,
  Utensils,
  Dumbbell,
  User,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Circle,
  ExternalLink,
  Flame,
} from "lucide-react";

const ALL_PROGRAMS = [
  {
    id: "men-beginner",
    type: "training",
    altIds: ["beginner-program", "beginner-1", "men-beginner-2x", "men-beginner-3x", "men-beginner-4x"],
    name: "Men's Beginner Gym Plan",
    description: "8-Week Foundation Blueprint",
    image: "/images/beginner.jpg",
    downloadPath: "/downloads/beginner-program.pdf",
  },
  {
    id: "men-advanced",
    type: "training",
    altIds: ["advanced-program", "advanced-1", "men-advanced-2x", "men-advanced-3x", "men-advanced-4x"],
    name: "Men's Advanced Gym Plan",
    description: "8-Week Muscle Domination Plan",
    image: "/images/advanced.jpg",
    downloadPath: "/downloads/advanced-program.pdf",
  },
  {
    id: "women-beginner",
    type: "training",
    altIds: ["women-beginner-2x", "women-beginner-3x", "women-beginner-4x"],
    name: "Women's Beginner Gym Plan",
    description: "8-Week Toning & Conditioning",
    image: "/images/women-beginner.jpg",
    downloadPath: "/downloads/women-beginner.pdf",
  },
  {
    id: "women-advanced",
    type: "training",
    altIds: ["women-advanced-2x", "women-advanced-3x", "women-advanced-4x"],
    name: "Women's Advanced Gym Plan",
    description: "8-Week Sculpted Physique Plan",
    image: "/images/woman-advanced.webp",
    downloadPath: "/downloads/women-advanced.pdf",
  },
  {
    id: "men-home",
    type: "training",
    altIds: ["men-home-beginner-2x", "men-home-beginner-3x", "men-home-beginner-4x"],
    name: "Men's Home Workout Plan",
    description: "8-Week Home Bodyweight & Dumbbell",
    image: "/images/IMG_7392.jpg",
    downloadPath: "/downloads/men-home.pdf",
  },
  {
    id: "women-home",
    type: "training",
    altIds: ["women-home-beginner-2x", "women-home-beginner-3x", "women-home-beginner-4x"],
    name: "Women's Home Sculpt Plan",
    description: "8-Week Home Training Program",
    image: "/images/women-home.webp",
    downloadPath: "/downloads/women-home.pdf",
  },
  {
    id: "nutrition-bulking",
    type: "nutrition",
    altIds: ["men-nutrition-bulking", "women-nutrition-bulking"],
    name: "Bulking Nutrition Plan",
    description: "Clean Muscle Surplus Guide",
    image: "/images/nutrition1.jpg",
    downloadPath: "/downloads/bulking-plan.pdf",
  },
  {
    id: "nutrition-cutting",
    type: "nutrition",
    altIds: ["men-nutrition-cutting", "women-nutrition-cutting"],
    name: "Cutting Nutrition Plan",
    description: "Shred & Definition Guide",
    image: "/images/nutrition2.png",
    downloadPath: "/downloads/cutting-plan.pdf",
  },
  {
    id: "nutrition-vegan",
    type: "nutrition",
    altIds: ["men-nutrition-vegan", "women-nutrition-vegan"],
    name: "Vegan Nutrition Plan",
    description: "100% Plant-Based Performance",
    image: "/images/nutrition3.jpg",
    downloadPath: "/downloads/vegan-plan.pdf",
  },
  {
    id: "combo-bundle",
    type: "both",
    altIds: ["combo-bundle-men", "combo-bundle-women"],
    name: "Complete Transformation Package",
    description: "Training + Nutrition Bundle",
    image: "/images/complete-transformation-men.jpg",
    downloadPath: "/downloads/combo-bundle.pdf",
  },
  {
    id: "stronger-together-duo",
    type: "both",
    altIds: [],
    name: "Stronger Together (Duo Plan)",
    description: "8-Week Partner Transformation",
    image: "/images/IMG_7392.jpg",
    downloadPath: "/downloads/stronger-together.pdf",
  },
];

const ADMIN_EMAILS = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];
const WHATSAPP_NUMBER = "38977852645";

type ProgramStatus = {
  status: string;
  expiresAt: string | null;
};

type DashboardTab = "programs" | "nutrition" | "coaching" | "profile";

function DashboardContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { convert } = useCurrency();

  const [activeTab, setActiveTab] = useState<DashboardTab>("programs");
  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  // Interactive Workout Tracker State
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});

  // Interactive Nutrition Swapper State
  const [nutritionMode, setNutritionMode] = useState<"cutting" | "bulking" | "vegan">("cutting");
  const [mealSwapIndex, setMealSwapIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const tabParam = searchParams.get("tab") as DashboardTab | null;
    if (tabParam && ["programs", "nutrition", "coaching", "profile"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  // Load saved exercise checkboxes per user
  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`evo_checked_${user.id}`);
    if (saved) {
      try {
        setCheckedExercises(JSON.parse(saved));
      } catch {}
    }
  }, [user]);

  const toggleExercise = (exerciseId: string) => {
    if (!user) return;
    setCheckedExercises((prev) => {
      const updated = { ...prev, [exerciseId]: !prev[exerciseId] };
      localStorage.setItem(`evo_checked_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSwapMeal = (slotId: string, optionsLength: number) => {
    setMealSwapIndex((prev) => ({
      ...prev,
      [slotId]: ((prev[slotId] || 0) + 1) % optionsLength,
    }));
  };

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

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (!isLoaded || !isSignedIn || isLoadingDB) {
    return (
      <div className="min-h-screen bg-evo-surface flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-red-800 rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">
          Loading Member Vault...
        </p>
      </div>
    );
  }

  const isAdmin = ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress || "");
  const ownedPrograms = ALL_PROGRAMS.filter((p) => programStatuses[p.id]);

  const activeOwned = ownedPrograms.filter(
    (p) =>
      programStatuses[p.id]?.status === "completed" &&
      !isExpired(programStatuses[p.id]?.expiresAt)
  );

  const hasTrainingAccess =
    isAdmin || activeOwned.some((p) => p.type === "training" || p.type === "both");
  const hasNutritionAccess =
    isAdmin || activeOwned.some((p) => p.type === "nutrition" || p.type === "both");

  const pendingOrders = ordersHistory.filter((o) => o.status.startsWith("pending_"));

  // Current workout day calculations
  const currentDay = WORKOUT_DAYS[selectedDayIdx];
  const dayCompletedCount = currentDay.exercises.filter((ex) => checkedExercises[ex.id]).length;
  const dayProgressPercent = Math.round((dayCompletedCount / currentDay.exercises.length) * 100);

  // Dynamic daily nutrition macro totals based on swapped meals
  const activeMealSlots = NUTRITION_PLANS_DATA[nutritionMode];
  const dailyTotals = activeMealSlots.reduce(
    (acc, slot) => {
      const meal = slot.options[mealSwapIndex[slot.id] || 0];
      return {
        kcal: acc.kcal + meal.kcal,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 py-8 md:py-14 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 border-b border-stone-200 pb-6 gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-red-800 bg-stone-100 flex-shrink-0 shadow-md">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-800">
                {isAdmin ? "Admin Preview Mode" : "Evolution Body Member"}
              </p>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mt-1">
                My <span className="text-red-800">Vault</span>
              </h1>
              <p className="text-stone-500 font-bold text-xs mt-1">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-[11px] px-5 py-3 rounded-xl transition-all"
              >
                Open Admin Panel
              </Link>
            )}
            <SignOutButton>
              <button className="bg-white border border-stone-200 hover:bg-stone-950 hover:text-white text-stone-700 font-black uppercase tracking-wider text-[11px] px-5 py-3 rounded-xl transition-all cursor-pointer">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "programs", label: "Programs", icon: Dumbbell, locked: !hasTrainingAccess },
            { id: "nutrition", label: "Nutrition", icon: Utensils, locked: !hasNutritionAccess },
            { id: "coaching", label: "1-on-1 Coaching", icon: Sparkles, locked: false },
            { id: "profile", label: "Profile & Orders", icon: User, locked: false },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  active
                    ? tab.id === "nutrition"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "bg-red-800 text-white shadow-md shadow-red-900/20"
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-950"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                {tab.locked && <Lock size={12} className="opacity-70" />}
              </button>
            );
          })}
        </div>

        {/* PENDING ORDER ALERT */}
        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 mb-8">
            <Clock className="text-amber-600 flex-shrink-0" size={22} />
            <div>
              <h4 className="font-black uppercase text-xs text-amber-900">
                Payment Verification Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                You have {pendingOrders.length} order(s) under review. As soon as your payment is confirmed, your Vault unlocks automatically.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: PROGRAMS (DAYS, CHECKBOXES, VIDEOS & PDF DOWNLOAD)    */}
        {/* ============================================================ */}
        {activeTab === "programs" &&
          (hasTrainingAccess ? (
            <div className="space-y-8">
              {/* DOWNLOADABLE PDF CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(ownedPrograms.length > 0 ? ownedPrograms : ALL_PROGRAMS.slice(0, 1)).map(
                  (program) => {
                    const ps = programStatuses[program.id];
                    const isUnlocked =
                      isAdmin || (ps?.status === "completed" && !isExpired(ps?.expiresAt));

                    return (
                      <div
                        key={program.id}
                        className="bg-white border border-stone-200 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-stone-900 flex-shrink-0">
                            <Image src={program.image} alt={program.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase text-emerald-600">
                              {isUnlocked ? "Active Plan" : "Pending"}
                            </p>
                            <h3 className="font-black uppercase text-sm truncate">{program.name}</h3>
                            <p className="text-[11px] text-stone-500 truncate">{program.description}</p>
                          </div>
                        </div>

                        {isUnlocked && (
                          <a
                            href={program.downloadPath}
                            download
                            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-red-800 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider px-4 py-3 rounded-xl transition-all active:scale-95"
                          >
                            <Download size={14} /> PDF
                          </a>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* INTERACTIVE DAILY WORKOUT TRACKER */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-800">
                      Interactive Workout Tracker
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-0.5">
                      {currentDay.day}: {currentDay.title}
                    </h2>
                    <p className="text-xs font-bold text-stone-500 mt-1">
                      {currentDay.focus} • {currentDay.duration}
                    </p>
                  </div>

                  {/* DAY SELECTOR BUTTONS */}
                  <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                    {WORKOUT_DAYS.map((d, idx) => (
                      <button
                        key={d.day}
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          selectedDayIdx === idx
                            ? "bg-stone-950 text-white shadow-sm"
                            : "text-stone-600 hover:bg-white"
                        }`}
                      >
                        {d.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="mb-6">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                    <span className="text-stone-500">Today&apos;s Completion</span>
                    <span className="text-red-800">
                      {dayCompletedCount}/{currentDay.exercises.length} Completed ({dayProgressPercent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-800 rounded-full transition-all duration-500"
                      style={{ width: `${dayProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* EXERCISES LIST WITH CHECKBOXES + VIDEO WATCH/DOWNLOAD */}
                <div className="space-y-3">
                  {currentDay.exercises.map((ex) => {
                    const isDone = !!checkedExercises[ex.id];
                    return (
                      <div
                        key={ex.id}
                        className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isDone
                            ? "bg-emerald-50/60 border-emerald-300"
                            : "bg-stone-50 border-stone-200/80 hover:border-stone-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleExercise(ex.id)}
                          className="flex items-start sm:items-center gap-3.5 text-left flex-1 cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2
                              size={24}
                              className="text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0"
                            />
                          ) : (
                            <Circle
                              size={24}
                              className="text-stone-400 flex-shrink-0 mt-0.5 sm:mt-0"
                            />
                          )}
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-800">
                              {ex.muscleGroup}
                            </span>
                            <h3
                              className={`font-black uppercase text-sm sm:text-base leading-tight ${
                                isDone ? "line-through text-stone-400" : "text-stone-950"
                              }`}
                            >
                              {ex.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <span className="bg-white border border-stone-200 text-stone-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                                {ex.sets} Sets
                              </span>
                              <span className="bg-white border border-stone-200 text-stone-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                                {ex.reps} Reps
                              </span>
                              <span className="bg-white border border-stone-200 text-stone-500 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md">
                                Rest: {ex.rest}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* VIDEO WATCH / DOWNLOAD ACTIONS */}
                        <div className="flex items-center gap-2 pl-9 sm:pl-0 flex-shrink-0">
                          <a
                            href={ex.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-stone-950 hover:bg-red-800 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all"
                          >
                            <PlayCircle size={14} /> Watch Video
                          </a>
                          <a
                            href={ex.videoUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download Video Guide"
                            className="inline-flex items-center justify-center w-9 h-9 bg-white border border-stone-200 hover:border-red-800 text-stone-700 hover:text-red-800 rounded-xl transition-all"
                          >
                            <Download size={15} />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center">
              <Lock className="mx-auto text-red-800 mb-4" size={32} />
              <h3 className="font-black uppercase text-xl mb-2">Training Programs Locked</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                Purchase any Gym or Home Training Plan (or Complete Transformation Package) to unlock your daily workouts, checkboxes, PDFs, and exercise videos.
              </p>
              <Link
                href="/#programs"
                className="inline-block bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
              >
                Choose a Program
              </Link>
            </div>
          ))}

        {/* ============================================================ */}
        {/* TAB 2: NUTRITION (DAILY MACROS + MEAL SWAP + PDF DOWNLOAD)   */}
        {/* ============================================================ */}
        {activeTab === "nutrition" &&
          (hasNutritionAccess ? (
            <div className="space-y-6">
              {/* TOP MODE SWITCHER + DOWNLOAD PDF */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {(["cutting", "bulking", "vegan"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setNutritionMode(mode)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        nutritionMode === mode
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {mode} Plan
                    </button>
                  ))}
                </div>

                <a
                  href={`/downloads/${nutritionMode}-plan.pdf`}
                  download
                  className="inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all"
                >
                  <Download size={15} /> Download Nutrition PDF
                </a>
              </div>

              {/* LIVE DAILY INTAKE SUMMARY (UPDATES WHEN MEALS ARE SWAPPED!) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: "Daily Calories", value: `${dailyTotals.kcal} kcal`, accent: "text-red-800", icon: Flame },
                  { label: "Protein", value: `${dailyTotals.protein}g`, accent: "text-emerald-700", icon: Dumbbell },
                  { label: "Carbohydrates", value: `${dailyTotals.carbs}g`, accent: "text-blue-700", icon: Utensils },
                  { label: "Healthy Fats", value: `${dailyTotals.fats}g`, accent: "text-amber-600", icon: Sparkles },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      {stat.label}
                    </p>
                    <p className={`text-2xl sm:text-3xl font-black mt-1 ${stat.accent}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* MEAL CARDS WITH SWAP BUTTON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeMealSlots.map((slot) => {
                  const currentIdx = mealSwapIndex[slot.id] || 0;
                  const meal = slot.options[currentIdx];

                  return (
                    <div
                      key={slot.id}
                      className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                            {slot.slotName} • {slot.time}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSwapMeal(slot.id, slot.options.length)}
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-stone-100 hover:bg-emerald-600 text-stone-700 hover:text-white px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            <RefreshCw size={12} /> Swap Meal ({currentIdx + 1}/{slot.options.length})
                          </button>
                        </div>

                        <h3 className="text-lg font-black uppercase tracking-tight text-stone-950 mb-2">
                          {meal.name}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed mb-5">
                          {meal.ingredients}
                        </p>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-stone-100 text-center">
                        <div className="bg-stone-50 rounded-xl py-2">
                          <p className="text-[9px] font-bold uppercase text-stone-400">Kcal</p>
                          <p className="text-xs font-black text-stone-950">{meal.kcal}</p>
                        </div>
                        <div className="bg-emerald-50/70 rounded-xl py-2">
                          <p className="text-[9px] font-bold uppercase text-emerald-700">Protein</p>
                          <p className="text-xs font-black text-emerald-800">{meal.protein}g</p>
                        </div>
                        <div className="bg-blue-50/70 rounded-xl py-2">
                          <p className="text-[9px] font-bold uppercase text-blue-700">Carbs</p>
                          <p className="text-xs font-black text-blue-800">{meal.carbs}g</p>
                        </div>
                        <div className="bg-amber-50/70 rounded-xl py-2">
                          <p className="text-[9px] font-bold uppercase text-amber-700">Fats</p>
                          <p className="text-xs font-black text-amber-800">{meal.fats}g</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center">
              <Lock className="mx-auto text-emerald-600 mb-4" size={32} />
              <h3 className="font-black uppercase text-xl mb-2">Nutrition Plans Locked</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                Purchase a Bulking, Cutting, Vegan Nutrition Plan or Complete Transformation Package to unlock daily macros and instant meal swaps.
              </p>
              <Link
                href="/#programs"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
              >
                Explore Nutrition Plans
              </Link>
            </div>
          ))}

        {/* ============================================================ */}
        {/* TAB 3: 1-ON-1 COACHING DIRECT ACCESS                         */}
        {/* ============================================================ */}
        {activeTab === "coaching" && (
          <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#25D366]/15 text-[#25D366] text-[10px] font-black uppercase tracking-widest">
                Direct Coach Line
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
                1-on-1 Coaching With <span className="text-red-500">Andrej Angjeleski</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xl">
                Already a member and want weekly check-ins, custom macro adjustments, or exercise form reviews? Message Coach Andrej directly on WhatsApp.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi Andrej! I'm a member on Evolution Body (${user.primaryEmailAddress?.emailAddress}) and I'd like to discuss 1-on-1 Online Coaching.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-stone-950 font-black uppercase tracking-wider text-xs py-4 px-6 rounded-2xl text-center transition-all flex items-center justify-center gap-2"
              >
                Message on WhatsApp <ExternalLink size={15} />
              </a>
              <Link
                href="/coaching"
                className="w-full bg-white/10 hover:bg-white hover:text-stone-950 text-white font-black uppercase tracking-wider text-xs py-4 px-6 rounded-2xl text-center transition-all"
              >
                View Coaching Details
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PROFILE & ORDER HISTORY                               */}
        {/* ============================================================ */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-stone-100">
                <FileText size={16} className="text-red-800" /> Order History
              </h3>
              <div className="space-y-4">
                {ordersHistory.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-6">No orders yet.</p>
                ) : (
                  ordersHistory.map((order) => (
                    <div
                      key={order.id}
                      className="border-b border-stone-100 pb-3.5 last:border-0 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-black text-stone-900">
                          {formatDate(order.created_at)}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {order.items?.map((i: any) => i.name).join(", ")}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-stone-950">
                          {convert(order.total_price)}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            order.status === "completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.status.startsWith("pending")
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {order.status.startsWith("pending") ? "Pending" : order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-stone-950 text-white rounded-3xl p-7 flex flex-col justify-between shadow-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                  Need Assistance?
                </p>
                <h3 className="text-2xl font-black uppercase mb-2">Evolution Body Support</h3>
                <p className="text-xs text-stone-400 leading-relaxed mb-6">
                  Have a question about your payment verification, downloads, or workout plan? Reach out directly and we&apos;ll help right away.
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full text-center bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all"
              >
                Contact Support
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
        <div className="min-h-screen bg-evo-surface flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-red-800 rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}