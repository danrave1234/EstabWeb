import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getRedis } from "@/lib/cache/redis"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const redis = await getRedis()
    if (!redis) {
      return NextResponse.json({ error: "Redis is not configured" }, { status: 503 })
    }

    await redis.flushAll()

    return NextResponse.json({ success: true, message: "Redis cache cleared successfully" })
  } catch (err) {
    console.error("[clear-cache] Error:", err)
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}
