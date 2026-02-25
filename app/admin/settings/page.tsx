import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPlanLimits } from "@/lib/utils/site-pages"
import PlanLimitsForm from "@/components/admin/PlanLimitsForm"
import ClearCacheButton from "@/components/admin/ClearCacheButton"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") return redirect("/dashboard")

  const limits = await getPlanLimits(supabase)
  const freeMaxPages = limits.free?.maxPages ?? 1
  const proMaxPages = limits.pro?.maxPages ?? 5

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage platform limits and configuration for paid plans.
        </p>
      </div>

      <PlanLimitsForm freeMaxPages={freeMaxPages} proMaxPages={proMaxPages} />
      <ClearCacheButton />
    </div>
  )
}