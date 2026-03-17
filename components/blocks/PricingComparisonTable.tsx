import {
  PricingTable as PricingTableUI,
  type PlanLevel,
  type PricingFeature,
  type PricingPlan,
} from "@/components/ui/pricing-table"

type PricingComparisonTableProps = {
  features?: PricingFeature[]
  plans?: PricingPlan[]
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

const DEFAULT_FEATURES: PricingFeature[] = [
  { name: "Basic Analytics", included: "starter" },
  { name: "Up to 5 team members", included: "starter" },
  { name: "Basic support", included: "starter" },
  { name: "Advanced Analytics", included: "pro" },
  { name: "Up to 20 team members", included: "pro" },
  { name: "Priority support", included: "pro" },
  { name: "Custom integrations", included: "all" },
  { name: "Unlimited team members", included: "all" },
  { name: "24/7 phone support", included: "all" },
]

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: { monthly: 15, yearly: 144 },
    level: "starter",
  },
  {
    name: "Pro",
    price: { monthly: 49, yearly: 470 },
    level: "pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 99, yearly: 990 },
    level: "all",
  },
]

export default function PricingComparisonTable({
  features = DEFAULT_FEATURES,
  plans = DEFAULT_PLANS,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  containerClassName,
  buttonClassName,
}: PricingComparisonTableProps) {
  return (
    <PricingTableUI
      features={features}
      plans={plans}
      defaultPlan={defaultPlan}
      defaultInterval={defaultInterval}
      containerClassName={containerClassName}
      buttonClassName={buttonClassName}
    />
  )
}
