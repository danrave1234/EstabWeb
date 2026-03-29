"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkle } from "@phosphor-icons/react";
import { PLANS, PlanId } from "@/config/plans";
import { PricingTable, PricingPlan, PricingFeature } from "@/components/ui/pricing-table";
import { useRouter } from 'next/navigation';

export default function PricingClient() {
    const router = useRouter();

    const plans: PricingPlan[] = [
        {
            name: PLANS.free.name,
            level: "free",
            price: { 
                monthly: PLANS.free.recurringAmount / 100, 
                yearly: PLANS.free.yearlyAmount / 100 
            },
            setupPrice: PLANS.free.initialAmount / 100,
            popular: PLANS.free.highlight,
        },
        {
            name: PLANS.basic.name,
            level: "basic",
            price: { 
                monthly: PLANS.basic.recurringAmount / 100, 
                yearly: PLANS.basic.yearlyAmount / 100 
            },
            setupPrice: PLANS.basic.initialAmount / 100,
            popular: PLANS.basic.highlight,
        },
        {
            name: PLANS.pro.name,
            level: "pro",
            price: { 
                monthly: PLANS.pro.recurringAmount / 100, 
                yearly: PLANS.pro.yearlyAmount / 100 
            },
            setupPrice: PLANS.pro.initialAmount / 100,
            popular: PLANS.pro.highlight,
        },
        {
            name: PLANS.ecommerce.name,
            level: "ecommerce",
            price: { 
                monthly: PLANS.ecommerce.recurringAmount / 100, 
                yearly: PLANS.ecommerce.yearlyAmount / 100 
            },
            setupPrice: PLANS.ecommerce.initialAmount / 100,
            popular: PLANS.ecommerce.highlight,
        },
    ];

    const features: PricingFeature[] = [
        { name: "Managed hosting included", included: "free" },
        { name: "Subdomain access (name.site.ph)", included: "free" },
        { name: "Single-page website (Home + legal pages)", included: "free" },
        { name: "Industry-specific templates", included: "free" },
        { name: "Mobile Responsive", included: "free" },
        { name: "SSL Certificate", included: "free" },
        { name: "Multi-page website support", included: "basic" },
        { name: "Custom Domain connection", included: "basic" },
        { name: "Basic Analytics summary", included: "basic" },
        { name: "AI-Powered Content Editor", included: "basic" },
        { name: "Priority Technical Support", included: "basic" },
        { name: "1 Month Free Monthly Care", included: "basic" },
        { name: "Advanced Conversion Analytics", included: "pro" },
        { name: "Section Heatmaps", included: "pro" },
        { name: "SEO Audit & Optimization", included: "pro" },
        { name: "Priority Support", included: "pro" },
        { name: "Product Inventory Management", included: "ecommerce" },
        { name: "Online Payment Integration", included: "ecommerce" },
        { name: "Order Tracking", included: "ecommerce" },
    ];

    return (
        <>
            <main className="flex-1 container mx-auto px-4 py-4 lg:py-10 flex flex-col items-center min-h-[calc(100vh-64px)]">
                <div className="w-full max-w-4xl text-center mb-0 space-y-1.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-primary rounded-full text-[8px] font-bold uppercase tracking-widest border bg-primary/10 border-primary/20">
                        Transparent Pricing
                    </div>
                    <h1 className="text-xl lg:text-3xl font-black tracking-tight leading-tight">
                        Simple Plans for <span className="text-primary">Local Growth.</span>
                    </h1>
                    <p className="text-[10px] lg:text-sm text-muted-foreground leading-snug max-w-lg mx-auto">
                        Simply create a project and apply a subscription to it. No hidden fees. A professional, high-performance website managed by experts.
                    </p>
                    <p className="text-[8px] lg:text-[9px] font-semibold text-muted-foreground/70">
                        Free plan: single-page. Others: multi-page support.
                    </p>
                </div>

                <PricingTable 
                    plans={plans}
                    features={features}
                    defaultPlan="basic"
                    onPlanSelect={(plan) => {
                        console.log("Selected plan:", plan);
                    }}
                    onButtonClick={(plan) => {
                        const selectedPlanData = PLANS[plan as PlanId];
                        if (selectedPlanData?.comingSoon) {
                            router.push("/contact");
                        } else {
                            router.push(`/login?plan=${plan}`);
                        }
                    }}
                    containerClassName="py-4 lg:py-8"
                    buttonClassName="bg-primary hover:bg-primary/90 rounded-full font-bold text-white dark:text-black"
                />

                <div className="mt-0 p-5 rounded-[28px] border border-border max-w-3xl w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/30">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary shrink-0 bg-primary/10">
                            <Sparkle weight="duotone" className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-black text-base lg:text-lg">Custom Requirements?</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground">Fully custom design from scratch? Contact us for a tailored proposal.</p>
                        </div>
                    </div>
                    <Link href="/contact" className="px-6 py-2.5 bg-foreground text-background rounded-full font-bold text-sm hover:opacity-90 transition-all whitespace-nowrap">
                        Contact Us
                    </Link>
                </div>
            </main>
        </>
    );
}
