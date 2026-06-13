"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:border-accent-primary/50 hover:bg-white/10 hover:shadow-[0_15px_40px_-5px_rgba(255,107,53,0.4)] group
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}
      `}
    >
      {/* Inner glow element */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-primary to-highlight opacity-0 transition-opacity duration-300 group-hover:opacity-20 blur-sm" />
      
      <ArrowUp 
        size={24} 
        className="text-text-secondary transition-colors duration-300 group-hover:text-white" 
        strokeWidth={2.5} 
      />
    </button>
  );
}
