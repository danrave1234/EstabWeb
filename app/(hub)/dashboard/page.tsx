import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Layout, Globe, ChevronRight, ExternalLink } from 'lucide-react'
import ClientDashboardPreview from '@/components/dashboard/ClientDashboardPreview'
import MainHeader from '@/components/shared/MainHeader'
import NoProjectRedeem from '@/components/dashboard/NoProjectRedeem'
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
    .select('id, subdomain, custom_domain, current_config, draft_config, created_at')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Dashboard Fetch Error:', error)

  // If a specific project is selected, show the preview
  if (projectId && projects?.some(p => p.id === projectId)) {
    const selectedProject = projects.find(p => p.id === projectId)
    return <ClientDashboardPreview project={selectedProject} user={user} />
  }

  // If no projects at all, show the redeem/empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MainHeader initialUser={user} variant="client" />
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Layout className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">No project assigned</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have an active project assigned to your account yet. You can still start by applying a Template Code below.
          </p>
          <div className="mt-8">
            <NoProjectRedeem />
          </div>
          <Link 
            href="/"
            className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Back to Homepage
          </Link>
        </main>
        <footer className="py-8 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026 EstabWeb. All rights reserved.
          </div>
        </footer>
      </div>
    )
  }

  // If multiple projects exist (or just to show the list), show the selector
  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <MainHeader initialUser={user} variant="client" />
      
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Websites</h1>
            <p className="text-muted-foreground mt-1">Select a website to edit or preview.</p>
          </div>
          <div className="max-w-xs">
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
                const domain = project.custom_domain || (project.subdomain ? `${project.subdomain}.estabweb.com` : "Not set")
                const previewUrl = project.custom_domain ? `https://${project.custom_domain}` : (project.subdomain ? `/${project.subdomain}` : "#")

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

      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 EstabWeb. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
