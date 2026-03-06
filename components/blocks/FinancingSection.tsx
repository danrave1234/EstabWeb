"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type FinancingOption = {
  title: string;
  description: string;
  icon: string;
  features: string[];
  imageUrl?: string;
};

export type FinancingSectionProps = {
  title?: string;
  subtitle?: string;
  items: FinancingOption[];
};

export default function FinancingSection({
  title = "Flexible Financing Options",
  subtitle = "We help you secure the best payment terms through our accredited partners.",
  items = [],
}: FinancingSectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/20 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
          {items.map((option, index) => (
            <div
              key={index}
              className="group relative bg-background p-8 sm:p-12 rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center mb-8 sm:mb-10 group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-primary/5">
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt={option.title} className="w-full h-full object-cover" />
                ) : (
                  <DynamicIcon name={option.icon} className="w-8 h-8 sm:w-12 sm:h-12" />
                )}
              </div>

              <h3 className="font-serif text-xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                {option.title}
              </h3>

              <p className="text-sm sm:text-lg text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300 mb-8 sm:mb-10 leading-relaxed flex-grow">
                {option.description}
              </p>

              <ul className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-border/40">
                {option.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-black text-foreground/80 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] shrink-0" />
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

