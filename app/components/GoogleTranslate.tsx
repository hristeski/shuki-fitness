"use client";

import { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // 1. Ја дефинираме функцијата за иницијализација
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en", // Основниот јазик на сајтот
          includedLanguages: "en,de,mk,es,fr", // Кои јазици се поддржани
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // 2. Ја вчитуваме скриптата ако веќе не е вчитана
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
    }
  }, []);

  // Ова е невидливиот контејнер што Google ќе го користи, 
  // а твоето LanguageSelector копче ќе го контролира!
  return <div id="google_translate_element" className="hidden"></div>;
}