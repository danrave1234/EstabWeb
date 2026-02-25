/**
 * POST /api/ai/editor-command
 *
 * Accepts a natural-language prompt and current project config,
 * calls Gemini, and returns { summary, operations } — never raw config.
 * Operations are validated against BLOCK_REGISTRY before being returned.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { BLOCK_REGISTRY } from "@/lib/utils/block-registry"
import { validateOperations } from "@/lib/utils/validateOperations"
import { getPlanLimits, getMaxPagesForProject } from "@/lib/utils/site-pages"
import type { Operation } from "@/lib/utils/applyOperations"
import { COLOR_THEME_SWATCHES, TYPOGRAPHY_OPTIONS } from "@/config/dashboard-config"
import { buildConfigSummary } from "@/lib/ai/buildConfigSummary"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent"

/** Canonical (non-legacy) section IDs exposed to the AI */
const VALID_SECTION_IDS = BLOCK_REGISTRY.filter((b) => !b.legacy).map((b) => b.id)

/** Derived from project's single source of truth in dashboard-config */
const VALID_COLOR_THEMES = Object.keys(COLOR_THEME_SWATCHES)
const VALID_TYPOGRAPHY_STYLES = TYPOGRAPHY_OPTIONS.map((t) => t.value)

/** Max prompt length to prevent token abuse */
const MAX_PROMPT_LENGTH = 500

/**
 * Editable text/content fields per section key.
 * Derived from each block's TypeScript prop types.
 * This tells the AI exactly what fields it can populate via update_section.
 */
/**
 * Per-theme hero field schemas.
 * Keys match the colorTheme values used in HERO_BY_THEME in SiteBlockRenderer.
 * "authority" is the fallback for any theme not listed in HERO_BY_THEME.
 */
const HERO_FIELDS_BY_THEME: Record<string, string[]> = {
  // HeroPestControl — pest control businesses
  "pest-control": [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "benefitText",
    "trustSignals",  // string[] e.g. ["Licensed & Insured", "Same-Day Service"]
  ],
  // HeroClinic — medical clinics, hospitals
  clinic: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "benefitText",
    "trustSignals",
  ],
  // HeroDentist — dental clinics
  dentist: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "imageUrl",      // foreground image
    "cityName",      // shown in headline e.g. "in Manila"
    "benefitText",
    "trustSignals",
  ],
  // HeroChiropractor — chiro, physio, wellness
  chiropractor: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "backgroundVideoUrl",  // optional background video
    "benefitText",
    "trustSignals",
  ],
  // HeroCleaning — cleaning services
  cleaning: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "beforeImageUrl",  // before/after image pair
    "afterImageUrl",
    "singleImageUrl",
    "benefitText",
    "trustSignals",
  ],
  // HeroPool — pool & spa services
  pool: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "benefitText",
    "trustSignals",
  ],
  // HeroSaas — SaaS, tech, startups
  startup: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "icon",
  ],
  // HeroBlock — generic service businesses
  generic: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "icon",
  ],
  // HeroAuthority — authority layout (fallback for all other themes)
  // layout values: full-screen | split | industrial | bright-clean | soft-luxury | structured-split | hvac-urgent | hvac-blue | before-after | cleaning-fresh
  authority: [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "backgroundImage",
    "benefitText",
    "localCoverage",  // e.g. "Metro Manila & Nearby Provinces"
    "promoText",      // promo ribbon text
    "layout",         // visual layout variant (see values above)
    "trustBadges",    // array of { label, icon } objects
  ],
}

/** Themes that map to a named component; everything else → HeroAuthority */
const HERO_BY_THEME_KEYS = new Set(["pest-control", "clinic", "dentist", "chiropractor", "cleaning", "pool", "startup", "generic"])

/**
 * Editable fields per footer style variant.
 * Matches the actual prop types of each footer component.
 */
const FOOTER_FIELDS_BY_STYLE: Record<string, string[]> = {
  // LeadMagnetFooter — richest variant, has lead capture form + social toggles
  "lead-magnet": [
    "tagline",
    "formHeading", "formSubmitText", "formThankYouText",
    "contactUsLabel", "callUsNowLabel",
    "privacyLabel", "termsLabel", "cookieLabel",
    "privacyUrl", "termsUrl", "cookieUrl",
    "showSocial", "showContact",
    "contact.email", "contact.phone", "contact.address",
    "social.facebook", "social.twitter", "social.linkedin", "social.instagram",
    "social.facebookEnabled", "social.twitterEnabled", "social.linkedinEnabled", "social.instagramEnabled",
  ],
  // SimpleFooter — has navigation links + contact labels
  simple: [
    "tagline",
    "contactLabel", "followLabel",
    "privacyLabel", "termsLabel", "cookieLabel",
    "privacyUrl", "termsUrl", "cookieUrl",
    "contact.email", "contact.phone", "contact.address",
    "social.facebook", "social.twitter", "social.linkedin", "social.instagram",
    "navigation[].name", "navigation[].href",
  ],
  // MinimalFooter — bare footer, just tagline + contact + legal links
  minimal: [
    "tagline",
    "privacyUrl", "termsUrl", "cookieUrl",
    "contact.email", "contact.phone", "contact.address",
    "social.facebook", "social.twitter", "social.linkedin", "social.instagram",
  ],
}

/** Returns the footer fields for the active footerStyle */
function getFooterFieldsForStyle(footerStyle: string): string[] {
  return FOOTER_FIELDS_BY_STYLE[footerStyle] ?? FOOTER_FIELDS_BY_STYLE["lead-magnet"]
}

/** Returns the hero fields for a given colorTheme */
function getHeroFieldsForTheme(colorTheme: string): string[] {
  if (HERO_BY_THEME_KEYS.has(colorTheme)) return HERO_FIELDS_BY_THEME[colorTheme]
  return HERO_FIELDS_BY_THEME["authority"]
}

const SECTION_FIELD_SCHEMA: Record<string, string[]> = {
  // hero fields are injected dynamically per theme — see getHeroFieldsForTheme()
  // HeroEmergency uses a separate section key
  "hero--emergency": [
    "title", "subtitle",
    "primaryCTA", "primaryCTAHref",
    "secondaryCTA", "secondaryCTAHref",
    "imageUrl", "icon",
  ],
  // Contact variants
  contact:            ["tagline", "formHeading", "formSubmitText", "formThankYouText", "email", "phone", "address"],
  "contact--minimal": ["tagline", "formHeading", "formSubmitText", "email", "phone", "address"],
  "contact--visual":  ["tagline", "formHeading", "formSubmitText", "email", "phone", "address"],
  "contact--with-map":["tagline", "formHeading", "email", "phone", "address", "mapEmbedUrl"],
  "contact--columns": ["tagline", "formHeading", "email", "phone", "address"],
  "contact--split":   ["tagline", "formHeading", "email", "phone", "address"],
  // FAQ
  faq:                ["title", "subtitle", "items[].question", "items[].answer"],
  "faq--two-column":  ["title", "subtitle", "items[].question", "items[].answer"],
  // Features / Services
  features:           ["title", "subtitle", "features[].title", "features[].description", "features[].icon"],
  services:           ["title", "subtitle", "items[].title", "items[].description", "items[].icon"],
  "services--modern": ["title", "subtitle", "items[].title", "items[].description"],
  "services--highlight": ["title", "subtitle", "items[].title", "items[].description"],
  // Testimonials
  testimonials:       ["title", "subtitle", "testimonials[].quoteTitle", "testimonials[].body", "testimonials[].customerName"],
  "testimonials--grid": ["title", "subtitle", "testimonials[].quoteTitle", "testimonials[].body", "testimonials[].customerName"],
  // Pricing
  pricing:            ["title", "subtitle", "plans[].name", "plans[].price", "plans[].description", "plans[].buttonText"],
  "pricing--subscription": ["title", "subtitle", "plans[].name", "plans[].price", "plans[].description", "plans[].buttonText"],
  // Process
  process:            ["title", "subtitle", "steps[].title", "steps[].description", "steps[].number"],
  "process--timeline":["title", "subtitle", "steps[].title", "steps[].description"],
  // Stats
  stats:              ["title", "subtitle", "items[].label", "items[].value"],
  // CTA variants
  cta:                ["title", "subtitle", "ctaText", "ctaHref"],
  "cta--emergency":   ["title", "subtitle", "ctaText", "ctaHref", "phone"],
  "cta--promo-strip": ["text", "buttonText", "buttonHref"],
  "cta--sticky":      ["text", "buttonText", "buttonHref"],
  // Announcement bar
  announcement_bar:           ["text", "buttonText", "buttonHref", "countdownDate"],
  "announcement_bar--promo":  ["text", "buttonText", "buttonHref", "countdownDate"],
  "announcement_bar--emergency": ["text", "buttonText", "buttonHref"],
  "announcement_bar--offer":  ["text", "buttonText", "buttonHref"],
  // Booking / Lead capture
  booking:            ["title", "subtitle", "ctaText", "ctaHref"],
  lead_capture:       ["title", "subtitle", "ctaText", "ctaHref"],
  free_consultation:  ["title", "subtitle", "ctaText", "phone"],
  // Trust / Guarantee
  trust:              ["title", "subtitle", "items[].title", "items[].description"],
  guarantee:          ["title", "subtitle", "items[].title", "items[].description"],
  // Coverage / Service area
  service_area:       ["title", "subtitle", "cities", "mapEmbedUrl"],
  "service_area--radius": ["title", "subtitle", "cities", "mapEmbedUrl"],
  // Blog preview
  blog_preview:       ["title", "subtitle"],
  // Gallery
  gallery:            ["title", "subtitle"],
  "gallery--slider":  ["title", "subtitle"],
  // Team
  team:               ["title", "subtitle", "items[].name", "items[].role", "items[].bio"],
  "team--carousel":   ["title", "subtitle", "items[].name", "items[].role"],
  // Certifications / Logos
  certifications:     ["title", "items[].name"],
  logo_cloud:         ["title", "items[].name"],
}

function buildSystemPrompt(
  activeSections: string[],
  config: Record<string, any>,
  validSections: string[],
  currentColorTheme: string,
  currentTypographyStyle: string,
  maxSections: number,
  maxPages: number = 1,
  currentPageCount: number = 1
): string {
  const configSummary = buildConfigSummary(activeSections, config, currentColorTheme, currentTypographyStyle)
  const heroFields = getHeroFieldsForTheme(currentColorTheme)
  const heroVariantName = HERO_BY_THEME_KEYS.has(currentColorTheme)
    ? `Hero${currentColorTheme.split("-").map((w: string) => w[0].toUpperCase() + w.slice(1)).join("")}`
    : "HeroAuthority"

  const activeFooterStyle = (config.footerStyle as string) ?? "lead-magnet"
  const footerVariantName =
    activeFooterStyle === "simple" ? "SimpleFooter"
    : activeFooterStyle === "minimal" ? "MinimalFooter"
    : "LeadMagnetFooter"
  const footerFields = getFooterFieldsForStyle(activeFooterStyle)

  const fullSchema = {
    hero: heroFields,
    ...SECTION_FIELD_SCHEMA,
  }

  return `You are an AI site editor for EstabWeb.

VALID SECTION KEYS (you may ONLY use these):
${validSections.join(", ")}

CURRENT SITE SUMMARY:
${configSummary}

PLAN LIMITS:
- Max sections allowed: ${maxSections}
- Current section count: ${activeSections.length}
- Max pages allowed: ${maxPages}
- Current page count: ${currentPageCount}

HERO SECTION — THIS CLIENT'S HERO:
- This site uses colorTheme="${currentColorTheme}", which renders: ${heroVariantName}
- The "hero" sectionKey maps to this component. Use ONLY the fields listed below for hero.
- Do NOT use fields from other hero variants — they will be ignored.
- "trustSignals" (if listed) is a string array e.g. ["Licensed & Insured", "5-Star Rated", "Same-Day Service"].
- "hero--emergency" is a SEPARATE section key for emergency CTA strips (not the main hero).

FOOTER SECTION — THIS CLIENT'S FOOTER:
- This site uses footerStyle="${activeFooterStyle}", which renders: ${footerVariantName}
- To update footer content use update_global with a "footer" object.
- Use ONLY the fields listed below for this footer variant — other fields will be ignored.
- Fields with "contact." prefix go inside footer.contact (e.g. "contact.email" → footer.contact.email).
- Fields with "social." prefix go inside footer.social (e.g. "social.facebook" → footer.social.facebook).
- Fields with "navigation[]." prefix are array items inside footer.navigation.
- Available footer fields for "${activeFooterStyle}": ${footerFields.join(", ")}

BRAND & NAVBAR:
- "brand" object controls the site header: brand.name (business name), brand.logoUrl (logo image URL), brand.ctaHref (header CTA link).
- "navigation" is an array of { name: string, href: string } items shown in the navbar.
- To update brand or navbar use update_global with a "brand" object and/or "navigation" array.
- Current brand: name="${config.brand?.name ?? ""}", ctaHref="${config.brand?.ctaHref ?? ""}"
- Current navigation: ${Array.isArray(config.navigation) && config.navigation.length > 0 ? config.navigation.map((n: any) => `{ name: "${n.name}", href: "${n.href}" }`).join(", ") : "(auto-generated from sections)"}
- headerStyle controls header appearance: "solid" or "floating". Set via update_global.

VALID COLOR THEMES (for update_global colorTheme):
${VALID_COLOR_THEMES.join(", ")}

VALID TYPOGRAPHY STYLES (for update_global typographyStyle):
${VALID_TYPOGRAPHY_STYLES.join(", ")}

SECTION FIELD SCHEMA (for update_section — only use these fields per section):
${Object.entries(fullSchema).map(([k, v]) => `  ${k}: ${v.join(", ")}`).join("\n")}

YOUR TASK:
Analyze the user's request and return a JSON object with:
1. "summary" — one or two sentences describing what you are changing and why.
2. "operations" — an array of structured operations (maximum 10).

OPERATION TYPES (use ONLY these — no others):
- { "type": "add_section", "sectionKey": string, "position"?: number }
- { "type": "remove_section", "sectionKey": string }
- { "type": "update_section", "sectionKey": string, "changes": object }
- { "type": "reorder_sections", "newOrder": string[] }
- { "type": "update_global", "changes": { "colorTheme"?: string, "typographyStyle"?: string, "darkMode"?: boolean, "headerStyle"?: "solid"|"floating", "footerStyle"?: string, "brand"?: { "name"?: string, "logoUrl"?: string, "ctaHref"?: string }, "navigation"?: { "name": string, "href": string }[], "footer"?: { "tagline"?: string, "formHeading"?: string, "formSubmitText"?: string, "formThankYouText"?: string, "contactUsLabel"?: string, "callUsNowLabel"?: string, "contactLabel"?: string, "followLabel"?: string, "privacyLabel"?: string, "termsLabel"?: string, "cookieLabel"?: string, "privacyUrl"?: string, "termsUrl"?: string, "cookieUrl"?: string, "showSocial"?: boolean, "showContact"?: boolean, "contact"?: { "email"?: string, "phone"?: string, "address"?: string }, "social"?: { "facebook"?: string, "twitter"?: string, "linkedin"?: string, "instagram"?: string, "facebookEnabled"?: boolean, "twitterEnabled"?: boolean, "linkedinEnabled"?: boolean, "instagramEnabled"?: boolean } } } }
- { "type": "add_page", "slug": string, "label": string, "sections"?: string[] }  // Only if plan allows more pages (current: ${currentPageCount}/${maxPages})

STRICT RULES:
- Return raw JSON only. No markdown. No code fences. No explanation outside JSON.
- Never return the full config.
- Never hallucinate unknown section keys — only use keys from VALID SECTION KEYS above.
- Never remove the "hero" section.
- Never modify domain, subscription_status, script, pages, activeSections directly, or any field not listed above.
- Never include raw HTML in any string value.
- For update_global, only set colorTheme, typographyStyle, darkMode, footerStyle, or footer sub-fields — nothing else.
- For update_section, never set activeSections, pages, colorTheme, typographyStyle, darkMode, domain, or subscription fields inside changes.
- colorTheme must be one of the VALID COLOR THEMES listed above.
- typographyStyle must be one of the VALID TYPOGRAPHY STYLES listed above.
- Keep operations minimal and targeted. Maximum 10 operations total.
- Do not exceed the plan's max section limit (${maxSections}).
- If the user only asks to change one section, only emit operations for that section. Do NOT touch other sections.
- When updating a section, only include the fields that need to change in "changes". Do NOT re-send fields that are already correct — they will be preserved automatically.
- Match the tone, brand name, city, and business context already present in the CURRENT SITE SUMMARY above. Do not invent a new business name or location unless the user explicitly asks.

EXAMPLE OUTPUT:
{"summary":"Updated hero messaging for urgency and switched to a bold red theme.","operations":[{"type":"update_section","sectionKey":"hero","changes":{"title":"24/7 Emergency Service – We Respond in 30 Minutes","ctaText":"Call Now"}},{"type":"update_global","changes":{"colorTheme":"red-crimson","typographyStyle":"bold"}}]}`
}

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { projectId, prompt } = body

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 })
    }
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

    // Load project config
    const { data: proj, error: projErr } = await supabase
      .from("projects")
      .select(
        "id, draft_config, current_config, subscription_status, trial_ends_at, subscription_ends_at"
      )
      .eq("id", projectId)
      .single()

    if (projErr || !proj) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const config: Record<string, any> =
      (proj.draft_config as Record<string, any>) ??
      (proj.current_config as Record<string, any>) ??
      {}

    const activeSections: string[] = Array.isArray(config.activeSections)
      ? config.activeSections
      : []

    const pages: any[] = Array.isArray(config.pages) ? config.pages : []
    const currentPageCount = pages.length || 1

    // Use plan-based limits — not a hardcoded default
    const planLimits = await getPlanLimits(supabase)
    const maxPages = getMaxPagesForProject(proj, planLimits)
    const isPro = proj.subscription_status === "active" || proj.subscription_status === "trialing"
    const maxSections = isPro ? 20 : 15

    const currentColorTheme = typeof config.colorTheme === "string" ? config.colorTheme : "partner"
    const currentTypographyStyle = typeof config.typographyStyle === "string" ? config.typographyStyle : "elegant"

    const systemPrompt = buildSystemPrompt(
      activeSections,
      config,
      VALID_SECTION_IDS,
      currentColorTheme,
      currentTypographyStyle,
      maxSections,
      maxPages,
      currentPageCount
    )

    const fullPrompt = `${systemPrompt}\n\nUSER REQUEST:\n"${prompt.trim()}"`

    // Call Gemini
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      }),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      console.error("Gemini error:", errText)
      return NextResponse.json({ error: "AI request failed" }, { status: 502 })
    }

    const geminiData = await geminiRes.json()
    const rawText: string =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    // Strip accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim()

    let parsed: { summary: string; operations: Operation[] }
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error("Failed to parse AI response:", cleaned)
      return NextResponse.json(
        { error: "AI returned invalid JSON. Please try again." },
        { status: 422 }
      )
    }

    if (!parsed.summary || !Array.isArray(parsed.operations)) {
      return NextResponse.json(
        { error: "AI response missing required fields (summary, operations)." },
        { status: 422 }
      )
    }

    // Validate operations using plan-based section limit
    const validation = validateOperations(
      parsed.operations,
      activeSections,
      maxSections,
      maxPages,
      currentPageCount
    )

    // If there are hard errors AND no valid operations survived, reject
    if (!validation.valid && validation.sanitizedOperations.length === 0) {
      return NextResponse.json(
        {
          error: "AI proposed invalid operations.",
          details: validation.errors,
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      summary: parsed.summary,
      operations: validation.sanitizedOperations,
      warnings: validation.errors.length > 0 ? validation.errors : undefined,
    })
  } catch (e: any) {
    console.error("editor-command error:", e)
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
