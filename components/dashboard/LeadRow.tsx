'use client'
import { useState, useTransition } from 'react'
import {
  Phone, MessageSquare, FormInput, ChevronDown, StickyNote,
  Check, Loader2, MapPin, Globe, Shield, ShieldAlert, ShieldCheck,
  ExternalLink, ChevronRight,
} from 'lucide-react'
import { updateLeadStatus, updateLeadNotes, type LeadStatus } from '@/app/actions/leads'

type Lead = {
  id: string
  type: string
  status: LeadStatus
  notes: string | null
  metadata: Record<string, any>
  page_slug: string | null
  section_key: string | null
  source: string | null
  first_touch_source: string | null
  created_at: string
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  new:       { label: 'New',       color: 'bg-blue-500/10 text-blue-600 border-blue-200/50',     dot: 'bg-blue-500'    },
  contacted: { label: 'Contacted', color: 'bg-amber-500/10 text-amber-600 border-amber-200/50',  dot: 'bg-amber-500'   },
  closed:    { label: 'Closed',    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50', dot: 'bg-emerald-500' },
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  call:      { icon: Phone,         color: 'text-green-600',  bg: 'bg-green-500/10',  label: 'Call'      },
  form:      { icon: FormInput,     color: 'text-blue-600',   bg: 'bg-blue-500/10',   label: 'Form'      },
  messenger: { icon: MessageSquare, color: 'text-sky-600',    bg: 'bg-sky-500/10',    label: 'Messenger' },
  viber:     { icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-500/10', label: 'Viber'     },
}

/** Score 0–4: higher = more likely a real human lead */
function computeQualityScore(lead: Lead): number {
  const meta = lead.metadata || {}
  let score = 0
  if (meta.name)                                    score++
  if (meta.email || meta.phone)                     score++
  if (meta.geo_city || meta.geo_country)            score++
  if (lead.source || lead.first_touch_source)       score++
  return score
}

function QualityBadge({ score }: { score: number }) {
  if (score >= 3) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200/50">
      <ShieldCheck className="w-2.5 h-2.5" /> Quality
    </span>
  )
  if (score >= 2) return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-200/50">
      <Shield className="w-2.5 h-2.5" /> Likely Real
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-200/50">
      <ShieldAlert className="w-2.5 h-2.5" /> Low Signal
    </span>
  )
}

export default function LeadRow({ lead }: { lead: Lead }) {
  const [status, setStatus]       = useState<LeadStatus>(lead.status ?? 'new')
  const [notes, setNotes]         = useState(lead.notes ?? '')
  const [showNotes, setShowNotes] = useState(false)
  const [expanded, setExpanded]   = useState(false)
  const [notesDirty, setNotesDirty] = useState(false)
  const [isPending, startTransition]       = useTransition()
  const [notesPending, startNotesTrans]    = useTransition()

  const meta          = lead.metadata || {}
  const contactName   = meta.name
  const contactEmail  = meta.email
  const contactPhone  = meta.phone
  const geoCity       = meta.geo_city
  const geoCountry    = meta.geo_country
  const referrer      = meta.referrer
  const utmSource     = meta.utm_source
  const message       = meta.message

  let displaySource = lead.source || utmSource || null
  if (!displaySource && referrer) {
    try { displaySource = new URL(referrer).hostname } catch { displaySource = referrer }
  }
  if (!displaySource && lead.first_touch_source) displaySource = lead.first_touch_source

  const qualityScore = computeQualityScore(lead)
  const cfg          = STATUS_CONFIG[status]
  const typeCfg      = TYPE_CONFIG[lead.type] ?? TYPE_CONFIG.form
  const TypeIcon     = typeCfg.icon

  function handleStatusChange(next: LeadStatus) {
    setStatus(next)
    startTransition(async () => { await updateLeadStatus(lead.id, next) })
  }

  function handleSaveNotes() {
    startNotesTrans(async () => {
      await updateLeadNotes(lead.id, notes)
      setNotesDirty(false)
    })
  }

  return (
    <div className="border-b border-border last:border-0">
      {/* Main row */}
      <div className="px-4 sm:px-6 py-4 hover:bg-muted/30 transition-colors group/row">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Type icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeCfg.bg} ${typeCfg.color}`}>
            <TypeIcon className="w-4.5 h-4.5" strokeWidth={2.5} />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-sm font-bold text-foreground">{typeCfg.label}</span>
              {contactName && <span className="text-sm text-foreground/70 font-medium">— {contactName}</span>}
              <QualityBadge score={qualityScore} />
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-0.5">
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  {contactEmail}
                </a>
              )}
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  {contactPhone}
                </a>
              )}
              {(geoCity || geoCountry) && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {[geoCity, geoCountry].filter(Boolean).join(', ')}
                </span>
              )}
              {displaySource && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {displaySource}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              {lead.page_slug && (
                <span className="text-[10px] text-muted-foreground/60">/{lead.page_slug}</span>
              )}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title="Show details"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>

            {/* Notes toggle */}
            <button
              onClick={() => setShowNotes(v => !v)}
              title="Notes"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                showNotes || notes ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
            </button>

            {/* Status dropdown */}
            <div className="relative group/menu">
              <button
                disabled={isPending}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${cfg.color} disabled:opacity-60`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <div className="absolute right-0 top-full mt-1.5 z-30 invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all duration-200 flex flex-col bg-background border border-border rounded-xl shadow-xl overflow-hidden min-w-[140px] p-1">
                {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-muted rounded-lg transition-all text-left cursor-pointer ${
                      status === s ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`} />
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="px-4 sm:px-6 pb-4 bg-muted/20 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            {message && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Message</p>
                <p className="text-foreground font-medium bg-background border border-border rounded-lg px-3 py-2">{message}</p>
              </div>
            )}
            {lead.section_key && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Section</p>
                <p className="font-medium text-foreground capitalize">{lead.section_key}</p>
              </div>
            )}
            {lead.first_touch_source && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">First Touch</p>
                <p className="font-medium text-foreground">{lead.first_touch_source}</p>
              </div>
            )}
            {meta.referrer && (
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Referrer</p>
                <a href={meta.referrer} target="_blank" rel="noopener noreferrer" className="font-medium text-primary flex items-center gap-1 truncate hover:underline">
                  {meta.referrer.length > 40 ? meta.referrer.slice(0, 40) + '…' : meta.referrer}
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            )}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Quality Score</p>
              <p className="font-bold text-foreground">{qualityScore}/4</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Lead ID</p>
              <p className="font-mono text-[10px] text-muted-foreground truncate">{lead.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notes panel */}
      {showNotes && (
        <div className="px-4 sm:px-6 pb-4 bg-muted/10 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="pt-3 space-y-2">
            <textarea
              rows={2}
              value={notes}
              onChange={e => { setNotes(e.target.value); setNotesDirty(true) }}
              placeholder="Add a note about this lead…"
              className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 font-medium"
            />
            {notesDirty && (
              <button
                onClick={handleSaveNotes}
                disabled={notesPending}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/10 transition-all disabled:opacity-50"
              >
                {notesPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Save note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
