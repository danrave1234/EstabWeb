"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type PestItem = {
  name: string;
  icon: string;
  imageUrl?: string;
};

export type CommonPestsGridProps = {
  title?: string;
  subtitle?: string;
  items: PestItem[];
};

export default function CommonPestsGrid({ title, subtitle, items }: CommonPestsGridProps) {
  return (
    <section id="common-pests" className="py-12 sm:py-16 bg-background reveal">
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 sm:p-6 bg-muted/20 rounded-xl sm:rounded-2xl border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-background rounded-full overflow-hidden flex items-center justify-center mb-2 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <DynamicIcon 
                    name={item.icon} 
                    className="w-5 h-5 sm:w-8 sm:h-8 text-primary" 
                  />
                )}
              </div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
