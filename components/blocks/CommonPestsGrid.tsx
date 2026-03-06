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
          <div className="text-center mb-16 sm:mb-24">
            {title && (
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-10">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-6 sm:p-10 bg-muted/5 rounded-[2.5rem] border border-border/40 hover:bg-background shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.1)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 cursor-default"
            >
              <div className="w-14 h-14 sm:w-24 sm:h-24 bg-primary/10 rounded-2xl overflow-hidden flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:-rotate-6 transition-all duration-500 shadow-xl shadow-primary/5">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <DynamicIcon
                    name={item.icon}
                    className="w-8 h-8 sm:w-12 sm:h-12"
                  />
                )}
              </div>
              <h3 className="font-serif text-sm sm:text-xl font-black text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
