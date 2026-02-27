"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroSoftLuxury({
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
      <Reveal as="section" className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover scale-105 transition-transform duration-10000 ease-linear hover:scale-100"
          sizes="100vw"
          priority
        />
        {/* Soft, multi-layered gradient for that luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10 z-10" />
        
        <div className="relative z-20 container mx-auto px-4">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-6">
              {promoText && (
                <div className="inline-block">
                  <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">
                    {promoText}
                  </span>
                </div>
              )}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-light text-foreground leading-[1] tracking-tight">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-serif italic border-l-2 border-primary/30 pl-8 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <a href={primaryCTAHref} className="px-4 sm:px-12 py-5 bg-primary text-primary-foreground font-light rounded-none hover:bg-primary/90 hover:tracking-[0.4em] transition-all duration-500 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center text-center">
                {primaryCTA}
              </a>
              <a href={secondaryCTAHref} className="px-4 sm:px-12 py-5 bg-background/50 backdrop-blur-md text-foreground border border-border font-light rounded-none hover:bg-background transition-all uppercase tracking-[0.3em] text-[10px] flex items-center justify-center text-center">
                {secondaryCTA}
              </a>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-60">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{benefitText ? benefitText.split(' ')[0] : "Certified"}</span>
                <span className="text-xs font-serif italic text-foreground">{benefitText ? benefitText.split(' ').slice(1).join(' ') : "Estheticians"}</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Premium</span>
                <span className="text-xs font-serif italic text-foreground">Products</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
