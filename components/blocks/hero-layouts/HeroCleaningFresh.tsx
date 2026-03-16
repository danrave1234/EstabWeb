"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroCleaningFresh({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#services",
  benefitText,
  benefitIcon,
  benefitImageUrl,
  localCoverage,
  localCoverageIcon,
  localCoverageImageUrl,
  promoText,
}: HeroAuthorityProps) {
  return (
      <Reveal as="section" className="relative w-full py-16 lg:py-24 bg-background overflow-hidden">
        {/* Fresh decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-6">
                {benefitText && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {benefitText}
                  </div>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
                  {title}
                </h1>
                <div className="flex flex-col gap-2">
                  {localCoverage && (
                    <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm uppercase tracking-widest">
                      <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                        {localCoverageImageUrl ? (
                          <img src={localCoverageImageUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <DynamicIcon name={localCoverageIcon || "MapPin"} className="w-4 h-4" />
                        )}
                      </div>
                      {localCoverage}
                    </div>
                  )}
                  <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href={primaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-primary text-primary-foreground font-black rounded-full hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-[10px] sm:text-xs text-center">
                  {primaryCTA}
                </a>
                <a href={secondaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-background text-foreground font-bold rounded-full border-2 border-border hover:border-primary/20 transition-all uppercase tracking-widest text-[10px] sm:text-xs text-center">
                  {secondaryCTA}
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border-8 border-background bg-muted/20">
                {backgroundImage ? (
                  <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <DynamicIcon name="Image" className="w-12 h-12 text-muted-foreground/20" />
                  </div>
                )}
                {/* Floating "Clean" badge */}
                <div className="absolute top-8 right-8 w-20 h-20 bg-background rounded-full shadow-xl flex items-center justify-center border border-border animate-float">
                  <DynamicIcon name="Sparkles" className="w-10 h-10 text-primary opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black uppercase text-primary text-center leading-tight">{benefitText || <>100%<br/>Safe</>}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
