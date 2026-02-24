import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Users } from 'lucide-react'
import MainHeader from '@/components/shared/MainHeader'
import LeadRow from '@/components/dashboard/LeadRow'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const STATUS_LABELS = {
  all:       'All',
  new:       'New',
  contacted: 'Contacted',
  closed:    'Closed',
} as const

type FilterStatus = keyof typeof STATUS_LABELS

export default async function LeadsPage({
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
    .select('id, current_config, subdomain, custom_domain')
    .eq('id', projectId)
    .eq('client_id', user.id)
    .single()

  if (!project) return redirect('/dashboard')

  const { data: allLeads } = await supabase
    .from('project_leads')
    .select('id, type, status, notes, metadata, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const leads = allLeads || []
  const siteName = (project.current_config as Record<string, any>)?.brand?.name || 'My Website'

  const filterStatus: FilterStatus =
    rawStatus && rawStatus in STATUS_LABELS ? (rawStatus as FilterStatus) : 'all'

  const filtered = filterStatus === 'all'
    ? leads
    : leads.filter(l => (l.status ?? 'new') === filterStatus)

  const counts = {
    all:       leads.length,
    new:       leads.filter(l => (l.status ?? 'new') === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    closed:    leads.filter(l => l.status === 'closed').length,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto w-full space-y-6">

        {/* Header */}
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
              <Users className="w-6 h-6 text-primary" />
              Leads
            </h1>
          </div>
          <span className="text-xs font-bold text-muted-foreground">{siteName}</span>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'all',       label: 'Total',     color: 'text-primary',    bg: 'bg-primary/10' },
            { key: 'new',       label: 'New',       color: 'text-blue-600',   bg: 'bg-blue-500/10' },
            { key: 'contacted', label: 'Contacted', color: 'text-amber-600',  bg: 'bg-amber-500/10' },
            { key: 'closed',    label: 'Closed',    color: 'text-green-600',  bg: 'bg-green-500/10' },
          ].map(s => (
            <Link
              key={s.key}
              href={`/dashboard/leads?projectId=${projectId}&status=${s.key}`}
              className={`p-4 rounded-2xl bg-card border transition-all shadow-sm flex flex-col gap-2 hover:shadow-md ${
                filterStatus === s.key ? 'border-primary ring-1 ring-primary/30' : 'border-border'
              }`}
            >
              <p className={`text-2xl font-black ${s.color}`}>{counts[s.key as FilterStatus]}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(STATUS_LABELS) as FilterStatus[]).map(s => (
            <Link
              key={s}
              href={`/dashboard/leads?projectId=${projectId}&status=${s}`}
              className={`text-xs font-black px-4 py-2 rounded-full border transition-colors ${
                filterStatus === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:text-foreground'
              }`}
            >
              {STATUS_LABELS[s]}
              <span className="ml-1.5 opacity-60">{counts[s]}</span>
            </Link>
          ))}
        </div>

        {/* Leads list */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
              {STATUS_LABELS[filterStatus]} Leads
            </h2>
            <span className="text-[10px] font-bold text-muted-foreground">{filtered.length} shown</span>
          </div>

          {filtered.length === 0 ? (
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
              {filtered.map(lead => (
                <LeadRow key={lead.id} lead={{
                  ...lead,
                  status: (lead.status ?? 'new') as 'new' | 'contacted' | 'closed',
                }} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
