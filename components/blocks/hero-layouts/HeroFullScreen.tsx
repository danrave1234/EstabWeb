"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroFullScreen({
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
      <Reveal as="section" className="relative h-[100vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <div className="relative z-20 container mx-auto px-4 text-center text-white space-y-12">
          <div className="space-y-6 max-w-5xl mx-auto">
            {benefitText && (
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-white bg-black/20 backdrop-blur-md px-6 py-2 rounded-full inline-block border border-white/20">
                {benefitText}
              </span>
            )}
            <h1 className="font-serif text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1] tracking-tighter drop-shadow-2xl uppercase">
              {title}
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-white/90 font-medium max-w-3xl mx-auto drop-shadow-lg">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <a 
                href={primaryCTAHref} 
                onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_primary' })}
                className="col-span-1 px-10 py-5 bg-white text-black font-black rounded-none hover:bg-white/90 transition-all shadow-2xl uppercase tracking-[0.2em] text-xs flex items-center justify-center text-center"
              >
                {primaryCTA}
              </a>
              <a 
                href={secondaryCTAHref} 
                onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_secondary' })}
                className="col-span-1 px-10 py-5 bg-transparent backdrop-blur-md text-white font-black rounded-none border-2 border-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center text-center"
              >
                {secondaryCTA}
              </a>
            </div>
          </div>

          {localCoverage && (
            <div className="pt-12">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white">
                  {localCoverage}
                </p>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    )
}
