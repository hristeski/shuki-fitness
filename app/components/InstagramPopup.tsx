"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export default function InstagramPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasClosed = sessionStorage.getItem("igPopupClosed");
    
    if (!hasClosed) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("igPopupClosed", "true");
  };

  return (
    show ? (
      <div style={{ zIndex: 999999 }} className="fixed inset-0 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
        
        <div className="relative w-[92%] sm:w-full max-w-sm md:max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500">
          
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 text-white/80 hover:text-white bg-black/40 backdrop-blur-md border border-white/10 hover:bg-red-600 transition-all p-2 rounded-full"
          >
            <X size={18} />
          </button>

          {/* СЛИКА */}
          <div className="relative w-full h-48 sm:h-56 md:h-auto md:w-2/5 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-900 flex-shrink-0">
            <Image 
              src="/images/coach.jpg" 
              alt="Coach Shuki" 
              fill 
              className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent md:hidden"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950 hidden md:block"></div>
          </div>

          {/* СОДРЖИНА - ЧИСТА И КРАТКА */}
          <div className="relative w-full md:w-3/5 p-6 sm:p-8 md:p-12 flex flex-col justify-center text-center md:text-left z-10 -mt-6 md:mt-0">
            
            <h4 className="text-red-600 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">
              Exclusive Offer
            </h4>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3 md:mb-4 leading-none">
              Claim Your <br className="hidden md:block" />
              <span className="text-red-600">30% OFF</span>
            </h3>
            
            <p className="text-zinc-400 text-sm md:text-base mb-8 leading-relaxed">
              Follow <strong className="text-white">@angjeleskiandrej</strong> and send a DM to reveal your promo code.
            </p>

            {/* ЕДНОСТАВНО КОПЧЕ */}
            <a 
              href="https://instagram.com/angjeleskiandrej" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleClose}
              className="flex items-center justify-center gap-3 w-full bg-white text-black font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95 text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Follow Me
            </a>

            <button 
              onClick={handleClose}
              className="mt-5 md:mt-6 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              No thanks, I'll skip
            </button>

          </div>
        </div>
      </div>
    ) : null
  );
}