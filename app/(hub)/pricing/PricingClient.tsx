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
        { name: "Launch from an admin-prepared business website", included: "free" },
        { name: "Get your own subdomain right away", included: "free" },
        { name: "Start with a guided one page website", included: "free" },
        { name: "Use a ready-made gym or local business template", included: "free" },
        { name: "Works well on mobile phones", included: "free" },
        { name: "Website security certificate included", included: "free" },
        { name: "Add more pages as your business grows", included: "basic" },
        { name: "Use your own custom domain", included: "basic" },
        { name: "See your website visits in one simple dashboard", included: "basic" },
        { name: "Edit your launch draft and publish updates anytime", included: "basic" },
        { name: "We help handle hosting and updates", included: "basic" },
        { name: "1 month free monthly care included", included: "basic" },
        { name: "Know which pages help bring inquiries", included: "pro" },
        { name: "See where visitors spend attention before leaving", included: "pro" },
        { name: "Help your business show on Google with SEO tools", included: "pro" },
        { name: "Get faster support when you need changes", included: "pro" },
        { name: "Sell products with inventory management", included: "ecommerce" },
        { name: "Accept online payments", included: "ecommerce" },
        { name: "Track customer orders", included: "ecommerce" },
    ];

    const planSummaries: Record<string, string> = {
        free: "For testing the guided launch flow before upgrading",
        basic: "Best for small businesses that want a managed launch",
        pro: "Best for growing businesses that want analytics and more control",
        ecommerce: "Best for selling products online",
    };

    return (
        <>
            <main className="flex-1 container mx-auto px-4 py-4 lg:py-10 flex flex-col items-center min-h-[calc(100vh-64px)]">
                <div className="w-full max-w-4xl text-center mb-0 space-y-1.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-primary rounded-full text-[8px] font-bold uppercase tracking-widest border bg-primary/10 border-primary/20">
                        Transparent Pricing
                    </div>
                    <h1 className="text-xl lg:text-3xl font-black tracking-tight leading-tight">
                        Managed Website Plans Built to <span className="text-primary">Bring in Customers</span>
                    </h1>
                    <p className="text-[10px] lg:text-sm text-muted-foreground leading-snug max-w-lg mx-auto">
                        Pick the plan that fits your business stage. We prepare the site, host it, and give you the right level of editing, analytics, and domain control for your plan.
                    </p>
                    <p className="text-[8px] lg:text-[9px] font-semibold text-muted-foreground/70">
                        If your website brings just 1 to 2 customers per month, it can already pay for itself.
                    </p>
                </div>

                <div className="mt-5 grid w-full max-w-4xl grid-cols-2 gap-2 px-4 md:grid-cols-4 md:gap-3">
                    {plans.map((plan) => (
                        <div key={plan.level} className="rounded-2xl border border-border bg-muted/20 p-3 text-left md:p-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-primary md:text-[10px] md:tracking-[0.18em]">{plan.name}</p>
                            <p className="mt-1.5 text-xs font-semibold leading-snug text-foreground md:mt-2 md:text-sm">{planSummaries[plan.level] || "Built for your business"}</p>
                        </div>
                    ))}
                </div>

                <PricingTable 
                    plans={plans}
                    features={features}
                    defaultPlan="pro"
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

                <div className="mt-4 w-full max-w-4xl rounded-[28px] border border-border bg-background p-5 text-center">
                    <p className="text-sm font-semibold text-foreground">No contracts, cancel anytime. We still help you get launched first.</p>
                    <p className="mt-2 text-xs text-muted-foreground">Starter keeps things guided, while Business and above unlock deeper control like stronger analytics and richer publish flexibility.</p>
                </div>

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
