import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { COLOR_THEME_SWATCHES, DEFAULT_FOOTER, DEFAULT_BLUEPRINT_CONFIG, DEFAULT_EMERGENCY_CTA, DEFAULT_ANIMATED_TESTIMONIALS, DEFAULT_AWARDS_STRIP, DEFAULT_FAQ_ACCORDION, DEFAULT_BEFORE_AFTER_GALLERY, DEFAULT_BLOG, DEFAULT_AGENCY_BLOG, DEFAULT_HOW_IT_WORKS, DEFAULT_PRACTICE_AREAS, DEFAULT_TREATMENT_PROCESS, DEFAULT_COMMON_PESTS, DEFAULT_FEATURED_LISTINGS, DEFAULT_DEVELOPER_PARTNERS, DEFAULT_TESTIMONIALS, DEFAULT_REVIEW_TRUST_BAR, DEFAULT_FINANCING, DEFAULT_AC_TYPES, DEFAULT_PRICE_PREVIEW, DEFAULT_PRICING_COMPARISON_TABLE, DEFAULT_PRICING_SECTION_COMPARISON, DEFAULT_PRICING_TABLE, DEFAULT_MAINTENANCE_PLANS, DEFAULT_FACEBOOK_REVIEW_EMBED, DEFAULT_WHY_CHOOSE_ME, DEFAULT_SERVICE_AREA_MAP, DEFAULT_LOGO_CLOUD, DEFAULT_DELIVERY_COVERAGE, DEFAULT_CONTACT_WITH_MAP, DEFAULT_HERO, DEFAULT_HERO_EMERGENCY, DEFAULT_HERO_SHOWCASE, DEFAULT_HERO_AERO_3, DEFAULT_HERO_ELEGANT_CAROUSEL, DEFAULT_HERO_MINIMALISM, DEFAULT_HERO_MODERN, DEFAULT_HERO_GROUP_IMAGES, DEFAULT_HERO_V6, DEFAULT_HERO_V7, DEFAULT_HERO_CHIROPRACTOR, DEFAULT_HERO_DENTIST, DEFAULT_HERO_CLINIC, DEFAULT_HERO_CLEANING, DEFAULT_HERO_POOL, DEFAULT_HERO_PEST_CONTROL, DEFAULT_HERO_LAWYER, DEFAULT_HERO_GYM, DEFAULT_HERO_STARTUP, DEFAULT_TRUST_BADGES, DEFAULT_TEAM_CAROUSEL, DEFAULT_TEAM_SHOWCASE, DEFAULT_ATTORNEY_PROFILE, DEFAULT_CTA, DEFAULT_PROMO_STRIP, DEFAULT_FREE_CONSULTATION, DEFAULT_GUARANTEE, DEFAULT_CONTACT, DEFAULT_AGENCY_CONTACT, DEFAULT_AGENCY_PRODUCTS, DEFAULT_FEATURES, DEFAULT_FEATURES_BENTO, DEFAULT_FEATURES_V2, DEFAULT_VERTICAL_TABS, DEFAULT_FEATURE_SPOTLIGHT, DEFAULT_GYM_PROGRAMS, DEFAULT_GYM_SCHEDULE, DEFAULT_GYM_MEMBERSHIPS, DEFAULT_GYM_TRAINERS, DEFAULT_GYM_RESULTS, DEFAULT_GYM_FACILITY, DEFAULT_GYM_CLASS_TYPES, DEFAULT_GYM_FAQ, DEFAULT_TESTIMONIALS_V2, DEFAULT_CUSTOM_HTML_SECTION, DEFAULT_GALLERY4, DEFAULT_GALLERY_GRID, DEFAULT_TESTIMONIALS_COMMUNITY, DEFAULT_CTA_BEAMS, DEFAULT_FEATURE_STEPS, DEFAULT_STATS_SECTION, DEFAULT_PAYMENT_OPTIONS_STRIP, DEFAULT_PROMO_CTA_SECTION, DEFAULT_BEFORE_AFTER_SLIDER, DEFAULT_FEATURE_HIGHLIGHT_ZIGZAG, DEFAULT_PATIENT_FAQ, DEFAULT_CASE_STUDY_DETAIL, sectionIdToKey, navigationToArray, ensureStringArray, deepMerge } from "@/config/dashboard-config"
import { BLOCK_MAP } from "@/lib/utils/block-registry"
import {
    findHeroInActiveSections,
    isHeroSectionId,
    resolveHeroEditorId,
} from "@/lib/dashboard/hero-editor"
import { categoryLabelForSection, slugify } from "@/lib/utils/blocks"
import { buildAutoSeoDefaults } from "@/lib/seo/autoSeo"
import { canPublishDirectly } from "@/lib/subscription"

const DEFAULT_SECTION_DATA_MAP: Record<string, any> = {
    'hero': DEFAULT_HERO,
    'hero--emergency': DEFAULT_HERO_EMERGENCY,
    'hero--showcase': DEFAULT_HERO_SHOWCASE,
    'hero--aero-3': DEFAULT_HERO_AERO_3,
    'hero--minimalism': DEFAULT_HERO_MINIMALISM,
    'hero--elegant-carousel': DEFAULT_HERO_ELEGANT_CAROUSEL,
    'hero--modern': DEFAULT_HERO_MODERN,
    'hero--group-images': DEFAULT_HERO_GROUP_IMAGES,
    'hero--v6': DEFAULT_HERO_V6,
    'hero--v7': DEFAULT_HERO_V7,
    'hero--generic': DEFAULT_HERO,
    'hero--lawyer': DEFAULT_HERO_LAWYER,
    'hero--dentist': DEFAULT_HERO_DENTIST,
    'hero--clinic': DEFAULT_HERO_CLINIC,
    'hero--gym': DEFAULT_HERO_GYM,
    'hero--startup': DEFAULT_HERO_STARTUP,
    'hero--chiropractor': DEFAULT_HERO_CHIROPRACTOR,
    'hero--cleaning': DEFAULT_HERO_CLEANING,
    'hero--pool': DEFAULT_HERO_POOL,
    'hero--pest-control': DEFAULT_HERO_PEST_CONTROL,
    'hero--real-estate-modern': DEFAULT_HERO_LAWYER,
    'hero--before-after-split': DEFAULT_HERO_LAWYER,
    'hero--industrial': DEFAULT_HERO_LAWYER,
    'hero--clean-delivery': DEFAULT_HERO_LAWYER,
    'hero--luxury-soft': DEFAULT_HERO_LAWYER,
    'hero--academic-clean': DEFAULT_HERO_LAWYER,
    'hero--hvac': DEFAULT_HERO_LAWYER,
    'hero--hvac-blue': DEFAULT_HERO_LAWYER,
    'trust_badges': DEFAULT_TRUST_BADGES,
    'certifications': DEFAULT_AWARDS_STRIP,
    'testimonials': DEFAULT_TESTIMONIALS,
    'testimonials--grid': DEFAULT_REVIEW_TRUST_BAR,
    'testimonials--animated': DEFAULT_ANIMATED_TESTIMONIALS,
    'testimonials--community': DEFAULT_TESTIMONIALS_COMMUNITY,
    'testimonials--v2': DEFAULT_TESTIMONIALS_V2,
    'testimonials--facebook': DEFAULT_FACEBOOK_REVIEW_EMBED,
    'logo_cloud': DEFAULT_LOGO_CLOUD,
    'services': DEFAULT_FEATURES,
    'services--bento': DEFAULT_FEATURES_BENTO,
    'services--modern': DEFAULT_FEATURES,
    'services--vertical-tabs': DEFAULT_VERTICAL_TABS,
    'services--features-v2': DEFAULT_FEATURES_V2,
    'services--highlight': DEFAULT_FEATURE_HIGHLIGHT_ZIGZAG,
    'features--highlight': DEFAULT_FEATURE_HIGHLIGHT_ZIGZAG,
    'feature-highlight': DEFAULT_FEATURE_HIGHLIGHT_ZIGZAG,
    'service_detail': DEFAULT_FEATURES,
    'service_detail--split': DEFAULT_FEATURES,
    'comparison': DEFAULT_AC_TYPES,
    'comparison--table': DEFAULT_AC_TYPES,
    'comparison--vs': DEFAULT_AC_TYPES,
    'specialty_listings': DEFAULT_FEATURED_LISTINGS,
    'process': DEFAULT_HOW_IT_WORKS,
    'process--timeline': DEFAULT_TREATMENT_PROCESS,
    'faq': DEFAULT_FAQ_ACCORDION,
    'faq--two-column': DEFAULT_PRACTICE_AREAS,
    'faq--patient': DEFAULT_PATIENT_FAQ,
    'faq--clinic': DEFAULT_PATIENT_FAQ,
    'patient_faq': DEFAULT_PATIENT_FAQ,
    'blog_preview': DEFAULT_BLOG,
    'blog--agency': DEFAULT_AGENCY_BLOG,
    'stats': DEFAULT_STATS_SECTION,
    'stats--bar': DEFAULT_STATS_SECTION,
    'team': DEFAULT_TEAM_CAROUSEL,
    'team--carousel': DEFAULT_TEAM_CAROUSEL,
    'team--showcase': DEFAULT_TEAM_SHOWCASE,
    'team--profile': DEFAULT_ATTORNEY_PROFILE,
    'team--spotlight': DEFAULT_WHY_CHOOSE_ME,
    'pricing': DEFAULT_PRICING_TABLE,
    'pricing--comparison': DEFAULT_PRICING_COMPARISON_TABLE,
    'pricing--feature-comparison': DEFAULT_PRICING_SECTION_COMPARISON,
    'pricing-comparison-table': DEFAULT_PRICING_COMPARISON_TABLE,
    'pricing-section-with-comparison': DEFAULT_PRICING_SECTION_COMPARISON,
    'pricing--subscription': DEFAULT_MAINTENANCE_PLANS,
    'price_preview': DEFAULT_PRICE_PREVIEW,
    'service_area': DEFAULT_SERVICE_AREA_MAP,
    'service_area--radius': DEFAULT_DELIVERY_COVERAGE,
    'gallery': DEFAULT_BEFORE_AFTER_GALLERY,
    'gallery--slider': DEFAULT_BEFORE_AFTER_SLIDER,
    'before-after-slider': DEFAULT_BEFORE_AFTER_SLIDER,
    'gallery--carousel': DEFAULT_GALLERY4,
    'gallery--grid': DEFAULT_GALLERY_GRID,
    'case_study': DEFAULT_BEFORE_AFTER_GALLERY,
    'case_study--detail': DEFAULT_CASE_STUDY_DETAIL,
    'cta': DEFAULT_CTA,
    'cta--emergency': DEFAULT_HERO_EMERGENCY,
    'cta--promo-strip': DEFAULT_PROMO_CTA_SECTION,
    'cta--sticky': DEFAULT_PROMO_CTA_SECTION,
    'promo_cta': DEFAULT_PROMO_CTA_SECTION,
    'promo-cta-section': DEFAULT_PROMO_CTA_SECTION,
    'cta--beams': DEFAULT_CTA_BEAMS,
    'features--steps': DEFAULT_FEATURE_STEPS,
    'features--spotlight': DEFAULT_FEATURE_SPOTLIGHT,
    'booking': DEFAULT_FREE_CONSULTATION,
    'lead_capture': DEFAULT_FREE_CONSULTATION,
    'lead_capture--multi-step': DEFAULT_FREE_CONSULTATION,
    'free_consultation': DEFAULT_FREE_CONSULTATION,
    'custom-html': DEFAULT_CUSTOM_HTML_SECTION,
    'payment_options': DEFAULT_PAYMENT_OPTIONS_STRIP,
    'guarantee': DEFAULT_GUARANTEE,
    'guarantee--badge': DEFAULT_GUARANTEE,
    'guarantee--safety': DEFAULT_GUARANTEE,
    'warranty-block': DEFAULT_GUARANTEE,
    'contact': DEFAULT_CONTACT,
    'contact--minimal': DEFAULT_CONTACT,
    'contact--visual': DEFAULT_CONTACT,
    'contact--with-map': DEFAULT_CONTACT_WITH_MAP,
    'contact--columns': DEFAULT_CONTACT,
    'contact--split': DEFAULT_CONTACT,
    'contact--agency': DEFAULT_AGENCY_CONTACT,
    'products--agency': DEFAULT_AGENCY_PRODUCTS,
    'gym--programs': DEFAULT_GYM_PROGRAMS,
    'gym--schedule': DEFAULT_GYM_SCHEDULE,
    'gym--memberships': DEFAULT_GYM_MEMBERSHIPS,
    'gym--trainers': DEFAULT_GYM_TRAINERS,
    'gym--results': DEFAULT_GYM_RESULTS,
    'gym--facility': DEFAULT_GYM_FACILITY,
    'gym--class-types': DEFAULT_GYM_CLASS_TYPES,
    'gym--faq': DEFAULT_GYM_FAQ,
    'announcement_bar': { text: 'Limited Promo: Get 20% off on all services this month!', buttonText: 'Book Now', buttonHref: '#contact', countdownDate: '' },
    'announcement_bar--promo': { text: 'Limited Promo: Get 20% off on all services this month!', buttonText: 'Book Now', buttonHref: '#contact', countdownDate: '' },
    'announcement_bar--emergency': { text: '24/7 Emergency Service Available — Call Now!', buttonText: 'Call Now', buttonHref: 'tel:+18005551234', countdownDate: '' },
    'announcement_bar--offer': { text: 'Free Inspection with Every Service — Limited Time!', buttonText: 'Claim Offer', buttonHref: '#contact', countdownDate: '' },
    'awards': DEFAULT_AWARDS_STRIP,
    'faq-accordion': DEFAULT_FAQ_ACCORDION,
    'blog': DEFAULT_BLOG,
    'before-after-gallery-grid': DEFAULT_BEFORE_AFTER_GALLERY,
    'how-it-works': DEFAULT_HOW_IT_WORKS,
    'practice-areas': DEFAULT_PRACTICE_AREAS,
    'treatment-process': DEFAULT_TREATMENT_PROCESS,
    'common-pests': DEFAULT_COMMON_PESTS,
    'featured-properties-grid': DEFAULT_FEATURED_LISTINGS,
    'developer-partners': DEFAULT_DEVELOPER_PARTNERS,
    'review-trust-bar': DEFAULT_REVIEW_TRUST_BAR,
    'financing-section': DEFAULT_FINANCING,
    'ac-types-grid': DEFAULT_AC_TYPES,
    'price-preview-strip': DEFAULT_PRICE_PREVIEW,
    'maintenance-plans': DEFAULT_MAINTENANCE_PLANS,
    'facebook-review-embed': DEFAULT_FACEBOOK_REVIEW_EMBED,
    'why-choose-me': DEFAULT_WHY_CHOOSE_ME,
    'service-area-map': DEFAULT_SERVICE_AREA_MAP,
    'logo-cloud': DEFAULT_LOGO_CLOUD,
    'delivery-coverage': DEFAULT_DELIVERY_COVERAGE,
    'features': DEFAULT_FEATURES,
    'features-modern': DEFAULT_FEATURES,
    'services-grid': DEFAULT_FEATURES,
    'services-bento': DEFAULT_FEATURES_BENTO,
    'product_grid': DEFAULT_FEATURES,
    'project-gallery': DEFAULT_FEATURES,
    'programs-grid': DEFAULT_FEATURES,
    'faculty-grid': DEFAULT_FEATURES,
}

const formatSectionLabel = (id: string) => BLOCK_MAP[id]?.label ?? id.replace(/[-_]/g, " ").replace(/--/g, " ").replace(/\\b\\w/g, (l: string) => l.toUpperCase())

const normalizeArrayItems = <T,>(value: unknown, fallback: T[]): T[] => {
    if (Array.isArray(value)) return value as T[]
    if (value && typeof value === 'object') {
        return Object.keys(value as Record<string, T>)
            .filter((k) => /^\\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (value as Record<string, T>)[k])
    }
    return fallback
}

const normalizePagesForEditor = (pages: any[]): any[] => {
    return (Array.isArray(pages) ? pages : []).map((page: any, index: number) => {
        const raw = (page || {}) as Record<string, any>
        const rawSlug = typeof raw.slug === "string" ? raw.slug : ""
        const slug = rawSlug.replace(/^\/+|\/+$/g, "").toLowerCase()
        const rawLabel = typeof raw.label === "string" ? raw.label : ""
        const rawSections = Array.isArray(raw.activeSections) ? raw.activeSections : []
        const firstSection = typeof rawSections[0] === "string" ? rawSections[0] : ""
        const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : ""
        const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim())
        const isHomePageEntry = index === 0 && (!slug || slug === "")
        const firstIsHero =
            firstSection === "hero" ||
            firstSection.startsWith("hero--") ||
            firstSection === "hero-emergency"
        const homeLabelFromCategoryOnly =
            isHomePageEntry &&
            !firstIsHero &&
            categoryLabel !== "" &&
            !isGenericLabel &&
            rawLabel.trim() === categoryLabel
        const fallbackLabel = categoryLabel || (slug ? slug.replace(/-/g, " ") : `Page ${index + 1}`)
        const label = isGenericLabel
            ? (isHomePageEntry ? "Home" : fallbackLabel)
            : homeLabelFromCategoryOnly
                ? "Home"
                : rawLabel
        const nextSlug = index === 0 ? "" : (label.toLowerCase() === "home" ? "" : (slug || slugify(label)))
        return {
            ...raw,
            slug: nextSlug,
            label,
            activeSections: rawSections,
        }
    })
}

export function useEditorState(project: any) {
    const router = useRouter()
    const LOCAL_KEY = `ew_local_draft_\${project.id}`
    const iframeRef = React.useRef<HTMLIFrameElement>(null)
    const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const [localDraftConfig, setLocalDraftConfig] = React.useState<Record<string, any> | null>(null)
    const [selectedSection, setSelectedSection] = React.useState<string | null>(null)
    const [activePreviewSection, setActivePreviewSection] = React.useState<string | null>(null)
    const [formValues, setFormValues] = React.useState<Record<string, any>>({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isQueueing, setIsQueueing] = React.useState(false)
    const [isPublishing, setIsPublishing] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [modified, setModified] = React.useState<Record<string, any>>({})
    const [hasPendingRequest, setHasPendingRequest] = React.useState(false)
    const [colorPaletteOpen, setColorPaletteOpen] = React.useState(false)
    const [typographyOpen, setTypographyOpen] = React.useState(false)
    const [colorPaletteQuery, setColorPaletteQuery] = React.useState("")
    const [historyOpen, setHistoryOpen] = React.useState(false)
    const [aiEditorOpen, setAiEditorOpen] = React.useState(false)
    const [aiHasPending, setAiHasPending] = React.useState(false)
    const [versions, setVersions] = React.useState<{ id: string; version: number; createdAt: string; isCurrent: boolean }[]>([])
    const [versionsLoading, setVersionsLoading] = React.useState(false)
    const [rollbackLoading, setRollbackLoading] = React.useState<number | null>(null)
    const [upgradeLoading, setUpgradeLoading] = React.useState(false)
    const [dragSectionIndex, setDragSectionIndex] = React.useState<number | null>(null)
    const [dropSectionIndex, setDropSectionIndex] = React.useState<number | null>(null)
    const [addSectionOpen, setAddSectionOpen] = React.useState(false)
    const [sectionSearchQuery, setSectionSearchQuery] = React.useState("")
    const [activeTab, setActiveTab] = React.useState<"content" | "design" | "advanced">("content")
    const [selectedPageIndex, setSelectedPageIndex] = React.useState(0)
    /** Last home hero variant id when hero is not in activeSections (for unhide / editor labels). */
    const [storedHeroSectionId, setStoredHeroSectionId] = React.useState<string>("hero")
    const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({ 'seo-og': true })
    const [aiSeoOpen, setAiSeoOpen] = React.useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
    const [sectionRects, setSectionRects] = React.useState<Array<{ id: string; index: number; top: number; height: number }>>([])

    const colorPaletteRef = React.useRef<HTMLButtonElement>(null)
    const typographyRef = React.useRef<HTMLButtonElement>(null)
    const colorPaletteRectRef = React.useRef<DOMRect | null>(null)
    const typographyRectRef = React.useRef<DOMRect | null>(null)
    const discardInProgressRef = React.useRef(false)
    const backdropPointerDownRef = React.useRef(false)
    const manualScrollLockRef = React.useRef(false)
    const manualScrollTargetRef = React.useRef<string | null>(null)
    const manualScrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const hasDraft = !!(localDraftConfig || project?.local_draft)
    const baseConfig = localDraftConfig || project.current_config || {}
    const mergedConfig = React.useMemo(() => deepMerge(baseConfig, modified), [baseConfig, modified])
    const globalConfig = React.useMemo(() => {
        const root = mergedConfig as any
        return {
            ...root,
            ...(root.global || {})
        }
    }, [mergedConfig])

    const pages = React.useMemo(
        () => normalizePagesForEditor(normalizeArrayItems<any>((mergedConfig as any).pages, [])),
        [mergedConfig]
    )
    const activePage = (pages[selectedPageIndex] ?? pages[0]) as any
    const isHomePage = !activePage?.slug
    const activeSections = React.useMemo(() => {
        if (isHomePage) {
            return ensureStringArray((globalConfig as any).activeSections || (mergedConfig as any).activeSections)
        }
        return ensureStringArray(activePage?.activeSections)
    }, [isHomePage, (globalConfig as any).activeSections, (mergedConfig as any).activeSections, activePage?.activeSections])

    // When a hero is visible, keep stored variant in sync (so hide/unhide stays consistent).
    React.useEffect(() => {
        const found = findHeroInActiveSections(activeSections)
        if (found) setStoredHeroSectionId(found.id)
    }, [activeSections])

    const canUsePages = canPublishDirectly(project)

    // Initial load from localStorage — run once on mount only
    const hasLoadedLocalRef = React.useRef(false)
    React.useEffect(() => {
        if (typeof window === 'undefined') return
        if (hasLoadedLocalRef.current) return
        hasLoadedLocalRef.current = true
        const saved = localStorage.getItem(LOCAL_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Object.keys(parsed).length > 0) {
                    setModified(parsed)
                    toast.info('Loaded your unsaved changes')
                }
            } catch (e) {
                console.error('Failed to parse local draft', e)
                localStorage.removeItem(LOCAL_KEY)
            }
        }
    }, [LOCAL_KEY])

    // Keydown Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedSection) {
                setSelectedSection(null)
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [selectedSection])


    // ── Sync form values when section changes ────────────────────────────────
    // This is a faithful port of the original per-section handling from the
    // monolithic ClientDashboardPreview.tsx (commit 92b9113).
    const lastCollapsedSectionRef = React.useRef<string | null>(null)

    React.useEffect(() => {
        if (!selectedSection) {
            setFormValues({})
            return
        }

        if (selectedSection === 'subscription' || selectedSection === 'domain') {
            setFormValues({})
            return
        }

        const sectionChanged = lastCollapsedSectionRef.current !== selectedSection

        const setFormWithCollapsed = (values: Record<string, any>) => {
            setFormValues(values)
            if (sectionChanged) {
                lastCollapsedSectionRef.current = selectedSection
                const nextCollapsed: Record<string, boolean> = {}
                Object.entries(values).forEach(([k, v]) => {
                    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                        nextCollapsed[`${selectedSection}-${k}`] = true
                    }
                })
                if (selectedSection === 'seo') {
                    nextCollapsed['seo-og'] = true
                    nextCollapsed['seo-robots'] = true
                    nextCollapsed['seo-schema'] = true
                }
                setCollapsedGroups(nextCollapsed)
            }
        }

        if (selectedSection === 'global_settings') {
            setFormWithCollapsed({})
            return
        }

        const sectionKey = sectionIdToKey(selectedSection)
        const local = (modified as any)?.[sectionKey]
        const base = local ?? (baseConfig as any)[sectionKey] ?? {}

        if (sectionKey === 'seo') {
            const pageSeo = (activePage?.seo || {}) as Record<string, any>
            setFormWithCollapsed({ title: '', description: '', keywords: [], ...pageSeo })
        } else if (sectionKey === 'footer') {
            const baseFooter = base as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_FOOTER,
                ...baseFooter,
                social: { ...DEFAULT_FOOTER.social, ...(baseFooter?.social ?? {}) },
            })
        } else if (sectionKey === 'navigation') {
            setFormWithCollapsed(navigationToArray(base) as unknown as Record<string, any>)
        } else if (sectionKey === 'legal') {
            const baseLegal = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                privacypolicy: { ...DEFAULT_BLUEPRINT_CONFIG.privacy, ...(baseLegal.privacypolicy ?? {}) },
                termsofservice: { ...DEFAULT_BLUEPRINT_CONFIG.termsofservice, ...(baseLegal.termsofservice ?? {}) },
                cookiepolicy: { ...DEFAULT_BLUEPRINT_CONFIG.cookiepolicy, ...(baseLegal.cookiepolicy ?? {}) },
            })
        } else if (sectionKey === 'pages') {
            const rawPages = Array.isArray(base) ? base : []
            const normalizedPgs = rawPages.map((page: any, index: number) => {
                const payload = (page || {}) as Record<string, any>
                const rawSlug = typeof payload.slug === 'string' ? payload.slug : ''
                const slug = rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase()
                const rawLabel = typeof payload.label === 'string' ? payload.label : ''
                const rawSections = Array.isArray(payload.activeSections) ? payload.activeSections : []
                const firstSection = typeof rawSections[0] === 'string' ? rawSections[0] : ''
                const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : ''
                const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim())
                const isGenericSlug = !slug || /^page-\d+$/i.test(slug)
                const isHomeByPosition = index === 0
                const fallbackLabel = categoryLabel || (slug && !isGenericSlug ? slug.replace(/-/g, ' ') : `Page ${index + 1}`)
                const label = isHomeByPosition
                    ? (isGenericLabel ? 'Home' : (rawLabel || 'Home'))
                    : ((isGenericLabel || categoryLabel) ? fallbackLabel : rawLabel)
                const nextSlug = isHomeByPosition ? '' : (label.toLowerCase() === 'home' ? '' : (isGenericSlug ? slugify(label) : (slug || slugify(label))))
                return {
                    slug: nextSlug, label,
                    activeSections: rawSections,
                    seo: payload.seo && typeof payload.seo === 'object' ? payload.seo : { title: '', description: '', keywords: [] },
                }
            })
            const baseSections = ensureStringArray((globalConfig as any).activeSections)
            const fallbackPage = { slug: '', label: 'Home', activeSections: baseSections.length > 0 ? baseSections : ['hero'], seo: { title: '', description: '', keywords: [] } }
            setFormWithCollapsed({ pages: normalizedPgs.length > 0 ? normalizedPgs : [fallbackPage] })
        } else if (sectionKey === 'emergencyCTA') {
            setFormWithCollapsed({ ...DEFAULT_EMERGENCY_CTA, ...(base as Record<string, any>) })
        } else if (sectionKey === 'awardsStrip') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_AWARDS_STRIP, ...b, items: normalizeArrayItems(b.items, DEFAULT_AWARDS_STRIP.items) })
        } else if (sectionKey === 'faqAccordion') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FAQ_ACCORDION, ...b, items: normalizeArrayItems(b.items, DEFAULT_FAQ_ACCORDION.items) })
        } else if (sectionKey === 'beforeAfterGallery') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_BEFORE_AFTER_GALLERY, ...b, items: normalizeArrayItems(b.items, DEFAULT_BEFORE_AFTER_GALLERY.items) })
        } else if (sectionKey === 'gallery4') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GALLERY4, ...b, items: normalizeArrayItems(b.items, DEFAULT_GALLERY4.items) })
        } else if (sectionKey === 'galleryGrid') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GALLERY_GRID, ...b, images: normalizeArrayItems(b.images, DEFAULT_GALLERY_GRID.images) })
        } else if (sectionKey === 'teamShowcase') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_TEAM_SHOWCASE, ...b, members: normalizeArrayItems(b.members, DEFAULT_TEAM_SHOWCASE.members) })
        } else if (sectionKey === 'heroElegantCarousel') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_HERO_ELEGANT_CAROUSEL, ...b, slides: normalizeArrayItems(b.slides, DEFAULT_HERO_ELEGANT_CAROUSEL.slides) })
        } else if (sectionKey === 'heroModern') {
            const b = (base || {}) as Record<string, any>
            const reviews = { ...DEFAULT_HERO_MODERN.reviews, ...(typeof b.reviews === 'object' && b.reviews !== null ? b.reviews : {}) }
            reviews.avatars = normalizeArrayItems(reviews.avatars, DEFAULT_HERO_MODERN.reviews.avatars)
            setFormWithCollapsed({ ...DEFAULT_HERO_MODERN, ...b, reviews })
        } else if (sectionKey === 'heroGroupImages') {
            setFormWithCollapsed({ ...DEFAULT_HERO_GROUP_IMAGES, ...(base as Record<string, any>) })
        } else if (sectionKey === 'heroV6') {
            setFormWithCollapsed({ ...DEFAULT_HERO_V6, ...(base as Record<string, any>) })
        } else if (sectionKey === 'heroV7') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_HERO_V7,
                ...b,
                stats: normalizeArrayItems(b.stats, DEFAULT_HERO_V7.stats),
                teamAvatars: normalizeArrayItems(b.teamAvatars, DEFAULT_HERO_V7.teamAvatars),
            })
        } else if (sectionKey === 'blog') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_BLOG, ...b, posts: normalizeArrayItems(b.posts, DEFAULT_BLOG.posts) })
        } else if (sectionKey === 'blogAgency') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_AGENCY_BLOG, ...b, posts: normalizeArrayItems(b.posts, DEFAULT_AGENCY_BLOG.posts) })
        } else if (sectionKey === 'contactAgency') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_AGENCY_CONTACT,
                ...b,
                infoItems: normalizeArrayItems(b.infoItems, DEFAULT_AGENCY_CONTACT.infoItems),
                socials: normalizeArrayItems(b.socials, DEFAULT_AGENCY_CONTACT.socials),
            })
        } else if (sectionKey === 'productsAgency') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_AGENCY_PRODUCTS,
                ...b,
                items: normalizeArrayItems(b.items, DEFAULT_AGENCY_PRODUCTS.items),
                categories: normalizeArrayItems(b.categories, DEFAULT_AGENCY_PRODUCTS.categories),
            })
        } else if (sectionKey === 'howItWorks') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_HOW_IT_WORKS, ...b, steps: normalizeArrayItems(b.steps ?? b.items, DEFAULT_HOW_IT_WORKS.steps) })
        } else if (sectionKey === 'practiceAreas') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_PRACTICE_AREAS, ...b, items: normalizeArrayItems(b.items ?? b.areas, DEFAULT_PRACTICE_AREAS.items) })
        } else if (sectionKey === 'treatmentProcess') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_TREATMENT_PROCESS, ...b, steps: normalizeArrayItems(b.steps, DEFAULT_TREATMENT_PROCESS.steps) })
        } else if (sectionKey === 'commonPests') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_COMMON_PESTS, ...b, items: normalizeArrayItems(b.items, DEFAULT_COMMON_PESTS.items) })
        } else if (sectionKey === 'featuredListings') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FEATURED_LISTINGS, ...b, items: normalizeArrayItems(b.items, DEFAULT_FEATURED_LISTINGS.items) })
        } else if (sectionKey === 'developerPartners') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_DEVELOPER_PARTNERS, ...b, items: normalizeArrayItems(b.items, DEFAULT_DEVELOPER_PARTNERS.items) })
        } else if (sectionKey === 'testimonials') {
            const b = (base || {}) as Record<string, any>
            const logos = Array.isArray(b.logos) ? b.logos : (DEFAULT_TESTIMONIALS.logos ?? [])
            const testimonial = { ...DEFAULT_TESTIMONIALS.testimonial, ...(typeof b.testimonial === 'object' && b.testimonial !== null ? b.testimonial : {}) }
            setFormWithCollapsed({ label: typeof b.label === 'string' ? b.label : DEFAULT_TESTIMONIALS.label, logos, testimonial })
        } else if (sectionKey === 'reviewTrustBar') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_REVIEW_TRUST_BAR, ...b, testimonials: normalizeArrayItems(b.testimonials, DEFAULT_REVIEW_TRUST_BAR.testimonials) })
        } else if (sectionKey === 'animatedTestimonials') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_ANIMATED_TESTIMONIALS,
                ...b,
                testimonials: normalizeArrayItems(b.testimonials, DEFAULT_ANIMATED_TESTIMONIALS.testimonials),
            })
        } else if (sectionKey === 'testimonialsV2') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_TESTIMONIALS_V2,
                ...b,
                items: normalizeArrayItems(b.items, DEFAULT_TESTIMONIALS_V2.items),
            })
        } else if (sectionKey === 'featureSpotlight') {
            setFormWithCollapsed({ ...DEFAULT_FEATURE_SPOTLIGHT, ...(base as Record<string, any>) })
        } else if (sectionKey === 'financing') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FINANCING, ...b, items: normalizeArrayItems(b.items, DEFAULT_FINANCING.items) })
        } else if (sectionKey === 'acTypes') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_AC_TYPES, ...b, items: normalizeArrayItems(b.items, DEFAULT_AC_TYPES.items) })
        } else if (sectionKey === 'pricePreview') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_PRICE_PREVIEW, ...b, items: normalizeArrayItems(b.items, DEFAULT_PRICE_PREVIEW.items) })
        } else if (sectionKey === 'safety' || sectionKey === 'featureHighlight') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_PRACTICE_AREAS, ...b, items: normalizeArrayItems(b.items, DEFAULT_PRACTICE_AREAS.items) })
        } else if (sectionKey === 'pricingTable') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_PRICING_TABLE, ...b, plans: normalizeArrayItems(b.plans, DEFAULT_PRICING_TABLE.plans) })
        } else if (sectionKey === 'pricingComparisonTable') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_PRICING_COMPARISON_TABLE,
                ...b,
                features: normalizeArrayItems(b.features, DEFAULT_PRICING_COMPARISON_TABLE.features),
                plans: normalizeArrayItems(b.plans, DEFAULT_PRICING_COMPARISON_TABLE.plans),
            })
        } else if (sectionKey === 'pricingSectionComparison') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_PRICING_SECTION_COMPARISON,
                ...b,
                plans: normalizeArrayItems(b.plans, DEFAULT_PRICING_SECTION_COMPARISON.plans),
                features: normalizeArrayItems(b.features, DEFAULT_PRICING_SECTION_COMPARISON.features),
            })
        } else if (sectionKey === 'maintenancePlans') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_MAINTENANCE_PLANS, ...b, plans: normalizeArrayItems(b.plans, DEFAULT_MAINTENANCE_PLANS.plans) })
        } else if (sectionKey === 'facebookReviewEmbed') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FACEBOOK_REVIEW_EMBED, ...b, reviews: normalizeArrayItems(b.reviews, DEFAULT_FACEBOOK_REVIEW_EMBED.reviews) })
        } else if (sectionKey === 'whyChooseMe') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_WHY_CHOOSE_ME, ...b, trustSignals: normalizeArrayItems(b.trustSignals, DEFAULT_WHY_CHOOSE_ME.trustSignals) })
        } else if (sectionKey === 'serviceAreaMap') {
            const b = (base || {}) as Record<string, any>
            const cities = Array.isArray(b.cities) ? b.cities : (Array.isArray(b.areas) ? b.areas : DEFAULT_SERVICE_AREA_MAP.cities)
            setFormWithCollapsed({ ...DEFAULT_SERVICE_AREA_MAP, ...b, cities })
        } else if (sectionKey === 'contactWithMap') {
            setFormWithCollapsed({ ...DEFAULT_CONTACT_WITH_MAP, ...(base as Record<string, any>) })
        } else if (sectionKey === 'logoCloud') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_LOGO_CLOUD, ...b, items: normalizeArrayItems(b.items, DEFAULT_LOGO_CLOUD.items) })
        } else if (sectionKey === 'deliveryCoverage') {
            const b = (base || {}) as Record<string, any>
            const areas = Array.isArray(b.areas) ? b.areas : DEFAULT_DELIVERY_COVERAGE.areas
            setFormWithCollapsed({ ...DEFAULT_DELIVERY_COVERAGE, ...b, areas })
        } else if (sectionKey === 'heroShowcase') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({
                ...DEFAULT_HERO_SHOWCASE,
                ...b,
                trustPoints: normalizeArrayItems(b.trustPoints, DEFAULT_HERO_SHOWCASE.trustPoints),
                metrics: normalizeArrayItems(b.metrics, DEFAULT_HERO_SHOWCASE.metrics),
            })
        } else if (sectionKey === 'gymPrograms') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_PROGRAMS, ...b, items: normalizeArrayItems(b.items, DEFAULT_GYM_PROGRAMS.items) })
        } else if (sectionKey === 'gymSchedule') {
            const b = (base || {}) as Record<string, any>
            const days = normalizeArrayItems(b.days, DEFAULT_GYM_SCHEDULE.days).map((day: any) => ({
                ...day,
                classes: normalizeArrayItems(day?.classes, []),
            }))
            setFormWithCollapsed({ ...DEFAULT_GYM_SCHEDULE, ...b, days })
        } else if (sectionKey === 'gymMemberships') {
            const b = (base || {}) as Record<string, any>
            const tiers = normalizeArrayItems(b.tiers, DEFAULT_GYM_MEMBERSHIPS.tiers).map((tier: any) => ({
                ...tier,
                perks: normalizeArrayItems(tier?.perks, []),
            }))
            setFormWithCollapsed({ ...DEFAULT_GYM_MEMBERSHIPS, ...b, tiers })
        } else if (sectionKey === 'gymTrainers') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_TRAINERS, ...b, items: normalizeArrayItems(b.items, DEFAULT_GYM_TRAINERS.items) })
        } else if (sectionKey === 'gymResults') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_RESULTS, ...b, stories: normalizeArrayItems(b.stories, DEFAULT_GYM_RESULTS.stories) })
        } else if (sectionKey === 'gymFacility') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_FACILITY, ...b, items: normalizeArrayItems(b.items, DEFAULT_GYM_FACILITY.items) })
        } else if (sectionKey === 'gymClassTypes') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_CLASS_TYPES, ...b, items: normalizeArrayItems(b.items, DEFAULT_GYM_CLASS_TYPES.items) })
        } else if (sectionKey === 'gymFaq') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_GYM_FAQ, ...b, items: normalizeArrayItems(b.items, DEFAULT_GYM_FAQ.items) })
        } else if (sectionKey === 'features' || sectionKey === 'services' || sectionKey === 'servicesGrid') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FEATURES, ...b, items: normalizeArrayItems(b.items ?? b.features, DEFAULT_FEATURES.items) })
        } else if (sectionKey === 'featuresBento') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FEATURES_BENTO, ...b, items: normalizeArrayItems(b.items, DEFAULT_FEATURES_BENTO.items) })
        } else if (sectionKey === 'featuresV2') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_FEATURES_V2, ...b, features: normalizeArrayItems(b.features, DEFAULT_FEATURES_V2.features) })
        } else if (sectionKey === 'verticalTabs') {
            const b = (base || {}) as Record<string, any>
            setFormWithCollapsed({ ...DEFAULT_VERTICAL_TABS, ...b, services: normalizeArrayItems(b.services, DEFAULT_VERTICAL_TABS.services) })
        } else {
            // Generic fallback — merge with any matching DEFAULT if available
            const defaultData = DEFAULT_SECTION_DATA_MAP[selectedSection]
            if (defaultData && typeof base === 'object' && base !== null) {
                setFormWithCollapsed({ ...defaultData, ...(base as Record<string, any>) })
            } else {
                setFormWithCollapsed((base as Record<string, any>) || {})
            }
        }
    }, [selectedSection, baseConfig, modified, activePage, globalConfig])

    // Click outside to close palettes
    React.useEffect(() => {
        const close = (e: MouseEvent) => {
            const target = e.target as Node
            const inColorPalette = colorPaletteRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=color-palette]")
            const inTypography = typographyRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=typography]")
            if (!inColorPalette) {
                setColorPaletteOpen(false)
                setColorPaletteQuery("")
            }
            if (!inTypography) setTypographyOpen(false)
        }
        document.addEventListener("click", close)
        return () => document.removeEventListener("click", close)
    }, [])

    // Highlight scroll listener
    const scrollToSection = React.useCallback((sectionId: string, index: number) => {
        if (iframeRef.current?.contentWindow) {
            manualScrollLockRef.current = true
            manualScrollTargetRef.current = sectionId
            iframeRef.current.contentWindow.postMessage({ type: 'SCROLL_TO_SECTION', sectionId, index }, '*')
            if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current)
            manualScrollTimeoutRef.current = setTimeout(() => {
                manualScrollLockRef.current = false
                manualScrollTargetRef.current = null
            }, 1000)
        }
    }, [])

    const lockPreviewHighlight = React.useCallback((sectionId: string | null) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'LOCK_HIGHLIGHT', sectionId }, '*')
        }
    }, [])

    // Message listener from iframe
    React.useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if ((e.data as any)?.type === 'SECTION_CLICKED') {
                const sectionId = (e.data as any).sectionId
                const index = (e.data as any).index
                if (sectionId && activeSections.includes(sectionId)) {
                    setSelectedSection(sectionId)
                    setActivePreviewSection(sectionId)
                    lockPreviewHighlight(sectionId)
                    scrollToSection(sectionId, index)
                }
            } else if ((e.data as any)?.type === 'SECTION_HOVERED') {
                if (manualScrollLockRef.current) return
                const sectionId = (e.data as any).sectionId
                if (sectionId === manualScrollTargetRef.current) return
                setActivePreviewSection(sectionId)
            } else if ((e.data as any)?.type === 'SECTION_RECTS') {
                setSectionRects((e.data as any).rects || [])
            } else if ((e.data as any)?.type === 'PREVIEW_ACTIVE_SECTION') {
                const sectionId = (e.data as any).sectionId as string | undefined
                if (!sectionId) return
                if (!activeSections.includes(sectionId) && sectionId !== 'footer') return
                if (manualScrollLockRef.current) {
                    const target = manualScrollTargetRef.current
                    if (target && sectionId !== target) return
                    manualScrollLockRef.current = false
                    manualScrollTargetRef.current = null
                    if (manualScrollTimeoutRef.current) {
                        clearTimeout(manualScrollTimeoutRef.current)
                        manualScrollTimeoutRef.current = null
                    }
                }
                setActivePreviewSection(sectionId)
            }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
    }, [activeSections, lockPreviewHighlight, scrollToSection])

    const buildPreviewData = React.useCallback((fullConfig: Record<string, any>) => {
        return { ...fullConfig, isPreview: true }
    }, [])

    // Sync to preview
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (iframeRef.current?.contentWindow) {
                const previewData = buildPreviewData(mergedConfig)
                iframeRef.current.contentWindow.postMessage({
                    type: 'LIVE_PREVIEW_FULL',
                    data: previewData
                }, '*')
            }
        }, 100)
        return () => clearTimeout(timer)
    }, [mergedConfig, buildPreviewData])

    const refreshPreview = React.useCallback(() => {
        if (iframeRef.current) {
            const src = iframeRef.current.src
            iframeRef.current.src = "about:blank"
            iframeRef.current.src = src
        }
    }, [])

    const sendFullPreview = React.useCallback((config: any) => {
        if (iframeRef.current?.contentWindow) {
            const data = buildPreviewData(config)
            iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_FULL', data }, '*')
        }
    }, [buildPreviewData])


    const autoSaveSection = React.useCallback((sectionId: string, values: any) => {
        if (discardInProgressRef.current) return
        if (saveTimer.current) clearTimeout(saveTimer.current)
        setIsSaving(true)

        if (sectionId === 'seo') {
            setModified((prev) => {
                const currentPagesRaw = Array.isArray((prev as any).pages) ? (prev as any).pages : pages
                const normalizedPages = normalizePagesForEditor(currentPagesRaw)
                const hasTargetPage = normalizedPages.length > 0 && selectedPageIndex >= 0 && selectedPageIndex < normalizedPages.length
                const baseHomeSections = ensureStringArray((prev as any).activeSections ?? (mergedConfig as any).activeSections)
                const nextPages = hasTargetPage
                    ? normalizedPages.map((p: any, idx: number) => idx === selectedPageIndex ? { ...p, seo: values } : p)
                    : [{
                        slug: '',
                        label: 'Home',
                        activeSections: baseHomeSections.length > 0 ? baseHomeSections : ['hero'],
                        seo: values,
                    }]
                const targetPage = nextPages[selectedPageIndex] ?? nextPages[0]
                const isHomeTarget = !targetPage?.slug
                const next = {
                    ...prev,
                    pages: nextPages,
                    ...(isHomeTarget ? { seo: values } : {}),
                }
                if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
                return next
            })
            saveTimer.current = setTimeout(() => setIsSaving(false), 300)
            return
        }

        const key = sectionIdToKey(sectionId)
        setModified((prev) => {
            const next = { ...prev, [key]: values }
            if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
            return next
        })
        saveTimer.current = setTimeout(() => setIsSaving(false), 300)
    }, [LOCAL_KEY, pages, selectedPageIndex, mergedConfig])

    const updatePages = React.useCallback((nextPages: any[]) => {
        // Normalize first so "Home" always maps to root slug "" and slugs stay canonical.
        const normalizedPages = normalizePagesForEditor(Array.isArray(nextPages) ? nextPages : [])
        // Sanitize: strip hero sections from non-home pages
        const sanitizedPages = normalizedPages.map((page: any) => {
            const slug = typeof page?.slug === 'string' ? page.slug : ''
            if (!slug) return page // home page keeps heroes
            const sections = Array.isArray(page?.activeSections) ? page.activeSections : []
            return { ...page, activeSections: sections.filter((s: string) => !s.startsWith('hero')) }
        })
        // Persist pages and keep root activeSections in sync with home page
        setModified((prev) => {
            const homePage = sanitizedPages.find((page: any) => !page?.slug)
            const next: Record<string, any> = { ...prev, pages: sanitizedPages }
            if (homePage?.activeSections) {
                next.activeSections = homePage.activeSections
            }
            if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
            return next
        })
    }, [LOCAL_KEY])

    const updateActivePage = React.useCallback((newPage: any) => {
        if (!activePage) return
        const nextPages = pages.map((p, idx) => idx === selectedPageIndex ? newPage : p)
        updatePages(nextPages)
    }, [activePage, pages, selectedPageIndex, updatePages])

    const updateActivePageSections = React.useCallback((newSections: string[]) => {
        setModified((prev) => {
            const next = { ...prev }

            // 1. Update root activeSections for home page compatibility
            if (isHomePage) {
                next.activeSections = newSections
                if (next.global) {
                    next.global = { ...next.global, activeSections: newSections }
                }
            }

            // 2. Update specific page entry in pages array
            const currentPages = Array.isArray(prev.pages) ? prev.pages : pages
            if (currentPages.length > 0) {
                next.pages = currentPages.map((p: any, idx: number) =>
                    idx === selectedPageIndex ? { ...p, activeSections: newSections } : p
                )
            }

            if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
            return next
        })
    }, [isHomePage, pages, selectedPageIndex, LOCAL_KEY])

    const removeSectionAtIndex = React.useCallback((idx: number) => {
        const next = [...activeSections]
        const removed = next[idx]
        next.splice(idx, 1)
        updateActivePageSections(next)
        if (removed && selectedSection === removed) {
            if (isHeroSectionId(removed)) {
                setStoredHeroSectionId(removed)
                return
            }
            const heroNext = findHeroInActiveSections(next)
            if (isHomePage && heroNext) {
                setSelectedSection(heroNext.id)
                setActivePreviewSection(heroNext.id)
                lockPreviewHighlight(heroNext.id)
                scrollToSection(heroNext.id, heroNext.index)
            } else if (isHomePage && next.length > 0) {
                const firstSection = next[0]
                setSelectedSection(firstSection)
                setActivePreviewSection(firstSection)
                lockPreviewHighlight(firstSection)
                scrollToSection(firstSection, 0)
            } else {
                setSelectedSection(null)
                setActivePreviewSection(null)
            }
        }
    }, [activeSections, selectedSection, isHomePage, updateActivePageSections, scrollToSection, lockPreviewHighlight])

    const heroEditor = React.useMemo(() => {
        const found = findHeroInActiveSections(activeSections)
        const resolvedHeroId = resolveHeroEditorId(activeSections, selectedSection, storedHeroSectionId)
        return {
            resolvedHeroId,
            heroIndex: found?.index ?? -1,
            isVisible: Boolean(found),
        }
    }, [activeSections, selectedSection, storedHeroSectionId])

    const selectHeroInEditor = React.useCallback(() => {
        const id = resolveHeroEditorId(activeSections, selectedSection, storedHeroSectionId)
        setSelectedSection(id)
        setActivePreviewSection(id)
        lockPreviewHighlight(id)
        const found = findHeroInActiveSections(activeSections)
        if (found) scrollToSection(id, found.index)
    }, [activeSections, selectedSection, storedHeroSectionId, scrollToSection, lockPreviewHighlight])

    const showHeroOnPage = React.useCallback(() => {
        const id = resolveHeroEditorId(activeSections, selectedSection, storedHeroSectionId)
        if (findHeroInActiveSections(activeSections)) return
        updateActivePageSections([id, ...activeSections])
    }, [activeSections, selectedSection, storedHeroSectionId, updateActivePageSections])

    const hideHeroFromPage = React.useCallback(() => {
        const found = findHeroInActiveSections(activeSections)
        if (!found) return
        removeSectionAtIndex(found.index)
    }, [activeSections, removeSectionAtIndex])

    const toggleHeroVisibility = React.useCallback(() => {
        if (!selectedSection || !isHeroSectionId(selectedSection)) return
        if (findHeroInActiveSections(activeSections)) {
            hideHeroFromPage()
        } else {
            showHeroOnPage()
        }
    }, [selectedSection, activeSections, hideHeroFromPage, showHeroOnPage])

    return {
        iframeRef,
        selectedSection, setSelectedSection,
        activePreviewSection, setActivePreviewSection,
        formValues, setFormValues,
        isSubmitting, setIsSubmitting,
        isQueueing, setIsQueueing,
        isPublishing, setIsPublishing,
        isSaving, setIsSaving,
        modified, setModified,
        hasPendingRequest, setHasPendingRequest,
        colorPaletteOpen, setColorPaletteOpen,
        typographyOpen, setTypographyOpen,
        colorPaletteQuery, setColorPaletteQuery,
        historyOpen, setHistoryOpen,
        aiEditorOpen, setAiEditorOpen,
        aiHasPending, setAiHasPending,
        versions, setVersions,
        versionsLoading, setVersionsLoading,
        rollbackLoading, setRollbackLoading,
        upgradeLoading, setUpgradeLoading,
        dragSectionIndex, setDragSectionIndex,
        dropSectionIndex, setDropSectionIndex,
        addSectionOpen, setAddSectionOpen,
        sectionSearchQuery, setSectionSearchQuery,
        activeTab, setActiveTab,
        selectedPageIndex, setSelectedPageIndex,
        heroEditor: {
            ...heroEditor,
            selectInEditor: selectHeroInEditor,
            showOnPage: showHeroOnPage,
            hideFromPage: hideHeroFromPage,
            toggleVisibility: toggleHeroVisibility,
        },
        collapsedGroups, setCollapsedGroups,
        aiSeoOpen, setAiSeoOpen,
        mobileSidebarOpen, setMobileSidebarOpen,
        sectionRects,
        colorPaletteRef,
        typographyRef,
        colorPaletteRectRef,
        typographyRectRef,
        discardInProgressRef,
        backdropPointerDownRef,
        hasDraft,
        baseConfig,
        mergedConfig,
        globalConfig,
        pages,
        activePage,
        isHomePage,
        activeSections,
        canUsePages,
        refreshPreview,
        sendFullPreview,
        buildPreviewData,
        autoSaveSection,
        localDraftConfig, setLocalDraftConfig,
        LOCAL_KEY,
        scrollToSection,
        lockPreviewHighlight,
        moveToSectionIndex: (fromIndex: number, toIndex: number) => {
            if (fromIndex === toIndex) return
            const next = [...activeSections]
            const [removed] = next.splice(fromIndex, 1)
            next.splice(toIndex, 0, removed)
            updateActivePageSections(next)
        },
        removeSectionAtIndex,
        addSection: (id: string) => {
            if (activeSections.includes(id)) return
            const next = [...activeSections, id]
            const defaultData = DEFAULT_SECTION_DATA_MAP[id] || {}
            updateActivePageSections(next)
            autoSaveSection(id, defaultData)
            setAddSectionOpen(false)
            setSelectedSection(id)
            setActivePreviewSection(id)
            lockPreviewHighlight(id)
            scrollToSection(id, next.length - 1)
        },
        updatePages,
        updateActivePage,
        updateActivePageSections
    }
}
