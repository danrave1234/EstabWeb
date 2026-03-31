"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Quote, Star } from "lucide-react"
import { type Variants, motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const normalizeKeyPart = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number") {
    return String(value)
  }

  return ""
}

export interface CommunityTestimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsCommunityProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: CommunityTestimonial[]
  autoRotateInterval?: number
  trustedCompanies?: string[]
  trustedCompaniesTitle?: string
  className?: string
}

export function AnimatedTestimonialsCommunity({
  title = "Loved by the community",
  subtitle = "Don't just take our word for it. See what developers and companies have to say about our starter template.",
  badgeText = "Trusted by developers",
  testimonials = [],
  autoRotateInterval = 6000,
  trustedCompanies = [],
  trustedCompaniesTitle = "Trusted by developers from companies worldwide",
  className,
}: AnimatedTestimonialsCommunityProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonialKeyCounts = testimonials.reduce<Record<string, number>>((counts, testimonial) => {
    const normalizedId = normalizeKeyPart(testimonial.id)
    const fallbackIdentifier = [
      normalizeKeyPart(testimonial.name),
      normalizeKeyPart(testimonial.role),
      normalizeKeyPart(testimonial.company),
      normalizeKeyPart(testimonial.content),
      normalizeKeyPart(testimonial.avatar),
      normalizeKeyPart(testimonial.rating),
    ]
      .filter(Boolean)
      .join("-")
    const testimonialIdentifier = normalizedId || fallbackIdentifier || "testimonial"

    counts[testimonialIdentifier] = (counts[testimonialIdentifier] ?? 0) + 1
    return counts
  }, {})

  const trustedCompanyKeyCounts = trustedCompanies.reduce<Record<string, number>>((counts, company) => {
    const normalizedCompany = normalizeKeyPart(company)
    const companyIdentifier = normalizedCompany || "company"

    counts[companyIdentifier] = (counts[companyIdentifier] ?? 0) + 1
    return counts
  }, {})

  const getTestimonialKey = (testimonial: CommunityTestimonial, index: number) => {
    const normalizedId = normalizeKeyPart(testimonial.id)
    const fallbackParts = [
      normalizeKeyPart(testimonial.name),
      normalizeKeyPart(testimonial.role),
      normalizeKeyPart(testimonial.company),
      normalizeKeyPart(testimonial.content),
      normalizeKeyPart(testimonial.avatar),
      normalizeKeyPart(testimonial.rating),
    ].filter(Boolean)
    const testimonialIdentifier = normalizedId || fallbackParts.join("-") || "testimonial"

    if (testimonialKeyCounts[testimonialIdentifier] === 1) {
      return testimonialIdentifier
    }

    return `${testimonialIdentifier}-${index}`
  }

  const getTrustedCompanyKey = (company: string, index: number) => {
    const normalizedCompany = normalizeKeyPart(company)
    const companyIdentifier = normalizedCompany || "company"

    if (trustedCompanyKeyCounts[companyIdentifier] === 1) {
      return companyIdentifier
    }

    return `${companyIdentifier}-${index}`
  }

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} id="testimonials" className={`overflow-hidden bg-background py-24 text-foreground ${className || ""}`}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20"
        >
          {/* Left side: Heading and navigation */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="mx-auto w-full max-w-xl space-y-6 md:mx-0">
              {badgeText && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  <Star className="mr-1 h-3.5 w-3.5 fill-primary" />
                  <span>{badgeText}</span>
                </div>
              )}

              <h2 className="break-words text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>

              <p className="max-w-[600px] break-words text-muted-foreground md:text-xl/relaxed">{subtitle}</p>

              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "w-10 bg-primary" : "w-2.5 bg-muted-foreground/30"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side: Testimonial cards */}
          <motion.div variants={itemVariants} className="relative mx-auto h-full min-h-[320px] w-full max-w-2xl md:min-h-[400px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={getTestimonialKey(testimonial, index)}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-card p-8 shadow-sm">
                  <div className="mb-6 flex gap-2">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ))}
                  </div>

                  <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20 rotate-180" />
                    <p className="relative z-10 break-words text-lg font-medium leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="break-words font-semibold">{testimonial.name}</h3>
                      <p className="break-words text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorative accents */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-xl bg-primary/5"></div>
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-primary/5"></div>
          </motion.div>
        </motion.div>

        {/* Logo cloud */}
        {trustedCompanies.length > 0 && (
          <motion.div variants={itemVariants} initial="hidden" animate={controls} className="mt-24 text-center">
            <h3 className="mb-8 break-words text-sm font-medium text-muted-foreground">{trustedCompaniesTitle}</h3>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-foreground/60">
              {trustedCompanies.map((company, index) => (
                <div key={getTrustedCompanyKey(company, index)} className="break-words text-2xl font-semibold text-muted-foreground">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
