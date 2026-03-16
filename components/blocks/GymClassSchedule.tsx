"use client";

import Reveal from "@/components/shared/Reveal";

type ScheduleClass = {
  time: string;
  name: string;
  coach?: string;
  studio?: string;
};

type ScheduleDay = {
  day: string;
  classes: ScheduleClass[];
};

type GymClassScheduleProps = {
  title?: string;
  subtitle?: string;
  days?: ScheduleDay[];
};

export default function GymClassSchedule({
  title = "Class Schedule",
  subtitle = "Plan your week with coach-led sessions across strength, conditioning, and recovery.",
  days = [],
}: GymClassScheduleProps) {
  return (
    <Reveal as="section" id="schedule" className="border-b border-border bg-muted/10">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {days.map((day, idx) => (
            <article key={`${day.day}-${idx}`} className="rounded-2xl border border-border bg-background p-4 sm:p-5">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">{day.day}</h3>
              <div className="space-y-2.5">
                {(day.classes || []).map((slot, slotIdx) => (
                  <div key={`${slot.name}-${slotIdx}`} className="rounded-xl border border-border/70 bg-muted/20 p-3">
                    <p className="text-xs font-black uppercase tracking-wider text-foreground">{slot.time}</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{slot.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[slot.coach, slot.studio].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
