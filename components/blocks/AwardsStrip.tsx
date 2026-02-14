"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type AwardItem = {
  label: string;
  sublabel?: string;
  icon?: string;
  imageUrl?: string;
};

export type AwardsStripProps = {
  title?: string;
  items: AwardItem[];
};

export default function AwardsStrip({ title, items }: AwardsStripProps) {
  return (
    <section id="credentials" className="w-full bg-muted/20 border-y border-border py-8 sm:py-12 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {title && (
          <p className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 sm:mb-10">
            {title}
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 items-center">
          {items.map((item, index) => {
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-2 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background rounded-full overflow-hidden flex items-center justify-center border border-border shadow-sm group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300 text-primary">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.label} className="w-full h-full object-cover" />
                  ) : (
                    <DynamicIcon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm sm:text-base font-bold text-foreground">
                    {item.label}
                  </p>
                  {item.sublabel && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      {item.sublabel}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
