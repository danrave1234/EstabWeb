import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import AdminDashboardRequests from './AdminDashboardRequests'
import MainHeader from '@/components/shared/MainHeader'

export default async function AdminRequestsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Admin check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return redirect('/dashboard')
  }

  // Fetch pending requests with project and profile data
  const { data: requests, error } = await supabase
    .from('change_requests')
    .select(`
      *,
      projects (
        id,
        subdomain,
        current_config
      ),
      profiles (
        email
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Approval Center</h1>
            <p className="text-muted-foreground mt-2">
              Review and approve content change requests from clients.
            </p>
          </div>

          <AdminDashboardRequests initialRequests={requests || []} />
        </div>
      </div>
    </div>
  )
}
