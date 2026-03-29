import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3, Phone, MessageSquare, FormInput, ChevronLeft,
  TrendingUp, MousePointerClick, Globe, Users, Lock, Sparkles,
  MapPin, Download, Shield, Activity, Repeat2, ArrowRight,
  Play, Eye,
} from 'lucide-react'
import SeoAuditPanel from '@/components/dashboard/SeoAuditPanel'
import LeadRow from '@/components/dashboard/LeadRow'
import { isAnalyticsAllowed, hasAdvancedAnalytics, getPlanType } from '@/lib/subscription'

export const dynamic = "force-dynamic"
export const revalidate = 0

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

type PageStat = { page_slug: string; views: number; leads: number; conversion_rate: number }
type SectionStat = {
  section_key: string; sectionViews: number; clicks: number; leads: number
  viewRate: number; conversionRate: number; rank: number
}
type SourceStat = { source: string; views: number; leads: number; conversion_rate: number }
type FunnelStat = { step: string; label: string; count: number; pct: number; dropPct: number }
type SessionReplayStat = { session_id: string; visitor_id: string | null; page_slug: string | null; duration_ms: number | null; started_at: string }

const STATUS_LABELS = { all: 'All', new: 'New', contacted: 'Contacted', closed: 'Closed' } as const
type FilterStatus = keyof typeof STATUS_LABELS
const RANGE_LABELS: Record<string, string> = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days', all: 'All Time' }

function computeQualityScore(lead: Record<string, any>): number {
  const meta = lead.metadata || {}
  let score = 0
  if (meta.name) score++
  if (meta.email || meta.phone) score++
  if (meta.geo_city || meta.geo_country) score++
  if (lead.source || lead.first_touch_source) score++
  return score
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
  const map = new Map<string, { uniqueVisitors: Set<string>; clicks: number; leads: number }>()
  for (const e of events) {
    if (!['section_view', 'cta_click', 'lead_form', 'lead_call', 'lead_messenger', 'lead_viber', 'map_interact'].includes(e.event_type)) continue
    const key = e.section_key ?? '(unknown)'
    if (!map.has(key)) map.set(key, { uniqueVisitors: new Set(), clicks: 0, leads: 0 })
    const s = map.get(key)!
    if (e.event_type === 'section_view') {
      const vid = e.visitor_id || e.session_id
      if (vid) s.uniqueVisitors.add(vid)
    }
    if (e.event_type === 'cta_click') s.clicks++
    if (e.event_type.startsWith('lead_')) s.leads++
  }
  const rows = Array.from(map.entries()).map(([section_key, s], i) => {
    const sectionViews = s.uniqueVisitors.size
    const viewRate = totalVisitors > 0 ? Math.min(sectionViews / totalVisitors, 1) : 0
    const conversionRate = sectionViews > 0 ? s.leads / sectionViews : 0
    return { section_key, sectionViews, clicks: s.clicks, leads: s.leads, viewRate, conversionRate, rank: i + 1 }
  })
  rows.sort((a, b) => b.sectionViews - a.sectionViews)
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
    .sort((a, b) => b.views - a.views)
}

function computeFunnelStats(events: ProjectEvent[]): FunnelStat[] {
  const pageViews = new Set<string>()
  const ctaClicks = new Set<string>()
  const formSubmits = new Set<string>()

  for (const e of events) {
    const id = e.visitor_id || e.session_id
    if (!id) continue
    if (e.event_type === 'page_view') pageViews.add(id)
    if (e.event_type === 'cta_click') ctaClicks.add(id)
    if (e.event_type === 'form_submit' || e.event_type === 'lead_form' || e.event_type === 'lead_submit') formSubmits.add(id)
  }

  const base = pageViews.size || 1
  const steps = [
    { step: 'page_view',    label: 'Page View',    count: pageViews.size },
    { step: 'cta_click',    label: 'CTA Click',    count: ctaClicks.size },
    { step: 'form_submit',  label: 'Form Submit',  count: formSubmits.size },
  ]
  return steps.map((s, i) => {
    const prev = i === 0 ? base : (steps[i - 1].count || 1)
    const dropPct = i === 0 ? 0 : Math.round((1 - s.count / prev) * 100)
    return { ...s, pct: s.count / base, dropPct }
  })
}

function computeUniqueSessions(events: ProjectEvent[]): number {
  const sessions = new Set<string>()
  for (const e of events) {
    if (e.session_id) sessions.add(e.session_id)
  }
  return sessions.size
}

function computeTopSource(sources: SourceStat[]): string {
  return sources.length > 0 ? sources[0].source : '—'
}

function fmt(rate: number, denominator?: number) {
  if (denominator !== undefined && denominator === 0) return '—'
  return (rate * 100).toFixed(1) + '%'
}

function trendArrow(current: number, previous: number): { symbol: string; color: string } | null {
  if (previous === 0) return null
  const delta = ((current - previous) / previous) * 100
  if (Math.abs(delta) < 5) return null
  return delta > 0
    ? { symbol: `↑ ${Math.round(delta)}%`, color: 'text-emerald-500' }
    : { symbol: `↓ ${Math.abs(Math.round(delta))}%`, color: 'text-red-500' }
}

function fmtDuration(ms: number | null): string {
  if (!ms) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string; range?: string; page?: string; projectId?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const sp = await searchParams
  const projectIdParam = sp.projectId ?? null

  let projectQuery = supabase
    .from('projects')
    .select('id, subdomain, subscription_status, subscription_plan_id')
    .eq('client_id', user.id)
  if (projectIdParam) projectQuery = projectQuery.eq('id', projectIdParam)
  const { data: project, error: projectError } = await projectQuery.limit(1).maybeSingle()

  if (projectError) console.error('[analytics] project fetch error:', projectError.message)
  if (!project) redirect('/dashboard')

  const activeTab = sp.tab ?? 'leads'
  const filterStatus = (sp.status ?? 'all') as FilterStatus
  const dateRange = sp.range ?? '30d'
  const currentPage = parseInt(sp.page ?? '1', 10)
  const LEADS_PER_PAGE = 20

  const analyticsAllowed = isAnalyticsAllowed(project)
  const advancedAllowed = hasAdvancedAnalytics(project)
  const planType = getPlanType(project)

  // Date range filter
  let rangeStart: string | null = null
  const now = new Date()
  if (dateRange === '7d') rangeStart = new Date(now.getTime() - 7 * 86400000).toISOString()
  else if (dateRange === '30d') rangeStart = new Date(now.getTime() - 30 * 86400000).toISOString()
  else if (dateRange === '90d') rangeStart = new Date(now.getTime() - 90 * 86400000).toISOString()

  // Fetch leads
  let leadsQuery = supabase
    .from('project_leads')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
  if (rangeStart) leadsQuery = leadsQuery.gte('created_at', rangeStart)
  const { data: allLeadsRaw = [] } = await leadsQuery
  const allLeads = allLeadsRaw ?? []

  // Fetch events (exclude preview)
  let eventsQuery = supabase
    .from('project_events')
    .select('event_type, page_slug, section_key, source, visitor_id, session_id, funnel_step, metadata, created_at')
    .eq('project_id', project.id)
    .not('page_slug', 'like', '/preview/%')
    .not('page_slug', 'like', 'preview/%')
    .order('created_at', { ascending: false })
  if (rangeStart) eventsQuery = eventsQuery.gte('created_at', rangeStart)
  const { data: allEvents = [] } = await eventsQuery

  // Fetch previous period events for trend comparison
  let prevEvents: ProjectEvent[] = []
  if (rangeStart && dateRange !== 'all') {
    const periodMs = now.getTime() - new Date(rangeStart).getTime()
    const prevEnd = rangeStart
    const prevStart = new Date(new Date(rangeStart).getTime() - periodMs).toISOString()
    const { data: prevRaw = [] } = await supabase
      .from('project_events')
      .select('event_type, page_slug, section_key, source, visitor_id, session_id, funnel_step, metadata, created_at')
      .eq('project_id', project.id)
      .not('page_slug', 'like', '/preview/%')
      .not('page_slug', 'like', 'preview/%')
      .gte('created_at', prevStart)
      .lt('created_at', prevEnd)
    prevEvents = (prevRaw ?? []) as ProjectEvent[]
  }

  // Fetch session replays
  let replaysQuery = supabase
    .from('session_replays')
    .select('session_id, visitor_id, page_slug, duration_ms, started_at')
    .eq('project_id', project.id)
    .order('started_at', { ascending: false })
    .limit(50)
  if (rangeStart) replaysQuery = replaysQuery.gte('started_at', rangeStart)
  const { data: replaysRaw = [], error: replaysError } = await replaysQuery
  if (replaysError) console.warn('[analytics] replays fetch error (RLS?):', replaysError.message)
  const replays = replaysRaw ?? []

  const events = allEvents as ProjectEvent[]

  // Compute stats
  const totalLeads = (allLeads as any[]).length
  const qualityLeads = (allLeads as any[]).filter((l: any) => computeQualityScore(l) >= 3).length
  const botLeads = (allLeads as any[]).filter((l: any) => computeQualityScore(l) === 0).length

  const totalSessions = computeUniqueSessions(events)
  const totalUniqueVisitors = new Set(events.filter(e => e.visitor_id).map(e => e.visitor_id!)).size
  const pageViewEvents = events.filter(e => e.event_type === 'page_view')
  const totalPageViews = pageViewEvents.length
  const conversionRate = totalPageViews > 0 ? totalLeads / totalPageViews : 0

  // Previous period stats for trends
  const prevSessions = computeUniqueSessions(prevEvents)
  const prevLeads = prevEvents.filter(e => e.event_type.startsWith('lead_') || e.event_type === 'form_submit').length
  const prevPageViews = prevEvents.filter(e => e.event_type === 'page_view').length
  const prevConvRate = prevPageViews > 0 ? prevLeads / prevPageViews : 0
  const sessionTrend = trendArrow(totalSessions, prevSessions)
  const leadTrend = trendArrow(totalLeads, prevLeads)
  const convTrend = trendArrow(conversionRate, prevConvRate)
  const FUNNEL_MIN_SESSIONS = 10

  const pageStats = computePageStats(events)
  const sectionStats = computeSectionStats(events, totalUniqueVisitors)
  const sourceStats = computeSourceStats(events)
  const funnelStats = computeFunnelStats(events)
  const topSource = computeTopSource(sourceStats)

  // Returning visitors
  const visitorSessionMap = new Map<string, Set<string>>()
  for (const e of events) {
    if (e.event_type !== 'page_view' || !e.visitor_id) continue
    if (!visitorSessionMap.has(e.visitor_id)) visitorSessionMap.set(e.visitor_id, new Set())
    if (e.session_id) visitorSessionMap.get(e.visitor_id)!.add(e.session_id)
  }
  const returningVisitors = Array.from(visitorSessionMap.values()).filter(s => s.size > 1).length

  // Filter leads
  const filteredLeads = (allLeads as any[]).filter((l: any) => filterStatus === 'all' || l.status === filterStatus)
  const totalFilteredLeads = filteredLeads.length
  const totalPages = Math.ceil(totalFilteredLeads / LEADS_PER_PAGE)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE)

  const isAdmin = profile?.role === 'admin' || profile?.role === 'sub_admin'

  function buildUrl(params: Record<string, string>) {
    const base: Record<string, string> = { tab: activeTab, status: filterStatus, range: dateRange, page: String(currentPage) }
    if (projectIdParam) base.projectId = projectIdParam
    Object.entries(params).forEach(([k, v]) => { base[k] = v })
    return `/dashboard/analytics?${new URLSearchParams(base).toString()}`
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold">Leads &amp; Analytics</h1>
              <p className="text-sm text-muted-foreground">{project.subdomain}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range */}
            {(['7d', '30d', '90d', 'all'] as const).map(r => (
              <Link key={r} href={buildUrl({ range: r, page: '1' })}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${dateRange === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {RANGE_LABELS[r]}
              </Link>
            ))}
            {/* CSV export */}
            <Link href={`/api/leads/export?project_id=${project.id}${rangeStart ? `&from=${rangeStart}` : ''}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 border-t">
          {[
            { id: 'leads', label: 'Leads CRM', icon: FormInput },
            { id: 'analytics', label: 'Site Analytics', icon: BarChart3 },
            { id: 'replays', label: 'Session Replays', icon: Play },
            { id: 'seo', label: 'SEO Audit', icon: Globe },
          ].map(({ id, label, icon: Icon }) => (
            <Link key={id} href={buildUrl({ tab: id, page: '1' })}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── TOP METRIC CARDS (always visible) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Activity className="w-4 h-4" />
              Sessions
            </div>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{totalUniqueVisitors} unique visitors</span>
              {sessionTrend && <span className={`text-xs font-medium ${sessionTrend.color}`}>{sessionTrend.symbol}</span>}
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Conversion Rate
            </div>
            <div className="text-2xl font-bold">{totalPageViews > 0 ? fmt(conversionRate) : '—'}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{totalPageViews} page views</span>
              {convTrend && <span className={`text-xs font-medium ${convTrend.color}`}>{convTrend.symbol}</span>}
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Users className="w-4 h-4" />
              Total Leads
            </div>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{qualityLeads} quality leads</span>
              {leadTrend && <span className={`text-xs font-medium ${leadTrend.color}`}>{leadTrend.symbol}</span>}
            </div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Globe className="w-4 h-4" />
              Top Source
            </div>
            <div className="text-2xl font-bold truncate">{topSource}</div>
            <div className="text-xs text-muted-foreground mt-1">{returningVisitors} returning visitors</div>
          </div>
        </div>

        {/* ── LEADS CRM TAB ── */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {botLeads > 0 && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-lg px-4 py-3 text-sm">
                <Shield className="w-4 h-4 shrink-0" />
                <span>{botLeads} lead{botLeads !== 1 ? 's' : ''} flagged as low-quality (score 0) — possible bot submissions.</span>
              </div>
            )}

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(STATUS_LABELS) as FilterStatus[]).map(s => (
                <Link key={s} href={buildUrl({ status: s, page: '1' })}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${filterStatus === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {STATUS_LABELS[s]}
                  {s === 'all' && <span className="ml-1.5 text-xs opacity-70">{totalLeads}</span>}
                </Link>
              ))}
            </div>

            {/* Lead type breakdown */}
            {totalLeads > 0 && (
              <div className="bg-card border rounded-lg p-4">
                <p className="text-sm font-medium mb-3">Lead Breakdown</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { type: 'form', label: 'Form', icon: FormInput },
                    { type: 'call', label: 'Call', icon: Phone },
                    { type: 'messenger', label: 'Messenger', icon: MessageSquare },
                    { type: 'viber', label: 'Viber', icon: MessageSquare },
                  ].map(({ type, label, icon: Icon }) => {
                    const count = (allLeads as any[]).filter((l: any) => l.type === type).length
                    return (
                      <div key={type} className="bg-muted/40 rounded-lg px-4 py-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{label}</span>
                        </div>
                        <span className="text-2xl font-bold tabular-nums leading-none">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Leads list */}
            {paginatedLeads.length === 0 ? (
              <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No leads yet</p>
                <p className="text-sm mt-1">Leads from your contact forms will appear here.</p>
              </div>
            ) : (
              <div className="bg-card border rounded-lg divide-y">
                {paginatedLeads.map((lead: any) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {(currentPage - 1) * LEADS_PER_PAGE + 1}–{Math.min(currentPage * LEADS_PER_PAGE, totalFilteredLeads)} of {totalFilteredLeads}
                </span>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link href={buildUrl({ page: String(currentPage - 1) })} className="px-3 py-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link href={buildUrl({ page: String(currentPage + 1) })} className="px-3 py-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          !analyticsAllowed ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <Lock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold text-lg mb-1">Analytics Locked</p>
              <p className="text-muted-foreground text-sm mb-4">Upgrade to a paid plan to unlock full site analytics.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4" /> Upgrade Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Real Conversion Funnel */}
              <div className="bg-card border rounded-lg p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Conversion Funnel
                </h2>
                {totalSessions < FUNNEL_MIN_SESSIONS ? (
                  <p className="text-sm text-muted-foreground">Not enough data yet — funnel requires at least {FUNNEL_MIN_SESSIONS} sessions (currently {totalSessions}).</p>
                ) : funnelStats[0].count === 0 ? (
                  <p className="text-sm text-muted-foreground">No page view data yet — funnel will populate as visitors arrive.</p>
                ) : (
                  <div className="space-y-2">
                    {funnelStats.map((step, i) => (
                      <div key={step.step}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{step.label}</span>
                          <span className="text-muted-foreground">{step.count.toLocaleString()} visitors ({funnelStats[0].count > 0 ? fmt(step.pct, funnelStats[0].count) : '—'})</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(step.pct * 100, 0.5)}%` }} />
                        </div>
                        {i < funnelStats.length - 1 && step.dropPct > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 ml-1">
                            <ArrowRight className="w-3 h-3" />
                            {step.dropPct}% dropped off
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Pages + Traffic Sources side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Top Pages */}
                <div className="bg-card border rounded-lg p-5">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Top Pages
                  </h2>
                  {pageStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No page views yet.</p>
                  ) : (
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                        <span className="col-span-2">Page</span>
                        <span className="text-right">Views</span>
                        <span className="text-right">Conv %</span>
                      </div>
                      {pageStats.slice(0, 8).map(p => (
                        <div key={p.page_slug} className="grid grid-cols-4 text-sm py-1.5 border-b border-muted/50 last:border-0">
                          <span className="col-span-2 truncate text-muted-foreground font-mono text-xs">{p.page_slug}</span>
                          <span className="text-right font-medium">{p.views}</span>
                          <span className="text-right text-muted-foreground">{fmt(p.conversion_rate, p.views)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Traffic Sources */}
                <div className="bg-card border rounded-lg p-5">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Traffic Sources
                  </h2>
                  {sourceStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No traffic data yet.</p>
                  ) : (
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                        <span className="col-span-2">Source</span>
                        <span className="text-right">Views</span>
                        <span className="text-right">Leads</span>
                      </div>
                      {sourceStats.slice(0, 8).map(s => (
                        <div key={s.source} className="grid grid-cols-4 text-sm py-1.5 border-b border-muted/50 last:border-0">
                          <span className="col-span-2 truncate text-muted-foreground">{s.source}</span>
                          <span className="text-right font-medium">{s.views}</span>
                          <span className="text-right text-muted-foreground">{s.leads}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section Heatmap */}
              {advancedAllowed && sectionStats.length > 0 && (
                <div className="bg-card border rounded-lg p-5">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-primary" />
                    Section Engagement
                  </h2>
                  <div className="space-y-1">
                    <div className="grid grid-cols-5 text-xs text-muted-foreground font-medium pb-2 border-b">
                      <span className="col-span-2">Section</span>
                      <span className="text-right">Reach</span>
                      <span className="text-right">Clicks</span>
                      <span className="text-right">Conv %</span>
                    </div>
                    {sectionStats.slice(0, 12).map(s => (
                      <div key={s.section_key} className="grid grid-cols-5 text-sm py-1.5 border-b border-muted/50 last:border-0">
                        <span className="col-span-2 truncate text-muted-foreground font-mono text-xs">{s.section_key}</span>
                        <span className="text-right font-medium">{fmt(s.viewRate, totalUniqueVisitors)}</span>
                        <span className="text-right text-muted-foreground">{s.clicks}</span>
                        <span className="text-right text-muted-foreground">{fmt(s.conversionRate, s.sectionViews)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Returning Visitors */}
              <div className="bg-card border rounded-lg p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Repeat2 className="w-4 h-4 text-primary" />
                  Visitor Loyalty
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalUniqueVisitors}</div>
                    <div className="text-xs text-muted-foreground mt-1">Unique Visitors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{returningVisitors}</div>
                    <div className="text-xs text-muted-foreground mt-1">Returning</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalUniqueVisitors > 0 ? fmt(returningVisitors / totalUniqueVisitors, totalUniqueVisitors) : '—'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Return Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* ── SESSION REPLAYS TAB ── */}
        {activeTab === 'replays' && (
          !advancedAllowed ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <Lock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold text-lg mb-1">Session Replays — Pro Feature</p>
              <p className="text-muted-foreground text-sm mb-4">Upgrade to Pro or higher to watch visitor session recordings.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                <Sparkles className="w-4 h-4" /> Upgrade Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-5">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary" />
                  Recent Sessions
                  <span className="ml-auto text-xs text-muted-foreground font-normal">{(replays as any[]).length} recorded</span>
                </h2>
                {(replays as any[]).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Play className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No session recordings yet</p>
                    <p className="text-sm mt-1">Recordings will appear here as visitors browse your site.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-2 border-b">
                      <span className="col-span-2">Session</span>
                      <span className="text-right">Duration</span>
                      <span className="text-right">Date</span>
                    </div>
                    {(replays as SessionReplayStat[]).map(r => (
                      <div key={r.session_id} className="grid grid-cols-4 text-sm py-2 border-b border-muted/50 last:border-0 items-center">
                        <div className="col-span-2">
                          <div className="font-mono text-xs text-muted-foreground truncate">{r.session_id.slice(0, 16)}…</div>
                          <div className="text-xs text-muted-foreground/60 truncate">{r.page_slug || '/'}</div>
                        </div>
                        <span className="text-right text-muted-foreground">{fmtDuration(r.duration_ms)}</span>
                        <span className="text-right text-muted-foreground text-xs">
                          {new Date(r.started_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* ── SEO AUDIT TAB ── */}
        {activeTab === 'seo' && (
          <SeoAuditPanel config={{}} />
        )}
      </div>
    </div>
  )
}
