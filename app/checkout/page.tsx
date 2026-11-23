"use client";

import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";

export default function CheckoutPage() {
  // ДОДАДЕНИ: Функциите за промо код од контекстот
  const { 
    cartItems, 
    totalPrice, 
    subtotal, 
    discountAmount, 
    removeFromCart,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();
  
  const { user, isSignedIn, isLoaded } = useUser();
  const { convert } = useCurrency();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [duplicateItems, setDuplicateItems] = useState<string[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Локален state за полето за промо код на Checkout
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || cartItems.length === 0) return;

    async function checkDuplicates() {
      setCheckingDuplicates(true);
      const { data, error } = await supabase
        .from("orders")
        .select("items, status, id")
        .eq("user_id", user!.id)
        .in("status", ["pending_bank", "pending_binance", "pending_skrill", "pending_neteller", "pending_paypal", "pending_ria", "completed"]);

      if (!error && data) {
        const boughtItemIds = new Set<string>();
        data.forEach((order: any) => {
          order.items?.forEach((item: any) => boughtItemIds.add(item.id));
        });
        const dupes = cartItems.filter((item) => boughtItemIds.has(item.id)).map((item) => item.name);
        setDuplicateItems(dupes);
        const pending = data.filter((o: any) => o.status?.startsWith("pending_"));
        setPendingOrders(pending);
      }
      setCheckingDuplicates(false);
    }

    checkDuplicates();
  }, [isLoaded, isSignedIn, user, cartItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofFile(e.target.files?.[0] || null);
  };

  async function handleUpdateReceipt(orderId: string) {
    if (!proofFile) { alert("Please select a new receipt image first."); return; }
    setUpdatingOrderId(orderId);
    try {
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("receipts").upload(fileName, proofFile);
      if (uploadError) throw new Error("Failed to upload receipt.");
      const { data: publicUrlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
      const { error: dbError } = await supabase.from("orders").update({ proof_url: publicUrlData.publicUrl }).eq("id", orderId);
      if (dbError) throw dbError;
      alert("Receipt updated successfully! Admin will review it shortly.");
      setProofFile(null);
    } catch (error) {
      console.error("Update receipt error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // Функции за Промо код
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) { alert("Please select a payment method."); return; }
    if (!proofFile) { alert("Please upload your payment receipt."); return; }
    if (duplicateItems.length > 0) { alert(`You already own: ${duplicateItems.join(", ")}.`); return; }
    if (!user) return;
    setIsProcessing(true);
    try {
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("receipts").upload(fileName, proofFile);
      if (uploadError) throw new Error("Failed to upload receipt image.");
      const { data: publicUrlData } = supabase.storage.from("receipts").getPublicUrl(fileName);
      const orderData = {
        user_id: user.id,
        user_email: user.primaryEmailAddress?.emailAddress || "no-email@clerk.com",
        total_price: totalPrice,
        items: cartItems,
        status: `pending_${selectedMethod}`,
        proof_url: publicUrlData.publicUrl,
        // НОВО: Го праќаме кодот во базата!
        promo_code: appliedPromoCode || null, 
      };
      const { error: dbError } = await supabase.from("orders").insert([orderData]);
      if (dbError) throw dbError;
      cartItems.forEach((item) => removeFromCart(item.id));
      setOrderSuccess(true);
    } catch (error) {
      console.error("Грешка при креирање нарачка:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-8 border border-red-600/50 relative z-10 animate-bounce">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-center relative z-10">
          Order <span className="text-red-600">Submitted</span>
        </h1>
        <p className="text-zinc-400 mb-12 text-center max-w-md font-bold text-sm tracking-widest leading-relaxed relative z-10">
          We are verifying your payment proof. Your program will be unlocked in your vault shortly.
        </p>
        <Link href="/dashboard" className="bg-white text-black font-black uppercase tracking-widest py-4 px-10 rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98] relative z-10">
          Enter Vault
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="flex flex-col min-h-screen bg-black text-white items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-zinc-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest mb-4">Cart is empty</h1>
        <Link href="/" className="text-red-600 hover:text-white transition-colors underline uppercase font-bold text-xs tracking-widest underline-offset-4">
          Return to Store
        </Link>
      </main>
    );
  }

  const paymentOptions = [
    { id: "bank", name: "Bank Transfer", desc: "Local wire" },
    { id: "binance", name: "Crypto", desc: "USDT TRC20" },
    { id: "skrill", name: "Skrill", desc: "Instant transfer" },
    { id: "neteller", name: "Neteller", desc: "Instant transfer" },
    { id: "paypal", name: "PayPal", desc: "Friends & Family" },
    { id: "ria", name: "Ria Transfer", desc: "Cash pickup" },
  ];

  const canSubmit = selectedMethod && proofFile && !isProcessing && duplicateItems.length === 0 && !checkingDuplicates;

  return (
    <main className="flex flex-col min-h-screen bg-black text-white pt-12 md:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">

      <div className="mb-8 md:mb-12">
        <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
          <span>←</span> Back to store
        </Link>
      </div>

      {duplicateItems.length > 0 && (
        <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
          <p className="text-red-400 font-black uppercase tracking-widest text-sm mb-1">Already Owned</p>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            You already own: <span className="text-white">{duplicateItems.join(", ")}</span>. Please remove from cart to proceed.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

        <div className="lg:col-span-2">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 leading-none">
            Secure <span className="text-red-600">Checkout</span>
          </h1>
          <p className="text-zinc-500 mb-10 font-bold text-[10px] uppercase tracking-widest">
            Logged in as <span className="text-white">{user?.primaryEmailAddress?.emailAddress}</span>
          </p>

          <form onSubmit={handleSubmit} className="bg-zinc-950/50 border border-zinc-900 p-6 md:p-10 rounded-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">1</div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Select Method</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-10">
              {paymentOptions.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`border ${selectedMethod === method.id ? "border-red-600 bg-red-600/10 shadow-[0_0_20px_rgba(220,38,38,0.15)]" : "border-zinc-800 bg-black"} rounded-2xl p-5 cursor-pointer hover:border-zinc-500 transition-all flex flex-col items-center justify-center text-center h-28 group`}
                >
                  <span className="font-black text-sm uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">{method.name}</span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">{method.desc}</span>
                </div>
              ))}
            </div>

            {selectedMethod && (
              <div className="bg-black border border-zinc-800 rounded-2xl p-6 mb-10 relative z-10">
                <h3 className="font-black uppercase tracking-widest text-red-600 mb-4 text-xs">Payment Details</h3>
                <div className="space-y-3 text-xs text-zinc-300 font-mono">
                  {selectedMethod === "bank" && (
                    <>
                      <p><span className="text-zinc-500">Bank Name:</span> NLB Banka AD Skopje</p>
                      <p><span className="text-zinc-500">Recipient:</span> Shuki Fitness</p>
                      <p><span className="text-zinc-500">IBAN:</span> MK07 2100 0000 0000 000</p>
                      <p><span className="text-zinc-500">Amount:</span> <span className="text-white font-bold">{convert(totalPrice)}</span></p>
                    </>
                  )}
                  {selectedMethod === "binance" && (
                    <>
                      <p><span className="text-zinc-500">Network:</span> Tron (TRC20)</p>
                      <p><span className="text-zinc-500">Address:</span></p>
                      <p className="bg-zinc-900 p-4 rounded-xl text-white break-all border border-zinc-800">TXYZ1234567890ABCDEFGHIJKLMNOPQRST</p>
                      <p className="text-red-500 text-[10px] uppercase font-sans font-bold tracking-widest mt-2">* Send exactly {convert(totalPrice)}.</p>
                    </>
                  )}
                  {selectedMethod === "skrill" && (
                    <>
                      <p><span className="text-zinc-500">Skrill Email:</span></p>
                      <p className="bg-zinc-900 p-4 rounded-xl text-white border border-zinc-800">payments@shukifitness.com</p>
                      <p className="text-red-500 text-[10px] uppercase font-sans font-bold tracking-widest mt-2">* Send exactly {convert(totalPrice)}.</p>
                    </>
                  )}
                  {selectedMethod === "neteller" && (
                    <>
                      <p><span className="text-zinc-500">Neteller Email:</span></p>
                      <p className="bg-zinc-900 p-4 rounded-xl text-white border border-zinc-800">payments@shukifitness.com</p>
                      <p className="text-red-500 text-[10px] uppercase font-sans font-bold tracking-widest mt-2">* Send exactly {convert(totalPrice)}.</p>
                    </>
                  )}
                  {selectedMethod === "paypal" && (
                    <>
                      <p><span className="text-zinc-500">PayPal Link:</span> paypal.me/shukifitness</p>
                      <p className="text-red-500 text-[10px] uppercase font-sans font-bold tracking-widest mt-2">* Send exactly {convert(totalPrice)} as "Sending to a friend" to avoid holds.</p>
                    </>
                  )}
                  {selectedMethod === "ria" && (
                    <>
                      <p><span className="text-zinc-500">Receiver Name:</span> [Tvoe Ime Prezime]</p>
                      <p><span className="text-zinc-500">Country:</span> North Macedonia</p>
                      <p className="text-red-500 text-[10px] uppercase font-sans font-bold tracking-widest mt-2">* Send exactly {convert(totalPrice)}.</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm">2</div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Upload Proof</h2>
                <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">* Required — order cannot be submitted without receipt</p>
              </div>
            </div>

            <div className="mb-10 relative z-10">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors group ${proofFile ? "border-green-600 bg-green-600/5" : "border-zinc-800 hover:border-red-600 bg-black"}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className={`w-8 h-8 mb-3 transition-colors ${proofFile ? "text-green-500" : "text-zinc-500 group-hover:text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    <span className="text-white">Click to upload</span> receipt
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">PNG, JPG, PDF accepted</p>
                </div>
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" required />
              </label>

              {proofFile && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
                  <p className="text-green-500 text-xs font-bold uppercase tracking-widest truncate flex-1">✓ {proofFile.name}</p>
                  <button type="button" onClick={() => setProofFile(null)} className="text-zinc-500 hover:text-white text-xs font-bold uppercase px-2 ml-2 flex-shrink-0">Clear</button>
                </div>
              )}

              {!proofFile && (
                <p className="mt-3 text-[10px] text-red-500/70 font-bold uppercase tracking-widest text-center">
                  ⚠ Receipt is required to complete your purchase
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-3 relative z-10 ${
                !canSubmit
                  ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_40px_rgba(220,38,38,0.3)] active:scale-[0.98]"
              }`}
            >
              {checkingDuplicates ? (
                <><div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>Checking...</>
              ) : isProcessing ? (
                <><div className="w-5 h-5 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>Processing...</>
              ) : "Complete Purchase"}
            </button>
          </form>

        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-black border border-zinc-800 rounded-3xl p-8 lg:sticky lg:top-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full pointer-events-none"></div>

          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-8 border-b border-zinc-900 pb-4">Order Summary</h2>

          <div className="space-y-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white uppercase leading-tight">{item.name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Qty: {item.quantity}</p>
                  {duplicateItems.includes(item.name) && (
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Already owned</p>
                  )}
                </div>
                <p className="font-black text-white flex-shrink-0">{convert(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* ПОЛЕ ЗА ПРОМО КОД */}
          <div className="mb-6 pt-6 border-t border-zinc-900">
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

          <div className="border-t border-zinc-900 pt-6 space-y-4">
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
            
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>Digital Delivery</span>
              <span className="text-green-500">Free</span>
            </div>
            
            <div className="flex justify-between items-center pt-6 mt-2 border-t border-zinc-900">
              <span className="font-black uppercase tracking-widest text-zinc-400">Total</span>
              <span className="font-black text-3xl text-red-600">{convert(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure SSL Checkout
          </div>
        </div>

      </div>
    </main>
  );
}