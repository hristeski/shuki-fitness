"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { Check, Flame, TrendingUp, ArrowRight, ChefHat } from "lucide-react";

const NUTRITION_PLANS = [
  {
    id: "nutrition-bulking",
    tag: "Lean Muscle Gain",
    title: "Bulking Nutrition Plan",
    price: 20,
    calories: "+300 to +500 kcal Surplus",
    icon: TrendingUp,
    image: "/images/advanced.jpg",
    description:
      "Designed for hardgainers and lifters who want to maximize muscle growth and strength while keeping body fat gain minimal.",
    features: [
      "Exact daily protein, carb, and fat targets",
      "4–5 structured high-calorie, clean meal options",
      "Pre- and post-workout fueling guide",
      "Supplement essentials (Creatine, Whey, Electrolytes)",
    ],
  },
  {
    id: "nutrition-cutting",
    tag: "Fat Loss & Definition",
    title: "Cutting Nutrition Plan",
    price: 20,
    calories: "-350 to -500 kcal Deficit",
    icon: Flame,
    image: "/images/beginner.jpg",
    description:
      "Strip stubborn body fat while preserving hard-earned muscle mass, keeping hunger low and gym performance high.",
    features: [
      "High-volume, high-protein satiating meal structure",
      "Zero crash-dieting — sustainable weekly fat loss",
      "Refeed day & craving management strategy",
      "Grocery shopping list included",
    ],
  },
];

export default function NutritionPage() {
  const { addToCart } = useCart();
  const { convert } = useCurrency();

  return (
    <main className="min-h-screen bg-white text-zinc-950 py-12 md:py-20 pb-28 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-black uppercase tracking-widest text-red-700 mb-2">
            Precision Nutrition
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            Fuel Your <span className="text-red-700">Goal.</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base">
            Training builds the stimulus — nutrition builds the physique. Choose
            whether you&apos;re in a Bulking or Cutting phase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {NUTRITION_PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className="bg-zinc-50 border border-zinc-200 rounded-3xl p-7 sm:p-9 flex flex-col justify-between hover:border-red-700/50 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      <Icon size={13} /> {plan.tag}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-500">
                      {plan.calories}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
                    {plan.title}
                  </h2>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs font-bold text-zinc-700">
                        <span className="w-5 h-5 rounded-full bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      One-Time Payment
                    </p>
                    <p className="text-2xl font-black">{convert(plan.price)}</p>
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        id: plan.id,
                        name: plan.title,
                        price: plan.price,
                        quantity: 1,
                        image: plan.image,
                      })
                    }
                    className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-7 py-4 rounded-2xl transition-all active:scale-95 cursor-pointer"
                  >
                    Add to Cart <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RECIPES BANNER */}
        <div className="mt-14 bg-red-700 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <ChefHat size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">
                Looking for Meal Ideas?
              </h3>
              <p className="text-red-100 text-sm mt-1">
                Browse our free high-protein Bulking & Cutting recipe collection.
              </p>
            </div>
          </div>
          <Link
            href="/recipes"
            className="bg-white text-zinc-950 hover:bg-zinc-100 font-black uppercase tracking-wider text-xs px-7 py-4 rounded-2xl transition-all active:scale-95 flex-shrink-0"
          >
            Explore Recipes
          </Link>
        </div>
      </div>
    </main>
  );
}