import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

type AnimatedTestimonialItem = {
  quote: string
  name: string
  designation: string
  src: string
}

type AnimatedTestimonialsBlockProps = {
  testimonials?: AnimatedTestimonialItem[]
  autoplay?: boolean
  className?: string
}

const DEFAULT_TESTIMONIALS: AnimatedTestimonialItem[] = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we have been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "This solution has significantly improved our team productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  },
]

export default function AnimatedTestimonialsBlock({
  testimonials = DEFAULT_TESTIMONIALS,
  autoplay = false,
  className,
}: AnimatedTestimonialsBlockProps) {
  return (
    <AnimatedTestimonials
      testimonials={testimonials}
      autoplay={autoplay}
      className={className}
    />
  )
}
