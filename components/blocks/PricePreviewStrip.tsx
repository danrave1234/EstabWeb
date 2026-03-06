"use client";

import { trackEvent } from "@/components/shared/Analytics";

export type PriceItem = {
  service: string;
  price: string;
  note?: string;
};

export type PricePreviewStripProps = {
  title?: string;
  items: PriceItem[];
  transparentPricingNote?: string;
  bookNowLabel?: string;
  bookNowUrl?: string;
};

export default function PricePreviewStrip({
  title = "Affordable AC Services",
  items = [
    { service: "AC Cleaning", price: "₱1,500", note: "Starting from" },
    { service: "Check-up/Repair", price: "₱500", note: "Labor only" },
    { service: "Freon Charging", price: "₱1,200", note: "Per unit" },
  ],
  transparentPricingNote = "No hidden charges. Transparent pricing guaranteed.",
  bookNowLabel = "Book Now",
  bookNowUrl = "#contact",
}: PricePreviewStripProps) {
  return (
    <section className="py-12 bg-primary/5 border-y border-primary/10 reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-sm text-muted-foreground italic">{transparentPricingNote}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-center lg:items-start p-4 bg-background rounded-xl border border-border shadow-sm min-w-[160px]">
                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{item.service}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-foreground">{item.price}</span>
                </div>
                {item.note && <span className="text-[10px] text-muted-foreground font-medium">{item.note}</span>}
              </div>
            ))}
          </div>

          <a
            href={bookNowUrl}
            onClick={() => trackEvent({ type: 'cta_click', section_key: 'price_preview', cta_id: 'price_preview_book' })}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-all shadow-lg whitespace-nowrap uppercase tracking-widest text-xs"
          >
            {bookNowLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
