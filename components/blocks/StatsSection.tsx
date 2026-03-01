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

        <div className={`grid gap-2 sm:gap-8 ${dynamicGridCols(items.length, 4)} ${variant === "bar"
            ? "divide-y sm:divide-y-0 sm:divide-x border-y border-border py-4 sm:py-12"
            : ""
          }`}>
          {items.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-6 sm:p-10 ${variant === "cards"
                ? "bg-background rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.1)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2"
                : "relative"
              }`}>
              <div className="mb-4 sm:mb-6">
                {stat.imageUrl ? (
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-xl">
                    <img src={stat.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : stat.icon ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transform group-hover:rotate-3 transition-transform">
                    <DynamicIcon name={stat.icon} className="w-6 h-6 sm:w-10 sm:h-10" />
                  </div>
                ) : null}
              </div>
              <div className="text-3xl sm:text-6xl font-black text-foreground mb-1 sm:mb-2 tracking-tighter leading-none">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

