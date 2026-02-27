import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildConfigSummary } from "@/lib/ai/buildConfigSummary"
import { getPlansConfig } from "@/lib/plans-config-server"
import { buildAutoSeoDefaults, type AutoSeoResult } from "@/lib/seo/autoSeo"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent"

type StructuredDataType = "localbusiness" | "faq" | "article"

interface SeoVariant {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  og?: {
    title?: string
    description?: string
    image?: string
  }
  robots?: {
    noindex?: boolean
    nofollow?: boolean
  }
  structuredData?: {
    enabled?: boolean
    type?: StructuredDataType
  }
}

function asText(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim()
}

function truncateAtWord(value: string, max: number): string {
  const text = asText(value)
  if (text.length <= max) return text
  const sliced = text.slice(0, max + 1)
  const lastSpace = sliced.lastIndexOf(" ")
  if (lastSpace > 20) return sliced.slice(0, lastSpace).trim()
  return text.slice(0, max).trim()
}

function normalizeTitle(value: unknown, fallback: string): string {
  const candidate = asText(value) || fallback
  let title = truncateAtWord(candidate, 60)
  if (title.length < 20) {
    title = truncateAtWord(fallback, 60)
  }
  if (!title) {
    title = "Professional Services"
  }
  return title
}

function normalizeDescription(value: unknown, fallback: string): string {
  const candidate = asText(value) || fallback
  let description = truncateAtWord(candidate, 155)
  if (description.length < 60) {
    description = truncateAtWord(fallback, 155)
  }
  if (!description) {
    description = "Professional services tailored to your needs."
  }
  return description
}

function sanitizeKeyword(value: unknown): string {
  const text = asText(value)
  if (!text) return ""
  return truncateAtWord(text.replace(/[^\w\s&-]/g, "").replace(/\s+/g, " "), 48)
}

function normalizeKeywords(raw: unknown, fallback: string[]): string[] {
  const base = Array.isArray(raw)
    ? raw
    : typeof raw === "string"
      ? raw.split(",")
      : []

  const seen = new Set<string>()
  const out: string[] = []

  for (const item of [...base, ...fallback]) {
    const keyword = sanitizeKeyword(item)
    if (!keyword) continue
    const key = keyword.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(keyword)
    if (out.length >= 8) break
  }

  return out.slice(0, 8)
}

function normalizeCanonical(value: unknown, fallback: string): string {
  const candidate = asText(value)
  if (!candidate || !candidate.startsWith("/")) return fallback
  const normalized = `/${candidate.replace(/^\/+|\/+$/g, "")}`
  return normalized === "/" ? "/" : normalized
}

function normalizeStructuredData(raw: unknown, fallback: AutoSeoResult["structuredData"]): SeoVariant["structuredData"] {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const rawType = asText(source.type).toLowerCase()
  const type: StructuredDataType =
    rawType === "faq" || rawType === "article" || rawType === "localbusiness"
      ? rawType
      : fallback.type

  return {
    enabled: typeof source.enabled === "boolean" ? source.enabled : fallback.enabled,
    type,
  }
}

function normalizeVariant(raw: unknown, fallback: AutoSeoResult): SeoVariant {
  const source = raw && typeof raw === "object" ? (raw as Record<string, any>) : {}
  const title = normalizeTitle(source.title, fallback.title)
  const description = normalizeDescription(source.description, fallback.description)
  const keywords = normalizeKeywords(source.keywords, fallback.keywords)
  const canonical = normalizeCanonical(source.canonical, fallback.canonical)

  const ogSource = source.og && typeof source.og === "object" ? source.og : {}
  const ogTitle = normalizeTitle(ogSource.title, title)
  const ogDescription = normalizeDescription(ogSource.description, description)
  const ogImage = asText(ogSource.image) || fallback.og.image

  const robotsSource = source.robots && typeof source.robots === "object" ? source.robots : {}

  return {
    title,
    description,
    keywords,
    canonical,
    og: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { image: ogImage } : {}),
    },
    robots: {
      noindex: typeof robotsSource.noindex === "boolean" ? robotsSource.noindex : fallback.robots.noindex,
      nofollow: typeof robotsSource.nofollow === "boolean" ? robotsSource.nofollow : fallback.robots.nofollow,
    },
    structuredData: normalizeStructuredData(source.structuredData, fallback.structuredData),
  }
}

function titleQuality(title: string): number {
  const len = asText(title).length
  if (len >= 30 && len <= 60) return 3
  if (len >= 20 && len <= 70) return 2
  if (len > 0) return 1
  return 0
}

function descriptionQuality(description: string): number {
  const len = asText(description).length
  if (len >= 80 && len <= 155) return 3
  if (len >= 60 && len <= 170) return 2
  if (len > 0) return 1
  return 0
}

function keywordsQuality(keywords: string[]): number {
  const count = Array.isArray(keywords) ? keywords.length : 0
  if (count >= 3 && count <= 8) return 2
  if (count > 0) return 1
  return 0
}

function improveAgainstBaseline(raw: unknown, baseline: AutoSeoResult): SeoVariant {
  const base = normalizeVariant(baseline, baseline)
  const candidate = normalizeVariant(raw, baseline)

  const title =
    titleQuality(candidate.title) >= titleQuality(base.title)
      ? candidate.title
      : base.title
  const description =
    descriptionQuality(candidate.description) >= descriptionQuality(base.description)
      ? candidate.description
      : base.description

  const mergedKeywords = normalizeKeywords(
    [...candidate.keywords, ...base.keywords],
    base.keywords
  )
  const keywords =
    keywordsQuality(mergedKeywords) >= keywordsQuality(base.keywords)
      ? mergedKeywords
      : base.keywords

  const ogTitle = normalizeTitle(candidate.og?.title, title)
  const ogDescription = normalizeDescription(candidate.og?.description, description)

  return {
    title,
    description,
    keywords,
    canonical: base.canonical,
    og: {
      title: ogTitle,
      description: ogDescription,
      image: asText(candidate.og?.image) || base.og?.image,
    },
    robots: base.robots,
    structuredData: base.structuredData,
  }
}

function parseJsonLoose(rawText: string): any {
  const cleaned = rawText.replace(/```json|```/g, "").trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const firstBrace = cleaned.indexOf("{")
    const lastBrace = cleaned.lastIndexOf("}")
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const candidate = cleaned.slice(firstBrace, lastBrace + 1)
      return JSON.parse(candidate)
    }
    throw new Error("AI response is not valid JSON")
  }
}

function uniqueByTitle(variants: SeoVariant[]): SeoVariant[] {
  const seen = new Set<string>()
  const out: SeoVariant[] = []
  for (const variant of variants) {
    const key = variant.title.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(variant)
    if (out.length >= 3) break
  }
  return out
}

function buildFallbackVariants(base: AutoSeoResult): SeoVariant[] {
  const primaryKeyword = base.keywords[0] || "Professional Services"
  const secondaryKeyword = base.keywords[1] || primaryKeyword
  const brandFromTitle = base.title.includes("|") ? asText(base.title.split("|").pop()) : ""

  const secondTitle = normalizeTitle(
    brandFromTitle ? `${primaryKeyword} Experts | ${brandFromTitle}` : `${primaryKeyword} Experts`,
    base.title
  )
  const thirdTitle = normalizeTitle(
    brandFromTitle ? `${secondaryKeyword} Solutions | ${brandFromTitle}` : `${secondaryKeyword} Solutions`,
    base.title
  )

  const secondDescription = normalizeDescription(
    `${base.description} Speak with our team today for fast support.`,
    base.description
  )
  const thirdDescription = normalizeDescription(
    `${base.description} Get clear pricing and next steps in minutes.`,
    base.description
  )

  const variants: SeoVariant[] = [
    normalizeVariant(base, base),
    normalizeVariant(
      {
        title: secondTitle,
        description: secondDescription,
        keywords: [primaryKeyword, ...base.keywords],
        canonical: base.canonical,
      },
      base
    ),
    normalizeVariant(
      {
        title: thirdTitle,
        description: thirdDescription,
        keywords: [secondaryKeyword, ...base.keywords],
        canonical: base.canonical,
      },
      base
    ),
  ]

  return uniqueByTitle(variants)
}

async function incrementAiUsage(projectId: string, currentCount: number | null) {
  if (!projectId || currentCount === null) return
  try {
    const supabase = await createClient()
    await supabase
      .from("projects")
      .update({ ai_usage_count: currentCount + 1 })
      .eq("id", projectId)
  } catch (err) {
    console.error("Failed to increment AI usage count:", err)
  }
}

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const { projectId, pageIndex = 0, businessType, currentContent } = body || {}

  let pageContext = ""
  let configForSeo: Record<string, any> = {}
  let activePage: Record<string, any> = {}
  let currentUsageCount: number | null = null

  if (projectId && typeof projectId === "string") {
    try {
      const supabase = await createClient()
      const { data: proj } = await supabase
        .from("projects")
        .select("draft_config, current_config, ai_usage_count, ai_usage_limit, subscription_plan_id")
        .eq("id", projectId)
        .single()

      if (proj) {
        const { PLANS } = await getPlansConfig()
        const planId = proj.subscription_plan_id || "free"
        const baseLimit = PLANS[planId]?.aiGenerationsLimit ?? 10
        const finalLimit = proj.ai_usage_limit ?? baseLimit
        const usageCount = Number(proj.ai_usage_count ?? 0)
        currentUsageCount = usageCount

        if (usageCount >= finalLimit) {
          return NextResponse.json(
            { error: `AI generation limit reached (${finalLimit}). Please upgrade your plan or contact support.` },
            { status: 429 }
          )
        }

        configForSeo =
          (proj.draft_config as Record<string, any>) ??
          (proj.current_config as Record<string, any>) ??
          {}

        const pages: any[] = Array.isArray(configForSeo.pages) ? configForSeo.pages : []
        activePage = (pages[pageIndex] ?? pages[0] ?? {}) as Record<string, any>
        const activeSections: string[] = Array.isArray(activePage?.activeSections)
          ? activePage.activeSections
          : Array.isArray(configForSeo.activeSections)
            ? configForSeo.activeSections
            : []

        const colorTheme = typeof configForSeo.colorTheme === "string" ? configForSeo.colorTheme : "partner"
        const typographyStyle = typeof configForSeo.typographyStyle === "string" ? configForSeo.typographyStyle : "elegant"

        pageContext = buildConfigSummary(
          activeSections,
          configForSeo,
          colorTheme,
          typographyStyle,
          activePage?.label ?? "Home",
          activePage?.slug ?? "",
          pages
        )
      }
    } catch {
      // Non-fatal: continue with minimal context and deterministic fallback
    }
  }

  if (!pageContext) {
    if (!businessType && !currentContent?.title && !currentContent?.description) {
      return NextResponse.json({ error: "Insufficient context" }, { status: 400 })
    }
    const parts: string[] = []
    if (businessType) parts.push(`Business type: ${businessType}`)
    if (currentContent?.title) parts.push(`Current SEO title: ${currentContent.title}`)
    if (currentContent?.description) parts.push(`Current SEO description: ${currentContent.description}`)
    if (Array.isArray(currentContent?.keywords) && currentContent.keywords.length > 0) {
      parts.push(`Current keywords: ${currentContent.keywords.join(", ")}`)
    }
    pageContext = parts.join("\n")
  }

  let seoFallback = buildAutoSeoDefaults({
    config: configForSeo,
    page: activePage,
    pageSlug: asText(activePage?.slug),
    pageLabel: asText(activePage?.label) || "Home",
    domain: asText(businessType) || "business",
  })

  if (!configForSeo || Object.keys(configForSeo).length === 0) {
    seoFallback = {
      ...seoFallback,
      title: normalizeTitle(currentContent?.title, seoFallback.title),
      description: normalizeDescription(currentContent?.description, seoFallback.description),
      keywords: normalizeKeywords(currentContent?.keywords, seoFallback.keywords),
      og: {
        ...seoFallback.og,
        title: normalizeTitle(currentContent?.title, seoFallback.og.title || seoFallback.title),
        description: normalizeDescription(currentContent?.description, seoFallback.og.description || seoFallback.description),
      },
    }
  }

  const prompt = `You are a senior local SEO strategist and copywriter.
Goal: produce 3 high-quality SEO variants that improve click-through intent while staying faithful to the website content.

WEBSITE CONTENT:
${pageContext}

CURRENT SEO (if any):
- title: "${currentContent?.title || "(none)"}"
- description: "${currentContent?.description || "(none)"}"
- keywords: ${Array.isArray(currentContent?.keywords) && currentContent.keywords.length > 0 ? currentContent.keywords.join(", ") : "(none)"}

BASELINE SEO DEFAULTS (must be your minimum quality floor):
${JSON.stringify({
    title: seoFallback.title,
    description: seoFallback.description,
    keywords: seoFallback.keywords,
    canonical: seoFallback.canonical,
    og: seoFallback.og,
    robots: seoFallback.robots,
    structuredData: seoFallback.structuredData,
  })}

Hard rules:
1) Start from BASELINE SEO DEFAULTS and improve only where quality can be increased.
2) Never make any variant weaker than baseline for:
   - title usefulness/clarity
   - description clarity/intent
   - keyword coverage relevance
3) Use only claims/services present in WEBSITE CONTENT. No invented certifications, guarantees, or awards.
4) Local intent is required when location signals exist in content (city/area/neighborhood/"near me" intent).
5) Produce 3 meaningfully different variants:
   - Variant A: trust/authority angle
   - Variant B: speed/convenience angle
   - Variant C: value/outcome angle
6) Keep brand alignment and natural language; avoid keyword stuffing.
7) Ensure the primary service keyword appears as close to the beginning of the title as possible for maximum ranking weight.

Field constraints:
- title: 30 to 60 chars, high intent, readable
- description: 80 to 155 chars, includes value + action
- keywords: 3 to 8 concise phrases, no duplicates
- canonical: keep baseline canonical unless clearly invalid; must start with "/"
- og.title and og.description should align with chosen title/description
- robots: keep crawlable/indexable booleans from baseline unless invalid
- structuredData.type must be one of: localbusiness, faq, article
- structuredData.enabled remains true

Output format:
- Return raw JSON only (no markdown, no comments)
- Return exactly:
{"variants":[{"title":"...","description":"...","keywords":["..."],"canonical":"...","og":{"title":"...","description":"..."},"robots":{"noindex":false,"nofollow":false},"structuredData":{"enabled":true,"type":"localbusiness"}}]}`

  let variants: SeoVariant[] = []
  let aiCallSucceeded = false

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Gemini SEO error:", err)
      variants = buildFallbackVariants(seoFallback)
    } else {
      aiCallSucceeded = true
      const geminiData = await res.json()
      const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

      try {
        const parsed = parseJsonLoose(rawText)
        const rawVariants: any[] = Array.isArray(parsed?.variants)
          ? parsed.variants
          : parsed && typeof parsed === "object" && (parsed.title || parsed.description)
            ? [parsed]
            : []

        variants = uniqueByTitle(
          rawVariants
            .slice(0, 3)
            .map((rawVariant) => improveAgainstBaseline(rawVariant, seoFallback))
            .filter((variant) => variant.title && variant.description)
        )
      } catch (parseError) {
        console.error("AI SEO parse error:", parseError)
        variants = buildFallbackVariants(seoFallback)
      }
    }
  } catch (err) {
    console.error("AI SEO request error:", err)
    variants = buildFallbackVariants(seoFallback)
  }

  if (variants.length === 0) {
    variants = buildFallbackVariants(seoFallback)
  }

  if (aiCallSucceeded && projectId && typeof projectId === "string") {
    await incrementAiUsage(projectId, currentUsageCount)
  }

  return NextResponse.json({ variants: variants.slice(0, 3) })
}
