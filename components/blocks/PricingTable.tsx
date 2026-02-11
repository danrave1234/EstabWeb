"use client";

import { Check, X } from "lucide-react";

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
};

export default function PricingTable({
  title = "Simple, Transparent Pricing",
  subtitle = "Choose the plan that's right for your business.",
  plans,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                plan.isPopular
                  ? "border-primary bg-primary/5 shadow-xl scale-100 lg:scale-105 z-10"
                  : "border-border bg-background hover:border-primary/30 shadow-sm"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/40 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href ?? "#"}
                className={`w-full py-3 px-6 rounded-xl font-bold text-center transition-all duration-200 min-h-[44px] sm:min-h-[48px] flex items-center justify-center text-sm sm:text-base ${
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
