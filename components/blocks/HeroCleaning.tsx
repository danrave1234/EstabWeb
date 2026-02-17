import Image from "next/image";
import TrustSignals from "@/components/shared/TrustSignals";

export type HeroCleaningProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  singleImageUrl?: string;
  primaryCTAHref?: string;
  secondaryCTA?: string;
  secondaryCTAHref?: string;
  benefitText?: string;
  trustSignals?: string[];
};

export default function HeroCleaning({
  title,
  subtitle,
  primaryCTA,
  beforeImageUrl,
  afterImageUrl,
  singleImageUrl,
  primaryCTAHref = "#quote",
  secondaryCTA,
  secondaryCTAHref = "#services",
  benefitText = "Sparkling Clean.",
  trustSignals,
}: HeroCleaningProps) {
  const hasSplit = beforeImageUrl && afterImageUrl;
  const imageUrl = singleImageUrl || (hasSplit ? afterImageUrl : null);

  return (
    <section className="relative overflow-hidden bg-background reveal">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" aria-hidden="true" />
      <div className="container mx-auto px-4 py-10 md:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 sm:space-y-10">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="font-sans text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              <span className="text-primary block mb-1 opacity-90 text-sm sm:text-2xl uppercase tracking-widest font-bold">{benefitText}</span>
              {title}
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 w-full max-w-md px-4 sm:px-0">
              <a
                href={primaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[56px] px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-[10px] sm:text-base touch-manipulation text-center"
              >
                {primaryCTA}
              </a>
              {secondaryCTA && (
                <a
                  href={secondaryCTAHref}
                  className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[56px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-primary font-bold rounded-full border-2 border-primary/10 hover:bg-primary/5 transition-colors text-[10px] sm:text-base touch-manipulation text-center"
                >
                  {secondaryCTA}
                </a>
              )}
            </div>

          <div className="w-full relative pt-10">
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] rotate-2 scale-105" />
            <div className="relative">
              {hasSplit ? (
                <div className="grid grid-cols-2 gap-4 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background bg-muted/20">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={beforeImageUrl!}
                      alt="Before cleaning"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 42vw"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Before
                    </div>
                  </div>
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={afterImageUrl!}
                      alt="After cleaning"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 42vw"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary backdrop-blur-md text-primary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                      After
                    </div>
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-background bg-muted/20">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 80vw"
                  />
                </div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
