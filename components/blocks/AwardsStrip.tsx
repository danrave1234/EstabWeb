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
          <div className="flex flex-col items-center mb-12 sm:mb-20">
            <p className="text-[10px] sm:text-base font-black uppercase tracking-[0.4em] text-primary/60 text-center">
              {title}
            </p>
            <div className="h-1 w-12 bg-primary/20 mt-4 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-20 items-center">
          {safeItems.map((item, index) => {
            const label = (item as AwardItem).label ?? ""
            const sublabel = (item as AwardItem).sublabel
            const icon = (item as AwardItem).icon ?? "Award"
            const imageUrl = (item as AwardItem).imageUrl
            const hasImage = Boolean(imageUrl)

            return (
              <div key={index} className="flex flex-col items-center text-center group max-w-[150px] sm:max-w-[220px]">
                <div className="relative mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-background rounded-2xl overflow-hidden flex items-center justify-center border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_-8px_rgba(var(--primary-rgb),0.2)] group-hover:border-primary/20 transition-all duration-500 group-hover:-translate-y-1 relative z-10 p-2`}>
                    {hasImage ? (
                      <img src={imageUrl} alt={label} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <DynamicIcon name={icon} className="w-8 h-8 sm:w-10 sm:h-10 text-primary transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-lg font-black text-foreground group-hover:text-primary transition-colors tracking-tight leading-tight">
                    {label}
                  </p>
                  {sublabel && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] font-black opacity-60">
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

