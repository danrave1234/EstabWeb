import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Phone, MessageSquare, FormInput, ChevronLeft, TrendingUp, MousePointerClick, Globe, Layers } from 'lucide-react'
import MainHeader from '@/components/shared/MainHeader'
import SeoAuditPanel from '@/components/dashboard/SeoAuditPanel'

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
}

type PageStat = {
  page_slug: string
  views: number
  leads: number
  conversion_rate: number
}

type SectionStat = {
  section_key: string
  sectionViews: number
  clicks: number
  leads: number
  viewRate: number
  clickRate: number
  conversionRate: number
  engagementScore: number
  rank: number
}

type SourceStat = {
  source: string
  views: number
  leads: number
  conversion_rate: number
}

// ---------------------------------------------------------------------------
// Aggregation helpers (run in JS — works without raw SQL RPC)
// ---------------------------------------------------------------------------
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
    .map(([page_slug, s]) => ({
      page_slug: page_slug || '(home)',
      views: s.views,
      leads: s.leads,
      conversion_rate: s.views > 0 ? s.leads / s.views : 0,
    }))
    .sort((a, b) => b.views - a.views)
}

function computeSectionStats(events: ProjectEvent[], totalVisitors: number): SectionStat[] {
  const map = new Map<string, { sectionViews: number; clicks: number; leads: number }>()
  for (const e of events) {
    if (!['section_view', 'cta_click', 'lead_form', 'lead_call', 'lead_messenger', 'lead_viber'].includes(e.event_type)) continue
    const key = e.section_key ?? '(unknown)'
    if (!map.has(key)) map.set(key, { sectionViews: 0, clicks: 0, leads: 0 })
    const s = map.get(key)!
    if (e.event_type === 'section_view') s.sectionViews++
    if (e.event_type === 'cta_click') s.clicks++
    if (e.event_type.startsWith('lead_')) s.leads++
  }
  const rows = Array.from(map.entries()).map(([section_key, s]) => {
    const viewRate = totalVisitors > 0 ? s.sectionViews / totalVisitors : 0
    const clickRate = s.sectionViews > 0 ? s.clicks / s.sectionViews : 0
    const conversionRate = s.sectionViews > 0 ? s.leads / s.sectionViews : 0
    const engagementScore = clickRate * 0.4 + conversionRate * 0.5 + viewRate * 0.1
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
    .map(([source, s]) => ({
      source,
      views: s.views,
      leads: s.leads,
      conversion_rate: s.views > 0 ? s.leads / s.views : 0,
    }))
    .sort((a, b) => b.conversion_rate - a.conversion_rate)
}

function fmt(rate: number) {
  return (rate * 100).toFixed(1) + '%'
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const { projectId } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')
  if (!projectId) return redirect('/dashboard')

  const { data: project } = await supabase
    .from('projects')
    .select('id, current_config, subdomain, custom_domain')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()

  if (!project) return redirect('/dashboard')

  const { data: leads } = await supabase
    .from('project_leads')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const { data: rawEvents } = await supabase
    .from('project_events')
    .select('event_type, page_slug, section_key, source')
    .eq('project_id', projectId)

  const allLeads = leads || []
  const events: ProjectEvent[] = rawEvents || []
  const siteName = (project.current_config as Record<string, any>)?.brand?.name || 'My Website'

  const totalViews = events.filter(e => e.event_type === 'page_view').length
  const totalLeadEvents = events.filter(e => e.event_type.startsWith('lead_')).length
  const totalCTAClicks = events.filter(e => e.event_type === 'cta_click').length
  const overallConversion = totalViews > 0 ? totalLeadEvents / totalViews : 0
  const overallCTARate = totalViews > 0 ? totalCTAClicks / totalViews : 0

  const pageStats = computePageStats(events)
  const sectionStats = computeSectionStats(events, totalViews)
  const sourceStats = computeSourceStats(events)

  const topSection = sectionStats[0]
  const topSource = sourceStats[0]
  const bestPage = [...pageStats].sort((a, b) => b.conversion_rate - a.conversion_rate)[0]

  const hasEventData = events.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-8">

        {/* Back + Header */}
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
              Analytics
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground">{siteName}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              All Time
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10', count: allLeads.length },
            { label: 'Calls', icon: Phone, color: 'text-green-600', bg: 'bg-green-500/10', count: allLeads.filter(l => l.type === 'call').length },
            { label: 'Form Submissions', icon: FormInput, color: 'text-blue-600', bg: 'bg-blue-500/10', count: allLeads.filter(l => l.type === 'form').length },
            { label: 'Messages', icon: MessageSquare, color: 'text-sky-600', bg: 'bg-sky-500/10', count: allLeads.filter(l => l.type === 'messenger' || l.type === 'viber').length },
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

        {/* ------------------------------------------------------------------ */}
        {/* CONVERSION INSIGHTS                                                 */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Conversion Insights
          </h2>
          {!hasEventData && (
            <p className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-xl px-4 py-3">
              No event data yet. Page views and CTA clicks will appear here once visitors interact with your site.
            </p>
          )}
        </div>

        {hasEventData && (
          <>
            {/* Insight summary cards */}
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
                <p className="text-2xl font-black text-foreground">{fmt(overallCTARate)}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">CTA Click Rate</p>
                <p className="text-[10px] text-muted-foreground">{totalCTAClicks} clicks / {totalViews} views</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                  <Layers className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-foreground truncate">{topSection?.section_key ?? '—'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Best Section</p>
                <p className="text-[10px] text-muted-foreground">{topSection ? `${topSection.leads} leads` : 'No data'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Globe className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-foreground truncate">{topSource?.source ?? '—'}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Source</p>
                <p className="text-[10px] text-muted-foreground">{topSource ? `${fmt(topSource.conversion_rate)} conv.` : 'No data'}</p>
              </div>
            </div>

            {/* Best page highlight */}
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

            {/* Top section highlight */}
            {topSection && topSection.leads > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <Layers className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-sm font-bold text-foreground">
                  <span className="text-green-600 capitalize">{topSection.section_key}</span> generates the most leads
                  {' '}— <span className="text-green-600">{topSection.leads}</span> total lead{topSection.leads !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Page Performance Table */}
            {pageStats.length > 0 && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Page Performance</h2>
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

            {/* ── Section Performance Heatmap ─────────────────────────── */}
            {sectionStats.length > 0 && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Section Performance Heatmap
                  </h2>
                  <span className="text-[10px] font-bold text-muted-foreground">{sectionStats.length} sections</span>
                </div>

                {/* Scroll-reach bars */}
                <div className="px-6 py-5 space-y-3 border-b border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Scroll Reach</p>
                  {sectionStats.map((row) => {
                    const pctVal = Math.round(row.viewRate * 100)
                    const barColor = pctVal >= 40 ? 'bg-primary' : pctVal >= 20 ? 'bg-orange-400' : 'bg-muted-foreground/40'
                    return (
                      <div key={row.section_key} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-foreground capitalize w-28 shrink-0 truncate">{row.section_key}</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                            style={{ width: `${Math.min(pctVal, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-foreground w-10 text-right">{pctVal}%</span>
                      </div>
                    )
                  })}
                </div>

                {/* Ranked table */}
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
                            <td className="px-4 py-3 text-center">
                              <span className="text-[10px] font-black text-muted-foreground">#{row.rank}</span>
                            </td>
                            <td className="px-4 py-3 font-bold text-foreground capitalize">{row.section_key}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{row.sectionViews}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{row.clicks}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">{row.leads}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={`font-black ${
                                convPct >= 40 ? 'text-primary' :
                                convPct >= 20 ? 'text-orange-500' :
                                'text-muted-foreground'
                              }`}>{convPct}%</span>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <span className="font-black text-foreground">{(row.engagementScore * 100).toFixed(1)}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Source Performance Table */}
            {sourceStats.length > 0 && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Traffic Source Performance</h2>
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
          </>
        )}

        {/* Lead Breakdown Bar */}
        {allLeads.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Lead Breakdown</h2>
            <div className="space-y-3">
              {[
                { label: 'Calls', color: 'bg-green-500', count: allLeads.filter(l => l.type === 'call').length },
                { label: 'Form Submissions', color: 'bg-blue-500', count: allLeads.filter(l => l.type === 'form').length },
                { label: 'Messenger', color: 'bg-sky-500', count: allLeads.filter(l => l.type === 'messenger').length },
                { label: 'Viber', color: 'bg-indigo-500', count: allLeads.filter(l => l.type === 'viber').length },
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

        {/* Recent Activity Table */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Activity</h2>
            <span className="text-[10px] font-bold text-muted-foreground">{allLeads.length} total</span>
          </div>
          {allLeads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-bold text-muted-foreground">No leads recorded yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Leads will appear here once visitors interact with your site.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {allLeads.slice(0, 50).map((lead) => {
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
                return (
                  <div key={lead.id} className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      lead.type === 'call' ? 'bg-green-500/10 text-green-600' :
                      lead.type === 'form' ? 'bg-blue-500/10 text-blue-600' :
                      lead.type === 'messenger' ? 'bg-sky-500/10 text-sky-600' :
                      'bg-indigo-500/10 text-indigo-600'
                    }`}>
                      {lead.type === 'call' && <Phone className="w-4 h-4" />}
                      {lead.type === 'form' && <FormInput className="w-4 h-4" />}
                      {(lead.type === 'messenger' || lead.type === 'viber') && <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold capitalize truncate">
                        {contactName || `${lead.type} lead`}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {contactEmail && (
                          <span className="text-[10px] text-muted-foreground truncate">{contactEmail}</span>
                        )}
                        {contactPhone && (
                          <span className="text-[10px] text-muted-foreground">{contactPhone}</span>
                        )}
                        {source && (
                          <span className="text-[10px] text-muted-foreground">via {source}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full capitalize ${
                        lead.type === 'call' ? 'bg-green-500/10 text-green-700' :
                        lead.type === 'form' ? 'bg-blue-500/10 text-blue-700' :
                        lead.type === 'messenger' ? 'bg-sky-500/10 text-sky-700' :
                        'bg-indigo-500/10 text-indigo-700'
                      }`}>{lead.type}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* SEO Audit */}
        <SeoAuditPanel config={project.current_config as Record<string, any>} />
      </main>
    </div>
  )
}
