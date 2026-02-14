"use client";

import Image from "next/image";
import TrustSignals from "@/components/shared/TrustSignals";

export type HeroDentistProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  imageUrl: string;
  cityName?: string;
  primaryCTAHref?: string;
  secondaryCTA?: string;
  secondaryCTAHref?: string;
  benefitText?: string;
  benefitIcon?: string;
  benefitImageUrl?: string;
  trustSignals?: string[];
};

export default function HeroDentist({
  title,
  subtitle,
  primaryCTA,
  imageUrl,
  cityName,
  primaryCTAHref = "#contact",
  secondaryCTA,
  secondaryCTAHref = "#about",
  benefitText = "Accepting New Patients",
  benefitIcon,
  benefitImageUrl,
  trustSignals,
}: HeroDentistProps) {
  const isExternalImage = imageUrl?.startsWith("http");
  const sub = cityName
    ? subtitle.replace(/\s*\[City Name\]\s*/i, ` ${cityName} `).replace(/\s+/g, " ").trim()
    : subtitle.replace(/\[City Name\]/i, "").replace(/\s+/g, " ").trim();

  return (
    <section className="relative bg-background overflow-hidden reveal">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      <div className="container mx-auto px-4 py-10 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          <div className="lg:col-span-7 lg:pr-12 order-2 lg:order-1 relative z-10">
            <div className="bg-background/80 backdrop-blur-xl p-6 sm:p-12 lg:p-16 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-primary/10 border border-border">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 text-primary rounded-full text-[10px] sm:text-sm font-bold mb-4 sm:mb-8 animate-pulse">
                {benefitImageUrl ? (
                  <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                    <img src={benefitImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full" />
                )}
                {benefitText}
              </div>
              <h1 className="font-sans text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-6 sm:mb-10 leading-relaxed">
                {sub}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <a
                  href={primaryCTAHref}
                  className="inline-flex items-center justify-center min-h-[48px] sm:min-h-[56px] px-4 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-bold rounded-xl sm:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 text-sm sm:text-base touch-manipulation"
                >
                  {primaryCTA}
                </a>
                {secondaryCTA && (
                  <a
                    href={secondaryCTAHref}
                    className="inline-flex items-center justify-center min-h-[48px] sm:min-h-[56px] px-4 sm:px-8 py-3 sm:py-4 bg-transparent text-foreground font-semibold rounded-xl sm:rounded-2xl border-2 border-border hover:bg-muted/50 transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    {secondaryCTA}
                  </a>
                )}
              </div>
              {trustSignals && trustSignals.length > 0 && (
                <div className="pt-10 border-t border-border mt-10">
                  <TrustSignals signals={trustSignals} />
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 lg:-ml-20">
            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-background transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              {imageUrl ? (
                isExternalImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  Staff or patient photo
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
