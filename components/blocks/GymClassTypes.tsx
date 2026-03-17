"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";

type GymClassType = {
  name: string;
  duration?: string;
  level?: string;
  description?: string;
  icon?: string;
};

type GymClassTypesProps = {
  title?: string;
  subtitle?: string;
  items?: GymClassType[];
};

export default function GymClassTypes({
  title = "Class Types",
  subtitle = "From strength and conditioning to mobility and recovery, pick classes that match your goals.",
  items = [],
}: GymClassTypesProps) {
  return (
    <Reveal as="section" id="class-types" className="border-b border-border bg-muted/10">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <article key={`${item.name}-${idx}`} className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                <DynamicIcon name={item.icon || "Activity"} className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black text-foreground">{item.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {[item.duration, item.level].filter(Boolean).join(" | ")}
              </p>
              {item.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
