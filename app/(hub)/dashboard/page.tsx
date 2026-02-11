import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Layout } from 'lucide-react'
import ClientDashboardPreview from '@/components/dashboard/ClientDashboardPreview'
import MainHeader from '@/components/shared/MainHeader'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch project for the current user
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <MainHeader initialUser={user} variant="client" />

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Layout className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">No project assigned</h1>
          <p className="text-muted-foreground max-w-md">
            You don't have an active project assigned to your account yet. Please contact support to get started.
          </p>
          <Link 
            href="/"
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Back to Homepage
          </Link>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026 EstabWeb. All rights reserved.
          </div>
        </footer>
      </div>
    )
  }

  return <ClientDashboardPreview project={project} user={user} />
}
