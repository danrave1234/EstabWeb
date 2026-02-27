"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroHvacUrgent({
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
  layout,
}: HeroAuthorityProps) {
  return (
      <Reveal as="section" className={`relative w-full h-auto lg:h-[80vh] min-h-[500px] overflow-hidden border-b border-border ${layout === "hvac-blue" ? "bg-gradient-to-br from-blue-50 to-white" : "bg-background"}`}>
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-12 lg:py-0">
            <div className="space-y-6 lg:space-y-8 z-10">
              <div className="space-y-4">
                {benefitText && (
                  <p className="text-primary font-bold uppercase tracking-widest text-xs sm:text-sm">
                    {benefitText}
                  </p>
                )}
                {layout === "hvac-blue" && (
                  <div className="flex gap-2 mb-2">
                    <DynamicIcon name="Snowflake" className="w-5 h-5 text-blue-500 animate-spin-slow" />
                    <DynamicIcon name="Thermometer" className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1] tracking-tight">
                  {title}
                </h1>
                {localCoverage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                      {localCoverageImageUrl ? (
                        <img src={localCoverageImageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <DynamicIcon name={localCoverageIcon || "MapPin"} className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">{localCoverage}</span>
                  </div>
                )}
                <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-xl">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <a href={primaryCTAHref} className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-4 bg-primary text-primary-foreground font-black rounded-lg hover:scale-105 transition-all shadow-xl text-[10px] sm:text-sm uppercase tracking-tight text-center">
                  <DynamicIcon name="Phone" className="w-4 h-4 shrink-0" />
                  <span className="truncate">{primaryCTA}</span>
                </a>
                <a href={secondaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-8 py-4 bg-muted text-foreground font-bold rounded-lg border-2 border-primary/10 hover:bg-primary/5 transition-all text-[10px] sm:text-sm uppercase tracking-tight text-center">
                  <span className="truncate">{secondaryCTA}</span>
                </a>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-full w-full">
              <div className="absolute inset-y-0 -right-4 lg:-right-24 w-full lg:w-[120%] z-0">
                <Image
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="object-cover lg:object-center grayscale-[0.2] contrast-110"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {layout === "hvac-blue" ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/10 to-transparent lg:from-blue-50 lg:via-blue-50/10 lg:to-transparent z-10" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent lg:from-background lg:via-background/10 lg:to-transparent z-10" />
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}
