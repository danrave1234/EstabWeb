"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackLead } from "@/components/shared/Analytics";

export type PromoCTASectionProps = {
  title?: string;
  subtitle?: string;
  promoBadge?: string;
  buttonText?: string;
  buttonHref?: string;
  phone?: string;
  countdownEndDate?: string;
  backgroundImage?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minsLabel?: string;
  secsLabel?: string;
};

export default function PromoCTASection({
  title = "Exclusive Detailing Promo!",
  subtitle = "Book your slot now and get a 20% discount on all ceramic coating packages.",
  promoBadge = "Limited Offer",
  buttonText = "Claim My Discount",
  buttonHref = "#contact",
  phone,
  countdownEndDate,
  backgroundImage = "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=1200&q=80",
  daysLabel = "Days",
  hoursLabel = "Hours",
  minsLabel = "Mins",
  secsLabel = "Secs",
}: PromoCTASectionProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!countdownEndDate) return;

    const calculate = () => {
      const distance = new Date(countdownEndDate).getTime() - Date.now();
      if (distance <= 0) {
        setTimeLeft(null);
        setExpired(true);
        return;
      }
      setExpired(false);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [countdownEndDate]);

  return (
    <section className="relative py-20 overflow-hidden reveal">
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <Image 
            src={backgroundImage} 
            alt="Promo Background" 
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {promoBadge && (
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
              {promoBadge}
            </span>
          )}

          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
            {title}
          </h2>

          <p className="text-lg sm:text-xl text-white/80 font-medium max-w-2xl mx-auto">
            {subtitle}
          </p>

          {countdownEndDate && !expired && timeLeft && (
            <div className="flex justify-center gap-4 sm:gap-8">
              {[
                { label: daysLabel, value: timeLeft.days },
                { label: hoursLabel, value: timeLeft.hours },
                { label: minsLabel, value: timeLeft.minutes },
                { label: secsLabel, value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                    <span className="text-2xl sm:text-3xl font-black text-white">{String(item.value).padStart(2, '0')}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/60 mt-2">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {countdownEndDate && expired && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full">
              <span className="text-sm font-bold text-white/70 uppercase tracking-widest">This offer has ended</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a 
                href={buttonHref}
                onClick={() => {
                  if (buttonHref === '#contact') trackLead('form');
                  else if (buttonHref.startsWith('tel:')) trackLead('call');
                }}
                className="col-span-1 px-4 sm:px-10 py-3 sm:py-5 bg-primary text-primary-foreground font-black rounded-full hover:scale-105 transition-all shadow-2xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center text-center"
              >
                {buttonText}
              </a>
              {phone ? (
                <a 
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  onClick={() => trackLead('call')}
                  className="col-span-1 px-4 sm:px-10 py-3 sm:py-5 bg-white/10 backdrop-blur-md text-white font-black rounded-full border border-white/30 hover:bg-white/20 transition-all uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center gap-2 text-center"
                >
                  <DynamicIcon name="Phone" className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">Call Now</span>
                </a>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

