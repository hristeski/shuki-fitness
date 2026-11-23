"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./context/CartContext";
import { useCurrency } from "./context/CurrencyContext";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  Lock,
  Sparkles,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Does faster weight loss mean better results?",
    a: "No. Rapid weight loss often causes muscle loss and rebound weight gain. A controlled, structured deficit delivers lasting results.",
  },
  {
    q: "I train and eat healthy, but I'm not losing weight — why?",
    a: "Portion sizes and hidden calories add up quickly. A structured nutrition plan removes guesswork and ensures consistent progress.",
  },
  {
    q: "Is the order of exercises in a workout important?",
    a: "Yes. Starting with compound movements while your energy is highest maximizes strength and hypertrophy.",
  },
  {
    q: "Can you build muscle with lighter weights?",
    a: "Yes, when paired with proper form, controlled tempo, and training close to muscular failure.",
  },
  {
    q: "What is a calorie deficit and why does it matter?",
    a: "Consuming fewer calories than your body burns is required for fat loss. Pairing it with high protein protects your muscle mass.",
  },
  {
    q: "How do I access my Exercise Videos and Recipes?",
    a: "Once your program is purchased and approved, your personal Member Vault automatically unlocks your PDF plans, Exercise Video Library, and High-Protein Recipes.",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const { convert } = useCurrency();

  const [genderTab, setGenderTab] = useState<"men" | "women">("men");
  const [categoryTab, setCategoryTab] = useState<"training" | "nutrition">("training");
  const [freq, setFreq] = useState<"2x" | "3x" | "4x">("3x");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="flex flex-col min-h-screen bg-white text-zinc-950 pb-20 lg:pb-0">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-100 bg-zinc-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
              Transform <br />
              <span className="text-red-700">Your Body</span>
            </h1>

            <p className="text-zinc-600 text-base sm:text-lg max-w-lg leading-relaxed font-medium">
              Training and nutrition with a clear goal. Your new beginning is
              now.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="#programs"
                className="inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-700/20 active:scale-95"
              >
                Choose a Program
                <ArrowRight size={16} />
              </a>
              <Link
                href="/coaching"
                className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase tracking-wider text-xs px-8 py-4 rounded-xl transition-all active:scale-95"
              >
                <Sparkles size={15} />
                Online Coaching
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 max-w-md">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-red-700">500+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Success Stories
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-zinc-950">10+</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Years Coaching
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-zinc-950">2x-4x</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Weekly Splits
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl group">
              <Image
                src="/images/coach.jpg"
                alt="Coach Andrej"
                fill
                priority
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  Andrej Angjeleski
                </p>
                <p className="text-3xl font-black uppercase tracking-tighter text-red-500 leading-none">
                  SHUKI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRAIN TOGETHER — STRONGER TOGETHER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-red-700/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="lg:col-span-7 space-y-5 relative z-10">
            <span className="inline-block px-3 py-1 rounded-md bg-red-700 text-white text-[10px] font-black uppercase tracking-widest">
              Partner Transformation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              Train Together — <br />
              <span className="text-red-500">Stronger Together</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Goal
                </p>
                <p className="text-xs sm:text-sm font-bold text-zinc-200 mt-0.5">
                  Joint transformation &amp; healthy habits
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Duration
                </p>
                <p className="text-xs sm:text-sm font-bold text-zinc-200 mt-0.5">
                  8 Weeks
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Build your bodies side by side for 8 weeks. Includes full Member
              Vault access to workouts, nutrition, exercise videos, and recipes
              for two.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white text-zinc-950 rounded-2xl p-6 sm:p-8 relative z-10 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-2">
              Duo Package (2 People)
            </p>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-sm text-zinc-400 line-through font-bold">
                {convert(85)}
              </span>
              <span className="text-4xl font-black text-zinc-950">
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
              className="w-full bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              Start Together
            </button>
          </div>
        </div>
      </section>

      {/* 3. PROGRAMS & NUTRITION (MEN / WOMEN + BEGINNER / ADVANCED + 2x/3x/4x) */}
      <section id="programs" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
            Success Starts <br />
            With a <span className="text-red-700">Decision</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xs font-medium">
            From your first workout to the next level. Full plans, exercise
            videos, and recipes unlock in your Vault after purchase.
          </p>
        </div>

        {/* FILTER CONTROLS: MEN/WOMEN + TRAINING/NUTRITION + FREQUENCY */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200">
          {/* FOR MEN / FOR WOMEN */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
            <button
              onClick={() => setGenderTab("men")}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                genderTab === "men"
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              For Men
            </button>
            <button
              onClick={() => setGenderTab("women")}
              className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                genderTab === "women"
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              For Women
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* TRAINING / NUTRITION */}
            <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
              <button
                onClick={() => setCategoryTab("training")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  categoryTab === "training"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Training
              </button>
              <button
                onClick={() => setCategoryTab("nutrition")}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  categoryTab === "nutrition"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Nutrition
              </button>
            </div>

            {categoryTab === "training" && (
              <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                {(["2x", "3x", "4x"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      freq === f
                        ? "bg-red-700 text-white"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    {f}/wk
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARDS GRID */}
        {categoryTab === "training" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: `${genderTab}-beginner-${freq}`,
                badge: `For ${genderTab === "men" ? "Men" : "Women"} • Beginner`,
                sub: `TRAINING / ${freq.toUpperCase()} PER WEEK`,
                title:
                  genderTab === "men"
                    ? "BEGINNER PLAN"
                    : "WOMEN'S BEGINNER PLAN",
                goal:
                  genderTab === "men"
                    ? "Foundation & Fat Loss"
                    : "Toning, Glutes & Conditioning",
                duration: "8-Week Program",
                desc: "Build proper form, boost daily energy, and create visible transformation with a structured routine.",
                oldPrice: 22,
                price: 15,
                image: "/images/beginner.jpg",
              },
              {
                id: `${genderTab}-advanced-${freq}`,
                badge: `For ${genderTab === "men" ? "Men" : "Women"} • Advanced`,
                sub: `TRAINING / ${freq.toUpperCase()} PER WEEK`,
                title:
                  genderTab === "men"
                    ? "ADVANCED PLAN"
                    : "WOMEN'S ADVANCED PLAN",
                goal:
                  genderTab === "men"
                    ? "Muscle Domination"
                    : "Sculpted Physique & Strength",
                duration: "8-Week Program",
                desc: "Designed for experienced lifters ready for higher volume, progressive overload, and peak aesthetics.",
                oldPrice: 22,
                price: 15,
                image: "/images/advanced.jpg",
              },
            ].map((card) => (
              <div
                key={card.id}
                className="group bg-white border border-zinc-200 rounded-3xl overflow-hidden hover:border-red-700/50 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative h-72 w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                    {card.badge}
                  </span>
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-lg bg-red-700 text-white flex items-center justify-center shadow-md">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                      {card.sub}
                    </p>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                      {card.title} ({freq}/wk)
                    </h3>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-100 mb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-zinc-400">
                          Goal
                        </p>
                        <p className="text-xs font-bold text-zinc-900 mt-0.5">
                          {card.goal}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-zinc-400">
                          Duration
                        </p>
                        <p className="text-xs font-bold text-zinc-900 mt-0.5">
                          {card.duration}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-zinc-400 line-through font-bold">
                        {convert(card.oldPrice)}
                      </span>
                      <span className="text-2xl font-black text-zinc-950">
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
                      className="bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer"
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
            {[
              {
                id: `${genderTab}-nutrition-bulking`,
                badge: `${genderTab === "men" ? "Men" : "Women"} • Muscle Gain`,
                title: "BULKING NUTRITION PLAN",
                goal: "Clean Muscle Surplus",
                duration: "Full Guide + Vault Recipes",
                desc: "Structured high-protein surplus designed to add lean mass without unnecessary fat gain.",
                oldPrice: 22,
                price: 15,
                image: "/images/advanced.jpg",
              },
              {
                id: `${genderTab}-nutrition-cutting`,
                badge: `${genderTab === "men" ? "Men" : "Women"} • Fat Loss`,
                title: "CUTTING NUTRITION PLAN",
                goal: "Shred & Definition",
                duration: "Full Guide + Vault Recipes",
                desc: "Precision calorie deficit to drop body fat while preserving muscle density and strength.",
                oldPrice: 22,
                price: 15,
                image: "/images/beginner.jpg",
              },
            ].map((card) => (
              <div
                key={card.id}
                className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-red-700/50 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-400">
                      <Lock size={12} /> Vault Exclusive
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3">
                    {card.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-200/70 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">
                        Goal
                      </p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">
                        {card.goal}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-zinc-400">
                        Includes
                      </p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">
                        {card.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-zinc-400 line-through font-bold">
                      {convert(card.oldPrice)}
                    </span>
                    <span className="text-2xl font-black text-zinc-950">
                      {convert(card.price)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        id: card.id,
                        name: `${card.title} (${genderTab === "men" ? "Men" : "Women"})`,
                        price: card.price,
                        quantity: 1,
                        image: card.image,
                      })
                    }
                    className="bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. COMPLETE TRANSFORMATION BUNDLE */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-block px-3 py-1 rounded-md border border-red-700/60 text-red-500 text-[10px] font-black uppercase tracking-widest">
              Training + Nutrition Package
            </span>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Complete <br />
              <span className="text-red-500">Transformation</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md">
              Get your training plan, nutrition plan, exercise video library,
              and recipe collection aligned together in one complete package.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white text-zinc-950 rounded-3xl p-7 sm:p-9 shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-5">
              Included in the Package
            </p>
            <div className="divide-y divide-zinc-200 mb-6">
              <div className="py-3.5 flex items-start gap-4">
                <span className="text-xs font-black text-red-700 mt-0.5">01</span>
                <div>
                  <h4 className="font-black uppercase text-sm">Training Plan</h4>
                  <p className="text-xs text-zinc-500">
                    For Men or Women • Beginner or Advanced (2x/3x/4x)
                  </p>
                </div>
              </div>
              <div className="py-3.5 flex items-start gap-4">
                <span className="text-xs font-black text-red-700 mt-0.5">02</span>
                <div>
                  <h4 className="font-black uppercase text-sm">Nutrition Plan + Vault Access</h4>
                  <p className="text-xs text-zinc-500">
                    Bulking or Cutting + Exercise Videos &amp; Healthy Recipes
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Complete Package
              </p>
              <div className="flex items-baseline gap-2.5">
                <span className="text-sm text-zinc-400 line-through font-bold">
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
                  image: "/images/advanced.jpg",
                })
              }
              className="w-full bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all flex items-center justify-between px-6 cursor-pointer active:scale-[0.98]"
            >
              <span>Get the Package</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES */}
      <section id="results" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-12">
          <p className="text-xs font-black uppercase tracking-widest text-red-700 mb-2">
            500+ Success Stories
          </p>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">
            Success <span className="text-red-700">Stories</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01/03",
              name: "Marko T.",
              result: "-15 KG / 12 Weeks",
              quote:
                "Working with Shuki was the best investment of my life. Real structure, real results, and habits I'll keep forever.",
              before: "/images/before1.jpg",
              after: "/images/after1.jpg",
            },
            {
              num: "02/03",
              name: "Stefan R.",
              result: "+8 KG Muscle",
              quote:
                "Before starting, I was stuck in bad habits and low energy. Now my body and mindset are completely transformed.",
              before: "/images/before2.jpg",
              after: "/images/after2.jpg",
            },
            {
              num: "03/03",
              name: "Aleks M.",
              result: "-22 KG / 6 Months",
              quote:
                "I was skeptical at first, but week by week new definition appeared that I had never seen before.",
              before: "/images/before3.jpg",
              after: "/images/after3.jpg",
            },
          ].map((story) => (
            <div
              key={story.num}
              className="bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="relative h-56 flex">
                <img src={story.before} alt="Before" className="w-1/2 h-full object-cover border-r border-white" />
                <img src={story.after} alt="After" className="w-1/2 h-full object-cover" />
                <span className="absolute top-3 right-3 bg-white/95 text-zinc-950 text-[10px] font-black px-2.5 py-1 rounded-full">
                  {story.num}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black uppercase text-base">{story.name}</h3>
                  <span className="text-[10px] font-black uppercase bg-red-50 text-red-700 px-2.5 py-1 rounded-full">
                    {story.result}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. POPULAR QUESTIONS */}
      <section id="faq" className="py-20 bg-zinc-50 border-t border-zinc-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-2">
              Popular <span className="text-red-700">Questions</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              Answers to the most common questions about training and nutrition.
            </p>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-zinc-950 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <span className="text-red-700 flex-shrink-0">
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-zinc-600 leading-relaxed pr-8">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}