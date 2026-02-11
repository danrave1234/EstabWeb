"use client";

import { Star, BadgeCheck } from "lucide-react";

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
};

export default function ReviewTrustBar({
  rating = 5,
  ratingLabel = "Rated 5.0",
  sourceLabel = "Google & Yelp",
  sourceLogoUrl,
  testimonials,
}: ReviewTrustBarProps) {
  return (
    <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="flex gap-0.5 mb-2">
            {[...Array(rating)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 sm:w-10 sm:h-10 fill-primary text-primary"
                aria-hidden
              />
            ))}
          </div>
          <span className="font-bold text-foreground text-sm sm:text-xl">{ratingLabel}</span>
          {sourceLabel && !sourceLogoUrl && (
            <span className="text-muted-foreground text-sm mt-1">
              {sourceLabel}
            </span>
          )}
          {sourceLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sourceLogoUrl}
              alt=""
              className="h-6 w-auto object-contain opacity-70 mt-2"
            />
          )}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
          {testimonials.slice(0, 3).map((review, index) => (
            <div
              key={index}
              className={`bg-muted/50 rounded-xl p-4 sm:p-6 border border-border flex flex-col ${
                index === 2 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <p className="font-semibold text-foreground text-sm sm:text-lg mb-1.5 sm:mb-2 leading-tight">
                &ldquo;{review.quoteTitle}&rdquo;
              </p>
              <p className="text-muted-foreground text-[11px] sm:text-sm leading-relaxed flex-grow mb-3 sm:mb-4">
                {review.body}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-[11px] sm:text-sm">
                  {review.customerName}
                </span>
                {review.verified !== false && (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-primary font-medium">
                    <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Verified
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
