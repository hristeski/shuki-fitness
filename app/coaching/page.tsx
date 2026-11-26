"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "../components/ScrollReveal";
import {
  Check,
  Dumbbell,
  Utensils,
  Video,
  CalendarCheck,
  ArrowRight,
  Clock,
  Home as HomeIcon,
} from "lucide-react";

const WHATSAPP_NUMBER = "38977852645";

const INCLUDED_ITEMS = [
  {
    icon: Dumbbell,
    title: "Custom Training Plan",
    desc: "Built around your body, weak points, gym or home equipment, and weekly schedule.",
  },
  {
    icon: Utensils,
    title: "Personalized Nutrition",
    desc: "Exact calories, macros, and flexible meals adapted to foods you actually enjoy.",
  },
  {
    icon: CalendarCheck,
    title: "Weekly Check-Ins",
    desc: "Physique, weight, and strength reviews every week with real-time adjustments.",
  },
  {
    icon: Video,
    title: "Form & Direct Support",
    desc: "Send exercise videos for technique feedback and message Andrej directly on WhatsApp.",
  },
];

export default function CoachingPage() {
  const [clientName, setClientName] = useState("");
  const [gender, setGender] = useState<"Men" | "Women">("Men");
  const [goal, setGoal] = useState<"Fat Loss" | "Muscle Gain" | "Body Recomposition">("Fat Loss");
  const [trainingPlace, setTrainingPlace] = useState<"Gym" | "Home">("Gym");
  const [packageLength, setPackageLength] = useState<"1 Month" | "3 Months" | "6 Months">("3 Months");

  const isMen = gender === "Men";

  const previewMessage = `Hi Andrej! ${
    clientName.trim() ? `My name is ${clientName.trim()}. ` : ""
  }I'm interested in 1-on-1 Online Coaching with Evolution Body.\n\n• Category: ${gender}\n• Goal: ${goal}\n• Training: ${trainingPlace}\n• Duration: ${packageLength}\n\nCan we discuss how to get started?`;

  const handleWhatsAppStart = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(previewMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 overflow-x-clip pb-28 lg:pb-20">
      {/* 1. CLEAN HEADER WITH BREATHING ROOM ON MOBILE */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/90 pb-8">
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-800">
              Evolution Body • 1-on-1 System
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Online <span className="text-red-800">Coaching</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
              Full personal guidance tailored to your physique, schedule, and
              goals — managed directly with Coach Andrej Angjeleski.
            </p>
          </div>

          {/* COACH STATUS PILL */}
          <div className="inline-flex items-center gap-3.5 bg-white border border-stone-200/90 rounded-2xl p-3 pr-5 shadow-sm self-start md:self-auto flex-shrink-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-900 flex-shrink-0">
              <Image
                src="/images/coach.jpg"
                alt="Andrej Angjeleski"
                fill
                sizes="48px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight text-stone-950 leading-none">
                Andrej Angjeleski
              </p>
              <p className="text-[11px] font-bold text-stone-500 mt-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Available on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT'S INCLUDED */}
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-12">
        <section id="whats-included">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              What&apos;s <span className="text-red-800">Included</span>
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              4 Core Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {INCLUDED_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-red-800/35 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center mb-4 flex-shrink-0">
                    <Icon size={21} />
                  </div>
                  <h3 className="font-black uppercase text-base tracking-tight mb-2 text-stone-950">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed flex-1">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* 3. INTERACTIVE WHATSAPP BUILDER (SPACIOUS ON MOBILE & DESKTOP) */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section
          id="apply-whatsapp"
          className="bg-stone-950 text-white rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-stone-800"
        >
          <div className="absolute -right-24 -bottom-24 w-80 h-80 bg-[#25D366]/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -left-24 -top-24 w-72 h-72 bg-red-800/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">
            {/* LEFT: INTRO + BULLETS + LIVE PREVIEW */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-7">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-[10px] font-black uppercase tracking-widest">
                  Direct WhatsApp Consultation
                </span>

                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black uppercase tracking-tighter leading-[0.98]">
                  Start With a <br />
                  <span className="text-[#25D366]">Direct Message.</span>
                </h2>

                <p className="text-stone-300 text-sm leading-relaxed">
                  Choose your goal and training setup below, then tap Continue on
                  WhatsApp. Your message is prepared automatically.
                </p>

                <ul className="space-y-3 pt-2">
                  {[
                    "Direct 1-on-1 chat with Andrej Angjeleski",
                    "No long forms — fast personal reply",
                    "Available for Men & Women worldwide",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-xs sm:text-sm font-bold text-stone-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* LIVE WHATSAPP PREVIEW */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#25D366]/50">
                      <Image
                        src="/images/coach.jpg"
                        alt="Andrej"
                        fill
                        sizes="36px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white leading-none">
                        Coach Andrej
                      </p>
                      <p className="text-[10px] font-bold text-[#25D366] mt-1">
                        WhatsApp Message Preview
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Auto-filled
                  </span>
                </div>

                <div className="bg-[#0b3d24]/70 border border-[#25D366]/20 rounded-xl rounded-tr-sm p-4 text-xs sm:text-sm text-stone-100 whitespace-pre-line leading-relaxed font-medium">
                  {previewMessage}
                </div>
              </div>
            </div>

            {/* RIGHT: SPACIOUS FORM CARD */}
            <div className="lg:col-span-7 bg-white text-stone-950 rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col justify-between gap-7">
              <div className="space-y-6">
                {/* NAME + CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="coaching-name"
                      className="block text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2.5"
                    >
                      Your Name (Optional)
                    </label>
                    <input
                      id="coaching-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter your name..."
                      className="w-full h-12 bg-stone-50 border border-stone-200 rounded-xl px-4 text-sm font-medium text-stone-950 focus:outline-none focus:border-red-800 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2.5">
                      Category
                    </p>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200/80 h-12">
                      <button
                        type="button"
                        onClick={() => setGender("Men")}
                        className={`rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isMen
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-blue-700 hover:bg-white"
                        }`}
                      >
                        For Men
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender("Women")}
                        className={`rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          !isMen
                            ? "bg-pink-500 text-white shadow-sm"
                            : "text-pink-600 hover:bg-white"
                        }`}
                      >
                        For Women
                      </button>
                    </div>
                  </div>
                </div>

                {/* PRIMARY GOAL */}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2.5">
                    Primary Goal
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(["Fat Loss", "Muscle Gain", "Body Recomposition"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                          goal === g
                            ? "bg-red-800 text-white border-red-800 shadow-md shadow-red-900/20"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LOCATION */}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2.5">
                    Training Location
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTrainingPlace("Gym")}
                      className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border inline-flex items-center justify-center gap-2 ${
                        trainingPlace === "Gym"
                          ? "bg-stone-950 text-white border-stone-950 shadow-sm"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      <Dumbbell size={15} /> Gym
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrainingPlace("Home")}
                      className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border inline-flex items-center justify-center gap-2 ${
                        trainingPlace === "Home"
                          ? "bg-stone-950 text-white border-stone-950 shadow-sm"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      <HomeIcon size={15} /> Home
                    </button>
                  </div>
                </div>

                {/* DURATION */}
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2.5">
                    Coaching Duration
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(["1 Month", "3 Months", "6 Months"] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setPackageLength(len)}
                        className={`py-3.5 px-2 rounded-xl text-xs font-black uppercase tracking-tight transition-all cursor-pointer border ${
                          packageLength === len
                            ? "bg-stone-950 text-white border-stone-950 shadow-sm"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SUBMIT CTA */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleWhatsAppStart}
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-stone-950 font-black uppercase tracking-wider text-xs sm:text-sm py-4 px-6 rounded-2xl transition-all shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.126.555 4.2 1.608 6.026L0 24l6.113-1.602a11.983 11.983 0 0 0 5.918 1.554h.005c6.645 0 12.031-5.386 12.031-12.031C24.067 5.385 18.676 0 12.031 0zm6.993 17.078c-.296.834-1.737 1.594-2.404 1.693-.614.092-1.412.13-2.275-.144-.525-.167-1.201-.391-2.067-.765-3.638-1.57-6.014-5.237-6.196-5.479-.181-.242-1.479-1.969-1.479-3.757 0-1.787.937-2.665 1.27-3.028.332-.363.726-.454.968-.454.242 0 .484.002.696.012.224.011.524-.085.82.626.302.726 1.028 2.513 1.119 2.695.09.181.151.393.03.635-.121.242-.182.393-.363.605-.181.212-.382.473-.544.635-.181.181-.37.378-.159.741.211.363.941 1.553 2.021 2.515 1.388 1.238 2.559 1.622 2.922 1.803.363.181.575.151.787-.091.212-.242.908-1.059 1.15-1.422.242-.363.484-.302.817-.181.332.121 2.118.999 2.481 1.18.363.181.605.272.696.424.09.151.09.877-.206 1.711z" />
                  </svg>
                  <span>Continue on WhatsApp</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-xs text-stone-400 text-center flex items-center justify-center gap-1.5 font-medium">
                  <Clock size={13} /> Typical reply time: within a few hours
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}