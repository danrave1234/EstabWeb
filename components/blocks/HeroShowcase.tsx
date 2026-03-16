"use client"

import Image from "next/image"

import { trackEvent } from "@/components/shared/Analytics"
import DynamicIcon from "@/components/shared/DynamicIcon"

type HeroMetric = {
  label: string
  value: string
}

export type HeroShowcaseProps = {
  badge?: string
  title: string
  subtitle: string
  primaryCTA: string
  secondaryCTA: string
  primaryCTAHref?: string
  secondaryCTAHref?: string
  imageUrl?: string
  trustPoints?: string[]
  metrics?: HeroMetric[]
}

export default function HeroShowcase({
  badge = "Trusted by local businesses",
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  primaryCTAHref = "#contact",
  secondaryCTAHref = "#services",
  imageUrl,
  trustPoints = [],
  metrics = [],
}: HeroShowcaseProps) {
  const isExternalImage = imageUrl?.startsWith("http")

  return (
    <section className="container mx-auto overflow-x-hidden px-4 py-14 sm:px-6 md:py-20 lg:py-28 reveal">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <span className="inline-flex max-w-full items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            {badge}
          </span>
          <h1 className="break-words text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl break-words text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={primaryCTAHref}
              onClick={() =>
                trackEvent({
                  type: "cta_click",
                  section_key: "hero_showcase",
                  cta_id: "primary",
                })
              }
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
            >
              {primaryCTA}
            </a>
            <a
              href={secondaryCTAHref}
              onClick={() =>
                trackEvent({
                  type: "cta_click",
                  section_key: "hero_showcase",
                  cta_id: "secondary",
                })
              }
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
            >
              {secondaryCTA}
            </a>
          </div>

          {trustPoints.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {trustPoints.map((point, index) => (
                <span
                  key={`${point}-${index}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <DynamicIcon name="Check" className="h-3.5 w-3.5 text-primary" />
                  <span className="break-words">{point}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            {imageUrl ? (
              isExternalImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Showcase
              </div>
            )}
          </div>

          {metrics.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {metrics.slice(0, 4).map((metric, index) => (
                <div key={`${metric.label}-${index}`} className="rounded-xl border border-border/70 bg-background p-3">
                  <p className="break-words text-lg font-bold text-foreground">{metric.value}</p>
                  <p className="break-words text-xs text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
