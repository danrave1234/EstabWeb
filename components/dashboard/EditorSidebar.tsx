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
  setModified: (modified: Record<string, any>) => void
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
              Section Order
            </div>
            <div className="space-y-2 bg-muted/20 p-2 rounded-2xl border border-border/50">
              {activeSections.map((section, index) => (
                <div
                  key={section}
                  draggable
                  onDragStart={() => setDragSectionIndex(index)}
                  onDragOver={(e) => { e.preventDefault(); setDropSectionIndex(index) }}
                  onDragEnd={() => {
                    if (dragSectionIndex !== null && dropSectionIndex !== null && dragSectionIndex !== dropSectionIndex) {
                      const newSections = [...activeSections]
                      const [moved] = newSections.splice(dragSectionIndex, 1)
                      newSections.splice(dropSectionIndex, 0, moved)
                      setModified((m: any) => ({ ...m, activeSections: newSections }))
                      autoSaveSection('activeSections', newSections)
                    }
                    setDragSectionIndex(null)
                    setDropSectionIndex(null)
                  }}
                  className={`flex items-center gap-3 p-3 bg-background border border-border rounded-xl cursor-move transition-all ${dragSectionIndex === index ? 'opacity-50 scale-95 shadow-inner' : 'hover:border-primary/30 hover:shadow-md'} ${dropSectionIndex === index ? 'border-primary border-t-4' : ''}`}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold flex-1 truncate capitalize">
                    {section.replace(/-/g, ' ')}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      const newSections = activeSections.filter(s => s !== section)
                      setModified((m: any) => ({ ...m, activeSections: newSections }))
                      autoSaveSection('activeSections', newSections)
                    }}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="p-2">
                <button
                  onClick={() => { setSelectedSection('global_settings'); }}
                  className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Add New Section
                </button>
              </div>
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

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-col gap-2">
          <button
            onClick={async () => {
              setIsSubmitting(true)
              try {
                const res = await fetch('/api/project-config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ projectId: project.id, patch: modified })
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
