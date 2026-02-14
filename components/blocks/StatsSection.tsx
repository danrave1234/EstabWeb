"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

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

        <div className={`grid gap-8 ${
          variant === "bar" 
            ? "grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-y border-border py-12" 
            : "grid-cols-2 lg:grid-cols-4"
        }`}>
          {items.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center text-center p-6 ${
              variant === "cards" ? "bg-muted/20 rounded-3xl border border-transparent hover:border-primary/20 transition-all shadow-sm" : ""
            }`}>
              <div className="mb-4">
                {stat.imageUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={stat.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : stat.icon ? (
                  <DynamicIcon name={stat.icon} className="w-8 h-8 text-primary" />
                ) : null}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-foreground mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
