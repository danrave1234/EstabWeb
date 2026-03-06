"use client";

import { Star, Quote } from "lucide-react";

export type Testimonial = {
  quoteTitle: string;
  body: string;
  customerName: string;
  verified: boolean;
};

export type ReviewsGridProps = {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
};

export default function ReviewsGrid({
  title = "Client Success Stories",
  subtitle = "Don't just take our word for it—see what our clients have to say.",
  testimonials = [],
}: ReviewsGridProps) {
  if (!testimonials?.length) return null;

  return (
    <section id="reviews" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-24 reveal">
          <h2 className="text-3xl sm:text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="break-inside-avoid p-8 sm:p-10 rounded-[2.5rem] bg-background border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 group reveal mb-6 sm:mb-10 hover:-translate-y-2"
            >
              <div className="flex gap-1 mb-6 sm:mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary shadow-sm" />
                ))}
              </div>
              <Quote className="hidden sm:block w-12 h-12 text-primary/10 mb-6 group-hover:text-primary/20 transition-all duration-500 transform group-hover:-rotate-12" />
              <h3 className="font-serif text-lg sm:text-2xl font-black text-foreground mb-4 sm:mb-6 leading-tight italic opacity-90 group-hover:opacity-100 transition-opacity">
                "{t.quoteTitle}"
              </h3>
              <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-8 sm:mb-10 font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {t.body}
              </p>
              <div className="flex items-center gap-4 sm:gap-5 pt-8 sm:pt-10 border-t border-border/40">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm sm:text-xl shadow-inner transform group-hover:rotate-3 transition-transform">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-foreground text-sm sm:text-lg tracking-tight">{t.customerName}</p>
                  {t.verified && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-[10px] sm:text-xs text-green-600 font-black uppercase tracking-[0.2em]">
                        Verified Client
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

