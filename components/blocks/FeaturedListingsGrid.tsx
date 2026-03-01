"use client";

import Image from "next/image";
import { MapPinIcon, BedIcon, BathtubIcon, SquareIcon, CaretRight } from "@phosphor-icons/react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";
import { trackEvent } from "@/components/shared/Analytics";

export type PropertyListing = {
  title: string;
  location: string;
  price: string;
  imageUrl?: string;
  icon?: string;
  beds: number;
  baths: number;
  sqm: number;
  tag?: string;
};

export type FeaturedListingsGridProps = {
  title?: string;
  subtitle?: string;
  items: PropertyListing[];
  viewDetailsLabel?: string;
  sqmLabel?: string;
};

export default function FeaturedListingsGrid({
  title = "Featured Properties",
  subtitle = "Discover the best real estate opportunities in the Philippines.",
  items = [],
  viewDetailsLabel = "View Details",
  sqmLabel = "sqm",
}: FeaturedListingsGridProps) {
  return (
    <section className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className={`grid ${dynamicGridCols(items.length, 3)} gap-4 sm:gap-8`}>
          {items.map((property, index) => (
            <div
              key={index}
              className="group bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-40 sm:h-64 w-full bg-muted flex items-center justify-center overflow-hidden">
                {property.imageUrl ? (
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : property.icon ? (
                  <div className="w-16 h-16 text-primary opacity-20">
                    <DynamicIcon name={property.icon} className="w-full h-full" />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs">No image</div>
                )}
                {property.tag && (
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl border border-white/20 z-10 transition-transform group-hover:scale-110">
                    {property.tag}
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPinIcon weight="duotone" className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="text-xs sm:text-xs font-medium uppercase tracking-wider line-clamp-1">{property.location}</span>
                  </div>
                  <h3 className="text-base sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                    {property.title}
                  </h3>
                </div>

                {(property.beds !== 0 || property.baths !== 0 || property.sqm !== 0) && (
                  <div className="flex items-center justify-between py-2 sm:py-4 border-y border-border/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BedIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-[11px] sm:text-base font-black">{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BathtubIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-[11px] sm:text-base font-black">{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <SquareIcon weight="duotone" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-[11px] sm:text-base font-black truncate">{property.sqm} {sqmLabel}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-4 gap-2 sm:gap-4 border-t border-border/30">
                  <p className="text-xl sm:text-3xl font-black text-primary tracking-tighter">
                    {property.price.includes("₱") ? property.price : /^[\d,.\s]+$/.test(property.price.replace(/\s/g, "")) ? `₱${property.price}` : property.price}
                  </p>
                  <button
                    onClick={() => trackEvent({ type: 'cta_click', section_key: 'listings', cta_id: `listing_${index}_details` })}
                    className="group-hover:translate-x-1 transition-transform text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-foreground hover:text-primary inline-flex items-center gap-2"
                  >
                    {viewDetailsLabel}
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <CaretRight weight="bold" className="w-3 h-3" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

