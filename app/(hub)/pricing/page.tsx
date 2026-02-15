import type { Metadata } from "next";
import React from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react/ssr";

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
      id: "intl",
      name: "International (USD)",
      setupPrice: "$100 - $500",
      monthlyPrice: "$20",
      monthlyNote: "/month maintenance",
      description: "Professional managed websites for global clients. High performance and managed updates included.",
      features: ["One-time setup fee", "Managed hosting included", "Monthly maintenance & updates", "SSL Certificate", "Industry-specific templates", "SEO optimized"],
      highlight: !isPH
    },
    {
      id: "ph",
      name: "Philippines (PHP)",
      setupPrice: "₱5,000",
      monthlyPrice: "₱500",
      monthlyNote: "/month maintenance",
      description: "Professional managed websites with initial setup and monthly maintenance.",
      features: ["Starting setup fee (Add-ons extra)", "Admin Dashboard available", "E-commerce & editable data", "Maintenance & Hosting", "Technical Support", "Mobile Responsive"],
      highlight: isPH
    }
  ];

  // Show only the relevant plan based on location
  const displayPlans = isPH ? [plans[1]] : [plans[0]];

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                Transparent Pricing
              </div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-[1.1]">
                Simple Plans for <span className="text-primary">Local Growth.</span>
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Simply create a project and apply a subscription to it. No hidden fees. A professional, high-performance website managed by experts so you can focus on your business.
              </p>
            </div>

            <div className="hidden sm:block">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border">
                <div className="text-2xl font-bold text-primary mb-1">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Card (Bento Style) */}
          <div className="lg:col-span-7">
            {displayPlans.map((plan) => (
              <div key={plan.id} className="relative p-5 lg:p-8 rounded-[24px] border border-primary/50 shadow-2xl shadow-primary/10 bg-background overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
                
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="col-span-2 sm:col-span-1">
                      <h3 className="text-lg lg:text-xl font-black mb-1">{plan.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-start justify-end">
                      <div className="px-2.5 py-1 bg-primary text-primary-foreground text-[8px] font-black rounded-full uppercase tracking-widest shrink-0">
                        Recommended
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Initial Setup</div>
                      <div className="text-xl lg:text-3xl font-black text-primary tracking-tighter">{plan.setupPrice}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Monthly Care</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl lg:text-3xl font-black tracking-tighter">{plan.monthlyPrice}</span>
                        <span className="text-[9px] font-bold text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-1.5 border-b border-border">Included Features</div>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 items-center text-[13px]">
                          <CheckCircleIcon weight="duotone" className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium line-clamp-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 p-3 bg-muted/50 rounded-xl border border-border flex flex-col gap-2">
                    <div className="flex gap-3">
                      <InfoIcon weight="duotone" className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        {plan.id === "ph" 
                          ? "Add-on charges occur for features like Admin Dashboards, E-commerce, and Dynamic Data management."
                          : "International plans may incur additional charges for advanced integrations, custom dashboards, or e-commerce features."}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-border">
                      <CheckCircleIcon weight="duotone" className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-[10px] font-bold text-primary leading-tight uppercase tracking-wider">
                        How it works: Create a project and apply a subscription to it.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <Link 
                      href="/login" 
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all w-full sm:w-auto text-center"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
