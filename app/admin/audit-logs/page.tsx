import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { ClipboardList, Globe, Layout, RotateCcw, Upload } from 'lucide-react'

export const dynamic = 'force-dynamic'

const ACTION_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  publish: { label: 'Published', icon: <Upload className="w-3.5 h-3.5" />, color: 'text-green-500' },
  rollback: { label: 'Rollback', icon: <RotateCcw className="w-3.5 h-3.5" />, color: 'text-yellow-500' },
  preset_change: { label: 'Preset Changed', icon: <Layout className="w-3.5 h-3.5" />, color: 'text-blue-500' },
  domain_change: { label: 'Domain Changed', icon: <Globe className="w-3.5 h-3.5" />, color: 'text-purple-500' },
}

function formatMetadata(action: string, metadata: Record<string, unknown>) {
  if (action === 'publish') return `v${metadata.version}`
  if (action === 'rollback') return `v${metadata.restoredVersion} → v${metadata.newVersion}`
  if (action === 'preset_change') return String(metadata.presetKey ?? '')
  if (action === 'domain_change') return String(metadata.domain ?? '')
  return JSON.stringify(metadata)
}

export default async function AdminAuditLogsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return redirect('/dashboard')

  const { data: logs } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      metadata,
      created_at,
      performed_by,
      profiles:performed_by ( email ),
      projects:project_id ( subdomain, custom_domain )
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (logs ?? []) as any[]

  const counts = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.action] = (acc[r.action] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          </div>
          <p className="text-sm text-muted-foreground">Track every key admin action across all projects.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(ACTION_META).map(([key, meta]) => (
            <div key={key} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              <span className={`${meta.color}`}>{meta.icon}</span>
              <div>
                <p className="text-xs text-muted-foreground">{meta.label}</p>
                <p className="text-xl font-bold text-foreground">{counts[key] ?? 0}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      No audit logs yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const meta = ACTION_META[row.action]
                    const domain = row.projects?.custom_domain || row.projects?.subdomain || '—'
                    const email = row.profiles?.email ?? row.performed_by ?? '—'
                    const detail = formatMetadata(row.action, row.metadata ?? {})
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta?.color ?? 'text-muted-foreground'}`}>
                            {meta?.icon}
                            {meta?.label ?? row.action}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{domain}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{detail}</TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(row.created_at).toLocaleString('en-PH', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
