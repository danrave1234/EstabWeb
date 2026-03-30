"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon, Cross2Icon } from "@radix-ui/react-icons"
import NumberFlow from "@number-flow/react"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  setupPrice: number
  popular?: boolean
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  onButtonClick?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  onButtonClick,
  defaultPlan = "basic",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)
  const [hintDismissed, setHintDismissed] = React.useState(false)

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
    setHintDismissed(true)
    onPlanSelect?.(plan)
  }

  const selectedPlanData = plans.find((p) => p.level === selectedPlan)

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-4 sm:py-8 md:py-12 px-2 sm:px-4",
        "fade-bottom overflow-hidden pb-0",
      )}
    >
      <div
        className={cn("w-full max-w-4xl mx-auto", containerClassName)}
        {...props}
      >
        {/* Billing interval toggle */}
        <div className="flex justify-center sm:justify-end mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-all font-bold",
                !isYearly ? "bg-background text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-2.5 py-1.5 rounded-md transition-all font-bold",
                isYearly ? "bg-background text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plan selector cards — 2x2 grid on mobile, flex row on sm+ */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-4 mb-2 sm:mb-6 px-1">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => handlePlanSelect(plan.level)}
              className={cn(
                "p-2.5 sm:p-4 rounded-xl text-left transition-all",
                "border border-zinc-200 dark:border-zinc-800",
                "sm:flex-1",
                selectedPlan === plan.level
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "hover:border-zinc-300 dark:hover:border-zinc-700 bg-background",
              )}
            >
              <div className="flex items-center justify-between mb-0.5 sm:mb-2 gap-1">
                <span className="text-[10px] sm:text-sm font-bold truncate">{plan.name}</span>
                {plan.popular && (
                  <span className="text-[7px] sm:text-xs bg-primary text-primary-foreground px-1 sm:px-2 py-0.5 rounded-full shrink-0 font-black">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-0.5 sm:gap-1 overflow-hidden">
                <span className="text-xs sm:text-xl font-black">₱</span>
                <NumberFlow
                  value={isYearly ? plan.price.yearly : plan.price.monthly}
                  className="text-sm sm:text-2xl font-black tracking-tight"
                />
                <span className="text-[8px] sm:text-sm font-normal text-zinc-500 shrink-0">
                  /{isYearly ? "yr" : "mo"}
                </span>
              </div>
              <div className="mt-1 text-[7px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Setup: <span className="font-bold text-foreground">₱{(plan.setupPrice).toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Hint row — mobile only, always takes up its space so nothing shifts, just fades */}
        <div
          aria-hidden="true"
          className={cn(
            "sm:hidden flex items-center justify-end gap-1.5 px-1 mb-3 h-6 transition-opacity duration-500",
            hintDismissed ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] text-muted-foreground font-medium">
            Tap a plan to see the key outcomes
          </span>
        </div>

        {/* ── MOBILE: feature checklist for selected plan ── */}
        {selectedPlanData && (
          <div className="sm:hidden border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-background mx-1 shadow-sm mb-6">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-bold text-foreground">
                What&apos;s included in <span className="text-primary">{selectedPlanData.name}</span>
              </p>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {features.map((feature) => {
                const checked = shouldShowCheck(feature.included, selectedPlan)
                return (
                  <div
                    key={feature.name}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 transition-colors",
                      checked ? "bg-background" : "bg-background opacity-50",
                    )}
                  >
                    {checked ? (
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-primary/10">
                        <CheckIcon className="w-2.5 h-2.5 text-primary" />
                      </span>
                    ) : (
                      <span className="shrink-0 w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Cross2Icon className="w-2 h-2 text-zinc-400" />
                      </span>
                    )}
                    <span className="text-[11px] font-medium leading-tight">{feature.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── DESKTOP: full comparison table ── */}
        <div className="hidden sm:block border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-background mx-1 shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="min-w-[550px] sm:min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <div className="flex items-stretch bg-zinc-50 dark:bg-zinc-900 sticky top-0 z-20">
                <div className="flex-1 text-[10px] sm:text-sm font-bold sticky left-0 bg-inherit z-10 px-2.5 py-2.5 sm:px-4 sm:py-4 pr-2 border-r border-zinc-200 dark:border-zinc-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] flex items-center">Key outcomes</div>
                <div className="flex items-center gap-2 sm:gap-8 text-[10px] sm:text-sm">
                  {plans.map((plan) => (
                    <div
                      key={plan.level}
                      className={cn(
                        "w-16 sm:w-20 text-center font-bold px-1 py-2.5 sm:py-4 transition-colors flex items-center justify-center",
                        plan.level === selectedPlan && "bg-primary/10 text-primary",
                      )}
                    >
                      {plan.name === 'E-commerce' ? 'Ecom' : plan.name}
                    </div>
                  ))}
                </div>
              </div>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-stretch transition-colors bg-background"
                >
                  <div className="flex-1 text-[10px] sm:text-sm sticky left-0 bg-inherit z-10 px-2.5 py-2.5 sm:px-4 sm:py-4 pr-2 border-r border-zinc-200 dark:border-zinc-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)] font-medium leading-tight flex items-center">{feature.name}</div>
                  <div className="flex items-center gap-2 sm:gap-8 text-[10px] sm:text-sm">
                    {plans.map((plan) => (
                      <div
                        key={plan.level}
                        className={cn(
                          "w-16 sm:w-20 flex items-center justify-center py-2.5 sm:py-4 transition-colors",
                          plan.level === selectedPlan && "bg-primary/10 font-black text-primary",
                        )}
                      >
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <CheckIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary" />
                        ) : (
                          <span className="text-zinc-300 dark:text-zinc-700">
                            -
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA button */}
        <div className="mt-6 text-center px-1">
          <Button
            onClick={() => onButtonClick?.(selectedPlan)}
            className={cn(
              "w-full sm:w-auto bg-primary text-primary-foreground hover:opacity-90 px-6 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-lg",
              buttonClassName,
            )}
          >
            Get started with {plans.find((p) => p.level === selectedPlan)?.name}
            <ArrowRightIcon className="w-4 h-4 ml-1.5 sm:ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function shouldShowCheck(
  included: PricingFeature["included"],
  level: string,
): boolean {
  if (!included) return false;
  const levels = ["free", "basic", "pro", "ecommerce"];
  const includedIndex = levels.indexOf(included as string);
  const levelIndex = levels.indexOf(level);
  
  if (includedIndex === -1) {
    if (included === "all") return true;
    return false;
  }
  
  return levelIndex >= includedIndex;
}
