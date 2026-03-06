"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Check, X, MessageSquare, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { processChangeRequest } from "@/app/actions/admin"
import { RenderValue } from "@/components/admin/RenderValue"
import Link from "next/link"

interface RequestReviewClientProps {
  request: any
}

export default function RequestReviewClient({ request }: RequestReviewClientProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [adminNote, setAdminNote] = React.useState("")
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const leftRef = React.useRef<HTMLDivElement>(null)
  const rightRef = React.useRef<HTMLDivElement>(null)
  const isScrolling = React.useRef<boolean>(false)

  const handleScroll = (source: 'left' | 'right') => {
    if (isScrolling.current) return

    isScrolling.current = true
    const sourceRef = source === 'left' ? leftRef : rightRef
    const targetRef = source === 'left' ? rightRef : leftRef

    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop
    }

    // Use requestAnimationFrame to reset the flag after the scroll has been applied
    requestAnimationFrame(() => {
      isScrolling.current = false
    })
  }

  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    if (action === 'rejected' && !showRejectForm) {
      setShowRejectForm(true)
      return
    }

    setIsProcessing(true)
    try {
      const result = await processChangeRequest(requestId, action, adminNote)

      if (result.error) throw new Error(result.error)

      toast.success(`Request ${action} successfully`)
      router.push('/admin/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} request`)
    } finally {
      setIsProcessing(false)
    }
  }

  const sectionId = request.section_id
  const sectionKey = sectionId === 'hero-emergency' ? 'heroEmergency' : 
                     sectionId === 'practice-areas' ? 'practiceAreas' :
                     sectionId === 'attorney-profile' ? 'attorneyProfile' :
                     sectionId === 'free-consultation' ? 'freeConsultation' :
                     sectionId === 'how-it-works' ? 'howItWorks' :
                     sectionId === 'review-trust-bar' ? 'reviewTrustBar' :
                     sectionId === 'feature-highlight' ? 'featureHighlight' :
                     sectionId === 'team-carousel' ? 'teamCarousel' :
                     sectionId === 'patient-faq' ? 'patientFaq' :
                     sectionId === 'pricing' ? 'pricingTable' :
                     sectionId === 'awards' ? 'awardsStrip' :
                     sectionId;

  const currentSectionData = sectionId === 'full-site' 
    ? (request.projects?.current_config || {})
    : (request.projects?.current_config?.[sectionKey] || {})

  const requestedChanges = request.requested_changes || {}

  // Build a flat list of diff entries, extracting SEO from pages[0].seo for full-site requests
  const diffEntries: { key: string; label: string; currentVal: any; requestedVal: any }[] = []
  const skipKeys = new Set<string>()

  if (sectionId === 'full-site') {
    const currentPages: any[] = Array.isArray(currentSectionData.pages) ? currentSectionData.pages : []
    const requestedPages: any[] = Array.isArray((requestedChanges as any).pages) ? (requestedChanges as any).pages : []
    const currentSeo = currentPages[0]?.seo ?? null
    const requestedSeo = requestedPages[0]?.seo ?? null
    diffEntries.push({ key: '__seo__', label: 'SEO', currentVal: currentSeo, requestedVal: requestedSeo })
    skipKeys.add('pages')
  }

  Object.entries(requestedChanges).forEach(([key, val]) => {
    if (skipKeys.has(key)) return
    diffEntries.push({ key, label: key, currentVal: currentSectionData[key], requestedVal: val })
  })

  const isDiffChanged = (entry: typeof diffEntries[0]) =>
    JSON.stringify(entry.currentVal) !== JSON.stringify(entry.requestedVal)

  const changedEntries = diffEntries.filter(isDiffChanged)

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard" 
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Review Request: {request.projects?.name}</h1>
            <p className="text-xs text-muted-foreground">
              {request.profiles?.email} • {mounted ? format(new Date(request.created_at), 'MMM d, yyyy HH:mm') : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(request.id, 'rejected')}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleAction(request.id, 'rejected')}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-bold transition-all"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
              <button
                onClick={() => handleAction(request.id, 'approved')}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
              >
                {isProcessing ? 'Approving...' : (
                  <>
                    <Check className="w-4 h-4" />
                    Approve & Go Live
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {showRejectForm && (
          <div className="p-6 bg-red-50/50 border-b border-red-100 shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">
              <label className="text-sm font-bold text-red-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Reason for Rejection (Optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Please provide a higher quality image or check the spelling."
                className="w-full min-h-[80px] p-3 text-sm border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-card text-foreground"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Diff View */}
        <div className="flex-1 flex min-h-0">
          {/* Left Pane - Current */}
          <div 
            ref={leftRef}
            onScroll={() => handleScroll('left')}
            className="flex-1 overflow-y-auto border-r border-border p-8"
          >
            <div className="max-w-2xl ml-auto w-full">
              <div className="sticky top-0 bg-background/95 backdrop-blur py-2 mb-6 border-b border-border z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Current Live Content
                </span>
              </div>
              <div className="space-y-8">
                {changedEntries.map((entry) => (
                  <div key={entry.key} className="space-y-2 group">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground transition-colors group-hover:text-foreground">
                      {entry.label}
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50 text-sm line-through opacity-60">
                      <RenderValue value={entry.currentVal} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pane - Requested */}
          <div 
            ref={rightRef}
            onScroll={() => handleScroll('right')}
            className="flex-1 overflow-y-auto p-8 bg-primary/5"
          >
            <div className="max-w-2xl mr-auto w-full">
              <div className="sticky top-0 bg-primary/5 backdrop-blur py-2 mb-6 border-b border-primary/10 z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Requested Changes
                </span>
              </div>
              <div className="space-y-8">
                {changedEntries.map((entry) => (
                  <div key={entry.key} className="space-y-2 group">
                    <div className="text-[10px] font-bold uppercase text-primary/60 transition-colors group-hover:text-primary">
                      {entry.label}
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-primary/20 shadow-sm text-sm font-medium">
                      <RenderValue value={entry.requestedVal} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
