import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Phone, MessageSquare, FormInput, ChevronLeft } from 'lucide-react'
import MainHeader from '@/components/shared/MainHeader'

export const dynamic = "force-dynamic"
export const revalidate = 0

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

  // Verify project belongs to user
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

  const allLeads = leads || []
  const siteName = (project.current_config as any)?.brand?.name || 'My Website'

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
      </main>
    </div>
  )
}
