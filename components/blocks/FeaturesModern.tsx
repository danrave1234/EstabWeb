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
            <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-8 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
              {title}
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground mb-12 leading-relaxed font-medium opacity-70">
              {subtitle}
            </p>
            <div className="space-y-5">
              {features.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover/item:bg-primary transition-all duration-300 shadow-sm shadow-primary/5">
                    <CheckCircleIcon weight="bold" className="w-5 h-5 text-primary group-hover/item:text-primary-foreground transition-colors" />
                  </div>
                  <span className="font-serif text-lg font-black text-foreground tracking-tight group-hover/item:text-primary transition-colors">{f.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 reveal">
            {features.map((feature, index) => {
              const isLarge = index === 0 || index === 3;
              const isAccent = index === 1;
              return (
                <div
                  key={index}
                  className={`group relative p-8 sm:p-12 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${isAccent
                    ? "bg-primary text-primary-foreground shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.5)] border-primary"
                    : "bg-muted/30 border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20"
                    } ${isLarge ? "col-span-2 lg:col-span-1 lg:row-span-2 flex flex-col justify-center" : "col-span-1"}`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="mb-6 sm:mb-10 relative z-10">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500 transform group-hover:rotate-6 ${isAccent ? "bg-white text-primary" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground shadow-sm"
                      }`}>
                      {feature.imageUrl ? (
                        <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-cover" />
                      ) : (
                        <DynamicIcon name={feature.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
                      )}
                    </div>
                  </div>
                  <h3 className={`font-serif text-xl sm:text-2xl font-black mb-3 sm:mb-4 leading-tight relative z-10 ${isAccent ? "text-white" : "text-foreground group-hover:text-primary transition-colors"}`}>{feature.title}</h3>
                  <p className={`text-sm sm:text-base leading-relaxed relative z-10 font-medium ${isAccent ? "text-white/80" : "text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity"}`}>
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

