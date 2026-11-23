"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus("idle");

  const formData = new FormData(event.currentTarget);
  formData.append("access_key", "b290878e-bd46-45f5-a84e-450e205cf510");
  formData.append("redirect", "false");

  // Конвертирај во JSON наместо FormData
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: json,
    });

    const data = await response.json();
    console.log("Web3Forms response:", data); // За дебагирање

    if (data.success) {
  setSubmitStatus("success");
  (event.target as HTMLFormElement).reset();
  setTimeout(() => setSubmitStatus("idle"), 5000);
} else {
  console.error("Web3Forms error:", data);
  // ПРИВРЕМЕНО — прикажи ја вистинската грешка на екран:
  alert(JSON.stringify(data));
  setSubmitStatus("error");
}
  } catch (error) {
    console.error("Fetch error:", error);
    setSubmitStatus("error");
  } finally {
    setIsSubmitting(false);
  }
  
}

  return (
    <main className="flex flex-col min-h-screen bg-black text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-8 md:px-16 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 z-0">
           <Image 
             src="/images/contact-coach.png"
             alt="Contact Coach Shuki" 
             fill 
             className="object-cover object-center opacity-20"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h4 className="text-red-600 font-bold tracking-widest uppercase mb-4 text-sm md:text-lg">
            Don't hesitate
          </h4>
          <h1 className="text-5xl md:text-[6rem] lg:text-[7rem] font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
            Get In <br className="md:hidden" />
            <span className="text-zinc-500">Touch</span>
          </h1>
        </div>
      </section>

      {/* 2. CONTACT INFO & FORM */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* ЛЕВА СТРАНА */}
        <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
                Ready to transform <br/> <span className="text-red-600">your life?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12">
                Whether you have a question about the programs, need technical support, or want to apply for the exclusive 1-on-1 coaching, send a message below. I respond to all serious inquiries within 24 hours.
            </p>

            <div className="space-y-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-red-600 text-xl flex-shrink-0">✉️</div>
                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Direct Email</h4>
                        <p className="text-zinc-400">smootyefects@gmail.com</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-red-600 text-xl flex-shrink-0">💬</div>
                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Viber Support</h4>
                        <p className="text-zinc-400">+389 77 852 645</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-red-600 text-xl flex-shrink-0">📱</div>
                    <div>
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Social Media</h4>
                        <p className="text-zinc-400">@angjeleskiandrej</p>
                        
                    </div>
                </div>
            </div>
        </div>

        {/* ДЕСНА СТРАНА: Форма за контакт */}
        <div className="bg-zinc-950 border border-zinc-800 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="John Doe" className="bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 outline-none focus:border-red-600 transition-colors" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="john@example.com" className="bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 outline-none focus:border-red-600 transition-colors" />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="interest" className="text-xs font-bold uppercase tracking-widest text-zinc-500">What are you interested in?</label>
                    <select id="interest" name="interest" required className="bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white outline-none focus:border-red-600 transition-colors appearance-none cursor-pointer">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Beginner Program">Beginner Program</option>
                        <option value="Advanced Program">Advanced Program</option>
                        <option value="1-on-1 Premium Coaching">1-on-1 Premium Coaching</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Message</label>
                    <textarea id="message" name="message" required rows={5} placeholder="Tell me about your goals..." className="bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 outline-none focus:border-red-600 transition-colors resize-none"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className={`mt-4 w-full text-white font-black uppercase tracking-widest py-5 rounded-xl transition-all shadow-lg ${isSubmitting ? "bg-zinc-700 cursor-not-allowed" : submitStatus === "success" ? "bg-green-600 hover:bg-green-700 shadow-green-600/20" : "bg-red-600 hover:bg-red-700 shadow-red-600/20 active:scale-95"}`}>
                    {isSubmitting ? "Sending..." : submitStatus === "success" ? "Message Sent! ✓" : "Send Message"}
                </button>

                {submitStatus === "error" && (
                  <p className="text-red-500 text-xs font-bold text-center mt-2 uppercase tracking-widest">
                    Something went wrong. Please try again.
                  </p>
                )}

            </form>
        </div>

      </section>

    </main>
  );
}