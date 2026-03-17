import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Design Price Philippines (2026 Guide) | EstabWeb',
  description:
    'A practical guide to business website pricing in the Philippines: setup cost, monthly plans, maintenance, and what to prioritize for small businesses.',
  keywords: [
    'website design philippines price',
    'small business website philippines',
    'website maintenance cost per month philippines',
    'affordable web design philippines',
    'website builder philippines',
  ],
}

export default function WebsiteDesignPricePhilippinesPage() {
  return (
    <main className="bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Pricing Guide</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Website Design Price in the Philippines for Small Businesses
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-lg">
            If you are comparing website costs, focus on total value: one-time setup, predictable monthly fees,
            and how quickly your business can go live.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Setup Cost',
              answer: 'Usually a one-time fee based on pages, branding, and initial content work.',
            },
            {
              title: 'Monthly Cost',
              answer: 'Typically covers hosting, maintenance, updates, and support.',
            },
            {
              title: 'Launch Timeline',
              answer: 'Template-first builds can launch in days instead of months.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-base font-bold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-background p-6">
          <h2 className="text-xl font-bold">What Affects Website Price?</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>1. Number of sections and pages needed</li>
            <li>2. Type of business and content requirements (clinic, gym, restaurant, etc.)</li>
            <li>3. Need for custom domain, lead forms, or advanced features</li>
            <li>4. Ongoing edits, support, and maintenance scope</li>
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-background p-6">
          <h2 className="text-xl font-bold">Frequently Asked Pricing Questions</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <details className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                How much does a simple business website cost in the Philippines?
              </summary>
              <p className="mt-2">
                Most businesses start with a small setup fee plus a monthly plan. The exact amount depends on scope,
                number of pages, and support level.
              </p>
            </details>
            <details className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Is monthly website maintenance worth it?
              </summary>
              <p className="mt-2">
                Yes, especially for small teams. It keeps your site secure, updated, and reliable while you focus on
                daily operations.
              </p>
            </details>
            <details className="rounded-xl border border-border p-4">
              <summary className="cursor-pointer font-semibold text-foreground">
                Can I edit content myself after launch?
              </summary>
              <p className="mt-2">
                Yes. EstabWeb sites are built for easy editing so you can update services, images, promos, and contact
                details anytime.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-10 text-center">
          <div className="inline-flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              View Plans
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Talk to Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
