"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { X } from "lucide-react";

export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonText: string;
  isPopular?: boolean;
  href?: string;
};

export type PricingTableProps = {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  mostPopularLabel?: string;
  startingAtLabel?: string;
  periodLabel?: string;
};

export default function PricingTable({
  title = "Simple, Transparent Pricing",
  subtitle = "Simply create a project and apply a subscription to it.",
  plans,
  mostPopularLabel = "Most Popular",
  startingAtLabel = "Starting at",
  periodLabel = "/package",
}: PricingTableProps) {
  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-12 sm:mb-16">
            {title && (
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-4 sm:p-8 rounded-2xl border transition-all duration-300 ${
                plan.isPopular
                  ? "border-primary bg-primary/5 shadow-xl col-span-2 lg:col-span-1 lg:scale-105 z-10"
                  : "border-border bg-background hover:border-primary/30 shadow-sm col-span-1"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-[8px] sm:text-xs font-bold rounded-full uppercase tracking-widest whitespace-nowrap">
                  {mostPopularLabel}
                </div>
              )}

              <div className="mb-3 sm:mb-8">
                <h3 className="text-xs sm:text-xl font-bold text-foreground mb-0.5 sm:mb-2">{plan.name}</h3>
                <div className="flex flex-col gap-0.5 mb-2">
                  <span className="text-[7px] sm:text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{startingAtLabel}</span>
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className="text-base sm:text-4xl font-bold text-foreground">{plan.price.includes("₱") || plan.price.toLowerCase().includes("php") ? plan.price : `₱${plan.price}`}</span>
                    <span className="text-muted-foreground text-[8px] sm:text-sm">{periodLabel}</span>
                  </div>
                </div>
                <p className="text-[9px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-1.5 sm:space-y-4 mb-4 sm:mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-1 sm:gap-3">
                    {feature.included ? (
                      <CheckCircleIcon weight="duotone" className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-[9px] sm:text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"} line-clamp-1 sm:line-clamp-none`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href ?? "#"}
                className={`w-full py-1.5 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl font-bold text-center transition-all duration-200 min-h-[32px] sm:min-h-[48px] flex items-center justify-center text-[9px] sm:text-base ${
                  plan.isPopular
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
