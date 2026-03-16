"use client"

import { FeatureSteps } from "@/components/ui/feature-section"

interface FeatureStep {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsBlockProps {
  title?: string
  features?: FeatureStep[]
  autoPlayInterval?: number
}

const DEFAULT_FEATURES: FeatureStep[] = [
  {
    step: "Step 1",
    title: "Get Started",
    content: "Sign up and set up your profile in minutes. Our onboarding process is simple and straightforward.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Step 2",
    title: "Customize Your Experience",
    content: "Choose from a wide range of options and tailor everything to fit your specific needs and preferences.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
  },
  {
    step: "Step 3",
    title: "Achieve Your Goals",
    content: "Put everything into action and start seeing real results. Our team is here to support you every step of the way.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  },
]

export default function FeatureStepsBlock({
  title = "How It Works",
  features = DEFAULT_FEATURES,
  autoPlayInterval = 4000,
}: FeatureStepsBlockProps) {
  return (
    <FeatureSteps
      title={title}
      features={features}
      autoPlayInterval={autoPlayInterval}
    />
  )
}
