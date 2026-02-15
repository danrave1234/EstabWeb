"use client";

import { StarIcon, QuotesIcon } from "@phosphor-icons/react";
import { SocialIcon } from "@/components/shared/SocialIcon";

export type FacebookReviewEmbedProps = {
  title?: string;
  subtitle?: string;
  reviews?: Array<{
    author: string;
    text: string;
    date: string;
    rating: number;
    avatarUrl?: string;
  }>;
  followUsLabel?: string;
  facebookReviewsLabel?: string;
  footerNoteLabel?: string;
};

export default function FacebookReviewEmbed({
  title = "Highly Rated on Facebook",
  subtitle = "See why our customers love us",
  reviews = [
    { author: "Juan Dela Cruz", text: "Excellent service! Highly recommended for their professional approach and quality work.", date: "2 weeks ago", rating: 5 },
    { author: "Maria Clara", text: "Best in the area. Very accommodating staff and reasonable prices.", date: "1 month ago", rating: 5 },
    { author: "Jose Rizal", text: "Very satisfied with the results. Will definitely book again.", date: "3 months ago", rating: 5 },
  ],
  followUsLabel = "Follow us on",
  facebookReviewsLabel = "Facebook Reviews",
  footerNoteLabel = "Showing real customer reviews from our Facebook Page",
}: FacebookReviewEmbedProps) {
  return (
    <section className="py-16 sm:py-24 bg-muted/10 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 sm:mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground italic">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-[#1877F2] text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <SocialIcon brand="facebook" className="w-6 h-6 text-white" />
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">{followUsLabel}</p>
              <p className="text-sm font-bold">{facebookReviewsLabel}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-background p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-8 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                <QuotesIcon weight="duotone" className="w-12 h-12 text-primary" />
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
<StarIcon
                    key={i}
                    weight={i < review.rating ? "fill" : "regular"}
                    className={`w-4 h-4 ${i < review.rating ? "text-accent" : "text-muted opacity-30"}`}
                  />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-6 italic">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
                  {review.avatarUrl ? (
                    <img src={review.avatarUrl} alt={review.author} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{review.author[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{review.author}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <SocialIcon brand="facebook" className="w-4 h-4 opacity-50" />
            {footerNoteLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
