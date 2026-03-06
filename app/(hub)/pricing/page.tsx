"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, InfoIcon, Sparkle } from "@phosphor-icons/react";
import { PLANS, PlanId, ENABLE_ANNUAL_PLANS, BillingInterval } from "@/config/plans";

export default function PricingPage() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const planIds: PlanId[] = ["free", "basic", "pro", "ecommerce"];
  const displayPlans = planIds.map((id) => {
    const p = PLANS[id];
    const recurring = interval === "yearly" ? (p as any).yearlyAmount : p.recurringAmount;

    return {
      id,
      name: p.name,
      setupPrice: `₱${(p.initialAmount / 100).toLocaleString()}`,
      monthlyPrice: `₱${(recurring / 100).toLocaleString()}`,
      description: p.description,
      features: p.features,
      buttonText: id === "free" ? "Get Started" : id === "ecommerce" ? "Join Waitlist" : `Choose ${p.label}`,
      highlight: p.highlight,
      comingSoon: (p as any).comingSoon || false,
      note: (p as any).note || null,
      period: interval === "yearly" ? "/yr" : "/mo",
    };
  });

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Transparent Pricing
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Simple Plans for <span className="text-primary">Local Growth.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Simply create a project and apply a subscription to it. No hidden fees. A professional, high-performance website managed by experts.
          </p>
        </div>

        {/* Interval Toggle */}
        {ENABLE_ANNUAL_PLANS && (
          <div className="flex items-center gap-4 mb-16 p-1 bg-muted/30 rounded-full border border-border">
            <button
              onClick={() => setInterval("monthly")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${interval === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setInterval("yearly")}
              className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${interval === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] rounded-md border border-emerald-500/20">Save ~8%</span>
            </button>
          </div>
        )}

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayPlans.map((plan) => (
            <div key={plan.id} className={`relative p-6 lg:p-8 rounded-[32px] border ${plan.highlight ? 'border-primary shadow-2xl shadow-primary/20' : 'border-border'} bg-background overflow-hidden flex flex-col h-full`}>
              {plan.highlight && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
              )}

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-black mb-1">{plan.name}</h3>
                    <p className="text-[10px] text-muted-foreground leading-tight min-h-[2.5rem]">{plan.description}</p>
                  </div>
                  {plan.highlight && (
                    <div className="px-2.5 py-1 bg-primary text-primary-foreground text-[8px] font-black rounded-full uppercase tracking-widest shrink-0">
                      Popular
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="p-3 bg-muted/20 rounded-2xl border border-border/50">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Initial Setup</div>
                    <div className="text-2xl font-black text-primary tracking-tighter">{plan.setupPrice}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-2xl border border-border/50">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Care Plan</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tighter">{plan.monthlyPrice}</span>
                      <span className="text-[9px] font-bold text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-1.5 border-b border-border">Included Features</div>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 items-start text-[12px]">
                        <CheckCircleIcon weight="duotone" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  {plan.note && (
                    <div className="mb-4 p-3 bg-primary/5 rounded-xl border border-primary/10 flex gap-2 items-center">
                      <InfoIcon weight="duotone" className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-[9px] font-bold text-primary leading-tight">{plan.note}</p>
                    </div>
                  )}

                  <Link
                    href={plan.comingSoon ? "/contact" : "/login"}
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all text-center block ${plan.highlight
                      ? "bg-primary text-primary-foreground hover:shadow-xl hover:shadow-primary/20"
                      : plan.comingSoon
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-muted hover:bg-muted-foreground/10 text-foreground"
                      }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-muted/30 rounded-[32px] border border-border max-w-3xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Sparkle weight="duotone" className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-lg">Custom Requirements?</h4>
              <p className="text-sm text-muted-foreground">Fully custom design from scratch? Contact us for a tailored proposal.</p>
            </div>
          </div>
          <Link href="/contact" className="px-8 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:opacity-90 transition-all whitespace-nowrap">
            Contact Us
          </Link>
        </div>
      </main>
    </>
  );
}
