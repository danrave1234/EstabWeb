"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";
import { trackEvent } from "@/components/shared/Analytics";

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
};

export type FeaturesGridProps = {
  title: string;
  subtitle?: string;
  features: FeatureItem[];
};

export default function FeaturesGrid({
  title,
  subtitle,
  features,
}: FeaturesGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="services"
      className={`py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30${mounted ? " reveal" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`grid ${dynamicGridCols(features.length, 3)} gap-3 sm:gap-6`}>
          {features.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-background rounded-xl p-3 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col border border-border/50"
              >
                <div className="mb-2 sm:mb-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-lg overflow-hidden flex items-center justify-center text-primary">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={item.icon} className="w-4 h-4 sm:w-6 sm:h-6 shrink-0" strokeWidth={2} />
                    )}
                  </div>
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-xl text-foreground mb-1 sm:mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-sm flex-grow line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <a
                  href="#contact"
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'services', cta_id: `service_learn_more_${index}` })}
                  className="mt-2 sm:mt-4 text-primary text-[10px] sm:text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 group"
                >
                  Learn more
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" strokeWidth={2} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
