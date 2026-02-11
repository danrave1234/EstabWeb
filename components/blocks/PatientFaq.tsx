"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

export type PatientFaqProps = {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
};

export default function PatientFaq({
  title = "Patient FAQ",
  subtitle,
  items,
}: PatientFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items?.length) return null;

  return (
    <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-2xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-10 sm:mb-12">
            {title && (
              <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{subtitle}</p>
            )}
          </div>
        )}
        <div className="border-t border-border">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-border"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full min-h-[44px] flex items-center justify-between gap-4 py-4 sm:py-5 text-left touch-manipulation"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-foreground text-sm sm:text-[15px] leading-snug">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200">
                    {isOpen ? (
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden />
                    ) : (
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden />
                    )}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 sm:pb-5 pr-2 sm:pr-12">
                      <p className="text-muted-foreground text-xs sm:text-[15px] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
