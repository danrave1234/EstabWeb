"use client";

import { trackEvent, trackLead } from "@/components/shared/Analytics";

type HeroGymProps = {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA?: string;
  primaryCTAHref?: string;
  secondaryCTAHref?: string;
  backgroundImage?: string;
  benefitText?: string;
  localCoverage?: string;
  promoText?: string;
  layout?: "boutique" | "hardcore" | "functional" | string;
};

const LAYOUT_CLASSES: Record<string, { shell: string; badge: string; headline: string }> = {
  boutique: {
    shell: "from-background via-background to-primary/10",
    badge: "bg-primary/12 border-primary/30 text-primary",
    headline: "font-serif tracking-tight",
  },
  hardcore: {
    shell: "from-foreground via-foreground to-primary/40",
    badge: "bg-primary/25 border-primary/40 text-primary-foreground",
    headline: "font-black uppercase tracking-[0.03em]",
  },
  functional: {
    shell: "from-background via-muted/40 to-background",
    badge: "bg-muted border-border text-foreground",
    headline: "font-serif tracking-tight",
  },
};

export default function HeroGym({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA = "View Class Schedule",
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#schedule",
  backgroundImage,
  benefitText = "Coach-Led Programs",
  localCoverage = "Open Daily",
  promoText = "Free First Session",
  layout = "boutique",
}: HeroGymProps) {
  const variant = LAYOUT_CLASSES[layout] ?? LAYOUT_CLASSES.boutique;

  return (
    <section className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${variant.shell} reveal`}>
      <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_75%_15%,var(--primary)_0%,transparent_45%)]" aria-hidden />
      <div className="container relative z-10 mx-auto px-4 py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <span className={`rounded-full border px-3 py-1 ${variant.badge}`}>{benefitText}</span>
              <span className={`rounded-full border px-3 py-1 ${variant.badge}`}>{localCoverage}</span>
              <span className={`rounded-full border px-3 py-1 ${variant.badge}`}>{promoText}</span>
            </div>
            <h1 className={`text-4xl leading-[1.05] text-foreground sm:text-5xl lg:text-6xl ${variant.headline}`}>{title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={primaryCTAHref}
                onClick={() => {
                  trackEvent({ type: "cta_click", section_key: "hero", cta_id: "gym_hero_primary" });
                  if (primaryCTAHref.startsWith("tel:")) trackLead("call");
                  else trackLead("form");
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-wider text-primary-foreground transition hover:opacity-90 sm:text-sm"
              >
                {primaryCTA}
              </a>
              <a
                href={secondaryCTAHref}
                onClick={() => trackEvent({ type: "cta_click", section_key: "hero", cta_id: "gym_hero_secondary" })}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-border bg-background/70 px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground transition hover:bg-muted sm:text-sm"
              >
                {secondaryCTA}
              </a>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-2xl">
              {backgroundImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={backgroundImage} alt="" className="h-[320px] w-full object-cover sm:h-[420px]" />
              ) : (
                <div className="flex h-[320px] w-full items-center justify-center bg-gradient-to-br from-primary/20 via-muted to-background sm:h-[420px]">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Gym Visual</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

