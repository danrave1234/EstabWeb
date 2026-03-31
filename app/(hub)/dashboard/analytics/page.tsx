import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3, Phone, MessageSquare, FormInput, ChevronLeft,
  TrendingUp, MousePointerClick, Globe, Users, Lock, Sparkles,
  Download, Shield, Activity, Repeat2, ArrowRight, ChevronDown,
  Eye,
} from 'lucide-react'
import LeadRow from '@/components/dashboard/LeadRow'
import SectionAttentionBreakdown from '@/components/dashboard/SectionAttentionBreakdown'
import { isAnalyticsAllowed, hasAdvancedAnalytics } from '@/lib/subscription'
import { readSectionMetaFromEvent } from '@/lib/analytics/section-insights'

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

type ProjectLead = {
  id: string
  session_id: string | null
  source: string | null
  page_slug: string | null
  section_key: string | null
  metadata: Record<string, any> | null
  created_at: string
}

type PageStat = { page_slug: string; views: number; leads: number; conversion_rate: number }
type SectionPerformanceStat = {
  section_key: string
  section_slot: string
  section_label: string
  section_family: string
  section_variant: string
  section_goal: string
  isInteractive: boolean
  interactionType: string
  interactionLabel: string
  sectionViews: number
  attentiveSessions: number
  totalAttentionMs: number
  avgAttentionMs: number
  avgAttentionSeconds: number
  attentionReachRate: number
  clicks: number
  leads: number
  assistedLeads: number
  viewRate: number
  clickRate: number
  conversionRate: number
  assistedRate: number
  confidenceLabel: string
  confidenceTone: string
  rank: number
}

function getPageVersionId(metadata?: Record<string, any> | null) {
  return typeof metadata?.page_version_id === 'string' && metadata.page_version_id.trim().length > 0
    ? metadata.page_version_id
    : null
}

function getLatestPageVersionId(events: ProjectEvent[], leads: ProjectLead[]) {
  const versions = [
    ...events.map((event) => getPageVersionId(event.metadata)),
    ...leads.map((lead) => getPageVersionId(lead.metadata)),
  ].filter(Boolean) as string[]

  if (versions.length === 0) return null

  return versions.reduce((latest, current) => {
    const latestNum = Number(latest)
    const currentNum = Number(current)
    if (Number.isFinite(latestNum) && Number.isFinite(currentNum)) {
      return currentNum > latestNum ? current : latest
    }
    return current > latest ? current : latest
  })
}

function filterByLatestVersion(events: ProjectEvent[], leads: ProjectLead[]) {
  const latestPageVersionId = getLatestPageVersionId(events, leads)
  if (!latestPageVersionId) {
    return { events, leads, latestPageVersionId: null }
  }

  return {
    latestPageVersionId,
    events: events.filter((event) => {
      const versionId = getPageVersionId(event.metadata)
      return versionId === null || versionId === latestPageVersionId
    }),
    leads: leads.filter((lead) => {
      const versionId = getPageVersionId(lead.metadata)
      return versionId === null || versionId === latestPageVersionId
    }),
  }
}
type SourceStat = { source: string; views: number; leads: number; conversion_rate: number }
type FunnelStat = { step: string; label: string; count: number; pct: number; dropPct: number; summary: string }
type SessionSummary = {
  sessionId: string
  pagesViewed: Set<string>
  sectionsViewed: Set<string>
  maxScrollDepth: number
  totalAttentionMs: number
  ctaClicked: boolean
  converted: boolean
}
type Recommendation = { title: string; detail: string }

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

function computePageStats(events: ProjectEvent[], leads: ProjectLead[]): PageStat[] {
  const map = new Map<string, { visits: Set<string>; leads: Set<string> }>()
  for (const e of events) {
    if (e.event_type !== 'page_view' || !e.session_id) continue
    const slug = e.page_slug ?? ''
    if (!map.has(slug)) map.set(slug, { visits: new Set<string>(), leads: new Set<string>() })
    map.get(slug)!.visits.add(e.session_id)
  }

  for (const lead of leads) {
    if (!lead.session_id) continue
    const slug = lead.page_slug ?? ''
    if (!map.has(slug)) map.set(slug, { visits: new Set<string>(), leads: new Set<string>() })
    map.get(slug)!.leads.add(lead.session_id)
  }

  return Array.from(map.entries())
    .map(([page_slug, s]) => {
      const views = s.visits.size
      const leadCount = s.leads.size
      return { page_slug: page_slug || '(home)', views, leads: leadCount, conversion_rate: views > 0 ? leadCount / views : 0 }
    })
    .sort((a, b) => b.views - a.views)
}

function computeSectionPerformanceStats(events: ProjectEvent[], leads: ProjectLead[], totalSessions: number): SectionPerformanceStat[] {
  const convertedSessions = new Set(leads.map((lead) => lead.session_id).filter(Boolean) as string[])
  const sessionSections = new Map<string, Set<string>>()
  const map = new Map<string, {
    section_slot: string
    section_label: string
    section_family: string
    section_variant: string
    section_goal: string
    isInteractive: boolean
    interactionType: string
    interactionLabel: string
    viewers: Set<string>
    attentiveSessions: Set<string>
    totalAttentionMs: number
    clickers: Set<string>
    leads: Set<string>
  }>()

  for (const e of events) {
    const sessionId = e.session_id
    const meta = readSectionMetaFromEvent(e.section_key, e.metadata)

    if (!meta) continue

    const sectionSlot = typeof e.metadata?.section_slot === 'string' ? e.metadata.section_slot : meta.sectionFamily
    const groupingKey = sectionSlot

    if (!map.has(groupingKey)) {
      map.set(groupingKey, {
        section_slot: sectionSlot,
        section_label: meta.sectionLabel,
        section_family: meta.sectionFamily,
        section_variant: meta.sectionVariant,
        section_goal: meta.sectionGoal,
        isInteractive: meta.isInteractive,
        interactionType: meta.interactionType,
        interactionLabel: meta.interactionLabel,
        viewers: new Set<string>(),
        attentiveSessions: new Set<string>(),
        totalAttentionMs: 0,
        clickers: new Set<string>(),
        leads: new Set<string>(),
      })
    }

    const stat = map.get(groupingKey)!
    if (e.event_type === 'section_view' && sessionId) {
      stat.viewers.add(sessionId)
      if (!sessionSections.has(sessionId)) sessionSections.set(sessionId, new Set())
      sessionSections.get(sessionId)!.add(groupingKey)
    }
    if (e.event_type === 'section_attention' && sessionId) {
      stat.attentiveSessions.add(sessionId)
      const visibleMs = Number(e.metadata?.visible_time_ms ?? 0)
      if (Number.isFinite(visibleMs) && visibleMs > 0) stat.totalAttentionMs += visibleMs
    }
    if (e.event_type === 'cta_click' && sessionId) stat.clickers.add(sessionId)
  }

  for (const sessionId of convertedSessions) {
    const sections = sessionSections.get(sessionId)
    if (!sections) continue
    for (const sectionKey of sections) {
      map.get(sectionKey)?.leads.add(sessionId)
    }
  }

  const rows = Array.from(map.entries()).map(([section_key, stat], index) => {
    const sectionViews = stat.viewers.size
    const attentiveSessions = stat.attentiveSessions.size
    const totalAttentionMs = stat.totalAttentionMs
    const avgAttentionMs = attentiveSessions > 0 ? totalAttentionMs / attentiveSessions : 0
    const avgAttentionSeconds = avgAttentionMs / 1000
    const clicks = stat.clickers.size
    const leads = stat.leads.size
    const assistedLeads = leads
    const viewRate = totalSessions > 0 ? Math.min(sectionViews / totalSessions, 1) : 0
    const attentionReachRate = totalSessions > 0 ? Math.min(attentiveSessions / totalSessions, 1) : 0
    const clickRate = sectionViews > 0 ? clicks / sectionViews : 0
    const conversionRate = sectionViews > 0 ? leads / sectionViews : 0
    const assistedRate = conversionRate
    const { label: confidenceLabel, tone: confidenceTone } = getConfidence(sectionViews)

    return {
      section_key,
      section_slot: stat.section_slot,
      section_label: stat.section_label,
      section_family: stat.section_family,
      section_variant: stat.section_variant,
      section_goal: stat.section_goal,
      isInteractive: stat.isInteractive,
      interactionType: stat.interactionType,
      interactionLabel: stat.interactionLabel,
      sectionViews,
      attentiveSessions,
      totalAttentionMs,
      avgAttentionMs,
      avgAttentionSeconds,
      attentionReachRate,
      clicks,
      leads,
      assistedLeads,
      viewRate,
      clickRate,
      conversionRate,
      assistedRate,
      confidenceLabel,
      confidenceTone,
      rank: index + 1,
    }
  })

  rows.sort((a, b) => {
    if (b.leads !== a.leads) return b.leads - a.leads
    if (b.clicks !== a.clicks) return b.clicks - a.clicks
    return b.sectionViews - a.sectionViews
  })
  rows.forEach((row, index) => { row.rank = index + 1 })
  return rows
}

function computeSessionSummaries(events: ProjectEvent[], leads: ProjectLead[]): SessionSummary[] {
  const convertedSessions = new Set(leads.map((lead) => lead.session_id).filter(Boolean) as string[])
  const map = new Map<string, SessionSummary>()

  for (const event of events) {
    const sessionId = event.session_id
    if (!sessionId) continue

    if (!map.has(sessionId)) {
      map.set(sessionId, {
        sessionId,
        pagesViewed: new Set<string>(),
        sectionsViewed: new Set<string>(),
        maxScrollDepth: 0,
        totalAttentionMs: 0,
        ctaClicked: false,
        converted: false,
      })
    }

    const summary = map.get(sessionId)!
    if (event.page_slug) summary.pagesViewed.add(event.page_slug)
    if (event.event_type === 'section_view') {
      const slot = typeof event.metadata?.section_slot === 'string' ? event.metadata.section_slot : event.section_key
      if (slot) summary.sectionsViewed.add(slot)
    }
    if (event.event_type === 'cta_click') summary.ctaClicked = true
    if (event.event_type === 'scroll_depth') {
      const depth = Number(event.metadata?.depth_percent ?? 0)
      if (Number.isFinite(depth)) summary.maxScrollDepth = Math.max(summary.maxScrollDepth, depth)
    }
    if (event.event_type === 'section_attention') {
      const visibleMs = Number(event.metadata?.visible_time_ms ?? 0)
      if (Number.isFinite(visibleMs) && visibleMs > 0) summary.totalAttentionMs += visibleMs
    }
    if (event.event_type === 'form_submit' || event.event_type === 'lead_form' || event.event_type === 'lead_submit') {
      summary.converted = true
    }
  }

  for (const sessionId of convertedSessions) {
    const summary = map.get(sessionId)
    if (summary) summary.converted = true
  }

  return Array.from(map.values())
}

function computeSourceStats(events: ProjectEvent[], leads: ProjectLead[]): SourceStat[] {
  const map = new Map<string, { visits: Set<string>; leads: Set<string> }>()
  for (const e of events) {
    if (e.event_type !== 'page_view' || !e.session_id) continue
    const src = e.source ?? 'direct'
    if (!map.has(src)) map.set(src, { visits: new Set<string>(), leads: new Set<string>() })
    map.get(src)!.visits.add(e.session_id)
  }

  for (const lead of leads) {
    if (!lead.session_id) continue
    const src = lead.source ?? 'direct'
    if (!map.has(src)) map.set(src, { visits: new Set<string>(), leads: new Set<string>() })
    map.get(src)!.leads.add(lead.session_id)
  }

  return Array.from(map.entries())
    .map(([source, s]) => {
      const views = s.visits.size
      const leadCount = s.leads.size
      return { source, views, leads: leadCount, conversion_rate: views > 0 ? leadCount / views : 0 }
    })
    .sort((a, b) => b.views - a.views)
}

function computeFunnelStats(sessions: SessionSummary[], keySectionLabel: string, keySectionKey?: string): FunnelStat[] {
  const total = sessions.length
  const keySectionSessions = sessions.filter((session) => keySectionKey && session.sectionsViewed.has(keySectionKey)).length
  const ctaClicks = sessions.filter((session) => session.ctaClicked).length
  const formSubmits = sessions.filter((session) => session.converted).length
  const base = total || 1
  const steps = [
    { step: 'visit', label: 'Visits', count: total, summary: `${total.toLocaleString()} visits landed on your site.` },
    { step: 'key_section', label: `Reached ${keySectionLabel}`, count: keySectionSessions, summary: `${keySectionSessions.toLocaleString()} sessions reached this key section.` },
    { step: 'cta_click', label: 'Clicked a contact button', count: ctaClicks, summary: `${ctaClicks.toLocaleString()} sessions clicked a call-to-action.` },
    { step: 'form_submit', label: 'Sent an inquiry', count: formSubmits, summary: `${formSubmits.toLocaleString()} sessions turned into inquiries.` },
  ]
  return steps.map((s, i) => {
    const prev = i === 0 ? base : (steps[i - 1].count || 1)
    const dropPct = i === 0 ? 0 : Math.round((1 - s.count / prev) * 100)
    return { ...s, pct: s.count / base, dropPct }
  })
}

function getConfidence(sampleSize: number) {
  if (sampleSize < 30) return { label: 'Low', tone: 'text-amber-600' }
  if (sampleSize < 100) return { label: 'Medium', tone: 'text-sky-600' }
  return { label: 'High', tone: 'text-emerald-600' }
}

function computeRecommendations(params: {
  totalSessions: number
  topSectionDriver?: SectionPerformanceStat
  funnelStats: FunnelStat[]
  mostAttentionSection?: SectionPerformanceStat
}): Recommendation[] {
  const recommendations: Recommendation[] = []
  const { totalSessions, topSectionDriver, funnelStats, mostAttentionSection } = params
  const ctaStep = funnelStats.find((step) => step.step === 'cta_click')
  const submitStep = funnelStats.find((step) => step.step === 'form_submit')

  if (
    topSectionDriver &&
    topSectionDriver.isInteractive &&
    topSectionDriver.sectionViews >= Math.max(5, Math.round(totalSessions * 0.4)) &&
    topSectionDriver.clickRate < 0.15
  ) {
    recommendations.push({
      title: `${topSectionDriver.section_label} gets seen but does not spark action`,
      detail: 'Visitors are reaching this section, but very few click after seeing it. Strengthen the headline, offer, or button in this area.',
    })
  }

  if (ctaStep && submitStep && ctaStep.count >= 5) {
    const completionRate = ctaStep.count > 0 ? submitStep.count / ctaStep.count : 0
    if (completionRate < 0.35) {
      recommendations.push({
        title: 'People click, but too many stop before sending an inquiry',
        detail: 'Your call-to-action is doing its job, but the contact step may feel too long, unclear, or broken. Check the form length, required fields, and mobile usability.',
      })
    }
  }

  const keySectionStep = funnelStats.find((step) => step.step === 'key_section')
  if (keySectionStep && totalSessions >= 5 && keySectionStep.pct < 0.5) {
    recommendations.push({
      title: 'Too few visitors reach your main decision-making section',
      detail: 'Consider moving your most important proof, offer, or contact prompt higher on the page so more visitors actually see it.',
    })
  }

  if (
    mostAttentionSection &&
    mostAttentionSection.attentiveSessions >= Math.max(5, Math.round(totalSessions * 0.3)) &&
    mostAttentionSection.isInteractive &&
    mostAttentionSection.clickRate < 0.12
  ) {
    recommendations.push({
      title: `${mostAttentionSection.section_label} keeps attention but still needs a stronger next step`,
      detail: 'People are spending time in this section, but not many move forward from it. Tighten the message and make the next action more obvious.',
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Your analytics is collecting useful journey data',
      detail: 'Keep driving more visits so the confidence level grows. Once you reach a bigger sample, these recommendations will become more specific.',
    })
  }

  return recommendations.slice(0, 3)
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

function formatAttentionSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0s'
  if (seconds >= 10) return `${seconds.toFixed(0)}s`
  return `${seconds.toFixed(1)}s`
}

function trendArrow(current: number, previous: number): { symbol: string; color: string } | null {
  if (previous === 0) return null
  const delta = ((current - previous) / previous) * 100
  if (Math.abs(delta) < 5) return null
  return delta > 0
    ? { symbol: `↑ ${Math.round(delta)}%`, color: 'text-emerald-500' }
    : { symbol: `↓ ${Math.abs(Math.round(delta))}%`, color: 'text-red-500' }
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; status?: string; range?: string; page?: string; projectId?: string; showAllSections?: string }>
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

  const requestedTab = sp.tab ?? 'leads'
  const activeTab = requestedTab === 'seo' ? 'analytics' : requestedTab
  const filterStatus = (sp.status ?? 'all') as FilterStatus
  const dateRange = sp.range ?? '30d'
  const currentPage = parseInt(sp.page ?? '1', 10)
  const LEADS_PER_PAGE = 20

  const analyticsAllowed = isAnalyticsAllowed(project)
  const advancedAllowed = hasAdvancedAnalytics(project)
  const showAllSections = sp.showAllSections === '1'

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
  const allLeads = (allLeadsRaw ?? []) as ProjectLead[]

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

  const { events, leads, latestPageVersionId } = filterByLatestVersion(
    (allEvents ?? []) as ProjectEvent[],
    allLeads,
  )

  // Compute stats
  const totalLeads = leads.length
  const qualityLeads = leads.filter((lead) => computeQualityScore(lead) >= 3).length
  const botLeads = leads.filter((lead) => computeQualityScore(lead) === 0).length

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
  const sessionSummaries = computeSessionSummaries(events, leads)

  const pageStats = computePageStats(events, leads)
  const sectionPerformanceStats = computeSectionPerformanceStats(events, leads, totalSessions)
  const sourceStats = computeSourceStats(events, leads)
  const keySection = sectionPerformanceStats[0]
  const funnelStats = computeFunnelStats(sessionSummaries, keySection?.section_label ?? 'your key section', keySection?.section_key)
  const topSource = computeTopSource(sourceStats)
  const topSectionDriver = sectionPerformanceStats[0]
  const mostAttentionSection = [...sectionPerformanceStats].sort((left, right) => {
    if (right.avgAttentionMs !== left.avgAttentionMs) return right.avgAttentionMs - left.avgAttentionMs
    return right.attentiveSessions - left.attentiveSessions
  })[0]
  const visibleSectionPerformanceStats = showAllSections
    ? sectionPerformanceStats
    : sectionPerformanceStats.slice(0, 8)
  const busiestPage = pageStats[0]
  const topLeadPage = [...pageStats]
    .sort((left, right) => {
      if (right.leads !== left.leads) return right.leads - left.leads
      return right.views - left.views
    })[0]
  const attentionSectionStats = [...sectionPerformanceStats].sort((left, right) => {
    if (right.avgAttentionMs !== left.avgAttentionMs) return right.avgAttentionMs - left.avgAttentionMs
    return right.attentiveSessions - left.attentiveSessions
  })
  const visibleAttentionSectionStats = showAllSections
    ? attentionSectionStats
    : attentionSectionStats.slice(0, 8)
  const hasExtraSectionRows = sectionPerformanceStats.length > 8
  const hasExtraAttentionRows = attentionSectionStats.length > 8
  const funnelConfidence = getConfidence(totalSessions)
  const recommendations = computeRecommendations({ totalSessions, topSectionDriver, funnelStats, mostAttentionSection })

  // Returning visitors
  const visitorSessionMap = new Map<string, Set<string>>()
  for (const e of events) {
    if (e.event_type !== 'page_view' || !e.visitor_id) continue
    if (!visitorSessionMap.has(e.visitor_id)) visitorSessionMap.set(e.visitor_id, new Set())
    if (e.session_id) visitorSessionMap.get(e.visitor_id)!.add(e.session_id)
  }
  const returningVisitors = Array.from(visitorSessionMap.values()).filter(s => s.size > 1).length

  // Filter leads
  const filteredLeads = leads.filter((lead: any) => filterStatus === 'all' || lead.status === filterStatus)
  const totalFilteredLeads = filteredLeads.length
  const totalPages = Math.ceil(totalFilteredLeads / LEADS_PER_PAGE)
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * LEADS_PER_PAGE, currentPage * LEADS_PER_PAGE)

  function buildUrl(params: Record<string, string>) {
    const base: Record<string, string> = { tab: activeTab, status: filterStatus, range: dateRange, page: String(currentPage) }
    if (projectIdParam) base.projectId = projectIdParam
    Object.entries(params).forEach(([k, v]) => { base[k] = v })
    return `/dashboard/analytics?${new URLSearchParams(base).toString()}`
  }

  const sectionToggleHref = buildUrl({ showAllSections: showAllSections ? '0' : '1', page: '1' })
  const sectionToggleLabel = showAllSections ? 'Show fewer sections' : 'View all sections'
  const pageShellClass = 'min-h-screen bg-background'
  const pageWidthClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
  const panelClass = 'rounded-3xl border border-border/70 bg-card shadow-sm'
  const metricCardClass = 'rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-sm'
  const softCardClass = 'rounded-2xl border border-border/70 bg-card p-5 shadow-sm'
  const insetCardClass = 'rounded-2xl border border-border/60 bg-muted/20 p-4'
  const pillButtonClass = 'inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-all'
  const secondaryButtonClass = `${pillButtonClass} border-border/70 bg-background text-foreground hover:bg-muted/50`

  return (
    <div className={pageShellClass}>
      <div className={`${pageWidthClass} py-6 sm:py-10 space-y-6`}>
        <div className={`${panelClass} p-4 sm:p-6`}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <Link href="/dashboard" className="mt-1 rounded-xl border border-border/70 bg-background p-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Client dashboard</p>
                  <h1 className="mt-1 text-2xl sm:text-4xl font-black tracking-tight text-foreground">Leads &amp; Analytics</h1>
                  <p className="mt-1 text-sm sm:text-base font-medium text-muted-foreground">
                    Track what people do on your site and how those visits turn into inquiries for {project.subdomain}.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {(['7d', '30d', '90d', 'all'] as const).map(r => (
                  <Link
                    key={r}
                    href={buildUrl({ range: r, page: '1' })}
                    className={`${pillButtonClass} ${dateRange === r
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                      : 'border-border/70 bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                  >
                    {RANGE_LABELS[r]}
                  </Link>
                ))}
                <Link
                  href={`/api/leads/export?project_id=${project.id}${rangeStart ? `&from=${rangeStart}` : ''}`}
                  className={`${pillButtonClass} border-border/70 bg-background text-foreground hover:bg-muted/50`}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-muted/30 p-1.5">
              {[
                { id: 'leads', label: 'Leads CRM', icon: FormInput },
                { id: 'analytics', label: 'Site Analytics', icon: BarChart3 },
              ].map(({ id, label, icon: Icon }) => (
                <Link
                  key={id}
                  href={buildUrl({ tab: id, page: '1' })}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── TOP METRIC CARDS (always visible) ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className={metricCardClass}>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Activity className="w-4 h-4" />
              Visits
            </div>
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{totalUniqueVisitors} people visited</span>
              {sessionTrend && <span className={`text-xs font-medium ${sessionTrend.color}`}>{sessionTrend.symbol}</span>}
            </div>
          </div>
          <div className={metricCardClass}>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Visitor-to-lead rate
            </div>
            <div className="text-2xl font-bold">{totalPageViews > 0 ? fmt(conversionRate) : '—'}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">Based on {totalPageViews} page views</span>
              {convTrend && <span className={`text-xs font-medium ${convTrend.color}`}>{convTrend.symbol}</span>}
            </div>
          </div>
          <div className={metricCardClass}>
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
          <div className={metricCardClass}>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Globe className="w-4 h-4" />
              Main traffic source
            </div>
            <div className="text-2xl font-bold truncate">{topSource}</div>
            <div className="text-xs text-muted-foreground mt-1">{returningVisitors} people came back more than once</div>
          </div>
        </div>

        {/* ── LEADS CRM TAB ── */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {botLeads > 0 && (
              <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400 shadow-sm">
                <Shield className="w-4 h-4 shrink-0" />
                <span>{botLeads} lead{botLeads !== 1 ? 's' : ''} flagged as low-quality (score 0) — possible bot submissions.</span>
              </div>
            )}

            {/* Status filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(STATUS_LABELS) as FilterStatus[]).map(s => (
                <Link key={s} href={buildUrl({ status: s, page: '1' })}
                  className={`${pillButtonClass} ${filterStatus === s
                    ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                    : 'border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}>
                  {STATUS_LABELS[s]}
                  {s === 'all' && <span className="ml-1.5 text-xs opacity-70">{totalLeads}</span>}
                </Link>
              ))}
            </div>

            {/* Lead type breakdown */}
            {totalLeads > 0 && (
              <div className={softCardClass}>
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
                      <div key={type} className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 flex flex-col gap-1">
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
              <div className="rounded-3xl border border-border/70 bg-card p-12 text-center text-muted-foreground shadow-sm">
                <Users className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No leads yet</p>
                <p className="text-sm mt-1">Leads from your contact forms will appear here.</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-border/70 bg-card divide-y shadow-sm overflow-hidden">
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
                    <Link href={buildUrl({ page: String(currentPage - 1) })} className={secondaryButtonClass}>
                      Previous
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link href={buildUrl({ page: String(currentPage + 1) })} className={secondaryButtonClass}>
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
            <div className="rounded-3xl border border-border/70 bg-card p-12 text-center shadow-sm">
              <Lock className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold text-lg mb-1">Analytics Locked</p>
              <p className="text-muted-foreground text-sm mb-4">Upgrade to a paid plan to unlock full site analytics.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-opacity hover:opacity-90">
                <Sparkles className="w-4 h-4" /> Upgrade Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="grid md:grid-cols-3 gap-4">
                <div className={softCardClass}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MousePointerClick className="w-4 h-4 text-primary" />
                    Section bringing the most inquiries
                  </div>
                  <div className="text-lg font-semibold">
                    {topSectionDriver ? topSectionDriver.section_label : 'No section data yet'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {topSectionDriver
                      ? `${topSectionDriver.assistedLeads} visits that saw this section ended up contacting you.`
                      : 'Once people start exploring your site, this card will show which part of the page helps turn visits into inquiries.'}
                  </p>
                </div>
                <div className={softCardClass}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Most visited page
                  </div>
                  <div className="text-lg font-semibold">
                    {busiestPage ? busiestPage.page_slug : 'No page data yet'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {busiestPage
                      ? `${busiestPage.views} visits in this time range.`
                      : 'As people browse your site, the busiest page will appear here.'}
                  </p>
                </div>
                <div className={softCardClass}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    Page turning visits into inquiries
                  </div>
                  <div className="text-lg font-semibold">
                    {topLeadPage ? topLeadPage.page_slug : 'No lead pattern yet'}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {topLeadPage
                      ? `${topLeadPage.leads} visits from this page turned into inquiries.`
                      : 'Once leads start coming in, the page helping the most will show here.'}
                  </p>
                </div>
              </div>

              {/* Real Conversion Funnel */}
              <div className={softCardClass}>
                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                  <h2 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  How visitors move toward contacting you
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    Confidence: <span className={`font-medium ${funnelConfidence.tone}`}>{funnelConfidence.label}</span>
                    {totalSessions < 30 && <span> (sample size &lt; 30)</span>}
                  </div>
                </div>
              {funnelStats[0].count === 0 ? (
                <p className="text-sm text-muted-foreground">No visitor journey data yet — this will fill in as people browse your site.</p>
              ) : (
                  <div className="space-y-4">
                    {funnelStats.map((step, i) => (
                      <div key={step.step}>
                        <div className="flex items-center justify-between text-sm mb-1 gap-3">
                          <span className="font-medium">{step.count.toLocaleString()} {step.label.toLowerCase()}</span>
                          <span className="text-muted-foreground">{funnelStats[0].count > 0 ? fmt(step.pct, funnelStats[0].count) : '—'}</span>
                        </div>
                        <div className="h-3 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(step.pct * 100, 0.5)}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{step.summary}</div>
                        {i < funnelStats.length - 1 && step.dropPct > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 ml-1">
                            <ArrowRight className="w-3 h-3" />
                            {step.dropPct}% did not continue to the next step
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                      Biggest drop-off: <span className="font-medium text-foreground">{[...funnelStats].slice(1).sort((a, b) => b.dropPct - a.dropPct)[0]?.dropPct ?? 0}% before the next step</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Pages + Traffic Sources side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Top Pages */}
                <div className={softCardClass}>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Pages people visit most
                  </h2>
                  {pageStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No page views yet.</p>
                  ) : (
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 border-b border-border/60 pb-2 text-xs font-medium text-muted-foreground">
                        <span className="col-span-2">Page</span>
                        <span className="text-right">Visits</span>
                        <span className="text-right">Inquiry %</span>
                      </div>
                      {pageStats.slice(0, 8).map(p => (
                        <div key={p.page_slug} className="grid grid-cols-4 border-b border-muted/50 py-2 last:border-0 text-sm">
                          <span className="col-span-2 truncate text-muted-foreground font-mono text-xs">{p.page_slug}</span>
                          <span className="text-right font-medium">{p.views}</span>
                          <span className="text-right text-muted-foreground">{fmt(p.conversion_rate, p.views)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Traffic Sources */}
                <div className={softCardClass}>
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Where your traffic comes from
                  </h2>
                  {sourceStats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No traffic data yet.</p>
                  ) : (
                    <div className="space-y-1">
                      <div className="grid grid-cols-4 border-b border-border/60 pb-2 text-xs font-medium text-muted-foreground">
                        <span className="col-span-2">Source</span>
                        <span className="text-right">Visits</span>
                        <span className="text-right">Inquiries</span>
                      </div>
                      {sourceStats.slice(0, 8).map(s => (
                        <div key={s.source} className="grid grid-cols-4 border-b border-muted/50 py-2 last:border-0 text-sm">
                          <span className="col-span-2 truncate text-muted-foreground">{s.source}</span>
                          <span className="text-right font-medium">{s.views}</span>
                          <span className="text-right text-muted-foreground">{s.leads}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={softCardClass}>
                <h2 className="font-semibold mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  What to improve next
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Simple suggestions based on what visitors are doing on your site.
                </p>
                <div className="space-y-3">
                  {recommendations.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {mostAttentionSection && (
                <div className={softCardClass}>
                  <h2 className="font-semibold mb-1 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    Where people spend the most time
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    A simple heatmap-style view based on how long each part of your site stayed on screen while the page was actually in view.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={insetCardClass}>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Top attention section</div>
                      <div className="mt-2 text-lg font-semibold">{mostAttentionSection.section_label}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Visitors who stayed here spent about {formatAttentionSeconds(mostAttentionSection.avgAttentionSeconds)} on average.
                      </div>
                    </div>
                    <div className={insetCardClass}>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Sessions that truly viewed it</div>
                      <div className="mt-2 text-2xl font-bold">{mostAttentionSection.attentiveSessions}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {fmt(mostAttentionSection.attentionReachRate, totalSessions)} of visits kept this section in view long enough to count as attention.
                      </div>
                    </div>
                    <div className={insetCardClass}>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Total visible time</div>
                      <div className="mt-2 text-2xl font-bold">{formatAttentionSeconds(mostAttentionSection.totalAttentionMs / 1000)}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Counted only while the tab was visible and focused.
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-border/60 bg-background/70">
                    <SectionAttentionBreakdown
                      sections={visibleAttentionSectionStats.map((section) => ({
                        section_key: section.section_key,
                        section_label: section.section_label,
                        viewRateText: fmt(section.viewRate, totalSessions),
                        sectionViews: section.sectionViews,
                        attentiveSessions: section.attentiveSessions,
                        avgAttentionText: formatAttentionSeconds(section.avgAttentionSeconds),
                        totalAttentionText: formatAttentionSeconds(section.totalAttentionMs / 1000),
                      }))}
                      totalTrackedSections={attentionSectionStats.length}
                      visibleTrackedSections={visibleAttentionSectionStats.length}
                      hasExtraAttentionRows={hasExtraAttentionRows}
                      sectionToggleHref={sectionToggleHref}
                      sectionToggleLabel={sectionToggleLabel}
                      sectionToggleExpanded={showAllSections}
                      secondaryButtonClass={secondaryButtonClass}
                    />
                  </div>
                </div>
              )}

              {/* Section Heatmap */}
              {sectionPerformanceStats.length > 0 && (
                <div className={softCardClass}>
                  <h2 className="font-semibold mb-1 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-primary" />
                    Which sections lead to inquiries
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    This shows which parts of your site people noticed, spent time on, and saw before they decided to contact you.
                  </p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2 border-b border-border/60 pb-2 text-xs font-medium text-muted-foreground md:grid-cols-12">
                      <span className="md:col-span-4">Section</span>
                      <span className="md:col-span-4">What happened</span>
                      <span className="md:col-span-2 text-left md:text-right">Attention</span>
                      <span className="md:col-span-2 text-left md:text-right">Confidence</span>
                    </div>
                    {visibleSectionPerformanceStats.map(s => (
                      <div key={s.section_key} className="grid grid-cols-1 gap-2 border-b border-muted/50 py-3 text-sm last:border-0 md:grid-cols-12 md:items-start">
                        <div className="md:col-span-4 min-w-0">
                          <div className="truncate font-medium">{s.section_label}</div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            Seen by {s.sectionViews} sessions
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {s.isInteractive ? `Main interaction: ${s.interactionLabel}` : 'This is mainly a view-only section'}
                          </div>
                        </div>
                        <div className="md:col-span-4 min-w-0">
                          <div className="text-muted-foreground">
                            Seen by {s.sectionViews} sessions → {s.assistedLeads} converted ({fmt(s.assistedRate, s.sectionViews)})
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            {fmt(s.viewRate, totalSessions)} of all visits reached this section.
                          </div>
                        </div>
                        <div className="md:col-span-2 md:text-right text-muted-foreground">
                          <div>{s.attentiveSessions} attentive sessions</div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Avg. {formatAttentionSeconds(s.avgAttentionSeconds)} on screen
                          </div>
                        </div>
                        <div className="md:col-span-2 md:text-right">
                          <span className={`font-medium ${s.confidenceTone}`}>Confidence: {s.confidenceLabel}</span>
                          {s.sectionViews < 30 && <div className="text-[11px] text-muted-foreground">sample size &lt; 30</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasExtraSectionRows && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-muted/50 pt-4">
                      <p className="text-xs text-muted-foreground">
                        Showing {visibleSectionPerformanceStats.length} of {sectionPerformanceStats.length} tracked sections.
                      </p>
                      <Link
                        href={sectionToggleHref}
                        className={secondaryButtonClass}
                      >
                        {sectionToggleLabel}
                        <ArrowRight className={`h-4 w-4 transition-transform ${showAllSections ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  )}
                  {!advancedAllowed && (
                    <p className="text-xs text-muted-foreground mt-4">
                      This simplified section view is available here so you can quickly see what content helps inquiries. Advanced analytics plans can still expand on this foundation later.
                    </p>
                  )}
                </div>
              )}

              {/* Returning Visitors */}
              <div className={softCardClass}>
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Repeat2 className="w-4 h-4 text-primary" />
                  Repeat visitors
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{totalUniqueVisitors}</div>
                    <div className="text-xs text-muted-foreground mt-1">People visited</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{returningVisitors}</div>
                    <div className="text-xs text-muted-foreground mt-1">Came back</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalUniqueVisitors > 0 ? fmt(returningVisitors / totalUniqueVisitors, totalUniqueVisitors) : '—'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Return rate</div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

      </div>
    </div>
  )
}
