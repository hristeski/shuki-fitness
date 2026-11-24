"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./context/CartContext";
import { useCurrency } from "./context/CurrencyContext";
import ScrollReveal from "./components/ScrollReveal";
import {
  ArrowRight,
  ArrowUpRight,
  Lock,
  Sparkles,
  Flame,
  Dumbbell,
  Home as HomeIcon,
  Utensils,
  Zap,
  ShieldCheck,
  X,
  Check,
  ZoomIn,
} from "lucide-react";

type ProgramCard = {
  id: string;
  badge: string;
  sub: string;
  title: string;
  goal: string;
  duration: string;
  desc: string;
  highlights: string[];
  oldPrice: number;
  price: number;
  image: string;
  cartName: string;
};

export default function Home() {
  const { addToCart } = useCart();
  const { convert } = useCurrency();

  const [genderTab, setGenderTab] = useState<"men" | "women">("men");
  const [categoryTab, setCategoryTab] = useState<"training" | "nutrition">("training");
  const [locationTab, setLocationTab] = useState<"gym" | "home">("gym");

  // In-page Modals (no redirects)
  const [selectedProgram, setSelectedProgram] = useState<ProgramCard | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const isMen = genderTab === "men";
  const isNutrition = categoryTab === "nutrition";

  // Dynamic accent theme: Nutrition = Green, Men = Blue, Women = Pink
  const activeTheme = isNutrition
    ? {
        glow: "bg-emerald-500/14",
        cardBorder:
          "border-emerald-500/45 ring-2 ring-emerald-500/15 hover:border-emerald-600",
        badge: "bg-emerald-600/95 text-white",
        arrow: "bg-emerald-600 text-white",
        sub: "text-emerald-700",
        buyHover: "hover:bg-emerald-700",
        modalCheck: "bg-emerald-50 text-emerald-700",
      }
    : isMen
    ? {
        glow: "bg-blue-500/12",
        cardBorder:
          "border-blue-500/45 ring-2 ring-blue-500/15 hover:border-blue-600",
        badge: "bg-blue-600/95 text-white",
        arrow: "bg-blue-600 text-white",
        sub: "text-blue-600",
        buyHover: "hover:bg-blue-700",
        modalCheck: "bg-blue-50 text-blue-700",
      }
    : {
        glow: "bg-pink-500/14",
        cardBorder:
          "border-pink-400/55 ring-2 ring-pink-500/15 hover:border-pink-500",
        badge: "bg-pink-500/95 text-white",
        arrow: "bg-pink-500 text-white",
        sub: "text-pink-600",
        buyHover: "hover:bg-pink-600",
        modalCheck: "bg-pink-50 text-pink-600",
      };

  const trainingCards: ProgramCard[] =
    locationTab === "gym"
      ? [
          {
            id: `${genderTab}-beginner`,
            badge: `For ${isMen ? "Men" : "Women"} • Gym Beginner`,
            sub: "GYM TRAINING",
            title: isMen ? "BEGINNER GYM PLAN" : "WOMEN'S BEGINNER PLAN",
            cartName: isMen ? "BEGINNER GYM PLAN" : "WOMEN'S BEGINNER PLAN",
            goal: isMen ? "Foundation & Fat Loss" : "Toning, Glutes & Conditioning",
            duration: "8-Week Program",
            desc: "Build proper form, boost daily energy, and create visible transformation with a structured gym routine.",
            highlights: [
              "Structured weekly gym progression",
              "Exact set, rep, and rest targets",
              "Unlocks Exercise Videos & Healthy Recipes in Vault",
              "Instant PDF download after approval",
            ],
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/beginner.jpg" : "/images/women-beginner.jpg",
          },
          {
            id: `${genderTab}-advanced`,
            badge: `For ${isMen ? "Men" : "Women"} • Gym Advanced`,
            sub: "GYM TRAINING",
            title: isMen ? "ADVANCED GYM PLAN" : "WOMEN'S ADVANCED PLAN",
            cartName: isMen ? "ADVANCED GYM PLAN" : "WOMEN'S ADVANCED PLAN",
            goal: isMen ? "Muscle Domination" : "Sculpted Physique & Strength",
            duration: "8-Week Program",
            desc: "Designed for experienced lifters ready for higher volume, progressive overload, and peak aesthetics.",
            highlights: [
              "High-intensity hypertrophy training split",
              "Advanced techniques (drop sets & supersets)",
              "Unlocks Exercise Videos & Healthy Recipes in Vault",
              "Instant PDF download after approval",
            ],
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/advanced.jpg" : "/images/woman-advanced.webp",
          },
        ]
      : [
          {
            id: `${genderTab}-home`,
            badge: `For ${isMen ? "Men" : "Women"} • Home Workout`,
            sub: "HOME WORKOUT",
            title: isMen ? "HOME BODYWEIGHT & DUMBBELL" : "WOMEN'S HOME SCULPT",
            cartName: isMen ? "HOME BODYWEIGHT & DUMBBELL" : "WOMEN'S HOME SCULPT",
            goal: "Fat Loss & Full-Body Tone",
            duration: "8-Week Home Program",
            desc: "Zero gym required. Train from home with minimal equipment while burning fat and building lean definition.",
            highlights: [
              "Flexible home workout routine",
              "Minimal equipment required (bodyweight / dumbbells)",
              "Unlocks Exercise Videos & Healthy Recipes in Vault",
              "Instant PDF download after approval",
            ],
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/IMG_7392.jpg" : "/images/women-home.webp",
          },
          {
            id: `${genderTab}-home-advanced-3x`,
            badge: `For ${isMen ? "Men" : "Women"} • Home Pro`,
            sub: "HOME WORKOUT",
            title: isMen ? "HOME ATHLETE PROTOCOL" : "WOMEN'S HOME GLUTE & CORE PRO",
            cartName: isMen ? "HOME ATHLETE PROTOCOL" : "WOMEN'S HOME GLUTE & CORE PRO",
            goal: "Strength & Conditioning at Home",
            duration: "8-Week Home Program",
            desc: "High-intensity home sessions using progressive bodyweight, bands, and dumbbells for real muscle stimulus.",
            highlights: [
              "Intense progressive home training split",
              "Targeted muscle & conditioning blocks",
              "Unlocks Exercise Videos & Healthy Recipes in Vault",
              "Instant PDF download after approval",
            ],
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/beginner.jpg" : "/images/women-home.webp",
          },
        ];

  const nutritionCards: ProgramCard[] = [
    {
      id: `${genderTab}-nutrition-bulking`,
      badge: `${isMen ? "Men" : "Women"} • Muscle Gain`,
      sub: "NUTRITION BLUEPRINT",
      title: "BULKING NUTRITION PLAN",
      cartName: `BULKING NUTRITION PLAN (${isMen ? "Men" : "Women"})`,
      goal: "Clean Muscle Surplus",
      duration: "Full Guide + Vault Recipes",
      desc: "Structured high-protein surplus designed to add lean mass without unnecessary fat gain.",
      highlights: [
        "Clean calorie surplus & macro guidelines",
        "High-protein meal structure for busy days",
        "Unlocks Member Vault Recipes & Exercise Videos",
        "Instant PDF download after approval",
      ],
      oldPrice: 22,
      price: 15,
      image: "/images/nutrition1.jpg",
    },
    {
      id: `${genderTab}-nutrition-cutting`,
      badge: `${isMen ? "Men" : "Women"} • Fat Loss`,
      sub: "NUTRITION BLUEPRINT",
      title: "CUTTING NUTRITION PLAN",
      cartName: `CUTTING NUTRITION PLAN (${isMen ? "Men" : "Women"})`,
      goal: "Shred & Definition",
      duration: "Full Guide + Vault Recipes",
      desc: "Precision calorie deficit to drop body fat while preserving muscle density and strength.",
      highlights: [
        "Sustainable fat-loss deficit without starvation",
        "High-satiety, high-protein daily framework",
        "Unlocks Member Vault Recipes & Exercise Videos",
        "Instant PDF download after approval",
      ],
      oldPrice: 22,
      price: 15,
      image: "/images/nutrition2.png",
    },
  ];

  const transformationImages = [
    "/images/image00001.jpeg",
    "/images/image00002.jpeg",
    "/images/image00003.jpeg",
  ];

  const activeCards = isNutrition ? nutritionCards : trainingCards;

  return (
    <main className="flex flex-col min-h-screen bg-evo-surface text-stone-950 overflow-x-clip">
      {/* 1. HERO SECTION */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-red-800/30 blur-[120px] rounded-full pointer-events-none" />

        {/* MOBILE FULL-WIDTH TOP PORTRAIT */}
        <div className="lg:hidden relative w-full h-[58vh] min-h-[420px]">
          <Image
            src="/images/coach.jpg"
            alt="Coach Andrej Angjeleski"
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />

          <div className="animate-float-1 absolute top-5 left-4 bg-stone-950/75 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">
              Gym &amp; Home Plans
            </span>
          </div>

          <div className="animate-float-2 absolute top-16 right-4 bg-white/95 backdrop-blur-md text-stone-950 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-xl">
            <Zap size={13} className="text-red-800" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Built for Consistency
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center">
            <span className="inline-block px-3 py-1 rounded-md bg-red-800 text-white text-[10px] font-black uppercase tracking-widest mb-2">
              Evolution Body • by Andrej Angjeleski
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-[0.95]">
              Transform <span className="text-red-600">Your Body.</span>
            </h1>
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-3 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="hidden lg:block space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-800/20 border border-red-700/40 text-red-400 text-[11px] font-black uppercase tracking-widest">
                <Flame size={13} /> Evolution Body • by Andrej Angjeleski
              </div>
              <h1 className="text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
                Transform <br />
                <span className="text-red-600">Your Body.</span>
              </h1>
            </div>

            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Structured gym and home training paired with precision Bulking &amp;
              Cutting nutrition. No guesswork — just real discipline.
            </p>

            {/* GLOWING PROMO TICKET CARD */}
            <div className="animate-ticket-glow max-w-md mx-auto lg:mx-0 bg-stone-900/95 border border-red-700/60 rounded-2xl p-4 flex items-center justify-between text-left relative overflow-hidden">
              <div className="pr-4 border-r border-dashed border-stone-700">
                <p className="text-2xl sm:text-3xl font-black text-red-500 leading-none">
                  30% OFF
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mt-1">
                  Launch Offer
                </p>
              </div>
              <div className="pl-4 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
                  Training &amp; Nutrition Plans
                </p>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="text-xs text-stone-500 line-through font-bold">
                    {convert(22)}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white">
                    {convert(15)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0 pt-1">
              <a
                href="#programs"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-7 py-4 rounded-2xl transition-all shadow-lg shadow-red-900/40 active:scale-95"
              >
                Choose a Program
                <ArrowRight size={16} />
              </a>
              <Link
                href="/coaching"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white hover:text-stone-950 border border-white/15 text-white font-black uppercase tracking-wider text-xs px-6 py-4 rounded-2xl transition-all active:scale-95"
              >
                <Sparkles size={15} />
                Online Coaching
              </Link>
            </div>
          </div>

          {/* DESKTOP PORTRAIT */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-stone-800 shadow-2xl group">
              <Image
                src="/images/coach.jpg"
                alt="Coach Andrej Angjeleski"
                fill
                priority
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />

              <div className="animate-float-1 absolute top-5 left-5 bg-stone-950/80 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl">
                <Dumbbell size={15} className="text-red-500" />
                <span className="text-[11px] font-black uppercase tracking-wider text-white">
                  Gym &amp; Home Plans
                </span>
              </div>

              <div className="animate-float-2 absolute bottom-20 right-5 bg-white/95 backdrop-blur-md text-stone-950 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xl">
                <ShieldCheck size={15} className="text-red-800" />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Proven System
                </span>
              </div>

              <div className="absolute bottom-5 left-5">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-300">
                  Head Coach
                </p>
                <p className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
                  Andrej <span className="text-red-500">Angjeleski</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE BAR — FULLY READABLE ON MOBILE */}
      <section className="relative z-20 -mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-2.5 sm:p-4 shadow-xl shadow-stone-900/5">
          {[
            { icon: Dumbbell, title: "Gym & Home", sub: "Train anywhere" },
            { icon: Zap, title: "Flexible Splits", sub: "Fits your week" },
            { icon: Utensils, title: "Bulking & Cutting", sub: "Clear nutrition" },
            { icon: Lock, title: "Member Vault", sub: "Videos & recipes" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 rounded-2xl bg-stone-50/70 sm:bg-transparent hover:bg-red-800 hover:text-white transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-800 group-hover:bg-white/15 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-tight leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] font-semibold text-stone-500 group-hover:text-red-100 leading-snug mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. TRAIN TOGETHER — STRONGER TOGETHER */}
      <ScrollReveal className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl shadow-stone-900/15">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-red-800/25 blur-[100px] rounded-full pointer-events-none" />

          <div className="lg:col-span-7 space-y-5 relative z-10">
            <span className="inline-block px-3 py-1 rounded-md bg-red-800 text-white text-[10px] font-black uppercase tracking-widest">
              Partner Transformation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              Train Together — <br />
              <span className="text-red-500">Stronger Together</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Goal
                </p>
                <p className="text-xs sm:text-sm font-bold text-stone-200 mt-0.5">
                  Joint transformation &amp; healthy habits
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  Duration
                </p>
                <p className="text-xs sm:text-sm font-bold text-stone-200 mt-0.5">
                  8 Weeks
                </p>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Build your bodies side by side for 8 weeks. Includes full Member
              Vault access to workouts, nutrition, exercise videos, and recipes
              for two.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white text-stone-950 rounded-2xl p-6 sm:p-8 relative z-10 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-800 mb-2">
              Duo Package (2 People)
            </p>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
              <span className="text-sm text-stone-400 line-through font-bold">
                {convert(85)}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-stone-950">
                {convert(15)}
              </span>
            </div>
            <button
              onClick={() =>
                addToCart({
                  id: "stronger-together-duo",
                  name: "Stronger Together — Duo Plan (8 Weeks)",
                  price: 15,
                  quantity: 1,
                  image: "/images/IMG_7392.jpg",
                })
              }
              className="w-full bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              Start Together
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. PROGRAMS & NUTRITION (CLASSIC LAYOUT — MEN BLUE / WOMEN PINK / NUTRITION GREEN) */}
      <section id="programs" className="py-12 relative overflow-hidden">
        <div
          className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] transition-colors duration-700 ${activeTheme.glow}`}
        />

        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
              Success Starts <br />
              With a <span className="text-red-800">Decision</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs font-medium">
              Choose your plan below. Full PDFs, exercise videos, and recipes
              unlock inside your Vault after purchase.
            </p>
          </div>

          {/* COMPACT 3-STEP FILTER BAR (NO 4. WEEKLY SCHEDULE) */}
          <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-3xl p-3.5 sm:p-4 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. CATEGORY: MEN (BLUE) / WOMEN (PINK) */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                  1. Category
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
                  <button
                    onClick={() => setGenderTab("men")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isMen
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/30"
                        : "text-blue-700 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isMen ? "bg-white animate-pulse" : "bg-blue-500"
                      }`}
                    />
                    For Men
                  </button>

                  <button
                    onClick={() => setGenderTab("women")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      !isMen
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                        : "text-pink-600 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        !isMen ? "bg-white animate-pulse" : "bg-pink-500"
                      }`}
                    />
                    For Women
                  </button>
                </div>
              </div>

              {/* 2. FOCUS: TRAINING / NUTRITION (GREEN) */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                  2. Focus
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
                  <button
                    onClick={() => setCategoryTab("training")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      !isNutrition
                        ? "bg-stone-950 text-white shadow-md"
                        : "text-stone-600 bg-white/80 hover:bg-white hover:text-stone-950"
                    }`}
                  >
                    Training
                  </button>
                  <button
                    onClick={() => setCategoryTab("nutrition")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isNutrition
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/70"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isNutrition ? "bg-white animate-pulse" : "bg-emerald-500"
                      }`}
                    />
                    Nutrition
                  </button>
                </div>
              </div>

              {/* 3. LOCATION (ONLY ACTIVE WHEN TRAINING) */}
              <div className={isNutrition ? "opacity-45 pointer-events-none" : ""}>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                  3. Location
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
                  <button
                    onClick={() => setLocationTab("gym")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      locationTab === "gym"
                        ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                        : "text-stone-600 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <Dumbbell size={13} /> Gym
                  </button>
                  <button
                    onClick={() => setLocationTab("home")}
                    className={`py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      locationTab === "home"
                        ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                        : "text-stone-600 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <HomeIcon size={13} /> Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PROGRAM & NUTRITION CARDS (UN-ZOOMED IMAGES + COMPACT FULL-VIEW HEIGHT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedProgram(card)}
                className={`group bg-white border-2 rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col cursor-pointer ${activeTheme.cardBorder}`}
              >
                {/* UN-ZOOMED IMAGE FRAME */}
                <div className="relative h-52 sm:h-60 w-full bg-stone-950 overflow-hidden">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    aria-hidden
                    className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                  />
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.03]"
                  />

                  <span
                    className={`absolute top-3 left-3 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm z-10 ${activeTheme.badge}`}
                  >
                    {card.badge}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProgram(card);
                    }}
                    aria-label={`View details for ${card.title}`}
                    className={`absolute bottom-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12 cursor-pointer z-10 ${activeTheme.arrow}`}
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                {/* COMPACT CARD BODY SO ENTIRE CARD FITS CLEANLY ON SCREEN */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeTheme.sub}`}
                    >
                      {card.sub}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 leading-tight">
                      {card.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 py-2.5 border-y border-stone-100 mb-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-stone-400">
                          Goal
                        </p>
                        <p className="text-xs font-bold text-stone-900 mt-0.5">
                          {card.goal}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-stone-400">
                          Duration
                        </p>
                        <p className="text-xs font-bold text-stone-900 mt-0.5">
                          {card.duration}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xs text-stone-400 line-through font-bold">
                        {convert(card.oldPrice)}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-stone-950">
                        {convert(card.price)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: card.id,
                          name: card.cartName,
                          price: card.price,
                          quantity: 1,
                          image: card.image,
                        });
                      }}
                      className={`bg-stone-950 ${activeTheme.buyHover} text-white font-black uppercase tracking-wider text-xs px-6 py-3 rounded-xl transition-all active:scale-95 cursor-pointer flex-shrink-0`}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 4. COMPLETE TRANSFORMATION PACKAGE */}
      <ScrollReveal>
        <section className="py-20 bg-stone-950 text-white relative overflow-hidden">
          <div className="absolute -left-24 bottom-0 w-72 h-72 bg-red-800/25 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-block px-3 py-1 rounded-md border border-red-800/70 text-red-500 text-[10px] font-black uppercase tracking-widest">
                Training + Nutrition Package
              </span>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
                Complete <br />
                <span className="text-red-500">Transformation</span>
              </h2>
              <p className="text-stone-400 text-sm sm:text-base max-w-md">
                Combine your Gym or Home workout split with a Bulking or Cutting
                nutrition blueprint, plus full Vault access to exercise videos
                and high-protein recipes.
              </p>

              <div className="relative h-44 w-full max-w-md rounded-2xl overflow-hidden border border-stone-800">
                <Image
                  src="/images/nutrition3.jpg"
                  alt="Evolution Body Nutrition & Training"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-white">
                  Precision Fuel + Structured Training
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-stone-950 rounded-3xl p-6 sm:p-9 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
                Included in the Package
              </p>
              <div className="divide-y divide-stone-200 mb-6">
                <div className="py-3.5 flex items-start gap-4">
                  <span className="text-xs font-black text-red-800 mt-0.5">01</span>
                  <div>
                    <h4 className="font-black uppercase text-sm">Training Plan</h4>
                    <p className="text-xs text-stone-500">
                      Men or Women • Gym or Home Workout
                    </p>
                  </div>
                </div>
                <div className="py-3.5 flex items-start gap-4">
                  <span className="text-xs font-black text-red-800 mt-0.5">02</span>
                  <div>
                    <h4 className="font-black uppercase text-sm">
                      Nutrition Plan + Vault Access
                    </h4>
                    <p className="text-xs text-stone-500">
                      Bulking or Cutting + Exercise Videos &amp; Healthy Recipes
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                  Complete Package
                </p>
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="text-xs sm:text-sm text-stone-400 line-through font-bold">
                    {convert(43)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-stone-950 leading-none">
                    {convert(24)}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  addToCart({
                    id: "combo-bundle",
                    name: "Complete Transformation Package (Training + Nutrition)",
                    price: 24,
                    quantity: 1,
                    image: "/images/nutrition3.jpg",
                  })
                }
                className="w-full bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all flex items-center justify-between px-6 cursor-pointer active:scale-[0.98]"
              >
                <span>Get the Package</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. TRANSFORMATIONS (CLEAN GALLERY — UN-ZOOMED + CLICK FOR FULLSCREEN) */}
      <ScrollReveal className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section id="results">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-red-800">
              Transformations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transformationImages.map((src, idx) => (
              <div
                key={src}
                onClick={() => setLightboxImage(src)}
                className="group relative h-80 sm:h-96 w-full bg-stone-950 border border-stone-200/90 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  aria-hidden
                  className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
                />
                <Image
                  src={src}
                  alt={`Transformation ${idx + 1}`}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/15 z-10 group-hover:bg-red-800 transition-colors">
                  <ZoomIn size={13} /> View
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* MODAL 1: PROGRAM DETAILS PREVIEW */}
      {selectedProgram && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
          >
            <button
              onClick={() => setSelectedProgram(null)}
              aria-label="Close details"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-red-800 text-stone-800 hover:text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="relative h-56 w-full bg-stone-950 flex-shrink-0 overflow-hidden">
              <Image
                src={selectedProgram.image}
                alt=""
                fill
                aria-hidden
                className="object-cover blur-xl opacity-35 scale-110 pointer-events-none"
              />
              <Image
                src={selectedProgram.image}
                alt={selectedProgram.title}
                fill
                className="object-contain p-2"
              />
              <span
                className={`absolute bottom-3 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg z-10 ${activeTheme.badge}`}
              >
                {selectedProgram.badge}
              </span>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${activeTheme.sub}`}>
                  {selectedProgram.sub}
                </p>
                <h3 className="text-2xl font-black uppercase tracking-tight mt-0.5">
                  {selectedProgram.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5">
                <div>
                  <p className="text-[10px] font-bold uppercase text-stone-400">Goal</p>
                  <p className="text-xs font-black text-stone-900 mt-0.5">
                    {selectedProgram.goal}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-stone-400">Duration</p>
                  <p className="text-xs font-black text-stone-900 mt-0.5">
                    {selectedProgram.duration}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {selectedProgram.desc}
              </p>

              <ul className="space-y-2 pt-1">
                {selectedProgram.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs font-bold text-stone-800">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${activeTheme.modalCheck}`}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs text-stone-400 line-through font-bold">
                    {convert(selectedProgram.oldPrice)}
                  </span>
                  <span className="text-2xl font-black text-stone-950">
                    {convert(selectedProgram.price)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    addToCart({
                      id: selectedProgram.id,
                      name: selectedProgram.cartName,
                      price: selectedProgram.price,
                      quantity: 1,
                      image: selectedProgram.image,
                    });
                    setSelectedProgram(null);
                  }}
                  className={`bg-stone-950 ${activeTheme.buyHover} text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TRANSFORMATION FULLSCREEN LIGHTBOX (CLEAN PHOTO ONLY) */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            aria-label="Close fullscreen image"
            className="fixed top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/15 hover:bg-red-800 text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[82vh] rounded-2xl overflow-hidden"
          >
            <Image
              src={lightboxImage}
              alt="Client Transformation Full View"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}