"use client";

import Image from "next/image";
import { MapPinIcon, BedIcon, BathtubIcon, SquareIcon } from "@phosphor-icons/react";
import DynamicIcon from "@/components/shared/DynamicIcon";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((property, index) => (
            <div 
              key={index} 
              className="group bg-background rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 w-full bg-muted flex items-center justify-center overflow-hidden">
                {property.imageUrl ? (
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : property.icon ? (
                  <div className="w-16 h-16 text-primary opacity-20">
                    <DynamicIcon name={property.icon} className="w-full h-full" />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs">No image</div>
                )}
                {property.tag && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {property.tag}
                  </div>
                )}
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPinIcon weight="duotone" className="w-3 h-3" />
                    <span className="text-xs font-medium uppercase tracking-wider">{property.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                </div>

                {(property.beds !== 0 || property.baths !== 0 || property.sqm !== 0) && (
                  <div className="flex items-center justify-between py-4 border-y border-border/50">
                    <div className="flex items-center gap-1.5">
                      <BedIcon weight="duotone" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BathtubIcon weight="duotone" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SquareIcon weight="duotone" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{property.sqm} {sqmLabel}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-2xl font-black text-primary">
                    {property.price.includes("₱") ? property.price : /^[\d,.\s]+$/.test(property.price.replace(/\s/g, "")) ? `₱${property.price}` : property.price}
                  </p>
                  <button className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors underline underline-offset-4">
                    {viewDetailsLabel}
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
