"use client"
import * as React from "react"
import { Sparkles, Eye, Check, X, AlertTriangle, Loader2, ArrowLeft, Pencil, Crown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { toast } from "sonner"
import type { Operation } from "@/lib/utils/applyOperations"
import { applyOperations, resolveConfigProp } from "@/lib/utils/applyOperations"

interface AiEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  currentConfig: Record<string, any>
  /** Called with the new draft config after user clicks Apply */
  onApplied: (newDraft: Record<string, any>) => void
  /** Called with a preview config clone when user clicks Preview */
  onPreview: (previewConfig: Record<string, any>) => void
  /** Called whenever pending proposed changes exist or are cleared */
  onPendingChange?: (hasPending: boolean) => void
  /** Whether the project is on a paid plan */
  isPro?: boolean
}

interface ProposedChanges {
  summary: string
  operations: Operation[]
  warnings?: string[]
}

function operationIcon(op: Operation): string {
  switch (op.type) {
    case "add_section": return "+"
    case "remove_section": return "−"
    case "update_section": return "✎"
    case "reorder_sections": return "⇅"
    case "update_global": return "⚙"
    case "add_page": return "+"
    default: return "•"
  }
}

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function humanizeSection(key: string): string {
  return key
    .replace(/[-_]/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function operationLabel(op: Operation): string {
  switch (op.type) {
    case "add_section":
      return `Add "${humanizeSection(op.sectionKey)}"${op.position !== undefined ? ` at position ${op.position + 1}` : ""}`
    case "remove_section":
      return `Remove "${humanizeSection(op.sectionKey)}"`
    case "update_section": {
      const fields = Object.keys(op.changes).map(humanizeKey)
      return `Update "${humanizeSection(op.sectionKey)}" — ${fields.slice(0, 3).join(", ")}${fields.length > 3 ? ` +${fields.length - 3} more` : ""}`
    }
    case "reorder_sections":
      return `Reorder sections`
    case "update_global": {
      const fields = Object.keys(op.changes).map(humanizeKey)
      return `Update site settings — ${fields.join(", ")}`
    }
    case "add_page":
      return `Add page: ${op.label} (/${op.slug})`
    default:
      return "Unknown operation"
  }
}

/** Show field-level diff for update_section and update_global ops */
function OperationDetail({
  op,
  currentConfig,
}: {
  op: Operation
  currentConfig: Record<string, any>
}) {
  if (op.type !== "update_section" && op.type !== "update_global") return null

  const source =
    op.type === "update_section"
      ? (currentConfig[resolveConfigProp(op.sectionKey)] ?? currentConfig[op.sectionKey] ?? {})
      : currentConfig

  const entries = Object.entries(op.changes).filter(
    ([, v]) => typeof v === "string" || typeof v === "number" || typeof v === "boolean"
  )
  if (entries.length === 0) return null

  return (
    <ul className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-2">
      {entries.map(([field, newVal]) => {
        const oldVal = source[field]
        const hasOld = oldVal !== undefined && oldVal !== null && String(oldVal).trim() !== "" && String(oldVal) !== String(newVal)
        const oldStr = hasOld ? String(oldVal) : null
        const newStr = String(newVal)
        return (
          <li key={field} className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60">
              {humanizeKey(field)}
            </span>
            {oldStr && (
              <span className="text-xs text-muted-foreground line-through leading-snug">
                {oldStr.length > 120 ? oldStr.slice(0, 120) + "…" : oldStr}
              </span>
            )}
            <span className="text-xs text-foreground leading-snug font-medium">
              {newStr.length > 120 ? newStr.slice(0, 120) + "…" : newStr}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function operationBadgeClass(op: Operation): string {
  switch (op.type) {
    case "add_section":
    case "add_page":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
    case "remove_section":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
    case "update_section":
    case "update_global":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
    case "reorder_sections":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function AiEditorModal({
  open,
  onOpenChange,
  projectId,
  currentConfig,
  onApplied,
  onPreview,
  onPendingChange,
  isPro = false,
}: AiEditorModalProps) {
  const [prompt, setPrompt] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [applying, setApplying] = React.useState(false)
  const [proposed, setProposed] = React.useState<ProposedChanges | null>(null)
  const [submittedPrompt, setSubmittedPrompt] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [minimized, setMinimized] = React.useState(false)

  function reset() {
    setPrompt("")
    setSubmittedPrompt("")
    setProposed(null)
    setError(null)
    setLoading(false)
    setApplying(false)
    setMinimized(false)
    onPendingChange?.(false)
  }

  function handleClose(val: boolean) {
    // Don't wipe proposed changes when closing — user may reopen to Apply/Preview
    if (!val && !proposed) reset()
    onOpenChange(val)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setProposed(null)

    try {
      const res = await fetch("/api/ai/editor-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, prompt: prompt.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Prefer the first detail message (e.g. plan-limit explanation) over the generic error
        const msg = (Array.isArray(data.details) && data.details[0]) ? data.details[0] : (data.error || "AI request failed.")
        setError(msg)
        return
      }
      setSubmittedPrompt(prompt.trim())

      // If the user is on free plan and the AI proposed an add_page operation,
      // the entire intent is blocked — reject the whole response rather than
      // silently applying partial/unrelated operations.
      const hasLockedPage = !isPro && (data.operations as { type: string }[]).some(
        (op) => op.type === "add_page"
      )
      if (hasLockedPage) {
        setError(
          "This action requires a Pro plan. Adding new pages is only available on paid plans. Upgrade to continue, or rephrase your request to edit the existing page."
        )
        return
      }

      const incoming = {
        summary: data.summary,
        operations: data.operations,
        warnings: data.warnings,
      }
      setProposed(incoming)
      onPendingChange?.(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleEditPrompt() {
    setProposed(null)
    setError(null)
    setMinimized(false)
    onPendingChange?.(false)
    // Restore original config in preview iframe
    onPreview(currentConfig)
    // Keep the prompt text so user can refine it
  }

  function handlePreview() {
    if (!proposed) return
    const previewConfig = applyOperations(currentConfig, proposed.operations)
    onPreview(previewConfig)
    setMinimized(true)
  }

  async function handleApply() {
    if (!proposed) return
    setApplying(true)
    try {
      const res = await fetch("/api/project-config/apply-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, operations: proposed.operations }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to apply changes.")
        return
      }
      toast.success("AI changes applied to draft!")
      onApplied(data.draft)
      reset()
      onOpenChange(false)
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setApplying(false)
    }
  }

  function handleReject() {
    onPreview(currentConfig)
    setMinimized(false)
    onPendingChange?.(false)
    reset()
  }

  if (minimized && proposed) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl border border-border bg-background/95 backdrop-blur shadow-lg px-4 py-2.5 text-sm">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <span className="text-foreground font-medium mr-1">AI Preview active</span>
        <span className="text-muted-foreground text-xs hidden sm:inline">
          {proposed.operations.length} change{proposed.operations.length !== 1 ? "s" : ""} pending
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={() => { setMinimized(false); onOpenChange(true) }}
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Expand
          </button>
          <button
            onClick={handleApply}
            disabled={applying}
            className="inline-flex items-center gap-1 rounded-md bg-primary text-primary-foreground px-2.5 py-1 text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Apply
          </button>
          <button
            onClick={handleReject}
            disabled={applying}
            className="inline-flex items-center gap-1 rounded-md border border-destructive text-destructive px-2.5 py-1 text-xs font-medium hover:bg-destructive/10 disabled:opacity-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Site Editor
          </DialogTitle>
          <DialogDescription>
            Describe what you want to change. AI will propose structured edits for your approval.
          </DialogDescription>
        </DialogHeader>

        {/* Prompt input — shown when no proposed changes yet */}
        {!proposed && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[90px]"
              placeholder='e.g. "Add a pricing table and make this site look more premium and modern."'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{prompt.length}/500</span>
            </div>
            {error && (
              <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-3 py-2.5 flex flex-col gap-1">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Action blocked
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
                {!isPro && error.includes("Pro plan") && (
                  <a
                    href="/pricing"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:opacity-80"
                  >
                    View upgrade options →
                  </a>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Changes
                </>
              )}
            </button>
          </form>
        )}

        {/* Proposed changes panel */}
        {proposed && (() => {
          const hasPageOp = proposed.operations.some(op => op.type === "add_page")
          const hasProGatedOp = !isPro && hasPageOp
          return (
          <div className="flex flex-col min-h-0 flex-1 mt-2">
            <div className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 pr-1 pb-1">
            {/* Submitted prompt context */}
            {submittedPrompt && (
              <div className="flex items-start gap-2 rounded-md border border-input bg-muted/40 px-3 py-2">
                <span className="text-xs text-muted-foreground mt-0.5 shrink-0">Prompt:</span>
                <span className="text-xs text-foreground/80 flex-1 line-clamp-2">{submittedPrompt}</span>
                <button
                  onClick={handleEditPrompt}
                  className="shrink-0 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  title="Edit prompt"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-md bg-muted px-4 py-3 text-sm">
              <p className="font-medium text-foreground mb-1">AI Summary</p>
              <p className="text-muted-foreground">{proposed.summary}</p>
            </div>

            {/* Upgrade banner — shown when free plan and AI proposed a gated feature */}
            {hasProGatedOp && (
              <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 dark:border-amber-700 px-4 py-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400 dark:bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Upgrade to unlock multi-page sites</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">The AI suggested adding a new page, but your current plan only supports single-page sites. Upgrade to a paid plan to apply this change.</p>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 mt-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    View Plans
                  </a>
                </div>
              </div>
            )}

            {/* Warnings */}
            {proposed.warnings && proposed.warnings.length > 0 && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300 flex flex-col gap-1">
                <p className="font-medium flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Some operations were adjusted
                </p>
                {proposed.warnings.map((w, i) => (
                  <p key={i} className="text-xs">• {w}</p>
                ))}
              </div>
            )}

            {/* Operations list with field-level diff */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Proposed Changes ({proposed.operations.length})
              </p>
              <ul className="flex flex-col gap-2">
                {proposed.operations.map((op, i) => {
                  const isLocked = !isPro && op.type === "add_page"
                  return (
                  <li
                    key={i}
                    className={`rounded-md border bg-background px-3 py-2 ${isLocked ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 opacity-75" : "border-border"}`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold shrink-0 ${isLocked ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" : operationBadgeClass(op)}`}
                      >
                        {isLocked ? <Crown className="w-3 h-3" /> : operationIcon(op)}
                      </span>
                      <span className={`flex-1 ${isLocked ? "text-amber-700 dark:text-amber-400" : "text-foreground/90"}`}>{operationLabel(op)}</span>
                      {isLocked && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded shrink-0">Pro</span>
                      )}
                    </div>
                    {!isLocked && <OperationDetail op={op} currentConfig={currentConfig} />}
                  </li>
                )})}
              </ul>
            </div>

            </div>
            {/* Action buttons — pinned at bottom */}
            <div className="flex items-center gap-2 pt-3 mt-1 border-t border-border shrink-0 flex-wrap">
              <button
                onClick={handlePreview}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                title={hasProGatedOp ? "Some changes require a paid plan and will be skipped" : undefined}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Apply
              </button>
              <button
                onClick={handleReject}
                disabled={applying}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive text-destructive px-3 py-2 text-sm font-medium hover:bg-destructive/10 disabled:opacity-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={handleEditPrompt}
                disabled={applying}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
          )
        })()}
      </DialogContent>
    </Dialog>
  )
}
