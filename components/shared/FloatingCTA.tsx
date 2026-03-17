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
      className={`fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end gap-2 transition-all duration-500 transform pointer-events-none ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
    >
      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background border border-border shadow-lg text-foreground hover:bg-muted transition-colors pointer-events-auto"
          aria-label="Back to top"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Main CTA */}
      <div className="flex items-center gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => handleCtaClick("sticky", "phone")}
            className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-background border-2 border-primary shadow-2xl text-primary hover:bg-primary hover:text-primary-foreground transition-all group animate-in fade-in zoom-in duration-500 pointer-events-auto"
          >
            <Phone className="w-4 h-4 sm:w-6 h-6 group-hover:rotate-12 transition-transform" />
          </a>
        )}
        <a
          href={ctaHref}
          onClick={() => handleCtaClick("sticky", "primary")}
          className="font-serif flex h-10 sm:h-14 items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-primary px-4 sm:px-8 font-black text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all animate-in fade-in zoom-in duration-500 delay-100 pointer-events-auto"
        >
          <Calendar className="w-4 h-4 sm:w-6 h-6" />
          <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] whitespace-nowrap hidden sm:inline">{ctaText}</span>
          <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.12em] whitespace-nowrap inline sm:hidden">Book</span>
        </a>
      </div>
    </div>
  );
}
