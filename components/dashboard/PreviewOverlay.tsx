"use client"

import * as React from "react"
import { Pencil, Trash2, ChevronUp, ChevronDown, Plus } from "lucide-react"

// Height of the fake browser chrome bar inside PreviewFrame (matches h-8 = 32px)
const CHROME_HEIGHT = 32

interface SectionRect {
  id: string
  index: number
  top: number
  height: number
}

interface PreviewOverlayProps {
  sectionRects: SectionRect[]
  activeSections: string[]
  activePreviewSection: string | null
  selectedSection: string | null
  setSelectedSection: (id: string | null) => void
  setActivePreviewSection: (id: string | null) => void
  lockPreviewHighlight: (id: string | null) => void
  scrollToSection: (id: string, index: number) => void
  removeSectionAtIndex: (index: number) => void
  moveToSectionIndex: (from: number, to: number) => void
  setAddSectionOpen: (open: boolean) => void
}

export function PreviewOverlay({
  sectionRects,
  activeSections,
  activePreviewSection,
  selectedSection,
  setSelectedSection,
  setActivePreviewSection,
  lockPreviewHighlight,
  scrollToSection,
  removeSectionAtIndex,
  moveToSectionIndex,
  setAddSectionOpen,
}: PreviewOverlayProps) {
  // Sort rects by their vertical position for correct gap detection
  const sorted = React.useMemo(
    () => [...sectionRects].sort((a, b) => a.top - b.top),
    [sectionRects]
  )

  const handleEdit = React.useCallback(
    (rect: SectionRect) => {
      setSelectedSection(rect.id)
      setActivePreviewSection(rect.id)
      lockPreviewHighlight(rect.id)
      scrollToSection(rect.id, rect.index)
    },
    [setSelectedSection, setActivePreviewSection, lockPreviewHighlight, scrollToSection]
  )

  const handleDelete = React.useCallback(
    (rect: SectionRect) => {
      removeSectionAtIndex(rect.index)
    },
    [removeSectionAtIndex]
  )

  if (sorted.length === 0) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
      aria-hidden
    >
      {sorted.map((rect, i) => {
        const isActive =
          rect.id === activePreviewSection || rect.id === selectedSection
        const top = CHROME_HEIGHT + rect.top
        const height = rect.height
        const isFirst = i === 0
        const isLast = i === sorted.length - 1

        // Toolbar clamps so it never hides under the chrome bar
        const toolbarTop = Math.max(CHROME_HEIGHT + 6, top + 6)

        return (
          <React.Fragment key={`${rect.id}-${rect.index}`}>
            {/* ── Section highlight outline ─────────────────────────── */}
            <div
              className={`absolute left-0 right-0 ${
                isActive
                  ? "border-2 border-primary"
                  : "border border-transparent"
              }`}
              style={{ top: Math.max(CHROME_HEIGHT, top), height: top < CHROME_HEIGHT ? Math.max(0, height - (CHROME_HEIGHT - top)) : height }}
            />

            {/* ── Floating toolbar (only on active section) ─────────── */}
            {isActive && (
              <div
                className="absolute right-3 flex items-center gap-1 pointer-events-auto"
                style={{ top: toolbarTop }}
              >
                {/* Glassmorphism toolbar card */}
                <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-background/85 backdrop-blur-md border border-border/60 shadow-xl">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(rect)}
                    title="Edit section"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/85 active:scale-95 transition-all duration-150 shadow-sm"
                  >
                    <Pencil className="w-3 h-3 shrink-0" />
                    Edit
                  </button>

                  <div className="w-px h-5 bg-border/60 mx-0.5" />

                  {/* Move up */}
                  {!isFirst && (
                    <button
                      onClick={() => moveToSectionIndex(rect.index, rect.index - 1)}
                      title="Move section up"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all duration-150"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Move down */}
                  {!isLast && (
                    <button
                      onClick={() => moveToSectionIndex(rect.index, rect.index + 1)}
                      title="Move section down"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all duration-150"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Separator before delete */}
                  {activeSections.length > 1 && (
                    <div className="w-px h-5 bg-border/60 mx-0.5" />
                  )}

                  {/* Delete — hidden if it's the only section */}
                  {activeSections.length > 1 && (
                    <button
                      onClick={() => handleDelete(rect)}
                      title="Remove section"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Add-section pill between adjacent sections ─────────── */}
            {!isLast && (
              <AddBetweenButton
                top={top + height}
                onAdd={() => setAddSectionOpen(true)}
              />
            )}
          </React.Fragment>
        )
      })}

      {/* ── Add-section button after the last section ─────────────────── */}
      {sorted.length > 0 && (
        <AddBetweenButton
          top={CHROME_HEIGHT + sorted[sorted.length - 1].top + sorted[sorted.length - 1].height}
          onAdd={() => setAddSectionOpen(true)}
          isLast
        />
      )}
    </div>
  )
}

// ── Small floating "+" button rendered in section gaps ────────────────────────
function AddBetweenButton({
  top,
  onAdd,
  isLast = false,
}: {
  top: number
  onAdd: () => void
  isLast?: boolean
}) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
      style={{ top }}
    >
      <button
        onClick={onAdd}
        title="Add section"
        className={`flex items-center gap-1 rounded-full font-semibold border shadow-md backdrop-blur-sm
          transition-all duration-200 hover:scale-110 active:scale-95
          ${
            isLast
              ? "px-3 py-1 text-[11px] bg-background/80 text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary opacity-60 hover:opacity-100"
              : "px-2 py-0.5 text-[10px] bg-background/80 text-muted-foreground border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary opacity-0 hover:opacity-100 focus:opacity-100"
          }`}
      >
        <Plus className={isLast ? "w-3.5 h-3.5" : "w-3 h-3"} />
        {isLast ? "Add Section" : "Add"}
      </button>
    </div>
  )
}
