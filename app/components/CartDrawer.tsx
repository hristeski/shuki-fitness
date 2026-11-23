"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { X, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    totalPrice,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { isSignedIn, isLoaded } = useUser();
  const { convert } = useCurrency();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoMessage({ type: "success", text: result.message });
      setPromoInput("");
    } else {
      setPromoMessage({ type: "error", text: result.message });
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoMessage({ type: "", text: "" });
  };

  return (
    <>
      <div
        style={{ zIndex: 9990 }}
        className={`fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 ${
          isCartOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeCart}
      />

      <div
        style={{ zIndex: 9999 }}
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white border-l border-zinc-200 transform transition-all duration-300 flex flex-col ${
          isCartOpen
            ? "translate-x-0 shadow-2xl visible pointer-events-auto"
            : "translate-x-full shadow-none invisible pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h2 className="text-lg font-black uppercase tracking-wider text-zinc-950">
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close Cart"
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-red-700 text-zinc-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-5 text-zinc-400">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-black uppercase tracking-wider text-base text-zinc-950 mb-2">
                Your cart is empty
              </h3>
              <p className="text-zinc-500 text-xs mb-8 max-w-xs">
                Choose a training or nutrition plan to unlock your Evolution Body Member Vault.
              </p>
              <Link
                href="/#programs"
                onClick={closeCart}
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl transition-all"
              >
                Browse Programs <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 bg-zinc-50 p-4 border border-zinc-200 rounded-2xl"
              >
                <div className="relative w-20 h-24 bg-zinc-200 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-black uppercase text-xs text-zinc-950 line-clamp-2 leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center border border-zinc-200 rounded-lg bg-white w-20 h-7 mt-2.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex-1 flex items-center justify-center text-zinc-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-xs font-black text-zinc-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center text-zinc-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="font-black text-sm text-zinc-950">
                      {convert(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-700 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50">
            <div className="mb-5">
              {!appliedPromoCode ? (
                <form onSubmit={handlePromoSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-xs text-zinc-950 focus:outline-none focus:border-red-700"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-950 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-wider px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage.text && (
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        promoMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-700"
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between bg-white border border-dashed border-red-700 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 block">
                      Applied Code:
                    </span>
                    <span className="text-xs font-black text-red-700">
                      {appliedPromoCode}
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-950 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-center text-xs font-bold uppercase text-zinc-500">
                <span>Subtotal</span>
                <span className="text-zinc-950">{convert(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs font-bold uppercase text-green-600">
                  <span>Discount</span>
                  <span>-{convert(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-zinc-200">
                <span className="font-black uppercase text-zinc-950 text-sm">
                  Total
                </span>
                <span className="font-black text-2xl text-red-700">
                  {convert(totalPrice)}
                </span>
              </div>
            </div>

            {isLoaded &&
              (isSignedIn ? (
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full block text-center bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-lg shadow-red-700/20"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full bg-red-700 hover:bg-red-800 text-white font-black uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-lg shadow-red-700/20 cursor-pointer">
                    Sign In to Checkout
                  </button>
                </SignInButton>
              ))}
          </div>
        )}
      </div>
    </>
  );
}