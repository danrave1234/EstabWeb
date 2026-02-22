"use client";

import { useEffect, useState } from "react";
import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type ProcessStep = {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
};

export type TreatmentProcessTimelineProps = {
  title?: string;
  subtitle?: string;
  steps: ProcessStep[];
};

export default function TreatmentProcessTimeline({ title, subtitle, steps }: TreatmentProcessTimelineProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="process" className={`py-12 sm:py-20 bg-muted/10${isMounted ? " reveal" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 -translate-y-1/2 z-0" />
          
          <div className={`grid ${dynamicGridCols(steps.length, 4)} gap-4 sm:gap-12 relative z-10`}>
            {steps.map((step, index) => {
              const hasImage = Boolean(step.imageUrl);
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="relative">
                    <div className={`${hasImage ? "w-12 h-12 sm:w-20 sm:h-20" : "w-10 h-10 sm:w-16 sm:h-16"} bg-primary text-primary-foreground rounded-full overflow-hidden flex items-center justify-center mb-3 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform relative z-10`}>
                      {step.imageUrl ? (
                        <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                      ) : (
                        <DynamicIcon name={step.icon} className="w-5 h-5 sm:w-8 sm:h-8" />
                      )}
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-8 sm:h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shadow-lg z-20">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 sm:mb-3">{step.title}</h3>
                  <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {step.description}
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
