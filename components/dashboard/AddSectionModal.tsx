"use client"

import * as React from "react"
import { Layout, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { SECTION_CATEGORIES } from "@/lib/utils/block-registry"
import { SectionLivePreview } from "@/components/dashboard/SectionLivePreview"

interface AddSectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeSections: string[]
  addSection: (id: string) => void
}

export function AddSectionModal({ open, onOpenChange, activeSections, addSection }: AddSectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b border-border bg-muted/10">
          <DialogTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
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
                  if (id === "hero") return null
                  const isAdded = activeSections.includes(id)
                  return (
                    <div
                      key={id}
                      role="button"
                      tabIndex={isAdded ? -1 : 0}
                      aria-disabled={isAdded}
                      onClick={() => {
                        if (isAdded) return
                        addSection(id)
                      }}
                      onKeyDown={(e) => {
                        if (isAdded) return
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          addSection(id)
                        }
                      }}
                      className={`group relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${isAdded ? "bg-muted/50 border-border opacity-60 cursor-not-allowed" : "bg-background border-border hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isAdded ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                        <Plus className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate leading-tight capitalize">{id.replace(/-/g, " ")}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{isAdded ? "Already on page" : "Click to add"}</p>
                        {!isAdded && <SectionLivePreview id={id} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-muted/5 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
