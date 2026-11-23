"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser, SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import {
  Home,
  Dumbbell,
  Sparkles,
  Trophy,
  User,
  ShoppingBag,
  Menu,
  X,
  Mail,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/#programs", label: "Programs" },
  { href: "/coaching", label: "Online Coaching" },
  { href: "/#results", label: "Results" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isSignedIn, user, isLoaded } = useUser();

  const adminEmails = ["getsurefixedgames@gmail.com", "smootyefects@gmail.com"];
  const isAdmin =
    isLoaded &&
    isSignedIn &&
    adminEmails.includes(user?.primaryEmailAddress?.emailAddress || "");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xl md:text-2xl font-black tracking-tighter uppercase text-zinc-950 flex items-center gap-1 group flex-shrink-0"
          >
            SHUKI
            <span className="text-red-700 group-hover:text-red-800 transition-colors">
              FITNESS
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/80 p-1.5 rounded-full border border-zinc-200/70">
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
                      ? "bg-red-700 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 bg-zinc-950 text-white px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}

            {isSignedIn && !isAdmin && (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 bg-red-700 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-red-800 transition-all shadow-sm active:scale-95"
              >
                My Vault
                <ArrowUpRight size={14} />
              </Link>
            )}

            <div className="hidden md:flex items-center">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 rounded-full border border-zinc-300 bg-white text-zinc-900 hover:border-red-700 hover:text-red-700 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </div>

            <button
              onClick={openCart}
              aria-label="Open Cart"
              className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-zinc-100 hover:bg-red-700 text-zinc-900 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={2.2} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE APP-STYLE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all active:scale-90 ${
              isActive("/") ? "text-red-700" : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive("/") ? "bg-red-50" : ""}`}>
              <Home size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <Link
            href="/#programs"
            className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl text-zinc-400 hover:text-red-700 transition-all active:scale-90"
          >
            <div className="p-1.5 rounded-xl">
              <Dumbbell size={20} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">Programs</span>
          </Link>

          <Link
            href="/coaching"
            className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all active:scale-90 ${
              isActive("/coaching") ? "text-red-700" : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive("/coaching") ? "bg-red-50" : ""}`}>
              <Sparkles size={20} strokeWidth={isActive("/coaching") ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">Coaching</span>
          </Link>

          <Link
            href="/#results"
            className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl text-zinc-400 hover:text-red-700 transition-all active:scale-90"
          >
            <div className="p-1.5 rounded-xl">
              <Trophy size={20} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">Results</span>
          </Link>

          {isSignedIn ? (
            <Link
              href={isAdmin ? "/admin" : "/dashboard"}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all active:scale-90 ${
                isActive("/dashboard") || isActive("/admin")
                  ? "text-red-700"
                  : "text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isActive("/dashboard") || isActive("/admin") ? "bg-red-50" : ""
                }`}
              >
                <User size={20} strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold">
                {isAdmin ? "Admin" : "Vault"}
              </span>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl text-zinc-400 hover:text-red-700 transition-all active:scale-90">
                <div className="p-1.5 rounded-xl">
                  <User size={20} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-bold">Sign In</span>
              </button>
            </SignInButton>
          )}
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <span className="text-lg font-black uppercase tracking-tighter text-zinc-950">
            SHUKI<span className="text-red-700">FITNESS</span>
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-red-700 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/#programs", label: "Programs & Nutrition", icon: Dumbbell },
            { href: "/coaching", label: "1-on-1 Online Coaching", icon: Sparkles },
            { href: "/#results", label: "Client Transformations", icon: Trophy },
            { href: "/contact", label: "Contact Support", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm bg-zinc-50 text-zinc-800 hover:bg-red-700 hover:text-white transition-all"
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

        <div className="p-5 border-t border-zinc-100 bg-zinc-50">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-zinc-950 text-white font-black uppercase tracking-wider text-xs py-4 rounded-2xl hover:bg-red-700 transition-colors"
              >
                Log In / Sign Up
              </button>
            </SignInButton>
          ) : (
            <SignOutButton>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-white border border-zinc-200 text-zinc-700 font-bold uppercase tracking-wider text-xs py-3.5 rounded-2xl hover:border-red-700 hover:text-red-700 transition-colors"
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