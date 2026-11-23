"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";

type Language = {
  code: string;
  name: string;
  flag: string;
};

// ДОДАДЕНИ ПОВЕЌЕ ЈАЗИЦИ
const languages: Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "mk", name: "Македонски", flag: "🇲🇰" },
  { code: "sq", name: "Shqip", flag: "🇦🇱" },
  { code: "sr", name: "Srpski", flag: "🇷🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface LanguageSelectorProps {
  direction?: "up" | "down";
}

export default function LanguageSelector({ direction = "down" }: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Проверува кој јазик е моментално активен (од колачињата на Google)
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      const found = languages.find(l => l.code === match[1]);
      if (found) setCurrentLang(found);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ФИКС: Најсигурен начин за менување јазик во Next.js
  const switchLanguage = (lang: Language) => {
    setCurrentLang(lang);
    setOpen(false);
    
    if (lang.code === "en") {
      // Ако е Англиски (дифолт), ги бришеме колачињата за превод
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
      // За други јазици, поставуваме колаче
      document.cookie = `googtrans=/en/${lang.code}; path=/`;
      document.cookie = `googtrans=/en/${lang.code}; domain=.${window.location.hostname}; path=/`;
    }
    
    // Инстант рефреш за да се примени преводот чисто
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white text-sm transition-colors shadow-lg"
      >
        <Globe size={14} className="text-red-600" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline font-black uppercase tracking-widest text-[10px]">{currentLang.code}</span>
        <ChevronDown 
          size={14} 
          className={`text-zinc-500 transition-transform ${
            direction === "up" ? (open ? "rotate-0" : "rotate-180") : (open ? "rotate-180" : "rotate-0")
          }`} 
        />
      </button>

      {open && (
        <div className={`absolute right-0 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden ${
          direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
        }`}>
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-zinc-900 transition-colors text-left
                  ${lang.code === currentLang.code ? "bg-red-600/10 text-white border-l-2 border-red-600" : "text-zinc-400 border-l-2 border-transparent"}`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-black text-xs uppercase tracking-widest">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}