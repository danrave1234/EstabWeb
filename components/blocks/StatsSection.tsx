"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type StatItem = {
  label: string;
  value: string;
  icon?: string;
  imageUrl?: string;
};

export type StatsSectionProps = {
  title?: string;
  subtitle?: string;
  items: StatItem[];
  variant?: "bar" | "cards";
};

export default function StatsSection({
  title,
  subtitle,
  items = [
    { label: "Happy Clients", value: "500+", icon: "Users" },
    { label: "Years Experience", value: "10+", icon: "Award" },
    { label: "Projects Done", value: "1.2k", icon: "Check" },
    { label: "Support", value: "24/7", icon: "Phone" },
  ],
  variant = "cards",
}: StatsSectionProps) {
  return (
    <section id="stats" className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className={`grid gap-2 sm:gap-8 ${dynamicGridCols(items.length, 4)} ${
          variant === "bar"
            ? "divide-y sm:divide-y-0 sm:divide-x border-y border-border py-4 sm:py-12"
            : ""
        }`}>
          {items.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-3 sm:p-6 ${
              variant === "cards" ? "bg-muted/20 rounded-xl sm:rounded-3xl border border-transparent hover:border-primary/20 transition-all shadow-sm" : ""
            }`}>
              <div className="mb-1 sm:mb-4">
                {stat.imageUrl ? (
                  <div className="w-6 h-6 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                    <img src={stat.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : stat.icon ? (
                  <DynamicIcon name={stat.icon} className="w-4 h-4 sm:w-8 sm:h-8 text-primary" />
                ) : null}
              </div>
              <div className="text-lg sm:text-4xl font-black text-foreground mb-0.5 tracking-tight">
                {stat.value}
              </div>
              <div className="text-[8px] sm:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
