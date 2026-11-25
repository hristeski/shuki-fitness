"use client";

import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "38977852645";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "b290878e-bd46-45f5-a84e-450e205cf510");
    formData.append("redirect", "false");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        (event.target as HTMLFormElement).reset();
        setTimeout(() => setSubmitStatus("idle"), 6000);
      } else {
        console.error("Web3Forms error:", data);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 overflow-x-clip pb-24 lg:pb-20">
      {/* 1. HEADER BANNER */}
      <section className="relative bg-stone-950 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[260px] bg-red-800/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-red-500 font-black uppercase tracking-widest text-xs mb-3">
            Evolution Body Support
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
            Get In <span className="text-red-600">Touch.</span>
          </h1>
          <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto mt-4">
            Questions about programs, your Member Vault, or 1-on-1 online
            coaching? Reach out directly via WhatsApp or send a message below.
          </p>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <ScrollReveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: DIRECT CHANNELS */}
          <div className="lg:col-span-5 space-y-4">
            {/* DIRECT WHATSAPP CARD */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hi Andrej, I have a question about Evolution Body!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-stone-950 text-white rounded-3xl p-6 shadow-xl border border-stone-800 hover:border-[#25D366]/60 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.126.555 4.2 1.608 6.026L0 24l6.113-1.602a11.983 11.983 0 0 0 5.918 1.554h.005c6.645 0 12.031-5.386 12.031-12.031C24.067 5.385 18.676 0 12.031 0zm6.993 17.078c-.296.834-1.737 1.594-2.404 1.693-.614.092-1.412.13-2.275-.144-.525-.167-1.201-.391-2.067-.765-3.638-1.57-6.014-5.237-6.196-5.479-.181-.242-1.479-1.969-1.479-3.757 0-1.787.937-2.665 1.27-3.028.332-.363.726-.454.968-.454.242 0 .484.002.696.012.224.011.524-.085.82.626.302.726 1.028 2.513 1.119 2.695.09.181.151.393.03.635-.121.242-.182.393-.363.605-.181.212-.382.473-.544.635-.181.181-.37.378-.159.741.211.363.941 1.553 2.021 2.515 1.388 1.238 2.559 1.622 2.922 1.803.363.181.575.151.787-.091.212-.242.908-1.059 1.15-1.422.242-.363.484-.302.817-.181.332.121 2.118.999 2.481 1.18.363.181.605.272.696.424.09.151.09.877-.206 1.711z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">
                      Fastest Response
                    </p>
                    <h3 className="font-black uppercase text-base mt-0.5">
                      WhatsApp Coach Andrej
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">+389 77 852 645</p>
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
            </a>

            {/* INFO CARDS */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-wider text-stone-950">
                    Business Email
                  </h4>
                  <a
                    href="mailto:contact@evolutionbody.fit"
                    className="text-sm font-medium text-stone-600 hover:text-red-800 transition-colors"
                  >
                    contact@evolutionbody.fit
                  </a>
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-wider text-stone-950">
                    WhatsApp / Viber
                  </h4>
                  <p className="text-sm font-medium text-stone-600">+389 77 852 645</p>
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-wider text-stone-950">
                    Instagram
                  </h4>
                  <a
                    href="https://www.instagram.com/angjeleskiandrej/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-stone-600 hover:text-red-800 transition-colors"
                  >
                    @angjeleskiandrej
                  </a>
                </div>
              </div>

              <div className="h-px bg-stone-100" />

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-wider text-stone-950">
                    Location
                  </h4>
                  <p className="text-sm font-medium text-stone-600">
                    Skopje, North Macedonia
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-stone-600 font-medium">
              <Clock size={16} className="text-red-800 flex-shrink-0" />
              <span>We respond to all serious inquiries within 24 hours.</span>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">
              Send a <span className="text-red-800">Message</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-8">
              Prefer email? Fill out the form below and we&apos;ll get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-[10px] font-black uppercase tracking-widest text-stone-500"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-950 placeholder:text-stone-400 outline-none focus:border-red-800 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-widest text-stone-500"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-950 placeholder:text-stone-400 outline-none focus:border-red-800 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="interest"
                  className="text-[10px] font-black uppercase tracking-widest text-stone-500"
                >
                  Topic
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-950 outline-none focus:border-red-800 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="1-on-1 Online Coaching">1-on-1 Online Coaching</option>
                  <option value="Gym or Home Training Program">Gym or Home Training Program</option>
                  <option value="Nutrition Plan (Bulking / Cutting / Vegan)">
                    Nutrition Plan (Bulking / Cutting / Vegan)
                  </option>
                  <option value="Complete Transformation Package">
                    Complete Transformation Package
                  </option>
                  <option value="Order / Member Vault Support">
                    Order / Member Vault Support
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-[10px] font-black uppercase tracking-widest text-stone-500"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your goals or how we can help..."
                  className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-950 placeholder:text-stone-400 outline-none focus:border-red-800 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-black uppercase tracking-wider text-xs py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isSubmitting
                    ? "bg-stone-400 text-white cursor-not-allowed"
                    : submitStatus === "success"
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : "bg-red-800 hover:bg-red-700 text-white shadow-red-900/25 active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle2 size={16} /> Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send Message
                  </>
                )}
              </button>

              {submitStatus === "error" && (
                <div className="flex items-center justify-center gap-2 text-red-700 text-xs font-bold bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle size={15} />
                  Something went wrong. Please try again or message us on WhatsApp.
                </div>
              )}
            </form>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}