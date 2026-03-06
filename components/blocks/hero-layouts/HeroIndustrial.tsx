"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroIndustrial({
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
      <Reveal as="section" className="relative w-full py-16 sm:py-24 lg:py-32 overflow-hidden bg-background border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1] uppercase">
                  {title}
                </h1>
                <p className="text-lg sm:text-2xl text-muted-foreground font-medium border-l-4 border-primary pl-6 max-w-2xl">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <a 
                  href={primaryCTAHref} 
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_primary' })}
                  className="inline-flex items-center justify-center px-4 sm:px-8 py-5 bg-primary text-primary-foreground font-black rounded-none hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] uppercase tracking-tighter text-[10px] sm:text-sm text-center"
                >
                  {primaryCTA}
                </a>
                <a 
                  href={secondaryCTAHref} 
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_secondary' })}
                  className="inline-flex items-center justify-center px-4 sm:px-8 py-5 bg-muted text-foreground font-bold rounded-none border-2 border-primary/20 hover:bg-primary/5 transition-all uppercase tracking-tighter text-[10px] sm:text-sm text-center"
                >
                  {secondaryCTA}
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative h-[400px] lg:h-[600px]">
              <div className="absolute inset-0 bg-primary/10 skew-x-[-6deg] translate-x-6 z-0" />
              <div className="relative h-full w-full grayscale contrast-125 shadow-2xl skew-x-[-6deg] overflow-hidden border-8 border-background">
                <Image
                  src={backgroundImage || "https://images.unsplash.com/photo-1503387762-592dee58c460?w=1080&q=80"}
                  alt={title}
                  fill
                  className="object-cover -skew-x-[-6deg] scale-110"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
