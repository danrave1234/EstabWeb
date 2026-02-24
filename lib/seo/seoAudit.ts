// ---------------------------------------------------------------------------
// SEO Audit Engine
// Pure computation — no DB, no side effects.
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
  maxScore: number
  issues: AuditIssue[]
}

export interface SeoAuditResult {
  score: number
  maxScore: number
  percentage: number
  issues: AuditIssue[]
  pageResults: PageAuditResult[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = Record<string, any>

function auditSeoBlock(
  seo: AnyConfig | undefined,
  hero: AnyConfig | undefined,
  brand: AnyConfig | undefined,
  pageName: string,
): { score: number; maxScore: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = []
  let score = 0
  const maxScore = 85 // per-page checks total (title 20 + desc 20 + h1 15 + keywords 15 + images 15)

  // --- 3.1 Title Check (20 pts) ---
  const title: string = seo?.title ?? ''
  if (!title) {
    issues.push({ severity: 'high', message: 'Missing SEO title', page: pageName })
  } else {
    score += 20
    if (title.length < 30 || title.length > 60) {
      score -= 10
      issues.push({
        severity: 'medium',
        message: `Title length is ${title.length} chars (ideal: 30–60)`,
        page: pageName,
      })
    }
  }

  // --- 3.2 Meta Description (20 pts) ---
  const description: string = seo?.description ?? ''
  if (!description) {
    issues.push({ severity: 'high', message: 'Missing meta description', page: pageName })
  } else {
    score += 20
    if (description.length < 120 || description.length > 160) {
      score -= 10
      issues.push({
        severity: 'medium',
        message: `Meta description length is ${description.length} chars (ideal: 120–160)`,
        page: pageName,
      })
    }
  }

  // --- 3.3 H1 Check (15 pts) ---
  const heroTitle: string = hero?.title ?? ''
  const brandName: string = brand?.name ?? ''
  if (!heroTitle) {
    issues.push({ severity: 'high', message: 'Missing H1 (hero title)', page: pageName })
  } else {
    score += 15
    if (brandName && heroTitle.trim().toLowerCase() === brandName.trim().toLowerCase()) {
      score -= 8
      issues.push({
        severity: 'medium',
        message: 'H1 is identical to brand name — add a descriptive headline',
        page: pageName,
      })
    }
  }

  // --- 3.4 Image Alt Attributes (15 pts) ---
  let imageDeductions = 0
  const checkAlt = (url: string | undefined, alt: string | undefined, label: string) => {
    if (url && !alt && imageDeductions < 15) {
      imageDeductions += 3
      issues.push({ severity: 'medium', message: `Missing alt text on ${label}`, page: pageName })
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

  // --- 3.5 Keyword Coverage (15 pts) ---
  const keywords: string[] = seo?.keywords ?? []
  if (!keywords || keywords.length < 3) {
    issues.push({
      severity: keywords.length === 0 ? 'high' : 'medium',
      message:
        keywords.length === 0
          ? 'No SEO keywords defined'
          : `Only ${keywords.length} keyword(s) defined — add at least 3`,
      page: pageName,
    })
  } else {
    score += 15
    const combined = `${title} ${description}`.toLowerCase()
    const missing = keywords.filter((k) => !combined.includes(k.toLowerCase()))
    if (missing.length > 0) {
      score -= Math.min(10, missing.length * 3)
      issues.push({
        severity: 'medium',
        message: `Keywords not found in title/description: ${missing.slice(0, 3).join(', ')}`,
        page: pageName,
      })
    }
  }

  return { score: Math.max(0, score), maxScore, issues }
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

  // If multi-page project
  if (pages.length > 0) {
    for (const page of pages) {
      const pageName: string = page?.name ?? page?.slug ?? 'Page'
      const seo: AnyConfig = page?.seo ?? {}
      const hero: AnyConfig = page?.hero ?? {}
      const result = auditSeoBlock(seo, hero, brand, pageName)
      pageResults.push({
        page: pageName,
        score: result.score,
        maxScore: result.maxScore,
        issues: result.issues,
      })
      allIssues.push(...result.issues)
    }

    // --- 3.6 Page Coverage (15 pts) ---
    const missingSeoPagesCount = pages.filter(
      (p) => !p?.seo?.title || !p?.seo?.description,
    ).length
    const missingRatio = missingSeoPagesCount / pages.length
    let pageCoverageScore = 15
    if (missingRatio > 0.3) {
      pageCoverageScore = 0
      allIssues.push({
        severity: 'high',
        message: `${missingSeoPagesCount} of ${pages.length} pages are missing SEO title or description`,
      })
    } else if (missingSeoPagesCount > 0) {
      pageCoverageScore = 8
      allIssues.push({
        severity: 'medium',
        message: `${missingSeoPagesCount} page(s) missing SEO title or description`,
      })
    }

    const totalPageScore = pageResults.reduce((s, r) => s + r.score, 0)
    const totalPageMax = pageResults.reduce((s, r) => s + r.maxScore, 0)
    const totalScore = totalPageScore + pageCoverageScore
    const totalMax = totalPageMax + 15

    return {
      score: totalScore,
      maxScore: totalMax,
      percentage: Math.round((totalScore / totalMax) * 100),
      issues: allIssues,
      pageResults,
    }
  }

  // Single-page project — audit global config
  const result = auditSeoBlock(globalSeo, globalHero, brand, 'Home')
  const totalMax = result.maxScore + 15 // +15 for page coverage (N/A → full points)
  const totalScore = result.score + 15

  return {
    score: totalScore,
    maxScore: totalMax,
    percentage: Math.round((totalScore / totalMax) * 100),
    issues: result.issues,
    pageResults: [{ page: 'Home', score: result.score, maxScore: result.maxScore, issues: result.issues }],
  }
}
