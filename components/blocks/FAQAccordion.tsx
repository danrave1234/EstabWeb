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
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div 
              key={i} 
              className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? "bg-muted/30 shadow-lg shadow-primary/5" : "bg-background"
              }`}
            >
              <button
                onClick={() => {
                  setOpenIndex(openIndex === i ? null : i);
                  trackEvent({ type: 'cta_click', section_key: 'faq', cta_id: `faq_item_${i}` });
                }}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-foreground pr-8">{item.question}</span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`} />
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
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
