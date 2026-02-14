import type { Metadata } from "next";
import React from 'react';
import MainHeader from '@/components/shared/MainHeader';
import MainFooter from '@/components/shared/MainFooter';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Info } from 'lucide-react';

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
      cta: "Send Quote",
      highlight: !isPH
    },
    {
      id: "ph",
      name: "Philippines (PHP)",
      setupPrice: "Starts at ₱5,000",
      monthlyPrice: "₱1,000",
      monthlyNote: "/month (Starts after 1st month)",
      description: "High-performance sites for local businesses. Base price covers setup; add-ons like dashboards available.",
      features: ["Starting setup fee (Add-ons extra)", "Admin Dashboard available", "E-commerce & editable data", "Maintenance & Hosting", "Technical Support", "Mobile Responsive"],
      cta: "Send Quote",
      highlight: isPH
    }
  ];

  // Show only the relevant plan based on location
  const displayPlans = isPH ? [plans[1]] : [plans[0]];

  return (
    <>
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-base text-muted-foreground">No hidden fees. A professional website that works for you.</p>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          {displayPlans.map((plan) => (
            <div key={plan.id} className="relative p-8 rounded-2xl border border-primary shadow-2xl shadow-primary/10 bg-muted/30 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-widest whitespace-nowrap">
                Recommended Plan
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{plan.setupPrice}</span>
                    <span className="text-muted-foreground text-xs font-medium uppercase">Setup</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{plan.monthlyPrice}</span>
                    <span className="text-muted-foreground text-xs uppercase">{plan.monthlyNote}</span>
                  </div>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 items-center text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 p-4 bg-background/50 rounded-xl border border-border flex gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {plan.id === "ph" 
                    ? "Add-on charges occur for features like Admin Dashboards, E-commerce, and Dynamic Data management."
                    : "International plans may incur additional charges for advanced integrations, custom dashboards, or e-commerce features."}
                </p>
              </div>

              <Link 
                href="/contact" 
                className={`w-full py-4 rounded-xl font-bold text-center text-base transition-all ${plan.highlight ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg' : 'bg-background border border-border hover:bg-muted'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
