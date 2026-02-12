"use client"

import * as React from "react"
import { ChevronRight, FileText, Settings, Eye, Layout, Send, Key } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import ImageUpload from "@/components/shared/ImageUpload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import MainHeader from "@/components/shared/MainHeader"

function deepMerge(a: any, b: any): any {
  const out: any = Array.isArray(a) ? [...a] : { ...a }
  if (!b || typeof b !== 'object') return out
  for (const k of Object.keys(b)) {
    const av = (a as any)?.[k]
    const bv = (b as any)[k]
    if (av && bv && typeof av === 'object' && typeof bv === 'object' && !Array.isArray(av) && !Array.isArray(bv)) {
      out[k] = deepMerge(av, bv)
    } else {
      out[k] = bv
    }
  }
  return out
}

interface DashboardClientProps {
  project: any
  user: any
}

export default function ClientDashboardPreview({ project, user }: DashboardClientProps) {
  const LOCAL_KEY = `ew_local_draft_${project.id}`
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null)
  const [formValues, setFormValues] = React.useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isQueueing, setIsQueueing] = React.useState(false)
  const [redeemCode, setRedeemCode] = React.useState("")
  const [isRedeeming, setIsRedeeming] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [modified, setModified] = React.useState<Record<string, any>>({})
  const [hasPendingRequest, setHasPendingRequest] = React.useState(false)
  
  const supabase = createClient()

  React.useEffect(() => {
    const checkPending = async () => {
      const { data } = await supabase
        .from('change_requests')
        .select('id')
        .eq('project_id', project.id)
        .eq('status', 'pending')
        .limit(1)
        .maybeSingle()
      setHasPendingRequest(!!data)
    }
    checkPending()
  }, [project.id, supabase])

  const sendToIframe = React.useCallback((message: any) => {
    try {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage(message, '*')
    } catch {}
  }, [])

  React.useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setModified(parsed)
        }
      }
    } catch {}
  }, [LOCAL_KEY])

  const hasDraft = project.draft_config && Object.keys(project.draft_config).length > 0
  const baseConfig = hasDraft ? project.draft_config : (project.current_config || {})
  const activeSections = baseConfig.activeSections || []
  // Use the project's subdomain for preview; always include projectId so the page can fetch by ID when subdomain/custom domain isn't set.
  const basePath = project?.subdomain ? `/${project.subdomain}` : '/preview'
  const previewPath = `${basePath}?preview=true&projectId=${project.id}`

  // When the iframe indicates it's ready, send a full snapshot: baseConfig overlaid with local (unsaved) edits
  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if ((e.data as any)?.type === 'LIVE_PREVIEW_READY') {
        const full = deepMerge(baseConfig, modified)
        sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: full })
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [baseConfig, modified, sendToIframe])

  const sectionIdToKey = React.useCallback((id: string) => {
    return id === 'brand' ? 'brand' :
           id === 'hero' ? 'hero' :
           id === 'hero-emergency' ? 'heroEmergency' :
           id === 'practice-areas' ? 'practiceAreas' :
           id === 'attorney-profile' ? 'attorneyProfile' :
           id === 'free-consultation' ? 'freeConsultation' :
           id === 'how-it-works' ? 'howItWorks' :
           id === 'review-trust-bar' ? 'reviewTrustBar' :
           id === 'feature-highlight' ? 'featureHighlight' :
           id === 'team-carousel' ? 'teamCarousel' :
           id === 'patient-faq' ? 'patientFaq' :
           id === 'pricing' ? 'pricingTable' :
           id === 'awards' ? 'awardsStrip' :
           id === 'team-grid' ? 'teamCarousel' :
           id === 'contact-split' ? 'contact' :
           id
  }, [])

  const refreshPreview = React.useCallback(() => {
    if (iframeRef.current) {
      const src = iframeRef.current.src
      iframeRef.current.src = src
    }
  }, [])

  const autoSaveSection = React.useCallback((sectionId: string, values: Record<string, any>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setIsSaving(true)
    
    const key = sectionIdToKey(sectionId)
    
    // Update local state and localStorage
    setModified((prev) => {
      const next = { ...prev, [key]: values }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
      }
      return next
    })

    // Small delay to show saving state
    saveTimer.current = setTimeout(() => setIsSaving(false), 300)
  }, [sectionIdToKey, LOCAL_KEY])

  // Efficiently sync changes to the iframe with a short debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(modified).length === 0) return
      const full = deepMerge(baseConfig, modified)
      sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: full })
    }, 150) // 150ms debounce is fast enough to feel instant but slow enough to batch keystrokes

    return () => clearTimeout(timer)
  }, [modified, baseConfig, sendToIframe])

  // Load full section object for the selected section (including arrays like items/steps)
  React.useEffect(() => {
    if (selectedSection) {
      const sectionKey = sectionIdToKey(selectedSection)
      const local = (modified as any)?.[sectionKey]
      const base = local ?? baseConfig[sectionKey] ?? {}
      setFormValues(base as Record<string, any>)
    }
  }, [selectedSection, baseConfig, modified, sectionIdToKey])

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!redeemCode.trim()) return

    setIsRedeeming(true)
    try {
      const res = await fetch('/api/codes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode.trim(), projectId: project.id })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to redeem code")

      toast.success("Template applied successfully!")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsRedeeming(false)
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <MainHeader initialUser={user} variant="client" />

      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2 group"
          >
            <ChevronRight className="w-3 h-3 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Websites
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Site Editor
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Preview and request changes
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Redemption Section */}
          <div className="px-3 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Key className="w-3 h-3" /> Apply Template Code
            </div>
            <form onSubmit={handleRedeem} className="space-y-2">
              <input
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="ENTER-CODE-HERE"
                className="w-full p-2 text-xs border rounded bg-background focus:ring-1 focus:ring-primary outline-none uppercase"
              />
              <button
                type="submit"
                disabled={isRedeeming || !redeemCode.trim()}
                className="w-full py-2 bg-primary text-primary-foreground rounded text-[10px] font-bold disabled:opacity-50 transition-all hover:opacity-90"
              >
                {isRedeeming ? "Applying..." : "Apply Code"}
              </button>
            </form>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Settings
            </div>
            <button
              onClick={() => setSelectedSection('brand')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Brand & Identity</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('hero')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Hero Section</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => setSelectedSection('footer')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
            >
              <span>Footer & Socials</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Site Sections
            </div>
            {activeSections.length > 0 ? (
              activeSections
                .filter((s: string) => s !== 'hero')
                .map((section: string) => {
                // If it's team-grid, we show it but use team-carousel logic for now if needed
                // actually we just show the name from activeSections
                return (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground group transition-colors text-left"
                  >
                    <span className="capitalize">{section.replace(/-/g, ' ')}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground italic">No sections defined</p>
            )}
          </div>

          <div className="mt-8 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </div>
            <Link 
              href="/admin/approvals"
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm text-foreground transition-colors"
            >
              <FileText className="w-4 h-4 text-primary" />
              Change Requests
            </Link>
          </div>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content (Stage) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Preview
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground leading-none">Preview Mode: Viewing unsaved changes</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">Changes here are local to your browser until you click "Save Draft" in the dashboard.</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refreshPreview} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm active:scale-95">
              <Eye className="w-3.5 h-3.5" />
              {isSaving ? 'Saving…' : 'Refresh Preview'}
            </button>
            <button
              onClick={async () => {
                if (Object.keys(modified).length === 0) {
                  toast.info('No local changes to save')
                  return
                }
                setIsSubmitting(true)
                try {
                  const res = await fetch('/api/project-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, patch: modified })
                  })
                  const json = await res.json()
                  if (!res.ok) throw new Error(json.error || 'Failed to save draft')
                  toast.success('Draft saved')
                  setModified({})
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem(LOCAL_KEY)
                  }
                  refreshPreview()
                } catch (e: any) {
                  toast.error(e?.message || 'Failed to save draft')
                } finally {
                  setIsSubmitting(false)
                }
              }}
              disabled={isSubmitting || Object.keys(modified).length === 0}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={() => {
                setModified({})
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(LOCAL_KEY)
                }
                if (selectedSection) {
                  const sectionKey = sectionIdToKey(selectedSection)
                  const base = baseConfig[sectionKey] || {}
                  setFormValues(base as any)
                }
                // push the clean base config back into the preview
                sendToIframe({ type: 'LIVE_PREVIEW_FULL', data: baseConfig })
                toast.success('Local changes discarded')
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-all duration-200 shadow-sm"
            >
              Discard Local
            </button>
            <button
              onClick={async () => {
                if (hasPendingRequest) {
                  toast.error('A change request is already pending. Please wait for it to be reviewed.')
                  return
                }
                
                setIsQueueing(true)
                try {
                  // If there are local changes, save them first
                  if (Object.keys(modified).length > 0) {
                    const saveRes = await fetch('/api/project-config', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ projectId: project.id, patch: modified })
                    })
                    const saveJson = await saveRes.json()
                    if (!saveRes.ok) throw new Error(saveJson.error || 'Failed to auto-save draft before submission')
                    
                    // Clear local changes after successful auto-save
                    setModified({})
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem(LOCAL_KEY)
                    }
                  }

                  // Now submit the change request (which snapshots the draft from DB)
                  const res = await fetch('/api/change-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id })
                  })
                  const json = await res.json()
                  if (!res.ok) throw new Error(json.error || 'Failed to submit for approval')
                  
                  toast.success('Draft saved and submitted for approval')
                  setHasPendingRequest(true)
                  refreshPreview()
                } catch (e: any) {
                  toast.error(e?.message || 'Failed to submit for approval')
                } finally {
                  setIsQueueing(false)
                }
              }}
              disabled={isQueueing || hasPendingRequest}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isQueueing ? 'Submitting…' : hasPendingRequest ? 'Pending Review' : 'Submit for Approval'}
            </button>
          </div>
        </header>

        <div className="flex-1 relative bg-muted/10 p-4 lg:p-8">
          <div className="w-full h-full rounded-xl border border-border shadow-2xl bg-background overflow-hidden flex flex-col">
            <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background border border-border rounded px-3 py-0.5 text-[10px] text-muted-foreground min-w-[200px] text-center truncate">
                  {`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${previewPath}`}
                </div>
              </div>
            </div>
            <iframe 
              ref={iframeRef}
              src={previewPath} 
              className="flex-1 w-full h-full border-none"
              title="Project Preview"
            />
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={!!selectedSection} onOpenChange={(open) => !open && setSelectedSection(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {selectedSection?.replace(/-/g, ' ')}
            </DialogTitle>
            <DialogDescription>
              Suggest changes to this section. Our team will review and apply them shortly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 py-4">
            <div className="max-h-[60vh] overflow-y-auto space-y-6 px-1">
              {/* 1) Basic text fields in this section */}
              {Object.entries(formValues)
                .filter(([key, v]) => {
                  if (typeof v !== 'string') return false;
                  const k = key.toLowerCase();
                  return !k.includes('url') && !k.includes('image');
                })
                .map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize text-foreground">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  {(value as string).length > 100 ? (
                    <textarea
                      value={value as string}
                      onChange={(e) => {
                        const val = e.target.value
                        const sectionKey = sectionIdToKey(selectedSection!)
                        
                        // Update local form state immediately for UI responsiveness
                        setFormValues(prev => {
                          const next = { ...prev, [key]: val }
                          // Also sync to modified and autoSave
                          setModified(m => ({ ...m, [sectionKey]: next }))
                          autoSaveSection(selectedSection!, next)
                          return next
                        })
                      }}
                      className="w-full min-h-[100px] px-3 py-2 bg-muted/30 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => {
                        const val = e.target.value
                        const sectionKey = sectionIdToKey(selectedSection!)
                        
                        // Update local form state immediately for UI responsiveness
                        setFormValues(prev => {
                          const next = { ...prev, [key]: val }
                          // Also sync to modified and autoSave
                          setModified(m => ({ ...m, [sectionKey]: next }))
                          autoSaveSection(selectedSection!, next)
                          return next
                        })
                      }}
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  )}
                </div>
              ))}

              {/* 1.5) Logo and Hero Background Image uploads */}
              {(() => {
                const sectionKey = sectionIdToKey(selectedSection || '')
                if (sectionKey === 'brand') {
                  return (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Logo Image</label>
                      <ImageUpload
                        value={formValues.logoUrl || ''}
                        onChange={(url) => {
                          const next = { ...formValues, logoUrl: url }
                          setFormValues(next)
                          setModified(m => ({ ...m, brand: next }))
                          autoSaveSection('brand', next)
                        }}
                      />
                    </div>
                  )
                }
                if (sectionKey === 'hero') {
                  return (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Background Image</label>
                      <ImageUpload
                        value={formValues.backgroundImage || ''}
                        onChange={(url) => {
                          const next = { ...formValues, backgroundImage: url }
                          setFormValues(next)
                          setModified(m => ({ ...m, hero: next }))
                          autoSaveSection('hero', next)
                        }}
                      />
                    </div>
                  )
                }
                return null
              })()}

              {/* 2) Awards editor (labels, sublabels, icons) */}
              {(() => {
                const isAwards = sectionIdToKey(selectedSection || '') === 'awardsStrip'
                const items = (formValues as any)?.items
                if (!isAwards || !Array.isArray(items)) return null
                const ICONS = ['Award','ShieldCheck','Star','Users','Shield','Gavel','Scale','Briefcase','Home','Zap','Clock','Calendar','ClipboardCheck','Phone','MapPin','Mail','Check','Heart','Smile','ThumbsUp']
                const update = (nextItems: any[]) => {
                  const next = { ...formValues, items: nextItems }
                  setFormValues(next)
                  const sectionKey = sectionIdToKey(selectedSection!)
                  setModified((m) => ({ ...m, [sectionKey]: next }))
                  autoSaveSection(selectedSection!, next)
                }
                return (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Awards Items</div>
                    {items.map((it: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Label</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.label || ''}
                              onChange={(e) => {
                                const copy = items.slice(); copy[idx] = { ...it, label: e.target.value }; update(copy)
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Sub Label</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.sublabel || ''}
                              onChange={(e) => {
                                const copy = items.slice(); copy[idx] = { ...it, sublabel: e.target.value }; update(copy)
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Icon</label>
                            <select
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.icon || 'Award'}
                              onChange={(e) => {
                                const copy = items.slice(); copy[idx] = { ...it, icon: e.target.value }; update(copy)
                              }}
                            >
                              {ICONS.map((name) => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = items.slice(); const t = copy[idx-1]; if (idx>0){copy[idx-1]=copy[idx]; copy[idx]=t; update(copy)} }}>Up</button>
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = items.slice(); const t = copy[idx+1]; if (idx<items.length-1){copy[idx+1]=copy[idx]; copy[idx]=t; update(copy)} }}>Down</button>
                          </div>
                          <button type="button" className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => { const copy = items.slice(); copy.splice(idx,1); update(copy) }}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded" onClick={() => update([...(items||[]), { label: '', sublabel: '', icon: 'Award' }])}>Add Award</button>
                  </div>
                )
              })()}

              {/* 3) Practice Areas editor (title, description, icon, href) */}
              {(() => {
                const isPA = sectionIdToKey(selectedSection || '') === 'practiceAreas'
                const items = (formValues as any)?.items
                if (!isPA || !Array.isArray(items)) return null
                const ICONS = ['Gavel','Scale','Briefcase','ShieldCheck','Shield','Home','Award','Users','Zap','Clock','Calendar','ClipboardCheck']
                const update = (nextItems: any[]) => {
                  const next = { ...formValues, items: nextItems }
                  setFormValues(next)
                  const sectionKey = sectionIdToKey(selectedSection!)
                  setModified((m) => ({ ...m, [sectionKey]: next }))
                  autoSaveSection(selectedSection!, next)
                }
                return (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Practice Areas</div>
                    {items.map((it: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Title</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.title || ''}
                              onChange={(e) => { const copy = items.slice(); copy[idx] = { ...it, title: e.target.value }; update(copy) }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Icon</label>
                            <select
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.icon || 'Gavel'}
                              onChange={(e) => { const copy = items.slice(); copy[idx] = { ...it, icon: e.target.value }; update(copy) }}
                            >
                              {ICONS.map((name) => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-muted-foreground">Description</label>
                            <textarea
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm min-h-[70px]"
                              value={it.description || ''}
                              onChange={(e) => { const copy = items.slice(); copy[idx] = { ...it, description: e.target.value }; update(copy) }}
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-muted-foreground">Link</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={it.href || ''}
                              onChange={(e) => { const copy = items.slice(); copy[idx] = { ...it, href: e.target.value }; update(copy) }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = items.slice(); const t = copy[idx-1]; if (idx>0){copy[idx-1]=copy[idx]; copy[idx]=t; update(copy)} }}>Up</button>
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = items.slice(); const t = copy[idx+1]; if (idx<items.length-1){copy[idx+1]=copy[idx]; copy[idx]=t; update(copy)} }}>Down</button>
                          </div>
                          <button type="button" className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => { const copy = items.slice(); copy.splice(idx,1); update(copy) }}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded" onClick={() => update([...(items||[]), { title: '', description: '', icon: 'Gavel', href: '#' }])}>Add Practice Area</button>
                  </div>
                )
              })()}

              {/* 4) Blog editor (posts) */}
              {(() => {
                const isBlog = sectionIdToKey(selectedSection || '') === 'blog'
                const posts = (formValues as any)?.posts
                if (!isBlog || !Array.isArray(posts)) return null
                const update = (nextPosts: any[]) => {
                  const next = { ...formValues, posts: nextPosts }
                  setFormValues(next)
                  const sectionKey = sectionIdToKey(selectedSection!)
                  setModified((m) => ({ ...m, [sectionKey]: next }))
                  autoSaveSection(selectedSection!, next)
                }
                return (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blog Posts</div>
                    {posts.map((post: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Title</label>
                          <input
                            className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                            value={post.title || ''}
                            onChange={(e) => { const copy = posts.slice(); copy[idx] = { ...post, title: e.target.value }; update(copy) }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Excerpt</label>
                          <textarea
                            className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm min-h-[60px]"
                            value={post.excerpt || ''}
                            onChange={(e) => { const copy = posts.slice(); copy[idx] = { ...post, excerpt: e.target.value }; update(copy) }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Category</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={post.category || ''}
                              onChange={(e) => { const copy = posts.slice(); copy[idx] = { ...post, category: e.target.value }; update(copy) }}
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Date</label>
                            <input
                              className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                              value={post.date || ''}
                              onChange={(e) => { const copy = posts.slice(); copy[idx] = { ...post, date: e.target.value }; update(copy) }}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Image</label>
                          <ImageUpload
                            value={post.imageUrl || ''}
                            onChange={(url) => {
                              const copy = posts.slice()
                              copy[idx] = { ...post, imageUrl: url }
                              update(copy)
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = posts.slice(); const t = copy[idx-1]; if (idx>0){copy[idx-1]=copy[idx]; copy[idx]=t; update(copy)} }}>Up</button>
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = posts.slice(); const t = copy[idx+1]; if (idx<posts.length-1){copy[idx+1]=copy[idx]; copy[idx]=t; update(copy)} }}>Down</button>
                          </div>
                          <button type="button" className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => { const copy = posts.slice(); copy.splice(idx,1); update(copy) }}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded"
                      onClick={() => update([...(posts || []), { title: 'New Post', excerpt: '', category: 'News', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), imageUrl: '' }])}
                    >
                      Add Blog Post
                    </button>
                  </div>
                )
              })()}

              {/* 5) Team editor (members) */}
              {(() => {
                const isTeam = sectionIdToKey(selectedSection || '') === 'teamCarousel'
                const members = (formValues as any)?.members
                if (!isTeam || !Array.isArray(members)) return null
                const update = (nextMembers: any[]) => {
                  const next = { ...formValues, members: nextMembers }
                  setFormValues(next)
                  const sectionKey = sectionIdToKey(selectedSection!)
                  setModified((m) => ({ ...m, [sectionKey]: next }))
                  autoSaveSection(selectedSection!, next)
                }
                return (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team Members</div>
                    {members.map((member: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Name</label>
                          <input
                            className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                            value={member.name || ''}
                            onChange={(e) => { const copy = members.slice(); copy[idx] = { ...member, name: e.target.value }; update(copy) }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Specialty / Role</label>
                          <input
                            className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                            value={member.specialty || ''}
                            onChange={(e) => { const copy = members.slice(); copy[idx] = { ...member, specialty: e.target.value }; update(copy) }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Bio Link</label>
                          <input
                            className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm"
                            value={member.bioUrl || ''}
                            onChange={(e) => { const copy = members.slice(); copy[idx] = { ...member, bioUrl: e.target.value }; update(copy) }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Photo</label>
                          <ImageUpload
                            value={member.imageUrl || ''}
                            onChange={(url) => {
                              const copy = members.slice()
                              copy[idx] = { ...member, imageUrl: url }
                              update(copy)
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-2">
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = members.slice(); const t = copy[idx-1]; if (idx>0){copy[idx-1]=copy[idx]; copy[idx]=t; update(copy)} }}>Up</button>
                            <button type="button" className="px-2 py-1 text-xs border rounded" onClick={() => { const copy = members.slice(); const t = copy[idx+1]; if (idx<members.length-1){copy[idx+1]=copy[idx]; copy[idx]=t; update(copy)} }}>Down</button>
                          </div>
                          <button type="button" className="px-2 py-1 text-xs border rounded text-red-600" onClick={() => { const copy = members.slice(); copy.splice(idx,1); update(copy) }}>Remove</button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded"
                      onClick={() => update([...(members || []), { name: 'New Member', specialty: 'Position', imageUrl: '', bioUrl: '#' }])}
                    >
                      Add Team Member
                    </button>
                  </div>
                )
              })()}

              {/* 6) Contact Split editor (handled by basic text fields usually, but explicitly ensuring labels) */}
              {(() => {
                const sectionKey = sectionIdToKey(selectedSection || '')
                if (sectionKey !== 'contact') return null
                // The existing automatic filtering handle strings, but contact split has many
                return null // Already covered by automatic logic
              })()}

              {/* 7) Footer editor (socials toggle and links) */}
              {(() => {
                const sectionKey = sectionIdToKey(selectedSection || '')
                if (sectionKey !== 'footer') return null
                const update = (next: any) => {
                  setFormValues(next)
                  setModified((m) => ({ ...m, footer: next }))
                  autoSaveSection('footer', next)
                }
                return (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Show Social Icons</label>
                        <input
                          type="checkbox"
                          checked={formValues.showSocial !== false}
                          onChange={(e) => update({ ...formValues, showSocial: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Show Contact Info</label>
                        <input
                          type="checkbox"
                          checked={formValues.showContact !== false}
                          onChange={(e) => update({ ...formValues, showContact: e.target.checked })}
                          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Social Links & Visibility</label>
                      {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                        <div key={platform} className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-foreground capitalize">{platform}</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formValues.social?.[`${platform}Enabled`] !== false}
                                onChange={(e) => {
                                  const social = { ...formValues.social, [`${platform}Enabled`]: e.target.checked }
                                  update({ ...formValues, social })
                                }}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              />
                              <span className="text-xs text-muted-foreground">Enabled</span>
                            </label>
                          </div>
                          <input
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
                            placeholder={`https://${platform}.com/...`}
                            value={formValues.social?.[platform] || ''}
                            onChange={(e) => {
                              const social = { ...formValues.social, [platform]: e.target.value }
                              update({ ...formValues, social })
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* More editors (features, steps, team, pricing, etc.) can be added similarly */}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
              <div>{isSaving ? 'Saving…' : 'Auto-saved (local)'}</div>
              <button
                type="button"
                onClick={() => setSelectedSection(null)}
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
              >
                Done
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
