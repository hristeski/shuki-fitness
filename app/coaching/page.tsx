"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950 py-12 md:py-20 pb-28 lg:pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-[11px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={13} /> Limited Spots Monthly
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            1-on-1 Online <span className="text-red-700">Coaching.</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base">
            100% personalized training, custom nutrition adjustments, weekly
            check-ins, and direct Viber/WhatsApp support with Coach Shuki.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ul className="space-y-4">
              {[
                "Fully customized workout plan based on your equipment & schedule",
                "Tailored Bulking or Cutting nutrition plan with food swaps",
                "Weekly physique & progress check-ins",
                "Direct 1-on-1 chat support & form video reviews",
                "Bi-weekly macro & training adjustments",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-bold text-zinc-800">
                  <span className="w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="bg-zinc-950 text-white rounded-2xl p-7 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                Custom Plan For Your Body
              </p>
              <h3 className="text-2xl font-black uppercase mb-3">
                Ready to Commit?
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Send your goals via our contact form and we&apos;ll reply within 24
                hours to get you started.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all active:scale-95"
              >
                Apply Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}