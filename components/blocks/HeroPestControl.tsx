"use client";

import TrustSignals from "@/components/shared/TrustSignals";

export type HeroPestControlProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  backgroundImage?: string;
  benefitText?: string;
  benefitIcon?: string;
  benefitImageUrl?: string;
  trustSignals?: string[];
};

export default function HeroPestControl({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  primaryCTAHref = "#estimate",
  secondaryCTAHref = "#bundles",
  backgroundImage,
  benefitText = "Rapid Response Team",
  benefitIcon,
  benefitImageUrl,
  trustSignals,
}: HeroPestControlProps) {
  return (
    <section className="relative overflow-hidden bg-background border-b border-border reveal">
      {/* Decorative pattern or gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--primary)/10,transparent)] z-0" aria-hidden="true" />
      
      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-20 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-primary/20 reveal">
              {benefitImageUrl ? (
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  <img src={benefitImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : null}
              {benefitText}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] reveal">
              {title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed reveal">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center lg:justify-start reveal">
              <a
                href={primaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-10 py-2 sm:py-4 bg-primary text-primary-foreground font-black rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[4px_4px_0px_0px_rgba(var(--primary-rgb),0.2)] text-[10px] sm:text-base uppercase tracking-tight text-center"
              >
                {primaryCTA}
              </a>
              <a
                href={secondaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[52px] px-4 sm:px-10 py-2 sm:py-4 bg-background text-foreground font-bold rounded-sm border border-border hover:bg-muted/50 transition-all text-[10px] sm:text-base uppercase tracking-tight text-center"
              >
                {secondaryCTA}
              </a>
            </div>
          </div>
          
          {backgroundImage && backgroundImage.startsWith("http") && (
            <div className="lg:col-span-6 relative group reveal">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={backgroundImage}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
