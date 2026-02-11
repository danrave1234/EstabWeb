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
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="break-inside-avoid p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-xl transition-all duration-300 group reveal"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-primary/10 mb-4 group-hover:text-primary/20 transition-colors" />
              <h3 className="text-lg font-bold text-foreground mb-3 leading-tight italic">
                "{t.quoteTitle}"
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {t.body}
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.customerName}</p>
                  {t.verified && (
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
                      Verified Client
                    </p>
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
