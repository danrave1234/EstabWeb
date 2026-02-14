"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

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
  return (
    <section id="process" className="py-12 sm:py-20 bg-muted/10 reveal">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform relative z-10">
                    {step.imageUrl ? (
                      <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={step.icon} className="w-8 h-8" />
                    )}
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-black shadow-lg z-20">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
