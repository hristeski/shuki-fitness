"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Check, Dumbbell, ArrowRight, Sparkles } from "lucide-react";

type Frequency = "2x" | "3x" | "4x";

const PROGRAMS = [
  {
    level: "beginner",
    badge: "For Beginners",
    title: "Foundation Blueprint",
    goal: "Muscle Activation & Fat Loss",
    duration: "8-Week Program",
    image: "/images/beginner.jpg",
    basePrice: 20,
    description:
      "Built for beginners who want to master proper form, build core strength, and establish a sustainable gym routine without burnout.",
    features: [
      "Step-by-step exercise execution guide",
      "Progressive overload tracking sheet",
      "Warm-up & mobility routine included",
      "Lifetime PDF access in your Vault",
    ],
  },
  {
    level: "advanced",
    badge: "For Advanced Lifters",
    title: "Master of Aesthetics",
    goal: "Hypertrophy & Muscle Density",
    duration: "12-Week Program",
    image: "/images/advanced.jpg",
    basePrice: 30,
    description:
      "Designed for experienced lifters ready to break plateaus using drop sets, supersets, and high-volume hypertrophy splits.",
    features: [
      "Advanced intensity techniques (drop sets & supersets)",
      "Weak-point specialization blocks",
      "Exact RPE & rest-time targets",
      "Lifetime PDF access in your Vault",
    ],
  },
];

export default function ProgramsPage() {
  const [selectedLevel, setSelectedLevel] = useState<"all" | "beginner" | "advanced">("all");
  const [frequencies, setFrequencies] = useState<Record<string, Frequency>>({
    beginner: "3x",
    advanced: "4x",
  });

  const { addToCart } = useCart();
  const { convert } = useCurrency();

  const visiblePrograms =
    selectedLevel === "all"
      ? PROGRAMS
      : PROGRAMS.filter((p) => p.level === selectedLevel);

  const handleBuy = (program: (typeof PROGRAMS)[number]) => {
    const freq = frequencies[program.level];
    addToCart({
      id: `${program.level}-${freq}`,
      name: `${program.title} (${freq} / Week)`,
      price: program.basePrice,
      quantity: 1,
      image: program.image,
    });
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 py-12 md:py-20 pb-28 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-700 mb-2">
              Workout Programs
            </p>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Choose Your <span className="text-red-700">Split.</span>
            </h1>
          </div>

          {/* LEVEL FILTER PILLS */}
          <div className="inline-flex p-1.5 bg-zinc-100 rounded-2xl border border-zinc-200 self-start">
            {[
              { id: "all", label: "All Levels" },
              { id: "beginner", label: "Beginner" },
              { id: "advanced", label: "Advanced" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedLevel === tab.id
                    ? "bg-red-700 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROGRAM CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visiblePrograms.map((program) => {
            const activeFreq = frequencies[program.level];
            return (
              <div
                key={program.level}
                className="bg-zinc-50 border border-zinc-200 rounded-3xl overflow-hidden flex flex-col hover:border-red-700/50 hover:shadow-xl transition-all"
              >
                <div className="relative h-72 w-full bg-zinc-200 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                    {program.badge}
                  </span>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                      <Dumbbell size={14} className="text-red-700" />
                      <span>{program.duration}</span>
                      <span>•</span>
                      <span>{program.goal}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
                      {program.title}
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                      {program.description}
                    </p>

                    {/* FREQUENCY SELECTOR: 2x / 3x / 4x */}
                    <div className="mb-6">
                      <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2.5">
                        Select Weekly Frequency:
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(["2x", "3x", "4x"] as Frequency[]).map((freq) => (
                          <button
                            key={freq}
                            onClick={() =>
                              setFrequencies((prev) => ({
                                ...prev,
                                [program.level]: freq,
                              }))
                            }
                            className={`py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                              activeFreq === freq
                                ? "bg-red-700 border-red-700 text-white shadow-md shadow-red-700/20"
                                : "bg-white border-zinc-200 text-zinc-700 hover:border-red-700/50"
                            }`}
                          >
                            {freq} / Week
                          </button>
                        ))}
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-8">
                      {program.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2.5 text-xs font-bold text-zinc-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* PRICE & BUY BUTTON */}
                  <div className="pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        One-Time Payment
                      </p>
                      <p className="text-2xl font-black text-zinc-950">
                        {convert(program.basePrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBuy(program)}
                      className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-7 py-4 rounded-2xl transition-all active:scale-95 cursor-pointer"
                    >
                      Add to Cart
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LINK TO ONLINE COACHING */}
        <div className="mt-14 bg-zinc-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest mb-2">
              <Sparkles size={15} /> Need 100% Custom Guidance?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Apply for 1-on-1 Online Coaching
            </h3>
          </div>
          <Link
            href="/coaching"
            className="bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-4 rounded-2xl transition-all active:scale-95"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}