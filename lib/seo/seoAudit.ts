import { BLOCK_MAP } from "@/lib/utils/block-registry"

// ---------------------------------------------------------------------------
// SEO Audit Engine
// Pure computation — no DB, no side effects.
//
// Scoring is always normalized to 0–100 regardless of page count.
// Each page is scored out of 100, then the site score is a weighted average.
// ---------------------------------------------------------------------------

export type IssueSeverity = 'high' | 'medium' | 'low'

export interface AuditIssue {
  severity: IssueSeverity
  message: string
  page?: string
}

export interface PageAuditResult {
  page: string
  score: number
  maxScore: number // always 100
  issues: AuditIssue[]
}

export interface SeoAuditResult {
  score: number
  maxScore: number // always 100
  percentage: number // 0–100
  issues: AuditIssue[]
  pageResults: PageAuditResult[]
}

// ---------------------------------------------------------------------------
// Shared constants — used by both the audit engine and the editor UI
// ---------------------------------------------------------------------------

/** SEO title recommended character range */
export const TITLE_MIN = 30
export const TITLE_MAX = 60
/** Absolute boundaries before penalty applies */
export const TITLE_WARN_MIN = 20
export const TITLE_WARN_MAX = 70

/** Meta description recommended character range */
export const DESC_MIN = 120
export const DESC_MAX = 160
/** Absolute boundaries before penalty applies */
export const DESC_WARN_MIN = 80
export const DESC_WARN_MAX = 170

/** Minimum keywords recommended */
export const KEYWORDS_MIN = 3

// ---------------------------------------------------------------------------
// Score color / label helpers — single source of truth for UI
// ---------------------------------------------------------------------------

/** Score thresholds for color coding. Used by both the editor and audit panel. */
export function scoreColor(pct: number): string {
  if (pct >= 80) return 'text-emerald-500'
  if (pct >= 60) return 'text-amber-500'
  return 'text-red-500'
}

export function scoreBg(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500/10 border-emerald-500/30'
  if (pct >= 60) return 'bg-amber-500/10 border-amber-500/30'
  return 'bg-red-500/10 border-red-500/30'
}

export function scoreBarColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export function scoreLabel(pct: number): string {
  if (pct >= 80) return 'Great'
  if (pct >= 60) return 'Good'
  if (pct >= 40) return 'Needs Work'
  return 'Poor'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = Record<string, any>

/**
 * Audit a single page's SEO block.
 * Returns a score out of 100 for that page.
 *
 * Point breakdown (100 total):
 *   Title        — 25 pts
 *   Description  — 25 pts
 *   H1 (hero)    — 15 pts
 *   Image alts   — 15 pts
 *   Keywords     — 20 pts
 */
function auditSeoBlock(
  seo: AnyConfig | undefined,
  hero: AnyConfig | undefined,
  brand: AnyConfig | undefined,
  pageName: string,
): { score: number; maxScore: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = []
  let score = 0
  const maxScore = 100

  // --- Title (25 pts) ---
  const title: string = seo?.title ?? ''
  if (!title) {
    issues.push({ severity: 'high', message: 'Missing SEO title', page: pageName })
  } else {
    score += 25
    if (title.length < TITLE_WARN_MIN || title.length > TITLE_WARN_MAX) {
      score -= 10
      issues.push({
        severity: 'medium',
        message: `Title is ${title.length} chars — aim for ${TITLE_MIN}–${TITLE_MAX} characters`,
        page: pageName,
      })
    } else if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      score -= 5
      issues.push({
        severity: 'low',
        message: `Title is ${title.length} chars — ideal range is ${TITLE_MIN}–${TITLE_MAX}`,
        page: pageName,
      })
    }
  }

  // --- Meta Description (25 pts) ---
  const description: string = seo?.description ?? ''
  if (!description) {
    issues.push({ severity: 'high', message: 'Missing meta description', page: pageName })
  } else {
    score += 25
    if (description.length < DESC_WARN_MIN || description.length > DESC_WARN_MAX) {
      score -= 10
      issues.push({
        severity: 'medium',
        message: `Description is ${description.length} chars — aim for ${DESC_MIN}–${DESC_MAX} characters`,
        page: pageName,
      })
    } else if (description.length < DESC_MIN || description.length > DESC_MAX) {
      score -= 5
      issues.push({
        severity: 'low',
        message: `Description is ${description.length} chars — ideal range is ${DESC_MIN}–${DESC_MAX}`,
        page: pageName,
      })
    }
  }

  // --- H1 / Hero Title (15 pts) ---
  const heroTitle: string = hero?.title ?? ''
  const brandName: string = brand?.name ?? ''
  if (!heroTitle) {
    issues.push({ severity: 'medium', message: 'Missing H1 heading (hero title)', page: pageName })
  } else {
    score += 15
    if (brandName && heroTitle.trim().toLowerCase() === brandName.trim().toLowerCase()) {
      score -= 5
      issues.push({
        severity: 'low',
        message: 'H1 is identical to brand name — use a descriptive headline instead',
        page: pageName,
      })
    }
  }

  // --- Image Alt Attributes (15 pts) ---
  let imageDeductions = 0
  const checkAlt = (url: string | undefined, alt: string | undefined, label: string) => {
    if (url && !alt && imageDeductions < 15) {
      imageDeductions += 5
      issues.push({ severity: 'low', message: `Missing alt text on ${label}`, page: pageName })
    }
  }
  checkAlt(brand?.logoUrl, brand?.logoAlt, 'logo')
  checkAlt(hero?.backgroundImage, hero?.backgroundImageAlt, 'hero background image')

  // Gallery images
  const gallery: AnyConfig[] = seo?.gallery ?? hero?.gallery ?? []
  for (const img of gallery) {
    checkAlt(img?.url ?? img?.src, img?.alt, 'gallery image')
  }

  // Team photos
  const team: AnyConfig[] = seo?.team ?? []
  for (const member of team) {
    checkAlt(member?.photo ?? member?.avatar, member?.photoAlt ?? member?.alt, 'team photo')
  }

  score += Math.max(0, 15 - imageDeductions)

  // --- Keywords (20 pts) ---
  const keywords: string[] = seo?.keywords ?? []
  if (!keywords || keywords.length === 0) {
    issues.push({
      severity: 'medium',
      message: 'No SEO keywords defined — add at least 3',
      page: pageName,
    })
  } else if (keywords.length < KEYWORDS_MIN) {
    score += 10
    issues.push({
      severity: 'low',
      message: `Only ${keywords.length} keyword(s) — add at least ${KEYWORDS_MIN} for better coverage`,
      page: pageName,
    })
  } else {
    score += 20
    const combined = `${title} ${description}`.toLowerCase()
    const missing = keywords.filter((k) => !combined.includes(k.toLowerCase()))
    if (missing.length > 0) {
      const penalty = Math.min(8, missing.length * 2)
      score -= penalty
      issues.push({
        severity: 'low',
        message: `Keywords not found in title/description: ${missing.slice(0, 3).join(', ')}`,
        page: pageName,
      })
    }
  }

  return { score: Math.max(0, score), maxScore, issues }
}

const NON_CONTENT_SECTION_TYPES = new Set([
  "announcement_bar",
  "cta",
])

const NON_CONTENT_SECTION_IDS = new Set([
  "hero",
  "hero--emergency",
  "hero-emergency",
  "cta--sticky",
  "messenger-sticky-cta",
  "cta--promo-strip",
  "announcement_bar",
  "announcement_bar--promo",
  "announcement_bar--emergency",
  "announcement_bar--offer",
  "promo-banner-strip",
  "payment_options",
  "payment-options-strip",
  "logo_cloud",
  "logo-cloud",
  "trust_badges",
  "trust-badges-grid",
])

function resolveSectionData(config: AnyConfig, page: AnyConfig, sectionId: string): AnyConfig {
  const dataKey = BLOCK_MAP[sectionId]?.dataKey
  if (!dataKey) return {}
  const pageValue = page?.[dataKey]
  if (pageValue && typeof pageValue === "object") return pageValue
  const globalValue = config?.[dataKey]
  if (globalValue && typeof globalValue === "object") return globalValue
  return {}
}

function hasSectionHeading(sectionData: AnyConfig): boolean {
  const title = typeof sectionData?.title === "string" ? sectionData.title.trim() : ""
  const heading = typeof sectionData?.heading === "string" ? sectionData.heading.trim() : ""
  return title.length > 0 || heading.length > 0
}

function auditSectionHeadingCoverage(config: AnyConfig, page: AnyConfig, pageName: string): { penalty: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = []
  const activeSections: string[] = Array.isArray(page?.activeSections)
    ? page.activeSections
    : Array.isArray(config?.activeSections)
      ? config.activeSections
      : []

  if (activeSections.length === 0) {
    return { penalty: 0, issues }
  }

  const targetSections = activeSections.filter((sectionId) => {
    if (typeof sectionId !== "string") return false
    if (NON_CONTENT_SECTION_IDS.has(sectionId)) return false
    const definition = BLOCK_MAP[sectionId]
    if (!definition) return false
    if (definition.sectionType && NON_CONTENT_SECTION_TYPES.has(definition.sectionType)) return false
    return true
  })

  const missingHeadingSections = targetSections.filter((sectionId) => {
    const sectionData = resolveSectionData(config, page, sectionId)
    return !hasSectionHeading(sectionData)
  })

  if (missingHeadingSections.length === 0) {
    return { penalty: 0, issues }
  }

  const missingLabels = missingHeadingSections.map((sectionId) => BLOCK_MAP[sectionId]?.label || sectionId)
  issues.push({
    severity: missingHeadingSections.length >= 2 ? "medium" : "low",
    message: `Missing section heading/title content in: ${missingLabels.join(", ")}`,
    page: pageName,
  })

  const penalty = Math.min(10, missingHeadingSections.length * 2)
  return { penalty, issues }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function runSeoAudit(config: AnyConfig): SeoAuditResult {
  const brand: AnyConfig = config?.brand ?? {}
  const pages: AnyConfig[] = config?.pages ?? []
  const globalSeo: AnyConfig = config?.seo ?? {}
  const globalHero: AnyConfig = config?.hero ?? {}

  const allIssues: AuditIssue[] = []
  const pageResults: PageAuditResult[] = []

  // Multi-page project: score each page out of 100, then average
  if (pages.length > 0) {
    for (const page of pages) {
      const pageName: string = page?.name ?? page?.slug ?? 'Page'
      const seo: AnyConfig = page?.seo ?? {}
      const hero: AnyConfig = page?.hero ?? {}
      const result = auditSeoBlock(seo, hero, brand, pageName)
      const sectionCoverage = auditSectionHeadingCoverage(config, page, pageName)
      const pageScore = Math.max(0, result.score - sectionCoverage.penalty)
      const pageIssues = [...result.issues, ...sectionCoverage.issues]
      pageResults.push({
        page: pageName,
        score: pageScore,
        maxScore: result.maxScore,
        issues: pageIssues,
      })
      allIssues.push(...pageIssues)
    }

    // Check page SEO coverage — penalize the overall average
    const missingSeoPagesCount = pages.filter(
      (p) => !p?.seo?.title || !p?.seo?.description,
    ).length
    if (missingSeoPagesCount > 0) {
      const severity: IssueSeverity = missingSeoPagesCount / pages.length > 0.3 ? 'high' : 'medium'
      allIssues.push({
        severity,
        message: `${missingSeoPagesCount} of ${pages.length} page(s) missing SEO title or description`,
      })
    }

    // Final score = average of all page scores (always out of 100)
    const avgScore = Math.round(
      pageResults.reduce((sum, r) => sum + r.score, 0) / pageResults.length,
    )

    // Apply a small coverage penalty if many pages lack SEO
    const coveragePenalty =
      missingSeoPagesCount / pages.length > 0.3
        ? 10
        : missingSeoPagesCount > 0
          ? 5
          : 0
    const finalScore = Math.max(0, avgScore - coveragePenalty)

    return {
      score: finalScore,
      maxScore: 100,
      percentage: finalScore,
      issues: allIssues,
      pageResults,
    }
  }

  // Single-page project — audit global config
  const result = auditSeoBlock(globalSeo, globalHero, brand, 'Home')
  const sectionCoverage = auditSectionHeadingCoverage(config, config, "Home")
  const finalScore = Math.max(0, result.score - sectionCoverage.penalty)
  const finalIssues = [...result.issues, ...sectionCoverage.issues]

  return {
    score: finalScore,
    maxScore: 100,
    percentage: finalScore,
    issues: finalIssues,
    pageResults: [{ page: 'Home', score: finalScore, maxScore: 100, issues: finalIssues }],
  }
}
