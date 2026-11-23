"use client";

import Link from "next/link";
import CurrencySelector from "./CurrencySelector";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-white pt-20 pb-28 lg:pb-12 border-t border-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-14 border-b border-stone-800/80">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              Start <span className="text-red-700">Today.</span>
            </h2>
            <p className="text-stone-400 text-sm mt-2 font-medium">
              Evolution Body by Andrej Angjeleski — Built for lasting results.
            </p>
          </div>
          <Link
            href="/#programs"
            className="inline-flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-7 py-4 rounded-full transition-all shadow-lg shadow-red-950/40 active:scale-95"
          >
            Choose a Program
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-black uppercase tracking-wider text-white mb-1">
              Evolution Body
            </h4>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-4">
              by Andrej Angjeleski
            </p>
            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              Structured gym &amp; home training programs, Bulking &amp; Cutting
              nutrition plans, and 1-on-1 online coaching.
            </p>
            <CurrencySelector direction="up" />
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-4">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm font-medium text-stone-300">
              <li>
                <Link href="/#programs" className="hover:text-red-500 transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="hover:text-red-500 transition-colors">
                  Online Coaching
                </Link>
              </li>
              <li>
                <Link href="/#results" className="hover:text-red-500 transition-colors">
                  Transformations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-4">
              Members
            </h4>
            <ul className="space-y-3 text-sm font-medium text-stone-300">
              <li>
                <Link href="/dashboard" className="hover:text-red-500 transition-colors">
                  My Profile &amp; Vault
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=videos" className="hover:text-red-500 transition-colors">
                  Exercise Videos
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=recipes" className="hover:text-red-500 transition-colors">
                  Healthy Recipes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-medium text-stone-300">
              <li>
                <a
                  href="https://www.instagram.com/angjeleskiandrej/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @angjeleskiandrej
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@evolutionbody.fit"
                  className="text-stone-400 hover:text-white transition-colors text-xs"
                >
                  contact@evolutionbody.fit
                </a>
              </li>
              <li className="text-stone-500 text-xs">Skopje, North Macedonia</li>
            </ul>
          </div>
        </div>

        <div className="py-4 select-none pointer-events-none text-center">
          <p className="text-[11vw] lg:text-[8.2rem] font-black uppercase tracking-tighter leading-[0.85] text-red-800/90">
            EVOLUTION BODY
          </p>
        </div>

        <div className="pt-8 mt-6 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-medium">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
          <p>
            © {new Date().getFullYear()} Evolution Body by Andrej Angjeleski. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}