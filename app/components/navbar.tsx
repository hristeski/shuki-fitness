"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser, SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import { supabase } from "../../utils/supabase";
import LanguageDropdown from "./LanguageDropdown";
import {
  Home,
  Dumbbell,
  Sparkles,
  PlayCircle,
  User,
  ShoppingBag,
  Menu,
  X,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  Trophy,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/#programs", label: "Programs" },
  { href: "/coaching", label: "Online Coaching" },
  { href: "/#results", label: "Transformations" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState(false);

  const { totalItems, openCart } = useCart();
  const { isSignedIn, user, isLoaded } = useUser();

  const adminEmails = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];
  const isAdmin =
    isLoaded &&
    isSignedIn &&
    adminEmails.includes(user?.primaryEmailAddress?.emailAddress || "");

  useEffect(() => {
    async function checkSubscription() {
      if (!isLoaded || !isSignedIn || !user) {
        setHasActiveSub(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "completed");

      if (!error && data) {
        const now = new Date();
        const active = data.some(
          (order: any) => !order.expires_at || new Date(order.expires_at) >= now
        );
        setHasActiveSub(active);
      }
    }

    checkSubscription();
  }, [isLoaded, isSignedIn, user]);

  const showMemberBottomBar = isSignedIn && (hasActiveSub || isAdmin);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-3">
          {/* BRAND */}
          <Link href="/" className="flex flex-col leading-none group flex-shrink-0">
            <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter uppercase text-stone-950">
              EVOLUTION
              <span className="text-red-800 group-hover:text-red-700 transition-colors">
                BODY
              </span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-0.5">
              by Andrej Angjeleski
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-100/90 p-1.5 rounded-full border border-stone-200/80">
            {NAV_LINKS.map((link) => {
              const active = link.href.startsWith("/#")
                ? false
                : isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-red-800 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950 hover:bg-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageDropdown />

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 bg-stone-950 text-white px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-red-800 transition-colors"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}

            {isSignedIn && !isAdmin && (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 bg-red-800 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-red-900 transition-all shadow-sm active:scale-95"
              >
                My Profile
                <ArrowUpRight size={14} />
              </Link>
            )}

            <div className="hidden md:flex items-center">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 rounded-full border border-stone-300 bg-white text-stone-900 hover:border-red-800 hover:text-red-800 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>

            <button
              onClick={openCart}
              aria-label="Open Cart"
              className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-stone-100 hover:bg-red-800 text-stone-900 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={2.2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-800 text-[10px] font-black text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE APP BOTTOM BAR — ONLY FOR SUBSCRIBED MEMBERS (AND ADMINS) */}
      {showMemberBottomBar && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all active:scale-90 ${
                pathname === "/" ? "text-red-800" : "text-stone-400 hover:text-stone-900"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${pathname === "/" ? "bg-red-50" : ""}`}>
                <Home size={19} strokeWidth={pathname === "/" ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold">Home</span>
            </Link>

            <Link
              href="/dashboard?tab=programs"
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all active:scale-90 ${
                pathname === "/dashboard" ? "text-red-800" : "text-stone-400 hover:text-stone-900"
              }`}
            >
              <div className="p-1.5 rounded-xl">
                <Dumbbell size={19} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold">Programs</span>
            </Link>

            <Link
              href="/dashboard?tab=videos"
              className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl text-stone-400 hover:text-red-800 transition-all active:scale-90"
            >
              <div className="p-1.5 rounded-xl">
                <PlayCircle size={19} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold">Videos</span>
            </Link>

            <Link
              href="/coaching"
              className={`flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-all active:scale-90 ${
                pathname === "/coaching" ? "text-red-800" : "text-stone-400 hover:text-stone-900"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${pathname === "/coaching" ? "bg-red-50" : ""}`}>
                <Sparkles size={19} strokeWidth={pathname === "/coaching" ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold">Coaching</span>
            </Link>

            <Link
              href="/dashboard?tab=profile"
              className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl text-stone-400 hover:text-red-800 transition-all active:scale-90"
            >
              <div className="p-1.5 rounded-xl">
                <User size={19} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold">Profile</span>
            </Link>
          </div>
        </nav>
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-all duration-300 ease-out lg:hidden flex flex-col ${
          isMobileMenuOpen
            ? "translate-x-0 shadow-2xl visible pointer-events-auto"
            : "translate-x-full shadow-none invisible pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black uppercase tracking-tighter text-stone-950">
              EVOLUTION<span className="text-red-800">BODY</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mt-0.5">
              by Andrej Angjeleski
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-red-800 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {isSignedIn && (
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl font-black uppercase text-xs tracking-wider bg-red-800 text-white mb-4 shadow-md shadow-red-900/20"
            >
              <span className="flex items-center gap-2.5">
                <User size={16} />
                {isAdmin ? "Admin Panel" : "My Profile & Vault"}
              </span>
              <ArrowUpRight size={16} />
            </Link>
          )}

          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/#programs", label: "Programs & Nutrition", icon: Dumbbell },
            { href: "/coaching", label: "Online Coaching", icon: Sparkles },
            { href: "/#results", label: "Transformations", icon: Trophy },
            { href: "/contact", label: "Contact Support", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm bg-stone-50 text-stone-800 hover:bg-red-800 hover:text-white transition-all"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <ArrowUpRight size={16} className="opacity-60" />
              </Link>
            );
          })}
        </div>

        <div className="p-5 border-t border-stone-100 bg-stone-50">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-stone-950 text-white font-black uppercase tracking-wider text-xs py-4 rounded-2xl hover:bg-red-800 transition-colors cursor-pointer"
              >
                Log In / Sign Up
              </button>
            </SignInButton>
          ) : (
            <SignOutButton>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-white border border-stone-200 text-stone-700 font-bold uppercase tracking-wider text-xs py-3.5 rounded-2xl hover:border-red-800 hover:text-red-800 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </SignOutButton>
          )}
        </div>
      </aside>
    </>
  );
}