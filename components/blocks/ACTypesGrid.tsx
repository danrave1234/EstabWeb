"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { trackEvent } from "@/components/shared/Analytics";

export type ACType = {
  name: string;
  icon: string;
  description: string;
  imageUrl?: string;
};

export type ACTypesGridProps = {
  title?: string;
  subtitle?: string;
  items: ACType[];
};

export default function ACTypesGrid({
  title = "AC Types We Service",
  subtitle = "Professional expertise for all air conditioning units in the Philippines.",
  items = [
    { name: "Split-type", icon: "Snowflake", description: "Inverter and non-inverter wall-mounted units." },
    { name: "Window-type", icon: "Layout", description: "Standard and inverter window AC cleaning & repair." },
    { name: "Cassette", icon: "Grid", description: "Ceiling-mounted units for commercial and large spaces." },
    { name: "Central", icon: "Wind", description: "Ducted systems and floor-standing units." },
  ],
}: ACTypesGridProps) {
  return (
    <section className="py-12 sm:py-16 bg-background reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item, index) => {
            const hasImage = Boolean(item.imageUrl);
            return (
              <div
                key={index}
                className="group p-6 sm:p-10 rounded-[2.5rem] border border-border/40 bg-muted/5 hover:bg-background shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.2)] hover:border-primary/20 transition-all duration-500 text-center cursor-pointer hover:-translate-y-2"
                onClick={() => trackEvent({ type: 'cta_click', section_key: 'ac_types', cta_id: `ac_type_${index}` })}
              >
                <div className={`${hasImage ? "w-16 h-16 sm:w-24 sm:h-24" : "w-12 h-12 sm:w-16 sm:h-16"} mx-auto bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-primary/5`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <DynamicIcon name={item.icon} className="w-6 h-6 sm:w-10 sm:h-10" />
                  )}
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-2 sm:mb-4 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


