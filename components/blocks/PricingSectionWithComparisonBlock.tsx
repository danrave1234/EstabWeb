import { Pricing, type PricingProps } from "@/components/ui/pricing-section-with-comparison"

type PricingSectionWithComparisonBlockProps = PricingProps & {
  className?: string
}

export default function PricingSectionWithComparisonBlock({
  className,
  ...pricingProps
}: PricingSectionWithComparisonBlockProps) {
  return (
    <div className={className}>
      <Pricing {...pricingProps} />
    </div>
  )
}
