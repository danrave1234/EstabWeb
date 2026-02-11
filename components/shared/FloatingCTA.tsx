"use client";

import { useEffect, useState } from "react";
import { Phone, Calendar, ArrowUp } from "lucide-react";

export type FloatingCTAProps = {
  phone?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function FloatingCTA({
  phone,
  ctaText = "Book Now",
  ctaHref = "#contact",
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show after scrolling 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
        setShowScrollTop(true);
      } else {
        setIsVisible(false);
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 transition-all duration-500 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
      
      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-lg text-foreground hover:bg-muted transition-colors"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Main CTA */}
      <div className="flex items-center gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-xl text-primary hover:bg-primary hover:text-primary-foreground transition-all group"
          >
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
        )}
        <a
          href={ctaHref}
          className="flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm whitespace-nowrap">{ctaText}</span>
        </a>
      </div>
    </div>
  );
}
