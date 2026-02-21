"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import TrustSignals from "@/components/shared/TrustSignals";

export type HeroChiropractorProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundVideoUrl?: string;
  backgroundImage?: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  benefitText?: string;
  benefitIcon?: string;
  benefitImageUrl?: string;
  secondaryCTAIcon?: string;
  secondaryCTAImageUrl?: string;
  trustSignals?: string[];
};

export default function HeroChiropractor({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundVideoUrl,
  backgroundImage,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#reviews",
  benefitText = "Natural Pain Relief",
  benefitIcon,
  benefitImageUrl,
  secondaryCTAIcon = "Star",
  secondaryCTAImageUrl,
  trustSignals,
}: HeroChiropractorProps) {
  const hasVideo = backgroundVideoUrl?.startsWith("http");
  const hasImage = backgroundImage?.startsWith("http");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background reveal">
      {/* Background: video or image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {hasVideo ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            >
              <source src={backgroundVideoUrl} type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-[1]"
              aria-hidden
            />
          </>
        ) : hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backgroundImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 lg:to-transparent z-[1]"
              aria-hidden
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" aria-hidden />
        )}
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 z-0" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 sm:py-20 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-8 border border-primary/20 reveal">
            {benefitImageUrl ? (
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                <img src={benefitImageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
            {benefitText}
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6 reveal">
            {title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10 reveal">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 reveal">
            <a
              href={primaryCTAHref}
              className="inline-flex items-center justify-center min-h-[56px] px-4 sm:px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20 text-[10px] sm:text-base text-center"
            >
              {primaryCTA}
            </a>
            <a
              href={secondaryCTAHref}
              className="inline-flex items-center justify-center min-h-[56px] gap-1.5 sm:gap-2 px-4 sm:px-8 py-4 bg-background/50 backdrop-blur-md text-foreground font-bold rounded-full border border-border hover:bg-background transition-all text-[10px] sm:text-base text-center"
            >
              {secondaryCTAImageUrl ? (
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                  <img src={secondaryCTAImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <DynamicIcon name={secondaryCTAIcon} className="w-3 h-3 sm:w-5 sm:h-5 fill-primary text-primary shrink-0" strokeWidth={0} />
              )}
              {secondaryCTA}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
