"use client";

import Reveal from "@/components/shared/Reveal";

type GymTrainer = {
  name: string;
  role: string;
  specialty?: string;
  yearsExperience?: string;
  imageUrl?: string;
};

type GymTrainersProps = {
  title?: string;
  subtitle?: string;
  items?: GymTrainer[];
};

export default function GymTrainers({
  title = "Meet Your Coaches",
  subtitle = "Certified trainers who combine science-backed programming with real-world coaching experience.",
  items = [],
}: GymTrainersProps) {
  return (
    <Reveal as="section" id="trainers" className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((trainer, idx) => (
            <article key={`${trainer.name}-${idx}`} className="rounded-2xl border border-border bg-muted/10 p-4 sm:p-5">
              <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted">
                {trainer.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={trainer.imageUrl} alt={trainer.name} className="h-56 w-full object-cover sm:h-64" />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground sm:h-64">
                    Coach Photo
                  </div>
                )}
              </div>
              <h3 className="text-lg font-black text-foreground">{trainer.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{trainer.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{trainer.specialty}</p>
              {trainer.yearsExperience && (
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {trainer.yearsExperience} Experience
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
