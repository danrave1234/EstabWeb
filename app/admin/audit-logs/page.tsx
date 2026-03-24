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
import { ClipboardList, Globe, Layout, RotateCcw, Upload, User, Clock, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Track every key admin action across all projects.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(ACTION_META).map(([key, meta]) => {
            const colorClass = meta.color.replace('text-', 'bg-').replace('-500', '-500/10') + ' ' + meta.color
            return (
              <Card key={key} className="border-border/50 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    {meta.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{meta.label}</p>
                    <p className="text-xl font-bold text-foreground">{counts[key] ?? 0}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Table Card */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Comprehensive log of administrative actions.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64 hidden md:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter logs..."
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9 font-bold text-xs uppercase tracking-wider">
                  <Filter className="w-3.5 h-3.5 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Action</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Performed By</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Project</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Detail</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider h-12">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-20">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 rounded-full bg-muted/50">
                            <ClipboardList className="w-6 h-6 opacity-20" />
                          </div>
                          <p className="text-sm">No audit logs yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => {
                      const meta = ACTION_META[row.action]
                      const domain = row.projects?.custom_domain || row.projects?.subdomain || '—'
                      const email = row.profiles?.email ?? row.performed_by ?? '—'
                      const detail = formatMetadata(row.action, row.metadata ?? {})
                      const colorClass = meta?.color ? meta.color.replace('text-', 'bg-').replace('-500', '-500/10') + ' ' + meta.color : 'bg-muted text-muted-foreground'
                      
                      return (
                        <TableRow key={row.id} className="group hover:bg-muted/30 transition-colors">
                          <TableCell className="py-4">
                            <Badge className={`${colorClass} border-none font-bold text-[10px] py-0 px-2 h-6`}>
                              {meta?.icon && <span className="mr-1.5">{meta.icon}</span>}
                              {meta?.label ?? row.action.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-sm text-foreground font-medium">{email}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-muted-foreground/50" />
                              <span className="text-sm font-medium">{domain}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <code className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {detail}
                            </code>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">
                                {new Date(row.created_at).toLocaleString('en-PH', {
                                  month: 'short', day: 'numeric', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
