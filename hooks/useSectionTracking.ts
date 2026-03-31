"use client"

import { useEffect } from "react"
import { trackEvent } from "@/components/shared/Analytics"
import { getSectionAnalyticsMetaFromDataset, sectionMetaToEventMetadata } from "@/lib/analytics/section-insights"

function buildViewedSectionKey(projectId: string, pageSlug: string | undefined, sectionKey: string) {
  return `analytics:section-viewed:${projectId}:${pageSlug ?? ""}:${sectionKey}`
}

function hasViewedSectionInSession(projectId: string, pageSlug: string | undefined, sectionKey: string) {
  if (typeof window === "undefined") return false

  try {
    return window.sessionStorage.getItem(buildViewedSectionKey(projectId, pageSlug, sectionKey)) === "1"
  } catch {
    return false
  }
}

function markSectionViewedInSession(projectId: string, pageSlug: string | undefined, sectionKey: string) {
  if (typeof window === "undefined") return

  try {
    window.sessionStorage.setItem(buildViewedSectionKey(projectId, pageSlug, sectionKey), "1")
  } catch {
    // ignore storage errors and continue tracking once per page lifecycle
  }
}

type AttentionState = {
  element: HTMLElement
  sectionKey: string
  pageVersionId?: string
  metadata: Record<string, unknown>
  isIntersecting: boolean
  intersectionRatio: number
  visibleStartedAt: number | null
  totalVisibleMs: number
  maxVisibilityRatio: number
}

export function useSectionTracking(projectId?: string, pageSlug?: string) {
  useEffect(() => {
    if (!projectId) return

    const sectionStates = new Map<HTMLElement, AttentionState>()
    let pageVisible = document.visibilityState !== "hidden"
    let windowFocused = typeof document.hasFocus === "function" ? document.hasFocus() : true

    const canCountAttention = (state: AttentionState) => (
      state.isIntersecting &&
      state.intersectionRatio >= 0.25 &&
      pageVisible &&
      windowFocused
    )

    const pauseAttention = (state: AttentionState, now = Date.now()) => {
      if (state.visibleStartedAt === null) return
      state.totalVisibleMs += Math.max(0, now - state.visibleStartedAt)
      state.visibleStartedAt = null
    }

    const resumeAttention = (state: AttentionState, now = Date.now()) => {
      if (!canCountAttention(state) || state.visibleStartedAt !== null) return
      state.visibleStartedAt = now
    }

    const flushAttention = (state: AttentionState, now = Date.now()) => {
      pauseAttention(state, now)

      if (state.totalVisibleMs < 750) return

      trackEvent({
        type: "section_attention",
        project_id: projectId,
        page_slug: pageSlug ?? "",
        section_key: state.sectionKey,
        metadata: {
          ...state.metadata,
          page_version_id: state.pageVersionId,
          visible_time_ms: Math.round(state.totalVisibleMs),
          visible_time_seconds: Number((state.totalVisibleMs / 1000).toFixed(1)),
          max_visibility_ratio: Number(state.maxVisibilityRatio.toFixed(2)),
        },
      })

      state.totalVisibleMs = 0
      state.maxVisibilityRatio = 0
    }

    const syncAttentionStates = () => {
      const now = Date.now()
      sectionStates.forEach((state) => {
        if (canCountAttention(state)) resumeAttention(state, now)
        else pauseAttention(state, now)
      })
    }

    const flushAllAttention = () => {
      const now = Date.now()
      sectionStates.forEach((state) => flushAttention(state, now))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement
          const section = element.getAttribute("data-section")
          if (!section) return

          const sectionMeta = getSectionAnalyticsMetaFromDataset(element.dataset)
          const pageVersionId = element.dataset.pageVersionId || (typeof window !== "undefined" ? window.PAGE_VERSION_ID : undefined)
          const metadata = sectionMetaToEventMetadata(sectionMeta, {
            section_slot: element.dataset.sectionSlot || sectionMeta?.sectionSlot,
            section_instance_id: element.dataset.sectionInstanceId || undefined,
            page_version_id: pageVersionId,
          })

          if (entry.isIntersecting && !hasViewedSectionInSession(projectId, pageSlug, section)) {
            markSectionViewedInSession(projectId, pageSlug, section)
            trackEvent({
              type: "section_view",
              project_id: projectId,
              page_slug: pageSlug ?? "",
              section_key: section,
              metadata,
            })
          }

          const existing = sectionStates.get(element)
          const state: AttentionState = existing ?? {
            element,
            sectionKey: section,
            pageVersionId,
            metadata,
            isIntersecting: false,
            intersectionRatio: 0,
            visibleStartedAt: null,
            totalVisibleMs: 0,
            maxVisibilityRatio: 0,
          }

          state.sectionKey = section
          state.pageVersionId = pageVersionId
          state.metadata = metadata
          state.isIntersecting = entry.isIntersecting
          state.intersectionRatio = entry.intersectionRatio
          state.maxVisibilityRatio = Math.max(state.maxVisibilityRatio, entry.intersectionRatio)
          sectionStates.set(element, state)

          if (canCountAttention(state)) resumeAttention(state)
          else if (!entry.isIntersecting || entry.intersectionRatio < 0.25) flushAttention(state)
        })
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    const handleVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden"
      if (!pageVisible) flushAllAttention()
      else syncAttentionStates()
    }

    const handleWindowBlur = () => {
      windowFocused = false
      flushAllAttention()
    }

    const handleWindowFocus = () => {
      windowFocused = true
      syncAttentionStates()
    }

    const handlePageHide = () => {
      flushAllAttention()
    }

    const elements = document.querySelectorAll("[data-section]")
    elements.forEach((el) => {
      observer.observe(el)
      const element = el as HTMLElement
      const section = element.getAttribute("data-section")
      if (!section) return
      const sectionMeta = getSectionAnalyticsMetaFromDataset(element.dataset)
      const pageVersionId = element.dataset.pageVersionId || (typeof window !== "undefined" ? window.PAGE_VERSION_ID : undefined)
      sectionStates.set(element, {
        element,
        sectionKey: section,
        pageVersionId,
        metadata: sectionMetaToEventMetadata(sectionMeta, {
          section_slot: element.dataset.sectionSlot || sectionMeta?.sectionSlot,
          section_instance_id: element.dataset.sectionInstanceId || undefined,
          page_version_id: pageVersionId,
        }),
        isIntersecting: false,
        intersectionRatio: 0,
        visibleStartedAt: null,
        totalVisibleMs: 0,
        maxVisibilityRatio: 0,
      })
    })

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleWindowBlur)
    window.addEventListener("focus", handleWindowFocus)
    window.addEventListener("pagehide", handlePageHide)
    window.addEventListener("beforeunload", handlePageHide)

    return () => {
      flushAllAttention()
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleWindowBlur)
      window.removeEventListener("focus", handleWindowFocus)
      window.removeEventListener("pagehide", handlePageHide)
      window.removeEventListener("beforeunload", handlePageHide)
    }
  }, [projectId, pageSlug])
}

declare global {
  interface Window {
    PAGE_VERSION_ID?: string
  }
}
