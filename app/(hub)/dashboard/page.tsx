"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Plus,
  ExternalLink,
  Layout,
  ChevronRight,
  BarChart3,
  Globe,
  Sparkles
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import ClientDashboardPreview from "@/components/dashboard/ClientDashboardPreview"
import UpgradeButton from "@/components/dashboard/UpgradeButton"
import NoProjectRedeem from "@/components/dashboard/NoProjectRedeem"
import PaymentSuccessHandler from "@/components/dashboard/PaymentSuccessHandler"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const projectIdFromUrl = searchParams.get("projectId")

  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rootDomain, setRootDomain] = useState("")
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [leadsCount, setLeadsCount] = useState<Record<string, number>>({})
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return
      setUser(authUser)

      // Fetch projects
      const { data: projs } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", authUser.id)
        .order("created_at", { ascending: false })

      setProjects(projs || [])

      // Fetch lead counts for all projects
      const { data: stats } = await supabase
        .from('v_lead_stats')
        .select('project_id, total_leads')

      const counts: Record<string, number> = {}
      stats?.forEach(s => {
        counts[s.project_id] = (counts[s.project_id] || 0) + Number(s.total_leads)
      })
      setLeadsCount(counts)

      // Get root domain from config
      const res = await fetch("/api/config")
      const config = await res.json()
      setRootDomain(config.rootDomain || "estabweb.com")

      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    if (projectIdFromUrl && projects.length > 0) {
      const p = projects.find((x) => x.id === projectIdFromUrl)
      if (p) setSelectedProject(p)
      else setSelectedProject(null)
    } else {
      setSelectedProject(null)
    }
  }, [projectIdFromUrl, projects])

  if (loading) {
    return (
      <>
        <PaymentSuccessHandler />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Hub...</p>
          </div>
        </div>
      </>
    )
  }

  // If a project is selected, show the high-fidelity editor/preview interface
  if (selectedProject) {
    return (
      <>
        <PaymentSuccessHandler />
        <ClientDashboardPreview
          project={selectedProject}
          user={user}
          initialPlansConfig={{
            PLANS: {}, // Mock or fetch if needed
            ENABLE_ANNUAL_PLANS: false
          }}
        />
      </>
    )
  }

  // If no projects, show empty state with redemption option
  if (projects.length === 0) {
    return (
      <>
        <PaymentSuccessHandler />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="max-w-md w-full bg-card border-2 border-dashed border-border rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">Ready to Launch?</h1>
            <p className="text-muted-foreground mb-10 font-medium leading-relaxed font-sans">
              You haven&apos;t created any websites yet. Start building your professional online presence in minutes.
            </p>

            <div className="space-y-4">
              <Link
                href="/onboarding"
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Create New Project
              </Link>

              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-border flex-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">OR REDEEM CODE</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <NoProjectRedeem />
            </div>
          </div>
        </div>
      </>
    )
  }

  const getLeadCount = (id: string) => leadsCount[id] || 0

  return (
    <>
      <PaymentSuccessHandler />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 sm:mb-12">
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

        {/* Mobile & Tablet View: Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden mb-8">
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

              <div className="flex flex-col gap-2 pt-2 border-t border-border mt-auto">
                <Link
                  href={`/dashboard?projectId=${project.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
                >
                  Edit Site
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/analytics?projectId=${project.id}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex-1 active:scale-95"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Leads
                  </Link>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted hover:bg-muted/80 rounded-xl text-foreground transition-all shrink-0 active:scale-95"
                    title="Visit Live Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
        </div>


      {/* Desktop View: Table */}
        <div className="hidden lg:block bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[40%] text-[11px] font-black uppercase tracking-widest py-5">Website</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest py-5">Leads</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest py-5">Domain</TableHead>
              <TableHead className="text-[11px] font-black uppercase tracking-widest py-5">Created</TableHead>
              <TableHead className="text-right text-[11px] font-black uppercase tracking-widest py-5">Actions</TableHead>
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
                <TableRow key={project.id} className="group transition-colors hover:bg-muted/10">
                  <TableCell className="py-4">
                    <Link href={`/dashboard?projectId=${project.id}`} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 overflow-hidden shadow-sm">
                        {(project.current_config as any)?.brand?.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={(project.current_config as any).brand.logoUrl} alt={siteName} className="w-full h-full object-contain" />
                        ) : (
                          <Globe className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{siteName}</span>
                          <UpgradeButton projectId={project.id} subscriptionStatus={project.subscription_status} variant="badge" />
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-black text-foreground text-lg">{getLeadCount(project.id)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      {project.custom_domain ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest shrink-0">Custom</span>
                      ) : null}
                      <span className={project.custom_domain ? "text-foreground font-bold" : ""}>{domain}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard?projectId=${project.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                      >
                        <Layout className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <Link
                        href={`/dashboard/analytics?projectId=${project.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted/80 transition-all border border-border"
                        title="View Leads"
                      >
                        <BarChart3 className="w-3.5 h-3.5" />
                        Analytics
                      </Link>
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all border border-border"
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
      </div>
    </>
  )
}
