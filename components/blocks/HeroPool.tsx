"use client";

import Image from "next/image";
import TrustSignals from "@/components/shared/TrustSignals";

export type HeroPoolProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  backgroundImage?: string;
  primaryCTAHref?: string;
  secondaryCTA?: string;
  secondaryCTAHref?: string;
  trustSignals?: string[];
};

export default function HeroPool({
  title,
  subtitle,
  primaryCTA,
  backgroundImage,
  primaryCTAHref = "#inspection",
  secondaryCTA,
  secondaryCTAHref = "#services",
  trustSignals,
}: HeroPoolProps) {
  const hasImage = backgroundImage?.startsWith("http");
  const isExternal = (url: string) => url?.startsWith("http");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background: Image with deep overlay */}
      <div className="absolute inset-0 z-0">
        {hasImage ? (
          <>
            {isExternal(backgroundImage!) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={backgroundImage!}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 lg:to-transparent z-[1]"
              aria-hidden
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" aria-hidden />
        )}
      </div>

      {/* Wave decorative element */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[5] pointer-events-none">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[40px] sm:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-background/20"
          />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-20 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20 reveal">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Pool & Spa Services
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6 reveal">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10 reveal">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 reveal">
            <a
              href={primaryCTAHref}
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20 text-sm sm:text-base"
            >
              {primaryCTA}
            </a>
            {secondaryCTA && (
              <a
                href={secondaryCTAHref}
                className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-background/50 backdrop-blur-md text-foreground font-bold rounded-full border border-border hover:bg-background transition-all text-sm sm:text-base"
              >
                {secondaryCTA}
              </a>
            )}
          </div>
          {trustSignals && trustSignals.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/50 reveal">
              <TrustSignals signals={trustSignals} variant="light" className="justify-start" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
