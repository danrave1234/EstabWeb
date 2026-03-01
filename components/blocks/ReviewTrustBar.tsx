"use client";

import { StarIcon, SealCheckIcon } from "@phosphor-icons/react";
import { dynamicGridCols } from "@/lib/utils/grid-cols";

export type ReviewItem = {
  quoteTitle: string;
  body: string;
  customerName: string;
  verified?: boolean;
};

export type ReviewTrustBarProps = {
  rating?: number;
  ratingLabel?: string;
  sourceLabel?: string;
  sourceLogoUrl?: string;
  testimonials: ReviewItem[];
  verifiedLabel?: string;
};

export default function ReviewTrustBar({
  rating = 5,
  ratingLabel = "Rated 5.0",
  sourceLabel = "Google & Yelp",
  sourceLogoUrl,
  testimonials,
  verifiedLabel = "Verified",
}: ReviewTrustBarProps) {
  return (
    <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-16 sm:mb-24 reveal">
          <div className="flex gap-2 mb-6 sm:mb-8">
            {[...Array(rating)].map((_, i) => (
              <StarIcon
                key={i}
                weight="fill"
                className="w-10 h-10 sm:w-16 sm:h-16 text-primary shadow-2xl"
                aria-hidden
              />
            ))}
          </div>
          <h2 className="font-serif font-black text-foreground text-3xl sm:text-6xl md:text-7xl uppercase tracking-tighter leading-tight mb-2">
            {ratingLabel}
          </h2>
          {sourceLabel && !sourceLogoUrl && (
            <p className="text-muted-foreground text-sm sm:text-lg font-black uppercase tracking-[0.4em] opacity-60">
              {sourceLabel}
            </p>
          )}
          {sourceLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sourceLogoUrl}
              alt=""
              className="h-10 sm:h-14 w-auto object-contain opacity-70 mt-4 grayscale hover:grayscale-0 transition-all duration-500"
            />
          )}
        </div>
        <div className={`grid ${dynamicGridCols(testimonials.length, 3)} gap-6 sm:gap-10 items-start`}>
          {testimonials.slice(0, 3).map((review, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-[2.5rem] p-8 sm:p-10 border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.15)] hover:border-primary/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="font-serif font-black text-foreground text-lg sm:text-2xl mb-4 sm:mb-6 leading-tight group-hover:text-primary transition-colors relative z-10">
                &ldquo;{review.quoteTitle}&rdquo;
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-grow mb-6 sm:mb-8 opacity-70 group-hover:opacity-100 transition-opacity font-medium italic relative z-10">
                {review.body}
              </p>
              <div className="flex items-center gap-3 flex-wrap relative z-10">
                <span className="font-serif font-black text-foreground text-xs sm:text-base uppercase tracking-tight">
                  {review.customerName}
                </span>
                {review.verified !== false && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-primary font-black uppercase tracking-[0.1em] bg-primary/5 px-3 py-1 rounded-full">
                    <SealCheckIcon weight="bold" className="w-3.5 h-3.5" />
                    {verifiedLabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
