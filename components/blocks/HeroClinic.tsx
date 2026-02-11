"use client";

import TrustSignals from "@/components/shared/TrustSignals";

export type HeroClinicProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  trustSignals?: string[];
};

export default function HeroClinic({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  primaryCTAHref = "#doctors",
  secondaryCTAHref = "#portal",
  trustSignals,
}: HeroClinicProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 -skew-x-12 translate-x-1/4 z-0" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 z-0" />
      
      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20">
            Professional Healthcare
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            {title}
          </h1>
          <p className="mt-6 text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center">
            <a
              href={primaryCTAHref}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-10 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 text-sm sm:text-base touch-manipulation"
            >
              {primaryCTA}
            </a>
            <a
              href={secondaryCTAHref}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-10 py-3 sm:py-4 bg-background text-foreground font-bold rounded-xl border border-border hover:bg-muted/50 transition-all text-sm sm:text-base touch-manipulation"
            >
              {secondaryCTA}
            </a>
          </div>
          {trustSignals && trustSignals.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/50 w-full max-w-2xl">
              <TrustSignals signals={trustSignals} className="justify-center" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
