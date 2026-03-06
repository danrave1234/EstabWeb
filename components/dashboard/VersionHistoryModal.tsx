"use client"

import * as React from "react"
import { History, RotateCcw, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

interface SiteVersion {
  id: string
  version: number
  createdAt: string
  isCurrent: boolean
}

interface VersionHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  versions: SiteVersion[]
  versionsLoading: boolean
  rollbackLoading: number | null
  onRestore: (version: number) => Promise<void>
}

export function VersionHistoryModal({
  open,
  onOpenChange,
  versions,
  versionsLoading,
  rollbackLoading,
  onRestore,
}: VersionHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-border/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)] rounded-2xl">
        {/* Premium header */}
        <div className="relative overflow-hidden shrink-0 bg-gradient-to-br from-background via-background to-muted/30">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/6 via-amber-500/3 to-transparent" aria-hidden />
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" aria-hidden />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-500 via-amber-500/70 to-transparent" aria-hidden />
          <DialogHeader className="relative p-5 sm:p-6">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex items-center justify-center shrink-0">
                <History className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em]">Advanced</span>
                </div>
                <span className="text-base font-black tracking-tight">Version History</span>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-1.5 ml-12 text-[11px] text-muted-foreground">
              Restore your site to a previous working state if something went wrong.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-muted/5">
          {versionsLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              <span className="text-sm">Loading history…</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">No version history yet.</p>
              <p className="text-[11px] text-muted-foreground/60">Publish changes to create restore points.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className={`flex items-center justify-between gap-4 py-3 px-4 rounded-xl border transition-all ${v.isCurrent ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/60 bg-background hover:border-border'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black tracking-tight">Version {v.version}</span>
                      {v.isCurrent && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md">Current</span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-0.5 block">
                      {new Date(v.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!v.isCurrent && (
                    <button
                      onClick={() => onRestore(v.version)}
                      disabled={rollbackLoading !== null}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3 h-3 ${rollbackLoading === v.version ? 'animate-spin' : ''}`} />
                      {rollbackLoading === v.version ? "Restoring…" : "Restore"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
