"use client";

import { useState, useEffect } from "react";
import { TimerIcon, SparkleIcon } from "@phosphor-icons/react";
import { X } from "lucide-react";
import { trackEvent } from "@/components/shared/Analytics";

export type PromoBannerStripProps = {
  text?: string;
  countdownDate?: string;
  buttonText?: string;
  buttonHref?: string;
  isVisible?: boolean;
  expiredText?: string;
  dismissKey?: string;
};

export default function PromoBannerStrip({
  text = "Limited Promo: Get 20% off on all services this month!",
  countdownDate,
  buttonText,
  buttonHref = "#contact",
  isVisible: initialIsVisible = true,
  expiredText = "This offer has ended.",
  dismissKey,
}: PromoBannerStripProps) {
  const storageKey = `promo-banner-dismissed-${dismissKey || "default"}`;
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string } | null>(null);
  const [expired, setExpired] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Restore dismissed state from localStorage on mount
  useEffect(() => {
    if (!initialIsVisible) { setIsVisible(false); return; }
    try {
      if (typeof window !== "undefined" && localStorage.getItem(storageKey) === "1") {
        setIsVisible(false);
      }
    } catch {}
  }, [storageKey, initialIsVisible]);

  useEffect(() => {
    if (!countdownDate) return;

    const calculateTime = () => {
      const difference = +new Date(countdownDate) - +new Date();
      if (difference > 0) {
        setExpired(false);
        setTimeLeft({
          hours: Math.floor(difference / (1000 * 60 * 60)).toString().padStart(2, "0"),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0"),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, "0"),
        });
      } else {
        setTimeLeft(null);
        setExpired(true);
      }
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, [countdownDate]);

  const handleDismiss = () => {
    setIsVisible(false);
    try { if (typeof window !== "undefined") localStorage.setItem(storageKey, "1"); } catch {}
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground py-2 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center z-[60] shadow-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <SparkleIcon weight="duotone" className="w-4 h-4 text-accent animate-pulse" />
        <p className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wide">
          {text}
        </p>
      </div>

      {timeLeft && (
        <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
          <TimerIcon weight="duotone" className="w-3.5 h-3.5 opacity-80" />
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold">
            <span>{timeLeft.hours}</span>
            <span className="opacity-40">:</span>
            <span>{timeLeft.minutes}</span>
            <span className="opacity-40">:</span>
            <span>{timeLeft.seconds}</span>
          </div>
        </div>
      )}

      {buttonText && (
        <a 
          href={buttonHref}
          onClick={() => trackEvent({ type: 'cta_click', section_key: 'announcement_bar', cta_id: 'banner_cta' })}
          className="font-serif bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold hover:scale-105 transition-transform"
        >
          {buttonText}
        </a>
      )}

      {expired && countdownDate && (
        <span className="text-[11px] font-semibold opacity-70 italic">{expiredText}</span>
      )}

      <button 
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
}
