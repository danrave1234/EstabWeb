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

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  new:       { label: 'New',       color: 'bg-blue-500/10 text-blue-600 border-blue-200',    dot: 'bg-blue-500' },
  contacted: { label: 'Contacted', color: 'bg-amber-500/10 text-amber-600 border-amber-200', dot: 'bg-amber-500' },
  closed:    { label: 'Closed',    color: 'bg-green-500/10 text-green-600 border-green-200', dot: 'bg-green-500' },
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
    <div className="px-4 sm:px-6 py-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Type icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          lead.type === 'call'      ? 'bg-green-500/10 text-green-600' :
          lead.type === 'form'      ? 'bg-blue-500/10 text-blue-600' :
          lead.type === 'messenger' ? 'bg-sky-500/10 text-sky-600' :
                                      'bg-indigo-500/10 text-indigo-600'
        }`}>
          {lead.type === 'call'      && <Phone className="w-4 h-4" />}
          {lead.type === 'form'      && <FormInput className="w-4 h-4" />}
          {(lead.type === 'messenger' || lead.type === 'viber') && <MessageSquare className="w-4 h-4" />}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-black text-foreground capitalize">{lead.type}</span>
            {contactName && <span className="text-sm font-bold text-foreground">— {contactName}</span>}
            {source && (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                {source}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
            {contactEmail && <span className="text-xs text-muted-foreground">{contactEmail}</span>}
            {contactPhone && <span className="text-xs text-muted-foreground">{contactPhone}</span>}
            <span className="text-xs text-muted-foreground/60">
              {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Notes area */}
          {showNotes && (
            <div className="mt-3 space-y-2">
              <textarea
                rows={2}
                value={notes}
                onChange={e => { setNotes(e.target.value); setNotesDirty(true) }}
                placeholder="Add a note about this lead…"
                className="w-full text-sm bg-muted/50 border border-border rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
              />
              {notesDirty && (
                <button
                  onClick={handleSaveNotes}
                  disabled={notesPending}
                  className="flex items-center gap-1.5 text-xs font-black text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  {notesPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  Save note
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(v => !v)}
            title="Add / view notes"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              showNotes || notes ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>

          {/* Status dropdown */}
          <div className="relative group">
            <button
              disabled={isPending}
              className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border transition-colors ${cfg.color} disabled:opacity-60`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <div className="absolute right-0 top-full mt-1 z-20 hidden group-hover:flex group-focus-within:flex flex-col bg-popover border border-border rounded-xl shadow-xl overflow-hidden min-w-[130px]">
              {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black hover:bg-muted transition-colors text-left ${status === s ? 'text-primary' : 'text-foreground'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
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
