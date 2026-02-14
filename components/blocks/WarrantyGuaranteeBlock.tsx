"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";

export type WarrantyGuaranteeBlockProps = {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  icon?: string;
  imageUrl?: string;
};

export default function WarrantyGuaranteeBlock({ 
  title = "30-Day Service Warranty", 
  subtitle = "If pests return within 30 days of treatment, we'll come back and re-treat your home at no extra cost.", 
  badgeText = "Guaranteed Results",
  icon = "ShieldCheck",
  imageUrl,
}: WarrantyGuaranteeBlockProps) {
  return (
    <section className="py-12 sm:py-16 bg-primary reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] border border-white/20">
              {badgeText}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {title}
            </h2>
            <p className="text-lg sm:text-xl text-white/80 font-medium">
              {subtitle}
            </p>
          </div>
          
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-125" />
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl border-8 border-white/10 group overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <DynamicIcon name={icon} className="w-16 h-16 sm:w-24 sm:h-24 group-hover:scale-110 transition-transform duration-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
