import Link from "next/link";
import Image from "next/image";
import DiscountBadge from "./DiscountBadge";
import InstagramPopup from "./components/InstagramPopup";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-black">
      <InstagramPopup />

      <DiscountBadge />

      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] md:h-[90vh] flex flex-col justify-end md:justify-center px-4 sm:px-8 md:px-16 pb-12 md:pb-0 overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 z-0 bg-black">
           <Image 
             src="/images/coach.jpg" 
             alt="Coach Shuki" 
             fill 
             className="object-cover object-top md:object-center" 
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent md:bg-gradient-to-b md:from-black/30 md:via-transparent md:to-black/90"></div>
        </div>
        
        <div className="relative z-10 text-center w-full max-w-5xl mx-auto md:mt-20 px-2">
          <h1 className="text-[3.2rem] leading-[0.9] sm:text-6xl md:text-[7rem] lg:text-[8rem] font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
            Start <span className="text-red-600">Now</span>
          </h1>
          <p className="mt-4 md:mt-6 text-sm md:text-xl text-zinc-300 font-bold tracking-widest uppercase drop-shadow-lg">
            Elite Online Coaching. Real Results.
          </p>
        </div>
      </section>

      {/* 2. ABOUT / EXPERIENCE SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-black border-b border-zinc-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-1 md:order-2 text-center md:text-left">
            <h4 className="text-red-600 font-bold tracking-widest uppercase mb-2 text-sm md:text-base">10 Years of Elite Experience</h4>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 md:mb-8 text-white">
              Results Don't Lie.
            </h2>
            
            <p className="text-zinc-400 text-base md:text-xl mb-4 md:mb-6">
              With over 10 years of hands-on experience in fitness and body transformation, I've helped hundreds of people build the physique they always wanted — from complete beginners to seasoned athletes.
            </p>
            <p className="text-zinc-400 text-base md:text-xl mb-8 md:mb-10">
              My approach is simple: no gimmicks, no shortcuts. Just proven training methods, relentless discipline, and a program tailored to push your body to its absolute limit — and beyond.
            </p>
            
            <p className="hidden md:block font-black uppercase text-xl text-white mb-10 border-l-4 border-red-600 pl-4 py-1 tracking-wider">
              YOUR TRANSFORMATION STARTS HERE.
            </p>
            
            <Link href="/beginner-program" className="inline-block w-full md:w-auto bg-white text-black font-black uppercase tracking-wider px-10 py-4 md:py-5 hover:bg-red-600 hover:text-white transition-colors">
              Start Your Journey
            </Link>
          </div>
          
          <div className="order-2 md:order-2 relative aspect-[4/5] w-full max-w-sm mx-auto md:max-w-full shadow-2xl bg-zinc-900 border border-zinc-800">
            <Image 
              src="/images/IMG_7392.jpg" 
              alt="Coach Shuki" 
              fill 
              className="object-cover" 
            />
            <div className="hidden md:block absolute inset-0 border-4 border-zinc-800 -translate-x-4 -translate-y-4 -z-10"></div>
          </div>
        </div>
      </section>

      {/* SCROLLING BANNER */}
      <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black text-white font-black uppercase tracking-[0.25em] text-[10px] md:text-xs py-4 overflow-hidden flex whitespace-nowrap border-y border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10 group">
        <div className="absolute inset-0 bg-red-600/5 blur-xl pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50"></div>
        <div className="animate-scroll flex gap-8 items-center">
          <div className="flex gap-8 items-center drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            <span>⚡ NO EXCUSES, ONLY RESULTS</span>
            <span className="text-red-600">///</span>
            <span>TAKE THE FIRST STEP TODAY</span>
            <span className="text-red-600">///</span>
            <span className="text-red-500">🔥 CLAIM YOUR 10% DISCOUNT</span>
            <span className="text-red-600">///</span>
            <span>BUILD THE BODY YOU DESERVE</span>
            <span className="text-red-600">///</span>
          </div>
          <div className="flex gap-8 items-center drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            <span>⚡ NO EXCUSES, ONLY RESULTS</span>
            <span className="text-red-600">///</span>
            <span>TAKE THE FIRST STEP TODAY</span>
            <span className="text-red-600">///</span>
            <span className="text-red-500">🔥 CLAIM YOUR 10% DISCOUNT</span>
            <span className="text-red-600">///</span>
            <span>BUILD THE BODY YOU DESERVE</span>
            <span className="text-red-600">///</span>
          </div>
        </div>
      </div>

      {/* 3. SELECT YOUR PATH */}
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-zinc-950 border-b border-zinc-900">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 md:mb-6">
            SELECT YOUR <span className="text-red-600 italic">PATH</span>
          </h2>
          <p className="text-sm md:text-2xl font-bold uppercase tracking-widest text-zinc-400">
            Programs built to destroy your limits.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="bg-black p-8 md:p-10 border border-zinc-800 hover:border-red-600 transition-colors duration-300 rounded-2xl md:rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">Foundation Tier</h4>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-8">Beginner Program</h3>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> 8-Week Structured Blueprint
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> 5 Training Days Per Week
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> Intense Single-Muscle Focus
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> Master Form & Build Foundation
                </li>
              </ul>
            </div>
            <Link href="/beginner-program" className="text-center w-full inline-block bg-white text-black font-black uppercase tracking-wider px-8 py-4 md:py-5 hover:bg-red-700 hover:text-white transition-colors">
              Start Your Journey
            </Link>
          </div>

          <div className="bg-black p-8 md:p-10 border border-zinc-800 hover:border-red-600 transition-colors duration-300 rounded-2xl md:rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">Elite Tier</h4>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-8">Advanced Program</h3>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> 16-Week Advanced Protocol
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> 6-Day High-Frequency Split
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> Dual-Muscle Group Targeting
                </li>
                <li className="flex items-start gap-3 text-zinc-300 font-bold uppercase text-sm md:text-base">
                  <span className="text-red-600 text-xl leading-none">✓</span> Push Beyond Your Limits
                </li>
              </ul>
            </div>
            <Link href="/advanced-program" className="text-center w-full inline-block bg-zinc-900 border border-zinc-700 text-white font-black uppercase tracking-wider px-8 py-4 md:py-5 hover:bg-red-700 hover:border-red-700 transition-colors">
              Level Up Now
            </Link>
          </div>
        </div>
      </section>
<div className="flex flex-row items-center justify-center gap-3 md:gap-5 mt-8 md:mt-12 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 hover:border-zinc-700 transition-colors py-2.5 px-4 md:py-3 md:px-7 rounded-full w-fit mx-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
  
  {/* Суптилен сјај во позадина (премиум ефект) */}
  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/5 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

  {/* Аватари кои се преклопуваат */}
  <div className="flex -space-x-2 md:-space-x-3 relative z-10">
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative z-">
      <img src="/images/client1.jpg" alt="Client" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
    </div>
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative z-">
      <img src="/images/client2.jpg" alt="Client" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
    </div>
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-zinc-950 bg-zinc-900 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative z-">
      <img src="/images/client3.jpg" alt="Client" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
    </div>
    {/* Бројката +500 */}
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-zinc-950 bg-red-600 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] flex-shrink-0 relative z-">
      500+
    </div>
  </div>

  {/* Вертикална линија за раздвојување (Десктоп само) */}
  <div className="w-px h-6 bg-zinc-800 hidden sm:block relative z-10"></div>

  {/* Ѕвезди и Текст */}
  <div className="flex flex-col items-start justify-center relative z-10">
    <div className="flex gap-0.5 md:gap-1 text-yellow-500 mb-0.5">
      {[1, 2, 3, 4, 5].map((star: number) => (
        <svg key={star} className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current drop-shadow-[0_0_3px_rgba(234,179,8,0.4)]" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <span className="text-zinc-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
      Athletes <span className="text-white">Joined</span>
    </span>
  </div>
</div>
      {/* 4. CLIENT TRANSFORMATIONS
      <section className="py-16 md:py-24 px-4 sm:px-8 md:px-16 bg-black border-b border-zinc-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-2 md:mb-4">
              Client <span className="text-red-600">Transformations</span>
            </h2>
            <p className="text-sm md:text-xl font-bold uppercase tracking-widest text-zinc-400">
              Proof is in the progress.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative aspect-[4/5] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group">
                <Image 
                  src={`/images/client${num}.jpg`} 
                  alt={`Client Transformation ${num}`} 
                  fill 
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-xs text-center -z-10 bg-zinc-950">client{num}.jpg</div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest">Transformation {num}</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section> */}
    <section className="py-24 bg-black relative">
  {/* Позадински сјај за амбиент */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-red-600/5 blur-[120px] pointer-events-none"></div>

  {/* HEADER СЕКЦИЈА */}
  <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center mb-16 relative z-10">
    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
      Client <span className="text-red-600">Transformations</span>
    </h2>
    <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
      The proof is in the progress. Real athletes, real results.
    </p>
  </div>

 {/* ГРИД СО КАРТИЧКИ */}
  <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
    
    {/* КАРТИЧКА 1 */}
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(220,38,38,0.1)] flex flex-col">
       {/* Слики Before / After */}
       <div className="relative h-64 md:h-80 w-full flex overflow-hidden">
          {/* Before */}
          <div className="w-1/2 h-full relative border-r border-black overflow-hidden">
             {/* НОВА АНИМАЦИЈА: Светло на старт, зум и brightness на hover */}
             <img src="/images/before1.jpg" alt="Before" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">Before</span>
          </div>
          {/* After */}
          <div className="w-1/2 h-full relative overflow-hidden">
             <img src="/images/after1.jpg" alt="After" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]">After</span>
          </div>
       </div>
       {/* Инфо и Цитат */}
       <div className="p-6 md:p-8 flex-1 flex flex-col justify-between z-10 bg-zinc-950 relative">
          <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-white text-lg uppercase tracking-widest">Marko T.</h3>
                <span className="text-red-500 text-[9px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">
                  -15 KG / 12 Weeks
                </span>
             </div>
             <p className="text-zinc-400 text-xs leading-relaxed italic mb-6">
               "Coach Shuki's program completely changed my mindset and body. No BS, just pure hard work and a diet that actually makes sense."
             </p>
          </div>
       </div>
    </div>

    {/* КАРТИЧКА 2 */}
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(220,38,38,0.1)] flex flex-col">
       <div className="relative h-64 md:h-80 w-full flex overflow-hidden">
          <div className="w-1/2 h-full relative border-r border-black overflow-hidden">
             <img src="/images/before2.jpg" alt="Before" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">Before</span>
          </div>
          <div className="w-1/2 h-full relative overflow-hidden">
             <img src="/images/after2.jpg" alt="After" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]">After</span>
          </div>
       </div>
       <div className="p-6 md:p-8 flex-1 flex flex-col justify-between z-10 bg-zinc-950 relative">
          <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-white text-lg uppercase tracking-widest">Stefan R.</h3>
                <span className="text-green-500 text-[9px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md">
                  +8 KG Muscle / 16 Weeks
                </span>
             </div>
             <p className="text-zinc-400 text-xs leading-relaxed italic mb-6">
               "I struggled to gain mass for years. The Advanced Program unlocked the exact blueprint I needed to finally build quality muscle."
             </p>
          </div>
       </div>
    </div>

    {/* КАРТИЧКА 3 */}
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(220,38,38,0.1)] flex flex-col md:hidden lg:flex">
       <div className="relative h-64 md:h-80 w-full flex overflow-hidden">
          <div className="w-1/2 h-full relative border-r border-black overflow-hidden">
             <img src="/images/before3.jpg" alt="Before" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">Before</span>
          </div>
          <div className="w-1/2 h-full relative overflow-hidden">
             <img src="/images/after3.jpg" alt="After" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
             <span className="absolute bottom-3 right-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]">After</span>
          </div>
       </div>
       <div className="p-6 md:p-8 flex-1 flex flex-col justify-between z-10 bg-zinc-950 relative">
          <div>
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-white text-lg uppercase tracking-widest">Aleks M.</h3>
                <span className="text-red-500 text-[9px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">
                  -22 KG / 6 Months
                </span>
             </div>
             <p className="text-zinc-400 text-xs leading-relaxed italic mb-6">
               "This isn't just a workout plan, it's a lifestyle reset. Shuki's guidance helped me drop 22KG and I've never felt stronger."
             </p>
          </div>
       </div>
    </div>

  </div>
</section>


{/* СЕКЦИЈА: HOW IT WORKS */}
<section className="py-24 bg-black relative border-t border-zinc-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
    
    <div className="mb-16">
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
        How To <span className="text-red-600">Start</span>
      </h2>
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Your transformation in 3 simple steps</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
      
      {/* Линија што ги поврзува чекорите (само на десктоп) */}
      <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-0"></div>

      {/* Чекор 1 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black group hover:border-red-600 transition-colors">
          <span className="text-4xl font-black text-zinc-800 group-hover:text-red-600 transition-colors">1</span>
        </div>
        <h3 className="text-white font-black uppercase tracking-widest text-lg mb-2">Choose Plan</h3>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-[250px]">
          Select the Beginner or Advanced blueprint based on your current aesthetic goals.
        </p>
      </div>

      {/* Чекор 2 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black group hover:border-red-600 transition-colors">
          <span className="text-4xl font-black text-zinc-800 group-hover:text-red-600 transition-colors">2</span>
        </div>
        <h3 className="text-white font-black uppercase tracking-widest text-lg mb-2">Secure Payment</h3>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-[250px]">
          Checkout securely via Bank Transfer, Crypto, or PayPal and upload your receipt.
        </p>
      </div>

      {/* Чекор 3 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black group hover:border-red-600 transition-colors">
          <span className="text-4xl font-black text-zinc-800 group-hover:text-red-600 transition-colors">3</span>
        </div>
        <h3 className="text-white font-black uppercase tracking-widest text-lg mb-2">Enter The Vault</h3>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-[250px]">
          Get instant access to your private dashboard and download your materials.
        </p>
      </div>

    </div>

    {/* Копче под чекорите */}
    <div className="mt-16">
      <Link href="#programs" className="inline-block bg-red-600 text-white font-black uppercase tracking-[0.2em] py-4 px-10 rounded-xl hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95 text-xs">
        Choose Your Plan Now
      </Link>
    </div>

  </div>
</section>
    </main>
  );
}