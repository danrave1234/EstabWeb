import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const sectionLabel = (section: string | null) => {
  if (!section) return 'Full Site Snapshot'
  return section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const sectionColor = (section: string | null) => {
  if (!section) return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
  const map: Record<string, string> = {
    domain: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    hero: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    about: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    menu: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    contact: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  }
  return map[section] ?? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
}

const statusBadge = (status: string) => {
  if (status === 'pending') return { label: 'Pending', icon: AlertCircle, cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
  if (status === 'approved') return { label: 'Approved', icon: CheckCircle2, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' }
  return { label: 'Rejected', icon: XCircle, cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' }
}

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
    .select(`
      id, section_id, status, created_at,
      projects ( id, subdomain, current_config ),
      profiles ( email )
    `)
    .order('created_at', { ascending: false })

  const pending = (requests ?? []).filter((r) => r.status === 'pending')
  const others = (requests ?? []).filter((r) => r.status !== 'pending')

  const renderCard = (r: any) => {
    const subdomain = r.projects?.subdomain || 'no-subdomain'
    const brandName = r.projects?.current_config?.brand?.name
    const displayName = brandName || subdomain
    const email = r.profiles?.email || 'Unknown'
    const badge = statusBadge(r.status)
    const BadgeIcon = badge.icon

    return (
      <div
        key={r.id}
        className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
          {displayName.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground truncate">{displayName}</span>
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-muted-foreground">
              {subdomain}
            </code>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sectionColor(r.section_id)}`}>
              {sectionLabel(r.section_id)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {email}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(r.created_at), 'MMM d, yyyy · HH:mm')}
            </span>
          </div>
        </div>

        {/* Status + action */}
        <div className="flex items-center gap-3 shrink-0">
          <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>
          <Link
            href={`/admin/dashboard/requests/${r.id}`}
            className="p-2 rounded-full hover:bg-muted transition-colors text-primary"
            title="Review request"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Change Requests</h1>
          <p className="text-muted-foreground mt-1 text-sm">All client change requests — pending and resolved.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: (requests ?? []).length, cls: 'text-foreground' },
            { label: 'Pending', value: pending.length, cls: 'text-amber-600' },
            { label: 'Resolved', value: others.length, cls: 'text-emerald-600' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.cls}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Pending Review
            </h2>
            <div className="space-y-3">{pending.map(renderCard)}</div>
          </div>
        )}

        {/* Resolved */}
        {others.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Resolved
            </h2>
            <div className="space-y-3">{others.map(renderCard)}</div>
          </div>
        )}

        {/* Empty */}
        {(requests ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-2">
            <FileText className="w-8 h-8 opacity-30" />
            <p className="text-sm">No change requests yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
