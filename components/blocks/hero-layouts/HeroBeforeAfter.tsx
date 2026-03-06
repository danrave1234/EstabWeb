"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";
import type { HeroAuthorityProps } from "../HeroAuthority";

export default function HeroBeforeAfter({
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
      <Reveal as="section" className="relative w-full py-16 sm:py-24 bg-background overflow-hidden border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                {benefitText && (
                  <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {benefitText}
                  </span>
                )}
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1] uppercase tracking-tighter">
                  {title}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-xl italic border-l-4 border-primary/30 pl-6">
                  {subtitle}
                </p>
                {localCoverage && (
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs sm:text-sm">
                    <div className="w-4 h-4 flex items-center justify-center overflow-hidden">
                      {localCoverageImageUrl ? (
                        <img src={localCoverageImageUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <DynamicIcon name={localCoverageIcon || "MapPin"} className="w-4 h-4" />
                      )}
                    </div>
                    <span>{localCoverage}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a href={primaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-primary text-primary-foreground font-black rounded-sm hover:scale-105 transition-all shadow-2xl text-[10px] sm:text-sm uppercase tracking-widest text-center">
                  {primaryCTA}
                </a>
                <a href={secondaryCTAHref} className="inline-flex items-center justify-center px-4 sm:px-10 py-5 bg-background text-foreground font-bold rounded-sm border-2 border-border hover:bg-muted transition-all text-[10px] sm:text-sm uppercase tracking-widest text-center">
                  {secondaryCTA}
                </a>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border-8 border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-muted">
                 <BeforeAfterHeroSlider 
                   beforeImage="https://images.unsplash.com/photo-1507133353243-30912e777745?w=1200&q=80"
                   afterImage={backgroundImage} 
                 />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    )
}

function BeforeAfterHeroSlider({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative w-full h-full cursor-ew-resize select-none overflow-hidden" 
         onMouseMove={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           const x = ((e.clientX - rect.left) / rect.width) * 100;
           setPosition(Math.max(0, Math.min(x, 100)));
         }}
         onTouchMove={(e) => {
           const rect = e.currentTarget.getBoundingClientRect();
           const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
           setPosition(Math.max(0, Math.min(x, 100)));
         }}
    >
      <Image src={afterImage} alt="After" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div 
          className="absolute inset-0 h-full"
          style={{ width: `${100 * (100 / position)}%` }}
        >
          <Image 
            src={beforeImage} 
            alt="Before" 
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="absolute top-0 bottom-0 w-1.5 bg-white shadow-2xl" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-primary/20">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-primary/40 rounded-full" />
            <div className="w-1 h-3 bg-primary/40 rounded-full" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Before</div>
      <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">After</div>
    </div>
  );
}
