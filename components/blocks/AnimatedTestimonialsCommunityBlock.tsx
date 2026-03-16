import { AnimatedTestimonialsCommunity, type CommunityTestimonial } from "@/components/ui/animated-testimonials-community"

type AnimatedTestimonialsCommunityBlockProps = {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: CommunityTestimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

const DEFAULT_TESTIMONIALS: CommunityTestimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Full Stack Developer",
    company: "TechFlow",
    content:
      "The attention to detail and professional quality of this service completely transformed our online presence. Worth every peso.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Business Owner",
    company: "DesignHub",
    content:
      "Our leads doubled within the first month. The site looks professional and loads fast — exactly what our customers expect.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Marketing Manager",
    company: "InnovateLabs",
    content:
      "We were up and running in days. The editing tools are intuitive and the SEO foundation is solid. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
  },
]

export default function AnimatedTestimonialsCommunityBlock({
  title,
  subtitle,
  badgeText,
  testimonials = DEFAULT_TESTIMONIALS,
  autoRotateInterval = 6000,
  trustedCompanies,
  trustedCompaniesTitle,
  className,
}: AnimatedTestimonialsCommunityBlockProps) {
  return (
    <AnimatedTestimonialsCommunity
      title={title}
      subtitle={subtitle}
      badgeText={badgeText}
      testimonials={testimonials}
      autoRotateInterval={autoRotateInterval}
      trustedCompanies={trustedCompanies}
      trustedCompaniesTitle={trustedCompaniesTitle}
      className={className}
    />
  )
}
