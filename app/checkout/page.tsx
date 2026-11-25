"use client";

import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { useCurrency } from "@/app/context/CurrencyContext";
import {
  CreditCard,
  Landmark,
  Coins,
  Upload,
  CheckCircle2,
  Lock,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

type PaymentMethod = "card" | "bank" | "crypto";

export default function CheckoutPage() {
  const {
    cartItems,
    totalPrice,
    subtotal,
    discountAmount,
    removeFromCart,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { user, isSignedIn, isLoaded } = useUser();
  const { convert } = useCurrency();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bank");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [duplicateItems, setDuplicateItems] = useState<string[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

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
        .select("items, status")
        .eq("user_id", user!.id)
        .in("status", ["pending_bank", "pending_crypto", "pending_card", "completed"]);

      if (!error && data) {
        const boughtIds = new Set<string>();
        data.forEach((order: any) => {
          order.items?.forEach((item: any) => boughtIds.add(item.id));
        });
        const dupes = cartItems
          .filter((item) => boughtIds.has(item.id))
          .map((item) => item.name);
        setDuplicateItems(dupes);
      }
      setCheckingDuplicates(false);
    }

    checkDuplicates();
  }, [isLoaded, isSignedIn, user, cartItems]);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    setPromoMessage({ type: result.success ? "success" : "error", text: result.message });
    if (result.success) setPromoInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (duplicateItems.length > 0) {
      alert(`You already own: ${duplicateItems.join(", ")}.`);
      return;
    }

    // Ако е избрана картичка, тука ќе се поврзе Stripe / CaSys API endpoint
    if (selectedMethod === "card") {
      alert(
        "Automatic Card Payment (Stripe / CaSys) will be activated once your merchant account keys are connected. Please use Bank Transfer or Crypto for now."
      );
      return;
    }

    if (!proofFile) {
      alert("Please upload your payment receipt / transfer screenshot.");
      return;
    }

    setIsProcessing(true);
    try {
      const fileExt = proofFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, proofFile);
      if (uploadError) throw new Error("Failed to upload receipt.");

      const { data: publicUrlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          user_email: user.primaryEmailAddress?.emailAddress || "no-email@clerk.com",
          total_price: totalPrice,
          items: cartItems,
          status: `pending_${selectedMethod}`,
          proof_url: publicUrlData.publicUrl,
          promo_code: appliedPromoCode || null,
        },
      ]);

      if (dbError) throw dbError;

      cartItems.forEach((item) => removeFromCart(item.id));
      setOrderSuccess(true);
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong submitting your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-evo-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-red-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-evo-surface text-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-3">
          Order <span className="text-red-800">Submitted</span>
        </h1>
        <p className="text-stone-600 text-sm max-w-md mb-8">
          We received your payment proof. Once verified by our team, your programs, nutrition, and Member Vault will unlock automatically.
        </p>
        <Link
          href="/dashboard"
          className="bg-red-800 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs px-8 py-4 rounded-2xl transition-all shadow-lg"
        >
          Go to My Vault
        </Link>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-evo-surface text-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Your cart is empty</h1>
        <Link
          href="/#programs"
          className="bg-red-800 text-white font-black uppercase tracking-wider text-xs px-7 py-3.5 rounded-xl"
        >
          Browse Programs
        </Link>
      </main>
    );
  }

  const paymentOptions: { id: PaymentMethod; name: string; desc: string; icon: any }[] = [
    { id: "card", name: "Bank Card", desc: "Visa / Mastercard", icon: CreditCard },
    { id: "bank", name: "Bank Transfer", desc: "Трансакциска сметка", icon: Landmark },
    { id: "crypto", name: "Crypto", desc: "USDT (TRC20)", icon: Coins },
  ];

  const canSubmit =
    !isProcessing &&
    !checkingDuplicates &&
    duplicateItems.length === 0 &&
    (selectedMethod === "card" || !!proofFile);

  return (
    <main className="min-h-screen bg-evo-surface text-stone-950 py-10 md:py-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-stone-500 hover:text-red-800 mb-6"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>

        {duplicateItems.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertCircle className="text-red-700 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-xs font-bold text-red-800">
              You already own or have a pending order for: {duplicateItems.join(", ")}. Please remove it from your cart.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: PAYMENT FORM */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 sm:p-9 shadow-sm">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-1">
              Secure <span className="text-red-800">Checkout</span>
            </h1>
            <p className="text-xs font-bold text-stone-500 mb-8">
              Account: {user?.primaryEmailAddress?.emailAddress}
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: PAYMENT METHOD */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">
                  1. Select Payment Method
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = selectedMethod === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedMethod(opt.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                          active
                            ? "border-red-800 bg-red-50/50 shadow-sm"
                            : "border-stone-200 bg-stone-50 hover:border-stone-300"
                        }`}
                      >
                        <Icon size={20} className={active ? "text-red-800" : "text-stone-500"} />
                        <div>
                          <p className="text-xs font-black uppercase text-stone-950">{opt.name}</p>
                          <p className="text-[10px] font-bold text-stone-500">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAYMENT INSTRUCTIONS BOX */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-2.5 text-xs">
                {selectedMethod === "card" && (
                  <div className="space-y-2">
                    <p className="font-black uppercase text-red-800 text-[11px]">
                      Instant Card Payment (Visa / Mastercard)
                    </p>
                    <p className="text-stone-600 leading-relaxed">
                      Card checkout connects directly to Stripe / CaSys for instant automatic Vault unlock.
                    </p>
                  </div>
                )}

                {selectedMethod === "bank" && (
                  <div className="space-y-2 font-mono">
                    <p className="font-sans font-black uppercase text-red-800 text-[11px] mb-2">
                      Bank Transfer / Трансакциска сметка
                    </p>
                    <p><span className="text-stone-500">Bank:</span> NLB Banka AD Skopje</p>
                    <p><span className="text-stone-500">Recipient:</span> Evolution Body / Andrej Angjeleski</p>
                    <p><span className="text-stone-500">Account / IBAN:</span> MK07 2100 0000 0000 000</p>
                    <p><span className="text-stone-500">Amount:</span> <strong className="text-stone-950">{convert(totalPrice)}</strong></p>
                  </div>
                )}

                {selectedMethod === "crypto" && (
                  <div className="space-y-2 font-mono">
                    <p className="font-sans font-black uppercase text-red-800 text-[11px] mb-2">
                      Crypto Payment (USDT TRC20)
                    </p>
                    <p><span className="text-stone-500">Network:</span> Tron (TRC20)</p>
                    <p className="bg-white border border-stone-200 p-3 rounded-xl break-all font-bold text-stone-950">
                      TXYZ1234567890ABCDEFGHIJKLMNOPQRST
                    </p>
                    <p className="font-sans text-[11px] text-red-700 font-bold">
                      * Send exactly {convert(totalPrice)} equivalent in USDT.
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 2: UPLOAD RECEIPT (FOR BANK & CRYPTO) */}
              {selectedMethod !== "card" && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-3">
                    2. Upload Payment Proof (Required)
                  </p>
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      proofFile
                        ? "border-emerald-500 bg-emerald-50/40"
                        : "border-stone-300 hover:border-red-800 bg-stone-50"
                    }`}
                  >
                    <Upload
                      size={22}
                      className={proofFile ? "text-emerald-600 mb-2" : "text-stone-400 mb-2"}
                    />
                    <p className="text-xs font-black uppercase text-stone-700">
                      {proofFile ? proofFile.name : "Click to upload receipt (PNG, JPG, PDF)"}
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full font-black uppercase tracking-wider text-xs py-4 rounded-2xl transition-all shadow-lg cursor-pointer ${
                  !canSubmit
                    ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                    : "bg-red-800 hover:bg-red-700 text-white shadow-red-900/20 active:scale-[0.98]"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : selectedMethod === "card"
                  ? `Pay ${convert(totalPrice)} by Card`
                  : "Submit Order & Proof"}
              </button>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-sm font-black uppercase tracking-wider pb-4 mb-5 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-stone-950 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-bold text-stone-500 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-black text-stone-950 flex-shrink-0">
                    {convert(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* PROMO CODE */}
            <div className="py-4 border-y border-stone-100 mb-4">
              {!appliedPromoCode ? (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-red-800"
                  />
                  <button
                    type="submit"
                    className="bg-stone-950 hover:bg-red-800 text-white text-[11px] font-black uppercase px-4 rounded-xl cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <span className="text-xs font-black text-emerald-800">
                    Code: {appliedPromoCode}
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-[10px] font-bold uppercase text-stone-500 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoMessage.text && (
                <p
                  className={`text-[10px] font-bold mt-2 ${
                    promoMessage.type === "success" ? "text-emerald-600" : "text-red-700"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold text-stone-500">
                <span>Subtotal</span>
                <span className="text-stone-950">{convert(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Discount</span>
                  <span>-{convert(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-stone-100">
                <span className="font-black uppercase text-stone-950">Total</span>
                <span className="text-2xl font-black text-red-800">{convert(totalPrice)}</span>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              <Lock size={12} /> 256-bit SSL Encrypted Checkout
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}