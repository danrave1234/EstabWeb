"use client"

import { useEffect, useRef } from "react"
import { getOrCreateSessionId, trackEvent } from "@/components/shared/Analytics"

const INACTIVITY_MS = 5 * 60 * 1000

export function useSessionTracking(projectId?: string, pageSlug?: string) {
  const startedAt = useRef<number>(Date.now())
  const pageCount = useRef<number>(1)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!projectId) return

    const startKey = `_ss-${getOrCreateSessionId()}`
    startedAt.current = Date.now()
    fired.current = false

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
    } else {
      pageCount.current += 1
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

    resetInactivityTimer()

    const activityEvents = ["mousemove", "keydown", "scroll", "click", "touchstart"]
    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivityTimer, { passive: true }))

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
  }, [pageSlug, projectId])
}
