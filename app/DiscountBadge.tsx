"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function DiscountBadge() {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("discountBadgeClosed");

    if (!hasClosed) {
      // Се појавува после 20 секунди
      const timer = setTimeout(() => {
        setShowBadge(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault(); // Спречува кликот на Х да те однесе на друга страна
    setShowBadge(false); 
    sessionStorage.setItem("discountBadgeClosed", "true"); 
  };

  return (
    <div 
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        showBadge ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Премиум Темен Контејнер */}
      <div className="relative flex flex-col items-center bg-zinc-950/90 backdrop-blur-md border border-r-0 border-zinc-800 rounded-l-2xl py-2 shadow-[-10px_0_40px_rgba(0,0,0,0.6)]">
        
        {/* Копче за гасење (Сега е ВНАТРЕ, нема да се сече) */}
        <button 
          onClick={handleClose}
          className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-full mb-1"
        >
          <X size={14} strokeWidth={3} />
        </button>

        {/* Линк / Акција */}
        <Link href="" className="flex flex-col items-center gap-3 px-2 group pb-3">
          
          {/* Икона за попуст */}
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0)] group-hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <svg className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 14l6-6m-4 0h.01M15 14h.01M5 12a7 7 0 1114 0 7 7 0 01-14 0z" />
            </svg>
          </div>

          {/* Текст */}
          <span 
            className="text-zinc-400 group-hover:text-white font-black uppercase tracking-[0.25em] text-[10px] md:text-xs transition-colors"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Claim <span className="text-red-600 group-hover:text-white transition-colors">30%</span>
          </span>

        </Link>
      </div>
    </div>
  );
}