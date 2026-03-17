"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroBrightClean({
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
      <Reveal as="section" className="relative w-full min-h-[70vh] flex items-center bg-background overflow-hidden">
        {/* Abstract water-like shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-50/50 skew-x-[-12deg] translate-x-32 -z-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="space-y-6">
                {benefitText && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    {benefitText}
                  </div>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-cyan-950 leading-[1.05] tracking-tight">
                  {title.split(' ').map((word, i) => (
                    <span key={i} className={word.toLowerCase() === 'water' || word.toLowerCase() === 'clean' ? 'text-cyan-500' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <a 
                  href={primaryCTAHref} 
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_primary' })}
                  className="px-4 sm:px-10 py-5 bg-cyan-500 text-white font-black rounded-full hover:bg-cyan-600 hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(6,182,212,0.3)] uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center text-center"
                >
                  {primaryCTA}
                </a>
                {secondaryCTA && (
                  <a 
                    href={secondaryCTAHref} 
                    onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_secondary' })}
                    className="px-4 sm:px-10 py-5 bg-background text-cyan-900 font-bold rounded-full border-2 border-cyan-100 hover:border-cyan-200 transition-all uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center text-center"
                  >
                    {secondaryCTA}
                  </a>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                {localCoverage && (
                  <div className="flex items-center gap-2 text-cyan-800/60 font-bold text-[10px] uppercase tracking-widest">
                    <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                      {localCoverageImageUrl ? (
                        <img src={localCoverageImageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <DynamicIcon name={localCoverageIcon || "MapPin"} className="w-4 h-4 text-cyan-500" />
                      )}
                    </div>
                    {localCoverage}
                  </div>
                )}
                <div className="flex items-center gap-2 text-cyan-800/60 font-bold text-[10px] uppercase tracking-widest">
                  <div className={`${benefitImageUrl ? "w-8 h-8" : "w-4 h-4"} flex items-center justify-center overflow-hidden`}>
                    {benefitImageUrl ? (
                      <img src={benefitImageUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <DynamicIcon name={benefitIcon || "ShieldCheck"} className="w-4 h-4 text-cyan-500" />
                    )}
                  </div>
                  {benefitText || "DOH Certified"}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Floating effect for the image */}
                <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-full h-full animate-float">
                  {backgroundImage ? (
                    <Image
                      src={backgroundImage}
                      alt={title}
                      fill
                      className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-cyan-100/50 flex items-center justify-center rounded-2xl">
                      <DynamicIcon name="Image" className="w-12 h-12 text-cyan-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
