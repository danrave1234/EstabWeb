"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Check, X, Shield, Globe, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { RenderValue } from '@/components/admin/RenderValue'
import { processChangeRequest } from '@/app/actions/admin'
import { getSectionKey } from '@/lib/utils/config-mapping'
import { ExternalLink } from 'lucide-react'

interface ReviewRequestClientProps {
  request: any
}

export default function ReviewRequestClient({ request }: ReviewRequestClientProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState('#')
  const leftRef = React.useRef<HTMLDivElement>(null)
  const rightRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const { hostname, protocol, port } = window.location
      const p = port ? `:${port}` : ''
      
      let url = '#'
      // If we're on localhost, use path-based routing (handled by our middleware update)
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        url = `/${request.projects?.subdomain}?preview=true&requestId=${request.id}`
      } else {
        // On production, build the subdomain URL
        // Assumes admin is at admin.estabweb.com and sites are at [subdomain].estabweb.com
        const rootDomain = hostname.replace('admin.', '')
        url = `${protocol}//${request.projects?.subdomain}.${rootDomain}${p}?preview=true&requestId=${request.id}`
      }
      setPreviewUrl(url)
    }
  }, [request])

  const handleScroll = (source: React.RefObject<HTMLDivElement | null>, target: React.RefObject<HTMLDivElement | null>) => {
    if (source.current && target.current) {
      target.current.scrollTop = source.current.scrollTop
    }
  }

  const handleProcess = async (action: 'approved' | 'rejected') => {
    setIsProcessing(true)
    try {
      const result = await processChangeRequest(request.id, action)
      if (result.error) throw new Error(result.error)
      toast.success(`Request ${action} successfully`)
      router.push('/admin/dashboard')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || `Failed to ${action} request`)
    } finally {
      setIsProcessing(false)
    }
  }

  const sectionId = request.section_id
  const sectionKey = getSectionKey(sectionId);

  const currentConfig = request.projects?.current_config || {}
  const currentSectionData = sectionId === 'full-site' ? currentConfig : (currentConfig[sectionKey] || {})
  const requestedChanges = request.requested_changes || {}

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              Review Change Request
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-mono">
                {request.id.slice(0, 8)}
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {request.projects?.subdomain}.lawyerflow.io
              </span>
              <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] font-bold">
                <Shield className="w-3.5 h-3.5" />
                {sectionId?.replace(/-/g, ' ') || 'Full Site'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={previewUrl}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm text-foreground"
          >
            <ExternalLink className="w-4 h-4" />
            Live Preview
          </Link>
          <button
            onClick={() => handleProcess('rejected')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/5 transition-colors font-medium disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={() => handleProcess('approved')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium shadow-sm disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Approve & Publish
          </button>
        </div>
      </header>

      {/* Info Bar */}
      <div className="bg-muted/30 border-b px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-medium">{request.profiles?.email || 'Unknown User'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span>
              {mounted ? format(new Date(request.created_at), 'MMM d, yyyy HH:mm') : 'Loading...'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Status:</span>
          <span className="capitalize font-bold text-amber-600">{request.status}</span>
        </div>
      </div>

      {/* Side-by-Side Diff View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Current Live */}
        <div className="flex-1 flex flex-col border-r">
          <div className="bg-card border-b px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
            Current Live Content
            <span className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">Read Only</span>
          </div>
          <div 
            ref={leftRef}
            onScroll={() => handleScroll(leftRef, rightRef)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {Object.keys(requestedChanges).map(key => (
              <div key={key} className="space-y-2 opacity-60">
                <div className="text-[10px] font-black uppercase text-muted-foreground/50">{key}</div>
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <RenderValue value={currentSectionData[key]} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Requested Changes */}
        <div className="flex-1 flex flex-col bg-emerald-500/[0.02]">
          <div className="bg-emerald-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white flex items-center justify-between">
            Requested Changes
            <span className="px-1.5 py-0.5 bg-white/20 rounded text-white">Draft</span>
          </div>
          <div 
            ref={rightRef}
            onScroll={() => handleScroll(rightRef, leftRef)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {Object.entries(requestedChanges).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="text-[10px] font-black uppercase text-emerald-600/70">{key}</div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/10">
                  <RenderValue value={value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
