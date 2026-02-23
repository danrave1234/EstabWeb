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
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {items.map((option, index) => (
            <div 
              key={index} 
              className="bg-background p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group flex flex-col"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary/5 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/10 transition-colors">
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt={option.title} className="w-full h-full object-cover" />
                ) : (
                  <DynamicIcon name={option.icon} className="w-5 h-5 sm:w-7 sm:h-7 text-primary group-hover:scale-110 transition-transform" />
                )}
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1.5 sm:mb-3">{option.title}</h3>
              <p className="text-[10px] sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed flex-grow line-clamp-3 sm:line-clamp-none">
                {option.description}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {option.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-foreground/80 uppercase tracking-tight">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary shrink-0" />
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

