"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "MK", label: "Македонски" },
  { code: "SQ", label: "Shqip" },
  { code: "EL", label: "Ελληνικά" },
  { code: "SR", label: "Srpski" },
  { code: "BG", label: "Български" },
];

export default function LanguageDropdown() {
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select Language"
        className="flex items-center gap-1.5 h-10 md:h-11 px-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer"
      >
        <Globe size={15} className="text-red-800" />
        <span>{selected.code}</span>
        <ChevronDown
          size={13}
          className={`text-zinc-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden">
          {LANGUAGES.map((lang) => {
            const active = selected.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setSelected(lang);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-red-50 text-red-800"
                    : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                }`}
              >
                <span>{lang.label}</span>
                {active && <Check size={14} className="text-red-800" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}