"use client";

import Image from "next/image";

import DynamicIcon from "@/components/shared/DynamicIcon";

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
    <section className="container mx-auto px-4 py-8 md:py-20 lg:py-24 reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-12 items-center">
          <div className="lg:col-span-12 space-y-4 lg:space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {subtitle}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 w-full sm:w-auto">
              <a
                href={primaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm text-[10px] sm:text-base text-center"
              >
                {primaryCTA}
              </a>
              <a
                href={secondaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-foreground font-semibold rounded-lg border border-primary hover:bg-muted/50 transition-colors text-[10px] sm:text-base text-center"
              >
                {secondaryCTA}
              </a>
            </div>
          </div>
        <div className="lg:col-span-12">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-muted">
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
                  className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-foreground/5 to-transparent pointer-events-none"
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
