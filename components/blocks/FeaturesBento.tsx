"use client"

import DynamicIcon from "@/components/shared/DynamicIcon"

export type FeaturesBentoItem = {
  title: string
  description: string
  icon?: string
  eyebrow?: string
}

export type FeaturesBentoProps = {
  title?: string
  subtitle?: string
  items: FeaturesBentoItem[]
}

export default function FeaturesBento({
  title = "Services Built for Growth",
  subtitle = "Flexible blocks inspired by modern component systems, tuned for business websites.",
  items = [],
}: FeaturesBentoProps) {
  if (!items.length) return null

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background reveal">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {items.map((item, index) => {
            const wide = index % 3 === 0
            return (
              <article
                key={`${item.title}-${index}`}
                className={`rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  wide ? "md:col-span-4" : "md:col-span-2"
                }`}
              >
                {item.eyebrow && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                    {item.eyebrow}
                  </p>
                )}
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <DynamicIcon name={item.icon || "Sparkles"} className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
