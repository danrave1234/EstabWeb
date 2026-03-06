import * as React from "react"
import { format } from "date-fns"
import { Eye, Clock, User, FileText } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

const sectionLabel = (section: string | null) => {
  if (!section) return "Full Site Snapshot"
  return section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

const sectionColor = (section: string | null) => {
  if (!section) return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  const map: Record<string, string> = {
    domain: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    hero: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    about: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    menu: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    contact: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  }
  return map[section] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
}

export default async function AdminDashboardRequests() {
  const supabase = await createClient()

  const { data: rawRequests, error } = await supabase
    .from('change_requests')
    .select(`
      *,
      projects (
        id,
        subdomain,
        current_config
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching requests:', error)
  }

  // Fetch emails from profiles
  let requests = rawRequests ?? []
  if (requests.length > 0) {
    const userIds = [...new Set(requests.map((r: any) => r.requested_by).filter(Boolean))]
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds as string[])
    const profileMap = Object.fromEntries((profileRows ?? []).map((p: any) => [p.id, p]))
    requests = requests.map((r: any) => ({
      ...r,
      profiles: profileMap[r.requested_by] ?? null,
    }))
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-2">
        <FileText className="w-8 h-8 opacity-30" />
        <p className="text-sm">No pending requests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const brandName = request.projects?.current_config?.brand?.name
        const subdomain = request.projects?.subdomain || "no-subdomain"
        const displayName = brandName || subdomain
        const email = request.profiles?.email || "Unknown"

        return (
          <div
            key={request.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                {displayName.charAt(0)}
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-foreground truncate">{displayName}</span>
                  <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground">
                    {subdomain}
                  </code>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${sectionColor(request.section_id)}`}>
                    {sectionLabel(request.section_id)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground flex-wrap font-medium">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-primary/60" />
                    {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary/60" />
                    {format(new Date(request.created_at), "MMM d, yyyy · HH:mm")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending badge + action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
              <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                Pending
              </span>
              <Link
                href={`/admin/dashboard/requests/${request.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Eye className="w-4 h-4" />
                Review
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
