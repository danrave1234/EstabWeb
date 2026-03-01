"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

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
          <div className="text-center mb-16 sm:mb-24">
            {title && (
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={`grid ${dynamicGridCols(stepList.length, 3)} gap-4 sm:gap-12`}>
          {stepList.map((step, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group relative p-6 sm:p-10 rounded-[2rem] bg-background shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 border border-border/40"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-base sm:text-3xl font-black mb-6 sm:mb-8 shadow-2xl shadow-primary/30 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  {step.number}
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className={`${step.imageUrl ? "w-14 h-14 sm:w-24 sm:h-24" : "w-10 h-10 sm:w-16 sm:h-16"} bg-primary/10 rounded-2xl overflow-hidden mx-auto flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:-rotate-3`}>
                    {step.imageUrl ? (
                      <img src={step.imageUrl} alt={step.title} className="w-full h-full object-cover" />
                    ) : (
                      <DynamicIcon name={step.icon} className="w-6 h-6 sm:w-10 sm:h-10 shrink-0" />
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 sm:mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300">
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
