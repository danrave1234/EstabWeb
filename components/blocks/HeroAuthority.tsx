"use client";

import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";
import { trackEvent } from "@/components/shared/Analytics";

export type HeroAuthorityProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundImage: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  benefitText?: string;
  benefitIcon?: string;
  benefitImageUrl?: string;
  localCoverage?: string;
  localCoverageIcon?: string;
  localCoverageImageUrl?: string;
  layout?: "full-screen" | "split" | "industrial" | "bright-clean" | "soft-luxury" | "structured-split" | "hvac-urgent" | "hvac-blue" | "before-after" | "cleaning-fresh";
  trustBadges?: { label: string; icon: string; imageUrl?: string }[];
  promoText?: string;
};

export default function HeroAuthority({
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
  layout = "split",
  trustBadges = [],
  promoText,
}: HeroAuthorityProps) {
  // 1. REAL ESTATE (Full-screen background image)
  if (layout === "full-screen") {
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
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1] tracking-tighter drop-shadow-2xl uppercase">
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
    );
  }

  // 3. CONSTRUCTION (Industrial wide image with left-aligned text)
  if (layout === "industrial") {
    return (
      <Reveal as="section" className="relative w-full py-16 sm:py-24 lg:py-32 overflow-hidden bg-background border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1] uppercase">
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
    );
  }

  // 4. WATER REFILLING (Bright, clean, centered)
  if (layout === "bright-clean") {
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
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-cyan-950 leading-[1.05] tracking-tight">
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
                  <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    );
  }

  // 5. SALON / AESTHETIC (Soft luxury, refined)
  if (layout === "soft-luxury") {
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
    );
  }

  // 6. PRIVATE SCHOOL (Structured & Academic)
  if (layout === "structured-split") {
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
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tighter">
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
    );
  }

  // 7. HVAC (Urgency split layout)
  if (layout === "hvac-urgent" || layout === "hvac-blue") {
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-[1] tracking-tight">
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
    );
  }

  // 8. AUTO DETAILING (Split with Before/After Slider)
  if (layout === "before-after") {
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
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1] uppercase tracking-tighter">
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
    );
  }

  // 9. CLEANING (Fresh, high-trust split)
  if (layout === "cleaning-fresh") {
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
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tight">
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
                <Image
                  src={backgroundImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
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
    );
  }

  // DEFAULT / SPLIT LAYOUT (Your original layout)
  return (
    <Reveal as="section" className="container mx-auto px-4 py-8 md:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-0 lg:gap-x-16 items-start">
        {/* Text Content Column */}
        <div className="lg:col-span-5 lg:space-y-8 border-l-2 border-primary/70 pl-6 lg:pl-8 flex flex-col relative">
          {benefitText && (
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
              {benefitText}
            </span>
          )}
          
          <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.1] mb-6 lg:mb-0">
            {title}
          </h1>

          {localCoverage && (
            <div className="flex items-center gap-2 mb-4 lg:mb-0">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Serving: {localCoverage}
              </span>
            </div>
          )}
          
          <div className="lg:mt-0">
            <div className="h-px w-20 bg-primary/20 mb-8 hidden lg:block" />
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-xl leading-relaxed italic font-serif">
              {subtitle}
            </p>
          </div>

          {/* Mobile Image - inserted here to be below subtitle and above buttons */}
          <div className="lg:hidden my-10 -ml-6 w-[calc(100%+1.5rem)]">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl grayscale-[0.15]">
              <Image
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 lg:pt-4">
            <a
              href={primaryCTAHref}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity duration-200 shadow-md text-center touch-manipulation uppercase tracking-widest text-[10px] sm:text-xs"
            >
              {primaryCTA}
            </a>
            <a
              href={secondaryCTAHref}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-foreground font-semibold rounded-sm border border-primary/30 hover:bg-muted/50 transition-colors duration-200 text-center touch-manipulation uppercase tracking-widest text-[10px] sm:text-xs"
            >
              {secondaryCTA}
            </a>
          </div>
        </div>

        {/* Desktop Image Column */}
        <div className="hidden lg:block lg:col-span-7 relative">
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl grayscale-[0.15] hover:grayscale-0 transition-all duration-700">
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
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

