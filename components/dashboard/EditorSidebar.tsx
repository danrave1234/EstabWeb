"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight,
  FileText,
  Palette,
  Settings,
  Layout,
  Image as ImageIcon,
  Zap,
  History,
  RotateCcw,
  Plus,
  Trash2,
  GripVertical,
  CreditCard,
  Send,
  EyeOff,
  Eye,
  Archive,
  AlertTriangle,
} from "lucide-react"
import { GENRE_LABELS } from "@/config/presets"
import { formatSectionLabel } from "@/config/dashboard-config"

interface EditorSidebarProps {
  activeTab: "content" | "design" | "advanced"
  setActiveTab: (tab: "content" | "design" | "advanced") => void
  selectedSection: string | null
  setSelectedSection: (section: string | null) => void
  activeSections: string[]
  setHistoryOpen: (open: boolean) => void
  modified: Record<string, any>
  setModified: (modified: any) => void
  hasDraft: boolean
  LOCAL_KEY: string
  refreshPreview: () => void
  isSubmitting: boolean
  setIsSubmitting: (val: boolean) => void
  project: any
  globalConfig: any
  setDragSectionIndex: (idx: number | null) => void
  setDropSectionIndex: (idx: number | null) => void
  dragSectionIndex: number | null
  dropSectionIndex: number | null
  ensureStringArray: (val: unknown) => string[]
  autoSaveSection: (id: string, val: any) => void
  addSection: (id: string) => void
  moveToSectionIndex: (from: number, to: number) => void
  removeSectionAtIndex: (idx: number) => void
  updatePages: (pages: any[]) => void
  pages: any[]
  selectedPageIndex: number
  setSelectedPageIndex: (i: number) => void
  canUsePages: boolean
  isHomePage: boolean
  scrollToSection: (id: string, idx: number) => void
  setActivePreviewSection: (id: string | null) => void
  lockPreviewHighlight: (id: string | null) => void
  activePreviewSection: string | null
}

import { Search, X, Layers, Component } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
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
  DEFAULT_TESTIMONIALS,
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
  sectionIdToKey
} from "@/config/dashboard-config"

const SECTION_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: "Trust & Social Proof", ids: ["awards", "review-trust-bar", "trust-badges-grid", "facebook-review-embed", "reviews-grid", "testimonials"] },
  { label: "Services & Features", ids: ["features", "practice-areas", "feature-highlight", "ac-types-grid", "financing-section", "developer-partners", "featured-properties-grid", "features-modern", "services-grid", "project-gallery", "programs-grid", "warranty-block"] },
  { label: "Process & Info", ids: ["how-it-works", "treatment-process", "patient-faq", "faq-accordion", "faq-two-column", "blog", "delivery-coverage", "stats-section"] },
  { label: "Team & Profiles", ids: ["team-carousel", "team-grid", "attorney-profile", "faculty-grid", "why-choose-me"] },
  { label: "Contact & Conversion", ids: ["contact", "contact-minimal", "contact-visual", "contact-with-map", "contact-columns", "free-consultation", "booking-cta", "pricing", "promo-cta-section", "promo-banner-strip", "payment-options-strip", "service-area-map", "coverage-radius-block", "emergency-cta-strip", "price-preview-strip", "maintenance-plans"] },
  { label: "Visuals & Galleries", ids: ["before-after-gallery-grid", "before-after-slider", "common-pests", "safety-section", "logo-cloud"] },
]

export default function EditorSidebar({
  activeTab,
  setActiveTab,
  selectedSection,
  setSelectedSection,
  activeSections,
  setHistoryOpen,
  modified,
  setModified,
  hasDraft,
  LOCAL_KEY,
  refreshPreview,
  isSubmitting,
  setIsSubmitting,
  project,
  globalConfig,
  setDragSectionIndex,
  setDropSectionIndex,
  dragSectionIndex,
  dropSectionIndex,
  ensureStringArray,
  autoSaveSection,
  addSection,
  moveToSectionIndex,
  removeSectionAtIndex,
  updatePages,
  pages,
  selectedPageIndex,
  setSelectedPageIndex,
  canUsePages,
  isHomePage,
  scrollToSection,
  setActivePreviewSection,
  lockPreviewHighlight,
  activePreviewSection
}: EditorSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [addSectionOpen, setAddSectionOpen] = React.useState(false)

  // Danger Zone state
  const [dangerConfirm, setDangerConfirm] = React.useState<"disable" | "archive" | null>(null)
  const [dangerLoading, setDangerLoading] = React.useState(false)
  const [siteStatus, setSiteStatus] = React.useState<string>(project?.site_status || "active")

  const handleSiteStatusChange = async (newStatus: "disabled" | "active" | "archived") => {
    if (!project?.id) return
    setDangerLoading(true)
    setDangerConfirm(null)
    try {
      const res = await fetch(`/api/project/${project.id}/site-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Failed to update site status")
      } else {
        setSiteStatus(newStatus)
      }
    } catch {
      alert("Network error")
    } finally {
      setDangerLoading(false)
    }
  }

  const filteredSections = activeSections
    .filter((s: string) => s !== 'hero')
    .filter((s: string) => s.replace(/-/g, ' ').toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <aside className="w-[320px] border-r border-border bg-background flex flex-col shrink-0 shadow-xl z-20">
      <div className="p-8 border-b border-border bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all group mb-6"
        >
          <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" strokeWidth={3} />
          </div>
          Back to Dashboard
        </Link>

        <div className="relative z-10">
          <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
            <div className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Layout className="w-6 h-6" />
            </div>
            Site Editor
          </h2>
          <p className="text-[11px] text-muted-foreground font-black mt-2 uppercase tracking-[0.2em] opacity-40">
            Personalize your presence
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-2 gap-1 border-b border-border bg-muted/10">
        {[
          { id: "content", label: "Content", icon: FileText },
          { id: "design", label: "Design", icon: Palette },
          { id: "advanced", label: "Advanced", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center gap-2 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id
                ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
          >
            <tab.icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : "opacity-60"}`} />
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
              Page Sections
              <button
                onClick={() => setAddSectionOpen(true)}
                className="p-1 hover:bg-primary/10 text-primary rounded transition-colors"
                title="Add Section"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-1 mb-2">
              <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-primary' : 'text-muted-foreground/50'}`} />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-muted/40 border border-border/50 rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-muted-foreground/40"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {activeSections.map((section: string, idx: number) => {
              if (section === 'hero') return (
                <button
                  key="hero"
                  onClick={() => setSelectedSection('hero')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'hero' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'} ${searchQuery && !'hero section'.includes(searchQuery.toLowerCase()) ? 'hidden' : ''}`}
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
              )

              if (searchQuery && !section.replace(/-/g, ' ').toLowerCase().includes(searchQuery.toLowerCase())) return null

              const isDragging = dragSectionIndex === idx
              const isDropTarget = dropSectionIndex === idx

              return (
                <div
                  key={`${section}-${idx}`}
                  draggable={true}
                  onDragStart={() => setDragSectionIndex(idx)}
                  onDragEnd={() => { setDragSectionIndex(null); setDropSectionIndex(null) }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dragSectionIndex !== null && dragSectionIndex !== idx) setDropSectionIndex(idx)
                  }}
                  onDragLeave={() => setDropSectionIndex(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    if (dragSectionIndex !== null && dragSectionIndex !== idx) {
                      moveToSectionIndex(dragSectionIndex, idx)
                    }
                    setDragSectionIndex(null)
                    setDropSectionIndex(null)
                  }}
                  className={`relative group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-left border overflow-hidden ${isDragging
                      ? 'opacity-40 bg-muted border-dashed border-primary/20 scale-95'
                      : selectedSection === section
                        ? 'bg-primary/5 border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.02)]'
                        : 'hover:bg-muted border-transparent hover:-translate-y-0.5'
                    } ${isDropTarget ? 'border-t-primary border-t-2 pt-5' : ''}`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div
                    className="w-8 h-8 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all cursor-grab active:cursor-grabbing z-10"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => setSelectedSection(section)}
                    className="flex-1 min-w-0 text-left py-1 relative z-10"
                  >
                    <p className="text-sm font-black truncate capitalize tracking-tight group-hover:text-primary transition-colors">{section.replace(/-/g, ' ')}</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-[0.15em] font-black opacity-40 mt-0.5">Edit Layout</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSectionAtIndex(idx)
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-500/10 z-20"
                    title="Remove Section"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              )
            })}

            <div className="mt-4 px-1">
              <button
                onClick={() => setAddSectionOpen(true)}
                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Add New Block
              </button>
            </div>

            <button
              onClick={() => setSelectedSection('footer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group ${selectedSection === 'footer' ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-muted'}`}
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                <Layout className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Footer</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Contact & Social</p>
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
                <p className="text-sm font-bold truncate">Colors & Type</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Global Styling</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
              Appearance Settings
            </div>
            <div className="space-y-2">
              <p className="px-3 text-[10px] text-muted-foreground leading-relaxed">
                Customize global styles like colors, typography, and dark mode.
              </p>
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-4">
            <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
              Site Management
            </div>

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
              onClick={() => setHistoryOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-110 transition-transform">
                <History className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Version History</p>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Rollback Changes</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">
              Local Storage
            </div>
            <button
              onClick={() => {
                if (confirm('Discard all unsaved local changes?')) {
                  setModified({})
                  if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                  refreshPreview()
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0 group-hover:rotate-180 transition-transform duration-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Reset Draft</p>
                <p className="text-[10px] opacity-70 truncate uppercase tracking-wider font-medium">Discard unsaved</p>
              </div>
            </button>

            {/* Danger Zone */}
            <div className="pt-4 px-3 py-2 text-[10px] font-black text-red-500/70 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Danger Zone
            </div>
            <div className="mx-0 rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-3">
              <p className="text-[10px] text-red-700/70 leading-relaxed">
                Site is currently{" "}
                <span className="font-bold capitalize">{siteStatus}</span>.
              </p>

              {siteStatus === "active" && (
                <>
                  <button
                    onClick={() => setDangerConfirm("disable")}
                    disabled={dangerLoading}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 disabled:opacity-50 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5 shrink-0" />
                    Take site offline temporarily
                  </button>
                  <button
                    onClick={() => setDangerConfirm("archive")}
                    disabled={dangerLoading}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-800 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5 shrink-0" />
                    Archive site
                  </button>
                </>
              )}

              {siteStatus === "disabled" && (
                <button
                  onClick={() => handleSiteStatusChange("active")}
                  disabled={dangerLoading}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  Bring site back online
                </button>
              )}

              {siteStatus === "archived" && (
                <p className="text-[10px] text-red-700/70 italic">
                  This site is archived. Contact support to restore it.
                </p>
              )}

              {/* Confirmation panels */}
              {dangerConfirm === "disable" && (
                <div className="p-2 rounded-lg border border-amber-400 bg-amber-50 space-y-2">
                  <p className="text-[10px] font-semibold text-amber-900">
                    Your website will show an offline page to visitors. You can re-enable it at any time.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSiteStatusChange("disabled")}
                      disabled={dangerLoading}
                      className="px-2 py-1 rounded border border-amber-500 bg-amber-500 text-white text-[10px] font-bold hover:opacity-90 disabled:opacity-50"
                    >
                      {dangerLoading ? "Saving…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setDangerConfirm(null)}
                      disabled={dangerLoading}
                      className="px-2 py-1 rounded border border-border text-[10px] hover:bg-muted disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {dangerConfirm === "archive" && (
                <div className="p-2 rounded-lg border border-red-400 bg-red-50 space-y-2">
                  <p className="text-[10px] font-semibold text-red-900">
                    Archiving removes your custom domain and makes the site inaccessible. Only an admin can restore it.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSiteStatusChange("archived")}
                      disabled={dangerLoading}
                      className="px-2 py-1 rounded border border-red-600 bg-red-600 text-white text-[10px] font-bold hover:opacity-90 disabled:opacity-50"
                    >
                      {dangerLoading ? "Saving…" : "Yes, archive"}
                    </button>
                    <button
                      onClick={() => setDangerConfirm(null)}
                      disabled={dangerLoading}
                      className="px-2 py-1 rounded border border-border text-[10px] hover:bg-muted disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-border/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)] rounded-2xl">
          {/* Premium header */}
          <div className="relative overflow-hidden shrink-0 bg-gradient-to-br from-background via-background to-muted/30">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-primary/3 to-transparent" aria-hidden />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" aria-hidden />
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-primary/70 to-transparent" aria-hidden />
            <DialogHeader className="relative p-5 sm:p-6">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em]">Editor</span>
                  </div>
                  <span className="text-base font-black tracking-tight">Add New Section</span>
                </div>
              </DialogTitle>
              <DialogDescription className="mt-1.5 ml-12 text-[11px] text-muted-foreground">
                Choose a block to add to your page.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7 custom-scrollbar bg-muted/5">
            {SECTION_CATEGORIES.map((cat) => (
              <div key={cat.label} className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-primary/30 rounded-full" />
                  {cat.label}
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {cat.ids.map((id) => {
                    if (id === 'hero') return null;
                    const isAdded = activeSections.includes(id);
                    return (
                      <button
                        key={id}
                        disabled={isAdded}
                        onClick={() => addSection(id)}
                        className={`group relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                          isAdded
                            ? 'bg-muted/40 border-border/50 opacity-55 cursor-not-allowed'
                            : 'bg-background border-border/60 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isAdded
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110'
                        }`}>
                          <Component className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black truncate leading-tight capitalize tracking-tight group-hover:text-primary transition-colors">{id.replace(/-/g, ' ')}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{isAdded ? 'Already on page' : 'Click to add'}</p>
                        </div>
                        {!isAdded && (
                          <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/60 bg-background flex justify-end">
            <button
              onClick={() => setAddSectionOpen(false)}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-6 border-t border-border bg-gradient-to-t from-muted/50 to-background">
        <div className="flex flex-col gap-4">
          <button
            onClick={async () => {
              setIsSubmitting(true)
              try {
                const res = await fetch('/api/project-config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ projectId: project.id, fullConfig: globalConfig })
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json.error || 'Failed to save')
                setModified({})
                if (typeof window !== 'undefined') localStorage.removeItem(LOCAL_KEY)
                refreshPreview()
              } catch (e: any) {
                alert(e?.message || 'Failed to save')
              } finally {
                setIsSubmitting(false)
              }
            }}
            disabled={isSubmitting || Object.keys(modified).length === 0}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-[1.25rem] text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] hover:shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.5)] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Send className={`w-4 h-4 transition-transform duration-500 ${isSubmitting ? 'scale-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
            <span className="relative z-10">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Publish Changes'}
            </span>
          </button>

          <div className="flex items-center justify-between px-3">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
              <div className={`w-2 h-2 rounded-full ring-4 ring-background shadow-sm ${Object.keys(modified).length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {Object.keys(modified).length > 0 ? 'Unsaved' : 'Live'}
            </span>
            {hasDraft && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-md ring-1 ring-primary/20">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
