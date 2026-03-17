"use client"

import * as React from "react"
import {
  Sparkles,
  Eye,
  Check,
  X,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Pencil,
  Crown,
  Code2,
  WandSparkles,
  Lock,
} from "lucide-react"
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

const CUSTOM_HTML_SECTION_ID = "custom-html"

type PromptSuggestion = {
  label: string
  prompt: string
  requires?: "pro" | "pro_plus"
}

const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    label: "Refresh Hero Copy",
    prompt:
      "Rewrite the hero title and subtitle to sound stronger and more local. Keep it concise and conversion-focused.",
  },
  {
    label: "Tidy Header & Menu",
    prompt:
      "Improve the header by updating the navigation labels to be clearer for this business and, if helpful, switch the header layout style (solid, floating, tubelight, or megamenu) to better fit a modern landing page.",
  },
  {
    label: "Add Trust + FAQ",
    prompt:
      "Add a trust badges section and an FAQ section, then update wording to improve lead conversion.",
  },
  {
    label: "Create Custom Section",
    prompt:
      "Create a custom-html section with 3 feature cards, a headline, and clean responsive CSS for mobile and desktop.",
    requires: "pro_plus",
  },
  {
    label: "Add Services Page",
    prompt:
      "Add a new services page with hero, features, FAQ, and contact sections. Match the current style.",
    requires: "pro",
  },
]

function touchesCustomHtmlSection(op: Operation): boolean {
  if (op.type === "reorder_sections") {
    return op.newOrder.includes(CUSTOM_HTML_SECTION_ID)
  }
  if (op.type === "update_global" || op.type === "add_page") {
    return false
  }
  return op.sectionKey === CUSTOM_HTML_SECTION_ID
}

interface AiEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  currentConfig: Record<string, any>
  onApplied: (newDraft: Record<string, any>) => void
  onPreview: (previewConfig: Record<string, any>) => void
  onPendingChange?: (hasPending: boolean) => void
  isPro?: boolean
  canUseCustomHtml?: boolean
}

interface ProposedChanges {
  summary: string
  operations: Operation[]
  warnings?: string[]
}

function operationIcon(op: Operation): string {
  switch (op.type) {
    case "add_section":
      return "+"
    case "remove_section":
      return "-"
    case "update_section":
      return "~"
    case "reorder_sections":
      return "<>"
    case "update_global":
      return "G"
    case "add_page":
      return "+"
    default:
      return "*"
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
      return `Update "${humanizeSection(op.sectionKey)}" - ${fields.slice(0, 3).join(", ")}${fields.length > 3 ? ` +${fields.length - 3} more` : ""}`
    }
    case "reorder_sections":
      return "Reorder sections"
    case "update_global": {
      const fields = Object.keys(op.changes).map(humanizeKey)
      return `Update site settings - ${fields.join(", ")}`
    }
    case "add_page":
      return `Add page: ${op.label} (/${op.slug})`
    default:
      return "Unknown operation"
  }
}

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
        const hasOld =
          oldVal !== undefined && oldVal !== null && String(oldVal).trim() !== "" && String(oldVal) !== String(newVal)
        const oldStr = hasOld ? String(oldVal) : null
        const newStr = String(newVal)
        return (
          <li key={field} className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60">
              {humanizeKey(field)}
            </span>
            {oldStr && (
              <span className="text-xs text-muted-foreground line-through leading-snug">
                {oldStr.length > 120 ? oldStr.slice(0, 120) + "..." : oldStr}
              </span>
            )}
            <span className="text-xs text-foreground leading-snug font-medium">
              {newStr.length > 120 ? newStr.slice(0, 120) + "..." : newStr}
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
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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
  canUseCustomHtml = false,
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
    if (!val && !proposed) reset()
    onOpenChange(val)
  }

  function getSuggestionLockReason(suggestion: PromptSuggestion): string | null {
    if (suggestion.requires === "pro_plus" && !canUseCustomHtml) {
      return "Requires Pro+"
    }
    if (suggestion.requires === "pro" && !isPro) {
      return "Requires Pro"
    }
    return null
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
        body: JSON.stringify({
          projectId,
          prompt: prompt.trim(),
          currentConfig,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = Array.isArray(data.details) && data.details[0] ? data.details[0] : data.error || "AI request failed."
        setError(msg)
        return
      }
      setSubmittedPrompt(prompt.trim())

      const hasLockedPage = !isPro && (data.operations as { type: string }[]).some((op) => op.type === "add_page")
      if (hasLockedPage) {
        setError(
          "This action requires a Pro plan. Adding new pages is only available on paid plans. Upgrade to continue, or rephrase your request to edit the existing page."
        )
        return
      }

      const hasLockedCustomHtml = !canUseCustomHtml && (data.operations as Operation[]).some((op) => touchesCustomHtmlSection(op))
      if (hasLockedCustomHtml) {
        setError(
          "This action requires Pro or higher. AI custom HTML sections are available on Pro, Ecommerce, and Custom plans."
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
    onPreview(currentConfig)
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
      // Sync current editor snapshot first so AI ops apply on the same base
      // the user previewed (including unsaved local changes).
      const syncRes = await fetch("/api/project-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, fullConfig: currentConfig }),
      })
      const syncData = await syncRes.json()
      if (!syncRes.ok) {
        toast.error(syncData.error || "Failed to sync current draft before applying AI changes.")
        return
      }

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
            onClick={() => {
              setMinimized(false)
              onOpenChange(true)
            }}
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
      <DialogContent className="sm:max-w-[920px] p-0 flex flex-col max-h-[90vh] overflow-hidden">
        <DialogHeader className="shrink-0 border-b border-border bg-muted/30 px-6 py-5">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <WandSparkles className="w-5 h-5 text-primary" />
                AI Site Editor
              </DialogTitle>
              <DialogDescription className="mt-1">
                Describe what to change. AI returns structured edits that you can preview and approve.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 font-semibold ${
                  isPro
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isPro ? "Pro Pages Enabled" : "Single Page Plan"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 font-semibold ${
                  canUseCustomHtml
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {canUseCustomHtml ? "Custom HTML Enabled" : "Custom HTML Locked"}
              </span>
            </div>
          </div>
        </DialogHeader>

        {!proposed && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 overflow-y-auto">
            <div className="rounded-xl border border-border bg-background px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Create Custom Sections Here</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Yes, this modal is where you can ask AI to build custom sections. Example prompt:
                    <span className="block mt-1 font-mono text-xs text-foreground/80">
                      "Create a custom-html section with 3 cards and responsive CSS."
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${
                    canUseCustomHtml
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}
                >
                  {canUseCustomHtml ? "Pro+ Active" : "Pro+ Required"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prompt Templates</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion) => {
                  const lockReason = getSuggestionLockReason(suggestion)
                  const isLocked = Boolean(lockReason)
                  return (
                    <button
                      key={suggestion.label}
                      type="button"
                      disabled={isLocked || loading}
                      onClick={() => setPrompt(suggestion.prompt)}
                      className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                        isLocked
                          ? "border-amber-200 bg-amber-50/60 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300 cursor-not-allowed"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                      title={lockReason ?? undefined}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{suggestion.label}</span>
                        {isLocked ? <Lock className="w-3.5 h-3.5 shrink-0" /> : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your Prompt
              </label>
              <textarea
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[140px]"
                placeholder='e.g. "Create a custom-html section for services with icon cards and a strong CTA."'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                maxLength={500}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{prompt.length}/500</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-4 py-3 flex flex-col gap-1.5">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Action blocked
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
                {error.includes("Pro") && (
                  <a
                    href="/pricing"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:opacity-80"
                  >
                    View upgrade options
                  </a>
                )}
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {proposed && (() => {
          const hasPageOp = proposed.operations.some((op) => op.type === "add_page")
          const hasLockedPageOp = !isPro && hasPageOp
          const hasLockedCustomOp = !canUseCustomHtml && proposed.operations.some((op) => touchesCustomHtmlSection(op))
          const hasGatedOp = hasLockedPageOp || hasLockedCustomOp

          return (
            <div className="flex flex-col min-h-0 flex-1 p-6">
              <div className="flex flex-col gap-4 overflow-y-auto min-h-0 flex-1 pr-1 pb-1">
                {submittedPrompt && (
                  <div className="flex items-start gap-2 rounded-lg border border-input bg-muted/40 px-3 py-2.5">
                    <span className="text-xs text-muted-foreground mt-0.5 shrink-0">Prompt:</span>
                    <span className="text-xs text-foreground/80 flex-1">{submittedPrompt}</span>
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

                <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
                  <p className="font-medium text-foreground mb-1">AI Summary</p>
                  <p className="text-muted-foreground">{proposed.summary}</p>
                </div>

                {hasLockedPageOp && (
                  <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 dark:border-amber-700 px-4 py-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 dark:bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Upgrade to unlock multi-page sites</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        The AI suggested adding a new page, but your current plan only supports single-page sites. Upgrade to a paid plan to apply this change.
                      </p>
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 mt-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        View Plans
                      </a>
                    </div>
                  </div>
                )}

                {hasLockedCustomOp && (
                  <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30 dark:border-amber-700 px-4 py-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 dark:bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Upgrade to Pro+ for AI custom HTML sections</p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        The AI suggested a custom HTML section. This feature is available on Pro, Ecommerce, and Custom plans.
                      </p>
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 mt-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        View Plans
                      </a>
                    </div>
                  </div>
                )}

                {proposed.warnings && proposed.warnings.length > 0 && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-300 flex flex-col gap-1">
                    <p className="font-medium flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Some operations were adjusted
                    </p>
                    {proposed.warnings.map((w, i) => (
                      <p key={i} className="text-xs">- {w}</p>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground mb-1">Proposed Changes ({proposed.operations.length})</p>
                  <ul className="flex flex-col gap-2">
                    {proposed.operations.map((op, i) => {
                      const isLockedPage = !isPro && op.type === "add_page"
                      const isLockedCustom = !canUseCustomHtml && touchesCustomHtmlSection(op)
                      const isLocked = isLockedPage || isLockedCustom

                      return (
                        <li
                          key={i}
                          className={`rounded-md border bg-background px-3 py-2 ${
                            isLocked ? "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 opacity-75" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-5 rounded text-[10px] font-bold shrink-0 ${
                                isLocked
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                                  : operationBadgeClass(op)
                              }`}
                            >
                              {isLocked ? <Crown className="w-3 h-3" /> : operationIcon(op)}
                            </span>
                            <span className={`flex-1 ${isLocked ? "text-amber-700 dark:text-amber-400" : "text-foreground/90"}`}>
                              {operationLabel(op)}
                            </span>
                            {isLocked && (
                              <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded shrink-0">
                                {isLockedCustom ? "Pro+" : "Pro"}
                              </span>
                            )}
                          </div>
                          {!isLocked && <OperationDetail op={op} currentConfig={currentConfig} />}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 mt-1 border-t border-border shrink-0 flex-wrap bg-background">
                <button
                  onClick={handlePreview}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  title={hasGatedOp ? "Some changes require an upgraded plan and may be skipped" : undefined}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Apply
                </button>
                <button
                  onClick={handleReject}
                  disabled={applying}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-destructive text-destructive px-3 py-2 text-sm font-medium hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={handleEditPrompt}
                  disabled={applying}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50 transition-colors"
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

