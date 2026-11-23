"use client";

import { useEffect, useState } from "react";
import { Globe, X } from "lucide-react";

// Речник за препознавање
const langMap: Record<string, { name: string, code: string, flag: string }> = {
  "mk": { name: "Македонски", code: "mk", flag: "🇲🇰" },
  "sq": { name: "Shqip", code: "sq", flag: "🇦🇱" },
  "sr": { name: "Srpski", code: "sr", flag: "🇷🇸" },
  "de": { name: "Deutsch", code: "de", flag: "🇩🇪" },
  "es": { name: "Español", code: "es", flag: "🇪🇸" },
  "fr": { name: "Français", code: "fr", flag: "🇫🇷" },
  "it": { name: "Italiano", code: "it", flag: "🇮🇹" },
};

export default function AutoTranslatePopup() {
  const [show, setShow] = useState(false);
  const [suggestedLang, setSuggestedLang] = useState<{name: string, code: string, flag: string} | null>(null);

  useEffect(() => {
    // 1. Провери дали веќе го имаме прашано (за да не досадуваме)
    const hasSeenPopup = localStorage.getItem("hasSeenTranslatePopup");
    const isAlreadyTranslated = document.cookie.includes("googtrans");

    if (!hasSeenPopup && !isAlreadyTranslated) {
      // 2. Детектирај го јазикот на прелистувачот (пр. "mk-MK" станува "mk")
      const browserLangCode = navigator.language.split("-")[0].toLowerCase();
      
      if (langMap[browserLangCode]) {
        setSuggestedLang(langMap[browserLangCode]);
        // Појави го поп-апот после 3 секунди
        setTimeout(() => setShow(true), 3000);
      }
    }
  }, []);

  const handleTranslate = () => {
    if (!suggestedLang) return;
    
    // Постави колаче и рефреширај
    document.cookie = `googtrans=/en/${suggestedLang.code}; path=/`;
    document.cookie = `googtrans=/en/${suggestedLang.code}; domain=.${window.location.hostname}; path=/`;
    localStorage.setItem("hasSeenTranslatePopup", "true");
    
    window.location.reload();
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("hasSeenTranslatePopup", "true"); // Памти дека сме го затвориле
  };

  if (!show || !suggestedLang) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-700">
      <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-start gap-4 max-w-sm">
        
        <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
          <Globe size={20} />
        </div>

        <div className="flex-1 pr-4">
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">
            Translate Page?
          </h4>
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold leading-relaxed mb-4">
            We noticed your preferred language is {suggestedLang.flag} <span className="text-white">{suggestedLang.name}</span>.
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={handleTranslate}
              className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
            >
              Translate
            </button>
            <button 
              onClick={handleDismiss}
              className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:text-white transition-colors"
            >
              No, Thanks
            </button>
          </div>
        </div>

        <button onClick={handleDismiss} className="absolute top-3 right-3 text-zinc-500 hover:text-white">
          <X size={14} />
        </button>

      </div>
    </div>
  );
}