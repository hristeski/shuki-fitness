"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser, SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import CurrencySelector from "@/app/components/CurrencySelector";
import LanguageSelector from "./LanguageSelector"; // или патеката каде што ти е зачувано

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  
  const { isSignedIn, user, isLoaded } = useUser(); 

  // Проверуваме дали најавениот корисник е Админот
  const adminEmails = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];
  const isAdmin = isLoaded && isSignedIn && adminEmails.includes(user?.primaryEmailAddress?.emailAddress || "");

  return (
    <>
      <nav className="sticky top-0 w-full z-40 bg-black/95 backdrop-blur-md border-b border-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 md:h-24 flex items-center justify-between">
          
          {/* МОБИЛНО ХАМБУРГЕР МЕНИ */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-white hover:text-red-600 p-2 -ml-2 transition-colors focus:outline-none">
              <svg className="w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* ПРЕМИУМ ЛОГО СО СЈАЈ */}
          <Link href="/" className="text-xl md:text-3xl font-black tracking-tighter uppercase text-white flex-shrink-0 group">
            SHUKI<span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)] group-hover:text-red-500 transition-colors duration-300">FITNESS</span>
          </Link>

          {/* ДЕСКТОП ЛИНКОВИ СО АНИМИРАНИ ЛИНИИ */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10 font-bold uppercase text-[10px] lg:text-xs tracking-[0.15em] text-zinc-300">
            
            <Link href="/" className="relative group py-2 hover:text-white transition-colors duration-300">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.6)]"></span>
            </Link>
            
            <Link href="/beginner-program" className="relative group py-2 hover:text-white transition-colors duration-300">
              Beginner Program
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.6)]"></span>
            </Link>
            
            <Link href="/advanced-program" className="relative group py-2 hover:text-white transition-colors duration-300">
              Advanced Program
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.6)]"></span>
            </Link>
            
            <Link href="/contact" className="relative group py-2 hover:text-white transition-colors duration-300">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(220,38,38,0.6)]"></span>
            </Link>
            
            {/* АДМИН ПАНЕЛ */}
            {isAdmin && (
              <Link href="/admin" className="text-black bg-white px-5 py-2.5 rounded-lg hover:bg-zinc-200 transition-all font-black tracking-widest text-[10px] shadow-[0_0_15px_rgba(255,255,255,0.2)] ml-2">
                ADMIN PANEL
              </Link>
            )}

            {/* MY PROGRAMS КОПЧЕ */}
            {isSignedIn && !isAdmin && (
              <Link href="/dashboard" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-2 ml-2 hover:-translate-y-0.5 duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                MY PROGRAMS
              </Link>
            )}
          </div>

          {/* ИКОНИ ДЕСНО */}
          <div className="flex items-center gap-4 md:gap-6 text-white flex-shrink-0">
            
            {isSignedIn ? (
              <div className="flex items-center hover:scale-105 transition-transform duration-300">
                <UserButton />
              </div>
            ) : (
              <div className="hidden md:block">
                <SignInButton mode="modal">
                  <button className="hover:text-red-600 transition-colors duration-300 flex items-center group">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>
                </SignInButton>
              </div>
            )}

            <button onClick={openCart} className="relative hover:text-red-600 transition-colors duration-300 p-1 md:p-0 group">
              <svg className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 lg:h-5 lg:w-5 items-center justify-center rounded-full bg-red-600 text-[9px] lg:text-[10px] font-bold text-white border-2 border-black shadow-[0_0_10px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            </button>
          </div>

        </div>
      </nav>

      {/* ПОЗАДИНА ЗА МОБИЛНО МЕНИ */}
      <div 
        className={`fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* ЦРНА ФИОКА (МОБИЛНО МЕНИ) */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-black border-r border-zinc-800 shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <span className="text-2xl font-black tracking-tighter uppercase text-white">
            SHUKI<span className="text-red-600">FIT</span>
          </span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400 hover:text-white p-2 -mr-2">
            <svg className="w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-6 py-8 h-full overflow-y-auto">
            
            {/* ГОРЕН ДЕЛ ЗА НАЈАВЕНИ КОРИСНИЦИ */}
            {isSignedIn && (
              <div className="mb-8">
                {/* САМО ЗА КЛИЕНТИ */}
                {!isAdmin && (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-red-700 transition-colors shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    MY PROGRAMS
                  </Link>
                )}

                {/* САМО ЗА АДМИН (МОБИЛНО) */}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    ADMIN PANEL
                  </Link>
                )}
              </div>
            )}

            {/* ОСТАНАТИ ЛИНКОВИ */}
            <div className="flex flex-col space-y-6 font-black uppercase text-xl tracking-widest text-zinc-300 mb-8">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:text-red-600 transition-colors">Home</Link>
              <Link href="/beginner-program" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:text-red-600 transition-colors">Beginner</Link>
              <Link href="/advanced-program" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:text-red-600 transition-colors">Advanced</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white hover:text-red-600 transition-colors">Contact</Link>
            </div>

            <div className="h-px w-full bg-zinc-900 mb-auto"></div>
              <LanguageSelector direction="down" />
            <div className="mt-8 flex flex-col gap-4">
                {!isSignedIn ? (
                    <SignInButton mode="modal">
                        <button className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-zinc-200 transition-colors">
                            Log In / Sign Up
                        </button>
                    </SignInButton>
                ) : (
                     
                    <SignOutButton>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-transparent border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest py-4 rounded-xl hover:text-red-600 hover:border-red-600 transition-colors">
                            Sign Out
                        </button>
                    </SignOutButton>
                    
                )}
            </div>
        </div>
      </div>
    </>
  );
}