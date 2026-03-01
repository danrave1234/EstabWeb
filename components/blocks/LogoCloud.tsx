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
          <div className="flex flex-col items-center mb-16 sm:mb-24">
            <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] text-primary/60 text-center">
              {title}
            </p>
            <div className="h-1 w-12 bg-primary/20 mt-4 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          </div>
        )}

        <div className={
          variant === "grid"
            ? "flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-20 sm:gap-y-16 px-4"
            : "flex flex-wrap items-center justify-center gap-12 sm:gap-20"
        }>
          {items.map((logo, i) => (
            <div key={i} className="relative h-8 sm:h-12 w-28 sm:w-40 filter grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center opacity-40 hover:opacity-100 transform hover:scale-110">
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 112px, 160px"
                />
              ) : logo.icon ? (
                <div className="w-8 h-8 sm:w-12 sm:h-12 text-primary">
                  <DynamicIcon name={logo.icon} className="w-full h-full" />
                </div>
              ) : (
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-foreground text-center line-clamp-2">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
