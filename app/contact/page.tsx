"use client";

import ScrollReveal from "../components/ScrollReveal";
import {
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";

const PHONE_RAW = "38977852645";
const PHONE_DISPLAY = "+389 77 852 645";
const BUSINESS_EMAIL = "contact@evolutionbody.fit";
const INSTAGRAM_HANDLE = "@angjeleskiandrej";
const INSTAGRAM_URL = "https://www.instagram.com/angjeleskiandrej/";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 overflow-x-clip pb-24 lg:pb-20">
      {/* 1. CLEAN LIGHT EDITORIAL HEADER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/90 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-[11px] font-black uppercase tracking-widest text-red-800">
              <MessageSquare size={13} /> Evolution Body Support
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
              Get In <span className="text-red-800">Touch.</span>
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-lg font-medium pt-1">
              Choose your preferred platform below to reach Coach Andrej
              Angjeleski directly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-white border border-stone-200/90 rounded-2xl px-4 py-3 shadow-sm self-start md:self-auto flex-shrink-0">
            <Clock size={16} className="text-red-800 flex-shrink-0" />
            <p className="text-xs font-bold text-stone-600">
              Average reply: <span className="text-stone-950">Under 24h</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. 4 COLOR-CODED DIRECT CONTACT CARDS (2x2 GRID) */}
      <ScrollReveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* 1. WHATSAPP CARD (GREEN) */}
          <a
            href={`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
              "Hi Andrej, I have a question about Evolution Body!"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 hover:border-[#25D366]/70 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-stone-950 flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.126.555 4.2 1.608 6.026L0 24l6.113-1.602a11.983 11.983 0 0 0 5.918 1.554h.005c6.645 0 12.031-5.386 12.031-12.031C24.067 5.385 18.676 0 12.031 0zm6.993 17.078c-.296.834-1.737 1.594-2.404 1.693-.614.092-1.412.13-2.275-.144-.525-.167-1.201-.391-2.067-.765-3.638-1.57-6.014-5.237-6.196-5.479-.181-.242-1.479-1.969-1.479-3.757 0-1.787.937-2.665 1.27-3.028.332-.363.726-.454.968-.454.242 0 .484.002.696.012.224.011.524-.085.82.626.302.726 1.028 2.513 1.119 2.695.09.181.151.393.03.635-.121.242-.182.393-.363.605-.181.212-.382.473-.544.635-.181.181-.37.378-.159.741.211.363.941 1.553 2.021 2.515 1.388 1.238 2.559 1.622 2.922 1.803.363.181.575.151.787-.091.212-.242.908-1.059 1.15-1.422.242-.363.484-.302.817-.181.332.121 2.118.999 2.481 1.18.363.181.605.272.696.424.09.151.09.877-.206 1.711z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">
                    Fastest Reply
                  </p>
                  <h2 className="font-black uppercase text-lg mt-0.5 truncate">
                    WhatsApp
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {PHONE_DISPLAY}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-stone-500 flex-shrink-0 group-hover:text-[#25D366] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </div>
          </a>

          {/* 2. VIBER CARD (PURPLE) */}
          <a
            href={`viber://chat?number=%2B${PHONE_RAW}`}
            className="group block bg-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 hover:border-[#7360F2]/70 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#7360F2]/15 text-[#9485ff] group-hover:bg-[#7360F2] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.696 6.697.633 9.816c-.066 3.119-.149 8.958 5.479 10.55h.005l-.005 2.423s-.038.983.608 1.182c.78.241 1.236-.503 1.98-1.306.408-.443.97-.997 1.394-1.484 3.841.323 6.798-.418 7.136-.527.775-.251 5.167-.813 5.881-6.642.735-6.017-.354-9.826-2.345-11.547C18.698.665 14.956-.04 11.398.002zm.305 1.703c3.058-.037 6.265.581 7.986 2.138 1.694 1.471 2.575 4.749 1.946 9.914-.598 4.864-4.209 5.291-4.863 5.502-.285.091-2.86.727-6.112.507 0 0-2.425 2.919-3.18 3.679-.121.122-.262.167-.354.145-.131-.032-.167-.187-.164-.412l.026-4.017c-4.746-1.315-4.462-6.259-4.412-8.859.051-2.6.548-4.737 2.008-6.197 1.964-1.794 5.448-2.374 7.119-2.4zm-.137 2.669c-.38 0-.38.579.005.583 2.567.022 4.661 1.72 4.703 4.822 0 .386.583.381.579-.005-.048-3.413-2.393-5.379-5.287-5.4zm.369 1.65c-.38-.032-.433.541-.048.578 1.568.149 2.606 1.24 2.756 2.931.032.381.609.332.577-.054-.176-1.999-1.441-3.285-3.285-3.455zm-4.132.164c-.444.011-.905.236-1.26.646-.577.674-.828 1.464-.587 2.386.486 1.856 1.546 3.553 2.989 4.989 1.443 1.436 3.168 2.48 5.039 2.959.927.236 1.717-.016 2.386-.599.512-.444.716-1.084.561-1.618-.081-.278-.262-.519-.54-.706-.674-.455-1.353-.899-2.037-1.337-.486-.31-.989-.209-1.374.166l-.46.449c-.187.187-.465.246-.732.118-.984-.471-1.84-1.241-2.423-2.198-.144-.235-.118-.535.069-.727l.433-.444c.38-.391.471-.888.155-1.375-.433-.674-.877-1.348-1.332-2.011-.256-.375-.572-.599-.887-.599zm4.31 1.482c-.375-.043-.444.524-.069.567.647.075 1.075.476 1.155 1.123.048.374.615.305.567-.07-.112-.941-.738-1.519-1.653-1.62z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#9485ff]">
                    Direct Call / Text
                  </p>
                  <h2 className="font-black uppercase text-lg mt-0.5 truncate">
                    Viber
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {PHONE_DISPLAY}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-stone-500 flex-shrink-0 group-hover:text-[#9485ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </div>
          </a>

          {/* 3. INSTAGRAM CARD (PINK / MAGENTA) */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 hover:border-[#E1306C]/70 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#E1306C]/15 text-[#ff5c93] group-hover:bg-gradient-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#8134AF] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#ff5c93]">
                    Follow &amp; DM
                  </p>
                  <h2 className="font-black uppercase text-lg mt-0.5 truncate">
                    Instagram
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {INSTAGRAM_HANDLE}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-stone-500 flex-shrink-0 group-hover:text-[#ff5c93] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </div>
          </a>

          {/* 4. BUSINESS EMAIL CARD (CRIMSON RED) */}
          <a
            href={`mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(
              "Evolution Body Inquiry"
            )}`}
            className="group block bg-stone-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-stone-800 hover:border-red-600/70 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-red-800/25 text-red-500 group-hover:bg-red-700 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <Mail size={26} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                    Business Inquiries
                  </p>
                  <h2 className="font-black uppercase text-lg mt-0.5 truncate">
                    Email
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {BUSINESS_EMAIL}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={20}
                className="text-stone-500 flex-shrink-0 group-hover:text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </div>
          </a>
        </div>

        {/* LOCATION BAR */}
        <div className="mt-6 bg-white border border-stone-200/90 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-center gap-2.5 text-xs font-bold text-stone-600">
          <MapPin size={16} className="text-red-800 flex-shrink-0" />
          <span>Skopje, North Macedonia • Online Coaching Worldwide</span>
        </div>
      </ScrollReveal>
    </main>
  );
}