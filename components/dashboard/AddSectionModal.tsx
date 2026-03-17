"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import * as LucideIcons from "lucide-react"
import { Layout, ChevronRight, ChevronLeft, X, Check } from "lucide-react"
import { SECTION_TYPE_GROUPS, BLOCK_MAP, type SectionTypeGroup } from "@/lib/utils/block-registry"
import {
  prefetchSectionPreview,
  SectionLivePreviewPanel,
} from "@/components/dashboard/SectionLivePreview"

interface AddSectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeSections: string[]
  addSection: (id: string) => void
  isProOrHigher: boolean
}

function SectionTypeIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (!Icon) return <Layout className={className} />
  return <Icon className={className} />
}

export function AddSectionModal({ open, onOpenChange, activeSections, addSection, isProOrHigher }: AddSectionModalProps) {
  const [selectedType, setSelectedType] = React.useState<SectionTypeGroup | null>(null)
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null)
  const backdropPointerDownRef = React.useRef(false)

  const isVariantAllowed = React.useCallback((id: string) => {
    if (id === "custom-html" && !isProOrHigher) return false
    return true
  }, [isProOrHigher])

  const availableTypeGroups = React.useMemo(
    () =>
      SECTION_TYPE_GROUPS
        .map((group) => ({
          ...group,
          variantIds: group.variantIds.filter(isVariantAllowed),
        }))
        .filter((group) => group.variantIds.length > 0),
    [isVariantAllowed]
  )

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setSelectedType(null)
      setSelectedVariantId(null)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Auto-select first variant when type changes
  React.useEffect(() => {
    if (!selectedType) {
      setSelectedVariantId(null)
      return
    }
    const firstId = selectedType.variantIds.find((id) => BLOCK_MAP[id] && isVariantAllowed(id))
    setSelectedVariantId(firstId ?? null)
    // Prefetch all variants for this type
    selectedType.variantIds.filter((id) => isVariantAllowed(id)).forEach((id) => prefetchSectionPreview(id))
  }, [selectedType, isVariantAllowed])

  const handleAdd = (id: string) => {
    addSection(id)
    onOpenChange(false)
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) backdropPointerDownRef.current = true
        else backdropPointerDownRef.current = false
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && backdropPointerDownRef.current) onOpenChange(false)
        backdropPointerDownRef.current = false
      }}
    >
      <div className="w-[90vw] h-[90vh] max-w-[1600px] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/10 shrink-0">
          <div className="flex items-center gap-3">
            {selectedType ? (
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Back to section types"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Layout className="w-5 h-5 text-primary" />
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-base text-foreground">Add New Section</span>
              {selectedType && (
                <>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <SectionTypeIcon name={selectedType.icon} className="w-4 h-4" />
                    {selectedType.label}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!selectedType && (
              <p className="text-xs text-muted-foreground hidden sm:block">
                Choose a section type, then pick a variant.
              </p>
            )}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Step 1: Section type list */}
          {!selectedType && (
            <div className="w-full overflow-y-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-5xl mx-auto">
                {availableTypeGroups.map((group) => {
                  const addedCount = group.variantIds.filter((id) => activeSections.includes(id)).length
                  const totalVariants = group.variantIds.length
                  return (
                    <button
                      key={group.type}
                      type="button"
                      onClick={() => setSelectedType(group)}
                      className="flex flex-col items-center gap-3 p-5 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all text-center group"
                    >
                      <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <SectionTypeIcon name={group.icon} className="w-6 h-6" />
                      </span>
                      <div>
                        <p className="text-sm font-bold leading-tight">{group.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {totalVariants} variant{totalVariants !== 1 ? "s" : ""}
                          {addedCount > 0 && (
                            <span className="ml-1 text-primary font-semibold">· {addedCount} on page</span>
                          )}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Left variant list + Right live preview */}
          {selectedType && (
            <>
              {/* Left: variant list (30%) */}
              <div className="w-[30%] min-w-[220px] max-w-[320px] border-r border-border overflow-y-auto p-4 shrink-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  Variants
                </p>
                <div className="space-y-1.5">
                  {selectedType.variantIds.map((id) => {
                    if (!isVariantAllowed(id)) return null
                    const block = BLOCK_MAP[id]
                    if (!block) return null
                    const isAdded = activeSections.includes(id)
                    const isSelected = selectedVariantId === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedVariantId(id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${isSelected
                          ? "bg-primary text-white"
                          : isAdded
                            ? "bg-muted/40 text-muted-foreground"
                            : "hover:bg-muted/60 text-foreground"
                          }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-white/20 text-white"
                            : isAdded
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary"
                            }`}
                        >
                          <SectionTypeIcon name={selectedType.icon} className="w-3.5 h-3.5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">{block.label}</p>
                          <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                            {isAdded ? "Already on page" : (block.purpose ?? block.variant ?? id)}
                          </p>
                        </div>
                        {isAdded && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right: live preview (70%) */}
              <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
                {selectedVariantId ? (
                  <>
                    {/* Preview area */}
                    <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
                      <SectionLivePreviewPanel id={selectedVariantId} />
                    </div>

                    {/* Add button bar */}
                    <div className="shrink-0 px-6 py-4 border-t border-border bg-background/80 flex items-center justify-between gap-4">
                      <div>
                        {(() => {
                          const block = BLOCK_MAP[selectedVariantId]
                          const isAdded = activeSections.includes(selectedVariantId)
                          return (
                            <>
                              <p className="text-sm font-bold">{block?.label ?? selectedVariantId}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {isAdded ? "Already added to this page" : `variant: ${block?.variant ?? selectedVariantId}`}
                              </p>
                            </>
                          )
                        })()}
                      </div>
                      <button
                        type="button"
                        disabled={activeSections.includes(selectedVariantId)}
                        onClick={() => handleAdd(selectedVariantId)}
                        className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        {activeSections.includes(selectedVariantId) ? "Already Added" : "Add Section"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    Select a variant to preview
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
