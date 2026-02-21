"use client"

import * as React from "react"
import { History, RotateCcw } from "lucide-react"
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
                      onClick={() => onRestore(v.version)}
                      disabled={rollbackLoading !== null}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
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
