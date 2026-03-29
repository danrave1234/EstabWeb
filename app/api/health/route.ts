import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"

/**
 * GET /api/health
 *
 * Simple health check endpoint for uptime monitoring.
 * Returns { status: "ok", db: "ok" | "error", timestamp }
 */
export async function GET() {
  let dbStatus = "ok"

  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from("profiles").select("id").limit(1)
    if (error) dbStatus = "error"
  } catch {
    dbStatus = "error"
  }

  const status = dbStatus === "ok" ? 200 : 503

  return NextResponse.json(
    {
      status: dbStatus === "ok" ? "ok" : "degraded",
      db: dbStatus,
      timestamp: new Date().toISOString(),
    },
    { status },
  )
}
