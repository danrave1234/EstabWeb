"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";

type GymFacilityItem = {
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
};

type GymFacilityHighlightsProps = {
  title?: string;
  subtitle?: string;
  items?: GymFacilityItem[];
};

export default function GymFacilityHighlights({
  title = "Facility Highlights",
  subtitle = "Train in a clean, purpose-built space equipped for strength, conditioning, and recovery.",
  items = [],
}: GymFacilityHighlightsProps) {
  return (
    <Reveal as="section" id="facility" className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, idx) => (
            <article key={`${item.name}-${idx}`} className="rounded-2xl border border-border bg-muted/10 p-4 sm:p-5">
              <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center text-muted-foreground">
                    <DynamicIcon name={item.icon || "Building2"} className="h-8 w-8" />
                  </div>
                )}
              </div>
              <h3 className="text-base font-black text-foreground">{item.name}</h3>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
