"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { CheckCircleIcon } from "@phosphor-icons/react";

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
};

export type FeaturesModernProps = {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
};

export default function FeaturesModern({
  title = "Why Work With Us",
  subtitle = "We bring years of experience and dedicated service to every project.",
  features = [],
}: FeaturesModernProps) {
  if (!features?.length) return null;

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden reveal">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 reveal">
            <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
              {subtitle}
            </p>
            <div className="space-y-4">
              {features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircleIcon weight="duotone" className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 reveal">
            {features.map((feature, index) => {
              const isLarge = index === 0 || index === 3;
              return (
                <div
                  key={index}
                  className={`p-3 sm:p-8 rounded-2xl sm:rounded-3xl border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    index === 1 ? "bg-primary text-primary-foreground" : "bg-muted/30"
                  } ${isLarge ? "col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center" : "col-span-1"}`}
                >
                  <div className="mb-3 sm:mb-6">
                    <div className="w-6 h-6 sm:w-10 sm:h-10 overflow-hidden flex items-center justify-center">
                      {feature.imageUrl ? (
                        <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-contain" />
                      ) : (
                        <DynamicIcon name={feature.icon} className={`w-full h-full ${index === 1 ? "text-primary-foreground" : "text-primary"}`} />
                      )}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-xl font-bold mb-1 sm:mb-3 leading-tight">{feature.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none ${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

