"use client";

import { useEffect, useState } from "react";
import { Phone, Calendar, ArrowUp } from "lucide-react";
import { trackEvent } from "@/components/shared/Analytics";
import { useProjectId } from "@/components/shared/Analytics";

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
  const projectId = useProjectId();

  useEffect(() => {
    const toggleVisibility = () => {
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

  function handleCtaClick(section: string, ctaId: string) {
    trackEvent({
      type: "cta_click",
      project_id: projectId,
      section_key: section,
      cta_id: ctaId,
    });
  }

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 z-50 flex flex-row sm:flex-col gap-2 sm:gap-3 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      
      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background border border-border shadow-lg text-foreground hover:bg-muted transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Main CTA */}
      <div className="flex items-center gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => handleCtaClick("sticky", "phone")}
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-xl text-primary hover:bg-primary hover:text-primary-foreground transition-all group"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          </a>
        )}
        <a
          href={ctaHref}
          onClick={() => handleCtaClick("sticky", "primary")}
          className="flex h-11 sm:h-12 items-center gap-2 rounded-full bg-primary px-4 sm:px-6 font-bold text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm whitespace-nowrap">{ctaText}</span>
        </a>
      </div>
    </div>
  );
}
