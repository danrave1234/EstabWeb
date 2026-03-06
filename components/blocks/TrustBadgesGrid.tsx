"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type TrustBadge = {
  label: string;
  sublabel?: string;
  icon: string;
  imageUrl?: string;
};

export type TrustBadgesGridProps = {
  title?: string;
  subtitle?: string;
  items: TrustBadge[];
};

export default function TrustBadgesGrid({ title, subtitle, items }: TrustBadgesGridProps) {
  return (
    <section className="py-12 sm:py-16 bg-muted/10 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-16 sm:mb-24 reveal">
            {title && (
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${dynamicGridCols(items.length, 5)} gap-6 sm:gap-10`}>
          {items.map((item, index) => {
            const hasImage = Boolean(item.imageUrl);
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center p-8 sm:p-10 bg-background rounded-[2.5rem] border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`${hasImage ? "w-16 h-16 sm:w-24 sm:h-24" : "w-12 h-12 sm:w-20 sm:h-20"} bg-primary/5 rounded-2xl overflow-hidden flex items-center justify-center mb-6 s:mb-8 group-hover:bg-primary/10 transition-all duration-500 text-primary relative z-10 p-4`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.label} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <DynamicIcon
                      name={item.icon}
                      className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                    />
                  )}
                </div>
                <h3 className="font-serif text-base sm:text-xl font-black text-foreground mb-2 relative z-10 tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                {item.sublabel && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60 relative z-10">
                    {item.sublabel}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

