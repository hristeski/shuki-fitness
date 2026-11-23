"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "@/app/context/CurrencyContext";

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
    removePromoCode 
  } = useCart();
  
  const { isSignedIn, isLoaded } = useUser();
  const { convert } = useCurrency();

  // Локален state за полето за промо код во корпата
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
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ${isCartOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
        onClick={closeCart}
      ></div>

      <div 
        style={{ zIndex: 9999 }}
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-black border-l border-zinc-800 shadow-[-20px_0_50px_rgba(0,0,0,0.9)] transform transition-transform duration-300 flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        
        <div className="flex items-center justify-between p-6 border-b border-zinc-900">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Your Cart</h2>
          <button onClick={closeCart} className="text-zinc-500 hover:text-red-600 transition-colors p-2 -mr-2 cursor-pointer">
            <svg className="w-8 h-8 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-10">
              <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="font-black uppercase tracking-widest text-lg text-white mb-2">Your cart is empty</h3>
              <p className="text-zinc-500 text-sm mb-10 px-4">Start your journey today. Choose a program that fits your goals.</p>
              
              <div className="flex flex-col gap-4 w-full">
                 <Link href="/beginner-program" onClick={closeCart} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 hover:border-red-600 transition-colors group cursor-pointer">
                    <div className="relative w-14 h-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                        <Image src="/images/beginner.jpg" alt="Beginner" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-[10px] font-bold uppercase text-red-600 tracking-widest mb-1">Start Here</p>
                        <p className="text-sm font-black uppercase text-white leading-tight">Beginner Program</p>
                    </div>
                    <div className="text-zinc-500 group-hover:text-red-600">→</div>
                 </Link>
                 <Link href="/advanced-program" onClick={closeCart} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 hover:border-red-600 transition-colors group cursor-pointer">
                    <div className="relative w-14 h-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                        <Image src="/images/advanced.jpg" alt="Advanced" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-[10px] font-bold uppercase text-red-600 tracking-widest mb-1">Level Up</p>
                        <p className="text-sm font-black uppercase text-white leading-tight">Advanced Program</p>
                    </div>
                    <div className="text-zinc-500 group-hover:text-red-600">→</div>
                 </Link>
              </div>
            </div>
          ) : (
            cartItems.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
                <div className="relative w-20 h-28 bg-black rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold uppercase text-xs md:text-sm text-white line-clamp-2 leading-tight">{item.name}</h3>
                    <div className="flex items-center border border-zinc-700 rounded bg-black w-20 h-7 mt-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex-1 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors">-</button>
                        <span className="flex-1 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex-1 flex items-center justify-center text-zinc-400 hover:text-red-600 transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="font-black text-white">{convert(item.price * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-600 underline">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-zinc-900 bg-black">
            
            {/* ПОЛЕ ЗА ПРОМО КОД */}
            <div className="mb-6 pt-2">
              {!appliedPromoCode ? (
                <form onSubmit={handlePromoSubmit} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-colors placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase text-xs tracking-widest px-4 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage.text && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${promoMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </form>
              ) : (
                <div className="flex items-center justify-between bg-zinc-900 border border-dashed border-red-600 p-3 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Applied Code:</span>
                    <span className="text-sm font-black text-red-500">{appliedPromoCode}</span>
                  </div>
                  <button onClick={handleRemovePromo} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white underline">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* ДЕТАЛЕН ПРИКАЗ НА ЦЕНИТЕ */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                <span>Subtotal</span>
                <span className="text-white">{convert(subtotal)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-green-500">
                  <span>Discount Applied</span>
                  <span>-{convert(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-zinc-900 mt-2">
                <span className="font-black uppercase tracking-widest text-white text-sm">Total</span>
                <span className="font-black text-2xl text-red-600">{convert(totalPrice)}</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mb-4">
              Taxes and shipping calculated at checkout
            </p>
            
            {isLoaded && (
              isSignedIn ? (
                <Link 
                  href="/checkout" 
                  onClick={closeCart} 
                  className="w-full block text-center bg-red-600 text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full bg-red-600 text-white font-black uppercase tracking-widest py-5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    Sign In to Checkout
                  </button>
                </SignInButton>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
}