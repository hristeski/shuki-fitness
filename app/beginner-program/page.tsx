"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCurrency } from "@/app/context/CurrencyContext";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "recommendation">("description");

  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const { addToCart } = useCart();
  const { convert } = useCurrency();

  const handleAddToCart = () => {
    addToCart({
      id: "beginner-program",
      name: "Student of Aesthetics - Beginner Program",
      price: 20,
      quantity: quantity,
      image: "/images/beginner.jpg"
    });
  };

  return (
    <main className="flex flex-col min-h-screen bg-black text-white pb-24 md:pb-0">
      
      <section className="pt-12 md:pt-24 pb-16 md:pb-24 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto w-full border-b border-zinc-900">
        
        <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8 md:mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-red-600">Beginner Program</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            <div className="relative aspect-[4/5] w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl lg:sticky lg:top-24">
                <Image 
                    src="/images/beginner.jpg" 
                    alt="Student of Aesthetics - Beginner Program" 
                    fill 
                    className="object-cover"
                    priority
                />
            </div>

            <div className="flex flex-col">
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-tight mb-4">
                    Student of Aesthetics - <br/>
                    <span className="text-red-600">Beginner Program</span>
                </h1>

                {/* ЦЕНА 1 */}
                <p className="text-2xl md:text-3xl font-bold mb-8">{convert(20)}</p>

                <div className="h-px w-full bg-zinc-800 mb-8"></div>

                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3">Quantity</p>
                    <div className="flex items-center border border-zinc-700 rounded-md w-32 bg-zinc-950">
                        <button onClick={decreaseQuantity} className="w-10 h-12 flex items-center justify-center text-xl hover:text-red-600 transition-colors">-</button>
                        <div className="flex-1 text-center font-bold text-lg">{quantity}</div>
                        <button onClick={increaseQuantity} className="w-10 h-12 flex items-center justify-center text-xl hover:text-red-600 transition-colors">+</button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mb-12">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full bg-transparent border-2 border-white text-white font-black uppercase tracking-widest py-4 md:py-5 hover:bg-white hover:text-black transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>

                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                    <div className="flex border-b border-zinc-800">
                        <button 
                            onClick={() => setActiveTab("description")}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "description" ? "bg-zinc-900 text-red-600" : "text-zinc-500 hover:text-white"}`}
                        >
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab("recommendation")}
                            className={`flex-1 py-4 text-xs md:text-sm font-bold uppercase tracking-widest border-l border-zinc-800 transition-colors ${activeTab === "recommendation" ? "bg-zinc-900 text-red-600" : "text-zinc-500 hover:text-white"}`}
                        >
                            Recommendation
                        </button>
                    </div>

                    <div className="p-6 md:p-8 text-zinc-400 text-sm md:text-base leading-relaxed min-h-[280px]">
                        {activeTab === "description" ? (
                            <div className="animate-fade-in">
                                <p className="mb-4">We all start our journey to aesthetics from a base point.</p>
                                <p>This program builds your foundation for the advanced level.</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <p className="mb-4">60 day program, 5 days per week.</p>
                                <p>Recommended for beginners.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* MOBILE BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-lg border-t border-zinc-900 p-4 z-40 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Beginner Program</p>
          {/* ЦЕНА 2 */}
          <p className="text-lg font-black text-white">{convert(20)}</p>
        </div>

        <button 
          onClick={handleAddToCart}
          className="bg-red-600 text-white font-black uppercase tracking-widest text-sm px-8 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
        >
          Add to Cart
        </button>
      </div>

    </main>
  );
}