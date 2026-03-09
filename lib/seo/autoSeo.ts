export type StructuredDataType = "localbusiness" | "faq" | "article"

export interface AutoSeoResult {
  title: string
  description: string
  keywords: string[]
  canonical: string
  og: {
    title: string
    description: string
    image?: string
  }
  robots: {
    noindex: boolean
    nofollow: boolean
  }
  structuredData: {
    enabled: boolean
    type: StructuredDataType
  }
}

interface BuildAutoSeoInput {
  config?: Record<string, any> | null
  page?: Record<string, any> | null
  pageSlug?: string
  pageLabel?: string
  domain?: string
}

const TITLE_MIN = 30
const TITLE_MAX = 60
const DESC_MIN = 80
const DESC_MAX = 155

function asText(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim()
}

function pickFirstText(...values: Array<unknown>): string {
  for (const value of values) {
    const text = asText(value)
    if (text) return text
  }
  return ""
}

function truncateAtWord(value: string, max: number): string {
  const text = asText(value)
  if (text.length <= max) return text
  const sliced = text.slice(0, max + 1)
  const lastSpace = sliced.lastIndexOf(" ")
  if (lastSpace > 20) return sliced.slice(0, lastSpace).trim()
  return text.slice(0, max).trim()
}

function humanizeSlug(slug: string): string {
  const clean = asText(slug).replace(/^\/+|\/+$/g, "")
  if (!clean) return "Home"
  return clean
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function formatDomainAsBrand(domain: string): string {
  if (!domain) return "Business"
  // e.g. 'lawthings.online' -> 'lawthings'
  const withoutTld = domain.split(".")[0] || domain
  // e.g. 'law-things' -> 'Law Things', 'lawthings' -> 'Lawthings'
  return withoutTld
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function sanitizeKeyword(value: unknown): string {
  const text = asText(value)
  if (!text) return ""
  const cleaned = text.replace(/[^\w\s&-]/g, "").replace(/\s+/g, " ").trim()
  return truncateAtWord(cleaned, 48)
}

function uniqueKeywords(values: Array<unknown>, limit = 8): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    const keyword = sanitizeKeyword(value)
    if (!keyword) continue
    const key = keyword.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(keyword)
    if (out.length >= limit) break
  }
  return out
}

function normalizeCanonical(rawCanonical: unknown, pageSlug: string): string {
  const fallback = pageSlug ? `/${pageSlug.replace(/^\/+|\/+$/g, "")}` : "/"
  const canonical = asText(rawCanonical)
  if (!canonical || !canonical.startsWith("/")) return fallback
  const clean = `/${canonical.replace(/^\/+|\/+$/g, "")}`
  return clean === "/" ? "/" : clean
}

function readArrayTitles(items: unknown, keys: string[] = ["title", "name", "label"]): string[] {
  if (!Array.isArray(items)) return []
  const out: string[] = []
  for (const item of items) {
    if (!item || typeof item !== "object") continue
    for (const key of keys) {
      const text = asText((item as Record<string, unknown>)[key])
      if (text) {
        out.push(text)
        break
      }
    }
  }
  return out
}

function getLocation(config: Record<string, any>): string {
  const city = asText(config?.contact?.city ?? config?.city)
  const region = asText(config?.contact?.region ?? config?.region ?? config?.state)
  const country = asText(config?.contact?.country ?? config?.country)
  const byParts = [city, region, country].filter(Boolean).join(", ")
  if (byParts) return byParts
  const address = asText(config?.contact?.address ?? config?.location)
  if (!address) return ""
  return truncateAtWord(address.split(",").slice(0, 2).join(", "), 60)
}

function inferStructuredType(page: Record<string, any>): StructuredDataType {
  const sections = Array.isArray(page?.activeSections) ? page.activeSections : []
  const sectionNames = sections
    .filter((item: unknown): item is string => typeof item === "string")
    .map((item) => item.toLowerCase())

  if (sectionNames.some((name) => name.includes("faq"))) return "faq"
  if (sectionNames.some((name) => name.includes("blog") || name.includes("article"))) return "article"
  return "localbusiness"
}

function normalizeTitle(seed: string, brandName: string, location: string, theme: string, serviceHint: string): string {
  let title = asText(seed)
  const mainService = serviceHint || theme || "Professional Services"

  if (!title) {
    if (location) {
      title = `Expert ${mainService} in ${location}`
    } else {
      title = `Top-Rated ${mainService}`
    }
  }

  if (brandName && !title.toLowerCase().includes(brandName.toLowerCase())) {
    title = `${title} | ${brandName}`
  }

  if (location && title.length < TITLE_MIN && !title.toLowerCase().includes(location.toLowerCase())) {
    const withLocation = `${title} in ${location}`
    if (withLocation.length <= TITLE_MAX) {
      title = withLocation
    }
  }

  if (title.length < TITLE_MIN && brandName && mainService) {
    const expanded = `${title} - Trusted ${mainService} Providers`
    if (expanded.length <= TITLE_MAX) {
      title = expanded
    }
  }

  title = truncateAtWord(title, TITLE_MAX)
  if (title.length < 20) {
    title = truncateAtWord(`${brandName || "Business"} | Expert ${mainService}`, TITLE_MAX)
  }

  return title
}

function normalizeDescription(seed: string, brandName: string, serviceHint: string, location: string, theme: string): string {
  let description = asText(seed)
  const mainService = serviceHint || theme || "professional services"
  const where = location ? ` serving the ${location} area` : ""

  if (!description) {
    description = `Looking for top ${mainService.toLowerCase()}${where}? ${brandName || "Our team"} provides expert solutions tailored to your needs. Get a free consultation today.`
  }

  if (description.length < DESC_MIN) {
    const tail = brandName
      ? ` Let ${brandName} help you achieve the best results with our trusted experts.`
      : ` Reach out today for responsive, highly-rated service and trusted results.`
    if (!description.toLowerCase().includes("trusted") && !description.toLowerCase().includes("best results")) {
      description = `${description}${tail}`
    }
  }

  description = truncateAtWord(description, DESC_MAX)
  if (description.length < 40) {
    description = truncateAtWord(
      `Get top-rated ${mainService.toLowerCase()}${where}. ${brandName || "Our business"} is dedicated to delivering quality. Book your appointment now.`,
      DESC_MAX
    )
  }

  return description
}

export function buildAutoSeoDefaults({
  config: rawConfig,
  page: rawPage,
  pageSlug,
  pageLabel,
  domain,
}: BuildAutoSeoInput): AutoSeoResult {
  const config = (rawConfig && typeof rawConfig === "object" ? rawConfig : {}) as Record<string, any>
  const page = (rawPage && typeof rawPage === "object" ? rawPage : {}) as Record<string, any>
  const rawSeo = (
    page?.seo && typeof page.seo === "object"
      ? page.seo
      : config?.seo && typeof config.seo === "object"
        ? config.seo
        : {}
  ) as Record<string, any>

  const slug = asText(pageSlug ?? page?.slug).replace(/^\/+|\/+$/g, "").toLowerCase()
  const label = pickFirstText(pageLabel, page?.label, humanizeSlug(slug))
  const formattedDomain = domain ? formatDomainAsBrand(domain) : "Business"
  let rawBrandName = asText(config?.brand?.name)
  if (rawBrandName.toLowerCase() === "your business name") {
    rawBrandName = ""
  }
  const brandName = pickFirstText(rawBrandName, formattedDomain)
  const location = getLocation(config)
  const theme = asText(config?.theme).replace(/-/g, " ")

  const serviceHints = uniqueKeywords(
    [
      page?.hero?.title,
      config?.hero?.title,
      config?.features?.title,
      config?.practiceAreas?.title,
      ...readArrayTitles(config?.features?.features),
      ...readArrayTitles(config?.practiceAreas?.items),
      ...readArrayTitles(config?.services?.items),
      ...readArrayTitles(config?.serviceAreas?.items),
    ],
    6
  )

  const titleSeed = pickFirstText(rawSeo?.title, label === "Home" ? "" : label, config?.hero?.title, serviceHints[0])
  const title = normalizeTitle(titleSeed, brandName, location, theme, serviceHints[0] || label)

  const descriptionSeed = pickFirstText(
    rawSeo?.description,
    page?.hero?.subtitle,
    config?.hero?.subtitle,
    config?.features?.subtitle,
    config?.practiceAreas?.subtitle,
    config?.contact?.tagline,
    config?.contact?.subtitle,
    config?.footer?.tagline
  )
  const description = normalizeDescription(descriptionSeed, brandName, serviceHints[0] || label, location, theme)

  const configuredKeywords = Array.isArray(rawSeo?.keywords) ? rawSeo.keywords : []
  const keywords = uniqueKeywords(
    configuredKeywords.length > 0
      ? configuredKeywords
      : [
        label,
        `${label} services`,
        brandName,
        theme ? `${theme} services` : "",
        serviceHints[0],
        serviceHints[1],
        location,
        `${brandName} ${serviceHints[0] || "services"}`,
      ],
    8
  )

  while (keywords.length < 3) {
    const fallback = uniqueKeywords(
      [
        `${brandName} services`,
        location ? `${label} ${location}` : `${label} business`,
        theme ? `${theme} business` : "local business",
      ],
      3
    )
    for (const item of fallback) {
      if (!keywords.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
        keywords.push(item)
      }
      if (keywords.length >= 3) break
    }
    if (fallback.length === 0) break
  }

  const canonical = normalizeCanonical(rawSeo?.canonical, slug)
  const robots = {
    // Client-facing pages default to crawlable/indexable.
    noindex: false,
    nofollow: false,
  }

  const ogTitle = normalizeTitle(pickFirstText(rawSeo?.og?.title, title), brandName, location, theme, serviceHints[0] || label)
  const ogDescription = normalizeDescription(
    pickFirstText(rawSeo?.og?.description, description),
    brandName,
    serviceHints[0] || label,
    location,
    theme
  )
  const ogImage = pickFirstText(rawSeo?.og?.image, config?.brand?.logoUrl)

  const inferredType = inferStructuredType(page)
  const rawType = asText(rawSeo?.structuredData?.type).toLowerCase()
  const structuredType: StructuredDataType =
    rawType === "faq" || rawType === "article" || rawType === "localbusiness"
      ? (rawType as StructuredDataType)
      : inferredType

  return {
    title,
    description,
    keywords,
    canonical,
    og: {
      title: ogTitle,
      description: ogDescription,
      image: ogImage || undefined,
    },
    robots,
    structuredData: {
      // Automatically enabled for tenant pages to reduce manual SEO setup.
      enabled: true,
      type: structuredType,
    },
  }
}
