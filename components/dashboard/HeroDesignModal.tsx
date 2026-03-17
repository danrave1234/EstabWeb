"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Layout, X, Check, Zap, ShieldCheck, Wrench, Sparkles, AlertCircle } from "lucide-react"
import { BLOCK_MAP } from "@/lib/utils/block-registry"
import {
  prefetchSectionPreview,
  SectionLivePreviewPanel,
} from "@/components/dashboard/SectionLivePreview"

interface HeroDesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTheme: string
  currentActiveSections: string[]
  onSelect: (variantId: string, theme?: string) => void
}

const HERO_CATEGORIES = [
  {
    label: "Modern & High-Impact",
    icon: Sparkles,
    ids: ["hero--aero-3", "hero--v6", "hero--showcase", "hero--minimalism", "hero--startup"],
  },
  {
    label: "Professional Business Layouts",
    icon: ShieldCheck,
    ids: ["hero--group-images", "hero--modern", "hero--elegant-carousel", "hero--real-estate-modern", "hero--before-after-split", "hero--industrial", "hero--clean-delivery", "hero--luxury-soft", "hero--academic-clean", "hero--hvac", "hero--hvac-blue", "hero--generic"],
  },
  {
    label: "Local Service Experts",
    icon: Wrench,
    ids: ["hero--gym", "hero--lawyer", "hero--dentist", "hero--clinic", "hero--chiropractor", "hero--pool", "hero--cleaning", "hero--pest-control", "hero--emergency"],
  },
];

export function HeroDesignModal({ open, onOpenChange, currentTheme, currentActiveSections, onSelect }: HeroDesignModalProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const backdropPointerDownRef = React.useRef(false)

  // Determine current effective variant ID from theme + activeSections
  const currentHeroId = React.useMemo(() => {
    const activeHero = currentActiveSections.find(s => s.startsWith('hero')) || 'hero'
    if (activeHero === 'hero' && currentTheme && currentTheme !== 'generic') {
      return `hero--${currentTheme}`
    }
    return activeHero === 'hero' ? 'hero--generic' : activeHero
  }, [currentActiveSections, currentTheme]);

  React.useEffect(() => {
    if (open) {
      setSelectedId(currentHeroId)
      // Only prefetch the currently selected hero on open to avoid a
      // Turbopack/Webpack compilation burst that spams the dev server logs
      // and triggers HMR reloads on the preview iframe.
      prefetchSectionPreview(currentHeroId)
    }
  }, [open, currentHeroId])

  // Reset state when modal closes
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  const handleApply = (id: string) => {
    const theme = id.includes('--') ? id.split('--')[1] : 'generic'
    // Special case for aero-3 and showcase which are separate blocks, 
    // but in this modal we treat them as part of the "Hero" choice.
    // The parent component will handle actually swapping them.
    onSelect(id, theme)
    onOpenChange(false)
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) backdropPointerDownRef.current = true
        else backdropPointerDownRef.current = false
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && backdropPointerDownRef.current) onOpenChange(false)
        backdropPointerDownRef.current = false
      }}
    >
      <div className="w-[95vw] h-[90vh] max-w-[1600px] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10 shrink-0">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-base text-foreground leading-none">Hero Section Designs</span>
              <span className="text-xs text-muted-foreground mt-1">Pick the layout that best fits your business brand.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left: Sidebar (Categories + Variants) */}
          <div className="w-[300px] border-r border-border overflow-y-auto bg-muted/5 shrink-0">
            <div className="p-4 space-y-8">
              {HERO_CATEGORIES.map((cat) => (
                <div key={cat.label} className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50 mb-2">
                    <cat.icon className="w-3 h-3" />
                    {cat.label}
                  </div>
                  <div className="space-y-1">
                    {cat.ids.map((id) => {
                      const block = BLOCK_MAP[id] || BLOCK_MAP['hero']
                      const isSelected = selectedId === id
                      const isActive = currentHeroId === id
                      
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedId(id)}
                          onMouseEnter={() => prefetchSectionPreview(id)}
                          className={`w-full group flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            isSelected 
                              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                              : "hover:bg-muted/80 text-foreground"
                          }`}
                        >
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 transition-all ${
                            isActive ? "bg-green-500" : isSelected ? "bg-white/40" : "bg-transparent group-hover:bg-primary/20"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">
                              {id === 'hero--generic' ? 'Standard Hero' : block.label || id}
                            </p>
                            <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                              {block.purpose || (id.includes('--') ? `${id.split('--')[1]} theme` : 'Multi-purpose')}
                            </p>
                          </div>
                          {isActive && <Check className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-primary"}`} />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Preview Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-muted/10 relative">
            {selectedId ? (
              <>
                <div className="flex-1 overflow-hidden p-6 flex flex-col">
                  <SectionLivePreviewPanel id={selectedId} className="flex-1 h-full" />
                </div>

                {/* Info & Action Bar */}
                <div className="shrink-0 px-8 py-5 border-t border-border bg-background/80 backdrop-blur-md flex items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <h3 className="text-base font-bold text-foreground">
                      {BLOCK_MAP[selectedId]?.label || selectedId}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {BLOCK_MAP[selectedId]?.purpose || "A professional layout designed to capture leads and showcase your brand."}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {currentHeroId === selectedId && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        Current Design
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleApply(selectedId)}
                      className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {currentHeroId === selectedId ? "Re-apply Theme" : "Apply This Design"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <Layout className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-sm font-medium">Select a design on the left to preview it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
