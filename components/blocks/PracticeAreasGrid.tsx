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
          <div className="text-center mb-16 sm:mb-24">
            {title && (
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {items.map((item, index) => {
            const href = item.href ?? "#";
            const hasImage = Boolean(item.imageUrl);
            return (
              <article
                key={index}
                className="group relative bg-background border border-border/40 rounded-[2.5rem] p-8 sm:p-12 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="mb-6 sm:mb-10">
                  <div className={`${hasImage ? "w-16 h-16 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-20 sm:h-20"} flex items-center justify-center bg-primary/10 rounded-2xl overflow-hidden group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-primary/5`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={item.icon} className="w-8 h-8 sm:w-12 sm:h-12" />
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-lg text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-8 sm:mb-10 leading-relaxed flex-grow">
                  {item.description}
                </p>

                <a
                  href={href}
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'practice_areas', cta_id: `practice_area_${index}` })}
                  className="inline-flex items-center gap-3 text-xs sm:text-sm font-black text-primary group/link uppercase tracking-[0.2em]"
                >
                  {linkText}
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-2 transition-transform" />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

