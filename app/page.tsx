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
} from "lucide-react";

export default function Home() {
  const { addToCart } = useCart();
  const { convert } = useCurrency();

  const [genderTab, setGenderTab] = useState<"men" | "women">("men");
  const [categoryTab, setCategoryTab] = useState<"training" | "nutrition">("training");
  const [locationTab, setLocationTab] = useState<"gym" | "home">("gym");
  const [freq, setFreq] = useState<"2x" | "3x" | "4x">("3x");

  const isMen = genderTab === "men";

  const trainingCards =
    locationTab === "gym"
      ? [
          {
            id: `${genderTab}-beginner-${freq}`,
            badge: `For ${isMen ? "Men" : "Women"} • Gym Beginner`,
            sub: `GYM TRAINING / ${freq.toUpperCase()} PER WEEK`,
            title: isMen ? "BEGINNER GYM PLAN" : "WOMEN'S BEGINNER PLAN",
            goal: isMen ? "Foundation & Fat Loss" : "Toning, Glutes & Conditioning",
            duration: "8-Week Program",
            desc: "Build proper form, boost daily energy, and create visible transformation with a structured gym routine.",
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/beginner.jpg" : "/images/women1.jpg",
          },
          {
            id: `${genderTab}-advanced-${freq}`,
            badge: `For ${isMen ? "Men" : "Women"} • Gym Advanced`,
            sub: `GYM TRAINING / ${freq.toUpperCase()} PER WEEK`,
            title: isMen ? "ADVANCED GYM PLAN" : "WOMEN'S ADVANCED PLAN",
            goal: isMen ? "Muscle Domination" : "Sculpted Physique & Strength",
            duration: "8-Week Program",
            desc: "Designed for experienced lifters ready for higher volume, progressive overload, and peak aesthetics.",
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/advanced.jpg" : "/images/women2.jpg",
          },
        ]
      : [
          {
            id: `${genderTab}-home-beginner-${freq}`,
            badge: `For ${isMen ? "Men" : "Women"} • Home Workout`,
            sub: `HOME WORKOUT / ${freq.toUpperCase()} PER WEEK`,
            title: isMen ? "HOME BODYWEIGHT & DUMBBELL" : "WOMEN'S HOME SCULPT",
            goal: "Fat Loss & Full-Body Tone",
            duration: "8-Week Home Program",
            desc: "Zero gym required. Train from home with minimal equipment while burning fat and building lean definition.",
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/IMG_7392.jpg" : "/images/women3.jpg",
          },
          {
            id: `${genderTab}-home-advanced-${freq}`,
            badge: `For ${isMen ? "Men" : "Women"} • Home Pro`,
            sub: `HOME WORKOUT / ${freq.toUpperCase()} PER WEEK`,
            title: isMen ? "HOME ATHLETE PROTOCOL" : "WOMEN'S HOME GLUTE & CORE PRO",
            goal: "Strength & Conditioning at Home",
            duration: "8-Week Home Program",
            desc: "High-intensity home sessions using progressive bodyweight, bands, and dumbbells for real muscle stimulus.",
            oldPrice: 22,
            price: 15,
            image: isMen ? "/images/beginner.jpg" : "/images/women1.jpg",
          },
        ];

  const nutritionCards = [
    {
      id: `${genderTab}-nutrition-bulking`,
      badge: `${isMen ? "Men" : "Women"} • Muscle Gain`,
      title: "BULKING NUTRITION PLAN",
      goal: "Clean Muscle Surplus",
      duration: "Full Guide + Vault Recipes",
      desc: "Structured high-protein surplus designed to add lean mass without unnecessary fat gain.",
      oldPrice: 22,
      price: 15,
      image: "/images/nutrition1.jpg",
    },
    {
      id: `${genderTab}-nutrition-cutting`,
      badge: `${isMen ? "Men" : "Women"} • Fat Loss`,
      title: "CUTTING NUTRITION PLAN",
      goal: "Shred & Definition",
      duration: "Full Guide + Vault Recipes",
      desc: "Precision calorie deficit to drop body fat while preserving muscle density and strength.",
      oldPrice: 22,
      price: 15,
      image: "/images/nutrition2.png",
    },
  ];

  const transformations = [
    {
      num: "01",
      name: "Client Transformation",
      tag: "Fat Loss & Definition",
      quote:
        "Working with Andrej changed my daily discipline. Real structure, clear meals, and visible results every week.",
      image: "/images/image00001.jpeg",
    },
    {
      num: "02",
      name: "Client Transformation",
      tag: "Body Recomposition",
      quote:
        "I stopped guessing in the gym. Following the exact split and nutrition blueprint completely reshaped my physique.",
      image: "/images/image00002.jpeg",
    },
    {
      num: "03",
      name: "Client Transformation",
      tag: "Strength & Aesthetics",
      quote:
        "No gimmicks or extreme diets — just consistent training and habits that actually fit real life.",
      image: "/images/image00003.jpeg",
    },
  ];

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
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs text-stone-500 line-through font-bold">
                    {convert(22)}
                  </span>
                  <span className="text-2xl font-black text-white">
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
                  Gym &amp; Home • 2x–4x
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

      {/* INTERACTIVE KINETIC FEATURE BAR (REPLACES CLICHÉ MARQUEE) */}
      <section className="relative z-20 -mt-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-3xl p-3 sm:p-4 shadow-xl shadow-stone-900/5">
          {[
            { icon: Dumbbell, title: "Gym & Home", sub: "Train anywhere" },
            { icon: Zap, title: "2x • 3x • 4x", sub: "Fits your week" },
            { icon: Utensils, title: "Bulking & Cutting", sub: "Clear nutrition" },
            { icon: Lock, title: "Member Vault", sub: "Videos & recipes" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-red-800 hover:text-white transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-800 group-hover:bg-white/15 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] font-bold text-stone-500 group-hover:text-red-100 truncate">
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
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-sm text-stone-400 line-through font-bold">
                {convert(85)}
              </span>
              <span className="text-4xl font-black text-stone-950">
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

      {/* 3. PROGRAMS & NUTRITION (MEN BLUE / WOMEN PINK + GYM / HOME WORKOUT) */}
      <section id="programs" className="py-14 relative overflow-hidden">
        <div
          className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] transition-colors duration-700 ${
            isMen ? "bg-blue-500/10" : "bg-pink-500/12"
          }`}
        />

        <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
              Success Starts <br />
              With a <span className="text-red-800">Decision</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs font-medium">
              Choose your plan below. Full PDFs, exercise videos, and recipes
              unlock inside your Vault after purchase.
            </p>
          </div>

          {/* LOGICAL FILTER PANEL */}
          <div className="bg-white/90 backdrop-blur-md border border-stone-200/90 rounded-3xl p-4 sm:p-5 mb-10 space-y-3 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* STEP 1: MEN (BLUE) / WOMEN (PINK) */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                  1. Category
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80">
                  <button
                    onClick={() => setGenderTab("men")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                      isMen
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
                        : "text-blue-700 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isMen ? "bg-white animate-pulse" : "bg-blue-500"
                      }`}
                    />
                    For Men
                  </button>

                  <button
                    onClick={() => setGenderTab("women")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                      !isMen
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]"
                        : "text-pink-600 bg-white/80 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        !isMen ? "bg-white animate-pulse" : "bg-pink-500"
                      }`}
                    />
                    For Women
                  </button>
                </div>
              </div>

              {/* STEP 2: TRAINING / NUTRITION */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                  2. Focus
                </p>
                <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80">
                  <button
                    onClick={() => setCategoryTab("training")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      categoryTab === "training"
                        ? "bg-stone-950 text-white shadow-md scale-[1.01]"
                        : "text-stone-600 bg-white/80 hover:bg-white hover:text-stone-950"
                    }`}
                  >
                    Training
                  </button>
                  <button
                    onClick={() => setCategoryTab("nutrition")}
                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      categoryTab === "nutrition"
                        ? "bg-stone-950 text-white shadow-md scale-[1.01]"
                        : "text-stone-600 bg-white/80 hover:bg-white hover:text-stone-950"
                    }`}
                  >
                    Nutrition
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3 & 4 (ONLY WHEN TRAINING): GYM/HOME + FREQUENCY */}
            {categoryTab === "training" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                    3. Location
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80">
                    <button
                      onClick={() => setLocationTab("gym")}
                      className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        locationTab === "gym"
                          ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                          : "text-stone-600 bg-white/80 hover:bg-white"
                      }`}
                    >
                      <Dumbbell size={14} /> Gym Workout
                    </button>
                    <button
                      onClick={() => setLocationTab("home")}
                      className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        locationTab === "home"
                          ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                          : "text-stone-600 bg-white/80 hover:bg-white"
                      }`}
                    >
                      <HomeIcon size={14} /> Home Workout
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5 px-1">
                    4. Weekly Schedule
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/80">
                    {(["2x", "3x", "4x"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFreq(f)}
                        className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          freq === f
                            ? "bg-red-800 text-white shadow-md shadow-red-900/20"
                            : "text-stone-600 bg-white/80 hover:bg-white"
                        }`}
                      >
                        {f} / Wk
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CARDS */}
          {categoryTab === "training" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trainingCards.map((card) => (
                <div
                  key={card.id}
                  className={`group bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col ${
                    isMen ? "hover:border-blue-600/60" : "hover:border-pink-500/60"
                  }`}
                >
                  <div className="relative h-72 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <span
                      className={`absolute top-4 left-4 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-sm ${
                        isMen ? "bg-blue-600/95 text-white" : "bg-pink-500/95 text-white"
                      }`}
                    >
                      {card.badge}
                    </span>
                    <div
                      className={`absolute bottom-4 right-4 w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${
                        isMen ? "bg-blue-600" : "bg-pink-500"
                      }`}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          isMen ? "text-blue-600" : "text-pink-600"
                        }`}
                      >
                        {card.sub}
                      </p>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                        {card.title} ({freq}/wk)
                      </h3>

                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-stone-100 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-stone-400">Goal</p>
                          <p className="text-xs font-bold text-stone-900 mt-0.5">{card.goal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-stone-400">Duration</p>
                          <p className="text-xs font-bold text-stone-900 mt-0.5">{card.duration}</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-6">{card.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-stone-400 line-through font-bold">
                          {convert(card.oldPrice)}
                        </span>
                        <span className="text-2xl font-black text-stone-950">
                          {convert(card.price)}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          addToCart({
                            id: card.id,
                            name: `${card.title} (${freq}/wk)`,
                            price: card.price,
                            quantity: 1,
                            image: card.image,
                          })
                        }
                        className="bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nutritionCards.map((card) => (
                <div
                  key={card.id}
                  className={`group bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 ${
                    isMen ? "hover:border-blue-600/60" : "hover:border-pink-500/60"
                  }`}
                >
                  <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
                    <span
                      className={`absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm ${
                        isMen ? "bg-blue-600 text-white" : "bg-pink-500 text-white"
                      }`}
                    >
                      {card.badge}
                    </span>
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-stone-900 inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                      <Lock size={11} /> Vault Exclusive
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-3">
                        {card.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-stone-100 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-stone-400">Goal</p>
                          <p className="text-xs font-bold text-stone-900 mt-0.5">{card.goal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-stone-400">Includes</p>
                          <p className="text-xs font-bold text-stone-900 mt-0.5">{card.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed mb-6">{card.desc}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-stone-400 line-through font-bold">
                          {convert(card.oldPrice)}
                        </span>
                        <span className="text-2xl font-black text-stone-950">
                          {convert(card.price)}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          addToCart({
                            id: card.id,
                            name: `${card.title} (${isMen ? "Men" : "Women"})`,
                            price: card.price,
                            quantity: 1,
                            image: card.image,
                          })
                        }
                        className="bg-stone-950 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* 4. COMPLETE TRANSFORMATION PACKAGE (WITH NUTRITION3 VISUAL) */}
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

            <div className="lg:col-span-6 bg-white text-stone-950 rounded-3xl p-7 sm:p-9 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-5">
                Included in the Package
              </p>
              <div className="divide-y divide-stone-200 mb-6">
                <div className="py-3.5 flex items-start gap-4">
                  <span className="text-xs font-black text-red-800 mt-0.5">01</span>
                  <div>
                    <h4 className="font-black uppercase text-sm">Training Plan</h4>
                    <p className="text-xs text-stone-500">
                      Men or Women • Gym or Home • 2x / 3x / 4x Weekly
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

              <div className="flex items-end justify-between mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Complete Package
                </p>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-sm text-stone-400 line-through font-bold">
                    {convert(43)}
                  </span>
                  <span className="text-3xl font-black">{convert(24)}</span>
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

      {/* 5. CLIENT TRANSFORMATIONS (NEW IMAGES: image00001/2/3.jpeg) */}
      <ScrollReveal className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <section id="results">
          <div className="mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-red-800 mb-2">
              Real Discipline • Real Change
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
              Client <span className="text-red-800">Transformations</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transformations.map((item) => (
              <div
                key={item.num}
                className="group bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={`${item.name} ${item.num}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-red-800/95 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/95 text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                    {item.num}/03
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-black uppercase text-base mb-2">{item.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}