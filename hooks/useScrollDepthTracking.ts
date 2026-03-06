"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/components/shared/Analytics"

const MILESTONES = [25, 50, 75, 100] as const

/**
 * Fires a `scroll_depth` event each time the visitor crosses a 25 / 50 / 75 / 100 %
 * scroll milestone on the current page. Each milestone fires only once per page load.
 */
export function useScrollDepthTracking(projectId?: string, pageSlug?: string) {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    if (!projectId) return

    // Reset fired milestones on page/slug change
    fired.current = new Set()

    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total === 0) return
      const pct = Math.round((scrolled / total) * 100)

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone)
          trackEvent({
            type: "scroll_depth",
            project_id: projectId,
            page_slug: pageSlug ?? "",
            metadata: { depth_percent: milestone },
          })
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // Fire immediately in case user is already scrolled (e.g. returning via back button)
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [projectId, pageSlug])
}
