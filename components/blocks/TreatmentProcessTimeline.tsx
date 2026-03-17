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
          <div className="text-center mb-20 sm:mb-32">
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

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 -translate-y-1/2 z-0" />

          <div className={`grid ${dynamicGridCols(steps.length, 4)} gap-8 sm:gap-16 relative z-10`}>
            {steps.map((step, index) => {
              const hasImage = Boolean(step.imageUrl);
              return (
                <div key={index} className="flex flex-col items-center text-center group relative">
                  {/* Vertical line for mobile */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute top-[100%] left-1/2 w-0.5 h-8 bg-primary/20 -translate-x-1/2" />
                  )}

                  <div className="relative mb-8 sm:mb-12">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`${hasImage ? "w-16 h-16 sm:w-24 sm:h-24" : "w-14 h-14 sm:w-20 sm:h-20"} bg-primary text-primary-foreground rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-all duration-500 relative z-10 border-4 border-background`}>
                      {step.imageUrl ? (
                        <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                      ) : (
                        <DynamicIcon name={step.icon} className="w-6 h-6 sm:w-10 sm:h-10" />
                      )}
                    </div>
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xs sm:text-lg font-black shadow-2xl z-20 transform -rotate-12 border-4 border-background">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed max-w-[200px] sm:max-w-xs">
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
