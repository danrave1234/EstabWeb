import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeConfig } from "@/lib/utils"
import { BLOCK_REGISTRY } from "@/lib/utils/block-registry"
import { validateOperations } from "@/lib/utils/validateOperations"
import { COLOR_THEME_SWATCHES, TYPOGRAPHY_OPTIONS } from "@/config/dashboard-config"
import { buildConfigSummary } from "@/lib/ai/buildConfigSummary"
import { SECTION_FIELD_SCHEMA } from "@/lib/ai/section-field-schema"
import type { Operation } from "@/lib/utils/applyOperations"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent"

const VALID_SECTION_IDS = BLOCK_REGISTRY.filter((b) => !b.legacy).map((b) => b.id)
const VALID_COLOR_THEMES = Object.keys(COLOR_THEME_SWATCHES)
const VALID_TYPOGRAPHY_STYLES = TYPOGRAPHY_OPTIONS.map((t) => t.value)
const MAX_PROMPT_LENGTH = 500

const HERO_FIELDS_BY_THEME: Record<string, string[]> = {
  "pest-control": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  clinic: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  dentist: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "imageUrl", "cityName", "benefitText", "trustSignals"],
  chiropractor: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "backgroundVideoUrl", "benefitText", "trustSignals"],
  cleaning: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "beforeImageUrl", "afterImageUrl", "singleImageUrl", "benefitText", "trustSignals"],
  pool: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  startup: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "stats"],
  lawyer: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  "real-estate-modern": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "featuredPropertyImage", "statOneValue", "statOneLabel", "statTwoValue", "statTwoLabel", "statThreeValue", "statThreeLabel"],
  "before-after": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "beforeImageUrl", "afterImageUrl", "benefitText", "trustSignals"],
  "before-after-split": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "beforeImageUrl", "afterImageUrl", "benefitText", "trustSignals"],
  industrial: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  "clean-delivery": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  "luxury-soft": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  "academic-clean": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  "hvac-urgent": ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
  gym: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals", "stats"],
  ecommerce: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals", "stats"],
  authority: ["title", "subtitle", "primaryCTA", "primaryCTAHref", "secondaryCTA", "secondaryCTAHref", "backgroundImage", "benefitText", "trustSignals"],
}

const FOOTER_FIELDS_BY_STYLE: Record<string, string[]> = {
  "lead-magnet": ["tagline", "formHeading", "formSubmitText", "formThankYouText", "contactUsLabel", "callUsNowLabel", "contactLabel", "followLabel", "privacyLabel", "termsLabel", "cookieLabel", "privacyUrl", "termsUrl", "cookieUrl", "showSocial", "showContact", "contact.email", "contact.phone", "contact.address", "social.facebook", "social.twitter", "social.linkedin", "social.instagram", "social.facebookEnabled", "social.twitterEnabled", "social.linkedinEnabled", "social.instagramEnabled"],
  simple: ["tagline", "privacyLabel", "termsLabel", "cookieLabel", "privacyUrl", "termsUrl", "cookieUrl", "showSocial", "showContact", "contact.email", "contact.phone", "contact.address", "social.facebook", "social.twitter", "social.linkedin", "social.instagram", "social.facebookEnabled", "social.twitterEnabled", "social.linkedinEnabled", "social.instagramEnabled"],
  minimal: ["tagline", "privacyLabel", "termsLabel", "cookieLabel", "privacyUrl", "termsUrl", "cookieUrl", "showSocial", "contact.email", "contact.phone", "contact.address", "social.facebook", "social.twitter", "social.linkedin", "social.instagram", "social.facebookEnabled", "social.twitterEnabled", "social.linkedinEnabled", "social.instagramEnabled"],
}

function getFooterFieldsForStyle(footerStyle: string): string[] {
  return FOOTER_FIELDS_BY_STYLE[footerStyle] ?? FOOTER_FIELDS_BY_STYLE["lead-magnet"]
}

function getHeroFieldsForTheme(colorTheme: string): string[] {
  return HERO_FIELDS_BY_THEME[colorTheme] ?? HERO_FIELDS_BY_THEME.authority
}

function buildSystemPrompt(
  activeSections: string[],
  config: Record<string, any>,
  currentColorTheme: string,
  currentTypographyStyle: string,
  maxSections: number,
  maxPages: number,
  currentPageCount: number
): string {
  const configSummary = buildConfigSummary(activeSections, config, currentColorTheme, currentTypographyStyle)
  const heroFields = getHeroFieldsForTheme(currentColorTheme)
  const activeFooterStyle = (config.footerStyle as string) ?? "lead-magnet"
  const footerFields = getFooterFieldsForStyle(activeFooterStyle)
  const fullSchema = {
    hero: heroFields,
    ...SECTION_FIELD_SCHEMA,
  }

  return `You are an AI site editor for the EstabWeb admin template builder.

VALID SECTION KEYS (you may ONLY use these):
${VALID_SECTION_IDS.join(", ")}

CURRENT SITE SUMMARY:
${configSummary}

ADMIN TEMPLATE RULES:
- You are editing the current shared template draft used by admins before handoff.
- Keep changes realistic, reusable, and easy for an admin to review manually afterward.
- Prefer improving the existing template rather than inventing a completely different business.

LIMITS:
- Max sections allowed: ${maxSections}
- Current section count: ${activeSections.length}
- Max pages allowed: ${maxPages}
- Current page count: ${currentPageCount}

VALID COLOR THEMES (for update_global colorTheme):
${VALID_COLOR_THEMES.join(", ")}

VALID TYPOGRAPHY STYLES (for update_global typographyStyle):
${VALID_TYPOGRAPHY_STYLES.join(", ")}

FOOTER FIELDS FOR \"${activeFooterStyle}\": ${footerFields.join(", ")}

SECTION FIELD SCHEMA (for update_section — only use these fields per section):
${Object.entries(fullSchema).map(([k, v]) => `  ${k}: ${v.join(", ")}`).join("\n")}

Return raw JSON only with:
1. \"summary\" — one or two sentences.
2. \"operations\" — an array of structured operations.

Allowed operations only:
- { "type": "add_section", "sectionKey": string, "position"?: number, "pageSlug"?: string }
- { "type": "remove_section", "sectionKey": string, "pageSlug"?: string }
- { "type": "update_section", "sectionKey": string, "changes": object, "pageSlug"?: string }
- { "type": "replace_section", "sectionKey": string, "newSectionKey": string, "data"?: object, "pageSlug"?: string }
- { "type": "reorder_sections", "newOrder": string[], "pageSlug"?: string }
- { "type": "update_global", "changes": { "colorTheme"?: string, "typographyStyle"?: string, "darkMode"?: boolean, "headerStyle"?: "solid"|"floating"|"tubelight"|"megamenu", "footerStyle"?: string, "brand"?: { "name"?: string, "logoUrl"?: string, "ctaHref"?: string }, "navigation"?: { "name": string, "href": string }[], "footer"?: object } }
- { "type": "add_page", "slug": string, "label": string, "sections"?: string[] }

STRICT RULES:
- Return raw JSON only. No markdown. No code fences.
- Never return the full config.
- Never hallucinate unknown section keys.
- Use "replace_section" whenever you are swapping one section variant for another, especially for homepage hero changes like "hero" -> "hero--modern" or "hero--gym" -> "hero--showcase".
- When you replace a hero variant, also include targeted "update_section" changes for the new hero so the preview is immediately useful.
- Never modify domain, subscription_status, script, pages, activeSections directly, or any field not listed above.
- Never include raw HTML in any string value, EXCEPT inside update_section for sectionKey "custom-html" using fields "html" and "css".
- Keep operations minimal and targeted. Maximum 10 operations total.
- Match the business context already present in the CURRENT SITE SUMMARY. Do not invent a new business name or location unless the user explicitly asks.
- Prefer clean, human-made agency-quality structure over gimmicky or overdesigned ideas.
`
}

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { prompt, currentConfig } = body

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Prompt too short" }, { status: 400 })
    }
    if (prompt.trim().length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed.` },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    const isAdmin = profile?.role === "admin" || profile?.role === "sub_admin"
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: storedConfig } = await supabase
      .from("site_config")
      .select("payload")
      .eq("key", "template_master")
      .single()

    const persistedConfig = normalizeConfig((storedConfig?.payload as Record<string, any>) ?? {})
    const hasSnapshotConfig = currentConfig && typeof currentConfig === "object" && !Array.isArray(currentConfig)
    const config = hasSnapshotConfig ? normalizeConfig(currentConfig as Record<string, any>) : persistedConfig

    const pages: any[] = Array.isArray(config.pages) ? config.pages : []
    const homePage = pages.find((page) => {
      const slug = typeof page?.slug === "string" ? page.slug.trim() : ""
      return slug.length === 0
    })
    const activeSections: string[] = Array.isArray(homePage?.activeSections)
      ? homePage.activeSections.filter((id: unknown): id is string => typeof id === "string")
      : Array.isArray(config.activeSections)
        ? config.activeSections.filter((id: unknown): id is string => typeof id === "string")
        : []

    const currentPageCount = pages.length || 1
    const maxPages = 10
    const maxSections = 20
    const currentColorTheme = typeof config.colorTheme === "string" ? config.colorTheme : "partner"
    const currentTypographyStyle = typeof config.typographyStyle === "string" ? config.typographyStyle : "elegant"

    const fullPrompt = `${buildSystemPrompt(activeSections, config, currentColorTheme, currentTypographyStyle, maxSections, maxPages, currentPageCount)}\n\nUSER REQUEST:\n"${prompt.trim()}"`

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Template AI edit Gemini error:", errText)
      return NextResponse.json({ error: "AI request failed" }, { status: 502 })
    }

    const geminiData = await geminiRes.json()
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    const cleaned = rawText.replace(/```json|```/g, "").trim()

    let parsed: { summary: string; operations: Operation[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error("Failed to parse template AI edit response:", cleaned)
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 422 })
    }

    if (!parsed.summary || !Array.isArray(parsed.operations)) {
      return NextResponse.json(
        { error: "AI response missing required fields (summary, operations)." },
        { status: 422 }
      )
    }

    const validation = validateOperations(parsed.operations, activeSections, maxSections, maxPages, currentPageCount)
    if (!validation.valid && validation.sanitizedOperations.length === 0) {
      return NextResponse.json(
        { error: "AI proposed invalid operations.", details: validation.errors },
        { status: 422 }
      )
    }

    return NextResponse.json({
      summary: parsed.summary,
      operations: validation.sanitizedOperations,
      warnings: validation.errors.length > 0 ? validation.errors : undefined,
    })
  } catch (e: any) {
    console.error("template-ai-edit error:", e)
    return NextResponse.json({ error: e?.message || "Internal server error" }, { status: 500 })
  }
}
