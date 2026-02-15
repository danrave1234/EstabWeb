"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";

export type MaintenancePlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
};

export type MaintenancePlansProps = {
  title?: string;
  subtitle?: string;
  plans: MaintenancePlan[];
  signUpNowLabel?: string;
};

export default function MaintenancePlans({
  title = "AC Maintenance Plans",
  subtitle = "Ensure your AC runs efficiently all year round with our scheduled maintenance programs.",
  plans = [
    {
      name: "Semi-Annual",
      price: "₱2,800",
      period: "per year",
      description: "2 professional cleanings per year.",
      features: ["Full system cleaning", "Filter replacement", "Unit inspection", "Priority scheduling"],
    },
    {
      name: "Quarterly",
      price: "₱5,000",
      period: "per year",
      description: "4 professional cleanings per year.",
      isPopular: true,
      features: ["Everything in Semi-Annual", "Freon level check", "Condenser cleaning", "10% off on parts"],
    },
  ],
  signUpNowLabel = "Sign Up Now",
}: MaintenancePlansProps) {
  return (
    <section className="py-12 sm:py-16 bg-muted/30 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col p-4 sm:p-8 rounded-2xl border transition-all ${
                plan.isPopular 
                  ? "border-primary bg-background shadow-xl ring-4 ring-primary/5" 
                  : "border-border bg-background/50"
              }`}
            >
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-3xl font-black text-primary">{plan.price}</span>
                  <span className="text-[10px] sm:text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-[10px] sm:text-sm text-muted-foreground mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-none">{plan.description}</p>
              </div>
              
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-sm">
                    <CheckCircleIcon weight="duotone" className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-1 sm:line-clamp-none">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact" 
                className={`w-full py-2.5 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-center transition-all text-xs sm:text-base ${
                  plan.isPopular 
                    ? "bg-primary text-primary-foreground hover:opacity-90" 
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {signUpNowLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
