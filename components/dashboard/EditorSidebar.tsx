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
  Send
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
  autoSaveSection
}: EditorSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [addSectionOpen, setAddSectionOpen] = React.useState(false)

  const addSection = (id: string) => {
    const next = [...activeSections, id]
    const sectionKey = sectionIdToKey(id)
    
    // Default data mapping
    const defaultDataMap: Record<string, any> = {
      'awards': DEFAULT_AWARDS_STRIP,
      'certifications': DEFAULT_AWARDS_STRIP,
      'testimonials': DEFAULT_TESTIMONIALS,
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
      'pricing': DEFAULT_PRICING_TABLE,
      'maintenance-plans': DEFAULT_MAINTENANCE_PLANS,
      'facebook-review-embed': DEFAULT_FACEBOOK_REVIEW_EMBED,
      'why-choose-me': DEFAULT_WHY_CHOOSE_ME,
      'service-area-map': DEFAULT_SERVICE_AREA_MAP,
      'logo-cloud': DEFAULT_LOGO_CLOUD,
      'delivery-coverage': DEFAULT_DELIVERY_COVERAGE,
    }

    const defaultData = defaultDataMap[id] || {}
    
    setModified((m: any) => ({ 
      ...m, 
      activeSections: next,
      [sectionKey]: defaultData
    }))
    autoSaveSection('activeSections', next)
    setAddSectionOpen(false)
    setSelectedSection(id)
  }

  const filteredSections = activeSections
    .filter((s: string) => s !== 'hero')
    .filter((s: string) => s.replace(/-/g, ' ').toLowerCase().includes(searchQuery.toLowerCase()))

  const moveTo = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return
    const next = [...activeSections]
    const [removed] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, removed)
    setModified((m: any) => ({ ...m, activeSections: next }))
    autoSaveSection('activeSections', next)
  }

  const removeSection = (idx: number) => {
    const next = [...activeSections]
    next.splice(idx, 1)
    setModified((m: any) => ({ ...m, activeSections: next }))
    autoSaveSection('activeSections', next)
  }

  return (
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
                      moveTo(dragSectionIndex, idx)
                    }
                    setDragSectionIndex(null)
                    setDropSectionIndex(null)
                  }}
                  className={`relative group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left border ${isDragging ? 'opacity-40 bg-muted border-dashed' : selectedSection === section ? 'bg-primary/5 border-primary/20 shadow-sm' : 'hover:bg-muted border-transparent'} ${isDropTarget ? 'border-t-primary border-t-2' : ''}`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0 group-hover:scale-110 transition-transform cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:text-primary z-10"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <button
                    onClick={() => setSelectedSection(section)}
                    className="flex-1 min-w-0 text-left py-1"
                  >
                    <p className="text-sm font-bold truncate capitalize">{section.replace(/-/g, ' ')}</p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium opacity-70">Block Edit</p>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSection(idx)
                    }}
                    className="p-1.5 opacity-40 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                    title="Remove Section"
                  >
                    <X className="w-3.5 h-3.5" />
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
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 border-b border-border bg-muted/10">
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Add New Section
            </DialogTitle>
            <DialogDescription>
              Choose a block to add to your page.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {SECTION_CATEGORIES.map((cat) => (
              <div key={cat.label} className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary/20 rounded-full" />
                  {cat.label}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {cat.ids.map((id) => {
                    if (id === 'hero') return null;
                    const isAdded = activeSections.includes(id);
                    return (
                      <button
                        key={id}
                        disabled={isAdded}
                        onClick={() => addSection(id)}
                        className={`group relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${isAdded ? 'bg-muted/50 border-border opacity-60 cursor-not-allowed' : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isAdded ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                          <Component className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate leading-tight capitalize">{id.replace(/-/g, ' ')}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{isAdded ? 'Already on page' : 'Click to add'}</p>
                        </div>
                        {!isAdded && (
                          <Plus className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border bg-muted/5 flex justify-end">
            <button
              onClick={() => setAddSectionOpen(false)}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-col gap-2">
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${Object.keys(modified).length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              {Object.keys(modified).length > 0 ? 'Unsaved Changes' : 'All Changes Saved'}
            </span>
            {hasDraft && (
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                Draft Active
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
