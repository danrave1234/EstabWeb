import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3, Phone, MessageSquare, FormInput, ChevronLeft,
  TrendingUp, MousePointerClick, Globe, Layers, Lock, Sparkles,
  MapPin, Clock, Users,
} from 'lucide-react'
import SeoAuditPanel from '@/components/dashboard/SeoAuditPanel'
import LeadRow from '@/components/dashboard/LeadRow'
import { isAnalyticsAllowed, hasAdvancedAnalytics, getPlanType } from '@/lib/subscription'

export const dynamic = "force-dynamic"
export const revalidate = 0

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ProjectEvent = {
  event_type: string
  page_slug: string | null
  section_key: string | null
  source: string | null
  visitor_id: string | null
  session_id: string | null
  funnel_step: string | null
  metadata: Record<string, any> | null
  created_at: string
}

type GeoStat = { city: string; region: string; count: number }
type PeakHourStat = { hour: number; count: number }
type PageStat = { page_slug: string; views: number; leads: number; conversion_rate: number }
type SectionStat = {
  section_key: string; sectionViews: number; clicks: number; leads: number
  viewRate: number; clickRate: number; conversionRate: number; engagementScore: number; rank: number
}
type SourceStat = { source: string; views: number; leads: number; conversion_rate: number }
type VisitorStats = { total: number; returning: number; newVisitors: number; returnRate: number }
type FunnelStat = { step: string; label: string; count: number; pct: number }
type SessionMetrics = { totalSessions: number; avgDurationSeconds: number; bounceRate: number }
type FirstTouchStat = { source: string; leads: number; pct: number }

const STATUS_LABELS = { all: 'All', new: 'New', contacted: 'Contacted', closed: 'Closed' } as const
type FilterStatus = keyof typeof STATUS_LABELS

// ---------------------------------------------------------------------------
// Aggregation helpers
// ---------------------------------------------------------------------------
function computeGeoStats(events: ProjectEvent[]): GeoStat[] {
  const map = new Map<string, { city: string; region: string; count: number }>()
  for (const e of events) {
    if (!e.metadata?.geo_city) continue
    const city = e.metadata.geo_city
    const region = e.metadata.geo_region || 'Unknown'
    const key = `${city}-${region}`
    if (!map.has(key)) map.set(key, { city, region, count: 0 })
    map.get(key)!.count++
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5)
}

function computePeakHourStats(events: ProjectEvent[]): PeakHourStat[] {
  const hours = new Array(24).fill(0)
  for (const e of events) { hours[new Date(e.created_at).getHours()]++ }
  return hours.map((count, hour) => ({ hour, count }))
}

function computePageStats(events: ProjectEvent[]): PageStat[] {
  const map = new Map<string, { views: number; leads: number }>()
  for (const e of events) {
    const slug = e.page_slug ?? ''
    if (!map.has(slug)) map.set(slug, { views: 0, leads: 0 })
    const s = map.get(slug)!
    if (e.event_type === 'page_view') s.views++
    if (e.event_type.startsWith('lead_')) s.leads++
  }
  return Array.from(map.entries())
    .map(([page_slug, s]) => ({ page_slug: page_slug || '(home)', views: s.views, leads: s.leads, conversion_rate: s.views > 0 ? s.leads / s.views : 0 }))
    .sort((a, b) => b.views - a.views)
}

function computeSectionStats(events: ProjectEvent[], totalVisitors: number): SectionStat[] {
  const map = new Map<string, { sectionViews: number; clicks: number; leads: number; maps: number }>()
  for (const e of events) {
    if (!['section_view', 'cta_click', 'lead_form', 'lead_call', 'lead_messenger', 'lead_viber', 'map_interact'].includes(e.event_type)) continue
    const key = e.section_key ?? '(unknown)'
    if (!map.has(key)) map.set(key, { sectionViews: 0, clicks: 0, leads: 0, maps: 0 })
    const s = map.get(key)!
    if (e.event_type === 'section_view') s.sectionViews++
    if (e.event_type === 'cta_click') s.clicks++
    if (e.event_type === 'map_interact') s.maps++
    if (e.event_type.startsWith('lead_')) s.leads++
  }
  const rows = Array.from(map.entries()).map(([section_key, s]) => {
    const viewRate = totalVisitors > 0 ? s.sectionViews / totalVisitors : 0
    const clickRate = s.sectionViews > 0 ? (s.clicks + s.maps) / s.sectionViews : 0
    const conversionRate = s.sectionViews > 0 ? s.leads / s.sectionViews : 0
    const engagementScore = (s.clicks + s.maps) * 0.4 + conversionRate * 0.5 + viewRate * 0.1
    return { section_key, sectionViews: s.sectionViews, clicks: s.clicks, leads: s.leads, viewRate, clickRate, conversionRate, engagementScore, rank: 0 }
  })
  rows.sort((a, b) => b.engagementScore - a.engagementScore)
  rows.forEach((r, i) => { r.rank = i + 1 })
  return rows
}

function computeSourceStats(events: ProjectEvent[]): SourceStat[] {
  const map = new Map<string, { views: number; leads: number }>()
  for (const e of events) {
    const src = e.source ?? 'direct'
    if (!map.has(src)) map.set(src, { views: 0, leads: 0 })
    const s = map.get(src)!
    if (e.event_type === 'page_view') s.views++
    if (e.event_type.startsWith('lead_')) s.leads++
  }
  return Array.from(map.entries())
    .map(([source, s]) => ({ source, views: s.views, leads: s.leads, conversion_rate: s.views > 0 ? s.leads / s.views : 0 }))
    .sort((a, b) => b.conversion_rate - a.conversion_rate)
}

function computeVisitorStats(events: ProjectEvent[]): VisitorStats {
  const visitorSessions = new Map<string, number>()
  for (const e of events) {
    if (e.event_type !== 'page_view') continue
    const vid = e.visitor_id
    if (!vid) continue
    visitorSessions.set(vid, (visitorSessions.get(vid) ?? 0) + 1)
  }
  const total = visitorSessions.size
  const returning = Array.from(visitorSessions.values()).filter(v => v > 1).length
  return { total, returning, newVisitors: total - returning, returnRate: total > 0 ? returning / total : 0 }
}

function computeFunnelStats(events: ProjectEvent[]): FunnelStat[] {
  const sets = { landing: new Set<string>(), engaged: new Set<string>(), cta: new Set<string>(), lead: new Set<string>() }
  for (const e of events) {
    const id = e.visitor_id || e.session_id
    if (!id) continue
    if (e.event_type === 'page_view' || e.event_type === 'session_start') sets.landing.add(id)
    if (e.event_type === 'section_view' || (e.event_type === 'scroll_depth' && Number(e.metadata?.depth_percent) >= 50)) sets.engaged.add(id)
    if (e.event_type === 'cta_click') sets.cta.add(id)
    if (e.event_type.startsWith('lead_')) sets.lead.add(id)
  }
  const base = sets.landing.size || 1
  return [
    { step: 'landing', label: 'Landing',   count: sets.landing.size, pct: 1 },
    { step: 'engaged', label: 'Engaged',   count: sets.engaged.size, pct: sets.engaged.size / base },
    { step: 'cta',     label: 'CTA Click', count: sets.cta.size,     pct: sets.cta.size     / base },
    { step: 'lead',    label: 'Lead',      count: sets.lead.size,    pct: sets.lead.size    / base },
  ]
}

function computeSessionMetrics(events: ProjectEvent[]): SessionMetrics {
  const sessions = new Map<string, { duration: number; pageCount: number }>()
  for (const e of events) {
    if (e.event_type !== 'session_end' || !e.session_id) continue
    sessions.set(e.session_id, {
      duration:  Number(e.metadata?.duration_seconds ?? 0),
      pageCount: Number(e.metadata?.page_count       ?? 1),
    })
  }
  const list = Array.from(sessions.values())
  const total = list.length
  const avgDurationSeconds = total > 0 ? Math.round(list.reduce((s, v) => s + v.duration, 0) / total) : 0
  const bounced = list.filter(s => s.pageCount <= 1 && s.duration < 10).length
  return { totalSessions: total, avgDurationSeconds, bounceRate: total > 0 ? bounced / total : 0 }
}

function computeFirstTouchStats(leads: Array<{ first_touch_source?: string | null }>): FirstTouchStat[] {
  const map = new Map<string, number>()
  for (const l of leads) {
    const src = l.first_touch_source ?? 'direct'
    map.set(src, (map.get(src) ?? 0) + 1)
  }
  const total = leads.length || 1
  return Array.from(map.entries())
    .map(([source, cnt]) => ({ source, leads: cnt, pct: cnt / total }))
    .sort((a, b) => b.leads - a.leads)
}

function fmtDuration(secs: number): string {
  if (secs < 60) return `${secs}s`
  return `${Math.floor(secs / 60)}m ${secs % 60}s`
}

function fmt(rate: number) { return (rate * 100).toFixed(1) + '%' }

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; status?: string }>
}) {
  const { projectId, status: rawStatus } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')
  if (!projectId) return redirect('/dashboard')

  const { data: project } = await supabase
    .from('projects')
    .select('id, current_config, subdomain, custom_domain, subscription_status, subscription_plan_id')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()

  if (!project) return redirect('/dashboard')

  const allowed = isAnalyticsAllowed(project as any)
  const advanced = hasAdvancedAnalytics(project as any)
  const planType = getPlanType(project as any)

  const { data: leadsRaw } = await supabase
    .from('project_leads')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const { data: rawEvents } = await supabase
    .from('project_events')
    .select('event_type, page_slug, section_key, source, visitor_id, session_id, funnel_step, metadata, created_at')
    .eq('project_id', projectId)

  const allLeads = leadsRaw || []
  const events: ProjectEvent[] = (rawEvents || []) as ProjectEvent[]
  const siteName = (project.current_config as Record<string, any>)?.brand?.name || 'My Website'

  // Lead CRM filter
  const filterStatus: FilterStatus =
    rawStatus && rawStatus in STATUS_LABELS ? (rawStatus as FilterStatus) : 'all'
  const filteredLeads = filterStatus === 'all' ? allLeads : allLeads.filter(l => (l.status ?? 'new') === filterStatus)
  const leadCounts = {
    all:       allLeads.length,
    new:       allLeads.filter(l => (l.status ?? 'new') === 'new').length,
    contacted: allLeads.filter(l => l.status === 'contacted').length,
    closed:    allLeads.filter(l => l.status === 'closed').length,
  }

  // Analytics aggregations
  const totalViews = events.filter(e => e.event_type === 'page_view').length
  const totalLeadEvents = events.filter(e => e.event_type.startsWith('lead_')).length
  const totalCTAClicks = events.filter(e => e.event_type === 'cta_click').length
  const totalMapInteracts = events.filter(e => e.event_type === 'map_interact').length
  const overallConversion = totalViews > 0 ? totalLeadEvents / totalViews : 0
  const overallInteractionRate = totalViews > 0 ? (totalCTAClicks + totalMapInteracts) / totalViews : 0

  const pageStats      = computePageStats(events)
  const sectionStats   = computeSectionStats(events, totalViews)
  const sourceStats    = computeSourceStats(events)
  const geoStats       = computeGeoStats(events)
  const peakHourStats  = computePeakHourStats(events)
  const visitorStats   = computeVisitorStats(events)
  const funnelStats    = computeFunnelStats(events)
  const sessionMetrics = computeSessionMetrics(events)
  const firstTouchStats = computeFirstTouchStats(allLeads)

  const topSection = sectionStats[0]
  const topGeo = geoStats[0]
  const bestPage = [...pageStats].sort((a, b) => b.conversion_rate - a.conversion_rate)[0]
  const peakHour = [...peakHourStats].sort((a, b) => b.count - a.count)[0]
  const hasEventData = events.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pt-8 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              Leads & Analytics
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground">{siteName}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              All Time
            </span>
          </div>
        </div>

        {/* ── SECTION 1: LEADS (most important to client) ─────────────────── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Your Leads</h2>
            <span className="ml-auto text-[10px] font-bold text-muted-foreground">{allLeads.length} total</span>
          </div>

          {/* Lead type summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads',      icon: Users,         color: 'text-primary',    bg: 'bg-primary/10',    count: allLeads.length },
              { label: 'Calls',            icon: Phone,         color: 'text-green-600',  bg: 'bg-green-500/10',  count: allLeads.filter(l => l.type === 'call').length },
              { label: 'Form Submissions', icon: FormInput,     color: 'text-blue-600',   bg: 'bg-blue-500/10',   count: allLeads.filter(l => l.type === 'form').length },
              { label: 'Messages',         icon: MessageSquare, color: 'text-sky-600',    bg: 'bg-sky-500/10',    count: allLeads.filter(l => l.type === 'messenger' || l.type === 'viber').length },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-black text-foreground">{stat.count}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lead status filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(STATUS_LABELS) as FilterStatus[]).map(s => (
              <Link
                key={s}
                href={`/dashboard/analytics?projectId=${projectId}&status=${s}`}
                className={`text-xs font-black px-4 py-2 rounded-full border transition-colors ${
                  filterStatus === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {STATUS_LABELS[s]}
                <span className="ml-1.5 opacity-60">{leadCounts[s]}</span>
              </Link>
            ))}
          </div>

          {/* Lead CRM list */}
          <div className="bg-card border border-border rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                {STATUS_LABELS[filterStatus]} Leads
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground">{filteredLeads.length} shown</span>
            </div>
            {filteredLeads.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-bold text-muted-foreground">No leads here yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {filterStatus === 'all'
                    ? 'Leads will appear once visitors interact with your site.'
                    : `No leads with status "${STATUS_LABELS[filterStatus]}" found.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLeads.map(lead => (
                  <LeadRow key={lead.id} lead={{
                    ...lead,
                    status: (lead.status ?? 'new') as 'new' | 'contacted' | 'closed',
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Lead breakdown bar */}
          {allLeads.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Lead Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Calls',            color: 'bg-green-500',  count: allLeads.filter(l => l.type === 'call').length },
                  { label: 'Form Submissions', color: 'bg-blue-500',   count: allLeads.filter(l => l.type === 'form').length },
                  { label: 'Messenger',        color: 'bg-sky-500',    count: allLeads.filter(l => l.type === 'messenger').length },
                  { label: 'Viber',            color: 'bg-indigo-500', count: allLeads.filter(l => l.type === 'viber').length },
                ].filter(s => s.count > 0).map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-muted-foreground w-36 shrink-0">{stat.label}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stat.color} transition-all duration-700`}
                        style={{ width: `${Math.round((stat.count / allLeads.length) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-foreground w-8 text-right">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: ANALYTICS ────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <BarChart3 className="w-4 h-4 text-primary mt-4" />
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground mt-4">Site Analytics</h2>
          </div>

          {!allowed ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-6 bg-card border border-border rounded-[32px] shadow-sm">
              <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary">
                <Lock className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-sm">
                <h2 className="text-2xl font-black tracking-tight">Analytics is Locked</h2>
                <p className="text-sm text-muted-foreground">
                  Upgrade to a paid plan to unlock visitor insights, lead tracking, and performance heatmaps for {siteName}.
                </p>
              </div>
              <Link
                href={`/dashboard?projectId=${projectId}&tab=settings`}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all"
              >
                View Plans & Upgrade
              </Link>
            </div>
          ) : (
            <>
              {/* Conversion insight cards */}
              {!advanced ? (
                <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-black tracking-tight">Unlock Advanced Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      You&apos;re on the <span className="font-bold text-foreground capitalize">{planType}</span> plan.
                      Upgrade to <span className="font-bold text-foreground">Pro</span> to unlock conversion rates, section heatmaps, and traffic source analysis.
                    </p>
                  </div>
                  <Link
                    href={`/dashboard?projectId=${projectId}&tab=settings`}
                    className="px-6 py-3 bg-primary/10 text-primary rounded-full font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Upgrade to Pro
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Conversion Insights
                    </h3>
                    {!hasEventData && (
                      <p className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-xl px-4 py-3">
                        No event data yet. Page views and CTA clicks will appear here once visitors interact with your site.
                      </p>
                    )}
                  </div>

                  {hasEventData && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{fmt(overallConversion)}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Overall Conversion</p>
                          <p className="text-[10px] text-muted-foreground">{totalViews} views → {totalLeadEvents} leads</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <MousePointerClick className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{fmt(overallInteractionRate)}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interaction Rate</p>
                          <p className="text-[10px] text-muted-foreground">{totalCTAClicks + totalMapInteracts} actions / {totalViews} views</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Clock className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{peakHour ? `${peakHour.hour}:00` : '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peak Hour</p>
                          <p className="text-[10px] text-muted-foreground">Most active time of day</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground truncate">{topGeo?.city ?? '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top City</p>
                          <p className="text-[10px] text-muted-foreground">{topGeo ? `${topGeo.count} visitors` : 'No data'}</p>
                        </div>
                      </div>

                      {/* ── Visitor Identity Cards ──────────────────────────── */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
                            <Users className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{visitorStats.total || '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unique Visitors</p>
                          <p className="text-[10px] text-muted-foreground">Identified by visitor ID</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{visitorStats.returning > 0 ? fmt(visitorStats.returnRate) : '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Return Rate</p>
                          <p className="text-[10px] text-muted-foreground">{visitorStats.returning} returning / {visitorStats.newVisitors} new</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                            <Clock className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{sessionMetrics.totalSessions > 0 ? fmtDuration(sessionMetrics.avgDurationSeconds) : '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg Session</p>
                          <p className="text-[10px] text-muted-foreground">{sessionMetrics.totalSessions} sessions tracked</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                            <MousePointerClick className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-foreground">{sessionMetrics.totalSessions > 0 ? fmt(sessionMetrics.bounceRate) : '—'}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bounce Rate</p>
                          <p className="text-[10px] text-muted-foreground">&lt;10s single-page sessions</p>
                        </div>
                      </div>

                      {bestPage && bestPage.views > 0 && (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <TrendingUp className="w-5 h-5 text-primary shrink-0" />
                          <p className="text-sm font-bold text-foreground">
                            Best converting page: <span className="text-primary">/{bestPage.page_slug}</span>
                            {' '}— <span className="text-primary">{fmt(bestPage.conversion_rate)}</span> conversion rate
                            ({bestPage.leads} leads from {bestPage.views} views)
                          </p>
                        </div>
                      )}

                      {topSection && topSection.leads > 0 && (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                          <Layers className="w-5 h-5 text-green-600 shrink-0" />
                          <p className="text-sm font-bold text-foreground">
                            <span className="text-green-600 capitalize">{topSection.section_key}</span> generates the most leads
                            {' '}— <span className="text-green-600">{topSection.leads}</span> total lead{topSection.leads !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}

                      {pageStats.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Page Performance</h3>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Page</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Views</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leads</th>
                                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conv. %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {pageStats.map((row) => (
                                  <tr key={row.page_slug} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-bold text-foreground">/{row.page_slug}</td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">{row.views}</td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">{row.leads}</td>
                                    <td className="px-6 py-3 text-right">
                                      <span className={`font-black ${row.conversion_rate > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {fmt(row.conversion_rate)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {sectionStats.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                              <Layers className="w-4 h-4 text-primary" />
                              Section Performance Heatmap
                            </h3>
                            <span className="text-[10px] font-bold text-muted-foreground">{sectionStats.length} sections</span>
                          </div>
                          <div className="px-6 py-5 space-y-3 border-b border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Scroll Reach</p>
                            {sectionStats.map((row) => {
                              const pctVal = Math.round(row.viewRate * 100)
                              const barColor = pctVal >= 40 ? 'bg-primary' : pctVal >= 20 ? 'bg-orange-400' : 'bg-muted-foreground/40'
                              return (
                                <div key={row.section_key} className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-foreground capitalize w-28 shrink-0 truncate">{row.section_key}</span>
                                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.min(pctVal, 100)}%` }} />
                                  </div>
                                  <span className="text-xs font-black text-foreground w-10 text-right">{pctVal}%</span>
                                </div>
                              )
                            })}
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-10">Rank</th>
                                  <th className="text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Section</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Views</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clicks</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leads</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conv %</th>
                                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {sectionStats.map((row) => {
                                  const convPct = Math.round(row.conversionRate * 100)
                                  const intensity = convPct >= 40 ? 'bg-primary/10' : convPct >= 20 ? 'bg-orange-500/10' : ''
                                  return (
                                    <tr key={row.section_key} className={`hover:bg-muted/20 transition-colors ${intensity}`}>
                                      <td className="px-4 py-3 text-center"><span className="text-[10px] font-black text-muted-foreground">#{row.rank}</span></td>
                                      <td className="px-4 py-3 font-bold text-foreground capitalize">{row.section_key}</td>
                                      <td className="px-4 py-3 text-right text-muted-foreground">{row.sectionViews}</td>
                                      <td className="px-4 py-3 text-right text-muted-foreground">{row.clicks}</td>
                                      <td className="px-4 py-3 text-right text-muted-foreground">{row.leads}</td>
                                      <td className="px-4 py-3 text-right">
                                        <span className={`font-black ${convPct >= 40 ? 'text-primary' : convPct >= 20 ? 'text-orange-500' : 'text-muted-foreground'}`}>{convPct}%</span>
                                      </td>
                                      <td className="px-6 py-3 text-right"><span className="font-black text-foreground">{(row.engagementScore * 100).toFixed(1)}</span></td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* ── Conversion Funnel ──────────────────────────────── */}
                      {funnelStats[0]?.count > 0 && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              Conversion Funnel
                            </h3>
                          </div>
                          <div className="p-6 space-y-3">
                            {funnelStats.map((step, i) => {
                              const prev = funnelStats[i - 1]
                              const dropOff = prev ? Math.round((1 - step.count / (prev.count || 1)) * 100) : 0
                              const barPct = Math.round(step.pct * 100)
                              const barColor = barPct >= 60 ? 'bg-primary' : barPct >= 30 ? 'bg-orange-400' : 'bg-rose-400'
                              return (
                                <div key={step.step}>
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-black text-foreground w-20 shrink-0">{step.label}</span>
                                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${barPct}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-foreground w-16 text-right">{step.count} ({barPct}%)</span>
                                  </div>
                                  {i > 0 && dropOff > 0 && (
                                    <p className="text-[10px] text-rose-500 font-bold ml-23 pl-24">↓ {dropOff}% dropped off before this step</p>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {sourceStats.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Last-Touch Traffic Source</h3>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Views</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leads</th>
                                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conv. %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {sourceStats.map((row) => (
                                  <tr key={row.source} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-bold text-foreground">{row.source}</td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">{row.views}</td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">{row.leads}</td>
                                    <td className="px-6 py-3 text-right">
                                      <span className={`font-black ${row.conversion_rate > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                        {fmt(row.conversion_rate)}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* ── First-Touch Attribution ─────────────────────────── */}
                      {firstTouchStats.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">First-Touch Attribution</h3>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">First Source</th>
                                  <th className="text-right px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Leads</th>
                                  <th className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {firstTouchStats.map((row) => (
                                  <tr key={row.source} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-bold text-foreground">{row.source}</td>
                                    <td className="px-4 py-3 text-right text-muted-foreground">{row.leads}</td>
                                    <td className="px-6 py-3 text-right">
                                      <span className="font-black text-primary">{fmt(row.pct)}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              Peak Interaction Heatmap
                            </h3>
                          </div>
                          <div className="p-6">
                            <div className="grid grid-cols-12 gap-1">
                              {peakHourStats.map((stat) => {
                                const maxCount = Math.max(...peakHourStats.map(s => s.count))
                                const intensity = maxCount > 0 ? stat.count / maxCount : 0
                                const color = intensity > 0.8 ? 'bg-primary' : intensity > 0.5 ? 'bg-primary/60' : intensity > 0.2 ? 'bg-primary/30' : 'bg-muted'
                                return (
                                  <div key={stat.hour} className="group relative">
                                    <div className={`h-8 rounded-sm ${color} transition-all`} />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                      {stat.hour}:00 — {stat.count} events
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground px-1">
                              <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                              <Globe className="w-4 h-4 text-primary" />
                              Visitor Locations
                            </h3>
                          </div>
                          <div className="p-6 space-y-4">
                            {geoStats.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-4">No location data available yet.</p>
                            ) : (
                              geoStats.map((geo) => (
                                <div key={`${geo.city}-${geo.region}`} className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-bold text-foreground truncate">{geo.city}, {geo.region}</span>
                                      <span className="text-xs font-black text-primary">{geo.count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary rounded-full" style={{ width: `${(geo.count / (geoStats[0]?.count || 1)) * 100}%` }} />
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <SeoAuditPanel config={project.current_config as Record<string, any>} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

      </main>
    </div>
  )
}
