"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const ALLOWED_ROLES = ["admin", "sub_admin", "client"] as const
type Role = (typeof ALLOWED_ROLES)[number]

export async function updateUserRole(userId: string, newRole: Role) {
  const supabase = await createClient()

  // Only super admin can change roles
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    throw new Error("Only admins can change user roles.")
  }

  if (!ALLOWED_ROLES.includes(newRole)) {
    throw new Error("Invalid role.")
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/clients")
}
