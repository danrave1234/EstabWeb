"use client";

import { ChevronRight } from "lucide-react";
import DynamicIcon from "@/components/shared/DynamicIcon";

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
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
  return (
    <section id="services" className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">{title}</h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-background rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <DynamicIcon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground mb-1.5 sm:mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm flex-grow line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <a
                  href="#contact"
                  className="mt-3 sm:mt-4 text-primary text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 hover:gap-2 transition-all duration-200 group"
                >
                  Learn more
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" strokeWidth={2} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
