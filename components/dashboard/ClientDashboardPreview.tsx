"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { ChevronRight, FileText, Settings, Eye, Layout, Send, Plus, Trash2, GripVertical, Image as ImageIcon, History, RotateCcw, Zap, CreditCard, Palette } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import UpgradeButton from "@/components/dashboard/UpgradeButton"
import SubscriptionSettings from "@/components/dashboard/SubscriptionSettings"
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
import { canPublishDirectly, canPublishNow, getPublishStats, isTrialExpired } from "@/lib/subscription"

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

const DEFAULT_AWARDS_STRIP = {
  title: "Trusted & Recognized By",
  items: [
    { label: "Top Rated 2024", sublabel: "Industry Award", icon: "Award" },
    { label: "Verified Business", sublabel: "Trust Seal", icon: "ShieldCheck" },
    { label: "5-Star Service", sublabel: "Customer Choice", icon: "Star" },
    { label: "10k+ Clients", sublabel: "Community", icon: "Users" },
  ],
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

const DEFAULT_BLOG = {
  title: "Latest Insights",
  subtitle: "Stay updated with our latest news and expert advice.",
  linkText: "Read Article",
  posts: [
    { title: "Article Title", excerpt: "Short description.", date: "Jan 1, 2025", category: "News", imageUrl: "", href: "#" },
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

const DEFAULT_HOW_IT_WORKS = {
  title: "How It Works",
  subtitle: "Simple and transparent.",
  steps: [
    { number: "01", title: "Step One", description: "Brief description.", icon: "Calendar" },
    { number: "02", title: "Step Two", description: "Brief description.", icon: "ClipboardCheck" },
    { number: "03", title: "Step Three", description: "Brief description.", icon: "ShieldCheck" },
  ],
}

const DEFAULT_PRACTICE_AREAS = {
  title: "Our Services",
  subtitle: "Tailored to your needs.",
  items: [
    { title: "Service One", description: "Description of your first offering.", icon: "Scale", href: "#" },
    { title: "Service Two", description: "Description of your second offering.", icon: "Briefcase", href: "#" },
    { title: "Service Three", description: "Description of your third offering.", icon: "Shield", href: "#" },
  ],
}

const DEFAULT_TREATMENT_PROCESS = {
  title: "Our Treatment Process",
  subtitle: "A systematic approach.",
  steps: [
    { title: "Inspection", description: "Thorough check of your property.", icon: "Search" },
    { title: "Treatment", description: "Application of safe, targeted solutions.", icon: "ShieldCheck" },
    { title: "Follow-up", description: "Monitoring to ensure long-term results.", icon: "RotateCw" },
  ],
}

const DEFAULT_COMMON_PESTS = {
  title: "Common Pests We Treat",
  subtitle: "Professional solutions for every type of infestation.",
  items: [
    { name: "Termites", icon: "Bug" },
    { name: "Cockroaches", icon: "Bug" },
    { name: "Rats & Mice", icon: "Bug" },
  ],
}

const DEFAULT_FEATURED_LISTINGS = {
  title: "Featured Properties",
  subtitle: "Discover the best opportunities.",
  items: [
    { title: "Listing One", location: "City", price: "₱0", imageUrl: "", beds: 0, baths: 0, sqm: 0, tag: "" },
    { title: "Listing Two", location: "City", price: "₱0", imageUrl: "", beds: 0, baths: 0, sqm: 0, tag: "" },
  ],
}

const DEFAULT_DEVELOPER_PARTNERS = {
  title: "Our Partners",
  items: [
    { name: "Partner 1", logoUrl: "" },
    { name: "Partner 2", logoUrl: "" },
  ],
}

const DEFAULT_REVIEW_TRUST_BAR = {
  title: "What Our Customers Say",
  subtitle: "Real feedback from real people.",
  testimonials: [
    { quoteTitle: "Great service", body: "Professional and reliable.", customerName: "Customer A", verified: true },
    { quoteTitle: "Highly recommend", body: "Very satisfied with the results.", customerName: "Customer B", verified: true },
  ],
}

const DEFAULT_FINANCING = {
  title: "Financing Options",
  subtitle: "Flexible payment terms.",
  items: [
    { title: "Option One", description: "Brief description.", icon: "Home", features: ["Feature 1", "Feature 2"] },
    { title: "Option Two", description: "Brief description.", icon: "Building", features: ["Feature 1"] },
  ],
}

const DEFAULT_AC_TYPES = {
  title: "AC Types We Service",
  subtitle: "Expert service for all types.",
  items: [
    { name: "Window Type", icon: "Zap", description: "Description here." },
    { name: "Split Type", icon: "Zap", description: "Description here." },
  ],
}

const DEFAULT_PRICE_PREVIEW = {
  title: "Quick Price Guide",
  items: [
    { service: "Service 1", price: "₱XXX", note: "" },
    { service: "Service 2", price: "₱XXX", note: "" },
  ],
}

const DEFAULT_PRICING_TABLE = {
  title: "Simple Pricing",
  subtitle: "Choose the plan that fits.",
  plans: [
    { name: "Basic", price: "₱0", description: "Get started for free.", features: [{ text: "Core features", included: true }, { text: "Support", included: true }], buttonText: "Get Started", isPopular: false },
    { name: "Pro", price: "₱999", description: "For growing teams.", features: [{ text: "Everything in Basic", included: true }, { text: "Priority support", included: true }], buttonText: "Get Pro", isPopular: true },
  ],
}

const DEFAULT_MAINTENANCE_PLANS = {
  title: "Maintenance Plans",
  subtitle: "Keep your systems running smoothly.",
  plans: [
    { name: "Basic", price: "₱2,800", period: "/year", description: "2 visits per year.", features: ["Inspection", "Cleaning"], isPopular: false },
    { name: "Premium", price: "₱5,000", period: "/year", description: "4 visits per year.", features: ["Everything in Basic", "Priority service"], isPopular: true },
  ],
}

const DEFAULT_FACEBOOK_REVIEW_EMBED = {
  title: "Highly Rated on Facebook",
  subtitle: "See why our customers love us",
  reviews: [
    { author: "Customer A", text: "Excellent service!", date: "2 weeks ago", rating: 5 },
    { author: "Customer B", text: "Very satisfied.", date: "1 month ago", rating: 5 },
  ],
}

const DEFAULT_WHY_CHOOSE_ME = {
  title: "Why Choose Me",
  subtitle: "Your trusted partner",
  agentName: "",
  agentRole: "",
  licenseNumber: "",
  agentBio: "",
  agentImageUrl: "",
  trustSignals: [
    { label: "Licensed", icon: "Award" },
    { label: "10+ Years", icon: "Clock" },
  ],
}

const DEFAULT_SERVICE_AREA_MAP = {
  title: "Our Service Areas",
  subtitle: "We serve the following locations.",
  cities: ["City 1", "City 2", "City 3"],
  googleMapsEmbedUrl: "",
}

const DEFAULT_LOGO_CLOUD = {
  title: "Trusted by",
  items: [
    { name: "Company 1", logoUrl: "" },
    { name: "Company 2", logoUrl: "" },
  ],
}

const DEFAULT_DELIVERY_COVERAGE = {
  title: "Delivery Coverage",
  subtitle: "We deliver to the following areas.",
  areas: ["Area 1", "Area 2", "Area 3"],
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

function AwardIconPicker({ value, onChange, compact }: { value: string; onChange: (val: string) => void; compact?: boolean }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])
  const displayName = value || "Award"
  if (compact) {
    return (
      <div ref={ref} className="relative inline-block">
        <button type="button" onClick={() => setOpen((o) => !o)} className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-primary hover:border-primary/30 focus:ring-2 focus:ring-primary/20 outline-none shrink-0" title={displayName}>
          <DynamicIcon name={displayName} className="w-5 h-5" />
        </button>
        {open && (
          <div className="absolute z-[100] mt-2 left-1/2 -translate-x-1/2 min-w-[220px] max-w-[280px] max-h-72 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2">
            {AWARD_ICON_NAMES.map((name) => (
              <button key={name} type="button" onClick={() => { onChange(name); setOpen(false) }} className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[9px] font-medium transition-colors min-w-0 ${value === name ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-muted/50 hover:border-primary/30"}`}>
                <DynamicIcon name={name} className="w-5 h-5 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
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
        <div className="absolute z-[100] mt-2 left-0 right-0 min-w-[240px] max-h-72 overflow-y-auto overflow-x-hidden scrollbar-hide bg-background border border-border rounded-xl shadow-xl p-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
          {AWARD_ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange(name); setOpen(false) }}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border text-[10px] font-medium transition-colors min-w-0 hover:bg-muted/50 ${value === name ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/30"}`}
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

const SECTION_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: "Hero & Identity", ids: ["hero"] },
  { label: "Trust & Social Proof", ids: ["awards", "review-trust-bar", "trust-badges-grid", "facebook-review-embed", "reviews-grid", "testimonials"] },
  { label: "Services & Features", ids: ["features", "practice-areas", "feature-highlight", "ac-types-grid", "financing-section", "developer-partners", "featured-properties-grid", "features-modern", "services-grid", "project-gallery", "programs-grid", "warranty-block"] },
  { label: "Process & Info", ids: ["how-it-works", "treatment-process", "patient-faq", "faq-accordion", "faq-two-column", "blog", "delivery-coverage", "stats-section"] },
  { label: "Team & Profiles", ids: ["team-carousel", "team-grid", "attorney-profile", "faculty-grid", "why-choose-me"] },
  { label: "Contact & Conversion", ids: ["contact", "contact-split", "contact-minimal", "contact-visual", "contact-with-map", "contact-columns", "free-consultation", "booking-cta", "messenger-sticky-cta", "pricing", "promo-cta-section", "promo-banner-strip", "payment-options-strip", "service-area-map", "coverage-radius-block", "emergency-cta-strip", "price-preview-strip", "maintenance-plans"] },
  { label: "Visuals & Galleries", ids: ["before-after-gallery-grid", "before-after-slider", "common-pests", "safety-section", "logo-cloud"] },
]

const formatSectionLabel = (id: string) => id.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

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
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [modified, setModified] = React.useState<Record<string, any>>({})
  const [hasPendingRequest, setHasPendingRequest] = React.useState(false)
  const [colorPaletteOpen, setColorPaletteOpen] = React.useState(false)
  const [typographyOpen, setTypographyOpen] = React.useState(false)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [versions, setVersions] = React.useState<{ id: string; version: number; createdAt: string; isCurrent: boolean }[]>([])
  const [versionsLoading, setVersionsLoading] = React.useState(false)
  const [rollbackLoading, setRollbackLoading] = React.useState<number | null>(null)
  const [upgradeLoading, setUpgradeLoading] = React.useState(false)
  const [dragSectionIndex, setDragSectionIndex] = React.useState<number | null>(null)
  const [dropSectionIndex, setDropSectionIndex] = React.useState<number | null>(null)
  const [activeTab, setActiveTab] = React.useState<"content" | "design" | "advanced">("content")
  const [globalSettingsModalTab, setGlobalSettingsModalTab] = React.useState<"theme" | "sections">("theme")
  const colorPaletteRef = React.useRef<HTMLDivElement>(null)
  const typographyRef = React.useRef<HTMLDivElement>(null)
  const colorPaletteRectRef = React.useRef<DOMRect | null>(null)
  const typographyRectRef = React.useRef<DOMRect | null>(null)

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      const target = e.target as Node
      const inColorPalette = colorPaletteRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=color-palette]")
      const inTypography = typographyRef.current?.contains(target) || (e.target as Element)?.closest?.("[data-dropdown=typography]")
      if (!inColorPalette) setColorPaletteOpen(false)
      if (!inTypography) setTypographyOpen(false)
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
  const canPublish = canPublishDirectly(project)
  const publishStats = getPublishStats(project)
  const showUpgrade = (project.subscription_status || 'free') === 'free' || isTrialExpired(project)
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
      } else if (sectionKey === 'awardsStrip') {
        const baseAwards = (base || {}) as Record<string, any>
        let items = baseAwards.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_AWARDS_STRIP.items
        const merged = {
          ...DEFAULT_AWARDS_STRIP,
          ...baseAwards,
          items,
        }
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
      } else if (sectionKey === 'blog') {
        const baseBlog = (base || {}) as Record<string, any>
        let posts = baseBlog.posts
        if (!Array.isArray(posts) && posts && typeof posts === 'object') {
          posts = Object.keys(posts)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (posts as Record<string, any>)[k])
        }
        if (!Array.isArray(posts) || posts.length === 0) posts = DEFAULT_BLOG.posts
        const merged = {
          ...DEFAULT_BLOG,
          ...baseBlog,
          posts,
        }
        setFormValues(merged)
      } else if (sectionKey === 'howItWorks') {
        const baseH = (base || {}) as Record<string, any>
        let arr = baseH.steps ?? baseH.items
        if (!Array.isArray(arr) && arr && typeof arr === 'object') {
          arr = Object.keys(arr)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (arr as Record<string, any>)[k])
        }
        if (!Array.isArray(arr) || arr.length === 0) arr = DEFAULT_HOW_IT_WORKS.steps
        const merged = { ...DEFAULT_HOW_IT_WORKS, ...baseH, steps: arr }
        setFormValues(merged)
      } else if (sectionKey === 'practiceAreas') {
        const baseP = (base || {}) as Record<string, any>
        let items = baseP.items ?? baseP.areas
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_PRACTICE_AREAS.items
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseP, items }
        setFormValues(merged)
      } else if (sectionKey === 'treatmentProcess') {
        const baseT = (base || {}) as Record<string, any>
        let steps = baseT.steps
        if (!Array.isArray(steps) && steps && typeof steps === 'object') {
          steps = Object.keys(steps)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (steps as Record<string, any>)[k])
        }
        if (!Array.isArray(steps) || steps.length === 0) steps = DEFAULT_TREATMENT_PROCESS.steps
        const merged = { ...DEFAULT_TREATMENT_PROCESS, ...baseT, steps }
        setFormValues(merged)
      } else if (sectionKey === 'commonPests') {
        const baseC = (base || {}) as Record<string, any>
        let items = baseC.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_COMMON_PESTS.items
        const merged = { ...DEFAULT_COMMON_PESTS, ...baseC, items }
        setFormValues(merged)
      } else if (sectionKey === 'featuredListings') {
        const baseF = (base || {}) as Record<string, any>
        let items = baseF.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_FEATURED_LISTINGS.items
        const merged = { ...DEFAULT_FEATURED_LISTINGS, ...baseF, items }
        setFormValues(merged)
      } else if (sectionKey === 'developerPartners') {
        const baseD = (base || {}) as Record<string, any>
        let items = baseD.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_DEVELOPER_PARTNERS.items
        const merged = { ...DEFAULT_DEVELOPER_PARTNERS, ...baseD, items }
        setFormValues(merged)
      } else if (sectionKey === 'reviewTrustBar') {
        const baseR = (base || {}) as Record<string, any>
        let testimonials = baseR.testimonials
        if (!Array.isArray(testimonials) && testimonials && typeof testimonials === 'object') {
          testimonials = Object.keys(testimonials)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (testimonials as Record<string, any>)[k])
        }
        if (!Array.isArray(testimonials) || testimonials.length === 0) testimonials = DEFAULT_REVIEW_TRUST_BAR.testimonials
        const merged = { ...DEFAULT_REVIEW_TRUST_BAR, ...baseR, testimonials }
        setFormValues(merged)
      } else if (sectionKey === 'financing') {
        const baseFi = (base || {}) as Record<string, any>
        let items = baseFi.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_FINANCING.items
        const merged = { ...DEFAULT_FINANCING, ...baseFi, items }
        setFormValues(merged)
      } else if (sectionKey === 'acTypes') {
        const baseA = (base || {}) as Record<string, any>
        let items = baseA.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_AC_TYPES.items
        const merged = { ...DEFAULT_AC_TYPES, ...baseA, items }
        setFormValues(merged)
      } else if (sectionKey === 'pricePreview') {
        const baseP = (base || {}) as Record<string, any>
        let items = baseP.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_PRICE_PREVIEW.items
        const merged = { ...DEFAULT_PRICE_PREVIEW, ...baseP, items }
        setFormValues(merged)
      } else if (sectionKey === 'safety') {
        const baseS = (base || {}) as Record<string, any>
        let items = baseS.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_PRACTICE_AREAS.items
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseS, items }
        setFormValues(merged)
      } else if (sectionKey === 'featureHighlight') {
        const baseFh = (base || {}) as Record<string, any>
        let items = baseFh.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_PRACTICE_AREAS.items
        const merged = { ...DEFAULT_PRACTICE_AREAS, ...baseFh, items }
        setFormValues(merged)
      } else if (sectionKey === 'pricingTable') {
        const baseP = (base || {}) as Record<string, any>
        let plans = baseP.plans
        if (!Array.isArray(plans) && plans && typeof plans === 'object') {
          plans = Object.keys(plans)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (plans as Record<string, any>)[k])
        }
        if (!Array.isArray(plans) || plans.length === 0) plans = DEFAULT_PRICING_TABLE.plans
        const merged = { ...DEFAULT_PRICING_TABLE, ...baseP, plans }
        setFormValues(merged)
      } else if (sectionKey === 'maintenancePlans') {
        const baseM = (base || {}) as Record<string, any>
        let plans = baseM.plans
        if (!Array.isArray(plans) && plans && typeof plans === 'object') {
          plans = Object.keys(plans)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (plans as Record<string, any>)[k])
        }
        if (!Array.isArray(plans) || plans.length === 0) plans = DEFAULT_MAINTENANCE_PLANS.plans
        const merged = { ...DEFAULT_MAINTENANCE_PLANS, ...baseM, plans }
        setFormValues(merged)
      } else if (sectionKey === 'facebookReviewEmbed') {
        const baseFb = (base || {}) as Record<string, any>
        let reviews = baseFb.reviews
        if (!Array.isArray(reviews) && reviews && typeof reviews === 'object') {
          reviews = Object.keys(reviews)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (reviews as Record<string, any>)[k])
        }
        if (!Array.isArray(reviews) || reviews.length === 0) reviews = DEFAULT_FACEBOOK_REVIEW_EMBED.reviews
        const merged = { ...DEFAULT_FACEBOOK_REVIEW_EMBED, ...baseFb, reviews }
        setFormValues(merged)
      } else if (sectionKey === 'whyChooseMe') {
        const baseW = (base || {}) as Record<string, any>
        let trustSignals = baseW.trustSignals
        if (!Array.isArray(trustSignals) && trustSignals && typeof trustSignals === 'object') {
          trustSignals = Object.keys(trustSignals)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (trustSignals as Record<string, any>)[k])
        }
        if (!Array.isArray(trustSignals) || trustSignals.length === 0) trustSignals = DEFAULT_WHY_CHOOSE_ME.trustSignals
        const merged = { ...DEFAULT_WHY_CHOOSE_ME, ...baseW, trustSignals }
        setFormValues(merged)
      } else if (sectionKey === 'serviceAreaMap') {
        const baseS = (base || {}) as Record<string, any>
        let cities = Array.isArray(baseS.cities) ? baseS.cities : (Array.isArray(baseS.areas) ? baseS.areas : DEFAULT_SERVICE_AREA_MAP.cities)
        const merged = { ...DEFAULT_SERVICE_AREA_MAP, ...baseS, cities }
        setFormValues(merged)
      } else if (sectionKey === 'logoCloud') {
        const baseL = (base || {}) as Record<string, any>
        let items = baseL.items
        if (!Array.isArray(items) && items && typeof items === 'object') {
          items = Object.keys(items)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (items as Record<string, any>)[k])
        }
        if (!Array.isArray(items) || items.length === 0) items = DEFAULT_LOGO_CLOUD.items
        const merged = { ...DEFAULT_LOGO_CLOUD, ...baseL, items }
        setFormValues(merged)
      } else if (sectionKey === 'deliveryCoverage') {
        const baseD = (base || {}) as Record<string, any>
        let areas = Array.isArray(baseD.areas) ? baseD.areas : DEFAULT_DELIVERY_COVERAGE.areas
        const merged = { ...DEFAULT_DELIVERY_COVERAGE, ...baseD, areas }
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
      <aside className="w-[320px] border-r border-border bg-background flex flex-col shrink-0 shadow-xl z-20">
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

              <div className="pt-4 px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
                Page Sections
              </div>
              <button
                onClick={() => setSelectedSection('hero')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'hero' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
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

              {activeSections.filter((s: string) => s !== 'hero').map((section: string) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === section ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate capitalize">{section.replace(/-/g, ' ')}</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Block Edit</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}

              <button
                onClick={() => setSelectedSection('footer')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'footer' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
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
              <button
                onClick={() => setSelectedSection('global_settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'global_settings' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Palette className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Appearance</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Theme & Sections</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
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
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 px-3 py-2 bg-background rounded-xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-sm border-2 border-primary/30">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate tracking-tight">{user.email}</p>
              <form action="/auth/signout" method="post">
                <button className="text-[10px] font-bold text-muted-foreground hover:text-destructive uppercase tracking-widest transition-colors">
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
            <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} />
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
            {canPublish ? (
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
                    router.refresh()
                    setTimeout(() => refreshPreview(), 100)
                  } catch (e: any) {
                    toast.error(e?.message || 'Failed to publish')
                  } finally {
                    setIsPublishing(false)
                  }
                }}
                disabled={isPublishing || !canPublishNow(project) || (!hasDraft && Object.keys(modified).length === 0)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isPublishing ? 'Publishing…' : `Publish${publishStats.remaining > 0 && publishStats.remainingToday > 0 ? ` (${publishStats.remainingToday} today, ${publishStats.remaining} period)` : ''}`}
              </button>
            ) : (
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
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isQueueing ? 'Submitting…' : hasPendingRequest ? 'Pending Review' : 'Submit for Approval'}
              </button>
            )}
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

      {/* Edit Modal - Redesigned for better UI/UX. modal={false} allows portaled dropdowns (color palette, typography) to receive scroll/click. */}
      <Dialog open={!!selectedSection} onOpenChange={(open) => { if (!open) { setSelectedSection(null); setGlobalSettingsModalTab("theme"); } }} modal={false}>
        <DialogContent className={`p-0 overflow-hidden flex flex-col max-h-[90vh] min-h-0 border-0 shadow-2xl w-[95vw] ${selectedSection === 'global_settings' ? 'sm:max-w-[880px]' : 'sm:max-w-[840px]'}`}>
          {/* Polished header - shrink-0 keeps it always visible */}
          <div className="relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent" aria-hidden />
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" aria-hidden />
            <DialogHeader className="relative p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {selectedSection === 'global_settings' ? (
                    <Settings className="w-6 h-6 text-primary" />
                  ) : selectedSection === 'subscription' ? (
                    <CreditCard className="w-6 h-6 text-primary" />
                  ) : (
                    <Layout className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="capitalize flex items-center gap-2 text-lg font-bold tracking-tight">
                    {selectedSection === 'global_settings' ? (
                      <>Global Site Settings</>
                    ) : selectedSection === 'subscription' ? (
                      <>Subscription & Plan</>
                    ) : (
                      <>Edit {selectedSection?.replace(/-/g, ' ')}</>
                    )}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm leading-relaxed">
                    {selectedSection === 'global_settings' 
                      ? "Manage your site's theme, colors, typography, and page sections."
                      : selectedSection === 'subscription'
                      ? "View your current plan and manage auto-renewal settings."
                      : "Customize the content and images for this section."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Tabs for global_settings */}
            {selectedSection === 'global_settings' && (
              <div className="relative flex border-t border-border/60 px-6">
                <button
                  type="button"
                  onClick={() => setGlobalSettingsModalTab("theme")}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px ${globalSettingsModalTab === "theme" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  Theme & Colors
                </button>
                <button
                  type="button"
                  onClick={() => setGlobalSettingsModalTab("sections")}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px ${globalSettingsModalTab === "sections" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  Page Sections
                </button>
              </div>
            )}
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 space-y-6"
            onScroll={() => { setColorPaletteOpen(false); setTypographyOpen(false) }}
          >
            {selectedSection === 'subscription' ? (
              <SubscriptionSettings project={project as any} />
            ) : selectedSection === 'global_settings' ? (
              <div className="space-y-6">
                {globalSettingsModalTab === "theme" && (
                <>
                {/* Theme & Appearance - Card with clear hierarchy */}
                <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/30 to-muted/10 overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/60 bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" /> Theme & Appearance
                    </h3>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Layout className="w-3 h-3" /> Layout Theme
                    </label>
                    <select 
                      className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
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
                        onClick={() => {
                          setTypographyOpen(false)
                          const rect = colorPaletteRef.current?.getBoundingClientRect()
                          if (rect) colorPaletteRectRef.current = rect
                          setColorPaletteOpen((o) => !o)
                        }}
                        className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 flex items-center gap-3 text-left transition-colors"
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
                      {colorPaletteOpen && typeof document !== "undefined" && colorPaletteRectRef.current && createPortal(
                        (() => {
                          const rect = colorPaletteRectRef.current!
                          const spaceBelow = typeof window !== "undefined" ? window.innerHeight - rect.bottom - 24 : 280
                          const maxHeight = Math.min(280, Math.max(160, spaceBelow))
                          return (
                        <div
                          data-dropdown="color-palette"
                          className="fixed z-[300] overflow-y-auto bg-background border border-border rounded-lg shadow-lg py-1 pointer-events-auto"
                          style={{
                            top: rect.bottom + 4,
                            left: rect.left,
                            width: Math.max(rect.width, 200),
                            minWidth: 200,
                            maxHeight,
                          }}
                        >
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
                          )
                        })(),
                        document.body
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
                        onClick={() => {
                          setColorPaletteOpen(false)
                          const rect = typographyRef.current?.getBoundingClientRect()
                          if (rect) typographyRectRef.current = rect
                          setTypographyOpen((o) => !o)
                        }}
                        className="w-full p-2.5 bg-background border border-border/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 flex items-center justify-between text-left transition-colors"
                      >
                        <span
                          className="truncate"
                          style={{ fontFamily: TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))?.fontFamily ?? TYPOGRAPHY_OPTIONS[0].fontFamily }}
                        >
                          {TYPOGRAPHY_OPTIONS.find((o) => o.value === (globalConfig.typographyStyle || "elegant"))?.label ?? "Elegant"}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${typographyOpen ? "rotate-90" : ""}`} />
                      </button>
                      {typographyOpen && typeof document !== "undefined" && typographyRectRef.current && createPortal(
                        <div
                          data-dropdown="typography"
                          className="fixed z-[300] bg-background border border-border rounded-lg shadow-lg py-1"
                          style={{
                            top: typographyRectRef.current.bottom + 4,
                            left: typographyRectRef.current.left,
                            width: typographyRectRef.current.width,
                            minWidth: 200,
                          }}
                        >
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
                        </div>,
                        document.body
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Eye className="w-3 h-3" /> Appearance
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-background/80 border border-border/80 rounded-xl">
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
                  </div>
                </>
                )}

                {globalSettingsModalTab === "sections" && (
                <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/30 to-muted/10 overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/60 bg-muted/20">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Plus className="w-4 h-4 text-primary" /> Active Sections (Drag to Reorder)
                    </h3>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">Reorder or remove sections. Hero is always first.</p>
                  </div>
                  <div className="p-5 space-y-4">
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
                          className={`flex items-center gap-3 p-3 border rounded-xl group transition-all duration-200 ${isHero ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'} ${isDragging ? 'opacity-60 bg-muted/50 border-primary/40 scale-[0.98]' : 'bg-background/80 border-border/80 hover:border-primary/20'} ${isDropTarget ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background bg-primary/5 border-primary' : ''}`}
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
                      className="w-full p-2.5 text-xs bg-background text-foreground border border-border/80 rounded-xl outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors"
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
                        return SECTION_CATEGORIES.map((cat) => {
                          const available = cat.ids.filter((id) => !activeSet.has(id))
                          if (available.length === 0) return null
                          return (
                            <optgroup key={cat.label} label={cat.label}>
                              {available.sort().map((id) => (
                                <option key={id} value={id}>{formatSectionLabel(id)}</option>
                              ))}
                            </optgroup>
                          )
                        })
                      })()}
                    </select>
                  </div>
                    </div>
                </div>
                )}
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* 1) Text, Boolean, and Nested Object fields - use grid for horizontal layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {Object.entries(formValues)
                    .map(([key, value]) => {
                      const isPageLinkUrl = ['privacyurl', 'termsurl', 'cookieurl'].includes(key.toLowerCase());
                      const isImage = !isPageLinkUrl && (key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('before') || key.toLowerCase().includes('after'));
                      const isTextarea = typeof value === 'string' && value.length > 80;
                      const isBoolean = typeof value === 'boolean';
                      const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

                      if (isObject) {
                        return (
                          <div key={key} className="col-span-2 rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden">
                            <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
                              <label className="text-xs font-bold uppercase tracking-widest text-primary">{fieldLabel(key)}</label>
                            </div>
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div key={key} className="rounded-2xl border border-border/80 bg-gradient-to-b from-muted/25 to-muted/5 overflow-hidden pt-0">
                        <div className="px-4 py-3 border-b border-border/60 bg-muted/10 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-primary">
                            {key.replace(/([A-Z])/g, ' $1').trim()} 
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            {typedItems.length} {typedItems.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <div className="p-4 space-y-4">
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
                            const hasPageStyle = key === 'items' && isObject && hasAwardsStructure && !hasPracticeAreasStructure && !hasBeforeAfterStructure && !hasFeaturedListingsStructure && !hasDeveloperPartnersStructure && !hasAcTypesStructure && !hasPricePreviewStructure

                            if (hasBlogStructure) {
                              return (
                                <div key={idx} className="flex flex-col rounded-xl bg-background/80 border border-border/80 shadow-sm relative group hover:border-primary/15 transition-colors overflow-visible">
                                  <div className="absolute -top-1 -left-1 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-md p-1">
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                      {hasImageUrl && (
                                        <div className="flex-1">
                                          <ImageUpload value={itemObj.imageUrl as string} onChange={(url) => { const next = [...typedItems]; next[idx] = { ...item, imageUrl: url }; updateItems(next) }} />
                                        </div>
                                      )}
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
                                    <button type="button" onClick={() => { if (idx > 0) { const next = [...typedItems]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↑</button>
                                    <button type="button" onClick={() => { if (idx < typedItems.length - 1) { const next = [...typedItems]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; updateItems(next); } }} className="p-1 hover:bg-muted rounded text-[9px]">↓</button>
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
          <div className="shrink-0 px-6 py-4 bg-muted/20 border-t border-border/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 w-2 h-2 rounded-full ${isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-xs font-medium text-muted-foreground truncate">
                {isSaving ? 'Syncing changes…' : 'All changes saved'}
              </span>
            </div>
            <button
              onClick={() => setSelectedSection(null)}
              className="shrink-0 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History / Rollback Modal */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Version History
            </DialogTitle>
            <DialogDescription>
              Restore your site to a previous working state if something went wrong.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {versionsLoading ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Loading history…</p>
            ) : versions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No version history yet. Publish changes to create restore points.</p>
            ) : (
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between gap-4 py-2 px-3 rounded-lg border border-border bg-muted/20"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">Version {v.version}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                      {v.isCurrent && (
                        <span className="ml-2 text-[10px] font-bold text-emerald-600 uppercase">Current</span>
                      )}
                    </div>
                    {!v.isCurrent && (
                      <button
                        onClick={async () => {
                          setRollbackLoading(v.version)
                          try {
                            const res = await fetch('/api/rollback', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ projectId: project.id, version: v.version }),
                            })
                            const json = await res.json()
                            if (!res.ok) throw new Error(json.error || 'Rollback failed')
                            toast.success(`Restored to version ${v.version}`)
                            setHistoryOpen(false)
                            router.refresh()
                            setTimeout(() => refreshPreview(), 100)
                          } catch (e: any) {
                            toast.error(e?.message || 'Rollback failed')
                          } finally {
                            setRollbackLoading(null)
                          }
                        }}
                        disabled={rollbackLoading !== null}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {rollbackLoading === v.version ? 'Restoring…' : 'Restore'}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
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
