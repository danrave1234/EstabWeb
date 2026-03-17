"use client";

import DynamicIcon from "@/components/shared/DynamicIcon";
import Reveal from "@/components/shared/Reveal";

type GymProgram = {
  name: string;
  tagline?: string;
  schedule?: string;
  coach?: string;
  intensity?: string;
  icon?: string;
};

type GymProgramsProps = {
  title?: string;
  subtitle?: string;
  items?: GymProgram[];
};

export default function GymPrograms({
  title = "Programs Built for Real Progress",
  subtitle = "Choose a track based on your current level, goals, and training style.",
  items = [],
}: GymProgramsProps) {
  return (
    <Reveal as="section" id="programs" className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article key={`${item.name}-${index}`} className="group rounded-2xl border border-border bg-muted/20 p-5 transition hover:-translate-y-1 hover:border-primary/30">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <DynamicIcon name={item.icon || "Dumbbell"} className="h-5 w-5" />
                </div>
                {item.intensity && (
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {item.intensity}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-foreground">{item.name}</h3>
              {item.tagline && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.tagline}</p>}
              <div className="mt-4 grid gap-1 text-xs text-muted-foreground">
                {item.schedule && <p><span className="font-bold text-foreground">Schedule:</span> {item.schedule}</p>}
                {item.coach && <p><span className="font-bold text-foreground">Coach:</span> {item.coach}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
