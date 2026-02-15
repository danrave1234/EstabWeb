import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Layout, Globe, ChevronRight, ExternalLink, Sparkles, Plus } from 'lucide-react'
import UpgradeButton from '@/components/dashboard/UpgradeButton'
import ClientDashboardPreview from '@/components/dashboard/ClientDashboardPreview'
import MainHeader from '@/components/shared/MainHeader'
import MainFooter from '@/components/shared/MainFooter'
import NoProjectRedeem from '@/components/dashboard/NoProjectRedeem'
import OnboardingPage from '@/components/dashboard/OnboardingPage'
import PaymentSuccessHandler from '@/components/dashboard/PaymentSuccessHandler'
import { Suspense } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

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
    .select('id, subdomain, custom_domain, current_config, draft_config, created_at, subscription_status, trial_ends_at, subscription_ends_at, publish_limit, publish_limit_daily, publish_count, publish_count_today, publish_date, publish_period_start')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Dashboard Fetch Error:', error)

  // If a specific project is selected, show the preview
  if (projectId && projects?.some(p => p.id === projectId)) {
    const selectedProject = projects.find(p => p.id === projectId)
    return (
      <>
        <Suspense fallback={null}>
          <PaymentSuccessHandler />
        </Suspense>
        <ClientDashboardPreview project={selectedProject} user={user} />
      </>
    )
  }

  // If no projects at all, show the redeem/empty state
  if (!projects || projects.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center min-h-[80vh]">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 rotate-6 hover:rotate-0 transition-transform duration-500 overflow-hidden">
            <Image 
              src="/Logo.svg" 
              alt="EstabWeb Logo" 
              width={64} 
              height={64} 
              className="w-16 h-16 object-contain invert brightness-0"
            />
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-black text-foreground mb-6 tracking-tight leading-none">
          Build something <span className="text-primary">extraordinary</span>.
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed font-medium">
          Your journey to a world-class online presence starts here. Let&apos;s craft your perfect website together.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/onboarding"
            className="group flex items-center gap-3 px-12 py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Start Building Now
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="h-12 w-px bg-border hidden sm:block" />
          
          <NoProjectRedeem />
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl text-left opacity-50">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center font-black text-xs">01</div>
            <h3 className="font-black text-sm uppercase tracking-widest">Select Soul</h3>
            <p className="text-xs font-medium leading-relaxed">Choose your industry and we&apos;ll adapt our engine to your specific business needs.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center font-black text-xs">02</div>
            <h3 className="font-black text-sm uppercase tracking-widest">Equip Arsenal</h3>
            <p className="text-xs font-medium leading-relaxed">Select high-performance blocks like pricing, FAQs, and testimonials with one click.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center font-black text-xs">03</div>
            <h3 className="font-black text-sm uppercase tracking-widest">Manifest</h3>
            <p className="text-xs font-medium leading-relaxed">Watch your vision come to life as we generate your curated blueprints instantly.</p>
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
      <main className="flex-1 container mx-auto pt-24 pb-12 px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">My Websites</h1>
            <p className="text-muted-foreground mt-2 font-medium">Manage and optimize your digital assets.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/onboarding"
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Build New
            </Link>
            <div className="h-10 w-px bg-border mx-2" />
            <NoProjectRedeem />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Website</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const siteName = (project.current_config as any)?.brand?.name || "My Website"
                const rootDomain = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '').replace(/^dashboard\./, '') : 'estabweb.com'
                const domain = project.custom_domain || (project.subdomain ? `${project.subdomain}.${rootDomain}` : "Not set")
                const previewUrl = project.custom_domain
                  ? `https://${project.custom_domain}`
                  : (project.subdomain ? `https://${project.subdomain}.${rootDomain}` : "#")

                return (
                  <TableRow key={project.id} className="group transition-colors">
                    <TableCell className="py-4">
                      <Link href={`/dashboard?projectId=${project.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{siteName}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{project.id}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {domain}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UpgradeButton 
                          projectId={project.id} 
                          subscriptionStatus={project.subscription_status}
                          variant="inline" 
                        />
                        <a 
                          href={previewUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
                          title="Visit Live Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/dashboard?projectId=${project.id}`}
                          className="flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-xs font-bold transition-all"
                        >
                          Edit Site
                          <ChevronRight className="w-3 h-3" />
                        </Link>
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
