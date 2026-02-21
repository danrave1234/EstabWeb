"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type HeroSaasProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundImage?: string;
  icon?: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
};

export default function HeroSaas({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  icon,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#services",
}: HeroSaasProps) {
  const isExternalImage = backgroundImage?.startsWith("http");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background reveal">
      <div className="container mx-auto px-4 py-10 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground order-1 lg:order-none lg:mb-0 text-center lg:text-left leading-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-muted-foreground order-2 lg:order-none lg:mb-0 text-center lg:text-left max-w-xl lg:max-w-none leading-relaxed">
                {subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start order-4 lg:order-none">
                <a
                  href={primaryCTAHref}
                  className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg touch-manipulation text-[10px] sm:text-base text-center"
                >
                  {primaryCTA}
                </a>
                <a
                  href={secondaryCTAHref}
                  className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-foreground font-bold rounded-lg border border-border hover:bg-muted/50 transition-colors touch-manipulation text-[10px] sm:text-base text-center"
                >
                  {secondaryCTA}
                </a>
              </div>
            </div>
          <div className="lg:col-span-6 order-3 lg:order-none">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border flex items-center justify-center bg-muted">
              {backgroundImage ? (
                isExternalImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={backgroundImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )
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
      </div>
    </section>
  );
}
