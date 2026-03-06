"use client"

import { useEffect } from "react"

export function useSectionTracking(projectId?: string, pageSlug?: string) {
  useEffect(() => {
    if (!projectId) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute("data-section")
            if (!section) return

            observer.unobserve(entry.target)

            fetch("/api/track-event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "section_view",
                project_id: projectId,
                page_slug: pageSlug ?? "",
                section_key: section,
              }),
            }).catch(() => {
              // non-fatal
            })
          }
        })
      },
      { threshold: 0.4 }
    )

    const elements = document.querySelectorAll("[data-section]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [projectId, pageSlug])
}
