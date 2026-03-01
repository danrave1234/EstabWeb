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
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30${mounted ? " reveal" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="font-serif text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed opacity-70">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`grid ${dynamicGridCols(features.length, 3)} gap-6 sm:gap-10`}>
          {features.map((item, index) => {
            return (
              <div
                key={index}
                className="group relative bg-background rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] transition-all duration-500 flex flex-col border border-border/40 hover:-translate-y-2 overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="mb-6 sm:mb-10 relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={item.icon} className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" strokeWidth={2.5} />
                    )}
                  </div>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-3xl text-foreground mb-4 sm:mb-6 leading-tight group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-lg flex-grow leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
                <a
                  href="#contact"
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'services', cta_id: `service_learn_more_${index}` })}
                  className="mt-8 sm:mt-12 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary inline-flex items-center gap-2 group/link"
                >
                  <span className="relative">
                    Learn more
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover/link:w-full transition-all duration-300" />
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" strokeWidth={4} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
