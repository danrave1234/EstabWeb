'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, LightningIcon, DeviceMobileIcon, ShieldCheckIcon, LayoutIcon, GlobeIcon, CheckCircleIcon, ArrowLeftIcon } from "@phosphor-icons/react"
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useAuth } from '@/components/providers/AuthProvider'
import { HeroSection } from '@/components/ui/hero-section-6'

export default function LandingPageClient({ initialUser }: { initialUser: SupabaseUser | null }) {
  const { user } = useAuth()
  const signedInUser = user ?? initialUser
  const primaryHref = signedInUser ? '/dashboard' : '/login?mode=signup'
  const primaryLabel = signedInUser ? 'Open My Dashboard' : 'Start My Website'
  const [previewMode, setPreviewMode] = React.useState<'light' | 'dark'>('light')
  const carouselRef = React.useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)
  const [autoScrollPaused, setAutoScrollPaused] = React.useState(false)
  const templatePreviews = [
    {
      name: 'Car Detailing',
      bestFor: 'Auto detailing, wash and restoration services',
      vibe: 'Bold and conversion-focused',
      lightImage: '/cardetaillight.png',
      darkImage: '/cardetailingdark.png'
    },
    {
      name: 'Construction',
      bestFor: 'Contractors, builders, and renovation services',
      vibe: 'Professional and trustworthy',
      lightImage: '/constructionlight.png',
      darkImage: '/constructiondark.png'
    },
    {
      name: 'HVAC Services',
      bestFor: 'Aircon installation and repair businesses',
      vibe: 'Clean and service-first',
      lightImage: '/hvaclight.png',
      darkImage: '/hvacdark.png'
    },
    {
      name: 'Law Firm',
      bestFor: 'Law offices and legal consultants',
      vibe: 'Premium and formal',
      lightImage: '/lawyerlight.png',
      darkImage: '/lawyerdark.png'
    },
    {
      name: 'Medical Clinic',
      bestFor: 'Clinics, doctors, and healthcare services',
      vibe: 'Clean and trusted',
      lightImage: '/medicallight.png',
      darkImage: '/medicaldark.png'
    },
    {
      name: 'Pest Control',
      bestFor: 'Pest management and sanitation services',
      vibe: 'Simple and action-oriented',
      lightImage: '/pestlight.png',
      darkImage: '/pestdark.png'
    },
    {
      name: 'Portfolio',
      bestFor: 'Freelancers, creators, and personal brands',
      vibe: 'Minimal and modern',
      lightImage: '/portfoliolight.png',
      darkImage: '/portfoliodark.png'
    },
    {
      name: 'Real Estate',
      bestFor: 'Property agents and brokers',
      vibe: 'Modern and professional',
      lightImage: '/realestatelight.png',
      darkImage: '/realestatedark.png'
    },
    {
      name: 'Startup',
      bestFor: 'New businesses and service startups',
      vibe: 'Modern and growth-focused',
      lightImage: '/stratuplight.png',
      darkImage: '/startupdark.png'
    }
  ]

  const refreshCarouselButtons = React.useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 8)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  React.useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    refreshCarouselButtons()
    el.addEventListener('scroll', refreshCarouselButtons, { passive: true })
    window.addEventListener('resize', refreshCarouselButtons)
    return () => {
      el.removeEventListener('scroll', refreshCarouselButtons)
      window.removeEventListener('resize', refreshCarouselButtons)
    }
  }, [refreshCarouselButtons])

  const scrollTemplates = React.useCallback((direction: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return
    const shift = Math.max(280, Math.round(el.clientWidth * 0.85))
    el.scrollBy({
      left: direction === 'right' ? shift : -shift,
      behavior: 'smooth'
    })
  }, [])

  React.useEffect(() => {
    const el = carouselRef.current
    if (!el || autoScrollPaused) return

    const intervalId = window.setInterval(() => {
      if (!carouselRef.current) return
      if (carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 8) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        return
      }
      scrollTemplates('right')
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [autoScrollPaused, scrollTemplates])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          className="reveal"
          primaryHref={primaryHref}
          primaryLabel={primaryLabel}
          secondaryHref={undefined}
          secondaryLabel={undefined}
          templatePreviews={templatePreviews}
          previewMode={previewMode}
          badgeLabel={undefined}
          title="Affordable Website Design in the Philippines"
          description="Looking for website design price in the Philippines or monthly website maintenance? Start with ready templates, launch fast, and edit anytime."
          points={[
            'Transparent setup + monthly plans',
            'SEO-ready pages for local search',
            'Launch fast with editable templates',
          ]}
        />

        {/* Commitments */}
        <section className="py-12 sm:py-24 border-y border-border bg-muted/30 reveal">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {[
                { label: 'Affordable Setup', value: 'Start Small', color: 'text-primary' },
                { label: 'Flexible Payment', value: 'Monthly Subscription', color: 'text-amber-500' },
                { label: 'Design Support', value: 'Request Updates Anytime', color: 'text-blue-500' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 sm:p-6 bg-background border border-border rounded-2xl flex flex-col justify-center items-center text-center shadow-sm"
                >
                  <div className={`text-2xl sm:text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing + Launch */}
        <section id="pricing-preview" className="py-16 sm:py-24 bg-background reveal">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                How Much Does a <span className="text-primary">Business Website Cost</span> in the Philippines?
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-lg">
                Most businesses need one clear answer: affordable setup, predictable monthly cost, and a fast launch. Here is the simple version.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Setup Cost',
                  value: 'Start Small',
                  desc: 'One-time setup to launch your website with your branding, content, and business details.'
                },
                {
                  title: 'Monthly Cost',
                  value: 'Predictable Plans',
                  desc: 'Clear monthly pricing for hosting, maintenance, and ongoing support.'
                },
                {
                  title: 'Time to Launch',
                  value: 'Days, Not Months',
                  desc: 'Use ready templates and go live quickly without long development delays.'
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-muted/30 p-5 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.title}</p>
                  <h3 className="mt-2 text-xl font-bold text-foreground">{item.value}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-background p-6 text-left">
              <h3 className="text-lg font-bold text-foreground">What You Usually Need First</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>1. A professional homepage and service pages</li>
                <li>2. Fast mobile-friendly layout and custom domain support</li>
                <li>3. Easy editing so your team can update content anytime</li>
                <li>4. SEO-ready page titles, descriptions, and structure</li>
              </ul>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  View Monthly Plans
                </Link>
                <Link
                  href="/website-design-price-philippines"
                  className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Read Full Cost Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-28 bg-muted/30 border-y border-border reveal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-14 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
                No tech headache. Follow three simple steps and your website is ready.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  step: '1',
                  title: 'Choose a Template',
                  desc: 'Pick a style that matches your business and local customers.'
                },
                {
                  step: '2',
                  title: 'Send Your Business Details',
                  desc: 'Share your logo, services, photos, contact info, and promos.'
                },
                {
                  step: '3',
                  title: 'Launch and Edit Anytime',
                  desc: 'Go live, update your content anytime, and request design changes when needed.'
                }
              ].map((item) => (
                <div key={item.step} className="p-6 bg-background rounded-2xl border border-border shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Template Preview Carousel */}
        <section id="template-previews" className="py-16 sm:py-28 bg-background reveal">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Preview Our <span className="text-primary">Website Templates</span>
                </h2>
                <p className="text-muted-foreground">
                  Swipe to view sample styles for different local businesses. You can start with any template, then change text, photos, and sections anytime.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  These are sample looks only. You can request your own brand colors and style.
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('light')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      previewMode === 'light' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('dark')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      previewMode === 'dark' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollTemplates('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous templates"
                  className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-all"
                >
                  <ArrowLeftIcon weight="bold" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTemplates('right')}
                  disabled={!canScrollRight}
                  aria-label="Next templates"
                  className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-all"
                >
                  <ArrowRightIcon weight="bold" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin"
              onMouseEnter={() => setAutoScrollPaused(true)}
              onMouseLeave={() => setAutoScrollPaused(false)}
              onTouchStart={() => setAutoScrollPaused(true)}
              onTouchEnd={() => setAutoScrollPaused(false)}
            >
              {templatePreviews.map((template) => (
                <article
                  key={template.name}
                  className="min-w-[85%] sm:min-w-[48%] lg:min-w-[31%] snap-start rounded-3xl border border-border bg-card/60 backdrop-blur-sm shadow-sm p-4 sm:p-5"
                >
                  <div className="rounded-2xl border border-border/60 h-52 sm:h-56 lg:h-60 relative overflow-hidden bg-muted">
                    <Image
                      src={template.lightImage}
                      alt={`${template.name} website template preview in light mode`}
                      fill
                      className={`object-cover object-top transition-opacity duration-500 ease-in-out ${
                        previewMode === 'light' ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 31vw"
                    />
                    <Image
                      src={template.darkImage}
                      alt={`${template.name} website template preview in dark mode`}
                      fill
                      className={`object-cover object-top transition-opacity duration-500 ease-in-out ${
                        previewMode === 'dark' ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 31vw"
                    />
                    <div className="absolute inset-0 bg-black/75 pointer-events-none" />
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.bestFor}</p>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">{template.vibe}</p>
                  </div>

                  <div className="pt-4">
                    <Link
                      href={primaryHref}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      Use this template
                      <ArrowRightIcon weight="bold" className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="sm:hidden flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => scrollTemplates('left')}
                disabled={!canScrollLeft}
                aria-label="Previous templates"
                className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-all"
              >
                <ArrowLeftIcon weight="bold" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTemplates('right')}
                disabled={!canScrollRight}
                aria-label="Next templates"
                className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center disabled:opacity-40 hover:bg-muted transition-all"
              >
                <ArrowRightIcon weight="bold" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 sm:py-32 bg-background reveal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Everything You Need to <span className="text-primary">Grow Locally.</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">Simple tools for daily business use, written in clear language and easy actions.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[
                {
                  icon: <LightningIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Fast Setup',
                  desc: 'Start from a ready template so your site can go live quickly.',
                  className: 'col-span-1'
                },
                {
                  icon: <DeviceMobileIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Mobile Friendly',
                  desc: 'Your website looks good on phones, tablets, and desktops.',
                  className: 'col-span-1'
                },
                {
                  icon: <ShieldCheckIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Managed for You',
                  desc: 'Hosting, updates, and maintenance are handled so you can focus on customers.',
                  className: 'col-span-1'
                },
                {
                  icon: <LayoutIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Easy Content Editing',
                  desc: 'Update text, services, photos, promos, and contact details anytime.',
                  className: 'col-span-1'
                },
                {
                  icon: <GlobeIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'Custom Domain Ready',
                  desc: 'Use your own domain to look professional and easier to find online.',
                  className: 'col-span-1'
                },
                {
                  icon: <CheckCircleIcon weight="duotone" className="w-5 h-5 sm:w-6 sm:h-6" />,
                  title: 'SEO-Friendly Pages',
                  desc: 'Help people find your business on Google with better page titles and descriptions.',
                  className: 'col-span-1'
                }
              ].map((feature, i) => (
                <div key={i} className={`p-4 sm:p-6 bg-muted/30 rounded-2xl border border-border hover:border-primary/20 transition-all group flex flex-col justify-between ${feature.className}`}>
                  <div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-background rounded-lg sm:rounded-xl flex items-center justify-center text-primary mb-3 sm:mb-4 shadow-sm border border-border group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-primary leading-tight">{feature.title}</h3>
                    <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-40 reveal">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-8 lg:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">Ready to put your business online?</h2>
                <p className="text-lg opacity-90">Get a clean, editable website with affordable setup and monthly plans for local businesses in the Philippines.</p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-sm mx-auto">
                  <Link
                    href={primaryHref}
                    className="flex-1 px-6 py-3 bg-white text-primary rounded-full text-sm font-bold hover:scale-105 transition-all shadow-xl flex items-center justify-center"
                  >
                    {primaryLabel}
                  </Link>
                  <Link
                    href="/contact"
                    className="flex-1 px-6 py-3 bg-white/15 border border-white/35 text-white rounded-full text-sm font-bold hover:bg-white/25 transition-all flex items-center justify-center"
                  >
                    Request a Design
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
