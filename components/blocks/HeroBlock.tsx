"use client";

import Image from "next/image";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackEvent } from "@/components/shared/Analytics";

export type HeroBlockProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundImage?: string;
  icon?: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
};

export default function HeroBlock({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  icon,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#services",
}: HeroBlockProps) {
  const isExternalImage = backgroundImage?.startsWith("http");

  return (
    <section className="relative container mx-auto px-6 py-12 md:py-24 lg:py-32 reveal overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6 lg:space-y-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-left-4 duration-700">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
            <a
              href={primaryCTAHref}
              onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_primary' })}
              className="inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/25 border border-primary/20"
            >
              {primaryCTA}
            </a>
            <a
              href={secondaryCTAHref}
              onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero', cta_id: 'hero_secondary' })}
              className="inline-flex items-center justify-center min-h-[56px] px-10 py-4 bg-background/50 backdrop-blur-sm text-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl border-2 border-border hover:border-primary hover:text-primary transition-all active:scale-95"
            >
              {secondaryCTA}
            </a>
          </div>
        </div>
        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
          <div className="relative aspect-[4/3] lg:aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex items-center justify-center bg-muted transform hover:rotate-1 transition-transform duration-700">
            {backgroundImage ? (
              <>
                {isExternalImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backgroundImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={backgroundImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
                  aria-hidden
                />
              </>
            ) : icon ? (
              <div className="w-24 h-24 sm:w-32 sm:h-32 text-primary opacity-20">
                <DynamicIcon name={icon} className="w-full h-full" />
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">Image</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
