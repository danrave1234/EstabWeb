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
          <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-10">
            {title}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {items.map((partner, index) => (
            <div key={index} className="relative h-12 w-32 filter grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center">
              {partner.logoUrl ? (
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              ) : partner.icon ? (
                <div className="w-8 h-8 text-muted-foreground opacity-50">
                  <DynamicIcon name={partner.icon} className="w-full h-full" />
                </div>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
