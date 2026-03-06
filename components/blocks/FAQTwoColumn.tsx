"use client";

import { QuestionIcon } from "@phosphor-icons/react";
import { trackEvent } from "@/components/shared/Analytics";

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQTwoColumnProps = {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
};

export default function FAQTwoColumn({
  title = "Common Questions",
  subtitle = "Everything you need to know about our services and process.",
  items = [],
}: FAQTwoColumnProps) {
  if (!items?.length) return null;

  return (
    <section id="faq" className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 reveal">
            <div className="sticky top-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <QuestionIcon weight="duotone" className="w-3 h-3" /> Support
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
                {title || "Frequently Asked Questions"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-4">Still have questions?</p>
                <a 
                  href="#contact" 
                  onClick={() => trackEvent({ type: 'cta_click', section_key: 'faq', cta_id: 'faq_contact_click' })}
                  className="text-primary font-bold hover:underline"
                >
                  Contact our support team &rarr;
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 sm:gap-x-12 sm:gap-y-16 reveal">
            {items.map((item, index) => (
              <div key={index} className="space-y-2 sm:space-y-4">
                <h3 className="text-sm sm:text-lg font-bold text-foreground leading-tight">
                  {item.question}
                </h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
