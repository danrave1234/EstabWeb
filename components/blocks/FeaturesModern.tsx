"use client";

import { Check } from "lucide-react";
import * as Icons from "lucide-react";

export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
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
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
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
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal">
            {features.map((feature, index) => {
              const IconComponent = (Icons as any)[feature.icon] || Icons.Shield;
              return (
                <div
                  key={index}
                  className={`p-8 rounded-3xl border border-border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    index === 1 ? "bg-primary text-primary-foreground sm:mt-8" : "bg-muted/30"
                  }`}
                >
                  <IconComponent className={`w-10 h-10 mb-6 ${index === 1 ? "text-primary-foreground" : "text-primary"}`} />
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={`text-sm leading-relaxed ${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
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
