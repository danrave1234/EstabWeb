"use client";

import { useEffect, useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type AwardItem = {
  label: string;
  sublabel?: string;
  icon?: string;
  imageUrl?: string;
};

export type AwardsStripProps = {
  title?: string;
  items: AwardItem[];
};

export default function AwardsStrip({ title, items }: AwardsStripProps) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item != null && typeof item === "object") : []
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <section
      id="credentials"
      className={`w-full bg-muted/20 border-y border-border py-8 sm:py-12${mounted ? " reveal" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {title && (
          <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 sm:mb-10">
            {title}
          </p>
        )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12 items-center">
            {safeItems.map((item, index) => {
              const label = (item as AwardItem).label ?? ""
              const sublabel = (item as AwardItem).sublabel
              const icon = (item as AwardItem).icon ?? "Award"
              const imageUrl = (item as AwardItem).imageUrl
              const hasImage = Boolean(imageUrl)
              const containerClass = hasImage
                ? "w-16 h-16 sm:w-20 sm:h-20 rounded-xl"
                : "w-8 h-8 sm:w-12 sm:h-12 rounded-full"
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-1 sm:space-y-2 group">
                  <div className={`${containerClass} bg-background overflow-hidden flex items-center justify-center border border-border shadow-sm group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300 text-primary`}>
                    {hasImage ? (
                      <img src={imageUrl} alt={label} className="w-full h-full object-contain" />
                    ) : (
                      <DynamicIcon name={icon} className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] sm:text-base font-bold text-foreground line-clamp-1">
                      {label}
                    </p>
                    {sublabel && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium line-clamp-1">
                        {sublabel}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </section>
  );
}

