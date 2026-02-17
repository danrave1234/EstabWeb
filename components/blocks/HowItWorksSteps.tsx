"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type StepItem = {
  number: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
};

export type HowItWorksStepsProps = {
  title?: string;
  subtitle?: string;
  steps: StepItem[];
};

const DEFAULT_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Book Online",
    description: "Pick a time that works. We'll confirm within minutes.",
    icon: "Calendar",
  },
  {
    number: "02",
    title: "On-Site Inspection",
    description: "Our technician arrives, diagnoses the issue, and gives you a clear quote.",
    icon: "ClipboardCheck",
  },
  {
    number: "03",
    title: "Fixed & Guaranteed",
    description: "We fix it the same day. Backed by our satisfaction guarantee.",
    icon: "ShieldCheck",
  },
];

export default function HowItWorksSteps({
  title = "How It Works",
  subtitle,
  steps,
}: HowItWorksStepsProps) {
  const stepList = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;
  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 reveal">
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-14">
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-12">
          {stepList.map((step, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center group ${index === 2 && stepList.length === 3 ? "col-span-2 lg:col-span-1" : "col-span-1"}`}
              >
                <div className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-5 shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <div className="mb-2 sm:mb-3">
                  <div className={`${step.imageUrl ? "w-12 h-12 sm:w-20 sm:h-20" : "w-8 h-8 sm:w-12 sm:h-12"} overflow-hidden mx-auto flex items-center justify-center`}>
                    {step.imageUrl ? (
                      <img src={step.imageUrl} alt={step.title} className="w-full h-full object-contain" />
                    ) : (
                      <DynamicIcon name={step.icon} className="w-5 h-5 sm:w-8 sm:h-8 text-primary mx-auto" />
                    )}
                  </div>
                </div>
                <h3 className="text-xs sm:text-base lg:text-xl font-bold text-foreground mb-1 sm:mb-2 leading-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-[10px] sm:text-sm leading-relaxed max-w-[140px] sm:max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
