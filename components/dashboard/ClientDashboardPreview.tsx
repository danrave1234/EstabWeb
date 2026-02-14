"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, FileText, Settings, Eye, Layout, Send, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/shared/ImageUpload"
import DynamicIcon from "@/components/shared/DynamicIcon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import MainHeader from "@/components/shared/MainHeader"
import { GENRE_LABELS } from "@/config/presets"

// Light-mode primary/accent/background for color palette swatches (from globals.css)
const COLOR_THEME_SWATCHES: Record<string, [string, string, string]> = {
  partner: ["#1a2b3c", "#c5a059", "#f8f9fa"],
  justice: ["#2d3436", "#d63031", "#ffffff"],
  modern: ["#000000", "#636e72", "#f1f2f6"],
  "frost-fire": ["#0984e3", "#e17055", "#ffffff"],
  reliable: ["#2d3436", "#fdcb6e", "#fafafa"],
  "eco-clean": ["#00b894", "#00cec9", "#f9fff9"],
  surgeon: ["#0984e3", "#74b9ff", "#ffffff"],
  wellness: ["#6c5ce7", "#a29bfe", "#fdfbff"],
  holistic: ["#218c74", "#f7f1e3", "#fefcf8"],
  "clinical-gold": ["#b8892a", "#eab308", "#ffffff"],
  "red-crimson": ["#d63031", "#2d3436", "#ffffff"],
  "cyan-ocean": ["#00a8ff", "#0097e6", "#ffffff"],
  "orange-amber": ["#f39c12", "#e67e22", "#ffffff"],
  "dark-pink-white": ["#1a0a12", "#e91e63", "#ffffff"],
  "blue-mint": ["#0d9488", "#5eead4", "#f0fdfa"],
  "red-black": ["#b91c1c", "#1f2937", "#ffffff"],
  "dark-green-ivory-yellow": ["#166534", "#facc15", "#f7fee7"],
  "bright-green-hot-pink": ["#22c55e", "#ec4899", "#f0fdf4"],
  "dark-grey-yellowgreen": ["#374151", "#84cc16", "#f9fafb"],
  "blue-shades-white": ["#1e40af", "#3b82f6", "#eff6ff"],
  "white-lime": ["#65a30d", "#84cc16", "#f7fee7"],
  "beige-dark-grey": ["#44403c", "#d6d3d1", "#fafaf9"],
  "pastel-purple-neutral": ["#7c3aed", "#c4b5fd", "#faf5ff"],
  "navy-electric-blue": ["#1e3a5f", "#3b82f6", "#eff6ff"],
  "navy-electric": ["#1e3a5f", "#3b82f6", "#eff6ff"],
  "gradient-white-dark-blue": ["#1e40af", "#60a5fa", "#f0f9ff"],
  "white-blue-grey": ["#1e40af", "#64748b", "#f8fafc"],
  "bright-red-white": ["#dc2626", "#1f2937", "#ffffff"],
  "classic-blue-turquoise-gold": ["#0e7490", "#c5a059", "#ecfeff"],
  "dark-royal-blue-gold": ["#1e3a8a", "#f0c674", "#eff6ff"],
  "white-purple": ["#6d28d9", "#a78bfa", "#faf5ff"],
  "blue-shades-white-red-violet": ["#1e40af", "#7c3aed", "#eff6ff"],
  "light-reddish-orange": ["#ea580c", "#c2410c", "#fff7ed"],
  "white-purple-orange": ["#7c3aed", "#f97316", "#faf5ff"],
  "deep-purple-orange-red-pink": ["#6d28d9", "#f43f5e", "#1e1b4b"],
  "brown-beige": ["#78350f", "#d6d3d1", "#fef3c7"],
  "dark-green-ivory": ["#14532d", "#f0fdf4", "#ecfccb"],
  "fiesta-red-yellow": ["#dc2626", "#eab308", "#fef2f2"],
  "barangay-blue": ["#1e40af", "#22c55e", "#eff6ff"],
  "tropical-teal": ["#0f766e", "#2dd4bf", "#f0fdfa"],
  "luxury-black-gold": ["#0a0a0a", "#d4af37", "#fafaf9"],
  "facebook-blue": ["#1877f2", "#42b72a", "#ffffff"],
  nebula: ["#6c5ce7", "#00cec9", "#0f172a"],
  flow: ["#4834d4", "#eb4d4b", "#ffffff"],
  mono: ["#000000", "#636e72", "#f1f2f6"],
}

// Typography options with CSS font variables for preview (matches globals.css data-typography)
const TYPOGRAPHY_OPTIONS: { value: string; label: string; fontFamily: string }[] = [
  { value: "elegant", label: "Elegant", fontFamily: "var(--font-source-sans-3), var(--font-playfair-display), Georgia, serif" },
  { value: "modern", label: "Modern", fontFamily: "var(--font-plus-jakarta-sans), system-ui, sans-serif" },
  { value: "bold", label: "Bold", fontFamily: "var(--font-space-grotesk), var(--font-instrument-serif), Georgia, serif" },
  { value: "technical", label: "Technical", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" },
  { value: "clinical", label: "Clinical", fontFamily: "var(--font-geist-sans), var(--font-source-serif-4), Georgia, serif" },
  { value: "playful", label: "Playful", fontFamily: "var(--font-nunito), system-ui, sans-serif" },
  { value: "traditional", label: "Traditional", fontFamily: "var(--font-source-sans-3), var(--font-libre-baskerville), Georgia, serif" },
]

const AWARD_ICON_NAMES = ['Award', 'ShieldCheck', 'Star', 'Users', 'Shield', 'Gavel', 'Scale', 'Briefcase', 'Home', 'Zap', 'Clock', 'Calendar', 'ClipboardCheck', 'Phone', 'MapPin', 'Mail', 'Check', 'Heart', 'Smile', 'ThumbsUp', 'Bug', 'Search', 'RotateCw', 'Leaf', 'Lock', 'Dog', 'Hammer', 'BookOpen', 'PenTool', 'GraduationCap', 'Trophy', 'Snowflake', 'Layout', 'Grid', 'Wind', 'Building', 'Wallet'].sort()

const DEFAULT_FOOTER = {
  tagline: "Expert advice and reliable service for modern businesses. Customize your footer and social links here.",
  formHeading: "Stay connected",
  formSubmitText: "Submit",
  formThankYouText: "Thank you!",
  social: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    showSocial: true,
    showContact: true,
    facebookEnabled: true,
    twitterEnabled: true,
    linkedinEnabled: true,
    instagramEnabled: true,
  },
  privacyUrl: "/privacy",
  termsUrl: "/terms",
  cookieUrl: "/cookies",
}

const DEFAULT_NAVIGATION: { name: string; href: string }[] = [
  { name: "Services", href: "#services" },
  { name: "About Us", href: "#about" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "/contact" },
]

const DEFAULT_EMERGENCY_CTA = {
  title: "Emergency Service?",
  subtitle: "We're ready to assist you. Fast response guaranteed.",
  buttonText: "Call Now",
  phone: "",
  imageUrl: "",
  icon: "Phone",
}

const DEFAULT_FAQ_ACCORDION = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our services.",
  items: [
    { question: "How do I get started?", answer: "Simply click the contact button and fill out the form." },
    { question: "What are your operating hours?", answer: "We are open Monday to Friday, 9am to 6pm." },
    { question: "Do you offer emergency services?", answer: "Yes, we have a 24/7 emergency response team available." },
  ],
}

const DEFAULT_BEFORE_AFTER_GALLERY = {
  title: "Before & After",
  subtitle: "See the transformation. Customize titles and images below.",
  beforeLabel: "Before",
  afterLabel: "After",
  items: [
    { title: "Example 1", description: "Add a short description.", beforeImage: "", afterImage: "" },
    { title: "Example 2", description: "Add a short description.", beforeImage: "", afterImage: "" },
  ],
}

const DEFAULT_LEGAL = {
  privacypolicy: {
    title: "Privacy Policy",
    content: "Our commitment to protecting your data and privacy.\n\nWe respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information when you use our website or services.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  termsofservice: {
    title: "Terms of Service",
    content: "Please read these terms carefully before using our service.\n\nBy accessing or using our service, you agree to be bound by these terms. If you do not agree, please do not use our service.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  cookiepolicy: {
    title: "Cookie Policy",
    content: "This policy explains how we use cookies and similar technologies.\n\nWe use cookies to improve your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.",
    lastUpdated: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
}

// User-friendly labels for form fields (avoid showing "URL" for image fields)
const FIELD_LABELS: Record<string, string> = {
  imageUrl: "Image",
  logoUrl: "Logo",
  backgroundImage: "Background image",
  beforeImage: "Before image",
  afterImage: "After image",
  avatar: "Photo",
  headshotUrl: "Photo",
  bioUrl: "Profile link",
  privacyUrl: "Privacy page link",
  termsUrl: "Terms page link",
  cookieUrl: "Cookie page link",
}

function fieldLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^\s+/, "")
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[]
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, string>
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => obj[k])
      .filter((v): v is string => typeof v === "string")
  }
  return []
}

function navigationToArray(nav: unknown): { name: string; href: string }[] {
  if (Array.isArray(nav) && nav.length > 0) return nav as { name: string; href: string }[]
  if (nav && typeof nav === 'object' && !Array.isArray(nav)) {
    const obj = nav as Record<string, { name?: string; href?: string }>
    return Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => ({ name: obj[k]?.name ?? '', href: obj[k]?.href ?? '#' }))
      .filter((item) => item.name || item.href)
  }
  return DEFAULT_NAVIGATION
}

function AwardIconPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])
  const displayName = value || "Award"
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 flex items-center gap-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center shrink-0 text-primary">
          <DynamicIcon name={displayName} className="w-4 h-4" />
        </div>
        <span className="flex-1 truncate">{displayName}</span>
        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 left-0 right-0 max-h-56 overflow-y-auto bg-background border border-border rounded-lg shadow-lg p-2 grid grid-cols-4 sm:grid-cols-5 gap-1">
          {AWARD_ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange(name); setOpen(false) }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-medium transition-colors hover:bg-muted/50 ${value === name ? "bg-primary/10 border-primary text-primary" : "border-transparent"}`}
              title={name}
            >
              <div className="w-8 h-8 rounded-full bg-muted/30 border border-border flex items-center justify-center text-primary">
                <DynamicIcon name={name} className="w-4 h-4" />
              </div>
              <span className="truncate w-full text-center">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function deepMerge(target: any, source: any) {
  const result = { ...target }
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

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
  const [formValues, setFormValues] = React.useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isQueueing, setIsQueueing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [modified, setModified] = React.useState<Record<string, any>>({})
  const [hasPendingRequest, setHasPendingRequest] = React.useState(false)
  const [colorPaletteOpen, setColorPaletteOpen] = React.useState(false)
  const [typographyOpen, setTypographyOpen] = React.useState(false)
  const [dragSectionIndex, setDragSectionIndex] = React.useState<number | null>(null)
  const [dropSectionIndex, setDropSectionIndex] = React.useState<number | null>(null)
  const colorPaletteRef = React.useRef<HTMLDivElement>(null)
  const typographyRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(e.target as Node)) setColorPaletteOpen(false)
      if (typographyRef.current && !typographyRef.current.contains(e.target as Node)) setTypographyOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const supabase = createClient()

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
  }, [project.id, supabase])

  const sendToIframe = React.useCallback((message: any) => {
    try {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage(message, '*')
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setModified(parsed)
        }
      }
    } catch {}
  }, [LOCAL_KEY])

  const hasDraft = project.draft_config && Object.keys(project.draft_config).length > 0
  const baseConfig = hasDraft ? project.draft_config : (project.current_config || {})
  const globalConfig = deepMerge(baseConfig, modified)
  const activeSections = ensureStringArray(globalConfig.activeSections)
  // Use the project's subdomain for preview; always include projectId so the page can fetch by ID when subdomain/custom domain isn't set.
  const basePath = project?.subdomain ? `/${project.subdomain}` : '/preview'
  const previewPath = `${basePath}?preview=true&projectId=${project.id}`

  // When the iframe indicates it's ready, send a full snapshot: baseConfig overlaid with local (unsaved) edits
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as any)?.type === 'LIVE_PREVIEW_READY') {
        const full = deepMerge(baseConfig, modified)
        if (full.navigation !== undefined) full.navigation = navigationToArray(full.navigation)
        if (full.activeSections !== undefined) full.activeSections = ensureStringArray(full.activeSections)
        sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: full })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [baseConfig, modified, sendToIframe])

  const sectionIdToKey = React.useCallback((id: string) => {
    const map: Record<string, string> = {
      brand: 'brand',
      hero: 'hero',
      'hero-emergency': 'heroEmergency',
      'practice-areas': 'practiceAreas',
      'attorney-profile': 'attorneyProfile',
      'free-consultation': 'freeConsultation',
      'how-it-works': 'howItWorks',
      'review-trust-bar': 'reviewTrustBar',
      'feature-highlight': 'featureHighlight',
      'team-carousel': 'teamCarousel',
      'team-grid': 'teamCarousel',
      'patient-faq': 'patientFaq',
      'faq-two-column': 'patientFaq',
      'reviews-grid': 'reviewTrustBar',
      'pricing': 'pricingTable',
      'packages-pricing': 'pricingTable',
      'awards': 'awardsStrip',
      'certifications': 'awardsStrip',
      'contact-split': 'contact',
      'contact-minimal': 'contact',
      'contact-visual': 'contact',
      'contact-with-map': 'contact',
      'contact-columns': 'contact',
      'common-pests': 'commonPests',
      'treatment-process': 'treatmentProcess',
      'safety-section': 'safety',
      'warranty-block': 'warranty',
      'ac-types-grid': 'acTypes',
      'price-preview-strip': 'pricePreview',
      'emergency-cta-strip': 'emergencyCTA',
      'maintenance-plans': 'maintenancePlans',
      'before-after-gallery-grid': 'beforeAfterGallery',
      'before-after-gallery': 'beforeAfterGallery',
      'promo-cta-section': 'promoCTA',
      'messenger-sticky-cta': 'messengerStickyCTA',
      'service-area-map': 'serviceAreaMap',
      'before-after-slider': 'beforeAfterSlider',
      'promo-banner-strip': 'promoBannerStrip',
      'payment-options-strip': 'paymentOptionsStrip',
      'facebook-review-embed': 'facebookReviewEmbed',
      'coverage-radius-block': 'coverageRadiusBlock',
      'stats-section': 'statsSection',
      'faq-accordion': 'faqAccordion',
      'logo-cloud': 'logoCloud',
      'trust-badges-grid': 'trustBadgesGrid',
      'featured-properties-grid': 'featuredListings',
      'financing-section': 'financing',
      'developer-partners': 'developerPartners',
      'why-choose-me': 'whyChooseMe',
      'features': 'features',
      'features-modern': 'features',
      'services-grid': 'features',
      'project-gallery': 'features',
      'programs-grid': 'features',
      'faculty-grid': 'features',
      'delivery-coverage': 'deliveryCoverage',
      'booking-cta': 'bookingCTA',
      'footer': 'footer',
      'contact': 'contact',
      'navigation': 'navigation',
      'legal': 'legal'
    };
    return map[id] || id;
  }, [])

  const refreshPreview = React.useCallback(() => {
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = src
    }
  }, [])

  const autoSaveSection = React.useCallback((sectionId: string, values: any) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setIsSaving(true)
    
    const key = sectionIdToKey(sectionId)
    
    // Update local state and localStorage
    setModified((prev) => {
      const next = { ...prev, [key]: values }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      }
      return next
    })

    // Small delay to show saving state
    saveTimer.current = setTimeout(() => setIsSaving(false), 300)
  }, [sectionIdToKey, LOCAL_KEY])

  // Efficiently sync changes to the iframe with a short debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(modified).length === 0) return
      const full = deepMerge(baseConfig, modified)
      if (full.navigation !== undefined) full.navigation = navigationToArray(full.navigation)
      if (full.activeSections !== undefined) full.activeSections = ensureStringArray(full.activeSections)
      sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: full })
    }, 150) // 150ms debounce is fast enough to feel instant but slow enough to batch keystrokes

    return () => clearTimeout(timer)
  }, [modified, baseConfig, sendToIframe])

  // Load full section object for the selected section (including arrays like items/steps)
  React.useEffect(() => {
    if (selectedSection) {
      if (selectedSection === 'global_settings') {
        setFormValues({}) // Not used for global
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
        setFormValues(merged)
      } else if (sectionKey === 'navigation') {
        const nav = navigationToArray(base)
        setFormValues(nav as unknown as Record<string, any>)
      } else if (sectionKey === 'legal') {
        const baseLegal = (base || {}) as Record<string, { title?: string; content?: string; lastUpdated?: string }>
        const merged = {
          privacypolicy: { ...DEFAULT_LEGAL.privacypolicy, ...(baseLegal.privacypolicy ?? {}) },
          termsofservice: { ...DEFAULT_LEGAL.termsofservice, ...(baseLegal.termsofservice ?? {}) },
          cookiepolicy: { ...DEFAULT_LEGAL.cookiepolicy, ...(baseLegal.cookiepolicy ?? {}) },
        }
        setFormValues(merged)
      } else if (sectionKey === 'emergencyCTA') {
        const merged = { ...DEFAULT_EMERGENCY_CTA, ...(base as Record<string, any>) }
        setFormValues(merged)
      } else if (sectionKey === 'faqAccordion') {
        const baseFaq = (base || {}) as Record<string, any>
        let items = baseFaq.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_FAQ_ACCORDION.items
        const merged = {
          ...DEFAULT_FAQ_ACCORDION,
          ...baseFaq,
          items,
        }
        setFormValues(merged)
      } else if (sectionKey === 'beforeAfterGallery') {
        const baseGal = (base || {}) as Record<string, any>
        let items = baseGal.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_BEFORE_AFTER_GALLERY.items
        const merged = {
          ...DEFAULT_BEFORE_AFTER_GALLERY,
          ...baseGal,
          items,
        }
        setFormValues(merged)
      } else {
        setFormValues(base as Record<string, any>)
      }
    }
  }, [selectedSection, baseConfig, modified, sectionIdToKey])

  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <MainHeader initialUser={user} variant="client" />

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2 group"
          >
            <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Websites
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Site Editor
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Preview and request changes
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Configuration
            </div>
            <button
              onClick={() => setSelectedSection('global_settings')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Theme & Sections</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('brand')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Brand & Identity</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('navigation')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Navigation Menu</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('legal')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Legal Pages (Privacy/Terms)</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('hero')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Hero Section</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('footer')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Footer & Socials</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Sections
            </div>
            {activeSections.length > 0 ? (
              activeSections
                .filter((s: string) => s !== 'hero')
                .map((section: string) => {
                // If it's team-grid, we show it but use team-carousel logic for now if needed
                // actually we just show the name from activeSections
                return (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
                  >
                    <span className="capitalize">{section.replace(/-/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground italic">No sections defined</p>
            )}
          </div>

        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (Stage) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Preview
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground leading-none">Preview Mode: Viewing unsaved changes</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Changes here are local to your browser until you click "Save Draft" in the dashboard.</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refreshPreview} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm active:scale-95">
              <Eye className="w-3.5 h-3.5" />
              {isSaving ? 'Saving…' : 'Refresh Preview'}
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
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={() => {
                setModified({})
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(LOCAL_KEY)
                }
                if (selectedSection) {
                  const sectionKey = sectionIdToKey(selectedSection)
                  const base = baseConfig[sectionKey] || {}
                  setFormValues(base as any)
                }
                // push the clean base config back into the preview
                sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: baseConfig })
                toast.success('Local changes discarded')
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm"
            >
              Discard Local
            </button>
            <button
              onClick={async () => {
                if (hasPendingRequest) {
                  toast.error('A change request is already pending. Please wait for it to be reviewed.')
                  return
                }
                
                setIsQueueing(true)
                try {
                  // If there are local changes, save them first
                  if (Object.keys(modified).length > 0) {
                    const saveRes = await fetch('/api/project-config', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ projectId: project.id, patch: modified })
                    })
                    const saveJson = await saveRes.json()
                    if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to auto-save draft before submission')
                    
                    // Clear local changes after successful auto-save
                    setModified({})
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem(LOCAL_KEY)
                    }
                    router.refresh()
                  }

                  // Now submit the change request (which snapshots the draft from DB)
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
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isQueueing ? 'Submitting…' : hasPendingRequest ? 'Pending Review' : 'Submit for Approval'}
            </button>
          </div>
        </header>

        <div className="flex-1 relative bg-muted/10 p-4 lg:p-8">
          <div className="w-full h-full rounded-xl border border-border shadow-2xl bg-background overflow-hidden flex flex-col">
            <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background border border-border rounded px-3 py-0.5 text-[10px] text-muted-foreground min-w-[200px] text-center truncate">
                  {`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${previewPath}`}
                </div>
              </div>
            </div>
            <iframe 
              ref={iframeRef}
              src={previewPath} 
              className="flex-1 w-full h-full border-none"
              title="Project Preview"
            />
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={!!selectedSection} onOpenChange={(open) => !open && setSelectedSection(null)}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="capitalize flex items-center gap-2">
              {selectedSection === 'global_settings' ? (
                <><Settings className="w-5 h-5 text-primary" /> Global Site Settings</>
              ) : (
                <><Layout className="w-5 h-5 text-primary" /> Edit {selectedSection?.replace(/-/g, ' ')}</>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedSection === 'global_settings' 
                ? "Manage your site's theme, colors, and which sections are visible."
                : "Customize the content and images for this section."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8">
            {selectedSection === 'global_settings' ? (
              <div className="space-y-8">
                {/* Theme & Appearance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/20 border border-border rounded-xl">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layout className="w-3 h-3" /> Layout Theme
                    </label>
                    <select 
                      className="w-full p-2.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20"
                      value={globalConfig.theme || 'lawyer'}
                      onChange={(e) => {
                        const val = e.target.value
                        setModified(m => ({ ...m, theme: val }))
                        autoSaveSection('theme', val)
                      }}
                    >
                      {['lawyer', 'startup', 'chiropractor', 'dentist', 'clinic', 'cleaning', 'pool', 'pest-control', 'real-estate-modern', 'before-after-split', 'industrial', 'clean-delivery', 'luxury-soft', 'academic-clean', 'hvac', 'hvac-blue', 'generic'].map(t => (
                        <option key={t} value={t}>{t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4" ref={colorPaletteRef}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Settings className="w-3 h-3" /> Color Palette
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => { setColorPaletteOpen((o) => !o); setTypographyOpen(false) }}
                        className="w-full p-2.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 flex items-center gap-3 text-left"
                      >
                        <div className="flex gap-0.5 shrink-0">
                          {(COLOR_THEME_SWATCHES[globalConfig.colorTheme || "partner"] ?? ["#94a3b8", "#cbd5e1", "#f1f5f9"]).map((hex, i) => (
                            <div key={i} className="w-4 h-4 rounded-full border border-border shrink-0" style={{ backgroundColor: hex }} title={hex} />
                          ))}
                        </div>
                        <span className="flex-1 truncate capitalize">
                          {(globalConfig.colorTheme || "partner").replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${colorPaletteOpen ? "rotate-90" : ""}`} />
                      </button>
                      {colorPaletteOpen && (
                        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-background border border-border rounded-lg shadow-lg py-1">
                          {[
                            "partner", "justice", "modern", "frost-fire", "reliable", "eco-clean",
                            "surgeon", "wellness", "holistic", "clinical-gold", "red-crimson", "cyan-ocean", "orange-amber",
                            "dark-pink-white", "blue-mint", "red-black", "dark-green-ivory-yellow", "bright-green-hot-pink",
                            "dark-grey-yellowgreen", "blue-shades-white", "white-lime", "beige-dark-grey", "pastel-purple-neutral",
                            "navy-electric-blue", "gradient-white-dark-blue", "white-blue-grey", "bright-red-white",
                            "classic-blue-turquoise-gold", "dark-royal-blue-gold", "white-purple", "blue-shades-white-red-violet",
                            "light-reddish-orange", "white-purple-orange", "deep-purple-orange-red-pink", "brown-beige", "navy-electric",
                            "dark-green-ivory", "fiesta-red-yellow", "barangay-blue", "tropical-teal", "luxury-black-gold", "facebook-blue",
                            "nebula", "flow", "mono"
                          ].sort().map((c) => {
                            const swatches = COLOR_THEME_SWATCHES[c] ?? ["#94a3b8", "#cbd5e1", "#f1f5f9"]
                            const isSelected = (globalConfig.colorTheme || "partner") === c
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setModified((m) => ({ ...m, colorTheme: c }))
                                  autoSaveSection("colorTheme", c)
                                  setColorPaletteOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-xs text-left hover:bg-muted/50 transition-colors ${isSelected ? "bg-primary/10 text-primary" : ""}`}
                              >
                                <div className="flex gap-0.5 shrink-0">
                                  {swatches.map((hex, i) => (
                                    <div key={i} className="w-5 h-5 rounded-full border border-border shrink-0" style={{ backgroundColor: hex }} />
                                  ))}
                                </div>
                                <span className="flex-1 truncate capitalize">{c.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4" ref={typographyRef}>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Typography
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => { setTypographyOpen((o) => !o); setColorPaletteOpen(false) }}
                        className="w-full p-2.5 bg-background border border-border rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-between text-left"
                      >
                        <span
                          className="truncate"
                          style={{ fontFamily: TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))?.fontFamily ?? TYPOGRAPHY_OPTIONS[0].fontFamily }}
                        >
                          {TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))?.label ?? "Elegant"}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${typographyOpen ? "rotate-90" : ""}`} />
                      </button>
                      {typographyOpen && (
                        <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-lg shadow-lg py-1">
                          {TYPOGRAPHY_OPTIONS.map((opt) => {
                            const isSelected = (globalConfig.typographyStyle || "elegant") === opt.value
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setModified((m) => ({ ...m, typographyStyle: opt.value }))
                                  autoSaveSection("typographyStyle", opt.value)
                                  setTypographyOpen(false)
                                }}
                                className={`w-full px-3 py-2.5 text-xs text-left hover:bg-muted/50 transition-colors ${isSelected ? "bg-primary/10 text-primary" : ""}`}
                                style={{ fontFamily: opt.fontFamily }}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Eye className="w-3 h-3" /> Appearance
                    </label>
                    <div className="flex items-center gap-3 p-2 bg-background border border-border rounded-lg">
                      <input
                        type="checkbox"
                        checked={!!globalConfig.darkMode}
                        onChange={(e) => {
                          const val = e.target.checked
                          setModified(m => ({ ...m, darkMode: val }))
                          autoSaveSection('darkMode', val)
                        }}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-xs text-foreground font-medium">Dark Mode Enabled</span>
                    </div>
                  </div>
                </div>

                {/* Section Manager */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Plus className="w-3 h-3" /> Active Sections (Drag to Reorder)
                  </label>
                  <div className="space-y-2">
                    {activeSections.map((section: string, idx: number) => {
                      const isHero = section === 'hero'
                      const isDragging = dragSectionIndex === idx
                      const isDropTarget = dropSectionIndex === idx
                      const moveTo = (fromIndex: number, toIndex: number) => {
                        if (fromIndex === toIndex) return
                        const next = [...activeSections]
                        const [removed] = next.splice(fromIndex, 1)
                        const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex
                        next.splice(insertAt, 0, removed)
                        setModified(m => ({ ...m, activeSections: next }))
                        autoSaveSection('activeSections', next)
                      }
                      return (
                        <div
                          key={idx}
                          draggable={!isHero}
                          onDragStart={() => !isHero && setDragSectionIndex(idx)}
                          onDragEnd={() => { setDragSectionIndex(null); setDropSectionIndex(null) }}
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.dataTransfer.dropEffect = 'move'
                            if (dragSectionIndex !== null && dragSectionIndex !== idx && !(idx === 0 && isHero)) setDropSectionIndex(idx)
                          }}
                          onDragLeave={() => setDropSectionIndex(null)}
                          onDrop={(e) => {
                            e.preventDefault()
                            if (dragSectionIndex !== null && dragSectionIndex !== idx) {
                              const dropIdx = idx === 0 && isHero ? 1 : idx
                              moveTo(dragSectionIndex, dropIdx)
                            }
                            setDragSectionIndex(null)
                            setDropSectionIndex(null)
                          }}
                          className={`flex items-center gap-2 p-2 border rounded-lg group transition-colors ${isHero ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${isDragging ? 'opacity-50 bg-muted/40 border-primary/30' : 'bg-muted/20 border-border'} ${isDropTarget ? 'ring-2 ring-primary/50 bg-primary/5 border-primary/40' : ''}`}
                        >
                          <GripVertical className={`w-4 h-4 shrink-0 aria-hidden ${isHero ? 'text-muted-foreground/20' : 'text-muted-foreground/50'}`} />
                          <span className="flex-1 text-xs font-medium capitalize select-none">{section.replace(/-/g, ' ')}</span>
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            {!isHero && (
                              <button
                                type="button"
                                onClick={() => { if (idx > 0) moveTo(idx, idx - 1) }}
                                className="p-1 hover:bg-muted rounded text-[10px]"
                              >Up</button>
                            )}
                            {!isHero && (
                              <button
                                type="button"
                                onClick={() => { if (idx < activeSections.length - 1) moveTo(idx, idx + 1) }}
                                className="p-1 hover:bg-muted rounded text-[10px]"
                              >Down</button>
                            )}
                            {!isHero && (
                              <button
                                type="button"
                                onClick={() => {
                                  const next = activeSections.filter((_: any, i: number) => i !== idx)
                                  setModified(m => ({ ...m, activeSections: next }))
                                  autoSaveSection('activeSections', next)
                                }}
                                className="p-1 text-muted-foreground hover:text-red-500 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="pt-2">
                    <select 
                      className="w-full p-2.5 text-xs bg-background text-foreground border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                      onChange={(e) => {
                        const value = e.target.value
                        if (!value) return
                        const alreadyAdded = activeSections.includes(value)
                        if (alreadyAdded) {
                          e.target.value = ""
                          return
                        }
                        const next = [...activeSections, value]
                        setModified(m => ({ ...m, activeSections: next }))
                        autoSaveSection('activeSections', next)
                        e.target.value = ""
                      }}
                      value=""
                    >
                      <option value="">+ Add a New Section</option>
                      {(() => {
                        const activeSet = new Set(activeSections)
                        return [
                          'hero', 'features', 'testimonials', 'contact', 'contact-split', 'contact-minimal', 'contact-visual', 'contact-with-map', 'contact-columns', 'practice-areas', 'attorney-profile', 
                          'free-consultation', 'how-it-works', 'review-trust-bar', 'feature-highlight', 
                          'team-carousel', 'patient-faq', 'pricing', 'awards', 'blog', 'common-pests', 
                          'treatment-process', 'safety-section', 'warranty-block', 'ac-types-grid', 
                          'price-preview-strip', 'emergency-cta-strip', 'maintenance-plans', 
                          'before-after-gallery-grid', 'promo-cta-section', 'messenger-sticky-cta', 
                          'service-area-map', 'before-after-slider', 'promo-banner-strip', 
                          'payment-options-strip', 'facebook-review-embed', 'coverage-radius-block', 
                          'stats-section', 'faq-accordion', 'logo-cloud',
                          'trust-badges-grid', 'featured-properties-grid', 'financing-section', 
                          'developer-partners', 'why-choose-me', 'reviews-grid', 'faq-two-column',
                          'team-grid', 'features-modern', 'services-grid', 'project-gallery',
                          'programs-grid', 'faculty-grid', 'delivery-coverage', 'booking-cta'
                        ].filter(s => !activeSet.has(s)).sort().map(s => (
                          <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</option>
                        ))
                      })()}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {/* 1) Text, Boolean, and Nested Object fields detection */}
                <div className="space-y-6">
                  {Object.entries(formValues)
                    .map(([key, value]) => {
                      const isPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(key.toLowerCase());
                      const isImage = !isPageLinkUrl && (key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('before') || key.toLowerCase().includes('after'));
                      const isTextarea = typeof value === 'string' && value.length > 80;
                      const isBoolean = typeof value === 'boolean';
                      const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

                      if (isObject) {
                        return (
                          <div key={key} className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-primary">{fieldLabel(key)}</label>
                            <div className="grid grid-cols-1 gap-4">
                              {Object.entries(value as object).map(([subKey, subVal]) => {
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
                  .filter(([_, v]) => Array.isArray(v))
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

                    return (
                      <div key={key} className="space-y-4 pt-4 border-t border-border">
                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()} ({typedItems.length})
                        </label>
                        
                        <div className="space-y-4">
                          {typedItems.map((item, idx) => {
                            const isObject = item !== null && typeof item === 'object' && !Array.isArray(item);
                            const itemObj = isObject ? (item as Record<string, unknown>) : {}
                            const hasImageUrl = typeof itemObj.imageUrl === 'string' && (itemObj.imageUrl as string).length > 0
                            const iconName = typeof itemObj.icon === 'string' ? (itemObj.icon as string) : 'Award'
                            const showPreview = key === 'items' && isObject && (hasImageUrl || iconName)
                            const previewTitle = (itemObj.label ?? itemObj.title ?? '') as string
                            const previewSub = (itemObj.sublabel ?? itemObj.description ?? '') as string
                            return (
                              <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border space-y-4 relative group">
                                {showPreview && (
                                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                                    <div className="w-10 h-10 rounded-full bg-background border border-border overflow-hidden flex items-center justify-center shrink-0 text-primary">
                                      {hasImageUrl ? (
                                        <img src={itemObj.imageUrl as string} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <DynamicIcon name={iconName} className="w-5 h-5" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-foreground truncate">{previewTitle || '—'}</p>
                                      {previewSub && <p className="text-[10px] text-muted-foreground truncate line-clamp-1">{previewSub}</p>}
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Item #{idx + 1}</span>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Up</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[10px]">Down</button>
                                    <button type="button" onClick={() => { const next = typedItems.filter((_, i) => i !== idx); updateItems(next); }} className="p-1 hover:bg-red-500/10 text-red-500 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                  {isObject ? (
                                    Object.entries(item).map(([iKey, iVal]) => {
                                      const isIArray = Array.isArray(iVal);
                                      const isBioOrProfileLink = iKey.toLowerCase() === 'biourl';
                                      const isIImage = !isBioOrProfileLink && (iKey.toLowerCase().includes('url') || iKey.toLowerCase().includes('image') || iKey.toLowerCase().includes('logo') || iKey.toLowerCase().includes('before') || iKey.toLowerCase().includes('after'));
                                      const isIIcon = iKey.toLowerCase().includes('icon');
                                      const isITextarea = typeof iVal === 'string' && iVal.length > 50;
                                      const fieldLabelStr = fieldLabel(iKey);

                                      return (
                                        <div key={iKey} className="space-y-1.5">
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
                                              className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30 min-h-[60px]"
                                              value={iVal as string}
                                              onChange={(e) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                              }}
                                            />
                                          ) : (
                                            <input
                                              className="w-full px-3 py-2 bg-background border border-border rounded text-xs outline-none focus:ring-1 focus:ring-primary/30"
                                              value={iVal as string}
                                              onChange={(e) => {
                                                const next = [...typedItems]; next[idx] = { ...item, [iKey]: e.target.value }; updateItems(next)
                                              }}
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
                          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add New Item
                        </button>
                      </div>
                    )
                  })}
              </form>
            )}
          </div>

          <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
            <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {isSaving ? 'Syncing changes...' : 'All changes saved locally'}
            </div>
            <button
              onClick={() => setSelectedSection(null)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
