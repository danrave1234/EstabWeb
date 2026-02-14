import Image from "next/image";
import { Phone } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type HeroEmergencyProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryCTAHref: string;
  secondaryCTA: string;
  secondaryCTAHref: string;
  imageUrl?: string;
  icon?: string;
};

export default function HeroEmergency({
  title,
  subtitle,
  primaryCTA,
  primaryCTAHref,
  secondaryCTA,
  secondaryCTAHref,
  imageUrl,
  icon,
}: HeroEmergencyProps) {
  return (
    <section className="container mx-auto px-4 py-8 md:py-20 lg:py-24 reveal">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-4 sm:space-y-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight order-1 lg:order-none lg:mb-0">
              {title}
            </h1>
            <p className="text-sm sm:text-xl text-muted-foreground font-medium order-2 lg:order-none lg:mb-0">
              {subtitle}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 order-4 lg:order-none">
              <a
                href={primaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] gap-2 px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-lg shadow-lg touch-manipulation"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {primaryCTA}
              </a>
              <a
                href={secondaryCTAHref}
                className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-foreground font-bold rounded-lg border border-primary hover:bg-muted/50 transition-colors text-sm sm:text-lg touch-manipulation"
              >
                {secondaryCTA}
              </a>
            </div>
          </div>
        <div className="lg:col-span-6 order-3 lg:order-none">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-muted flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : icon ? (
              <div className="w-32 h-32 sm:w-48 sm:h-48 text-primary opacity-20">
                <DynamicIcon name={icon} className="w-full h-full" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Image
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
