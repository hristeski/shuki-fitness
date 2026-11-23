"use client";

import { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { ChevronDown } from "lucide-react";

// 1. Додаваме опција за насока (стандардно ќе се отвора надолу)
interface CurrencySelectorProps {
  direction?: "up" | "down";
}

export default function CurrencySelector({ direction = "down" }: CurrencySelectorProps) {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm transition"
      >
        <span>{currency.flag}</span>
        <span>{currency.symbol} {currency.code}</span>
        <span className="text-white/50 text-xs">{currency.name}</span>
        
        {/* 2. Стрелката интелигентно се врти зависно од насоката */}
        <ChevronDown 
          size={14} 
          className={`transition-transform ${
            direction === "up" 
              ? (open ? "rotate-0" : "rotate-180") 
              : (open ? "rotate-180" : "rotate-0")
          }`} 
        />
      </button>

      {open && (
        // 3. Ако е "up", користиме bottom-full за да се појави НАД копчето
        <div className={`absolute left-0 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z- overflow-hidden ${
          direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
        }`}>
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { setCurrency(c); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition text-left
                ${c.code === currency.code ? "bg-white/10 text-white font-medium" : "text-white/70"}`}
            >
              <span className="text-lg">{c.flag}</span>
              <div>
                <div className="font-medium text-white">{c.symbol} {c.code}</div>
                <div className="text-xs text-white/40">{c.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}