'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, LayoutTemplate, Mail, Menu, SendHorizontal, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type MenuItem = {
  name: string
  href: string
}

export interface HeroTemplatePreviewItem {
  name: string
  lightImage: string
  darkImage?: string
}

export interface HeroSectionProps {
  className?: string
  showHeader?: boolean
  menuItems?: MenuItem[]
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  templatePreviews?: HeroTemplatePreviewItem[]
  previewMode?: 'light' | 'dark'
  badgeLabel?: string
  title?: string
  description?: string
  points?: string[]
  emailPlaceholder?: string
}

const defaultMenuItems: MenuItem[] = [
  { name: 'Features', href: '#how-it-works' },
  { name: 'Templates', href: '#template-previews' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/contact' },
]

const defaultTemplatePreviews: HeroTemplatePreviewItem[] = [
  {
    name: 'Car Detailing',
    lightImage: '/cardetaillight.png',
    darkImage: '/cardetailingdark.png',
  },
  {
    name: 'Construction',
    lightImage: '/constructionlight.png',
    darkImage: '/constructiondark.png',
  },
  {
    name: 'HVAC Services',
    lightImage: '/hvaclight.png',
    darkImage: '/hvacdark.png',
  },
  {
    name: 'Law Firm',
    lightImage: '/lawyerlight.png',
    darkImage: '/lawyerdark.png',
  },
  {
    name: 'Medical Clinic',
    lightImage: '/medicallight.png',
    darkImage: '/medicaldark.png',
  },
  {
    name: 'Pest Control',
    lightImage: '/pestlight.png',
    darkImage: '/pestdark.png',
  },
  {
    name: 'Portfolio',
    lightImage: '/portfoliolight.png',
    darkImage: '/portfoliodark.png',
  },
  {
    name: 'Real Estate',
    lightImage: '/realestatelight.png',
    darkImage: '/realestatedark.png',
  },
  {
    name: 'Startup',
    lightImage: '/stratuplight.png',
    darkImage: '/startupdark.png',
  },
]

export function HeroSection({
  className,
  showHeader = false,
  menuItems = defaultMenuItems,
  primaryHref = '/login?mode=signup',
  primaryLabel = 'Get Started',
  secondaryHref,
  secondaryLabel,
  templatePreviews = defaultTemplatePreviews,
  previewMode = 'light',
  badgeLabel,
  title = 'Affordable Website Design in the Philippines for Local Businesses',
  description = 'Looking for website design price in the Philippines, small business website packages, or monthly website maintenance? Start with ready templates, launch fast, and edit anytime.',
  points = ['Transparent setup + monthly plans', 'SEO-ready pages for local search', 'Launch fast with editable templates'],
  emailPlaceholder = 'Your email address',
}: HeroSectionProps) {
  const [menuState, setMenuState] = useState(false)
  const hasTopControls = Boolean(badgeLabel || (secondaryHref && secondaryLabel))
  const resolvedCards = (templatePreviews.length > 0 ? templatePreviews : defaultTemplatePreviews).map((template) => ({
    name: template.name,
    image: previewMode === 'dark' ? template.darkImage || template.lightImage : template.lightImage,
  }))
  const topCards = resolvedCards.slice(0, 3)
  const bottomCards = resolvedCards.slice(3, 7)

  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-background text-foreground', className)}>
      {showHeader ? (
        <header>
          <nav
            data-state={menuState && 'active'}
            className="group fixed z-20 w-full border-b border-border bg-background/95 backdrop-blur md:relative"
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                <div className="flex w-full justify-between lg:w-auto">
                  <Link href="/" aria-label="home" className="flex items-center gap-2">
                    <LayoutTemplate className="size-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">EstabWeb</span>
                  </Link>

                  <button
                    onClick={() => setMenuState(!menuState)}
                    aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                  >
                    <Menu className="m-auto size-6 duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                    <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
                  </button>
                </div>

                <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border bg-background p-6 shadow-2xl shadow-black/10 group-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                  <div className="lg:pr-4">
                    <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                      {menuItems.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href} className="block text-muted-foreground duration-150 hover:text-foreground">
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/login?mode=signup">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      ) : null}

      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-12 lg:h-[calc(100vh-4rem)] lg:min-h-[620px] lg:max-h-[760px] lg:py-8">
        {hasTopControls ? (
          <div className={cn('relative z-20 flex items-start gap-4', badgeLabel ? 'justify-between' : 'justify-end')}>
            {badgeLabel ? (
              <Link href="/" className="flex w-fit items-center gap-2 rounded-lg border border-border bg-background/80 p-1 pr-3">
                <span className="rounded-[calc(var(--radius)-0.25rem)] bg-muted px-2 py-1 text-xs text-foreground">New</span>
                <span className="text-sm">{badgeLabel}</span>
                <span className="block h-4 w-px bg-border" />
                <ArrowRight className="size-4" />
              </Link>
            ) : null}

            {secondaryHref && secondaryLabel ? (
              <Button asChild variant="outline" size="sm">
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}

        <div
          className={cn(
            'relative z-20 mx-auto max-w-[760px] text-center lg:mx-0 lg:text-left',
            hasTopControls ? 'mt-6' : 'mt-8 lg:mt-0 lg:absolute lg:left-6 lg:top-1/2 lg:-translate-y-1/2'
          )}
        >
          <h1 className="text-balance text-4xl font-bold leading-[1.02] text-foreground sm:text-5xl lg:text-5xl xl:text-6xl [@media(min-width:1024px)_and_(max-height:900px)]:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-base text-muted-foreground sm:text-lg lg:mx-0 lg:text-lg [@media(min-width:1024px)_and_(max-height:900px)]:text-base">
            {description}
          </p>

          <form className="mx-auto my-5 max-w-[560px] lg:mx-0 [@media(min-width:1024px)_and_(max-height:900px)]:my-4" onSubmit={(event) => event.preventDefault()}>
            <div className="relative grid grid-cols-[1fr_auto] items-center rounded-[1rem] border border-border bg-background/80 pr-1 shadow-xl shadow-black/10 ring-offset-background has-[input:focus]:ring-2 has-[input:focus]:ring-muted">
              <Mail className="pointer-events-none absolute inset-y-0 left-5 my-auto size-5 text-muted-foreground" />
              <input
                placeholder={emailPlaceholder}
                className="h-14 w-full bg-transparent pl-12 text-foreground placeholder:text-muted-foreground focus:outline-none"
                type="email"
              />
              <div className="md:pr-1.5 lg:pr-0">
                <Button asChild aria-label="submit">
                  <Link href={primaryHref}>
                    <span className="hidden md:block">{primaryLabel}</span>
                    <SendHorizontal className="relative mx-auto size-5 md:hidden" strokeWidth={2} />
                  </Link>
                </Button>
              </div>
            </div>
          </form>

          <ul className="mx-auto w-fit list-inside list-disc space-y-1 text-left text-base text-foreground sm:text-lg lg:mx-0 lg:text-base [@media(min-width:1024px)_and_(max-height:900px)]:text-sm">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden lg:hidden">
          <div className="absolute left-1/2 top-28 -translate-x-1/2 space-y-3">
            <div className="flex gap-2">
              {topCards.slice(0, 3).map((template, index) => (
                <article
                  key={`m-top-${template.name}`}
                  className={cn(
                    'shrink-0 overflow-hidden rounded-lg border border-border bg-card/70',
                    index === 0 ? 'opacity-45' : 'opacity-85'
                  )}
                >
                  <div className="relative h-[78px] w-[132px]">
                    <Image
                      src={template.image}
                      alt={`${template.name} template preview`}
                      fill
                      className="object-cover object-top"
                      sizes="132px"
                    />
                  </div>
                </article>
              ))}
            </div>
            <div className="flex gap-2 opacity-70">
              {bottomCards.slice(0, 3).map((template) => (
                <article key={`m-bottom-${template.name}`} className="shrink-0 overflow-hidden rounded-lg border border-border bg-card/40">
                  <div className="relative h-[56px] w-[96px]">
                    <Image
                      src={template.image}
                      alt={`${template.name} template preview`}
                      fill
                      className="object-cover object-top"
                      sizes="96px"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-background/70 to-background/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/45 via-background/20 to-background/5" />
          <div className="absolute inset-0 backdrop-blur-[1.1px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden lg:block">
          <div className="absolute inset-0 border-y border-border/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,hsl(var(--primary)/0.12),transparent_55%)]" />

          <div className="absolute left-[24%] right-0 top-36 space-y-7">
            <div className="flex gap-4">
              {topCards.map((template, index) => (
                <article
                  key={template.name}
                  className={cn(
                    'shrink-0 overflow-hidden rounded-xl border border-border bg-card/70 shadow-xl shadow-black/20',
                    index === 0 ? 'opacity-45' : 'opacity-90'
                  )}
                >
                  <div className="relative h-[188px] w-[320px]">
                    <Image
                      src={template.image}
                      alt={`${template.name} template preview`}
                      fill
                      className="scale-[1.03] object-cover object-top"
                      sizes="320px"
                    />
                  </div>
                  <div className="border-t border-border bg-background/80 px-3 py-2">
                    <p className="text-sm text-muted-foreground">{template.name}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="h-px bg-border/70" />

            <div className="flex gap-4">
              {bottomCards.map((template, index) => (
                <article
                  key={template.name}
                  className={cn(
                    'shrink-0 overflow-hidden rounded-xl border border-border bg-card/40',
                    index < 2 ? 'opacity-30' : 'opacity-75'
                  )}
                >
                  <div className="relative h-[120px] w-[206px]">
                    <Image
                      src={template.image}
                      alt={`${template.name} template preview`}
                      fill
                      className="scale-[1.04] object-cover object-top"
                      sizes="206px"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-background from-[18%] via-background/85 via-[38%] to-transparent to-[88%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/18 via-transparent to-background/35" />
          <div className="absolute inset-y-0 left-0 w-[74%] bg-background/6 backdrop-blur-[1.2px]" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/28 via-background/12 to-transparent" />
        </div>

      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[clamp(40px,5vw,88px)] bg-gradient-to-l from-background/18 to-transparent lg:block"
      />
    </section>
  )
}
