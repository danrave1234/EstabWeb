"use client"

import { useEffect, useRef } from "react"
import { trackEvent, getOrCreateSessionId } from "@/components/shared/Analytics"

const INACTIVITY_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Fires session_start on mount and session_end on page unload or 5-min inactivity.
 * Attaches duration_seconds and page_count to the session_end event.
 * Gated by projectId — pass undefined when in admin/editor mode.
 */
export function useSessionTracking(projectId?: string, pageSlug?: string) {
  const startedAt   = useRef<number>(Date.now())
  const pageCount   = useRef<number>(1)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fired       = useRef(false)

  useEffect(() => {
    if (!projectId) return

    // Reset per project/page mount
    startedAt.current = Date.now()
    fired.current = false

    // Reset session ID tracking key so a new slug = new page in the session
    pageCount.current++

    // Fire session_start only once per sessionStorage lifetime
    const startKey = `_ss-${getOrCreateSessionId()}`
    if (typeof sessionStorage !== "undefined" && !sessionStorage.getItem(startKey)) {
      sessionStorage.setItem(startKey, "1")
      pageCount.current = 1
      trackEvent({
        type: "session_start",
        project_id: projectId,
        page_slug: pageSlug ?? "",
        funnel_step: "landing",
        metadata: { ts: startedAt.current },
      })
    }

    function fireSessionEnd() {
      if (fired.current) return
      fired.current = true
      const duration = Math.round((Date.now() - startedAt.current) / 1000)
      trackEvent({
        type: "session_end",
        project_id: projectId,
        page_slug: pageSlug ?? "",
        metadata: {
          duration_seconds: duration,
          page_count: pageCount.current,
        },
      })
    }

    function resetInactivityTimer() {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      inactivityTimer.current = setTimeout(fireSessionEnd, INACTIVITY_MS)
    }

    // Start inactivity timer
    resetInactivityTimer()

    // Activity events reset the inactivity timer
    const activityEvents = ["mousemove", "keydown", "scroll", "click", "touchstart"]
    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivityTimer, { passive: true }))

    // Fire on tab hide or page close
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") fireSessionEnd()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("beforeunload", fireSessionEnd)

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetInactivityTimer))
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("beforeunload", fireSessionEnd)
    }
  }, [projectId, pageSlug])
}
