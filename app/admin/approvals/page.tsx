import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApproveButton from '@/components/admin/ApproveButton'

export const dynamic = 'force-dynamic'

export default async function AdminApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return redirect('/dashboard')

  const { data: requests } = await supabase
    .from('change_requests')
    .select('id,project_id,status,created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Change Requests</h1>
        <div className="space-y-3">
          {(requests ?? []).length === 0 ? (
            <div className="text-sm text-muted-foreground">No requests.</div>
          ) : (
            (requests ?? []).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl">
                <div className="text-sm">
                  <div className="font-semibold">{r.id}</div>
                  <div className="text-muted-foreground text-xs">Project: {r.project_id} • {r.status}</div>
                </div>
                {r.status === 'pending' ? (
                  <ApproveButton id={r.id} />
                ) : (
                  <span className="text-xs text-muted-foreground">{r.status}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
