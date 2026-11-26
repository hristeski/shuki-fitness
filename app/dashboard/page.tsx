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
  ShieldCheck,
  LogOut,
  Zap,
  AlertTriangle,
  ChefHat,
  Check,
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
const DEFAULT_REST_SECONDS = 120; // 2 минути

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

  const [todayIdx] = useState<number>(() => (new Date().getDay() + 6) % 7);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => (new Date().getDay() + 6) % 7);
  const [nutritionDayIdx, setNutritionDayIdx] = useState<number>(() => (new Date().getDay() + 6) % 7);

  // Автоматски дефинирано од купената програма (Men = сино, Women = розево)
  const [userGender, setUserGender] = useState<"men" | "women">("men");

  const [activeTab, setActiveTab] = useState<DashboardTab>("programs");
  const [weeklyFreq, setWeeklyFreq] = useState<WeeklyFreq>("4x");
  const [showReducedOptions, setShowReducedOptions] = useState(false);

  const [programStatuses, setProgramStatuses] = useState<Record<string, ProgramStatus>>({});
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(DEFAULT_REST_SECONDS);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  const [nutritionMode, setNutritionMode] = useState<"cutting" | "bulking" | "vegan">("cutting");
  const [mealSwapIndex, setMealSwapIndex] = useState<Record<string, number>>({});

  const isMen = userGender === "men";

  // Тема за Programs: Men = Сино, Women = Розово
  const programTheme = isMen
    ? {
        primaryBg: "bg-blue-600",
        primaryHover: "hover:bg-blue-700",
        primaryGradient: "from-blue-600 to-blue-700",
        softBg: "bg-blue-50",
        softBorder: "border-blue-200",
        text: "text-blue-600",
        textLight: "text-blue-400",
        ring: "ring-blue-500/40",
        border: "border-blue-500",
        glow: "bg-blue-600/25",
        shadow: "shadow-blue-600/25",
        badgeDark: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      }
    : {
        primaryBg: "bg-pink-500",
        primaryHover: "hover:bg-pink-600",
        primaryGradient: "from-pink-500 to-rose-500",
        softBg: "bg-pink-50",
        softBorder: "border-pink-200",
        text: "text-pink-600",
        textLight: "text-pink-400",
        ring: "ring-pink-500/40",
        border: "border-pink-500",
        glow: "bg-pink-500/25",
        shadow: "shadow-pink-500/25",
        badgeDark: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      };

  // Активна боја на хедерот и breadcrumb според отворениот таб
  const headerAccent =
    activeTab === "nutrition"
      ? {
          text: "text-emerald-600",
          softBg: "bg-emerald-50",
          softBorder: "border-emerald-200",
          border: "border-emerald-500",
          ring: "ring-emerald-500/40",
          glow: "bg-emerald-500/25",
          badgeDark: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        }
      : activeTab === "coaching"
      ? {
          text: "text-orange-600",
          softBg: "bg-orange-50",
          softBorder: "border-orange-200",
          border: "border-orange-500",
          ring: "ring-orange-500/40",
          glow: "bg-orange-500/25",
          badgeDark: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        }
      : activeTab === "profile"
      ? {
          text: "text-red-700",
          softBg: "bg-red-50",
          softBorder: "border-red-200",
          border: "border-red-600",
          ring: "ring-red-600/40",
          glow: "bg-red-700/25",
          badgeDark: "bg-red-600/20 text-red-300 border-red-600/30",
        }
      : programTheme;

  useEffect(() => {
    const tabParam = searchParams.get("tab") as DashboardTab | null;
    if (tabParam && ["programs", "nutrition", "coaching", "profile"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const savedChecks = localStorage.getItem(`evo_checked_${user.id}`);
    if (savedChecks) {
      try {
        setCheckedItems(JSON.parse(savedChecks));
      } catch {}
    }
    const savedFreq = localStorage.getItem(`evo_freq_${user.id}`) as WeeklyFreq | null;
    if (savedFreq && ["4x", "3x", "2x"].includes(savedFreq)) {
      setWeeklyFreq(savedFreq);
      if (savedFreq !== "4x") setShowReducedOptions(true);
    }
  }, [user]);

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

  const getMealOptionIndex = (dayIdx: number, slotId: string, optionsLength: number) => {
    const key = `${dayIdx}-${slotId}`;
    if (mealSwapIndex[key] !== undefined) return mealSwapIndex[key];
    return dayIdx % optionsLength;
  };

  const handleSwapMeal = (dayIdx: number, slotId: string, optionsLength: number) => {
    const key = `${dayIdx}-${slotId}`;
    const current = getMealOptionIndex(dayIdx, slotId, optionsLength);
    setMealSwapIndex((prev) => ({
      ...prev,
      [key]: (current + 1) % optionsLength,
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

        let detectedGender: "men" | "women" | null = null;
        const sortedForDetection = [...data].sort((a: any, b: any) => {
          if (a.status === "completed" && b.status !== "completed") return -1;
          if (b.status === "completed" && a.status !== "completed") return 1;
          return 0;
        });

        for (const order of sortedForDetection) {
          const itemsArray =
            typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];

          for (const item of itemsArray) {
            if (!detectedGender) {
              const idLower = String(item.id || "").toLowerCase();
              const nameLower = String(item.name || "").toLowerCase();
              if (idLower.includes("women") || idLower.includes("woman") || nameLower.includes("women")) {
                detectedGender = "women";
              } else if (idLower.includes("men") || nameLower.includes("men")) {
                detectedGender = "men";
              }
            }
          }
        }

        if (detectedGender) {
          setUserGender(detectedGender);
        }

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
        <div className="w-10 h-10 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">
          Loading Member Hub...
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
  const nutritionDayInfo = WEEK_DAYS[nutritionDayIdx];
  const todayInfo = WEEK_DAYS[todayIdx];
  const selectedWorkout = currentSchedule[selectedDayIdx];
  const isViewingToday = selectedDayIdx === todayIdx;

  const dayCheckPrefix = `${weeklyFreq}-d${selectedDayIdx}`;
  const completedExCount = selectedWorkout
    ? selectedWorkout.exercises.filter((ex) => checkedItems[`${dayCheckPrefix}-${ex.id}`]).length
    : 0;
  const dayProgressPercent = selectedWorkout
    ? Math.round((completedExCount / selectedWorkout.exercises.length) * 100)
    : 0;

  const totalScheduledWorkouts = Object.values(currentSchedule).filter(Boolean).length;
  const completedWorkoutsThisWeek = WEEK_DAYS.filter((d) => {
    const w = currentSchedule[d.index];
    if (!w) return false;
    return w.exercises.every((ex) => checkedItems[`${weeklyFreq}-d${d.index}-${ex.id}`]);
  }).length;

  const nextWorkoutDayIdx =
    WEEK_DAYS.find((d) => d.index > selectedDayIdx && currentSchedule[d.index] !== null)?.index ??
    WEEK_DAYS.find((d) => currentSchedule[d.index] !== null)?.index ??
    0;

  // Nutrition totals for selected nutrition day
  const activeMealSlots = NUTRITION_PLANS_DATA[nutritionMode];
  const dailyTotals = activeMealSlots.reduce(
    (acc, slot) => {
      const idx = getMealOptionIndex(nutritionDayIdx, slot.id, slot.options.length);
      const meal = slot.options[idx];
      return {
        kcal: acc.kcal + meal.kcal,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const mealsEatenCount = activeMealSlots.filter(
    (slot) => checkedItems[`meal-${nutritionMode}-d${nutritionDayIdx}-${slot.id}`]
  ).length;
  const mealsProgressPercent = Math.round((mealsEatenCount / activeMealSlots.length) * 100);
  const totalMacroGrams = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fats || 1;

  // 4 табови со точно зададени бои:
  // Programs = Сино (машко) / Розово (женско)
  // Nutrition = Зелено
  // 1-on-1 Coaching = Портокалово
  // Profile & Orders = Црвено
  const navTabs: {
    id: DashboardTab;
    label: string;
    sub: string;
    icon: any;
    locked: boolean;
    activeClass: string;
    idleIconClass: string;
  }[] = [
    {
      id: "programs",
      label: "Programs",
      sub: `${weeklyFreq} Weekly Split`,
      icon: Dumbbell,
      locked: !hasTrainingAccess,
      activeClass: `bg-gradient-to-r ${programTheme.primaryGradient} text-white ${programTheme.border} shadow-lg ${programTheme.shadow}`,
      idleIconClass: isMen ? "text-blue-400" : "text-pink-400",
    },
    {
      id: "nutrition",
      label: "Nutrition",
      sub: "Meals & Macros",
      icon: Utensils,
      locked: !hasNutritionAccess,
      activeClass:
        "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25",
      idleIconClass: "text-emerald-400",
    },
    {
      id: "coaching",
      label: "1-on-1 Coaching",
      sub: "Direct WhatsApp",
      icon: Sparkles,
      locked: false,
      activeClass:
        "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/25",
      idleIconClass: "text-orange-400",
    },
    {
      id: "profile",
      label: "Profile & Orders",
      sub: `${ordersHistory.length} Orders`,
      icon: User,
      locked: false,
      activeClass:
        "bg-gradient-to-r from-red-700 to-red-800 text-white border-red-600 shadow-lg shadow-red-800/25",
      idleIconClass: "text-red-400",
    },
  ];

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 py-6 md:py-9 pb-28 lg:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. COMPACT BACK & BREADCRUMB BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {activeTab !== "programs" ? (
              <button
                onClick={() => setActiveTab("programs")}
                className="inline-flex items-center gap-1.5 bg-white border border-stone-200 hover:bg-stone-950 text-stone-800 hover:text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Programs
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-white border border-stone-200 hover:bg-stone-950 text-stone-800 hover:text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-sm transition-all"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            )}

            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-stone-400"
            >
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={13} />
              <span className="text-stone-600">Member Hub</span>
              <ChevronRight size={13} />
              <span className={`font-black uppercase ${headerAccent.text}`}>
                {TAB_LABELS[activeTab]}
              </span>
              {(activeTab === "programs" || activeTab === "nutrition") && (
                <>
                  <ChevronRight size={13} />
                  <span className="text-stone-950 font-black">
                    {activeTab === "programs" ? selectedDayInfo.full : nutritionDayInfo.full}
                  </span>
                </>
              )}
            </nav>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 ${headerAccent.softBg} ${headerAccent.text} border ${headerAccent.softBorder} text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors`}
          >
            <Calendar size={12} /> Today: {todayInfo.full}
          </span>
        </div>

        {/* 2. ATHLETE HUB HEADER */}
        <div className="bg-stone-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-800 relative overflow-hidden">
          <div
            className={`absolute -right-24 -top-24 w-80 h-80 blur-[130px] rounded-full pointer-events-none transition-colors duration-500 ${headerAccent.glow}`}
          />
          <div
            className={`absolute -left-24 -bottom-24 w-64 h-64 blur-[120px] rounded-full pointer-events-none opacity-60 transition-colors duration-500 ${headerAccent.glow}`}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 ${headerAccent.border} ring-4 ${headerAccent.ring} bg-stone-900 flex-shrink-0 shadow-lg transition-all duration-300`}
              >
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${headerAccent.badgeDark}`}
                  >
                    <Zap size={10} />
                    {isAdmin ? "Coach / Admin Access" : "Active Member Hub"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none truncate">
                  {user.fullName || user.firstName || "Athlete"}
                </h1>
                <p className="text-xs text-stone-400 font-medium mt-1 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white hover:text-stone-950 border border-white/15 text-white font-black uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-xl transition-all"
                >
                  <ShieldCheck size={14} /> Admin Panel
                </Link>
              )}

              <SignOutButton>
                <button className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-red-800 border border-stone-800 hover:border-red-700 text-stone-300 hover:text-white font-black uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                  <LogOut size={13} /> Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>

          {/* 3. COLOR-CODED SEGMENTED APP NAVIGATION */}
          <div className="relative z-10 mt-6 pt-5 border-t border-stone-800/90 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? tab.activeClass
                      : "bg-stone-900/70 border-stone-800 text-stone-300 hover:bg-stone-800/90 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      active
                        ? "bg-white/20 text-white"
                        : `bg-stone-800 ${tab.idleIconClass} group-hover:text-white`
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase tracking-wider truncate">
                        {tab.label}
                      </span>
                      {tab.locked && <Lock size={11} className="opacity-70 flex-shrink-0" />}
                    </div>
                    <p
                      className={`text-[10px] font-semibold truncate mt-0.5 ${
                        active ? "text-white/85" : "text-stone-500"
                      }`}
                    >
                      {tab.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PENDING ORDER ALERT */}
        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
            <Clock className="text-amber-600 flex-shrink-0" size={22} />
            <div>
              <h4 className="font-black uppercase text-xs text-amber-900">
                Payment Verification Pending
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                You have {pendingOrders.length} order(s) under review. As soon as confirmed, your Member Hub unlocks automatically.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: PROGRAMS (BLUE FOR MEN / PINK FOR WOMEN)              */}
        {/* ============================================================ */}
        {activeTab === "programs" &&
          (hasTrainingAccess ? (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${programTheme.text} mb-1`}
                    >
                      <Trophy size={13} /> Weekly Training Schedule
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-950">
                      {isViewingToday
                        ? `Today — ${todayInfo.full}`
                        : `${selectedDayInfo.full}'s Plan`}
                    </h2>
                    <p className="text-xs font-bold text-stone-500 mt-0.5">
                      Completed this week:{" "}
                      <span className="text-stone-950">
                        {completedWorkoutsThisWeek} / {totalScheduledWorkouts} sessions
                      </span>
                    </p>
                  </div>

                  {/* 4x RECOMMENDED + SHORT ON TIME */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectFreq("4x");
                        setShowReducedOptions(false);
                      }}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        weeklyFreq === "4x"
                          ? `${programTheme.primaryBg} text-white shadow-md ${programTheme.shadow}`
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      <Check size={13} strokeWidth={3} /> 4x Recommended
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReducedOptions((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        weeklyFreq !== "4x" || showReducedOptions
                          ? "bg-amber-50 border-amber-300 text-amber-800"
                          : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-800"
                      }`}
                    >
                      <AlertTriangle size={13} /> Short on time?
                    </button>
                  </div>
                </div>

                {/* CAUTIONARY PANEL FOR 2x / 3x (SWAPPED ORDER: 2x FIRST, 3x SECOND) */}
                {(showReducedOptions || weeklyFreq !== "4x") && (
                  <div className="bg-amber-50/90 border border-amber-300/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        size={18}
                        className="text-amber-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-amber-950">
                          {weeklyFreq === "4x"
                            ? "Warning: 4x/week is recommended for best results"
                            : `Reduced Schedule Active (${weeklyFreq}/week)`}
                        </p>
                        <p className="text-[11px] font-medium text-amber-800 mt-0.5 leading-relaxed">
                          Use 2x (Mon, Thu) or 3x (Mon, Wed, Fri) only during busy weeks when you cannot make all 4 sessions. Return to 4x as soon as your schedule opens up.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectFreq("2x")}
                        className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                          weeklyFreq === "2x"
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                        }`}
                      >
                        2x / Week
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectFreq("3x")}
                        className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                          weeklyFreq === "3x"
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                        }`}
                      >
                        3x / Week
                      </button>
                    </div>
                  </div>
                )}

                {/* 7-DAY CALENDAR STRIP (MONDAY – SUNDAY) */}
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
                        className={`relative rounded-2xl p-2 sm:p-3.5 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                          isSelected
                            ? `${programTheme.primaryBg} text-white ${programTheme.border} shadow-lg ${programTheme.shadow} scale-[1.02]`
                            : isToday
                            ? `${programTheme.softBg} text-stone-950 ${programTheme.border}`
                            : "bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-stone-100 hover:text-stone-950"
                        }`}
                      >
                        {isToday && (
                          <span
                            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${
                              isSelected
                                ? "bg-stone-950 text-white"
                                : `${programTheme.primaryBg} text-white`
                            }`}
                          >
                            Today
                          </span>
                        )}

                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">
                          {day.short}
                        </span>

                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2
                              size={16}
                              className={isSelected ? "text-white" : "text-emerald-600"}
                            />
                          ) : workout ? (
                            <Dumbbell
                              size={15}
                              className={isSelected ? "text-white" : programTheme.text}
                            />
                          ) : (
                            <HeartPulse
                              size={15}
                              className={isSelected ? "text-white/80" : "text-stone-400"}
                            />
                          )}
                        </div>

                        <span
                          className={`hidden sm:block text-[9px] font-bold uppercase tracking-wider ${
                            isSelected ? "text-white/85" : "text-stone-400"
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
                      className={`text-[11px] font-black uppercase tracking-wider ${programTheme.text} hover:underline cursor-pointer`}
                    >
                      ← Jump back to Today ({todayInfo.full})
                    </button>
                  </div>
                )}
              </div>

              {/* WORKOUT CARD OR REST DAY CARD */}
              {selectedWorkout ? (
                <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-8 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`${programTheme.softBg} ${programTheme.text} text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md`}
                        >
                          {selectedDayInfo.full} • {weeklyFreq} Plan
                        </span>
                        {isViewingToday && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                            Recommended Today
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-950">
                        {selectedWorkout.title}
                      </h3>
                      <p className="text-xs font-bold text-stone-500 mt-1">
                        {selectedWorkout.focus} • {selectedWorkout.duration}
                      </p>
                    </div>

                    {/* REST TIMER (2:00 DEFAULT) */}
                    <div className="bg-stone-950 text-white rounded-2xl p-3.5 px-4 flex items-center justify-between sm:justify-start gap-4 self-start lg:self-auto w-full sm:w-auto">
                      <div className="flex items-center gap-2.5">
                        <Timer
                          size={18}
                          className={
                            timerRunning
                              ? `${programTheme.textLight} animate-pulse`
                              : "text-stone-400"
                          }
                        />
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
                          className={`w-9 h-9 rounded-xl ${programTheme.primaryBg} ${programTheme.primaryHover} text-white flex items-center justify-center transition-colors cursor-pointer`}
                          title={timerRunning ? "Pause Timer" : "Start Timer"}
                        >
                          {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTimerRunning(false);
                            setTimerSeconds(DEFAULT_REST_SECONDS);
                          }}
                          className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                          title="Reset to 2:00"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SESSION PROGRESS BAR */}
                  <div className="mb-6">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2">
                      <span className="text-stone-500">Session Progress</span>
                      <span
                        className={
                          dayProgressPercent === 100 ? "text-emerald-600" : programTheme.text
                        }
                      >
                        {completedExCount}/{selectedWorkout.exercises.length} Exercises ({dayProgressPercent}%)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          dayProgressPercent === 100 ? "bg-emerald-500" : programTheme.primaryBg
                        }`}
                        style={{ width: `${dayProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  {dayProgressPercent === 100 && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                      <Trophy className="text-emerald-600 flex-shrink-0" size={22} />
                      <div>
                        <p className="text-xs font-black uppercase text-emerald-900">
                          Workout Completed!
                        </p>
                        <p className="text-xs text-emerald-700">
                          Awesome discipline — all exercises for {selectedDayInfo.full} are done.
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
                                className="text-stone-400 flex-shrink-0 mt-0.5 sm:mt-0"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-stone-400">
                                  0{idx + 1}
                                </span>
                                <span
                                  className={`text-[10px] font-black uppercase tracking-widest ${programTheme.text}`}
                                >
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
                                    startRestTimer(DEFAULT_REST_SECONDS);
                                  }}
                                  className={`inline-flex items-center gap-1 ${programTheme.softBg} ${programTheme.text} border ${programTheme.softBorder} hover:bg-stone-950 hover:text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg transition-colors cursor-pointer`}
                                  title="Tap to start 2:00 rest timer"
                                >
                                  <Timer size={11} /> Rest: 2 min
                                </span>
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-2 pl-10 sm:pl-0 flex-shrink-0">
                            <a
                              href={ex.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 bg-stone-950 ${programTheme.primaryHover} text-white text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all`}
                            >
                              <PlayCircle size={14} /> Watch Video
                            </a>
                            <a
                              href={ex.videoUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Download Video"
                              className="inline-flex items-center justify-center w-9 h-9 bg-white border border-stone-200 hover:border-stone-950 text-stone-700 rounded-xl transition-all"
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
                /* REST DAY CARD */
                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6 mb-6">
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 ${programTheme.softBg} ${programTheme.text} text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2`}
                      >
                        <HeartPulse size={12} /> {selectedDayInfo.full} • Rest Day
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                        Recovery &amp; Growth Day
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500 mt-1">
                        Rest is where muscle recovery happens. Hit your daily recovery checklist below.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDayIdx(nextWorkoutDayIdx)}
                      className={`inline-flex items-center justify-center gap-2 ${programTheme.primaryBg} ${programTheme.primaryHover} text-white text-xs font-black uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all cursor-pointer flex-shrink-0`}
                    >
                      Next Workout ({WEEK_DAYS[nextWorkoutDayIdx].short})
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

              {/* DOWNLOADABLE PROGRAM PDFs */}
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
                              className={`flex-shrink-0 inline-flex items-center gap-1.5 ${programTheme.primaryBg} ${programTheme.primaryHover} text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all active:scale-95`}
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
              <Lock className={`mx-auto ${programTheme.text} mb-4`} size={32} />
              <h3 className="font-black uppercase text-xl mb-2">Training Programs Locked</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                Purchase any Gym or Home Training Plan (or Complete Transformation Package) to unlock your weekly planner, checkboxes, PDFs, and exercise videos.
              </p>
              <Link
                href="/#programs"
                className={`inline-block ${programTheme.primaryBg} ${programTheme.primaryHover} text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl`}
              >
                Choose a Program
              </Link>
            </div>
          ))}

        {/* ============================================================ */}
        {/* TAB 2: NUTRITION (FULL GREEN THEME — MEN & WOMEN)            */}
        {/* ============================================================ */}
        {activeTab === "nutrition" &&
          (hasNutritionAccess ? (
            <div className="space-y-6">
              {/* TOP CONTROL CARD: MODE + 7-DAY CALENDAR + PROGRESS */}
              <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
                      <ChefHat size={13} /> Daily Fuel Blueprint
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-950">
                      {nutritionDayInfo.full} —{" "}
                      <span className="text-emerald-600">{nutritionMode}</span>
                    </h2>
                    <p className="text-xs font-bold text-stone-500 mt-0.5">
                      {mealsEatenCount} of {activeMealSlots.length} meals completed ({mealsProgressPercent}%)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex p-1 bg-stone-100 border border-stone-200 rounded-xl">
                      {(["cutting", "bulking", "vegan"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setNutritionMode(mode)}
                          className={`px-3.5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            nutritionMode === mode
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "text-stone-600 hover:text-stone-950"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <a
                      href={`/downloads/${nutritionMode}-plan.pdf`}
                      download
                      className="inline-flex items-center gap-1.5 bg-stone-950 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                    >
                      <Download size={14} /> PDF
                    </a>
                  </div>
                </div>

                {/* 7-DAY NUTRITION CALENDAR (MONDAY – SUNDAY) */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                  {WEEK_DAYS.map((day) => {
                    const isToday = day.index === todayIdx;
                    const isSelected = day.index === nutritionDayIdx;
                    const allMealsDone = activeMealSlots.every(
                      (slot) => checkedItems[`meal-${nutritionMode}-d${day.index}-${slot.id}`]
                    );

                    return (
                      <button
                        key={day.short}
                        type="button"
                        onClick={() => setNutritionDayIdx(day.index)}
                        className={`relative rounded-2xl py-2.5 px-1 sm:p-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 scale-[1.02]"
                            : isToday
                            ? "bg-emerald-50 text-stone-950 border-emerald-500"
                            : "bg-stone-50 text-stone-600 border-stone-200/70 hover:bg-stone-100"
                        }`}
                      >
                        {isToday && (
                          <span
                            className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm ${
                              isSelected ? "bg-stone-950 text-white" : "bg-emerald-600 text-white"
                            }`}
                          >
                            Today
                          </span>
                        )}
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-0.5">
                          {day.short}
                        </span>
                        {allMealsDone ? (
                          <CheckCircle2
                            size={14}
                            className={isSelected ? "text-white" : "text-emerald-600"}
                          />
                        ) : (
                          <Utensils
                            size={13}
                            className={isSelected ? "text-white/90" : "text-emerald-600"}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* DAILY MEALS PROGRESS BAR */}
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${mealsProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* DAILY MACRO DASHBOARD BANNER (GREEN ACCENTS) */}
              <div className="bg-stone-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-800 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/25 blur-[110px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/30">
                      <Flame size={26} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        {nutritionDayInfo.full} Daily Total
                      </p>
                      <p className="text-3xl sm:text-4xl font-black leading-none mt-1">
                        {dailyTotals.kcal}{" "}
                        <span className="text-sm font-bold text-stone-400 uppercase">kcal</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-1 max-w-lg">
                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">
                          Protein
                        </span>
                        <span className="text-[9px] font-bold text-stone-500">
                          {Math.round((dailyTotals.protein / totalMacroGrams) * 100)}%
                        </span>
                      </div>
                      <p className="text-xl font-black mt-1">{dailyTotals.protein}g</p>
                      <div className="h-1.5 bg-stone-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(dailyTotals.protein / totalMacroGrams) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-green-300">
                          Carbs
                        </span>
                        <span className="text-[9px] font-bold text-stone-500">
                          {Math.round((dailyTotals.carbs / totalMacroGrams) * 100)}%
                        </span>
                      </div>
                      <p className="text-xl font-black mt-1">{dailyTotals.carbs}g</p>
                      <div className="h-1.5 bg-stone-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full transition-all duration-500"
                          style={{ width: `${(dailyTotals.carbs / totalMacroGrams) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-teal-300">
                          Fats
                        </span>
                        <span className="text-[9px] font-bold text-stone-500">
                          {Math.round((dailyTotals.fats / totalMacroGrams) * 100)}%
                        </span>
                      </div>
                      <p className="text-xl font-black mt-1">{dailyTotals.fats}g</p>
                      <div className="h-1.5 bg-stone-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${(dailyTotals.fats / totalMacroGrams) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE MEAL CARDS WITH STACKED INGREDIENTS (GREEN THEME) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {activeMealSlots.map((slot) => {
                  const currentIdx = getMealOptionIndex(
                    nutritionDayIdx,
                    slot.id,
                    slot.options.length
                  );
                  const meal = slot.options[currentIdx];
                  const mealCheckKey = `meal-${nutritionMode}-d${nutritionDayIdx}-${slot.id}`;
                  const isEaten = !!checkedItems[mealCheckKey];

                  const ingredientList = meal.ingredients
                    .split(/,|\+/)
                    .map((item) => item.trim())
                    .filter(Boolean);

                  const pShare = Math.min(100, Math.round((meal.protein / (dailyTotals.protein || 1)) * 100));
                  const cShare = Math.min(100, Math.round((meal.carbs / (dailyTotals.carbs || 1)) * 100));
                  const fShare = Math.min(100, Math.round((meal.fats / (dailyTotals.fats || 1)) * 100));

                  return (
                    <div
                      key={slot.id}
                      className={`rounded-3xl border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                        isEaten
                          ? "bg-emerald-50/50 border-emerald-500 shadow-sm"
                          : "bg-white border-emerald-200/80 hover:border-emerald-400 shadow-sm hover:shadow-xl"
                      }`}
                    >
                      {/* TOP HEADER BAR */}
                      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-stone-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="bg-stone-950 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg flex-shrink-0">
                            {slot.time}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 leading-none">
                              {slot.mealNumber}
                            </p>
                            <p className="text-xs font-black uppercase text-stone-700 truncate mt-0.5">
                              {slot.slotName}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleSwapMeal(nutritionDayIdx, slot.id, slot.options.length)
                          }
                          className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer flex-shrink-0"
                        >
                          <RefreshCw size={12} />
                          Swap ({currentIdx + 1}/{slot.options.length})
                        </button>
                      </div>

                      {/* MIDDLE BODY: MEAL TITLE + VERTICAL INGREDIENTS LIST */}
                      <div className="p-5 sm:p-6 flex-1 space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3
                            className={`text-xl font-black tracking-tight leading-snug ${
                              isEaten ? "line-through text-stone-400" : "text-stone-950"
                            }`}
                          >
                            {meal.name}
                          </h3>
                          <span className="flex-shrink-0 bg-emerald-50 border border-emerald-200/70 text-emerald-900 text-xs font-black px-3 py-1.5 rounded-xl">
                            {meal.kcal} kcal
                          </span>
                        </div>

                        {/* STACKED INGREDIENTS PANEL */}
                        <div className="bg-emerald-50/35 border border-emerald-200/60 rounded-2xl p-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">
                            Ingredients
                          </p>
                          <ul className="space-y-2">
                            {ingredientList.map((ingredient, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-800 bg-white border border-emerald-100 rounded-xl px-3.5 py-2.5"
                              >
                                <span className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500" />
                                <span className="capitalize">{ingredient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* VISUAL MACRO METERS (GREEN PALETTE) */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-700">
                              Protein
                            </p>
                            <p className="text-base font-black text-emerald-950 mt-0.5">
                              {meal.protein}g
                            </p>
                            <div className="h-1.5 bg-emerald-200/70 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full"
                                style={{ width: `${pShare}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-green-50/80 border border-green-200/70 rounded-2xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-wider text-green-700">
                              Carbs
                            </p>
                            <p className="text-base font-black text-green-950 mt-0.5">
                              {meal.carbs}g
                            </p>
                            <div className="h-1.5 bg-green-200/70 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{ width: `${cShare}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-teal-50/80 border border-teal-200/70 rounded-2xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-wider text-teal-700">
                              Fats
                            </p>
                            <p className="text-base font-black text-teal-950 mt-0.5">
                              {meal.fats}g
                            </p>
                            <div className="h-1.5 bg-teal-200/70 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-teal-600 rounded-full"
                                style={{ width: `${fShare}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BOTTOM INTERACTIVE EATEN BUTTON */}
                      <div className="px-5 sm:px-6 pb-5">
                        <button
                          type="button"
                          onClick={() => toggleCheck(mealCheckKey)}
                          className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
                            isEaten
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : "bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200"
                          }`}
                        >
                          {isEaten ? (
                            <>
                              <CheckCircle2 size={16} /> Meal Completed
                            </>
                          ) : (
                            <>
                              <Circle size={16} /> Mark as Eaten
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-emerald-200 rounded-3xl p-12 text-center">
              <Lock className="mx-auto text-emerald-600 mb-4" size={32} />
              <h3 className="font-black uppercase text-xl mb-2">Nutrition Plans Locked</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
                Purchase a Bulking, Cutting, Vegan Nutrition Plan or Complete Transformation Package to unlock daily meals and instant meal swaps.
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
        {/* TAB 3: 1-ON-1 COACHING (ORANGE THEME)                        */}
        {/* ============================================================ */}
        {activeTab === "coaching" && (
          <div className="bg-stone-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-orange-500/30 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="absolute -right-24 -top-24 w-72 h-72 bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="lg:col-span-7 space-y-4 relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                Direct Coach Line
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter">
                1-on-1 Coaching With{" "}
                <span className="text-orange-400">Andrej Angjeleski</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-xl">
                Already a member and want weekly check-ins, custom macro adjustments, or exercise form reviews? Message Coach Andrej directly on WhatsApp.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3 relative z-10">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi Andrej! I'm a member on Evolution Body (${user.primaryEmailAddress?.emailAddress}) and I'd like to discuss 1-on-1 Online Coaching.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase tracking-wider text-xs py-4 px-6 rounded-2xl text-center transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                Message on WhatsApp <ExternalLink size={15} />
              </a>
              <Link
                href="/coaching"
                className="w-full bg-white/10 hover:bg-orange-500/20 hover:border-orange-400/50 border border-white/15 text-white font-black uppercase tracking-wider text-xs py-4 px-6 rounded-2xl text-center transition-all"
              >
                View Coaching Details
              </Link>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: PROFILE & ORDER HISTORY (RED THEME)                   */}
        {/* ============================================================ */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-red-200/70 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider mb-5 flex items-center gap-2 pb-3 border-b border-stone-100">
                <FileText size={16} className="text-red-700" /> Order History
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

            <div className="bg-stone-950 text-white rounded-3xl p-7 flex flex-col justify-between shadow-xl border border-red-900/40 relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-56 h-56 bg-red-800/25 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10">
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
                className="relative z-10 w-full text-center bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-lg shadow-red-900/25"
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
          <div className="w-10 h-10 border-4 border-stone-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}