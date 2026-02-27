import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Layout, Globe, ChevronRight, ExternalLink, Sparkles, Plus, BarChart3, Users } from 'lucide-react'
import UpgradeButton from '@/components/dashboard/UpgradeButton'
import ClientDashboardPreview from '@/components/dashboard/ClientDashboardPreview'
import MainHeader from '@/components/shared/MainHeader'
import MainFooter from '@/components/shared/MainFooter'
import NoProjectRedeem from '@/components/dashboard/NoProjectRedeem'
import OnboardingPage from '@/components/dashboard/OnboardingPage'
import PaymentSuccessHandler from '@/components/dashboard/PaymentSuccessHandler'
import { Suspense } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

import { getPlansConfig } from '@/lib/plans-config-server'

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch ALL projects for this client
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, subdomain, custom_domain, current_config, draft_config, created_at, subscription_status, subscription_plan_id, trial_ends_at, subscription_ends_at, auto_renew, has_paid_initial, publish_limit, publish_limit_daily, publish_count, publish_count_today, publish_date, publish_period_start, renewal_link, renewal_link_created_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Dashboard Fetch Error:', error)

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com'

  // Fetch lead counts for all user's projects
  const projectIds = projects?.map(p => p.id) || []
  let leadsData: any[] = []
  if (projectIds.length > 0) {
    const { data: leads, error: leadsError } = await supabase
      .from('project_leads')
      .select('project_id')
      .in('project_id', projectIds)

    if (leadsError) console.error('Leads Fetch Error:', leadsError)
    else leadsData = leads || []
  }

  // Helper to count leads for a project
  const getLeadCount = (id: string) => leadsData.filter(l => l.project_id === id).length

  const plansConfig = await getPlansConfig()

  // If a specific project is selected, show the preview
  if (projectId && projects?.some(p => p.id === projectId)) {
    const selectedProject = projects.find(p => p.id === projectId)
    return (
      <>
        <Suspense fallback={null}>
          <PaymentSuccessHandler />
        </Suspense>
        <ClientDashboardPreview project={selectedProject} user={user} initialPlansConfig={plansConfig} />
      </>
    )
  }


  // If no projects at all, show the redeem/empty state
  if (!projects || projects.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center min-h-[calc(100vh-64px)] pt-20 sm:pt-24">
        <div className="relative mb-6 sm:mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-6 hover:rotate-0 transition-transform duration-500 overflow-hidden">
            <Image
              src="/Logo.svg"
              alt="EstabWeb Logo"
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain invert brightness-0"
            />
          </div>
        </div>

        <h1 className="text-3xl sm:text-7xl font-black text-foreground mb-3 sm:mb-6 tracking-tight leading-none">
          Build something <span className="text-primary">extraordinary</span>.
        </h1>
        <p className="text-sm sm:text-xl text-muted-foreground max-w-xl mb-6 sm:mb-12 leading-relaxed font-medium px-4">
          Your journey to a world-class online presence starts here. Let&apos;s craft your perfect website together.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-md sm:max-w-none px-4">
          <Link
            href="/onboarding"
            className="group flex items-center justify-center gap-2 px-6 py-4 sm:px-12 sm:py-6 bg-primary text-primary-foreground rounded-xl sm:rounded-[2rem] font-black text-sm sm:text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            Start Building Now
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="h-px w-full sm:h-12 sm:w-px bg-border my-2 sm:my-0" />

          <div className="w-full sm:w-auto">
            <NoProjectRedeem />
          </div>
        </div>

        <div className="mt-10 sm:mt-24 grid grid-cols-3 gap-2 sm:gap-12 max-w-5xl text-left opacity-60 px-4">
          <div className="space-y-1 sm:space-y-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center font-black text-[10px] sm:text-xs mx-auto sm:mx-0">01</div>
            <h3 className="font-black text-[8px] sm:text-sm uppercase tracking-widest leading-tight">Select Soul</h3>
            <p className="text-[7px] sm:text-xs font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">Choose your industry and we&apos;ll adapt our engine.</p>
          </div>
          <div className="space-y-1 sm:space-y-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center font-black text-[10px] sm:text-xs mx-auto sm:mx-0">02</div>
            <h3 className="font-black text-[8px] sm:text-sm uppercase tracking-widest leading-tight">Equip Arsenal</h3>
            <p className="text-[7px] sm:text-xs font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">Select high-performance blocks with one click.</p>
          </div>
          <div className="space-y-1 sm:space-y-3 text-center sm:text-left">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center font-black text-[10px] sm:text-xs mx-auto sm:mx-0">03</div>
            <h3 className="font-black text-[8px] sm:text-sm uppercase tracking-widest leading-tight">Manifest</h3>
            <p className="text-[7px] sm:text-xs font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">Watch your vision come to life as we generate blueprints instantly.</p>
          </div>
        </div>
      </main>
    )
  }

  // If multiple projects exist (or just to show the list), show the selector
  return (
    <>
      <Suspense fallback={null}>
        <PaymentSuccessHandler />
      </Suspense>
      <main className="flex-1 container mx-auto pt-20 sm:pt-24 pb-12 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">My Websites</h1>
            <p className="text-xs sm:text-base text-muted-foreground mt-0.5 sm:mt-2 font-medium">Manage and optimize your digital assets.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <Link
              href="/onboarding"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Build New
            </Link>
            <div className="hidden sm:block h-10 w-px bg-border mx-2" />
            <div className="w-full sm:w-auto">
              <NoProjectRedeem />
            </div>
          </div>
        </div>

        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 sm:hidden mb-8">
          {projects.map((project) => {
            const siteName = (project.current_config as any)?.brand?.name || "My Website"
            const domain = project.custom_domain || (project.subdomain ? `${project.subdomain}.${rootDomain}` : "Not set")
            const previewUrl = project.custom_domain
              ? `https://${project.custom_domain}`
              : (project.subdomain ? `https://${project.subdomain}.${rootDomain}` : "#")

            return (
              <div key={project.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                    {(project.current_config as any)?.brand?.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={(project.current_config as any).brand.logoUrl} alt={siteName} className="w-full h-full object-contain" />
                    ) : (
                      <Globe className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground truncate">{siteName}</h3>
                      <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} variant="badge" />
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {project.custom_domain ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest shrink-0">Custom</span>
                      ) : null}
                      <p className="text-[10px] text-muted-foreground truncate">{domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-green-600 leading-none">{getLeadCount(project.id)}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1">Leads</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground pt-2 border-t border-border">
                  <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href={`/dashboard?projectId=${project.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Edit Site
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/dashboard/analytics?projectId=${project.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Analytics
                  </Link>
                  <Link
                    href={`/dashboard/leads?projectId=${project.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Leads
                  </Link>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted hover:bg-muted/80 rounded-xl text-foreground transition-colors"
                    title="Visit Live Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>


        {/* Desktop View: Table */}
        <div className="hidden sm:block bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] text-[11px] font-black uppercase tracking-widest">Website</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Leads</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Domain</TableHead>
                <TableHead className="text-[11px] font-black uppercase tracking-widest">Created</TableHead>
                <TableHead className="text-right text-[11px] font-black uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const siteName = (project.current_config as any)?.brand?.name || "My Website"
                const domain = project.custom_domain || (project.subdomain ? `${project.subdomain}.${rootDomain}` : "Not set")
                const previewUrl = project.custom_domain
                  ? `https://${project.custom_domain}`
                  : (project.subdomain ? `https://${project.subdomain}.${rootDomain}` : "#")

                return (
                  <TableRow key={project.id} className="group transition-colors">
                    <TableCell className="py-4">
                      <Link href={`/dashboard?projectId=${project.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors overflow-hidden">
                          {(project.current_config as any)?.brand?.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(project.current_config as any).brand.logoUrl} alt={siteName} className="w-full h-full object-contain" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{siteName}</span>
                            <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} variant="badge" />
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-black text-foreground">{getLeadCount(project.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {project.custom_domain ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest shrink-0">Custom</span>
                        ) : null}
                        <span className={project.custom_domain ? "text-foreground font-medium" : ""}>{domain}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/analytics?projectId=${project.id}`}
                          className="flex items-center gap-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold transition-all"
                          title="Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Analytics
                        </Link>
                        <Link
                          href={`/dashboard/leads?projectId=${project.id}`}
                          className="flex items-center gap-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold transition-all"
                          title="Leads"
                        >
                          <Users className="w-4 h-4" />
                          Leads
                        </Link>
                        <Link
                          href={`/dashboard?projectId=${project.id}`}
                          className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-xs font-bold transition-all"
                        >
                          Edit Site
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          title="Visit Live Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  )
}
