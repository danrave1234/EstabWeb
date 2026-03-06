"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type PartnerLogo = {
  name: string;
  logoUrl?: string;
  icon?: string;
};

export type DeveloperPartnersLogosProps = {
  title?: string;
  items: PartnerLogo[];
};

export default function DeveloperPartnersLogos({
  title = "Our Developer Partners",
  items = [],
}: DeveloperPartnersLogosProps) {
  return (
    <section className="py-12 bg-background border-y border-border reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="flex flex-col items-center mb-12 sm:mb-16">
            <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-primary/60 text-center">
              {title}
            </p>
            <div className="h-1 w-12 bg-primary/20 mt-4 rounded-full" />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 px-4 sm:px-12 py-6 sm:py-10 bg-muted/5 rounded-[3rem] border border-border/40">
          {items.map((partner, index) => (
            <div key={index} className="relative h-10 w-28 sm:h-14 sm:w-40 filter grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center opacity-40 hover:opacity-100 transform hover:scale-110">
              {partner.logoUrl ? (
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 160px"
                />
              ) : partner.icon ? (
                <div className="w-8 h-8 sm:w-12 sm:h-12 text-primary transition-colors">
                  <DynamicIcon name={partner.icon} className="w-full h-full" />
                </div>
              ) : (
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-foreground text-center line-clamp-2">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
