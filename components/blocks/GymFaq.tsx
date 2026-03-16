"use client";

import * as React from "react";
import Reveal from "@/components/shared/Reveal";

type GymFaqItem = {
  question: string;
  answer: string;
};

type GymFaqProps = {
  title?: string;
  subtitle?: string;
  items?: GymFaqItem[];
};

export default function GymFaq({
  title = "Gym FAQs",
  subtitle = "Everything first-time and returning members usually ask before joining.",
  items = [],
}: GymFaqProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <Reveal as="section" id="gym-faq" className="bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <article key={`${item.question}-${idx}`} className="rounded-xl border border-border bg-muted/10">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5 sm:py-4"
                >
                  <span className="text-sm font-bold text-foreground sm:text-base">{item.question}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{isOpen ? "Close" : "Open"}</span>
                </button>
                {isOpen && <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:px-5">{item.answer}</div>}
              </article>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
