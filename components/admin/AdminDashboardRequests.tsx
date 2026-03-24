import * as React from "react"
import { format } from "date-fns"
import { Eye, Clock, User as UserIcon, FileText, Globe, Layout, User, Heart, ShoppingCart, PhoneCall, Info } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const sectionConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  domain: { label: "Domain", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
  hero: { label: "Hero", icon: Layout, color: "text-purple-500", bg: "bg-purple-500/10" },
  about: { label: "About", icon: Info, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  services: { label: "Services", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  pricing: { label: "Pricing", icon: ShoppingCart, color: "text-amber-500", bg: "bg-amber-500/10" },
  contact: { label: "Contact", icon: PhoneCall, color: "text-indigo-500", bg: "bg-indigo-500/10" },
}

const getSectionInfo = (section: string | null) => {
  if (!section) return { label: "Full Site", icon: FileText, color: "text-zinc-500", bg: "bg-zinc-500/10" }
  const key = section.split('--')[0]
  return sectionConfig[key] || {
    label: section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    icon: Layout,
    color: "text-zinc-500",
    bg: "bg-zinc-500/10"
  }
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
      <Card className="border-dashed bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
          <div className="p-4 rounded-full bg-muted/50 text-muted-foreground/30">
            <FileText className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium">No pending requests found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => {
        const brandName = request.projects?.current_config?.brand?.name
        const subdomain = request.projects?.subdomain || "no-subdomain"
        const displayName = brandName || subdomain
        const email = request.profiles?.email || "Unknown"
        const sectionInfo = getSectionInfo(request.section_id)
        const Icon = sectionInfo.icon

        return (
          <Card key={request.id} className="group hover:border-primary/50 transition-all duration-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Icon/Avatar */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-border shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${sectionInfo.color}`} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">{displayName}</span>
                      <Badge variant="outline" className="font-mono text-[10px] py-0 px-2 h-5 bg-muted/50">
                        {subdomain}
                      </Badge>
                      <Badge className={`${sectionInfo.bg} ${sectionInfo.color} border-none font-bold text-[10px] h-5`}>
                        {sectionInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground/50" />
                        {format(new Date(request.created_at), "MMM d, yyyy · HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pending badge + action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                    Pending
                  </Badge>
                  <Button asChild size="sm" className="rounded-lg font-bold text-xs uppercase tracking-wider h-9 px-4">
                    <Link href={`/admin/dashboard/requests/${request.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
