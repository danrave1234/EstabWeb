/**
 * Shared AI context builder used by both the editor-command and SEO routes.
 * Builds a structured, token-efficient summary of the site config for Gemini.
 */
import { getSectionKey } from "@/lib/utils/config-mapping"

/** Recursively extract all meaningful string leaf values from an object */
export function extractText(obj: unknown, maxChars = 300): string {
  if (!obj) return ""
  if (typeof obj === "string") return obj.slice(0, maxChars)
  if (Array.isArray(obj)) {
    let out = ""
    for (const item of obj) {
      const t = extractText(item, maxChars - out.length)
      if (t) out += (out ? " | " : "") + t
      if (out.length >= maxChars) break
    }
    return out
  }
  if (typeof obj === "object") {
    const priority = [
      "title", "heading", "subtitle", "description", "text", "body",
      "question", "answer", "name", "label", "content", "tagline", "ctaText",
    ]
    let out = ""
    for (const key of priority) {
      const val = (obj as Record<string, unknown>)[key]
      if (typeof val === "string" && val.trim()) {
        out += (out ? " | " : "") + val.trim().slice(0, 120)
        if (out.length >= maxChars) break
      }
    }
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (priority.includes(key)) continue
      if (typeof val === "string" && val.trim()) {
        out += (out ? " | " : "") + val.trim().slice(0, 80)
        if (out.length >= maxChars) break
      } else if (typeof val === "object" && val !== null) {
        const nested = extractText(val, maxChars - out.length)
        if (nested) out += (out ? " | " : "") + nested
        if (out.length >= maxChars) break
      }
    }
    return out.slice(0, maxChars)
  }
  return ""
}

/**
 * Build a structured, token-efficient config summary for the AI.
 * Used by both /api/ai/editor-command and /api/ai/seo.
 *
 * @param activeSections  List of active section IDs for the current page
 * @param config          Full site config (draft_config or current_config)
 * @param colorTheme      Current color theme string
 * @param typographyStyle Current typography style string
 * @param pageLabel       Label of the current page (e.g. "Home", "About")
 * @param pageSlug        Slug of the current page (e.g. "", "about")
 * @param allPages        All pages in config.pages (for multi-page context)
 */
export function buildConfigSummary(
  activeSections: string[],
  config: Record<string, any>,
  colorTheme: string,
  typographyStyle: string,
  pageLabel?: string,
  pageSlug?: string,
  allPages?: any[]
): string {
  const lines: string[] = []

  // Brand / business identity
  const brandName = config.brand?.name ?? config.businessName
  if (brandName) lines.push(`Brand name: "${brandName}"`)
  if (config.tagline) lines.push(`Tagline: "${String(config.tagline).slice(0, 100)}"`)

  const siteTheme = typeof config.theme === "string" ? config.theme : "generic"
  lines.push(`Business type / theme: "${siteTheme}"`)
  lines.push(`Color theme: "${colorTheme}", Typography: "${typographyStyle}", Dark mode: ${!!config.darkMode}`)

  // Location — critical for local SEO
  const addr = config.contact?.address ?? config.contact?.location ?? config.location ?? ""
  const city = config.contact?.city ?? config.city ?? ""
  const country = config.contact?.country ?? config.country ?? ""
  const locationStr = [city, country].filter(Boolean).join(", ") || addr
  if (locationStr) lines.push(`Location: "${String(locationStr).slice(0, 100)}"`)

  // Current page
  if (pageLabel !== undefined) {
    lines.push(`Current page: "${pageLabel}" (slug: "/${pageSlug ?? ""}")`)
  }

  // Active sections — deep content extraction
  if (activeSections.length > 0) {
    lines.push(`\nActive sections (${activeSections.length}): ${activeSections.join(", ")}`)
    for (const id of activeSections) {
      const configKey = getSectionKey(id)
      const sd = config[configKey] ?? config[id]
      if (!sd || typeof sd !== "object") continue

      const parts: string[] = []

      // Scalar text fields
      if (typeof sd.title === "string" && sd.title) parts.push(`title: "${sd.title.slice(0, 120)}"`)
      if (typeof sd.subtitle === "string" && sd.subtitle) parts.push(`subtitle: "${sd.subtitle.slice(0, 120)}"`)
      if (typeof sd.heading === "string" && sd.heading) parts.push(`heading: "${sd.heading.slice(0, 120)}"`)
      if (typeof sd.tagline === "string" && sd.tagline) parts.push(`tagline: "${sd.tagline.slice(0, 120)}"`)
      if (typeof sd.description === "string" && sd.description) parts.push(`description: "${sd.description.slice(0, 120)}"`)
      if (typeof sd.body === "string" && sd.body) parts.push(`body: "${sd.body.slice(0, 120)}"`)
      if (typeof sd.ctaText === "string" && sd.ctaText) parts.push(`ctaText: "${sd.ctaText.slice(0, 80)}"`)
      if (typeof sd.primaryCTA === "string" && sd.primaryCTA) parts.push(`primaryCTA: "${sd.primaryCTA.slice(0, 80)}"`)
      if (typeof sd.secondaryCTA === "string" && sd.secondaryCTA) parts.push(`secondaryCTA: "${sd.secondaryCTA.slice(0, 80)}"`)
      if (typeof sd.benefitText === "string" && sd.benefitText) parts.push(`benefitText: "${sd.benefitText.slice(0, 120)}"`)
      if (typeof sd.promoText === "string" && sd.promoText) parts.push(`promoText: "${sd.promoText.slice(0, 80)}"`)
      if (typeof sd.localCoverage === "string" && sd.localCoverage) parts.push(`localCoverage: "${sd.localCoverage.slice(0, 80)}"`)
      if (typeof sd.cityName === "string" && sd.cityName) parts.push(`cityName: "${sd.cityName}"`)
      if (typeof sd.phone === "string" && sd.phone) parts.push(`phone: "${sd.phone}"`)
      if (typeof sd.email === "string" && sd.email) parts.push(`email: "${sd.email}"`)
      if (typeof sd.address === "string" && sd.address) parts.push(`address: "${sd.address.slice(0, 80)}"`)
      // Bio paragraphs (attorney profile, about sections)
      if (typeof sd.bioParagraph1 === "string" && sd.bioParagraph1) parts.push(`bio: "${sd.bioParagraph1.slice(0, 150)}"`)
      if (typeof sd.bioParagraph2 === "string" && sd.bioParagraph2) parts.push(`bio2: "${sd.bioParagraph2.slice(0, 150)}"`)
      // Headline + bullets (free consultation, promo sections)
      if (typeof sd.headline === "string" && sd.headline) parts.push(`headline: "${sd.headline.slice(0, 100)}"`)
      if (typeof sd.bullet1 === "string" && sd.bullet1) parts.push(`bullet1: "${sd.bullet1.slice(0, 100)}"`)
      if (typeof sd.bullet2 === "string" && sd.bullet2) parts.push(`bullet2: "${sd.bullet2.slice(0, 100)}"`)
      if (typeof sd.bullet3 === "string" && sd.bullet3) parts.push(`bullet3: "${sd.bullet3.slice(0, 100)}"`)

      // Trust signals
      if (Array.isArray(sd.trustSignals) && sd.trustSignals.length > 0) {
        parts.push(`trustSignals: [${sd.trustSignals.slice(0, 3).map((s: string) => `"${s}"`).join(", ")}]`)
      }

      // Services — extract names + descriptions
      if (Array.isArray(sd.services) && sd.services.length > 0) {
        const serviceText = sd.services
          .slice(0, 6)
          .map((s: any) => [s.name ?? s.title, s.description ?? s.subtitle].filter(Boolean).join(": "))
          .filter(Boolean)
          .join(" | ")
        if (serviceText) parts.push(`services: ${serviceText.slice(0, 200)}`)
      }

      // FAQ
      if (Array.isArray(sd.faqs) && sd.faqs.length > 0) {
        const faqText = sd.faqs
          .slice(0, 4)
          .map((f: any) => [f.question ?? f.q, f.answer ?? f.a].filter(Boolean).join(": "))
          .filter(Boolean)
          .join(" | ")
        if (faqText) parts.push(`faqs: ${faqText.slice(0, 200)}`)
      }

      // Team
      if (Array.isArray(sd.members) && sd.members.length > 0) {
        const teamText = sd.members
          .slice(0, 4)
          .map((m: any) => [m.name, m.role ?? m.title].filter(Boolean).join(" - "))
          .filter(Boolean)
          .join(", ")
        if (teamText) parts.push(`team: ${teamText.slice(0, 120)}`)
      }

      // Generic items — extract title + description like services
      if (Array.isArray(sd.items) && sd.items.length > 0) {
        const itemText = sd.items
          .slice(0, 6)
          .map((item: any) => [item.title ?? item.name ?? item.label, item.description ?? item.subtitle ?? item.text].filter(Boolean).join(": "))
          .filter(Boolean)
          .join(" | ")
        if (itemText) parts.push(`items: ${itemText.slice(0, 250)}`)
      }

      // Features
      if (Array.isArray(sd.features) && sd.features.length > 0) {
        const featText = sd.features
          .slice(0, 5)
          .map((f: any) => (typeof f === "string" ? f : f.title ?? f.name ?? f.text ?? ""))
          .filter(Boolean)
          .join(", ")
        if (featText) parts.push(`features: ${featText.slice(0, 150)}`)
      }

      // Testimonials — array form
      if (Array.isArray(sd.testimonials) && sd.testimonials.length > 0) {
        const testText = sd.testimonials
          .slice(0, 3)
          .map((t: any) => t.text ?? t.quote ?? t.body ?? "")
          .filter(Boolean)
          .join(" | ")
        if (testText) parts.push(`testimonials: ${testText.slice(0, 150)}`)
      }
      // Testimonial — singular object form (e.g. { testimonial: { quote, author } })
      if (sd.testimonial && typeof sd.testimonial === "object") {
        const q = sd.testimonial.quote ?? sd.testimonial.text ?? ""
        const a = sd.testimonial.author ?? ""
        if (q) parts.push(`testimonial: "${q.slice(0, 150)}"${a ? ` — ${a}` : ""}`)
      }

      // Steps
      if (Array.isArray(sd.steps) && sd.steps.length > 0) {
        const first = sd.steps[0]
        const firstPreview = typeof first?.title === "string" ? ` (e.g. "${first.title.slice(0, 50)}")` : ""
        parts.push(`steps: ${sd.steps.length}${firstPreview}`)
      }

      // Plans / tiers / pricing
      if (Array.isArray(sd.plans) && sd.plans.length > 0) {
        const first = sd.plans[0]
        const firstPreview = typeof first?.name === "string" ? ` (e.g. "${first.name}")` : ""
        parts.push(`plans: ${sd.plans.length}${firstPreview}`)
      }
      if (Array.isArray(sd.tiers) && sd.tiers.length > 0) {
        const first = sd.tiers[0]
        const firstPreview = typeof first?.name === "string" ? ` (e.g. "${first.name}")` : ""
        parts.push(`tiers: ${sd.tiers.length}${firstPreview}`)
      }

      // Gym / Schedule classes
      if (Array.isArray(sd.days) && sd.days.length > 0) {
        parts.push(`schedule_days: ${sd.days.length}`)
      }

      // Results / Success stories
      if (Array.isArray(sd.stories) && sd.stories.length > 0) {
        const testText = sd.stories
          .slice(0, 3)
          .map((t: any) => t.quote ?? t.result ?? "")
          .filter(Boolean)
          .join(" | ")
        if (testText) parts.push(`stories: ${testText.slice(0, 150)}`)
      }

      // Coverage / Maps
      if (Array.isArray(sd.cities) && sd.cities.length > 0) {
        const t = sd.cities.slice(0, 5).filter((c: any) => typeof c === "string").join(", ")
        if (t) parts.push(`cities: ${t}`)
      }
      if (Array.isArray(sd.areas) && sd.areas.length > 0) {
        const t = sd.areas.slice(0, 5).filter((c: any) => typeof c === "string").join(", ")
        if (t) parts.push(`areas: ${t}`)
      }

      // Blogs / articles
      if (Array.isArray(sd.posts) && sd.posts.length > 0) {
        const t = sd.posts.slice(0, 3).map((p: any) => p.title ?? p.headline).filter(Boolean).join(", ")
        if (t) parts.push(`posts: ${t}`)
      }

      if (parts.length) lines.push(`  [${id}]: ${parts.join(", ")}`)
    }
  }

  // Navigation — supports both { navigation: { links: [] } } and { navigation: [] }
  const navLinks: any[] = Array.isArray(config.navigation?.links)
    ? config.navigation.links
    : Array.isArray(config.navigation)
      ? config.navigation
      : []
  if (navLinks.length > 0) {
    lines.push(`\nNavbar links: ${navLinks.map((l: any) => l.label ?? l.name ?? l.href).join(", ")}`)
  }

  // Other pages
  const pages = allPages ?? (Array.isArray(config.pages) ? config.pages : [])
  if (pages.length > 1) {
    lines.push(`Other pages: ${pages.map((p: any) => `"${p.label}" (/${p.slug ?? ""})`).join(", ")}`)
  }

  // Footer
  const footerStyle = config.footerStyle ?? "lead-magnet"
  lines.push(`\nFooter style: "${footerStyle}"`)
  if (config.footer && typeof config.footer === "object") {
    const f = config.footer
    if (typeof f.tagline === "string") lines.push(`Footer tagline: "${f.tagline.slice(0, 80)}"`)
    if (typeof f.formHeading === "string") lines.push(`Footer form heading: "${f.formHeading.slice(0, 60)}"`)
  }

  // Contact
  if (config.contact?.phone) lines.push(`Phone: "${config.contact.phone}"`)
  if (config.contact?.email) lines.push(`Email: "${config.contact.email}"`)

  return lines.join("\n")
}
