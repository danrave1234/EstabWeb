import { Check, Minus, MoveRight, PhoneCall } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface PricingComparisonPlan {
  name: string
  price: string
  description: string
  buttonLabel: string
  buttonVariant?: "default" | "outline"
  ctaUrl?: string
}

export interface PricingComparisonFeature {
  name: string
  /** null = dash, "text" = display text, true = check, false = minus */
  values: (boolean | string | null)[]
}

export interface PricingProps {
  badge?: string
  title?: string
  subtitle?: string
  plans?: PricingComparisonPlan[]
  features?: PricingComparisonFeature[]
}

const DEFAULT_PLANS: PricingComparisonPlan[] = [
  {
    name: "Startup",
    price: "$40",
    description: "Great for small teams just getting started.",
    buttonLabel: "Try it",
    buttonVariant: "outline",
    ctaUrl: "#contact",
  },
  {
    name: "Growth",
    price: "$80",
    description: "Everything you need to scale your business.",
    buttonLabel: "Try it",
    buttonVariant: "default",
    ctaUrl: "#contact",
  },
  {
    name: "Enterprise",
    price: "$120",
    description: "Custom solutions for large organizations.",
    buttonLabel: "Contact us",
    buttonVariant: "outline",
    ctaUrl: "#contact",
  },
]

const DEFAULT_FEATURES: PricingComparisonFeature[] = [
  { name: "SSO", values: [true, true, true] },
  { name: "AI Assistant", values: [false, true, true] },
  { name: "Version Control", values: [false, true, true] },
  { name: "Members", values: ["5 members", "25 members", "100+ members"] },
  { name: "Multiplayer Mode", values: [false, true, true] },
  { name: "Orchestration", values: [false, true, true] },
]

function Pricing({
  badge = "Pricing",
  title = "Prices that make sense!",
  subtitle = "Managing a small business today is already tough.",
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
}: PricingProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge>{badge}</Badge>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              {title}
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              {subtitle}
            </p>
          </div>
          <div className="grid text-left w-full grid-cols-3 lg:grid-cols-4 divide-x divide-border pt-20">
            <div className="col-span-3 lg:col-span-1"></div>
            {plans.map((plan, i) => (
              <div key={i} className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
                <p className="text-2xl">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl">{plan.price}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <Button
                  variant={plan.buttonVariant ?? "outline"}
                  className="gap-4 mt-8"
                  asChild
                >
                  <a href={plan.ctaUrl ?? "#contact"}>
                    {plan.buttonLabel}
                    {plan.buttonLabel.toLowerCase().includes("contact") ? (
                      <PhoneCall className="w-4 h-4" />
                    ) : (
                      <MoveRight className="w-4 h-4" />
                    )}
                  </a>
                </Button>
              </div>
            ))}
            {/* Features header row */}
            <div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4 border-t border-border">
              <b>Features</b>
            </div>
            {plans.map((_, i) => (
              <div key={i} className="border-t border-border"></div>
            ))}
            {/* Feature rows */}
            {features.map((feature, fi) => (
              <>
                <div key={`name-${fi}`} className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4 border-t border-border">
                  {feature.name}
                </div>
                {feature.values.map((val, vi) => (
                  <div key={`val-${fi}-${vi}`} className="px-3 py-1 md:px-6 md:py-4 flex justify-center border-t border-border">
                    {val === true ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : val === false ? (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    ) : val === null ? (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <p className="text-muted-foreground text-sm">{val}</p>
                    )}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Pricing }
