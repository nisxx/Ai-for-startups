"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, MoveRight, X } from "lucide-react";

export default function MainContainer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('.can-scroll-y');
      
      if (scrollableParent && scrollableParent.scrollHeight > scrollableParent.clientHeight) {
        const isAtTop = scrollableParent.scrollTop <= 1;
        const isAtBottom = scrollableParent.scrollHeight - scrollableParent.scrollTop <= scrollableParent.clientHeight + 2;
        
        // If they are scrolling vertically and NOT at the absolute boundaries, let them scroll naturally
        if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
          return; 
        }
      }

      // Prevent trackpad swipe back/forward navigation and native scroll
      e.preventDefault();

      if ((Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) && !isScrolling) {
        isScrolling = true;
        
        const useX = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const delta = useX ? e.deltaX : e.deltaY;

        if (delta > 0) {
          setActiveIndex(prev => Math.min(prev + 1, 4));
        } else {
          setActiveIndex(prev => Math.max(prev - 1, 0));
        }
        
        setTimeout(() => { isScrolling = false; }, 800); 
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    
    if (distance > 50) {
      setActiveIndex(prev => Math.min(prev + 1, 4));
    } else if (distance < -50) {
      setActiveIndex(prev => Math.max(prev - 1, 0));
    }
    setTouchStart(null);
  };

  const slideProgress = (activeIndex / 4) * 100;
  const orbColors = ["#1d4ed8", "#9333ea", "#10b981", "#ec4899", "#f59e0b"]; 

  return (
    <div className="w-full h-[100svh] relative overflow-hidden bg-black text-white">
      
      {/* Floating Dynamic Glow Orb */}
      <motion.div 
        className="fixed top-1/2 left-1/2 w-[80vw] h-[80vh] md:w-[60vw] md:h-[60vh] rounded-full z-0 pointer-events-none blur-[100px] md:blur-[140px] opacity-30 md:opacity-40"
        animate={{ 
          backgroundColor: orbColors[activeIndex],
          x: ["-50%", "-40%", "-60%", "-50%"],
          y: ["-50%", "-60%", "-40%", "-50%"],
        }}
        transition={{ 
          backgroundColor: { duration: 1.5, ease: "easeInOut" },
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
      />

      {/* Main Slider Track */}
      <motion.div 
        className="w-[500vw] h-full flex z-10 relative"
        animate={{ x: `-${activeIndex * 100}vw` }}
        transition={{ type: "spring", stiffness: 50, damping: 20, mass: 0.8 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-screen h-full flex-shrink-0"><HeroChapter setShowContact={setShowContact} /></div>
        <div className="w-screen h-full flex-shrink-0"><AboutChapter /></div>
        <div className="w-screen h-full flex-shrink-0"><IsRightChapter /></div>
        <div className="w-screen h-full flex-shrink-0"><ProcessChapter /></div>
        <div className="w-screen h-full flex-shrink-0"><SelectionFAQChapter /></div>
      </motion.div>

      {/* Bottom Global Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-auto bg-[#050505]/95 backdrop-blur-3xl border-t border-white/10 md:border md:rounded-full z-50 flex items-center justify-between px-6 py-4 md:px-8 md:py-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Slide Indicators */}
        <div className="flex gap-3 md:gap-4 items-center">
          {[0, 1, 2, 3, 4].map((idx) => (
            <button 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="group relative flex items-center justify-center p-2 -m-2"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className={`block transition-all duration-500 rounded-full ${
                activeIndex === idx 
                  ? 'w-6 h-1.5 md:w-8 md:h-1.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                  : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>

        {/* Action Button */}
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLScHpOhMzKxRPa5NyxCMXGH_3wfBcFBcIOsQ5PrC3e0b7JMFjg/viewform" 
          target="_blank" 
          rel="noreferrer"
          className="ml-8 md:ml-12 bg-white text-black px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] flex-shrink-0"
        >
          Apply Now
        </a>
      </div>

      {/* Contact Pop-up Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#050505]/80 backdrop-blur-2xl border border-white/10 p-8 md:p-14 max-w-lg w-full relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl"
            >
              <button 
                onClick={() => setShowContact(false)} 
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
              >
                <X size={16} />
              </button>
              <h3 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Contact Us</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 font-semibold">Email</p>
                  <p className="text-white/90 font-mono text-sm hover:text-blue-400 transition-colors cursor-pointer">hello@startups.com</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 font-semibold">Phone</p>
                  <p className="text-white/90 font-mono text-sm">+977 980-0000000</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-3 font-semibold">Location</p>
                  <p className="text-white/90 font-mono text-sm leading-relaxed text-white/70">Kathmandu, Nepal<br/>Available Mon-Fri, 9am - 5pm</p>
                </div>
              </div>
              <button 
                onClick={() => setShowContact(false)} 
                className="mt-14 w-full bg-white text-black py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all rounded-lg"
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PremiumAIText() {
  const [text, setText] = useState("####");
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const target = "A.I.";
    let iterations = 0;
    
    const interval = setInterval(() => {
      setText(target.split('').map((letter, index) => {
        if (index < iterations) return letter;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iterations >= target.length) clearInterval(interval);
      iterations += 1 / 4; 
    }, 40);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block ml-1 group">
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></span>
      
      <motion.span 
        className="absolute top-0 left-0 text-cyan-400 mix-blend-screen pointer-events-none opacity-50 blur-[1px]"
        animate={{ x: [-2, 2, -1, 1, 0], y: [1, -1, 0, 1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", repeatDelay: 4 }}
      >
        {text}
      </motion.span>
      <motion.span 
        className="absolute top-0 left-0 text-pink-500 mix-blend-screen pointer-events-none opacity-50 blur-[1px]"
        animate={{ x: [2, -2, 1, -1, 0], y: [-1, 1, 0, -1, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", repeatDelay: 4.1 }}
      >
        {text}
      </motion.span>

      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white animate-shimmer pr-2">
        {text}
      </span>
      
      <motion.span 
        className="absolute -right-4 bottom-2 w-5 h-1.5 bg-white/80"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}

function HeroChapter({ setShowContact }: { setShowContact: (v: boolean) => void }) {
  return (
    <section className="w-full h-full flex flex-col relative overflow-y-auto can-scroll-y no-scrollbar p-6 md:p-24 justify-start" style={{ touchAction: 'pan-y' }}>
      <div className="flex-1 flex flex-col justify-start pt-12 md:pt-20 max-w-6xl mx-auto w-full relative z-10 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="inline-block border border-white/20 rounded-full px-4 py-1.5 mb-6 bg-white/5 backdrop-blur-md">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-semibold">AEIF-Supported Initiative</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[7vw] font-black leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-2xl">
            Grow Your <br/>
            Startup with <PremiumAIText />
          </h1>
          
          <h2 className="text-sm md:text-xl font-mono uppercase text-white/80 mb-6 max-w-2xl leading-relaxed">
            Learn the <span className="text-blue-400 font-bold drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]">tools</span>, <span className="text-green-400 font-bold drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">skills</span>, and <span className="text-yellow-400 font-bold drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">mindset</span> to scale your business.
          </h2>
          
          <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-[0.2em] max-w-lg mb-10 leading-loose font-medium">
            A hands-on program designed for early-stage Nepali startups ready to move beyond survival and into exponential growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLScHpOhMzKxRPa5NyxCMXGH_3wfBcFBcIOsQ5PrC3e0b7JMFjg/viewform" 
              target="_blank" 
              rel="noreferrer"
              className="bg-white text-black px-10 py-4 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full"
            >
              Apply Now <MoveRight size={16} />
            </a>
            <button 
              onClick={() => setShowContact(true)}
              className="border border-white/30 px-10 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] hover:bg-white/10 hover:border-white transition-colors rounded-full backdrop-blur-sm"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
        
        {/* Bottom Floating Bar */}
        <div className="relative z-20 mt-16 w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-center gap-4 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <span className="w-full md:w-auto text-white/90">Free 2-day bootcamp</span>
            <span className="hidden md:block text-white/20 font-light text-xl leading-none">|</span>
            <span className="md:hidden w-12 h-[1px] bg-white/10"></span>
            <span className="w-full md:w-auto text-white/90">1-month mentorship</span>
            <span className="hidden md:block text-white/20 font-light text-xl leading-none">|</span>
            <span className="md:hidden w-12 h-[1px] bg-white/10"></span>
            <span className="w-full md:w-auto text-white/90">Open to all sectors</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutChapter() {
  return (
    <section className="w-full h-full relative overflow-y-auto can-scroll-y no-scrollbar p-6 md:p-24" style={{ touchAction: 'pan-y' }}>
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-16 md:gap-24 relative z-10 min-h-full py-16 md:py-0 md:items-center pb-32">
        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] mb-8 text-white/40 font-bold border-l-2 border-white/40 pl-4">01 / ABOUT</p>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] mb-10 uppercase tracking-tighter drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
            NOT JUST SURVIVAL.<br/>WE ENGINEER GROWTH.
          </h2>
          <div className="text-[10px] md:text-xs text-white/60 font-mono uppercase leading-loose space-y-6 max-w-xl">
            <p className="border-b border-white/10 pb-6">Many founders today experiment with AI in scattered ways. We focus on real business applications to save time, improve decisions, and build systems that scale.</p>
            <p>Through hands-on training and expert guidance, learn to integrate AI into existing workflows without disrupting what already works.</p>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] mb-8 text-white">Why This Program Exists</h3>
            <p className="text-[9px] md:text-[10px] text-white/40 font-mono uppercase mb-8 leading-loose tracking-wider">From our needs assessment, many founders:</p>
            <ul className="space-y-4 text-[9px] md:text-[10px] font-mono uppercase text-white/70">
              {[
                "Use AI like ChatGPT but are unsure which tools are right",
                "Spend hours on repetitive tasks like content creation",
                "Want to automate workflows, but don’t know where to start",
                "Struggle with financial planning, pricing, and growth",
                "Are concerned about data privacy and responsible AI"
              ].map((point, i) => (
                <li key={i} className="flex gap-4 items-start group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 mt-1.5 group-hover:bg-white transition-colors shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                  <span className="leading-relaxed group-hover:text-white transition-colors">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function IsRightChapter() {
  return (
    <section className="w-full h-full relative overflow-y-auto can-scroll-y no-scrollbar p-6 md:p-24" style={{ touchAction: 'pan-y' }}>
      <div className="max-w-7xl w-full mx-auto flex flex-col-reverse md:flex-row gap-16 md:gap-24 relative z-10 min-h-full py-16 md:py-0 md:items-center pb-32">
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] mb-8 text-white">What You'll Gain</h3>
            <ul className="space-y-5 text-[9px] md:text-[10px] font-mono uppercase text-white/70">
              {[
                "Identify the right AI tools for specific business needs",
                "Build simple, effective workflows to reduce manual work",
                "Improve marketing and content processes",
                "Use AI to support decision-making and planning",
                "Integrate AI into existing systems—without starting from scratch"
              ].map((point, i) => (
                <li key={i} className="flex gap-4 items-center group">
                  <ChevronRight size={14} className="text-white/30 shrink-0 group-hover:text-white transition-colors" /> 
                  <span className="leading-relaxed group-hover:text-white transition-colors">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] mb-8 text-white/40 font-bold border-l-2 border-white/40 pl-4">02 / QUALIFICATIONS</p>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] mb-10 uppercase tracking-tighter drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40">
            IS THIS PROGRAM RIGHT FOR YOU?
          </h2>
          <div className="text-[9px] md:text-[10px] text-white/50 font-mono uppercase leading-loose space-y-6">
            <p className="text-white/80 font-bold tracking-widest text-xs">You should apply if you:</p>
            <ul className="space-y-4 border-l border-white/20 pl-6">
              <li className="flex gap-3"><span className="text-white/30">-</span> Early-stage startup (up to 5 years)</li>
              <li className="flex gap-3"><span className="text-white/30">-</span> Have an MVP & operating for at least 6 months</li>
              <li className="flex gap-3"><span className="text-white/30">-</span> Team of fewer than 20 people</li>
              <li className="flex gap-3"><span className="text-white/30">-</span> Actively trying to scale or overcome a plateau</li>
            </ul>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 mt-6 text-white/60">
              <p>Open to all sectors (tech, services, retail, social). Focus is on business fundamentals.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessChapter() {
  return (
    <section className="w-full h-full relative overflow-y-auto can-scroll-y no-scrollbar p-6 md:p-24" style={{ touchAction: 'pan-y' }}>
      <div className="max-w-7xl w-full mx-auto flex flex-col justify-center relative z-10 min-h-full py-16 md:py-0 pb-32">
        <p className="text-[9px] md:text-[10px] tracking-[0.4em] mb-12 text-white/40 font-bold border-l-2 border-white/40 pl-4">03 / IMPLEMENTATION PROCESS</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-[120px] font-black text-white/5 tracking-tighter leading-none group-hover:text-white/10 transition-colors pointer-events-none">1</div>
            <h3 className="text-lg md:text-xl font-bold tracking-[0.2em] mb-3 uppercase text-white/90">2-Day Bootcamp</h3>
            <p className="text-[9px] text-white/40 font-mono uppercase mb-8 tracking-wider">Intensive Hands-on Workshop</p>
            <div className="text-[9px] font-mono uppercase space-y-6 relative z-10">
              <ul className="text-white/70 space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
                <li className="flex justify-between items-center"><span className="font-bold text-white">Kathmandu</span> <span className="text-white/50">6–7 June</span></li>
                <li className="flex justify-between items-center"><span className="font-bold text-white">Biratnagar</span> <span className="text-white/50">13–14 June</span></li>
                <li className="flex justify-between items-center"><span className="font-bold text-white">Pokhara</span> <span className="text-white/50">20–21 June</span></li>
              </ul>
              <ul className="text-white/50 space-y-3 pl-2 border-l border-white/20">
                <li className="leading-relaxed">Practical sessions on real business tasks</li>
                <li className="leading-relaxed">Guided workflow exercises</li>
              </ul>
            </div>
          </div>

          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden mt-0 md:mt-12">
            <div className="absolute top-0 right-0 p-8 text-[120px] font-black text-white/5 tracking-tighter leading-none group-hover:text-white/10 transition-colors pointer-events-none">2</div>
            <h3 className="text-lg md:text-xl font-bold tracking-[0.2em] mb-3 uppercase text-white/90">1-Month Mentorship</h3>
            <p className="text-[9px] text-white/40 font-mono uppercase mb-8 tracking-wider">Continued Support & Implementation</p>
            <div className="text-[9px] font-mono uppercase space-y-6 relative z-10">
              <ul className="text-white/50 space-y-4 pl-2 border-l border-white/20">
                <li className="leading-relaxed">Access to experienced AI mentors</li>
                <li className="leading-relaxed">Guidance on adoption challenges</li>
                <li className="leading-relaxed">Access to peer founder community</li>
                <li className="leading-relaxed text-blue-400/80 font-bold">Paid versions of AI tools for experimentation</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/[0.01] backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-3xl hover:bg-white/[0.15] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden mt-0 md:mt-24 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
            <div className="absolute top-0 right-0 p-8 text-[120px] font-black text-white/10 tracking-tighter leading-none group-hover:text-white/20 transition-colors pointer-events-none">3</div>
            <h3 className="text-lg md:text-xl font-bold tracking-[0.2em] mb-3 uppercase text-white">Showcase</h3>
            <p className="text-[9px] text-white/60 font-mono uppercase mb-8 tracking-wider">Networking in Kathmandu</p>
            <div className="text-[9px] font-mono uppercase space-y-6 relative z-10">
              <p className="text-white/80 leading-relaxed font-bold">Connect with peers, mentors, and stakeholders to set up a path forward!</p>
              <ul className="text-white/60 space-y-4 pt-6 border-t border-white/20">
                <li className="leading-relaxed">Designed for startup constraints</li>
                <li className="text-green-400 font-bold tracking-widest bg-green-400/10 inline-block px-3 py-1.5 rounded-full mt-4 border border-green-400/20">100% FREE FOR PARTICIPANTS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectionFAQChapter() {
  const faqs = [
    { q: "What does the program cost?", a: "Free for all selected participants." },
    { q: "Do I need technical experience?", a: "No. The program is designed for business leaders." },
    { q: "Will travel be covered?", a: "Not for bootcamp, but Pokhara/Biratnagar startups get travel assistance for the final Kathmandu showcase." },
    { q: "What should I bring?", a: "A laptop. Reach out if you need assistance getting one." },
    { q: "What happens after the bootcamp?", a: "You’ll receive 1 month of mentorship and ongoing support." }
  ];

  return (
    <section className="w-full h-full relative overflow-y-auto can-scroll-y no-scrollbar p-6 md:p-24" style={{ touchAction: 'pan-y' }}>
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-12 md:gap-24 relative z-10 min-h-full py-16 md:py-0 pb-32">
        <div className="md:w-1/2 flex flex-col justify-center">
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] mb-8 text-white/40 font-bold border-l-2 border-white/40 pl-4">04 / SELECTION</p>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 uppercase drop-shadow-xl">How Startups Are Selected</h3>
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-3xl">
            <p className="text-[9px] text-white font-bold font-mono uppercase mb-6 tracking-widest text-blue-400">Preference will be given to:</p>
            <ul className="space-y-6 text-[9px] md:text-[10px] font-mono uppercase text-white/70">
              <li className="flex gap-4 items-center border-b border-white/5 pb-4"><div className="w-2 h-2 rounded-full bg-white/20 shrink-0"></div> <span className="leading-relaxed text-white/90">Startups at a clear growth stage (6-12m)</span></li>
              <li className="flex gap-4 items-center border-b border-white/5 pb-4"><div className="w-2 h-2 rounded-full bg-white/20 shrink-0"></div> <span className="leading-relaxed text-white/90">Teams with ambition & readiness to scale</span></li>
              <li className="flex gap-4 items-center"><div className="w-2 h-2 rounded-full bg-white/20 shrink-0"></div> <span className="leading-relaxed text-white/90">Founders facing bottlenecks solvable by AI</span></li>
            </ul>
          </div>
        </div>

        <div className="md:w-1/2 flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-bold tracking-[0.2em] mb-8 uppercase text-white/50">FAQs</h3>
          <div className="flex flex-col border-t border-white/20">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex justify-between items-center group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-white transition-colors pr-8 text-white/70">{q}</span>
        <ChevronDown size={14} className={`transform transition-transform text-white/40 group-hover:text-white ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[10px] font-mono uppercase text-blue-400/80 leading-relaxed font-bold tracking-wider">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
