"use client"

import NumberFlow from "@number-flow/react"
import { useState } from "react"
import { PlanId, BillingInterval } from "@/config/plans"
import { CheckCircleIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    projectId: string
    initialPlansConfig: {
        PLANS: any
        ENABLE_ANNUAL_PLANS: boolean
    }
    notice?: string
}

export default function PlanPicker({ projectId, initialPlansConfig, notice }: Props) {
    const { PLANS, ENABLE_ANNUAL_PLANS } = initialPlansConfig
    const [interval, setInterval] = useState<BillingInterval>("monthly")
    const planIds: PlanId[] = ["basic", "pro", "ecommerce"]

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-black tracking-tight">Select your plan</h1>
                <p className="text-sm text-muted-foreground">Choose the best plan for your website.</p>
            </div>

            {notice && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {notice}
                </div>
            )}

            {/* Interval Toggle */}
            {ENABLE_ANNUAL_PLANS && (
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-full border border-border w-fit">
                        <button
                            onClick={() => setInterval("monthly")}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${interval === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setInterval("yearly")}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${interval === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Yearly
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] rounded-md border border-emerald-500/20">Save ~8%</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planIds.map((id) => {
                    const plan = PLANS[id]
                    const isBusiness = id === 'pro'
                    const isComingSoon = id === "ecommerce" || Boolean((plan as any)?.comingSoon)
                    const recurring = interval === "yearly" ? (plan as any).yearlyAmount : plan.recurringAmount

                    return (
                        <div
                            key={id}
                            className={`relative flex flex-col p-6 rounded-2xl border bg-card transition-all ${
                                isComingSoon
                                    ? "border-amber-300 bg-amber-50/30"
                                    : isBusiness
                                        ? 'border-primary ring-1 ring-primary shadow-xl scale-105 z-10 hover:border-primary'
                                        : 'border-border shadow-sm hover:border-primary/50'
                            }`}
                        >
                            {isBusiness && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                                    Most Recommended
                                </div>
                            )}
                            {isComingSoon && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                    Soon Available
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-bold">{plan.label}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-black">₱{(plan.initialAmount / 100).toLocaleString()}</span>
                                    <span className="text-xs text-muted-foreground font-medium">Initial</span>
                                </div>
                                <p className="mt-1 flex items-baseline gap-1 text-[10px] text-muted-foreground">
                                    <span>Then ₱</span>
                                    <NumberFlow
                                        value={recurring / 100}
                                        format={{
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }}
                                        className="font-semibold text-foreground/90"
                                    />
                                    <span>/ {interval === "yearly" ? "year" : "month"}</span>
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.slice(0, 5).map((feature: string, i: number) => (
                                    <li key={i} className="flex gap-2 items-start text-xs">
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {isComingSoon ? (
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-300"
                                    >
                                        Soon Available
                                    </button>
                                    <p className="text-[10px] text-amber-700 text-center">
                                        Online store upgrade is in development and not yet open for checkout.
                                    </p>
                                </div>
                            ) : (
                                <Link
                                    href={`/subscribe/${projectId}?planId=${id}&interval=${interval}`}
                                    className={`w-full py-2.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest transition-all ${isBusiness ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted hover:bg-muted-foreground/10 text-foreground'}`}
                                >
                                    Select {plan.label}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="text-center pt-4">
                <Link href={`/dashboard?projectId=${projectId}`} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 font-medium transition-colors">
                    Not ready? Back to Dashboard
                </Link>
            </div>
        </div>
    )
}
