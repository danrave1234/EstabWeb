"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { trackEvent } from "@/components/shared/Analytics";

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQAccordionProps = {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
};

export default function FAQAccordion({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about our services.",
  items = [
    { question: "How do I get started?", answer: "Simply click the contact button and fill out the form." },
    { question: "What are your operating hours?", answer: "We are open Monday to Friday, 9am to 6pm." },
    { question: "Do you offer emergency services?", answer: "Yes, we have a 24/7 emergency response team available." },
  ],
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq-accordion" className="py-16 sm:py-24 bg-background reveal">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight uppercase underline decoration-primary/30 decoration-8 underline-offset-8">
            {title}
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground font-medium opacity-70 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={`group border border-border/40 rounded-[2rem] overflow-hidden transition-all duration-500 ${openIndex === i ? "bg-muted/30 shadow-[0_32px_64px_-16px_rgba(var(--primary-rgb),0.1)] border-primary/20" : "bg-background hover:border-primary/20"
                }`}
            >
              <button
                onClick={() => {
                  setOpenIndex(openIndex === i ? null : i);
                  trackEvent({ type: 'cta_click', section_key: 'faq', cta_id: `faq_item_${i}` });
                }}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className={`text-xs font-black uppercase tracking-widest ${openIndex === i ? "text-primary" : "text-muted-foreground/30"}`}>
                    0{i + 1}
                  </span>
                  <span className="font-serif text-base sm:text-xl font-black text-foreground pr-8 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === i ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                  }`}>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
              <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="p-6 sm:p-8 pt-0 text-muted-foreground text-sm sm:text-lg leading-relaxed font-medium opacity-80 pl-[calc(1.5rem+40px)] sm:pl-[calc(2rem+56px)]">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
