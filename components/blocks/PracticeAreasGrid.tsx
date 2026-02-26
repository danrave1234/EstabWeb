"use client";

import { ChevronRight } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackEvent } from "@/components/shared/Analytics";

export type PracticeAreaItem = {
  title: string;
  description: string;
  icon: string;
  href?: string;
  imageUrl?: string;
};

export type PracticeAreasGridProps = {
  title?: string;
  subtitle?: string;
  items: PracticeAreaItem[];
  linkText?: string;
};

function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, T>;
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => obj[k]);
  }
  return [];
}

export default function PracticeAreasGrid({
  title = "Practice Areas",
  subtitle,
  items: rawItems,
  linkText = "Learn More",
}: PracticeAreasGridProps) {
  const items = ensureArray<PracticeAreaItem>(rawItems);
  return (
    <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
          {items.map((item, index) => {
            const href = item.href ?? "#";
            const hasImage = Boolean(item.imageUrl);
            return (
              <article
                key={index}
                className="bg-background border border-border rounded-lg p-3 sm:p-8 flex flex-col shadow-sm"
              >
                <div className="mb-3 sm:mb-6">
                  <div className={`${hasImage ? "w-12 h-12 sm:w-20 sm:h-20" : "w-8 h-8 sm:w-14 sm:h-14"} flex items-center justify-center text-primary border border-primary/20 rounded overflow-hidden bg-primary/5`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={item.icon} className="w-4 h-4 sm:w-7 sm:h-7 shrink-0" strokeWidth={2} />
                    )}
                  </div>
                </div>
                <h3 className="font-serif text-[13px] sm:text-xl font-bold text-foreground mb-1 sm:mb-4 leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-[15px] leading-relaxed flex-grow line-clamp-3 mb-2 sm:mb-6">
                  {item.description}
                </p>
                <a
                  href={href}
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'practice_areas', cta_id: `practice_area_${index}` })}
                  className="text-primary font-medium inline-flex items-center gap-1 text-xs sm:text-sm hover:gap-2 transition-all group"
                >
                  {linkText}
                  <ChevronRight className="w-2.5 h-2.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

