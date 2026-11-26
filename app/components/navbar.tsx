"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser, SignInButton, UserButton, SignOutButton } from "@clerk/nextjs";
import LanguageDropdown from "./LanguageDropdown";
import {
  Home,
  Dumbbell,
  Sparkles,
  Utensils,
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

function MobileBottomBar({ userGender }: { userGender: "men" | "women" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "programs";
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isMen = userGender === "men";

  const isHomeActive = pathname === "/";
  const isProgramsActive = isOnDashboard && currentTab === "programs";
  const isNutritionActive = isOnDashboard && currentTab === "nutrition";
  const isCoachingActive = isOnDashboard && currentTab === "coaching";
  const isProfileActive = isOnDashboard && currentTab === "profile";

  const items = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: isHomeActive,
      activePill: "bg-stone-950 text-white shadow-sm",
      idlePill: "bg-stone-100 text-stone-600",
      activeText: "text-stone-950",
      idleText: "text-stone-500",
    },
    {
      href: "/dashboard?tab=programs",
      label: "Programs",
      icon: Dumbbell,
      active: isProgramsActive,
      activePill: isMen
        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
        : "bg-pink-500 text-white shadow-sm shadow-pink-500/30",
      idlePill: isMen ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-500",
      activeText: isMen ? "text-blue-600" : "text-pink-600",
      idleText: "text-stone-500",
    },
    {
      href: "/dashboard?tab=nutrition",
      label: "Nutrition",
      icon: Utensils,
      active: isNutritionActive,
      activePill: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30",
      idlePill: "bg-emerald-50 text-emerald-600",
      activeText: "text-emerald-600",
      idleText: "text-stone-500",
    },
    {
      href: "/dashboard?tab=coaching",
      label: "1-on-1",
      icon: Sparkles,
      active: isCoachingActive,
      activePill: "bg-orange-500 text-white shadow-sm shadow-orange-500/30",
      idlePill: "bg-orange-50 text-orange-500",
      activeText: "text-orange-600",
      idleText: "text-stone-500",
    },
    {
      href: "/dashboard?tab=profile",
      label: "Profile",
      icon: User,
      active: isProfileActive,
      activePill: "bg-red-700 text-white shadow-sm shadow-red-700/30",
      idlePill: "bg-red-50 text-red-700",
      activeText: "text-red-700",
      idleText: "text-stone-500",
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-5 items-center h-[68px] max-w-md mx-auto gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all active:scale-95"
            >
              <div
                className={`w-9 h-8 rounded-xl flex items-center justify-center transition-all ${
                  item.active ? item.activePill : item.idlePill
                }`}
              >
                <Icon size={17} strokeWidth={item.active ? 2.5 : 2.1} />
              </div>
              <span
                className={`text-[10px] font-black tracking-tight leading-none ${
                  item.active ? item.activeText : item.idleText
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const [userGender, setUserGender] = useState<"men" | "women">("men");

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

      try {
        const res = await fetch("/api/orders");
        if (!res.ok) return;
        const json = await res.json();
        const orders = json.orders || [];

        const now = new Date();
        const active = orders.some(
          (order: any) =>
            order.status === "completed" &&
            (!order.expires_at || new Date(order.expires_at) >= now)
        );
        setHasActiveSub(active);

        // Автоматска детекција на пол од купената програма за бојата на Programs во долното мени
        const sorted = [...orders].sort((a: any, b: any) => {
          if (a.status === "completed" && b.status !== "completed") return -1;
          if (b.status === "completed" && a.status !== "completed") return 1;
          return 0;
        });

        for (const order of sorted) {
          const itemsArray =
            typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
          for (const item of itemsArray) {
            const idLower = String(item.id || "").toLowerCase();
            const nameLower = String(item.name || "").toLowerCase();
            if (idLower.includes("women") || idLower.includes("woman") || nameLower.includes("women")) {
              setUserGender("women");
              return;
            }
            if (idLower.includes("men") || nameLower.includes("men")) {
              setUserGender("men");
              return;
            }
          }
        }
      } catch {
        setHasActiveSub(false);
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
              <span className="ml-2 text-red-800 group-hover:text-red-700 transition-colors">
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

            {isSignedIn && (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 bg-red-800 text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-red-900 transition-all shadow-sm active:scale-95"
              >
                My Hub
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

      {/* MOBILE APP BOTTOM BAR — COLOR-CODED & SUBSCRIBERS ONLY */}
      {showMemberBottomBar && (
        <Suspense fallback={null}>
          <MobileBottomBar userGender={userGender} />
        </Suspense>
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
              EVOLUTION <span className="text-red-800">BODY</span>
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
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl font-black uppercase text-xs tracking-wider bg-red-800 text-white mb-2 shadow-md shadow-red-900/20"
            >
              <span className="flex items-center gap-2.5">
                <User size={16} />
                My Hub &amp; Programs
              </span>
              <ArrowUpRight size={16} />
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl font-black uppercase text-xs tracking-wider bg-stone-950 text-white mb-4"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck size={16} />
                Admin Panel
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