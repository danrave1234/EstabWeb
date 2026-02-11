import Image from "next/image";

export type HeroAuthorityProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA: string;
  backgroundImage: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
};

export default function HeroAuthority({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#services",
}: HeroAuthorityProps) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-20 lg:py-24 reveal">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-0 lg:gap-x-16 items-start">
        {/* Text Content Column */}
        <div className="lg:col-span-5 lg:space-y-8 border-l-2 border-primary/70 pl-6 lg:pl-8 flex flex-col relative">
          <h1 className="font-serif text-2xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.1] mb-6 lg:mb-0">
            {title}
          </h1>
          
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
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 lg:pt-4">
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
              alt=""
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent pointer-events-none"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
