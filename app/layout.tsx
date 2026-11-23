import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

import Navbar from "./components/navbar";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import { ClerkProvider } from '@clerk/nextjs';
import { CurrencyProvider } from "@/app/context/CurrencyContext";
import CurrencySelector from "./components/CurrencySelector";
import Script from "next/script";
import LanguageSelector from "./components/LanguageSelector";
import GoogleTranslate from "./components/GoogleTranslate";
import AutoTranslatePopup from "./components/AutoTranslatePopup";

export const metadata: Metadata = {
  title: "Shuki Fitness | Elite Coaching",
  description: "Elevate your physique today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-black text-white antialiased flex flex-col min-h-screen">
         {/* СКРИЕНИОТ GOOGLE TRANSLATE */}
          <div id="google_translate_element" style={{ display: 'none' }}></div>
          <Script id="google-translate-init" strategy="afterInteractive">
            {`
              window.googleTranslateElementInit = function() {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,de,mk,es,fr',
                  autoDisplay: false
                }, 'google_translate_element');
              };
            `}
          </Script>
          <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
          <CurrencyProvider>
            <CartProvider>
  <GoogleTranslate />
  <AutoTranslatePopup />
              {/* TOP BAR */}
              <div className="relative z-50 w-full bg-zinc-950 border-b border-zinc-900 py-2 px-4 sm:px-8 flex justify-between items-center text-[10px] md:text-xs">
                <CurrencySelector />
                <div className="flex items-center gap-4 text-zinc-400">
                  <a href="#" className="hover:text-red-600 transition-colors">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/angjeleskiandrej/" className="hover:text-red-600 transition-colors">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="#" className="hover:text-red-600 transition-colors">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </div>
                
              </div>

              <Navbar />

              <div className="flex-grow">
                {children}
              </div>

              {/* FOOTER */}
              <footer className="py-16 bg-black text-white border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
                  
                  {/* ГРИДОТ Е СМЕНЕТ: На таблет и десктоп има 4 колони */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 border-b border-zinc-900 pb-12 mb-8">
                    
                    {/* ЛОГОТО СЕГА ЗЕМА 2 КОЛОНИ ПРОСТОР ЗА ДА НЕ СЕ СУДИРА */}
                    <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
                      {/* Намален фонтот за таблет на 4xl, а 5xl е само за големи екрани */}
                      <Link href="/" className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4">
                        SHUKI<span className="text-red-600">FITNESS</span>
                      </Link>
                      <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                        Be the best version of yourself.
                      </p>
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                      <h4 className="text-lg font-bold uppercase tracking-widest mb-6 text-white">Main Menu</h4>
                      <div className="flex flex-col gap-4 text-sm font-bold uppercase text-zinc-400">
                        <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                        <Link href="/beginner-program" className="hover:text-red-600 transition-colors">Beginner Program</Link>
                        <Link href="/advanced-program" className="hover:text-red-600 transition-colors">Advanced Program</Link>
                        <Link href="/contact" className="hover:text-red-600 transition-colors">Contact</Link>
                      </div>
                    </div>

                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                      <h4 className="text-lg font-bold uppercase tracking-widest mb-6 text-white">Follow Me</h4>
                      <div className="flex gap-6 text-zinc-400">
                        <a href="#" className="hover:text-red-600 transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                        <a href="https://www.instagram.com/angjeleskiandrej/" className="hover:text-red-600 transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                        <a href="#" className="hover:text-red-600 transition-colors"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 002.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
  
  {/* 1. ЛЕВА СТРАНА: Избор на валута (на мобилен центрирано, на десктоп лево) */}
  <div className="w-full md:w-1/3 flex justify-center md:justify-start">
    <CurrencySelector direction="up" />
  </div>

  {/* 2. СРЕДИНА: Текстот за авторски права (секогаш на средина) */}
  <div className="w-full md:w-1/3 flex justify-center text-center">
    <p className="text-zinc-600 text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed">
      © 2026, Shuki Fitness <br className="md:hidden" /> Powered by hard work
    </p>
  </div>

  {/* 3. ДЕСНА СТРАНА: Празен блок (служи само за да го држи текстот перфектно на средина на десктоп) */}
  <div className="hidden md:block w-full md:w-1/3"></div>

</div>

                </div>
              </footer>

              <CartDrawer />

            </CartProvider>
          </CurrencyProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}