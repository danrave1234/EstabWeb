"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ChevronRight, FileText, Settings, Eye, Layout, Send, Plus, Trash2, GripVertical, Image as ImageIcon, History, RotateCcw, Zap, CreditCard, Palette, X, BarChart3, Phone, MessageSquare, FormInput } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import UpgradeButton from "@/components/dashboard/UpgradeButton"
import SubscriptionSettings from "@/components/dashboard/SubscriptionSettings"
import PreviewFrame from "@/components/dashboard/PreviewFrame"
import AwardIconPicker from "@/components/dashboard/AwardIconPicker"
import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/shared/ImageUpload"
import MapPinPicker from "@/components/dashboard/MapPinPicker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { GENRE_LABELS } from "@/config/presets"
import { slugify, PAGE_CATEGORY_LABELS, categoryLabelForSection } from "@/lib/utils/blocks"
import { BLOCK_MAP } from "@/lib/utils/block-registry"
import { SectionLivePreview } from "@/components/dashboard/SectionLivePreview"
import { AddSectionModal } from "@/components/dashboard/AddSectionModal"
import { VersionHistoryModal } from "@/components/dashboard/VersionHistoryModal"
import { canPublishDirectly, canPublishNow, getPublishStats, isTrialExpired } from "@/lib/subscription"
import { 
  COLOR_THEME_SWATCHES, 
  TYPOGRAPHY_OPTIONS, 
  AWARD_ICON_NAMES, 
  DEFAULT_FOOTER, 
  DEFAULT_NAVIGATION,
  DEFAULT_EMERGENCY_CTA,
  DEFAULT_AWARDS_STRIP,
  DEFAULT_FAQ_ACCORDION,
  DEFAULT_BLOG,
  DEFAULT_BEFORE_AFTER_GALLERY,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_PRACTICE_AREAS,
  DEFAULT_TREATMENT_PROCESS,
  DEFAULT_COMMON_PESTS,
  DEFAULT_FEATURED_LISTINGS,
  DEFAULT_DEVELOPER_PARTNERS,
  DEFAULT_REVIEW_TRUST_BAR,
  DEFAULT_FINANCING,
  DEFAULT_AC_TYPES,
  DEFAULT_PRICE_PREVIEW,
  DEFAULT_PRICING_TABLE,
  DEFAULT_MAINTENANCE_PLANS,
  DEFAULT_FACEBOOK_REVIEW_EMBED,
  DEFAULT_WHY_CHOOSE_ME,
  DEFAULT_SERVICE_AREA_MAP,
  DEFAULT_LOGO_CLOUD,
  DEFAULT_DELIVERY_COVERAGE,
  DEFAULT_CONTACT_WITH_MAP,
  DEFAULT_BLUEPRINT_CONFIG,
  fieldLabel,
  ensureStringArray,
  navigationToArray,
  deepMerge,
  sectionIdToKey
} from "@/config/dashboard-config"

// Dashboard components



// SECTION_CATEGORIES moved to @/lib/utils/block-registry

const formatSectionLabel = (id: string) => BLOCK_MAP[id]?.label ?? id.replace(/[-_]/g, " ").replace(/--/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

// slugify, PAGE_CATEGORY_LABELS, categoryLabelForSection imported from @/lib/utils/blocks

const normalizeArrayItems = <T,>(value: unknown, fallback: T[]): T[] => {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, T>)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => (value as Record<string, T>)[k])
  }
  return fallback
}

const DEFAULT_SECTION_DATA_MAP: Record<string, any> = {
  // ── canonical IDs (new architecture) ──────────────────────────────────────
  'certifications': DEFAULT_AWARDS_STRIP,
  'testimonials': DEFAULT_REVIEW_TRUST_BAR,
  'testimonials--grid': DEFAULT_REVIEW_TRUST_BAR,
  'testimonials--facebook': DEFAULT_FACEBOOK_REVIEW_EMBED,
  'logo_cloud': DEFAULT_LOGO_CLOUD,
  'faq': DEFAULT_FAQ_ACCORDION,
  'faq--two-column': DEFAULT_PRACTICE_AREAS,
  'blog_preview': DEFAULT_BLOG,
  'gallery': DEFAULT_BEFORE_AFTER_GALLERY,
  'gallery--slider': DEFAULT_BEFORE_AFTER_GALLERY,
  'process': DEFAULT_HOW_IT_WORKS,
  'process--timeline': DEFAULT_TREATMENT_PROCESS,
  'specialty_listings': DEFAULT_FEATURED_LISTINGS,
  'comparison': DEFAULT_AC_TYPES,
  'pricing': DEFAULT_PRICING_TABLE,
  'pricing--subscription': DEFAULT_MAINTENANCE_PLANS,
  'price_preview': DEFAULT_PRICE_PREVIEW,
  'service_area': DEFAULT_SERVICE_AREA_MAP,
  'service_area--radius': DEFAULT_DELIVERY_COVERAGE,
  'contact_with_map': DEFAULT_CONTACT_WITH_MAP,
  'contact-with-map': DEFAULT_CONTACT_WITH_MAP,
  'announcement_bar': { text: 'Limited Promo: Get 20% off on all services this month!', buttonText: 'Book Now', buttonHref: '#contact', countdownDate: '' },
  'announcement_bar--promo': { text: 'Limited Promo: Get 20% off on all services this month!', buttonText: 'Book Now', buttonHref: '#contact', countdownDate: '' },
  'announcement_bar--emergency': { text: '24/7 Emergency Service Available — Call Now!', buttonText: 'Call Now', buttonHref: 'tel:+18005551234', countdownDate: '' },
  'announcement_bar--offer': { text: 'Free Inspection with Every Service — Limited Time!', buttonText: 'Claim Offer', buttonHref: '#contact', countdownDate: '' },
  // ── legacy IDs (kept for backward-compat) ─────────────────────────────────
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
}

// prefetchSectionPreview, MinimalSectionPreview, SectionLivePreview moved to @/components/dashboard/SectionLivePreview


interface DashboardClientProps {
  project: any
  user: any
}

export default function ClientDashboardPreview({ project, user }: DashboardClientProps) {
  const router = useRouter()
  const LOCAL_KEY = `ew_local_draft_${project.id}`
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  
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
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [globalSettingsModalTab, setGlobalSettingsModalTab] = React.useState<"theme" | "sections">("theme")
  const colorPaletteRef = React.useRef<HTMLButtonElement>(null)
  const typographyRef = React.useRef<HTMLButtonElement>(null)
  const colorPaletteRectRef = React.useRef<DOMRect | null>(null)
  const typographyRectRef = React.useRef<DOMRect | null>(null)
  const manualScrollLockRef = React.useRef(false)
  const manualScrollTargetRef = React.useRef<string | null>(null)
  const manualScrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const discardInProgressRef = React.useRef(false)

  const paletteEntries = React.useMemo(() => {
    const hexToRgb = (hex: string) => {
      const h = hex.replace('#', '').trim()
      if (h.length !== 6) return null
      const r = parseInt(h.slice(0, 2), 16)
      const g = parseInt(h.slice(2, 4), 16)
      const b = parseInt(h.slice(4, 6), 16)
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
      return { r, g, b }
    }

    const rgbToHsl = (r: number, g: number, b: number) => {
      const rn = r / 255
      const gn = g / 255
      const bn = b / 255
      const max = Math.max(rn, gn, bn)
      const min = Math.min(rn, gn, bn)
      const d = max - min
      const l = (max + min) / 2
      if (d === 0) return { h: 0, s: 0, l }
      const s = d / (1 - Math.abs(2 * l - 1))
      let h = 0
      if (max === rn) h = ((gn - bn) / d) % 6
      else if (max === gn) h = (bn - rn) / d + 2
      else h = (rn - gn) / d + 4
      h *= 60
      if (h < 0) h += 360
      return { h, s, l }
    }

    const tagForHex = (hex: string) => {
      const rgb = hexToRgb(hex)
      if (!rgb) return [] as string[]
      const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const tags: string[] = []
      if (s < 0.12) tags.push('neutral')
      if (l < 0.18) tags.push('dark')
      if (l > 0.85) tags.push('light')
      if (s >= 0.12) {
        if (h >= 200 && h < 260) tags.push('blue')
        else if (h >= 260 && h < 315) tags.push('purple')
        else if (h >= 315 || h < 15) tags.push('red')
        else if (h >= 15 && h < 45) tags.push('orange')
        else if (h >= 45 && h < 75) tags.push('yellow')
        else if (h >= 75 && h < 160) tags.push('green')
        else if (h >= 160 && h < 200) tags.push('teal')
      }
      return tags
    }

    return Object.keys(COLOR_THEME_SWATCHES).map((key) => {
      const swatches = COLOR_THEME_SWATCHES[key] || COLOR_THEME_SWATCHES.partner
      const nameTags = key.split(/[-_\s]+/g).filter(Boolean).map((t) => t.toLowerCase())
      const colorTags = Array.from(new Set(swatches.flatMap((hex) => tagForHex(hex))))
      const tags = Array.from(new Set([...nameTags, ...colorTags]))
      return { key, swatches, tags }
    })
  }, [])


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

  const supabaseRef = React.useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  React.useEffect(() => {
    const checkPending = async () => {
      const { data } = await supabase
        .from('change_requests')
        .select('id')
        .eq('project_id', project.id)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle()
      setHasPendingRequest(!!data)
    }
    checkPending()
  }, [project.id])

  const sendToIframe = React.useCallback((message: any) => {
    try {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage(message, '*')
    } catch {}
  }, [])

  const lastPreviewPayloadRef = React.useRef<string | null>(null)
  const sendFullPreview = React.useCallback((payload: Record<string, any>) => {
    try {
      const next = JSON.stringify(payload)
      if (lastPreviewPayloadRef.current === next) return
      lastPreviewPayloadRef.current = next
      sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: payload })
    } catch {
      sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: payload })
    }
  }, [sendToIframe])

  const scrollToSection = React.useCallback((sectionId: string, sectionIndex?: number) => {
    sendToIframe({ type: 'SCROLL_TO_SECTION', sectionId, sectionIndex })
  }, [sendToIframe])

  const lockPreviewHighlight = React.useCallback((sectionId: string | null) => {
    manualScrollLockRef.current = true
    manualScrollTargetRef.current = sectionId
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current)
    manualScrollTimeoutRef.current = setTimeout(() => {
      manualScrollLockRef.current = false
      manualScrollTargetRef.current = null
    }, 1200)
  }, [])

  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          console.log('[dashboard-preview] loaded local draft from storage', {
            projectId: project.id,
            keys: Object.keys(parsed || {}),
          })
          setModified(parsed)
        }
      } else {
        console.log('[dashboard-preview] no local draft in storage', { projectId: project.id })
      }
    } catch {}
  }, [LOCAL_KEY])

  const [localDraftConfig, setLocalDraftConfig] = React.useState<Record<string, any> | null>(
    (project.draft_config && Object.keys(project.draft_config).length > 0)
      ? (project.draft_config as Record<string, any>)
      : null
  )

  React.useEffect(() => {
    if (project.draft_config && Object.keys(project.draft_config).length > 0) {
      setLocalDraftConfig(project.draft_config as Record<string, any>)
    } else {
      setLocalDraftConfig(null)
    }
  }, [project.draft_config])

  const hasDraft = !!localDraftConfig && Object.keys(localDraftConfig).length > 0
  const baseConfig = hasDraft ? localDraftConfig : (project.current_config || {})
  const canPublish = canPublishDirectly(project)
  const canUsePages = canPublish
  const publishStats = getPublishStats(project)
  const showUpgrade = (project.subscription_status || 'free') === 'free' || isTrialExpired(project)
  const hasLocalChanges = Object.keys(modified).length > 0
  const publishDisabledReason = React.useMemo(() => {
    if (canPublish) {
      if (isPublishing) return 'Publishing in progress.'
      if (!canPublishNow(project)) {
        if (publishStats.remaining <= 0) {
          return `Period limit reached (${publishStats.used}/${publishStats.limit}).`
        }
        if (publishStats.remainingToday <= 0) {
          return `Daily limit reached (${publishStats.usedToday}/${publishStats.limitDaily} today).`
        }
        return 'Publishing is temporarily unavailable.'
      }
      if (!hasDraft && !hasLocalChanges) return 'Save a draft before publishing.'
      return null
    }

    if (isQueueing) return 'Submitting for approval.'
    if (hasPendingRequest) return 'A change request is already pending.'
    return null
  }, [canPublish, isPublishing, isQueueing, hasPendingRequest, publishStats.limit, publishStats.limitDaily, publishStats.remaining, publishStats.remainingToday, publishStats.used, publishStats.usedToday, project, hasDraft, hasLocalChanges])
  const mergedConfig = React.useMemo(() => deepMerge(baseConfig, modified), [baseConfig, modified])
  const globalConfig = mergedConfig
  const normalizedPages = React.useMemo(() => {
    const rawPages = Array.isArray(globalConfig.pages) ? globalConfig.pages : []
    return rawPages.map((page: Record<string, any>, index: number) => {
      const payload = (page || {}) as Record<string, any>
      const rawSlug = typeof payload.slug === 'string' ? payload.slug : ''
      const slug = rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase()
      const rawLabel = typeof payload.label === 'string' ? payload.label : ''
      const rawSections = Array.isArray(payload.activeSections) ? payload.activeSections : []
      const firstSection = typeof rawSections[0] === 'string' ? rawSections[0] : ''
      const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : ''
      const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim())
      const isGenericSlug = !slug || /^page-\d+$/i.test(slug)
      const fallbackLabel = categoryLabel || (slug && !isGenericSlug ? slug.replace(/-/g, ' ') : `Page ${index + 1}`)
      const label = isGenericLabel ? fallbackLabel : rawLabel
      const nextSlug = label.toLowerCase() === 'home' ? '' : (slug || slugify(label))
      return {
        slug: nextSlug,
        label,
        activeSections: rawSections,
        seo: payload.seo && typeof payload.seo === 'object' ? payload.seo : { title: '', description: '', keywords: [] },
      }
    })
  }, [globalConfig.pages])

  const pages = React.useMemo(() => {
    if (normalizedPages.length > 0) return normalizedPages
    return [{
      slug: '',
      label: 'Home',
      activeSections: ensureStringArray(globalConfig.activeSections).length > 0 ? ensureStringArray(globalConfig.activeSections) : ['hero'],
      seo: { title: '', description: '', keywords: [] },
    }]
  }, [normalizedPages, globalConfig.activeSections, ensureStringArray])

  React.useEffect(() => {
    if (selectedPageIndex > pages.length - 1) {
      setSelectedPageIndex(0)
    }
  }, [pages.length, selectedPageIndex])

  const activePage = pages[selectedPageIndex] ?? pages[0]
  const isHomePage = !activePage?.slug
  const activeSections = ensureStringArray(activePage?.activeSections ?? globalConfig.activeSections)
    .filter((section) => isHomePage || !section.startsWith('hero'))
  // Use the project's subdomain for preview; always include projectId so the page can fetch by ID when subdomain/custom domain isn't set.
  const basePath = project?.subdomain ? `/${project.subdomain}` : '/preview'
  const activeSlug = activePage?.slug ? `/${activePage.slug}` : ''
  const previewPath = `${basePath}${activeSlug}?preview=true&projectId=${project.id}`

  const resolvePageIndexFromPath = React.useCallback((pathname: string) => {
    if (!pathname) return 0
    const cleanBase = basePath.replace(/\/+$/g, '')
    let remainder = pathname
    if (cleanBase && remainder.startsWith(cleanBase)) {
      remainder = remainder.slice(cleanBase.length)
    }
    remainder = remainder.replace(/^\/+/, '')
    const slug = remainder.split('/')[0] || ''
    if (!slug) return 0
    const normalized = slug.toLowerCase()
    const matchIndex = pages.findIndex((page: { slug?: string | null }) => (page.slug || '').toLowerCase() === normalized)
    return matchIndex >= 0 ? matchIndex : 0
  }, [basePath, pages])

  const buildPreviewData = React.useCallback((fullConfig: Record<string, any>) => {
    const next = { ...fullConfig }
    if (activePage) {
      next.activeSections = activePage.activeSections ?? next.activeSections
      next.seo = activePage.seo ?? next.seo
    }
    if (next.navigation !== undefined) next.navigation = navigationToArray(next.navigation)
    if (next.activeSections !== undefined) next.activeSections = ensureStringArray(next.activeSections)
    return next
  }, [activePage, ensureStringArray, navigationToArray])

  React.useEffect(() => {
    sendFullPreview(buildPreviewData(mergedConfig))
  }, [activePage, mergedConfig, buildPreviewData, sendFullPreview])

  // When the iframe indicates it's ready, send a full snapshot: baseConfig overlaid with local (unsaved) edits
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as any)?.type === 'LIVE_PREVIEW_READY') {
        sendFullPreview(buildPreviewData(mergedConfig))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [mergedConfig, sendFullPreview, buildPreviewData])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as any)?.type !== 'PREVIEW_ACTIVE_SECTION') return
      const sectionId = (e.data as any)?.sectionId as string | undefined
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
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [activeSections])

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as any)?.type !== 'PREVIEW_ROUTE_CHANGED') return
      const pathname = (e.data as any)?.pathname as string | undefined
      const search = (e.data as any)?.search as string | undefined
      if (!pathname) return
      if (search && !search.includes(`projectId=${project.id}`)) return
      const nextIndex = resolvePageIndexFromPath(pathname)
      setSelectedPageIndex((current) => (current === nextIndex ? current : nextIndex))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [project.id, resolvePageIndexFromPath])

  const refreshPreview = React.useCallback(() => {
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = src
    }
  }, [])

  const autoSaveSection = React.useCallback((sectionId: string, values: any) => {
    if (discardInProgressRef.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setIsSaving(true)
    
    const key = sectionIdToKey(sectionId)
    
    // Update local state and localStorage
    setModified((prev) => {
      const next = { ...prev, [key]: values }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      }
      console.log('[dashboard-preview] autoSaveSection', {
        projectId: project.id,
        sectionId,
        sectionKey: key,
        modifiedKeys: Object.keys(next || {}),
      })
      return next
    })

    // Small delay to show saving state
    saveTimer.current = setTimeout(() => setIsSaving(false), 300)
  }, [sectionIdToKey, LOCAL_KEY])

  const updatePages = React.useCallback((nextPages: any[]) => {
    const sanitizedPages = nextPages.map((page) => {
      const slug = typeof page?.slug === 'string' ? page.slug : ''
      if (!slug) return page
      const sections = Array.isArray(page?.activeSections) ? page.activeSections : []
      return {
        ...page,
        activeSections: sections.filter((section: string) => !section.startsWith('hero')),
      }
    })
    autoSaveSection('pages', sanitizedPages)
    const homePage = sanitizedPages.find((page) => !page?.slug)
    if (homePage?.activeSections) {
      autoSaveSection('activeSections', homePage.activeSections)
    }
    console.log('[dashboard-preview] updatePages', {
      projectId: project.id,
      pageCount: sanitizedPages.length,
      slugs: sanitizedPages.map((page) => page?.slug || ''),
    })
  }, [autoSaveSection])

  const updateActivePage = React.useCallback((patch: Record<string, any>) => {
    const nextPages = pages.map((page: Record<string, any>, idx: number) => {
      if (idx !== selectedPageIndex) return page
      return { ...page, ...patch }
    })
    updatePages(nextPages)
  }, [pages, selectedPageIndex, updatePages])

  const updateActivePageSections = React.useCallback((nextSections: string[]) => {
    const cleaned = isHomePage
      ? nextSections
      : nextSections.filter((section) => !section.startsWith('hero'))

    if (!isHomePage) {
      const currentLabel = pages[selectedPageIndex]?.label || ""
      const isGenericLabel = /^page\s+\d+$/i.test(currentLabel.trim())
      if (isGenericLabel) {
        const firstSection = cleaned.find((section) => typeof section === 'string' && section.length > 0)
        if (firstSection) {
          const nextLabel = categoryLabelForSection(firstSection) || formatSectionLabel(firstSection)
          updateActivePage({ activeSections: cleaned, label: nextLabel })
          return
        }
      }
    }

    updateActivePage({ activeSections: cleaned })
  }, [isHomePage, pages, selectedPageIndex, updateActivePage])

  const moveToSectionIndex = React.useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const next = [...activeSections]
    const [removed] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, removed)
    updateActivePageSections(next)
  }, [activeSections, updateActivePageSections])

  const removeSectionAtIndex = React.useCallback((idx: number) => {
    const next = [...activeSections]
    const removed = next[idx]
    next.splice(idx, 1)
    updateActivePageSections(next)
    if (removed && selectedSection === removed) {
      if (isHomePage) {
        setSelectedSection('hero')
        setActivePreviewSection('hero')
        lockPreviewHighlight('hero')
        const heroIndex = next.indexOf('hero')
        if (heroIndex >= 0) scrollToSection('hero', heroIndex)
      } else {
        setSelectedSection(null)
        setActivePreviewSection(null)
      }
    }
  }, [activeSections, updateActivePageSections, selectedSection, lockPreviewHighlight, scrollToSection, isHomePage])

  const addSection = React.useCallback((id: string) => {
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
  }, [activeSections, autoSaveSection, updateActivePageSections, lockPreviewHighlight, scrollToSection])

  // Efficiently sync changes to the iframe with a short debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(modified).length === 0) return
      sendFullPreview(buildPreviewData(mergedConfig))
    }, 150) // 150ms debounce is fast enough to feel instant but slow enough to batch keystrokes

    return () => clearTimeout(timer)
  }, [modified, mergedConfig, sendFullPreview, buildPreviewData])

  // Load full section object for the selected section (including arrays like items/steps)
  React.useEffect(() => {
    if (selectedSection) {
      const setFormWithCollapsed = (values: Record<string, any>) => {
        setFormValues(values)
        const nextCollapsed: Record<string, boolean> = {}
        Object.entries(values).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            nextCollapsed[`${selectedSection}-${key}`] = true
          }
        })
        setCollapsedGroups(nextCollapsed)
      }

      if (selectedSection === 'global_settings') {
        setFormWithCollapsed({}) // Not used for global
        return
      }
      const sectionKey = sectionIdToKey(selectedSection)
      const local = (modified as any)?.[sectionKey]
      const base = local ?? baseConfig[sectionKey] ?? {}
      if (sectionKey === 'footer') {
        const baseFooter = base as Record<string, any>
        const merged = {
          ...DEFAULT_FOOTER,
          ...baseFooter,
          social: { ...DEFAULT_FOOTER.social, ...(baseFooter?.social ?? {}) },
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'navigation') {
        const nav = navigationToArray(base)
        setFormWithCollapsed(nav as unknown as Record<string, any>)
      } else if (sectionKey === 'legal') {
        const baseLegal = (base || {}) as Record<string, { title?: string; content?: string; lastUpdated?: string }>
        const merged = {
          privacypolicy: { ...DEFAULT_BLUEPRINT_CONFIG.privacy, ...(baseLegal.privacypolicy ?? {}) },
          termsofservice: { ...DEFAULT_BLUEPRINT_CONFIG.termsofservice, ...(baseLegal.termsofservice ?? {}) },
          cookiepolicy: { ...DEFAULT_BLUEPRINT_CONFIG.cookiepolicy, ...(baseLegal.cookiepolicy ?? {}) },
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'pages') {
        const rawPages = Array.isArray(base) ? base : []
        const normalizedPages = rawPages.map((page, index) => {
          const payload = (page || {}) as Record<string, any>
          const rawSlug = typeof payload.slug === 'string' ? payload.slug : ''
          const slug = rawSlug.replace(/^\/+|\/+$/g, '').toLowerCase()
          const rawLabel = typeof payload.label === 'string' ? payload.label : ''
          const rawSections = Array.isArray(payload.activeSections) ? payload.activeSections : []
          const firstSection = typeof rawSections[0] === 'string' ? rawSections[0] : ''
          const categoryLabel = firstSection ? categoryLabelForSection(firstSection) : ''
          const isGenericLabel = !rawLabel || /^page\s+\d+$/i.test(rawLabel.trim())
          const isGenericSlug = !slug || /^page-\d+$/i.test(slug)
          const fallbackLabel = categoryLabel || (slug && !isGenericSlug ? slug.replace(/-/g, ' ') : `Page ${index + 1}`)
          const label = (isGenericLabel || categoryLabel) ? fallbackLabel : rawLabel
          const nextSlug = label.toLowerCase() === 'home' ? '' : (isGenericSlug ? slugify(label) : (slug || slugify(label)))
          return {
            slug: nextSlug,
            label,
            activeSections: rawSections,
            seo: payload.seo && typeof payload.seo === 'object' ? payload.seo : { title: '', description: '', keywords: [] },
          }
        })
        const baseSections = ensureStringArray(globalConfig.activeSections)
        const fallbackPage = {
          slug: '',
          label: 'Home',
          activeSections: baseSections.length > 0 ? baseSections : ['hero'],
          seo: { title: '', description: '', keywords: [] },
        }
        setFormWithCollapsed({ pages: normalizedPages.length > 0 ? normalizedPages : [fallbackPage] })
      } else if (sectionKey === 'emergencyCTA') {
        const merged = { ...DEFAULT_EMERGENCY_CTA, ...(base as Record<string, any>) }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'awardsStrip') {
        const baseAwards = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseAwards.items, DEFAULT_AWARDS_STRIP.items)
        const merged = {
          ...DEFAULT_AWARDS_STRIP,
          ...baseAwards,
          items,
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'faqAccordion') {
        const baseFaq = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseFaq.items, DEFAULT_FAQ_ACCORDION.items)
        const merged = {
          ...DEFAULT_FAQ_ACCORDION,
          ...baseFaq,
          items,
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'beforeAfterGallery') {
        const baseGal = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseGal.items, DEFAULT_BEFORE_AFTER_GALLERY.items)
        const merged = {
          ...DEFAULT_BEFORE_AFTER_GALLERY,
          ...baseGal,
          items,
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'blog') {
        const baseBlog = (base || {}) as Record<string, any>
        const posts = normalizeArrayItems(baseBlog.posts, DEFAULT_BLOG.posts)
        const merged = {
          ...DEFAULT_BLOG,
          ...baseBlog,
          posts,
        }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'howItWorks') {
        const baseH = (base || {}) as Record<string, any>
        const steps = normalizeArrayItems(baseH.steps ?? baseH.items, DEFAULT_HOW_IT_WORKS.steps)
        const merged = { ...DEFAULT_HOW_IT_WORKS, ...baseH, steps }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'practiceAreas') {
        const baseP = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseP.items ?? baseP.areas, DEFAULT_PRACTICE_AREAS.items)
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseP, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'treatmentProcess') {
        const baseT = (base || {}) as Record<string, any>
        const steps = normalizeArrayItems(baseT.steps, DEFAULT_TREATMENT_PROCESS.steps)
        const merged = { ...DEFAULT_TREATMENT_PROCESS, ...baseT, steps }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'commonPests') {
        const baseC = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseC.items, DEFAULT_COMMON_PESTS.items)
        const merged = { ...DEFAULT_COMMON_PESTS, ...baseC, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'featuredListings') {
        const baseF = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseF.items, DEFAULT_FEATURED_LISTINGS.items)
        const merged = { ...DEFAULT_FEATURED_LISTINGS, ...baseF, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'developerPartners') {
        const baseD = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseD.items, DEFAULT_DEVELOPER_PARTNERS.items)
        const merged = { ...DEFAULT_DEVELOPER_PARTNERS, ...baseD, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'reviewTrustBar') {
        const baseR = (base || {}) as Record<string, any>
        const testimonials = normalizeArrayItems(baseR.testimonials, DEFAULT_REVIEW_TRUST_BAR.testimonials)
        const merged = { ...DEFAULT_REVIEW_TRUST_BAR, ...baseR, testimonials }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'financing') {
        const baseFi = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseFi.items, DEFAULT_FINANCING.items)
        const merged = { ...DEFAULT_FINANCING, ...baseFi, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'acTypes') {
        const baseA = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseA.items, DEFAULT_AC_TYPES.items)
        const merged = { ...DEFAULT_AC_TYPES, ...baseA, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'pricePreview') {
        const baseP = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseP.items, DEFAULT_PRICE_PREVIEW.items)
        const merged = { ...DEFAULT_PRICE_PREVIEW, ...baseP, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'safety') {
        const baseS = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseS.items, DEFAULT_PRACTICE_AREAS.items)
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseS, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'featureHighlight') {
        const baseFh = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseFh.items, DEFAULT_PRACTICE_AREAS.items)
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseFh, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'pricingTable') {
        const baseP = (base || {}) as Record<string, any>
        const plans = normalizeArrayItems(baseP.plans, DEFAULT_PRICING_TABLE.plans)
        const merged = { ...DEFAULT_PRICING_TABLE, ...baseP, plans }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'maintenancePlans') {
        const baseM = (base || {}) as Record<string, any>
        const plans = normalizeArrayItems(baseM.plans, DEFAULT_MAINTENANCE_PLANS.plans)
        const merged = { ...DEFAULT_MAINTENANCE_PLANS, ...baseM, plans }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'facebookReviewEmbed') {
        const baseFb = (base || {}) as Record<string, any>
        const reviews = normalizeArrayItems(baseFb.reviews, DEFAULT_FACEBOOK_REVIEW_EMBED.reviews)
        const merged = { ...DEFAULT_FACEBOOK_REVIEW_EMBED, ...baseFb, reviews }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'whyChooseMe') {
        const baseW = (base || {}) as Record<string, any>
        const trustSignals = normalizeArrayItems(baseW.trustSignals, DEFAULT_WHY_CHOOSE_ME.trustSignals)
        const merged = { ...DEFAULT_WHY_CHOOSE_ME, ...baseW, trustSignals }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'serviceAreaMap') {
        const baseS = (base || {}) as Record<string, any>
        let cities = Array.isArray(baseS.cities) ? baseS.cities : (Array.isArray(baseS.areas) ? baseS.areas : DEFAULT_SERVICE_AREA_MAP.cities)
        const merged = { ...DEFAULT_SERVICE_AREA_MAP, ...baseS, cities }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'contactWithMap') {
        const baseCM = (base || {}) as Record<string, any>
        const merged = { ...DEFAULT_CONTACT_WITH_MAP, ...baseCM }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'logoCloud') {
        const baseL = (base || {}) as Record<string, any>
        const items = normalizeArrayItems(baseL.items, DEFAULT_LOGO_CLOUD.items)
        const merged = { ...DEFAULT_LOGO_CLOUD, ...baseL, items }
        setFormWithCollapsed(merged)
      } else if (sectionKey === 'deliveryCoverage') {
        const baseD = (base || {}) as Record<string, any>
        let areas = Array.isArray(baseD.areas) ? baseD.areas : DEFAULT_DELIVERY_COVERAGE.areas
        const merged = { ...DEFAULT_DELIVERY_COVERAGE, ...baseD, areas }
        setFormWithCollapsed(merged)
      } else {
        setFormWithCollapsed(base as Record<string, any>)
      }
    }
  }, [selectedSection, baseConfig, modified, sectionIdToKey])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background pt-16 lg:pt-16">
      {/* Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[47] lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 w-[280px] sm:w-[320px] bottom-0 border-r border-border bg-background flex flex-col shrink-0 shadow-xl z-[48] transition-transform duration-300 lg:translate-x-0 lg:static lg:z-20 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border space-y-4 bg-muted/20">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <div>
            <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
              <Layout className="w-6 h-6 text-primary" />
              Site Editor
            </h2>
            <p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-widest opacity-70">
              Personalize your presence
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/10">
          {[
            { id: "content", label: "Content", icon: FileText },
            { id: "design", label: "Design", icon: Palette },
            { id: "advanced", label: "Advanced", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? "bg-background text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground hover:bg-background/50"}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {activeTab === "content" && (
            <div className="space-y-4">
              <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Core Identity
              </div>
              <button
                onClick={() => setSelectedSection('brand')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'brand' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Brand & Logo</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Identity & Name</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button
                onClick={() => setSelectedSection('navigation')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'navigation' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Layout className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Navigation</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Menu Links</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="pt-4 px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 flex items-center justify-between">
                Pages
                <button
                  type="button"
                  onClick={() => {
                    if (!canUsePages) return
                    const baseLabel = `Page ${pages.length + 1}`
                    let slug = slugify(baseLabel)
                    let counter = 1
                    while (pages.some((page: { slug?: string | null }) => page.slug === slug)) {
                      slug = `${slugify(baseLabel)}-${counter}`
                      counter += 1
                    }
                    const next = [...pages, { slug, label: baseLabel, activeSections: [], seo: { title: '', description: '', keywords: [] } }]
                    updatePages(next)
                    setSelectedPageIndex(next.length - 1)
                    setSelectedSection(null)
                    setActivePreviewSection(null)
                  }}
                  disabled={!canUsePages}
                  className="p-1 hover:bg-primary/10 text-primary rounded transition-colors disabled:text-muted-foreground disabled:hover:bg-transparent"
                  title="Add Page"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {!canUsePages && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[11px] text-amber-700 font-semibold">
                    Multi-page sites are available on paid plans. Upgrade to add more pages.
                  </div>
                )}
                {pages.map((page: Record<string, any>, idx: number) => (
                  <div key={`${page.slug || 'home'}-${idx}`} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPageIndex(idx)
                        if (page.slug) {
                          setSelectedSection(null)
                          setActivePreviewSection(null)
                          return
                        }
                        setSelectedSection(null)
                        setActivePreviewSection(null)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group border ${selectedPageIndex === idx ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted border-transparent'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                        <Layout className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{page.label || (page.slug ? page.slug.replace(/-/g, ' ') : 'Home')}</p>
                        <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">
                          {page.slug ? `/${page.slug}` : 'Home'}
                        </p>
                      </div>
                    </button>
                    {page.slug && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = pages.filter((_: Record<string, any>, i: number) => i !== idx)
                          updatePages(next)
                          if (selectedPageIndex === idx) {
                            setSelectedPageIndex(0)
                            setSelectedSection(null)
                            setActivePreviewSection(null)
                          } else if (selectedPageIndex > idx) {
                            setSelectedPageIndex(selectedPageIndex - 1)
                          }
                        }}
                        className="absolute right-2 top-2 p-1.5 opacity-40 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                        title="Remove Page"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

              </div>

              <div className="pt-4 px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50 flex items-center justify-between">
                Page Sections
                <button
                  type="button"
                  onClick={() => setAddSectionOpen(true)}
                  className="p-1 hover:bg-primary/10 text-primary rounded transition-colors"
                  title="Add Section"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {isHomePage && (
                <button
                  onClick={() => {
                    setSelectedSection('hero')
                    setActivePreviewSection('hero')
                    lockPreviewHighlight('hero')
                    const heroIndex = activeSections.indexOf('hero')
                    if (heroIndex >= 0) scrollToSection('hero', heroIndex)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group border border-transparent ${(selectedSection === 'hero' || activePreviewSection === 'hero') ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">Hero Section</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Main Banner</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}

              <div className="px-1">
                <div className="relative">
                  <input
                    type="text"
                    value={sectionSearchQuery}
                    onChange={(e) => setSectionSearchQuery(e.target.value)}
                    placeholder="Filter sections..."
                    className="w-full px-3 pr-8 py-2 bg-muted/40 border border-border/50 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
                  />
                  {sectionSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSectionSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                      title="Clear"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {activeSections.map((section: string, sectionIndex: number) => {
                if (section === 'hero') return null
                const sectionDisplayLabel = BLOCK_MAP[section]?.label ?? section.replace(/[-_]/g, ' ')
                if (sectionSearchQuery && !sectionDisplayLabel.toLowerCase().includes(sectionSearchQuery.toLowerCase())) return null

                const isDragging = dragSectionIndex === sectionIndex
                const isDropTarget = dropSectionIndex === sectionIndex

                return (
                  <div
                    key={`${section}-${sectionIndex}`}
                    draggable
                    onDragStart={() => setDragSectionIndex(sectionIndex)}
                    onDragEnd={() => { setDragSectionIndex(null); setDropSectionIndex(null) }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (dragSectionIndex !== null && dragSectionIndex !== sectionIndex) setDropSectionIndex(sectionIndex)
                    }}
                    onDragLeave={() => setDropSectionIndex(null)}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (dragSectionIndex !== null && dragSectionIndex !== sectionIndex) {
                        moveToSectionIndex(dragSectionIndex, sectionIndex)
                      }
                      setDragSectionIndex(null)
                      setDropSectionIndex(null)
                    }}
                    className={`relative group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left border ${isDragging ? 'opacity-40 bg-muted border-dashed' : (selectedSection === section || activePreviewSection === section) ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted border-transparent'} ${isDropTarget ? 'border-t-primary border-t-2' : ''}`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary z-10"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSection(section)
                        setActivePreviewSection(section)
                        lockPreviewHighlight(section)
                        scrollToSection(section, sectionIndex)
                      }}
                      className="flex-1 min-w-0 text-left py-1"
                    >
                      <p className="text-sm font-bold truncate">{BLOCK_MAP[section]?.label ?? section.replace(/[-_]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                      <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">{BLOCK_MAP[section]?.variant ?? 'Block'}</p>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeSectionAtIndex(sectionIndex)
                      }}
                      className="p-1.5 opacity-40 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                      title="Remove Section"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}

              <div className="mt-3 px-1">
                <button
                  type="button"
                  onClick={() => setAddSectionOpen(true)}
                  className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Add New Block
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedSection('footer')
                  setActivePreviewSection('footer')
                  lockPreviewHighlight('footer')
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group border border-transparent ${(selectedSection === 'footer' || activePreviewSection === 'footer') ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Layout className="w-4 h-4 rotate-180" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Footer</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Social & Legal</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}

          {activeTab === "design" && (
            <div className="space-y-4">
              <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Visual Style
              </div>
              {/* Palette */}
              <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors border border-transparent">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Color Palette
                </label>
                <div className="relative" data-dropdown="color-palette">
                  <button
                    type="button"
                    ref={colorPaletteRef}
                    onClick={() => {
                      try {
                        colorPaletteRectRef.current = colorPaletteRef.current?.getBoundingClientRect() || null
                      } catch {
                        colorPaletteRectRef.current = null
                      }
                      setColorPaletteOpen((o) => !o)
                      setTypographyOpen(false)
                    }}
                    className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <span className="truncate">
                      {(globalConfig.colorTheme || "partner").replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      {(COLOR_THEME_SWATCHES[globalConfig.colorTheme || "partner"] || COLOR_THEME_SWATCHES.partner).map((hex, i) => (
                        <span
                          key={`${hex}-${i}`}
                          className="w-3.5 h-3.5 rounded-full border border-border/70"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </span>
                  </button>

                  {colorPaletteOpen && (
                    <div className="absolute z-[60] mt-2 w-full max-h-[320px] overflow-auto rounded-xl border border-border bg-background shadow-xl">
                      <div className="p-2 border-b border-border bg-muted/10">
                        <div className="relative">
                          <input
                            type="text"
                            value={colorPaletteQuery}
                            onChange={(e) => setColorPaletteQuery(e.target.value)}
                            placeholder="Search palettes (e.g. blue, gold, eco)â€¦"
                            className="w-full px-3 pr-8 py-2 bg-background border border-border/70 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/50"
                            autoFocus
                          />
                          {colorPaletteQuery && (
                            <button
                              type="button"
                              onClick={() => setColorPaletteQuery("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                              title="Clear"
                            >
                              <X className="w-3 h-3 text-muted-foreground" />
                            </button>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {[
                            { label: "Blue", q: "blue" },
                            { label: "Green", q: "green" },
                            { label: "Red", q: "red" },
                            { label: "Purple", q: "purple" },
                            { label: "Orange", q: "orange" },
                            { label: "Teal", q: "teal" },
                            { label: "Dark", q: "dark" },
                            { label: "Light", q: "light" },
                            { label: "Neutral", q: "neutral" },
                          ].map((chip) => {
                            const active = colorPaletteQuery.trim().toLowerCase() === chip.q
                            return (
                              <button
                                key={chip.q}
                                type="button"
                                onClick={() => setColorPaletteQuery(active ? "" : chip.q)}
                                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                                  active
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : "bg-background text-muted-foreground border-border/60 hover:border-primary/20 hover:text-foreground"
                                }`}
                              >
                                {chip.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {paletteEntries
                        .slice()
                        .sort((a, b) => {
                          const q = colorPaletteQuery.trim().toLowerCase()
                          const labelA = a.key
                          const labelB = b.key

                          if (!q) return labelA.localeCompare(labelB)

                          const aStarts = labelA.toLowerCase().startsWith(q)
                          const bStarts = labelB.toLowerCase().startsWith(q)
                          if (aStarts !== bStarts) return aStarts ? -1 : 1

                          const aMatch = a.tags.some((t) => t.includes(q)) || labelA.toLowerCase().includes(q)
                          const bMatch = b.tags.some((t) => t.includes(q)) || labelB.toLowerCase().includes(q)
                          if (aMatch !== bMatch) return aMatch ? -1 : 1

                          return labelA.localeCompare(labelB)
                        })
                        .map((p) => {
                        const c = p.key
                        const swatches = p.swatches
                        const selected = (globalConfig.colorTheme || "partner") === c
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setModified((m) => ({ ...m, colorTheme: c }))
                              autoSaveSection("colorTheme", c)
                              setColorPaletteOpen(false)
                              setColorPaletteQuery("")
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors ${selected ? "bg-primary/5" : ""}`}
                          >
                            <span className="truncate font-semibold">
                              {c.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                            <span className="flex items-center gap-1 shrink-0">
                              {swatches.map((hex, i) => (
                                <span
                                  key={`${c}-${hex}-${i}`}
                                  className={`w-4 h-4 rounded-full border ${selected ? "border-primary/40" : "border-border/70"}`}
                                  style={{ backgroundColor: hex }}
                                  title={hex}
                                />
                              ))}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {(COLOR_THEME_SWATCHES[globalConfig.colorTheme || "partner"] || COLOR_THEME_SWATCHES.partner).map((hex, i) => (
                    <div
                      key={`${hex}-${i}`}
                      className="w-7 h-7 rounded-full border border-border shadow-sm"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    Example
                  </span>
                </div>
              </div>

              {/* Typography */}
              <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors border border-transparent">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Typography
                </label>
                <div className="relative" data-dropdown="typography">
                  <button
                    type="button"
                    ref={typographyRef}
                    onClick={() => {
                      try {
                        typographyRectRef.current = typographyRef.current?.getBoundingClientRect() || null
                      } catch {
                        typographyRectRef.current = null
                      }
                      setTypographyOpen((o) => !o)
                      setColorPaletteOpen(false)
                    }}
                    className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors flex items-center justify-between gap-3"
                  >
                    {(() => {
                      const selected = TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))
                      const label = selected?.label || "Typography"
                      const fontFamily = selected?.fontFamily
                      return (
                        <>
                          <span className="truncate font-semibold">{label}</span>
                          <span
                            className="text-[10px] text-muted-foreground truncate max-w-[140px]"
                            style={fontFamily ? { fontFamily } : undefined}
                          >
                            Aa Bb Cc
                          </span>
                        </>
                      )
                    })()}
                  </button>

                  {typographyOpen && (
                    <div className="absolute z-[60] mt-2 w-full max-h-[320px] overflow-auto rounded-xl border border-border bg-background shadow-xl">
                      {TYPOGRAPHY_OPTIONS.map((opt) => {
                        const selected = (globalConfig.typographyStyle || "elegant") === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setModified((m) => ({ ...m, typographyStyle: opt.value }))
                              autoSaveSection("typographyStyle", opt.value)
                              setTypographyOpen(false)
                            }}
                            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors ${selected ? "bg-primary/5" : ""}`}
                          >
                            <span className="truncate font-semibold">{opt.label}</span>
                            <span
                              className={`text-[10px] truncate max-w-[220px] ${selected ? "text-foreground" : "text-muted-foreground"}`}
                              style={opt.fontFamily ? { fontFamily: opt.fontFamily } : undefined}
                            >
                              Aa 123 â€” Sphinx of black quartz
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {(() => {
                  const selected = TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))
                  const fontFamily = selected?.fontFamily
                  return (
                    <div className="mt-3 rounded-xl border border-border/70 bg-background/70 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1">Example</div>
                      <div style={fontFamily ? { fontFamily } : undefined}>
                        <div className="text-sm font-black text-foreground leading-tight">Sphinx of black quartz, judge my vow</div>
                        <div className="text-xs text-muted-foreground mt-1 italic">Aa 1234567890 â€” The quick brown fox jumps over the lazy dog.</div>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Mode */}
              <div className="px-4 py-3 rounded-xl hover:bg-muted/40 transition-colors border border-transparent">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                  Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModified((m) => ({ ...m, darkMode: false }))
                      autoSaveSection("darkMode", false)
                    }}
                    className={`py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      !globalConfig.darkMode
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModified((m) => ({ ...m, darkMode: true }))
                      autoSaveSection("darkMode", true)
                    }}
                    className={`py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      !!globalConfig.darkMode
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-4">
              <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Management
              </div>
              <button
                onClick={() => {
                  setHistoryOpen(true)
                  setVersionsLoading(true)
                  fetch(`/api/versions?projectId=${project.id}`)
                    .then((r) => r.json())
                    .then((data) => setVersions(data.versions ?? []))
                    .catch(() => toast.error('Failed to load history'))
                    .finally(() => setVersionsLoading(false))
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <History className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Version History</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Rollback changes</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setSelectedSection('subscription')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'subscription' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Subscription</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Plan & Billing</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setSelectedSection('legal')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'legal' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Legal Pages</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Privacy & Terms</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setSelectedSection('pages')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'pages' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Layout className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Site Pages</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Multi-page setup</p>
                </div>
                {!canUsePages && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Pro
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}

        </div>

      </aside>

      {/* Add Section Modal */}
      <AddSectionModal
        open={addSectionOpen}
        onOpenChange={setAddSectionOpen}
        activeSections={activeSections}
        addSection={addSection}
      />

      {/* Main Content (Stage) */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-background relative">
        <header className="fixed lg:absolute top-16 lg:top-0 left-0 lg:left-0 right-0 h-14 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-muted/20 backdrop-blur-md z-[46] gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors shrink-0"
            >
              <Layout className="w-5 h-5" />
            </button>
            <div className="hidden xs:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20 shrink-0">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground leading-none truncate">Preview Mode: Viewing unsaved changes</span>
              <span className="text-[10px] text-muted-foreground mt-0.5 truncate">Changes here are local to your browser until you click "Save Draft" in the dashboard.</span>
            </div>
            <div className="sm:hidden shrink-0">
               <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} />
            </div>
            <div className="hidden sm:block shrink-0">
               <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button onClick={refreshPreview} className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm active:scale-95 shrink-0">
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">{isSaving ? 'Savingâ€¦' : 'Refresh'}</span>
            </button>
            <button
              onClick={async () => {
                if (Object.keys(modified).length === 0) {
                  toast.info('No local changes to save')
                  return
                }
                setIsSubmitting(true)
                try {
                  const res = await fetch('/api/project-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, patch: modified })
                  })
                  const json = await res.json()
                  if (!res.ok) throw new Error(json.error || 'Failed to save draft')
                  toast.success('Draft saved')
                  if (json?.draft && typeof json.draft === 'object') {
                    setLocalDraftConfig(json.draft)
                  }
                  setModified({})
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem(LOCAL_KEY)
                  }
                  router.refresh()
                  setTimeout(() => refreshPreview(), 100)
                } catch (e: any) {
                  toast.error(e?.message || 'Failed to save draft')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              disabled={isSubmitting || Object.keys(modified).length === 0}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">{isSubmitting ? 'Savingâ€¦' : 'Save'}</span>
            </button>
            <button
              onClick={() => {
                discardInProgressRef.current = true
                console.log('[dashboard-preview] discard local changes', {
                  projectId: project.id,
                  modifiedKeys: Object.keys(modified || {}),
                  hasDraft,
                })
                setModified({})
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(LOCAL_KEY)
                }
                setSelectedSection(null)
                setActivePreviewSection(null)
                setSelectedPageIndex(0)
                setFormValues({})
                if (selectedSection) {
                  const sectionKey = sectionIdToKey(selectedSection)
                  const base = baseConfig[sectionKey] || {}
                  setFormValues(base as any)
                }
                // push the clean base config back into the preview
                lastPreviewPayloadRef.current = null
                console.log('[dashboard-preview] send preview after discard', {
                  projectId: project.id,
                  baseConfigKeys: Object.keys(baseConfig || {}),
                })
                sendFullPreview(baseConfig)
                router.refresh()
                toast.success('Local changes discarded')
                window.setTimeout(() => {
                  discardInProgressRef.current = false
                }, 0)
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="shrink-0">Discard</span>
            </button>
            {canPublish ? (
              <div className="flex flex-col items-end">
                <button
                  onClick={async () => {
                    if (!canPublishNow(project)) {
                      toast.error(`Publish limit reached (${publishStats.used}/${publishStats.limit} this period).`)
                      return
                    }
                    setIsPublishing(true)
                    try {
                      if (Object.keys(modified).length > 0) {
                        const saveRes = await fetch('/api/project-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ projectId: project.id, patch: modified })
                        })
                        const saveJson = await saveRes.json()
                        if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to save draft')
                        if (saveJson?.draft && typeof saveJson.draft === 'object') {
                          setLocalDraftConfig(saveJson.draft)
                        }
                        setModified({})
                        if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                        router.refresh()
                      }
                      const res = await fetch('/api/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ projectId: project.id })
                      })
                      const json = await res.json()
                      if (!res.ok) throw new Error(json.error || 'Failed to publish')
                      const remaining = (json as { remaining?: number; remainingToday?: number })?.remaining ?? publishStats.remaining - 1
                      const remainingToday = (json as { remainingToday?: number })?.remainingToday ?? publishStats.remainingToday - 1
                      toast.success(`Published! ${remaining} left this period, ${remainingToday} today.`)
                      setLocalDraftConfig(null)
                      router.refresh()
                      setTimeout(() => refreshPreview(), 100)
                    } catch (e: any) {
                      toast.error(e?.message || 'Failed to publish')
                    } finally {
                      setIsPublishing(false)
                    }
                  }}
                  disabled={isPublishing || !canPublishNow(project) || (!hasDraft && !hasLocalChanges)}
                  title={publishDisabledReason || undefined}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span className="shrink-0">{isPublishing ? 'Publishingâ€¦' : 'Publish'}</span>
                </button>
                {publishDisabledReason && (
                  <span className="mt-1 text-[10px] text-muted-foreground text-right max-w-[180px]">
                    {publishDisabledReason}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <button
                  onClick={async () => {
                    if (hasPendingRequest) {
                      toast.error('A change request is already pending. Please wait for it to be reviewed.')
                      return
                    }
                    setIsQueueing(true)
                    try {
                      if (Object.keys(modified).length > 0) {
                        const saveRes = await fetch('/api/project-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ projectId: project.id, patch: modified })
                        })
                        const saveJson = await saveRes.json()
                        if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to auto-save draft before submission')
                        setModified({})
                        if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                        router.refresh()
                      }
                      const res = await fetch('/api/change-requests', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ projectId: project.id })
                      })
                      const json = await res.json()
                      if (!res.ok) throw new Error(json.error || 'Failed to submit for approval')
                      toast.success('Draft saved and submitted for approval')
                      setHasPendingRequest(true)
                      router.refresh()
                      setTimeout(() => refreshPreview(), 100)
                    } catch (e: any) {
                      toast.error(e?.message || 'Failed to submit for approval')
                    } finally {
                      setIsQueueing(false)
                    }
                  }}
                  disabled={isQueueing || hasPendingRequest}
                  title={publishDisabledReason || undefined}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span className="shrink-0">{isQueueing ? 'Submittingâ€¦' : hasPendingRequest ? 'Pending Review' : 'Submit'}</span>
                </button>
                {publishDisabledReason && (
                  <span className="mt-1 text-[10px] text-muted-foreground text-right max-w-[180px]">
                    {publishDisabledReason}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        <PreviewFrame 
          previewPath={previewPath}
          iframeRef={iframeRef}
          className="pt-14 lg:pt-14"
        />
      </main>

      {/* Edit Panel - Simplified to avoid focus-scope loops */}
      {selectedSection && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedSection(null)}
        >
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div
            className="relative z-[210] p-0 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] min-h-0 border border-border bg-background shadow-2xl w-full sm:w-[95vw] sm:max-w-[840px] rounded-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setSelectedSection(null)}
              className="absolute right-4 top-4 z-20 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          {/* Polished header - shrink-0 keeps it always visible */}
          <div className="relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent" aria-hidden />
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden />
            <div className="relative p-4 sm:p-6 sm:pb-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {selectedSection === 'subscription' ? (
                    <CreditCard className="w-6 h-6 text-primary" />
                  ) : (
                    <Layout className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="capitalize flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight">
                    {selectedSection === 'subscription' ? (
                      <>Subscription & Plan</>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter">Editor</span>
                        <span>{selectedSection?.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                  </h2>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-none text-muted-foreground">
                    {selectedSection === 'subscription'
                      ? "View plan and auto-renewal."
                      : "Customize content and images."}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs removed: global_settings now integrated into sidebar reordering */}
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 sm:space-y-6"
            onScroll={() => { setColorPaletteOpen(false); setTypographyOpen(false) }}
          >
            {selectedSection === 'subscription' ? (
              <SubscriptionSettings project={project as any} />
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    {formatSectionLabel(selectedSection || "")} Settings
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setCollapsedGroups({})} 
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Expand All
                    </button>
                    <span className="text-muted-foreground opacity-30">|</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        const allKeys: Record<string, boolean> = {};
                        Object.entries(formValues).forEach(([key, value]) => {
                          if (typeof value === 'object' && value !== null) {
                            allKeys[`${selectedSection}-${key}`] = true;
                          }
                        });
                        setCollapsedGroups(allKeys);
                      }} 
                      className="text-[10px] font-bold text-primary hover:underline"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                {selectedSection === 'hero' && (
                  <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
                      <label className="text-xs font-bold uppercase tracking-widest text-primary">Layout Theme</label>
                      <p className="text-[10px] text-muted-foreground mt-1">This controls the hero layout style for your site.</p>
                    </div>
                    <div className="p-4">
                      <select
                        className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
                        value={globalConfig.theme || 'lawyer'}
                        onChange={(e) => {
                          const val = e.target.value
                          setModified((m) => ({ ...m, theme: val }))
                          autoSaveSection('theme', val)
                        }}
                      >
                        {['lawyer', 'startup', 'chiropractor', 'dentist', 'clinic', 'cleaning', 'pool', 'pest-control', 'real-estate-modern', 'before-after-split', 'industrial', 'clean-delivery', 'luxury-soft', 'academic-clean', 'hvac', 'hvac-blue', 'generic'].map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 1) Text, Boolean, and Nested Object fields - use grid for horizontal layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {Object.entries(formValues)
                    .filter(([key]) => {
                      if (selectedSection === 'hero') {
                        return !['trustbadges', 'trustsignals'].includes(key.toLowerCase());
                      }
                      return true;
                    })
                    .map(([key, value]) => {
                      const isPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(key.toLowerCase());
                      const isImage = !isPageLinkUrl && (key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('logo'));
                      const isDatetime = typeof value === 'string' && (key.toLowerCase().includes('countdown') || key.toLowerCase().includes('enddate'));
                      const isTextarea = !isDatetime && typeof value === 'string' && value.length > 80;
                      const isBoolean = typeof value === 'boolean';
                      const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

                      if (isObject) {
                        const isCollapsed = collapsedGroups[`${selectedSection}-${key}`]
                        return (
                          <div key={key} className="col-span-2 rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden transition-all duration-300">
                            <button 
                              type="button"
                              onClick={() => setCollapsedGroups(prev => ({ ...prev, [`${selectedSection}-${key}`]: !isCollapsed }))}
                              className="w-full px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between hover:bg-muted/20 transition-colors"
                            >
                              <label className="text-xs font-bold uppercase tracking-widest text-primary cursor-pointer">{fieldLabel(key)}</label>
                              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isCollapsed ? "" : "rotate-90"}`} />
                            </button>
                            <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 ${isCollapsed ? "hidden" : "animate-in fade-in slide-in-from-top-2 duration-300"}`}>
                              {Object.entries(value as object)
                                .sort(([ka], [kb]) => {
                                  // Images last
                                  const isImgA = ka.toLowerCase().includes('url') || ka.toLowerCase().includes('image');
                                  const isImgB = kb.toLowerCase().includes('url') || kb.toLowerCase().includes('image');
                                  if (isImgA && !isImgB) return 1;
                                  if (!isImgA && isImgB) return -1;
                                  return 0;
                                })
                                .map(([subKey, subVal]) => {
                                const isSubPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(subKey.toLowerCase());
                                const isSubImage = !isSubPageLinkUrl && (subKey.toLowerCase().includes('url') || subKey.toLowerCase().includes('image') || subKey.toLowerCase().includes('logo'));
                                const isSubTextarea = typeof subVal === 'string' && subVal.length > 80;
                                const isSubBoolean = typeof subVal === 'boolean';
                                return (
                                  <div key={subKey} className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase block">{fieldLabel(subKey)}</label>
                                    {isSubBoolean ? (
                                      <div className="flex flex-col gap-2 p-3 bg-muted/20 border border-border rounded-lg">
                                        <div className="flex gap-4">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`${key}-${subKey}`}
                                              checked={subVal === true}
                                              onChange={() => {
                                                const sectionKey = sectionIdToKey(selectedSection!)
                                                const nextObj = { ...(value as object), [subKey]: true }
                                                const nextForm = { ...formValues, [key]: nextObj }
                                                setFormValues(nextForm)
                                                setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                autoSaveSection(selectedSection!, nextForm)
                                              }}
                                              className="h-4 w-4 border-border text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-foreground">Yes</span>
                                          </label>
                                          <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                              type="radio"
                                              name={`${key}-${subKey}`}
                                              checked={subVal === false}
                                              onChange={() => {
                                                const sectionKey = sectionIdToKey(selectedSection!)
                                                const nextObj = { ...(value as object), [subKey]: false }
                                                const nextForm = { ...formValues, [key]: nextObj }
                                                setFormValues(nextForm)
                                                setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                                autoSaveSection(selectedSection!, nextForm)
                                              }}
                                              className="h-4 w-4 border-border text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-foreground">No</span>
                                          </label>
                                        </div>
                                      </div>
                                    ) : isSubImage ? (
                                      <ImageUpload
                                        value={subVal as string}
                                        onChange={(url) => {
                                          const sectionKey = sectionIdToKey(selectedSection!)
                                          const nextObj = { ...(value as object), [subKey]: url }
                                          const nextForm = { ...formValues, [key]: nextObj }
                                          setFormValues(nextForm)
                                          setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                          autoSaveSection(selectedSection!, nextForm)
                                        }}
                                      />
                                    ) : isSubTextarea ? (
                                      <textarea
                                        value={subVal as string}
                                        onChange={(e) => {
                                          const sectionKey = sectionIdToKey(selectedSection!)
                                          const nextObj = { ...(value as object), [subKey]: e.target.value }
                                          const nextForm = { ...formValues, [key]: nextObj }
                                          setFormValues(nextForm)
                                          setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                          autoSaveSection(selectedSection!, nextForm)
                                        }}
                                        className="w-full min-h-[100px] px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                      />
                                    ) : (
                                      <input
                                        value={subVal as string}
                                        onChange={(e) => {
                                          const sectionKey = sectionIdToKey(selectedSection!)
                                          const nextObj = { ...(value as object), [subKey]: e.target.value }
                                          const nextForm = { ...formValues, [key]: nextObj }
                                          setFormValues(nextForm)
                                          setModified(m => ({ ...m, [sectionKey]: nextForm }))
                                          autoSaveSection(selectedSection!, nextForm)
                                        }}
                                        className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                      />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }

                      if (Array.isArray(value)) return null; // Handled in step 2

                      return (
                        <div key={key} className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            {fieldLabel(key).toLowerCase()}
                            {isImage && <ImageIcon className="w-3 h-3 opacity-50" />}
                          </label>
                          
                          {isBoolean ? (
                            <div className="flex flex-col gap-2 p-3 bg-muted/20 border border-border rounded-lg">
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`section-${key}`}
                                    checked={(value as boolean) === true}
                                    onChange={() => {
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: true }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                    className="h-4 w-4 border-border text-primary focus:ring-primary"
                                  />
                                  <span className="text-sm font-medium text-foreground">Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`section-${key}`}
                                    checked={(value as boolean) === false}
                                    onChange={() => {
                                      const sectionKey = sectionIdToKey(selectedSection!)
                                      setFormValues(prev => {
                                        const next = { ...prev, [key]: false }
                                        setModified(m => ({ ...m, [sectionKey]: next }))
                                        autoSaveSection(selectedSection!, next)
                                        return next
                                      })
                                    }}
                                    className="h-4 w-4 border-border text-primary focus:ring-primary"
                                  />
                                  <span className="text-sm font-medium text-foreground">No</span>
                                </label>
                              </div>
                            </div>
                          ) : key === 'googleMapsEmbedUrl' ? (
                            <MapPinPicker
                              value={value as string}
                              onChange={(url) => {
                                const sectionKey = sectionIdToKey(selectedSection!)
                                setFormValues(prev => {
                                  const next = { ...prev, [key]: url }
                                  setModified(m => ({ ...m, [sectionKey]: next }))
                                  autoSaveSection(selectedSection!, next)
                                  return next
                                })
                              }}
                            />
                          ) : isImage ? (
                            <ImageUpload
                              value={value as string}
                              onChange={(url) => {
                                const sectionKey = sectionIdToKey(selectedSection!)
                                setFormValues(prev => {
                                  const next = { ...prev, [key]: url }
                                  setModified(m => ({ ...m, [sectionKey]: next }))
                                  autoSaveSection(selectedSection!, next)
                                  return next
                                })
                              }}
                            />
                          ) : isDatetime ? (
                            <input
                              type="datetime-local"
                              value={value ? (value as string).slice(0, 16) : ''}
                              onChange={(e) => {
                                const val = e.target.value ? new Date(e.target.value).toISOString() : ''
                                const sectionKey = sectionIdToKey(selectedSection!)
                                setFormValues(prev => {
                                  const next = { ...prev, [key]: val }
                                  setModified(m => ({ ...m, [sectionKey]: next }))
                                  autoSaveSection(selectedSection!, next)
                                  return next
                                })
                              }}
                              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          ) : isTextarea ? (
                            <textarea
                              value={value as string}
                              onChange={(e) => {
                                const val = e.target.value
                                const sectionKey = sectionIdToKey(selectedSection!)
                                setFormValues(prev => {
                                  const next = { ...prev, [key]: val }
                                  setModified(m => ({ ...m, [sectionKey]: next }))
                                  autoSaveSection(selectedSection!, next)
                                  return next
                                })
                              }}
                              className="w-full min-h-[100px] px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => {
                                const val = e.target.value
                                const sectionKey = sectionIdToKey(selectedSection!)
                                setFormValues(prev => {
                                  const next = { ...prev, [key]: val }
                                  setModified(m => ({ ...m, [sectionKey]: next }))
                                  autoSaveSection(selectedSection!, next)
                                  return next
                                })
                              }}
                              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          )}
                        </div>
                      )
                    })}
                </div>

                {/* 2) Array Items detection (the powerful part) */}
                {Object.entries(formValues)
                  .filter(([key, v]) => {
                    if (selectedSection === 'hero') {
                      return Array.isArray(v) && !['trustbadges', 'trustsignals'].includes(key.toLowerCase());
                    }
                    return Array.isArray(v);
                  })
                  .map(([key, items]) => {
                    const typedItems = items as any[]
                    const firstItem = typedItems[0]
                    
                    const updateItems = (nextItems: any[]) => {
                      const sectionKey = sectionIdToKey(selectedSection!)
                      setFormValues(prev => {
                        const next = { ...prev, [key]: nextItems }
                        setModified(m => ({ ...m, [sectionKey]: next }))
                        autoSaveSection(selectedSection!, next)
                        return next
                      })
                    }

                    if (selectedSection === 'pages' && key === 'pages') {
                      const updatePages = (nextItems: any[]) => {
                        setFormValues({ pages: nextItems })
                        setModified(m => ({ ...m, pages: nextItems }))
                        autoSaveSection('pages', nextItems)
                      }

                      return (
                        <div key={key} className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden pt-0 transition-all duration-300">
                          <div className="px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-primary">Pages</span>
                              <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                {typedItems.length} {typedItems.length === 1 ? 'page' : 'pages'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (!canUsePages) return
                                const next = [...typedItems, { slug: '', label: `Page ${typedItems.length + 1}`, activeSections: [], seo: { title: '', description: '', keywords: [] } }]
                                updatePages(next)
                              }}
                              disabled={!canUsePages}
                              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline disabled:text-muted-foreground disabled:cursor-not-allowed"
                            >
                              + Add Page
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            {!canUsePages && (
                              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[11px] text-amber-700 font-semibold">
                                Multi-page sites are available on paid plans. Upgrade to add more pages.
                              </div>
                            )}
                            {typedItems.map((page, idx) => {
                              const pageObj = (page || {}) as Record<string, any>
                              const keywords = Array.isArray(pageObj.seo?.keywords) ? pageObj.seo.keywords.join(', ') : ''
                              return (
                                <div key={idx} className="rounded-xl border border-border/80 bg-background/80 shadow-sm p-4 space-y-3 relative">
                                  <div className="absolute -top-2 -right-2 flex gap-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updatePages(next); } }} className="px-2 py-1 text-[9px] rounded bg-muted hover:bg-muted/70">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updatePages(next); } }} className="px-2 py-1 text-[9px] rounded bg-muted hover:bg-muted/70">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updatePages(next); }} className="px-2 py-1 text-[9px] rounded bg-red-500/10 text-red-600">Remove</button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Slug</label>
                                      <input
                                        value={pageObj.slug || ''}
                                        onChange={(e) => {
                                          const next = [...typedItems]
                                          next[idx] = { ...pageObj, slug: e.target.value }
                                          updatePages(next)
                                        }}
                                        placeholder="about"
                                        className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Label</label>
                                      <input
                                        value={pageObj.label || ''}
                                        onChange={(e) => {
                                          const nextLabel = e.target.value
                                          const currentLabel = pageObj.label || ''
                                          const currentSlug = pageObj.slug || ''
                                          const currentAutoSlug = slugify(currentLabel || `Page ${idx + 1}`)
                                          const shouldSyncSlug = !currentSlug || currentSlug === currentAutoSlug
                                          const next = [...typedItems]
                                          next[idx] = {
                                            ...pageObj,
                                            label: nextLabel,
                                            slug: shouldSyncSlug ? slugify(nextLabel) : currentSlug,
                                          }
                                          updatePages(next)
                                        }}
                                        placeholder="About"
                                        className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Sections (comma separated)</label>
                                    <input
                                      value={Array.isArray(pageObj.activeSections) ? pageObj.activeSections.join(', ') : ''}
                                      onChange={(e) => {
                                        const next = [...typedItems]
                                        next[idx] = { ...pageObj, activeSections: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }
                                        updatePages(next)
                                      }}
                                      placeholder="hero, features, contact"
                                      className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">SEO Title</label>
                                      <input
                                        value={pageObj.seo?.title || ''}
                                        onChange={(e) => {
                                          const next = [...typedItems]
                                          next[idx] = { ...pageObj, seo: { ...pageObj.seo, title: e.target.value } }
                                          updatePages(next)
                                        }}
                                        placeholder="Page title"
                                        className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">SEO Keywords</label>
                                      <input
                                        value={keywords}
                                        onChange={(e) => {
                                          const next = [...typedItems]
                                          const seo = { ...pageObj.seo, keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }
                                          next[idx] = { ...pageObj, seo }
                                          updatePages(next)
                                        }}
                                        placeholder="keyword1, keyword2"
                                        className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">SEO Description</label>
                                    <textarea
                                      value={pageObj.seo?.description || ''}
                                      onChange={(e) => {
                                        const next = [...typedItems]
                                        next[idx] = { ...pageObj, seo: { ...pageObj.seo, description: e.target.value } }
                                        updatePages(next)
                                      }}
                                      rows={2}
                                      placeholder="Short description for search results"
                                      className="w-full px-2 py-1 text-[11px] bg-background border border-border rounded"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={key} className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden pt-0 transition-all duration-300">
                        <button 
                          type="button"
                          onClick={() => setCollapsedGroups(prev => ({ ...prev, [`${selectedSection}-${key}`]: !collapsedGroups[`${selectedSection}-${key}`] }))}
                          className="w-full px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                              {key.replace(/([A-Z])/g, ' $1').trim()} 
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                              {typedItems.length} {typedItems.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${collapsedGroups[`${selectedSection}-${key}`] ? "" : "rotate-90"}`} />
                        </button>
                        <div className={`p-4 space-y-4 ${collapsedGroups[`${selectedSection}-${key}`] ? "hidden" : "animate-in fade-in slide-in-from-top-2 duration-300"}`}>
                        <div className={(() => {
                          const first = firstItem !== null && firstItem !== undefined && typeof firstItem === 'object' && !Array.isArray(firstItem) ? (firstItem as Record<string, unknown>) : null
                          const has = (o: Record<string, unknown> | null, p: string) => o !== null && p in o
                          if (key === 'steps' && first && (has(first, 'number') || has(first, 'title'))) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'items' && first && (has(first, 'beforeImage') || has(first, 'afterImage'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                          if (key === 'items' && first && (has(first, 'location') || has(first, 'price')) && (has(first, 'title') || has(first, 'imageUrl'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                          if (key === 'items' && first && has(first, 'name') && (has(first, 'logoUrl') || has(first, 'icon')) && !has(first, 'label') && !has(first, 'title')) return 'grid grid-cols-2 sm:grid-cols-3 gap-6'
                          if (key === 'items' && first && has(first, 'name') && has(first, 'description') && !has(first, 'title')) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'items' && first && Array.isArray(first.features) && has(first, 'title') && has(first, 'description')) return 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                          if (key === 'items' && first && has(first, 'title') && has(first, 'description') && !has(first, 'question') && !has(first, 'beforeImage')) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'items' && first && (has(first, 'icon') || has(first, 'label') || has(first, 'imageUrl') || has(first, 'name'))) return 'grid grid-cols-2 sm:grid-cols-4 gap-6'
                          if (key === 'items' && first && (has(first, 'service') || has(first, 'price'))) return 'grid grid-cols-1 sm:grid-cols-2 gap-6'
                          if (key === 'posts' && first && has(first, 'title') && has(first, 'excerpt')) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'members' && first && (has(first, 'name') || has(first, 'imageUrl'))) return 'grid grid-cols-2 sm:grid-cols-3 gap-6'
                          if (key === 'testimonials' && first && (has(first, 'quoteTitle') || has(first, 'body') || has(first, 'customerName'))) return 'grid grid-cols-1 md:grid-cols-2 gap-6'
                          if (key === 'reviews' && first && (has(first, 'author') || has(first, 'text'))) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'plans' && first && (has(first, 'name') || has(first, 'price'))) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                          if (key === 'trustSignals' && first && (has(first, 'label') || has(first, 'icon'))) return 'grid grid-cols-2 sm:grid-cols-4 gap-6'
                          if (key === 'cities' || key === 'areas') return 'space-y-2'
                          return 'space-y-4'
                        })()}>
                          {typedItems.map((item, idx) => {
                            const isObject = item !== null && typeof item === 'object' && !Array.isArray(item);
                            const itemObj: Record<string, unknown> = isObject ? (item as Record<string, unknown>) : {}
                            const hasProp = (o: unknown, p: string) => o !== null && typeof o === 'object' && p in (o as object)
                            const hasImageUrl = typeof itemObj.imageUrl === 'string' && (itemObj.imageUrl as string).length > 0
                            const iconName = (typeof itemObj.icon === 'string' ? (itemObj.icon as string) : null) || 'Award'
                            const hasAwardsStructure = (hasProp(itemObj, 'icon') || hasProp(itemObj, 'imageUrl')) && (hasProp(itemObj, 'label') || hasProp(itemObj, 'title') || hasProp(itemObj, 'name'))
                            const hasBlogStructure = key === 'posts' && isObject && (hasProp(itemObj, 'title') || hasProp(itemObj, 'excerpt'))
                            const hasFaqStructure = key === 'items' && isObject && (hasProp(itemObj, 'question') || hasProp(itemObj, 'answer'))
                            const hasTeamStructure = key === 'members' && isObject && (hasProp(itemObj, 'name') || hasProp(itemObj, 'specialty') || hasProp(itemObj, 'imageUrl'))
                            const hasBeforeAfterStructure = key === 'items' && isObject && (hasProp(itemObj, 'beforeImage') || hasProp(itemObj, 'afterImage'))
                            const hasStepsStructure = isObject && (key === 'steps' || hasProp(itemObj, 'number')) && (hasProp(itemObj, 'title') || hasProp(itemObj, 'number') || hasProp(itemObj, 'description'))
                            const hasFeaturedListingsStructure = key === 'items' && isObject && (hasProp(itemObj, 'location') || hasProp(itemObj, 'price')) && (hasProp(itemObj, 'title') || hasProp(itemObj, 'imageUrl'))
                            const hasDeveloperPartnersStructure = key === 'items' && isObject && hasProp(itemObj, 'name') && (hasProp(itemObj, 'logoUrl') || hasProp(itemObj, 'icon')) && !hasProp(itemObj, 'label') && !hasProp(itemObj, 'title') && !hasProp(itemObj, 'location')
                            const hasTestimonialsStructure = key === 'testimonials' && isObject && (hasProp(itemObj, 'quoteTitle') || hasProp(itemObj, 'body') || hasProp(itemObj, 'customerName'))
                            const hasFinancingStructure = key === 'items' && isObject && Array.isArray(itemObj.features) && hasProp(itemObj, 'title') && hasProp(itemObj, 'description')
                            const hasPricePreviewStructure = key === 'items' && isObject && (hasProp(itemObj, 'service') || hasProp(itemObj, 'price'))
                            const hasAcTypesStructure = key === 'items' && isObject && hasProp(itemObj, 'name') && hasProp(itemObj, 'description') && !hasProp(itemObj, 'title') && !hasProp(itemObj, 'question')
                            const hasPlanStructure = key === 'plans' && isObject && (hasProp(itemObj, 'name') || hasProp(itemObj, 'price'))
                            const hasFacebookReviewsStructure = key === 'reviews' && isObject && (hasProp(itemObj, 'author') || hasProp(itemObj, 'text') || hasProp(itemObj, 'rating'))
                            const hasTrustSignalsStructure = key === 'trustSignals' && isObject && (hasProp(itemObj, 'label') || hasProp(itemObj, 'icon'))
                            const hasPracticeAreasStructure = key === 'items' && isObject && !hasStepsStructure && !hasFinancingStructure && !hasAcTypesStructure && hasProp(itemObj, 'title') && hasProp(itemObj, 'description') && !hasProp(itemObj, 'question') && !hasProp(itemObj, 'beforeImage')
                            const hasSafetyStructure = key === 'items' && isObject && hasProp(itemObj, 'title') && hasProp(itemObj, 'description') && (hasProp(itemObj, 'icon') || hasProp(itemObj, 'imageUrl')) && selectedSection === 'safety-section'
                            const hasPageStyle = key === 'items' && isObject && hasAwardsStructure && !hasPracticeAreasStructure && !hasBeforeAfterStructure && !hasFeaturedListingsStructure && !hasDeveloperPartnersStructure && !hasAcTypesStructure && !hasPricePreviewStructure

                            if (hasSafetyStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                        {hasImageUrl ? (
                                          <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                          <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                      </div>
                                    </div>
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  </div>
                                </div>
                              )
                            }
                            if (hasBlogStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="rounded-t-xl">
                                    <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                  </div>
                                  <div className="p-4 flex flex-col gap-2 shrink-0">
                                    <input value={(itemObj.date as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, date: e.target.value }; updateItems(next) }} placeholder="Date" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                    <input value={(itemObj.category as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, category: e.target.value }; updateItems(next) }} placeholder="Category" className="w-full px-2 py-1 text-[10px] font-bold uppercase text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <textarea value={(itemObj.excerpt as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, excerpt: e.target.value }; updateItems(next) }} placeholder="Excerpt" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <input value={(itemObj.href as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, href: e.target.value }; updateItems(next) }} placeholder="Link URL" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  </div>
                                </div>
                              )
                            }
                            if (hasFaqStructure) {
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <input value={(itemObj.question as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, question: e.target.value }; updateItems(next) }} placeholder="Question" className="w-full px-3 py-2 text-xs font-medium bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <textarea value={(itemObj.answer as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, answer: e.target.value }; updateItems(next) }} placeholder="Answer" rows={2} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                </div>
                              )
                            }
                            if (hasTeamStructure) {
                              const memberImg = typeof itemObj.imageUrl === 'string' && (itemObj.imageUrl as string).length > 0
                              return (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="w-16 h-16 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center shrink-0">
                                    {memberImg ? <img src={itemObj.imageUrl as string} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted/30" />}
                                  </div>
                                  <div className="w-full">
                                    <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                  </div>
                                  <input value={(itemObj.name as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Name" className="w-full px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                  <input value={(itemObj.specialty as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, specialty: e.target.value }; updateItems(next) }} placeholder="Role / Specialty" className="w-full px-2 py-1.5 text-center text-[10px] text-muted-foreground bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                </div>
                              )
                            }
                            if (hasStepsStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 text-primary text-[10px] font-black">
                                        {((itemObj.number as string) || String(idx + 1).padStart(2, '0'))}
                                      </div>
                                      <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                        <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                      </div>
                                    </div>
                                    <input value={(itemObj.number as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, number: e.target.value }; updateItems(next) }} placeholder="Step # (e.g. 01)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  </div>
                                </div>
                              )
                            }
                            if (hasBeforeAfterStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Before</span>
                                        <ImageUpload value={(itemObj.beforeImage as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, beforeImage: url }; updateItems(next) }} />
                                      </div>
                                      <div>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">After</span>
                                        <ImageUpload value={(itemObj.afterImage as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, afterImage: url }; updateItems(next) }} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (hasPracticeAreasStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                        {hasImageUrl ? (
                                          <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                          <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                      </div>
                                    </div>
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <input value={(itemObj.href as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, href: e.target.value }; updateItems(next) }} placeholder="Link URL (optional)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  </div>
                                </div>
                              )
                            }
                            if (hasFeaturedListingsStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="relative aspect-[4/3] min-h-[120px] bg-muted/30 overflow-visible">
                                    <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                  </div>
                                  <div className="p-4 space-y-2">
                                    <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <input value={(itemObj.location as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, location: e.target.value }; updateItems(next) }} placeholder="Location" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <input value={(itemObj.price as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price" className="w-full px-2 py-1 text-[10px] font-medium text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <div className="flex gap-2 flex-wrap">
                                      <input type="number" value={Number(itemObj.beds) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, beds: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Beds" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                      <input type="number" value={Number(itemObj.baths) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, baths: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Baths" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                      <input type="number" value={Number(itemObj.sqm) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, sqm: parseInt(e.target.value) || 0 }; updateItems(next) }} placeholder="Sqm" className="w-14 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                      <input value={(itemObj.tag as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, tag: e.target.value }; updateItems(next) }} placeholder="Tag" className="flex-1 min-w-0 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (hasDeveloperPartnersStructure) {
                              const hasLogo = typeof itemObj.logoUrl === 'string' && (itemObj.logoUrl as string).length > 0
                              return (
                                <div key={idx} className="flex flex-col items-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="w-full aspect-[2/1] max-h-16 bg-muted/30 rounded-lg overflow-visible flex items-center justify-center mb-2 relative z-10">
                                    {hasLogo ? (
                                      <ImageUpload value={itemObj.logoUrl as string} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, logoUrl: url }; updateItems(next) }} />
                                    ) : (
                                      <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                    )}
                                  </div>
                                  <input value={(itemObj.name as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Partner name" className="w-full px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                </div>
                              )
                            }
                            if (hasTestimonialsStructure) {
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <input value={(itemObj.quoteTitle as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, quoteTitle: e.target.value }; updateItems(next) }} placeholder="Quote title" className="w-full px-3 py-2 text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <textarea value={(itemObj.body as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, body: e.target.value }; updateItems(next) }} placeholder="Testimonial body" rows={3} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <input value={(itemObj.customerName as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, customerName: e.target.value }; updateItems(next) }} placeholder="Customer name" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <label className="flex items-center gap-2 text-[10px]">
                                    <input type="checkbox" checked={(itemObj.verified as boolean) ?? false} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, verified: e.target.checked }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                    Verified
                                  </label>
                                </div>
                              )
                            }
                            if (hasFinancingStructure) {
                              const featuresArr = Array.isArray(itemObj.features) ? itemObj.features as string[] : []
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                        <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                      </div>
                                      <input value={(itemObj.title as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, title: e.target.value }; updateItems(next) }} placeholder="Title" className="flex-1 px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    </div>
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    <div>
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Features</span>
                                      {featuresArr.map((f, fi) => (
                                        <div key={fi} className="flex gap-2 mb-1">
                                          <input value={f} onChange={(e) => { const nextF = [...featuresArr]; nextF[fi] = e.target.value; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature" />
                                          <button type="button" onClick={() => { const nextF = featuresArr.filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      ))}
                                      <button type="button" onClick={() => { const nextF = [...featuresArr, '']; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="text-[10px] text-primary font-bold hover:underline">+ Add feature</button>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (hasPricePreviewStructure) {
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-2 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <input value={(itemObj.service as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, service: e.target.value }; updateItems(next) }} placeholder="Service" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                  <input value={(itemObj.price as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price" className="w-full px-2 py-1 text-[10px] font-medium text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <input value={(itemObj.note as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, note: e.target.value }; updateItems(next) }} placeholder="Note (optional)" className="w-full px-2 py-1 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                </div>
                              )
                            }
                            if (hasAcTypesStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                        <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                      </div>
                                      <input value={(itemObj.name as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Name" className="flex-1 px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    </div>
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  </div>
                                </div>
                              )
                            }
                            if (hasPlanStructure) {
                              const planFeatures = Array.isArray(itemObj.features) ? itemObj.features : []
                              const f0 = planFeatures[0]
                              const isPricingStyle = planFeatures.length > 0 && (hasProp(f0, 'text') || hasProp(f0, 'included'))
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 overflow-hidden shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <label className="flex items-center gap-2 text-[10px]">
                                      <input type="checkbox" checked={(itemObj.isPopular as boolean) ?? false} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, isPopular: e.target.checked }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                      Most Popular
                                    </label>
                                    <input value={(itemObj.name as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, name: e.target.value }; updateItems(next) }} placeholder="Plan name" className="w-full px-2 py-1.5 text-xs font-bold bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                    <div className="flex gap-2">
                                      <input value={(itemObj.price as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, price: e.target.value }; updateItems(next) }} placeholder="Price" className="flex-1 px-2 py-1.5 text-sm font-bold text-primary bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                      {hasProp(itemObj, 'period') && <input value={(itemObj.period as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, period: e.target.value }; updateItems(next) }} placeholder="/year" className="w-20 px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />}
                                    </div>
                                    <textarea value={(itemObj.description as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, description: e.target.value }; updateItems(next) }} placeholder="Description" rows={2} className="w-full px-2 py-1.5 text-[10px] text-muted-foreground bg-background border border-border rounded resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                    {hasProp(itemObj, 'buttonText') && <input value={(itemObj.buttonText as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, buttonText: e.target.value }; updateItems(next) }} placeholder="Button text" className="w-full px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />}
                                    <div>
                                      <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Features</span>
                                      {isPricingStyle ? (
                                        (planFeatures as { text?: string; included?: boolean }[]).map((f, fi) => (
                                          <div key={fi} className="flex gap-2 items-center mb-1">
                                            <input value={f.text || ''} onChange={(e) => { const nextF = [...(planFeatures as any[])]; nextF[fi] = { ...f, text: e.target.value }; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature" />
                                            <label className="flex items-center gap-1 shrink-0">
                                              <input type="checkbox" checked={f.included !== false} onChange={(e) => { const nextF = [...(planFeatures as any[])]; nextF[fi] = { ...f, included: e.target.checked }; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="h-3 w-3 rounded border-border text-primary" />
                                              <span className="text-[9px]">incl.</span>
                                            </label>
                                            <button type="button" onClick={() => { const nextF = (planFeatures as any[]).filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                        ))
                                      ) : (
                                        (planFeatures as string[]).map((f, fi) => (
                                          <div key={fi} className="flex gap-2 mb-1">
                                            <input value={f} onChange={(e) => { const nextF = [...(planFeatures as string[])]; nextF[fi] = e.target.value; const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="flex-1 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" placeholder="Feature" />
                                            <button type="button" onClick={() => { const nextF = (planFeatures as string[]).filter((_, i) => i !== fi); const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next) }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                        ))
                                      )}
                                      <button type="button" onClick={() => {
                                        const newF = isPricingStyle ? { text: '', included: true } : ''
                                        const nextF = [...(planFeatures as any[]), newF]
                                        const next = [...typedItems]; next[idx] = { ...item, features: nextF }; updateItems(next)
                                      }} className="text-[10px] text-primary font-bold hover:underline">+ Add feature</button>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            if (hasFacebookReviewsStructure) {
                              return (
                                <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <textarea value={(itemObj.text as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, text: e.target.value }; updateItems(next) }} placeholder="Review text" rows={3} className="w-full px-3 py-2 text-[10px] text-muted-foreground bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <input value={(itemObj.author as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, author: e.target.value }; updateItems(next) }} placeholder="Author name" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <input value={(itemObj.date as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, date: e.target.value }; updateItems(next) }} placeholder="Date (e.g. 2 weeks ago)" className="w-full px-3 py-2 text-[10px] bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50" />
                                  <input type="number" min={1} max={5} value={Number(itemObj.rating) || 5} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) }; updateItems(next) }} className="w-16 px-2 py-1 text-[10px] bg-background border border-border rounded outline-none focus:ring-1 focus:ring-primary/30" />
                                </div>
                              )
                            }
                            if (hasTrustSignalsStructure) {
                              return (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="w-12 h-12 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                    <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                  </div>
                                  <input value={(itemObj.label as string) || ''} onChange={(e) => { const next = [...typedItems]; next[idx] = { ...item, label: e.target.value }; updateItems(next) }} placeholder="Label" className="w-full min-h-[36px] px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60" />
                                </div>
                              )
                            }
                            if (hasPageStyle) {
                              return (
                                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-3 relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†‘</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">â†“</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                                  </div>
                                  <div className="w-12 h-12 rounded-full bg-background border border-border overflow-visible flex items-center justify-center shrink-0 text-primary relative z-10">
                                    {hasImageUrl ? (
                                      <img src={itemObj.imageUrl as string} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <AwardIconPicker value={iconName} onChange={(val) => { const next = [...typedItems]; next[idx] = { ...item, icon: val }; updateItems(next) }} compact />
                                    )}
                                  </div>
                                  <div className="w-full space-y-1">
                                    <ImageUpload value={(itemObj.imageUrl as string) || ''} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                    {hasImageUrl && (
                                      <button type="button" onClick={() => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: '' }; updateItems(next) }} className="text-[10px] text-primary hover:underline">Use icon instead</button>
                                    )}
                                  </div>
                                  <input
                                    value={(itemObj.label ?? itemObj.title ?? itemObj.name ?? '') as string}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      const next = [...typedItems]
                                      if (hasProp(itemObj, 'name')) next[idx] = { ...item, name: val }
                                      else if (hasProp(itemObj, 'label')) next[idx] = { ...item, label: val }
                                      else next[idx] = { ...item, title: val }
                                      updateItems(next)
                                    }}
                                    placeholder="Enter label..."
                                    className="w-full min-h-[36px] px-2 py-1.5 text-center text-xs font-bold bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60"
                                  />
                                  <input
                                    value={(itemObj.sublabel ?? itemObj.description ?? '') as string}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      const next = [...typedItems]
                                      next[idx] = hasProp(itemObj, 'description') ? { ...item, description: val } : { ...item, sublabel: val }
                                      updateItems(next)
                                    }}
                                    placeholder="Enter sublabel..."
                                    className="w-full min-h-[36px] px-2 py-1.5 text-center text-[10px] text-muted-foreground bg-background border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                                  />
                                </div>
                              )
                            }

                            return (
                              <div key={idx} className="p-4 rounded-xl bg-background/80 border border-border/80 shadow-sm space-y-4 relative group hover:border-primary/15 transition-colors">
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Item #{idx + 1}</span>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Up</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Down</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {isObject ? (
                                    Object.entries(item).map(([iKey, iVal]) => {
                                      const isIArray = Array.isArray(iVal);
                                      const isBioOrProfileLink = iKey.toLowerCase() === 'biourl';
                                      const isIImage = !isBioOrProfileLink && (iKey.toLowerCase().includes('url') || iKey.toLowerCase().includes('image') || iKey.toLowerCase().includes('logo') || iKey.toLowerCase().includes('before') || iKey.toLowerCase().includes('after'));
                                      const isIIcon = iKey.toLowerCase().includes('icon');
                                      const isITextarea = typeof iVal === 'string' && iVal.length > 50;
                                      const fieldLabelStr = fieldLabel(iKey);

                                      const spanClass = (isIArray || isIImage || isITextarea) ? "col-span-2 sm:col-span-3" : ""
                                      return (
                                        <div key={iKey} className={`space-y-1.5 ${spanClass}`}>
                                          <label className="text-[10px] font-bold text-muted-foreground/70 uppercase">{fieldLabelStr}</label>
                                          
                                          {isIArray ? (
                                            <div className="space-y-3">
                                              {(iVal as any[]).map((subVal, subIdx) => {
                                                const isSubObject = typeof subVal === 'object' && subVal !== null;
                                                return (
                                                  <div key={subIdx} className="flex flex-col gap-2 p-2 bg-background border border-border rounded-lg">
                                                    <div className="flex gap-2">
                                                      <input
                                                        className="flex-1 px-3 py-1.5 bg-muted/20 border border-border rounded text-xs outline-none"
                                                        value={isSubObject ? (subVal as any).text || '' : subVal as string}
                                                        onChange={(e) => {
                                                          const nextSub = [...(iVal as any[])]
                                                          if (isSubObject) {
                                                            nextSub[subIdx] = { ...subVal, text: e.target.value }
                                                          } else {
                                                            nextSub[subIdx] = e.target.value
                                                          }
                                                          const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                        }}
                                                      />
                                                      <button type="button" onClick={() => {
                                                        const nextSub = (iVal as any[]).filter((_, i) => i !== subIdx)
                                                        const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                      }} className="p-1 text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                    </div>
                                                    {isSubObject && (
                                                      <label className="flex items-center gap-2 px-1">
                                                        <input 
                                                          type="checkbox" 
                                                          checked={(subVal as any).included !== false} 
                                                          onChange={(e) => {
                                                            const nextSub = [...(iVal as any[])]
                                                            nextSub[subIdx] = { ...subVal, included: e.target.checked }
                                                            const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                                          }}
                                                          className="h-3 w-3 rounded border-border text-primary"
                                                        />
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Included in plan</span>
                                                      </label>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                              <button type="button" onClick={() => {
                                                const firstSub = (iVal as any[])[0]
                                                const newSub = typeof firstSub === 'object' ? { text: '', included: true } : ''
                                                const nextSub = [...(iVal as any[]), newSub]
                                                const nextItems = [...typedItems]; nextItems[idx] = { ...item, [iKey]: nextSub }; updateItems(nextItems)
                                              }} className="text-[10px] text-primary font-bold hover:underline transition-all">+ Add Item to {iKey}</button>
                                            </div>
                                          ) : isIImage ? (
                                            <ImageUpload
                                              value={iVal as string}
                                              onChange={(url) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: url }; updateItems(next)
                                              }}
                                            />
                                          ) : isIIcon ? (
                                            <AwardIconPicker
                                              value={iVal as string || 'Award'}
                                              onChange={(val) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: val }; updateItems(next)
                                              }}
                                            />
                                          ) : isITextarea ? (
                                            <textarea
                                              className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30 min-h-[60px] placeholder:text-muted-foreground/50"
                                              value={iVal as string}
                                              onChange={(e) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                              }}
                                              placeholder={`Enter ${fieldLabelStr.toLowerCase()}...`}
                                            />
                                          ) : (
                                            <input
                                              className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                                              value={iVal as string}
                                              onChange={(e) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                              }}
                                              placeholder={`Enter ${fieldLabelStr.toLowerCase()}...`}
                                            />
                                          )}
                                        </div>
                                      )
                                    })
                                  ) : (
                                    <div className="space-y-1.5">
                                      <input
                                        className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                        value={item as string}
                                        onChange={(e) => {
                                          const next = [...typedItems]; next[idx] = e.target.value; updateItems(next)
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            let newItem: any;
                            if (firstItem !== null && typeof firstItem === 'object' && !Array.isArray(firstItem)) {
                              newItem = { ...firstItem };
                              Object.keys(newItem).forEach(k => {
                                if (typeof newItem[k] === 'string') newItem[k] = '';
                                if (typeof newItem[k] === 'number') newItem[k] = 0;
                                if (Array.isArray(newItem[k])) newItem[k] = [];
                                if (typeof newItem[k] === 'boolean') newItem[k] = true;
                              });
                            } else {
                              newItem = typeof firstItem === 'string' ? '' : {};
                            }
                            updateItems([...typedItems, newItem]);
                          }}
                          className="w-full py-3.5 border-2 border-dashed border-border/80 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add New Item
                        </button>
                        </div>
                      </div>
                    )
                  })}
              </form>
            )}
          </div>

          {/* Polished footer - shrink-0 keeps it always visible */}
          <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 bg-muted/20 border-t border-border/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                {isSaving ? 'Syncingâ€¦' : 'Saved'}
              </span>
            </div>
            <button
              onClick={() => setSelectedSection(null)}
              className="shrink-0 px-5 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
          </div>
        </div>,
        document.body
      )}

      {/* Version History / Rollback Modal */}
      <VersionHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        versions={versions}
        versionsLoading={versionsLoading}
        rollbackLoading={rollbackLoading}
        onRestore={async (version) => {
          setRollbackLoading(version)
          try {
            const res = await fetch('/api/rollback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: project.id, version }),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Rollback failed')
            toast.success(`Restored to version ${version}`)
            setHistoryOpen(false)
            router.refresh()
            setTimeout(() => refreshPreview(), 100)
          } catch (e: any) {
            toast.error(e?.message || 'Rollback failed')
          } finally {
            setRollbackLoading(null)
          }
        }}
      />
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Â© 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
