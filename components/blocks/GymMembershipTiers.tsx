"use client";

import { trackEvent, trackLead } from "@/components/shared/Analytics";

type MembershipTier = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  perks: string[];
  isPopular?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

type GymMembershipTiersProps = {
  title?: string;
  subtitle?: string;
  tiers?: MembershipTier[];
};

export default function GymMembershipTiers({
  title = "Membership Tiers",
  subtitle = "Choose a membership that matches your training frequency and coaching needs.",
  tiers = [],
}: GymMembershipTiersProps) {
  return (
    <section id="memberships" className="reveal bg-background">
      <div className="container mx-auto px-4 py-14 sm:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tiers.map((tier, idx) => (
            <article
              key={`${tier.name}-${idx}`}
              className={`relative rounded-2xl border p-5 ${tier.isPopular ? "border-primary bg-primary/5" : "border-border bg-muted/10"}`}
            >
              {tier.isPopular && (
                <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="text-lg font-black text-foreground">{tier.name}</h3>
              <p className="mt-2 text-3xl font-black text-foreground">
                {tier.price}
                {tier.period ? <span className="ml-1 text-base text-muted-foreground">{tier.period}</span> : null}
              </p>
              {tier.description && <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>}
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {(tier.perks || []).map((perk, perkIdx) => (
                  <li key={`${perk}-${perkIdx}`} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref || "#contact"}
                onClick={() => {
                  trackEvent({ type: "cta_click", section_key: "gym_memberships", cta_id: `membership_${idx}` });
                  trackLead("form");
                }}
                className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
              >
                {tier.ctaLabel || "Start Membership"}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

