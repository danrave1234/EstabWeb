"use client"
import * as React from "react"
import { Sparkles, Check, X, AlertTriangle, Loader2, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { toast } from "sonner"

interface SeoVariant {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  og?: {
    title?: string
    description?: string
    image?: string
  }
  robots?: {
    noindex?: boolean
    nofollow?: boolean
  }
  structuredData?: {
    enabled?: boolean
    type?: "localbusiness" | "faq" | "article"
  }
}

interface AiSeoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  pageIndex: number
  businessType: string
  currentSeo: { title: string; description: string; keywords?: string[] }
  /** Called with the chosen variant when user clicks Apply */
  onApplied: (variant: SeoVariant) => void
}

export function AiSeoModal({
  open,
  onOpenChange,
  projectId,
  pageIndex,
  businessType,
  currentSeo,
  onApplied,
}: AiSeoModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [variants, setVariants] = React.useState<SeoVariant[]>([])
  const [selected, setSelected] = React.useState<number | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  function reset() {
    setLoading(false)
    setVariants([])
    setSelected(null)
    setError(null)
  }

  function handleClose(val: boolean) {
    if (!val) reset()
    onOpenChange(val)
  }

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setVariants([])
    setSelected(null)
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          pageIndex,
          businessType,
          currentContent: {
            title: currentSeo?.title || "",
            description: currentSeo?.description || "",
            keywords: currentSeo?.keywords || [],
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "AI request failed.")
      const rawVariants: any[] =
        Array.isArray(data.variants) && data.variants.length > 0
          ? data.variants
          : data.title
            ? [data]
            : []
      const result: SeoVariant[] = rawVariants
        .map((variant) => ({
          title: typeof variant?.title === "string" ? variant.title : "",
          description: typeof variant?.description === "string" ? variant.description : "",
          keywords: Array.isArray(variant?.keywords) ? variant.keywords.filter((k: unknown) => typeof k === "string") : [],
          canonical: typeof variant?.canonical === "string" ? variant.canonical : undefined,
          og: variant?.og && typeof variant.og === "object" ? variant.og : undefined,
          robots: variant?.robots && typeof variant.robots === "object" ? variant.robots : undefined,
          structuredData: variant?.structuredData && typeof variant.structuredData === "object" ? variant.structuredData : undefined,
        }))
        .filter((variant) => variant.title && variant.description)
      if (result.length === 0) throw new Error("No suggestions returned.")
      setVariants(result)
    } catch (e: any) {
      setError(e?.message || "AI optimization failed.")
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (selected === null || !variants[selected]) return
    const v = variants[selected]
    onApplied(v)
    toast.success("AI SEO suggestion applied!")
    handleClose(false)
  }

  function handleReject() {
    reset()
  }

  const hasVariants = variants.length > 0
  const canApply = selected !== null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[620px] flex flex-col max-h-[90vh] p-0 gap-0 overflow-hidden border-border/60 shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)] rounded-2xl">
        {/* Premium header */}
        <div className="relative overflow-hidden shrink-0 bg-gradient-to-br from-background via-background to-muted/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-primary/3 to-transparent" aria-hidden />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" aria-hidden />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-primary/70 to-transparent" aria-hidden />
          <DialogHeader className="relative p-5 sm:p-6 shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em]">AI Tools</span>
                </div>
                <span className="text-base font-black tracking-tight">AI SEO Optimizer</span>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-1.5 ml-12 text-[11px] text-muted-foreground">
              Generate optimized SEO suggestions for title, description, keywords, and sharing metadata.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar bg-muted/5">
          {/* Current SEO preview */}
          <div className="rounded-md border border-border bg-muted/30 px-4 py-3 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current SEO</p>
            <p className="text-sm font-medium text-foreground leading-snug">
              {currentSeo?.title || <span className="italic text-muted-foreground">No title set</span>}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentSeo?.description || <span className="italic">No description set</span>}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-3 py-2.5 flex flex-col gap-1">
              <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Something went wrong
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">{error}</p>
            </div>
          )}

          {/* Variants */}
          {hasVariants && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                AI Suggestions — pick one ({variants.length})
              </p>
              <ul className="flex flex-col gap-2">
                {variants.map((v, i) => {
                  const isSelected = selected === i
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        className={`w-full text-left rounded-md border px-3 py-3 transition-all space-y-1.5 ${isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">
                            Option {i + 1}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                              <Check className="w-3 h-3" /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground leading-snug">{v.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{v.description}</p>
                        <div className="flex items-center gap-3 pt-0.5">
                          <span className={`text-[10px] font-bold tabular-nums ${v.title.length > 60 ? "text-red-500" : v.title.length >= 30 ? "text-emerald-500" : "text-muted-foreground"}`}>
                            Title: {v.title.length}/60
                          </span>
                          <span className={`text-[10px] font-bold tabular-nums ${v.description.length > 155 ? "text-red-500" : v.description.length >= 70 ? "text-emerald-500" : "text-muted-foreground"}`}>
                            Desc: {v.description.length}/155
                          </span>
                        </div>
                        {v.keywords && v.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {v.keywords.map((kw, ki) => (
                              <span key={ki} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">{kw}</span>
                            ))}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {v.canonical && (
                            <span className="text-[10px] text-muted-foreground">
                              Canonical: <span className="font-semibold text-foreground">{v.canonical}</span>
                            </span>
                          )}
                          {v.structuredData?.type && (
                            <span className="text-[10px] text-muted-foreground">
                              Schema: <span className="font-semibold text-foreground">{v.structuredData.type}</span>
                            </span>
                          )}
                          {v.robots && (
                            <span className="text-[10px] text-muted-foreground">
                              Robots:{" "}
                              <span className="font-semibold text-foreground">
                                {v.robots.noindex ? "noindex" : "index"}, {v.robots.nofollow ? "nofollow" : "follow"}
                              </span>
                            </span>
                          )}
                          {v.og?.title && (
                            <span className="text-[10px] text-muted-foreground truncate">
                              OG: <span className="font-semibold text-foreground">{v.og.title}</span>
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Action buttons — pinned at bottom */}
        <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-t border-border/60 bg-background shrink-0 flex-wrap">
          {!hasVariants ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Suggestions
                </>
              )}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleApply}
                disabled={!canApply}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20"
              >
                <Check className="w-3.5 h-3.5" />
                Apply
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 text-destructive px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 active:scale-95 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-muted active:scale-95 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                Try Again
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
