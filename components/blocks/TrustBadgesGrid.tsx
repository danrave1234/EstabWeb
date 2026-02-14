"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

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
          <div className="text-center mb-10 sm:mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/5 rounded-full overflow-hidden flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors text-primary">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover" />
                ) : (
                  <DynamicIcon 
                    name={item.icon} 
                    className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" 
                  />
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">
                {item.label}
              </h3>
              {item.sublabel && (
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {item.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
