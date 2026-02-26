import type { Metadata } from "next";
import React from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { CheckCircleIcon, InfoIcon, Sparkle } from "@phosphor-icons/react/ssr";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Affordable, transparent pricing for managed local business websites.",
  alternates: {
    canonical: "/pricing",
  },
};

export default async function PricingPage() {
  const heads = await headers();
  const country = heads.get("x-vercel-ip-country") || "PH";
  const isPH = country === "PH";

  const plans = [
    {
      id: "free",
      name: "Free",
      setupPrice: "₱0",
      monthlyPrice: "₱0",
      description: "Perfect for personal projects or small sites looking to get started.",
      features: ["Managed hosting included", "Subdomain access (name.site.ph)", "Industry-specific templates", "Mobile Responsive", "SSL Certificate"],
      buttonText: "Get Started",
      highlight: false
    },
    {
      id: "basic",
      name: "Basic",
      setupPrice: "₱1,500",
      monthlyPrice: "₱499",
      description: "Great for growing businesses that need professional presence and analytics.",
      features: ["Everything in Free", "Custom Domain connection", "Basic Analytics summary", "Managed monthly updates", "Priority Technical Support", "1 Month Free Monthly Care"],
      buttonText: "Choose Basic",
      highlight: true,
      note: "Setup fee includes first month maintenance."
    },
    {
      id: "pro",
      name: "Pro",
      setupPrice: "₱2,500",
      monthlyPrice: "₱999",
      description: "Advanced features for businesses that want deep insights and maximum growth.",
      features: ["Everything in Basic", "Advanced Conversion Analytics", "Section Heatmaps", "SEO Audit & Optimization", "Priority Support", "1 Month Free Monthly Care"],
      buttonText: "Go Pro",
      highlight: false,
      note: "Setup fee includes first month maintenance."
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      setupPrice: "₱3,500",
      monthlyPrice: "₱1,499",
      description: "Full online store capabilities to sell products directly to your customers.",
      features: ["Everything in Pro", "Product Inventory Management", "Online Payment Integration", "Order Tracking", "1 Month Free Monthly Care", "Coming Soon"],
      buttonText: "Join Waitlist",
      highlight: false,
      comingSoon: true,
      note: "Setup fee includes first month maintenance."
    }
  ];

  const displayPlans = plans;

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Transparent Pricing
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Simple Plans for <span className="text-primary">Local Growth.</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Simply create a project and apply a subscription to it. No hidden fees. A professional, high-performance website managed by experts so you can focus on your business.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Need a fully custom design and end-to-end build instead of a template-based setup?{" "}
            <Link href="/contact" className="font-semibold text-primary underline underline-offset-2">
              Contact us
            </Link>{" "}
            and we&apos;ll scope a custom project for you.
          </p>
        </div>

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
                  {plan.comingSoon && (
                    <div className="px-2.5 py-1 bg-muted text-muted-foreground text-[8px] font-black rounded-full uppercase tracking-widest shrink-0">
                      Soon
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  <div className="p-3 bg-muted/20 rounded-2xl border border-border/50">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Initial Setup</div>
                    <div className="text-2xl font-black text-primary tracking-tighter">{plan.setupPrice}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-2xl border border-border/50">
                    <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Monthly Care</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tighter">{plan.monthlyPrice}</span>
                      <span className="text-[9px] font-bold text-muted-foreground">/mo</span>
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
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all text-center block ${
                      plan.highlight 
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
