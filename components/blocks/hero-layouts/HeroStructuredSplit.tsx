"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroStructuredSplit({
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
      <Reveal as="section" className="relative w-full py-20 lg:py-32 bg-background overflow-hidden">
        {/* Background elements for academic feel */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/20 -skew-x-12 translate-x-1/2 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-xs">
                  <div className="w-12 h-0.5 bg-primary" />
                  Academic Excellence
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tighter">
                  {title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl font-medium">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href={primaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-primary text-primary-foreground font-black rounded-sm hover:translate-y-[-2px] hover:shadow-xl transition-all shadow-lg text-[10px] sm:text-xs uppercase tracking-widest text-center">
                  {primaryCTA}
                </a>
                <a href={secondaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-background text-foreground font-bold rounded-sm border-2 border-border hover:border-primary/20 transition-all text-[10px] sm:text-xs uppercase tracking-widest text-center">
                  {secondaryCTA}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border-[12px] border-background">
                <Image
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                {/* Academic seal/badge overlay */}
                <div className="absolute bottom-6 right-6 w-24 h-24 bg-background rounded-full shadow-xl flex items-center justify-center p-2 border border-border">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-center text-primary leading-tight">{benefitText || <>SY 2026<br/>2027</>}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
