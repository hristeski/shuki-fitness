"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrency } from "@/app/context/CurrencyContext";
import {
  WEEK_DAYS,
  WEEKLY_SCHEDULES,
  REST_DAY_HABITS,
  NUTRITION_PLANS_DATA,
  WeeklyFreq,
} from "../data/vaultContent";
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
  ArrowLeft,
  ChevronRight,
  Calendar,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  HeartPulse,
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

const TAB_LABELS: Record<DashboardTab, string> = {
  programs: "Programs",
  nutrition: "Nutrition",
  coaching: "1-on-1 Coaching",
  profile: "Profile & Orders",
};

function DashboardContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { convert } = useCurrency();

  // Автоматско препознавање на денешниот ден (0 = Monday ... 6 = Sunday)
  const [todayIdx] = useState<number>(() => (new Date().getDay() + 6) % 7);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => (new Date().getDay() + 6) % 7);

  const [activeTab, setActiveTab] = useState<DashboardTab>("programs");
  const [weeklyFreq, setWeeklyFreq] = useState<WeeklyFreq>("4x");
  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  // Interactive Exercise & Rest Habit Checkboxes
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Built-in Rest Timer (seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

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

  // Load saved user progress & chosen training frequency
  useEffect(() => {
    if (!user) return;
    const savedChecks = localStorage.getItem(`evo_checked_${user.id}`);
    if (savedChecks) {
      try {
        setCheckedItems(JSON.parse(savedChecks));
      } catch {}
    }
    const savedFreq = localStorage.getItem(`evo_freq_${user.id}`) as WeeklyFreq | null;
    if (savedFreq && ["2x", "3x", "4x", "5x"].includes(savedFreq)) {
      setWeeklyFreq(savedFreq);
    }
  }, [user]);

  // Countdown Timer Effect
  useEffect(() => {
    if (!timerRunning) return;
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const handleSelectFreq = (f: WeeklyFreq) => {
    setWeeklyFreq(f);
    if (user) localStorage.setItem(`evo_freq_${user.id}`, f);
  };

  const toggleCheck = (key: string) => {
    if (!user) return;
    setCheckedItems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
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
        const res = await fetch("/api/orders");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load orders");

        const data = json.orders || [];
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
      } catch (err: any) {
        console.error("Error fetching orders:", err?.message || err);
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

  function formatTimer(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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

  // Weekly Schedule Calculations
  const currentSchedule = WEEKLY_SCHEDULES[weeklyFreq];
  const selectedDayInfo = WEEK_DAYS[selectedDayIdx];
  const todayInfo = WEEK_DAYS[todayIdx];
  const selectedWorkout = currentSchedule[selectedDayIdx];
  const isViewingToday = selectedDayIdx === todayIdx;

  // Progress for selected day
  const dayCheckPrefix = `${weeklyFreq}-d${selectedDayIdx}`;
  const completedExCount = selectedWorkout
    ? selectedWorkout.exercises.filter((ex) => checkedItems[`${dayCheckPrefix}-${ex.id}`]).length
    : 0;
  const dayProgressPercent = selectedWorkout
    ? Math.round((completedExCount / selectedWorkout.exercises.length) * 100)
    : 0;

  // Weekly total completed workouts
  const totalScheduledWorkouts = Object.values(currentSchedule).filter(Boolean).length;
  const completedWorkoutsThisWeek = WEEK_DAYS.filter((d) => {
    const w = currentSchedule[d.index];
    if (!w) return false;
    return w.exercises.every((ex) => checkedItems[`${weeklyFreq}-d${d.index}-${ex.id}`]);
  }).length;

  // Find next workout day index (for Rest Day quick-jump button)
  const nextWorkoutDayIdx =
    WEEK_DAYS.find((d) => d.index > selectedDayIdx && currentSchedule[d.index] !== null)?.index ??
    WEEK_DAYS.find((d) => currentSchedule[d.index] !== null)?.index ??
    0;

  // Nutrition totals
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

  const totalMacroGrams = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fats || 1;

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 py-6 md:py-10 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 1. BREADCRUMB & BACK NAVIGATION BAR (SO USER NEVER GETS LOST) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {activeTab !== "programs" ? (
              <button
                onClick={() => setActiveTab("programs")}
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-950 text-stone-800 hover:text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Programs
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-950 text-stone-800 hover:text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-colors"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            )}

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={13} />
              <span className="text-stone-600">Member Vault</span>
              <ChevronRight size={13} />
              <span className="text-red-800 font-black uppercase">
                {TAB_LABELS[activeTab]}
              </span>
              {activeTab === "programs" && hasTrainingAccess && (
                <>
                  <ChevronRight size={13} />
                  <span className="text-stone-950 font-black">
                    {selectedDayInfo.full}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-800 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl">
              <Calendar size={12} /> Today: {todayInfo.full}
            </span>
          </div>
        </div>

        {/* 2. MEMBER PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-7 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-red-800 bg-stone-100 flex-shrink-0 shadow-md">
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-800">
                {isAdmin ? "Admin Preview Mode" : "Evolution Body Member"}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none mt-0.5">
                Welcome, <span className="text-red-800">{user.firstName || "Athlete"}</span>
              </h1>
              <p className="text-stone-500 font-bold text-xs mt-1">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-[11px] px-4 py-2.5 rounded-xl transition-all"
              >
                Admin Panel
              </Link>
            )}
            <SignOutButton>
              <button className="bg-white border border-stone-200 hover:bg-stone-950 hover:text-white text-stone-700 font-black uppercase tracking-wider text-[11px] px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* 3. MAIN VAULT TABS */}
        <div className="flex flex-wrap gap-2 mb-7">
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
                    : "bg-white border border-stone-200 text-stone-600 hover:text-stone-950 hover:border-stone-300"
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
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 mb-7">
            <Clock className="text-amber-600 flex-shrink-0" size={22} />
            <div>
              <h4 className="font-black uppercase text-xs text-amber-900">
                Payment Verification Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                You have {pendingOrders.length} order(s) under review. As soon as confirmed, your Vault unlocks automatically.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: INTERACTIVE PROGRAMS HUB                              */}
        {/* ============================================================ */}
        {activeTab === "programs" &&
          (hasTrainingAccess ? (
            <div className="space-y-6">
              {/* HERO COMMAND CENTER: WEEKLY FREQUENCY + MONDAY–SUNDAY CALENDAR */}
              <div className="bg-stone-950 text-white rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-stone-800">
                <div className="absolute -right-24 -top-24 w-72 h-72 bg-red-800/30 blur-[110px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* TOP ROW: WEEKLY GOAL + FREQUENCY PICKER */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 mb-1.5">
                        <Trophy size={13} /> Weekly Training Planner
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                        {isViewingToday
                          ? `Today's Plan — ${todayInfo.full}`
                          : `${selectedDayInfo.full}'s Plan`}
                      </h2>
                      <p className="text-xs text-stone-400 mt-1">
                        Weekly progress:{" "}
                        <strong className="text-white">
                          {completedWorkoutsThisWeek} / {totalScheduledWorkouts} workouts completed
                        </strong>
                      </p>
                    </div>

                    {/* TRAINING DAYS PER WEEK SELECTOR */}
                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center gap-2.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">
                        Days / Week:
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(["2x", "3x", "4x", "5x"] as WeeklyFreq[]).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => handleSelectFreq(f)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                              weeklyFreq === f
                                ? "bg-red-800 text-white shadow-md shadow-red-900/40"
                                : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 7-DAY INTERACTIVE STRIP (MONDAY – SUNDAY) */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                    {WEEK_DAYS.map((day) => {
                      const workout = currentSchedule[day.index];
                      const isToday = day.index === todayIdx;
                      const isSelected = day.index === selectedDayIdx;
                      const isCompleted =
                        workout !== null &&
                        workout.exercises.every(
                          (ex) => checkedItems[`${weeklyFreq}-d${day.index}-${ex.id}`]
                        );

                      return (
                        <button
                          key={day.short}
                          type="button"
                          onClick={() => setSelectedDayIdx(day.index)}
                          className={`relative rounded-2xl p-2 sm:p-3.5 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-white text-stone-950 border-white shadow-xl scale-[1.03]"
                              : isToday
                              ? "bg-stone-900 text-white border-red-600/80 hover:bg-stone-800"
                              : "bg-stone-900/60 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-white"
                          }`}
                        >
                          {isToday && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-700 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                              Today
                            </span>
                          )}

                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">
                            {day.short}
                          </span>

                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : workout ? (
                              <Dumbbell
                                size={15}
                                className={isSelected ? "text-red-800" : "text-red-500"}
                              />
                            ) : (
                              <HeartPulse
                                size={15}
                                className={isSelected ? "text-stone-400" : "text-stone-600"}
                              />
                            )}
                          </div>

                          <span
                            className={`hidden sm:block text-[9px] font-bold uppercase tracking-wider ${
                              isSelected ? "text-stone-500" : "text-stone-500"
                            }`}
                          >
                            {workout ? "Train" : "Rest"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!isViewingToday && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedDayIdx(todayIdx)}
                        className="text-[11px] font-black uppercase tracking-wider text-red-400 hover:text-white transition-colors cursor-pointer"
                      >
                        ← Jump back to Today ({todayInfo.full})
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SELECTED DAY WORKOUT OR ACTIVE RECOVERY */}
              {selectedWorkout ? (
                <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-8 shadow-sm">
                  {/* WORKOUT HEADER + BUILT-IN REST TIMER */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-50 text-red-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                          {selectedDayInfo.full} • {weeklyFreq} Split
                        </span>
                        {isViewingToday && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                            Recommended Today
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-950 mt-1">
                        {selectedWorkout.title}
                      </h3>
                      <p className="text-xs font-bold text-stone-500 mt-1">
                        {selectedWorkout.focus} • {selectedWorkout.duration}
                      </p>
                    </div>

                    {/* INTERACTIVE REST TIMER WIDGET */}
                    <div className="bg-stone-950 text-white rounded-2xl p-3.5 px-4 flex items-center justify-between sm:justify-start gap-4 self-start lg:self-auto w-full sm:w-auto">
                      <div className="flex items-center gap-2.5">
                        <Timer size={18} className={timerRunning ? "text-red-500 animate-pulse" : "text-stone-400"} />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                            Rest Timer
                          </p>
                          <p className="text-xl font-black tabular-nums leading-none mt-0.5">
                            {formatTimer(timerSeconds)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTimerRunning((r) => !r)}
                          className="w-9 h-9 rounded-xl bg-red-800 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title={timerRunning ? "Pause Timer" : "Start Timer"}
                        >
                          {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerSeconds(60);
                          }}
                          className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                          title="Reset Timer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                      <span className="text-stone-500">Session Progress</span>
                      <span className={dayProgressPercent === 100 ? "text-emerald-600" : "text-red-800"}>
                        {completedExCount}/{selectedWorkout.exercises.length} Exercises ({dayProgressPercent}%)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          dayProgressPercent === 100 ? "bg-emerald-500" : "bg-red-800"
                        }`}
                        style={{ width: `${dayProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 100% COMPLETION CELEBRATION BANNER */}
                  {dayProgressPercent === 100 && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                      <Trophy className="text-emerald-600 flex-shrink-0" size={22} />
                      <div>
                        <p className="text-xs font-black uppercase text-emerald-900">
                          Workout Crushed!
                        </p>
                        <p className="text-xs text-emerald-700">
                          Great discipline — you completed all exercises for {selectedDayInfo.full}. Hit your protein target in the Nutrition tab!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EXERCISES LIST */}
                  <div className="space-y-3">
                    {selectedWorkout.exercises.map((ex, idx) => {
                      const checkKey = `${dayCheckPrefix}-${ex.id}`;
                      const isDone = !!checkedItems[checkKey];

                      return (
                        <div
                          key={ex.id}
                          className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                            isDone
                              ? "bg-emerald-50/70 border-emerald-300"
                              : "bg-stone-50 border-stone-200/80 hover:border-stone-300"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleCheck(checkKey)}
                            className="flex items-start sm:items-center gap-3.5 text-left flex-1 cursor-pointer"
                          >
                            {isDone ? (
                              <CheckCircle2
                                size={26}
                                className="text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0"
                              />
                            ) : (
                              <Circle
                                size={26}
                                className="text-stone-400 hover:text-red-800 flex-shrink-0 mt-0.5 sm:mt-0 transition-colors"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-stone-400">
                                  0{idx + 1}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-800">
                                  {ex.muscleGroup}
                                </span>
                              </div>
                              <h4
                                className={`font-black uppercase text-sm sm:text-base leading-tight mt-0.5 ${
                                  isDone ? "line-through text-stone-400" : "text-stone-950"
                                }`}
                              >
                                {ex.name}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-white border border-stone-200 text-stone-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                                  {ex.sets} Sets
                                </span>
                                <span className="bg-white border border-stone-200 text-stone-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                                  {ex.reps} Reps
                                </span>
                                <span
                                  role="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startRestTimer(ex.restSeconds);
                                  }}
                                  className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-800 text-red-800 hover:text-white border border-red-200/70 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                  title="Tap to start rest timer"
                                >
                                  <Timer size={11} /> Rest: {ex.rest}
                                </span>
                              </div>
                            </div>
                          </button>

                          {/* VIDEO WATCH / DOWNLOAD */}
                          <div className="flex items-center gap-2 pl-10 sm:pl-0 flex-shrink-0">
                            <a
                              href={ex.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-stone-950 hover:bg-red-800 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                            >
                              <PlayCircle size={14} /> Watch Video
                            </a>
                            <a
                              href={ex.videoUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download Video"
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
              ) : (
                /* ACTIVE RECOVERY / REST DAY INTERACTIVE CARD */
                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                        <HeartPulse size={12} /> {selectedDayInfo.full} • Recovery Day
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                        Active Recovery &amp; Growth
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1">
                        Muscles grow when you recover. Check off your recovery habits below or preview your next workout.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDayIdx(nextWorkoutDayIdx)}
                      className="inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all cursor-pointer flex-shrink-0"
                    >
                      View Next Workout ({WEEK_DAYS[nextWorkoutDayIdx].short})
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {REST_DAY_HABITS.map((habit) => {
                      const key = `rest-${selectedDayIdx}-${habit.id}`;
                      const done = !!checkedItems[key];
                      return (
                        <button
                          key={habit.id}
                          type="button"
                          onClick={() => toggleCheck(key)}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            done
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle size={20} className="text-stone-400 flex-shrink-0" />
                          )}
                          <span className={`text-xs font-bold ${done ? "line-through opacity-70" : ""}`}>
                            {habit.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DOWNLOADABLE PDF BLUEPRINTS */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3 px-1">
                  Your Downloadable Program PDFs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(ownedPrograms.length > 0 ? ownedPrograms : ALL_PROGRAMS.slice(0, 1)).map(
                    (program) => {
                      const ps = programStatuses[program.id];
                      const isUnlocked =
                        isAdmin || (ps?.status === "completed" && !isExpired(ps?.expiresAt));

                      return (
                        <div
                          key={program.id}
                          className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0">
                              <Image src={program.image} alt={program.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase text-emerald-600">
                                {isUnlocked ? "Unlocked" : "Pending"}
                              </p>
                              <h4 className="font-black uppercase text-xs truncate">{program.name}</h4>
                              <p className="text-[10px] text-stone-500 truncate">{program.description}</p>
                            </div>
                          </div>

                          {isUnlocked && (
                            <a
                              href={program.downloadPath}
                              download
                              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-red-800 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all active:scale-95"
                            >
                              <Download size={13} /> PDF
                            </a>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center">
              <Lock className="mx-auto text-red-800 mb-4" size={32} />
              <h3 className="font-black uppercase text-xl mb-2">Training Programs Locked</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                Purchase any Gym or Home Training Plan (or Complete Transformation Package) to unlock your weekly planner, checkboxes, PDFs, and exercise videos.
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

              {/* LIVE DAILY INTAKE + MACRO RATIO BAR */}
              <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Daily Calories", value: `${dailyTotals.kcal} kcal`, accent: "text-red-800" },
                    { label: "Protein", value: `${dailyTotals.protein}g`, accent: "text-emerald-700" },
                    { label: "Carbohydrates", value: `${dailyTotals.carbs}g`, accent: "text-blue-700" },
                    { label: "Healthy Fats", value: `${dailyTotals.fats}g`, accent: "text-amber-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                        {stat.label}
                      </p>
                      <p className={`text-2xl sm:text-3xl font-black mt-1 ${stat.accent}`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* VISUAL MACRO DISTRIBUTION BAR */}
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1.5">
                    <span>Daily Macro Split (Auto-updates on Swap)</span>
                    <span className="text-emerald-700">
                      P {Math.round((dailyTotals.protein / totalMacroGrams) * 100)}% • C{" "}
                      {Math.round((dailyTotals.carbs / totalMacroGrams) * 100)}% • F{" "}
                      {Math.round((dailyTotals.fats / totalMacroGrams) * 100)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-stone-100">
                    <div
                      className="bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(dailyTotals.protein / totalMacroGrams) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500 transition-all duration-500"
                      style={{ width: `${(dailyTotals.carbs / totalMacroGrams) * 100}%` }}
                    />
                    <div
                      className="bg-amber-400 transition-all duration-500"
                      style={{ width: `${(dailyTotals.fats / totalMacroGrams) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* MEAL CARDS WITH SWAP */}
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
        {/* TAB 3: 1-ON-1 COACHING                                       */}
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