"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

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
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {items.map((item, index) => {
            const hasImage = Boolean(item.imageUrl);
            return (
              <div 
                key={index} 
                className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-muted/20 hover:border-primary/30 transition-all text-center"
              >
                <div className={`${hasImage ? "w-12 h-12 sm:w-20 sm:h-20" : "w-8 h-8 sm:w-12 sm:h-12"} mx-auto bg-primary/10 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <DynamicIcon name={item.icon} className="w-4 h-4 sm:w-6 h-6 text-primary" />
                  )}
                </div>
                <h3 className="text-xs sm:text-base font-bold text-foreground mb-1">{item.name}</h3>
                <p className="text-xs sm:text-xs text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


