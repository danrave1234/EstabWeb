"use client";

import Image from "next/image";
import { PhoneIcon } from "@phosphor-icons/react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackEvent, trackLead } from "@/components/shared/Analytics";

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
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight order-1 lg:order-none lg:mb-0">
            {title}
          </h1>
          <p className="text-sm sm:text-xl text-muted-foreground font-medium order-2 lg:order-none lg:mb-0">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href={primaryCTAHref}
              onClick={() => {
                trackEvent({ type: 'cta_click', section_key: 'hero_emergency', cta_id: 'hero_primary' });
                if (primaryCTAHref.startsWith('tel:')) trackLead('call');
              }}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] gap-2 px-4 sm:px-8 py-2 sm:py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity text-[10px] sm:text-lg shadow-lg touch-manipulation text-center"
            >
              <PhoneIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{primaryCTA}</span>
            </a>
            <a
              href={secondaryCTAHref}
              onClick={() => trackEvent({ type: 'cta_click', section_key: 'hero_emergency', cta_id: 'hero_secondary' })}
              className="inline-flex items-center justify-center min-h-[44px] sm:min-h-[48px] px-4 sm:px-8 py-2 sm:py-4 bg-background text-foreground font-bold rounded-lg border border-primary hover:bg-muted/50 transition-colors text-[10px] sm:text-lg touch-manipulation text-center"
            >
              <span className="truncate">{secondaryCTA}</span>
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
