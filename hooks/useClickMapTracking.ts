"use client"

import { useEffect } from "react"
import { trackEvent } from "@/components/shared/Analytics"
import { getSectionAnalyticsMetaFromDataset, sectionMetaToEventMetadata } from "@/lib/analytics/section-insights"

/**
 * Tracks every meaningful click and records element-based identifiers so
 * the dashboard can show actionable heatmap data without raw coordinates.
 *
 * Stored per click:
 *   element_id    — id attr or data-track-id attr (e.g. "hero_cta", "pricing_card_1")
 *   element_type  — semantic type: "button" | "link" | "image" | "element"
 *   element_text  — first 60 chars of innerText / alt / aria-label
 *   element_section — nearest data-section ancestor key
 */
export function useClickMapTracking(projectId?: string, pageSlug?: string) {
  useEffect(() => {
    if (!projectId) return

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Walk up to find the most meaningful clickable element (button or anchor)
      let el: HTMLElement | null = target
      for (let i = 0; i < 5 && el && el !== document.body; i++) {
        if (el.tagName === "BUTTON" || el.tagName === "A") break
        el = el.parentElement
      }
      if (!el) el = target

      // element_id: prefer data-track-id, then id attr, then constructed fallback
      const elementId =
        el.getAttribute("data-track-id") ||
        el.id ||
        el.closest("[data-track-id]")?.getAttribute("data-track-id") ||
        undefined

      // element_type: semantic category
      const tag = el.tagName.toLowerCase()
      const elementType =
        tag === "button" ? "button"
        : tag === "a"      ? "link"
        : tag === "img"    ? "image"
        : "element"

      // element_text: best available label, truncated
      const rawText =
        el.getAttribute("aria-label") ||
        (el as HTMLImageElement).alt ||
        el.innerText ||
        ""
      const elementText = rawText.trim().slice(0, 60) || undefined

      // Walk up DOM to find nearest section key
      let sectionKey: string | undefined
      let sectionMeta = null
      let node: HTMLElement | null = el
      while (node && node !== document.body) {
        const attr = node.getAttribute("data-section")
        if (attr) {
          sectionKey = attr
          sectionMeta = getSectionAnalyticsMetaFromDataset(node.dataset)
          break
        }
        node = node.parentElement
      }

      trackEvent({
        type: "click_map",
        project_id: projectId,
        page_slug: pageSlug ?? "",
        section_key: sectionKey,
        metadata: {
          element_id: elementId,
          element_type: elementType,
          element_text: elementText,
          ...sectionMetaToEventMetadata(sectionMeta),
        },
      })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [projectId, pageSlug])
}
