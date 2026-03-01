'use client'

import { useState, useTransition } from 'react'
import { Phone, MessageSquare, FormInput, ChevronDown, StickyNote, Check, Loader2 } from 'lucide-react'
import { updateLeadStatus, updateLeadNotes, type LeadStatus } from '@/app/actions/leads'

type Lead = {
  id: string
  type: string
  status: LeadStatus
  notes: string | null
  metadata: Record<string, any>
  created_at: string
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string; glow: string }> = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-600 border-blue-200/50', dot: 'bg-blue-500', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
  contacted: { label: 'Contacted', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50', dot: 'bg-amber-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]' },
  closed: { label: 'Closed', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50', dot: 'bg-emerald-500', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' },
}

export default function LeadRow({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status ?? 'new')
  const [notes, setNotes] = useState(lead.notes ?? '')
  const [showNotes, setShowNotes] = useState(false)
  const [notesDirty, setNotesDirty] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [notesPending, startNotesTrans] = useTransition()

  const meta = lead.metadata || {}
  const contactName = meta.name
  const contactEmail = meta.email
  const contactPhone = meta.phone
  const referrer = meta.referrer
  const utmSource = meta.utm_source
  let source = utmSource || null
  if (!source && referrer) {
    try { source = new URL(referrer).hostname } catch { source = referrer }
  }

  const cfg = STATUS_CONFIG[status]

  function handleStatusChange(next: LeadStatus) {
    setStatus(next)
    startTransition(async () => {
      await updateLeadStatus(lead.id, next)
    })
  }

  function handleSaveNotes() {
    startNotesTrans(async () => {
      await updateLeadNotes(lead.id, notes)
      setNotesDirty(false)
    })
  }

  return (
    <div className="px-4 sm:px-8 py-5 hover:bg-muted/40 transition-all group/row border-b border-border last:border-0 relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary transform -translate-x-full group-hover/row:translate-x-0 transition-transform" />

      <div className="flex items-start gap-4 sm:gap-6 relative z-10">
        {/* Type icon */}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm transition-transform group-hover/row:scale-110 ${lead.type === 'call' ? 'bg-green-500/10 text-green-600' :
            lead.type === 'form' ? 'bg-blue-500/10 text-blue-600' :
              lead.type === 'messenger' ? 'bg-sky-500/10 text-sky-600' :
                'bg-indigo-500/10 text-indigo-600'
          }`}>
          {lead.type === 'call' && <Phone className="w-5 h-5" strokeWidth={2.5} />}
          {lead.type === 'form' && <FormInput className="w-5 h-5" strokeWidth={2.5} />}
          {(lead.type === 'messenger' || lead.type === 'viber') && <MessageSquare className="w-5 h-5" strokeWidth={2.5} />}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-black text-foreground capitalize tracking-tight">{lead.type}</span>
            {contactName && <span className="text-sm font-bold text-foreground/80">— {contactName}</span>}
            {source && (
              <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                {source}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 opacity-60">
            {contactEmail && <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">{contactEmail}</span>}
            {contactPhone && <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">{contactPhone}</span>}
            <span className="text-[11px] font-bold text-muted-foreground/50">
              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Notes area */}
          {showNotes && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <textarea
                rows={2}
                value={notes}
                onChange={e => { setNotes(e.target.value); setNotesDirty(true) }}
                placeholder="Add a note about this lead…"
                className="w-full text-sm bg-background border border-border rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-muted-foreground/30 font-medium"
              />
              {notesDirty && (
                <button
                  onClick={handleSaveNotes}
                  disabled={notesPending}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 transition-all disabled:opacity-50"
                >
                  {notesPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save note
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(v => !v)}
            title="Add / view notes"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showNotes || notes ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'bg-muted/50 border border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <StickyNote className="w-4 h-4" />
          </button>

          {/* Status dropdown */}
          <div className="relative group/menu">
            <button
              disabled={isPending}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${cfg.color} ${cfg.glow} disabled:opacity-60 hover:scale-105 active:scale-95`}
            >
              <div className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-background`} />
              {cfg.label}
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3 group-hover/menu:translate-y-0.5 transition-transform" />}
            </button>
            <div className="absolute right-0 top-full mt-2 z-30 invisible group-hover/menu:visible group-focus-within/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all duration-300 translate-y-2 group-hover/menu:translate-y-0 flex flex-col bg-background/80 backdrop-blur-xl border border-border rounded-[1.25rem] shadow-2xl overflow-hidden min-w-[150px] p-1.5 ring-1 ring-black/5">
              {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-muted rounded-xl transition-all text-left ${status === s ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
