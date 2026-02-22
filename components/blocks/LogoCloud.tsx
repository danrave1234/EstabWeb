"use client";

import Image from "next/image";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type LogoItem = {
  name: string;
  logoUrl?: string;
  icon?: string;
};

export type LogoCloudProps = {
  title?: string;
  items: LogoItem[];
  variant?: "grid" | "row";
};

export default function LogoCloud({
  title = "Trusted by industry leaders",
  items = [],
  variant = "grid",
}: LogoCloudProps) {
  return (
    <section className="py-12 sm:py-20 bg-background reveal border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {title && (
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">
            {title}
          </p>
        )}
        
        <div className={
          variant === "grid"
            ? `grid ${dynamicGridCols(items.length, 6)} gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500`
            : "flex flex-wrap items-center justify-center gap-12 sm:gap-20 opacity-50"
        }>
          {items.map((logo, i) => (
            <div key={i} className="relative h-8 sm:h-10 w-full max-w-[120px] mx-auto flex items-center justify-center hover:opacity-100 transition-opacity">
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  sizes="120px"
                />
              ) : logo.icon ? (
                <DynamicIcon name={logo.icon} className="w-8 h-8 text-muted-foreground" />
              ) : (
                <span className="font-bold text-muted-foreground text-sm">{logo.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
