/**
 * @jest-environment jsdom
 *
 * Unit tests for analytics tracking hooks:
 *   useScrollDepthTracking  — scroll_depth events at 25/50/75/100% milestones
 *   useClickMapTracking     — click_map events with element metadata
 *   useSessionTracking      — session_start / session_end lifecycle events
 */

import { renderHook, act } from "@testing-library/react"

// ─── mock trackEvent ─────────────────────────────────────────────────────────
const mockTrackEvent = jest.fn()
const mockGetOrCreateSessionId = jest.fn(() => "test-session-id")

jest.mock("@/components/shared/Analytics", () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  getOrCreateSessionId: () => mockGetOrCreateSessionId(),
}))

// ─── imports (after mock) ─────────────────────────────────────────────────────
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking"
import { useClickMapTracking } from "@/hooks/useClickMapTracking"
import { useSessionTracking } from "@/hooks/useSessionTracking"
import { useSectionTracking } from "@/hooks/useSectionTracking"

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Simulate scroll so window.scrollY + innerHeight = pct% of scrollHeight */
function simulateScrollAt(pct: number) {
  const total = 1000
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: total, configurable: true,
  })
  Object.defineProperty(window, "innerHeight", { value: 0, configurable: true })
  Object.defineProperty(window, "scrollY", {
    value: Math.round((pct / 100) * total),
    configurable: true,
  })
  window.dispatchEvent(new Event("scroll"))
}

// ─── useScrollDepthTracking ───────────────────────────────────────────────────

describe("useScrollDepthTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset scroll position
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true })
    Object.defineProperty(window, "innerHeight", { value: 0, configurable: true })
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000, configurable: true,
    })
  })

  it("does NOT fire if projectId is undefined", () => {
    renderHook(() => useScrollDepthTracking(undefined, "home"))
    act(() => simulateScrollAt(50))
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("fires scroll_depth at the 25% milestone", () => {
    renderHook(() => useScrollDepthTracking("proj-1", "home"))
    act(() => simulateScrollAt(25))
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "scroll_depth",
        project_id: "proj-1",
        page_slug: "home",
        metadata: expect.objectContaining({ depth_percent: 25 }),
      }),
    )
  })

  it("fires scroll_depth at 50, 75, and 100 milestones", () => {
    renderHook(() => useScrollDepthTracking("proj-1", "page"))
    act(() => simulateScrollAt(100))
    const types = mockTrackEvent.mock.calls.map((c) => c[0].metadata?.depth_percent)
    expect(types).toEqual(expect.arrayContaining([25, 50, 75, 100]))
  })

  it("each milestone fires only once even if scroll event repeats", () => {
    renderHook(() => useScrollDepthTracking("proj-1", "page"))
    act(() => { simulateScrollAt(50); simulateScrollAt(50); simulateScrollAt(50) })
    const calls50 = mockTrackEvent.mock.calls.filter(
      (c) => c[0].metadata?.depth_percent === 50,
    )
    expect(calls50).toHaveLength(1)
  })

  it("resets milestones when projectId/pageSlug changes", () => {
    const { rerender } = renderHook(
      ({ slug }: { slug: string }) => useScrollDepthTracking("proj-1", slug),
      { initialProps: { slug: "page-a" } },
    )
    act(() => simulateScrollAt(25))
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)

    // New page slug → milestones reset
    rerender({ slug: "page-b" })
    act(() => simulateScrollAt(25))
    // Should fire again for the new page
    const calls = mockTrackEvent.mock.calls.filter(
      (c) => c[0].metadata?.depth_percent === 25,
    )
    expect(calls.length).toBeGreaterThanOrEqual(2)
  })

  it("removes the scroll listener on unmount", () => {
    const removeSpy = jest.spyOn(window, "removeEventListener")
    const { unmount } = renderHook(() => useScrollDepthTracking("proj-1", "home"))
    unmount()
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function))
    removeSpy.mockRestore()
  })
})

// ─── useClickMapTracking ──────────────────────────────────────────────────────

describe("useClickMapTracking", () => {
  beforeEach(() => jest.clearAllMocks())

  it("does NOT fire if projectId is undefined", () => {
    renderHook(() => useClickMapTracking(undefined, "home"))
    act(() => document.body.dispatchEvent(new MouseEvent("click", { bubbles: true })))
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("fires click_map event on document click", () => {
    renderHook(() => useClickMapTracking("proj-1", "home"))
    act(() => document.body.dispatchEvent(new MouseEvent("click", { bubbles: true })))
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "click_map", project_id: "proj-1", page_slug: "home" }),
    )
  })

  it("captures element_type=button for a button click", () => {
    renderHook(() => useClickMapTracking("proj-1", "home"))
    const btn = document.createElement("button")
    btn.setAttribute("aria-label", "Submit")
    document.body.appendChild(btn)
    act(() => btn.click())
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ element_type: "button", element_text: "Submit" }),
      }),
    )
    document.body.removeChild(btn)
  })

  it("captures element_type=link for an anchor click", () => {
    renderHook(() => useClickMapTracking("proj-1", "home"))
    const a = document.createElement("a")
    a.setAttribute("aria-label", "Go here")
    document.body.appendChild(a)
    act(() => a.click())
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ element_type: "link" }),
      }),
    )
    document.body.removeChild(a)
  })

  it("captures data-track-id as element_id when present", () => {
    renderHook(() => useClickMapTracking("proj-1", "home"))
    const btn = document.createElement("button")
    btn.setAttribute("data-track-id", "hero_cta")
    document.body.appendChild(btn)
    act(() => btn.click())
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ element_id: "hero_cta" }),
      }),
    )
    document.body.removeChild(btn)
  })

  it("captures nearest data-section ancestor as section_key", () => {
    renderHook(() => useClickMapTracking("proj-1", "home"))
    const section = document.createElement("div")
    section.setAttribute("data-section", "pricing")
    const btn = document.createElement("button")
    btn.textContent = "Buy"
    section.appendChild(btn)
    document.body.appendChild(section)
    act(() => btn.click())
    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ section_key: "pricing" }),
    )
    document.body.removeChild(section)
  })

  it("removes the click listener on unmount", () => {
    const removeSpy = jest.spyOn(document, "removeEventListener")
    const { unmount } = renderHook(() => useClickMapTracking("proj-1", "home"))
    unmount()
    expect(removeSpy).toHaveBeenCalledWith("click", expect.any(Function))
    removeSpy.mockRestore()
  })
})

// ─── useSectionTracking ───────────────────────────────────────────────────────

describe("useSectionTracking", () => {
  const observedTargets = new Set<Element>()
  let observerCallback: IntersectionObserverCallback | null = null

  beforeEach(() => {
    jest.clearAllMocks()
    observedTargets.clear()
    observerCallback = null
    sessionStorage.clear()
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    })
    Object.defineProperty(document, "hasFocus", {
      value: () => true,
      configurable: true,
    })

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback
      }

      observe(target: Element) {
        observedTargets.add(target)
      }

      unobserve(target: Element) {
        observedTargets.delete(target)
      }

      disconnect() {
        observedTargets.clear()
      }
    }

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    })
  })

  it("does NOT fire if projectId is undefined", () => {
    const section = document.createElement("section")
    section.setAttribute("data-section", "gym--faq")
    document.body.appendChild(section)

    renderHook(() => useSectionTracking(undefined, "home"))

    expect(observedTargets.size).toBe(0)
    expect(mockTrackEvent).not.toHaveBeenCalled()

    document.body.removeChild(section)
  })

  it("tracks a section view through the shared analytics helper", () => {
    const section = document.createElement("section")
    section.setAttribute("data-section", "gym--faq")
    section.setAttribute("data-section-slot", "faq")
    section.setAttribute("data-section-family", "faq")
    section.setAttribute("data-section-variant", "gym--faq")
    section.setAttribute("data-section-instance-id", "42:3:gym--faq")
    section.setAttribute("data-page-version-id", "42")
    section.setAttribute("data-section-label", "Gym FAQ")
    section.setAttribute("data-section-goal", "trust")
    document.body.appendChild(section)

    renderHook(() => useSectionTracking("proj-1", "home"))

    expect(observedTargets.has(section)).toBe(true)

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          target: section,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver)
    })

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "section_view",
        project_id: "proj-1",
        page_slug: "home",
        section_key: "gym--faq",
        metadata: expect.objectContaining({
          section_slot: "faq",
          section_family: "faq",
          section_variant: "gym--faq",
          section_instance_id: "42:3:gym--faq",
          page_version_id: "42",
          section_label: "Gym FAQ",
          section_goal: "trust",
          section_is_interactive: true,
          section_interaction_type: "faq",
          section_interaction_label: "Questions people expand",
        }),
      }),
    )

    document.body.removeChild(section)
  })

  it("tracks a section only once per browser session", () => {
    const section = document.createElement("section")
    section.setAttribute("data-section", "gym--faq")
    document.body.appendChild(section)

    const { rerender } = renderHook(
      ({ slug }: { slug: string }) => useSectionTracking("proj-1", slug),
      { initialProps: { slug: "home" } },
    )

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          target: section,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver)
    })

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)

    rerender({ slug: "home" })

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          target: section,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver)
    })

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)

    document.body.removeChild(section)
  })

  it("tracks section attention only while the section is visible and the tab stays active", () => {
    jest.useFakeTimers()

    const section = document.createElement("section")
    section.setAttribute("data-section", "gym--faq")
    section.setAttribute("data-section-slot", "faq")
    section.setAttribute("data-section-family", "faq")
    section.setAttribute("data-section-variant", "gym--faq")
    section.setAttribute("data-section-instance-id", "42:3:gym--faq")
    section.setAttribute("data-page-version-id", "42")
    document.body.appendChild(section)

    renderHook(() => useSectionTracking("proj-1", "home"))

    act(() => {
      observerCallback?.([
        {
          isIntersecting: true,
          intersectionRatio: 0.6,
          target: section,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver)
    })

    act(() => {
      jest.advanceTimersByTime(1200)
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        configurable: true,
      })
      document.dispatchEvent(new Event("visibilitychange"))
    })

    const attentionCall = mockTrackEvent.mock.calls.find((call) => call[0].type === "section_attention")
    expect(attentionCall?.[0]).toEqual(
      expect.objectContaining({
        type: "section_attention",
        project_id: "proj-1",
        page_slug: "home",
        section_key: "gym--faq",
        metadata: expect.objectContaining({
          section_slot: "faq",
          section_family: "faq",
          section_variant: "gym--faq",
          section_instance_id: "42:3:gym--faq",
          page_version_id: "42",
          visible_time_ms: expect.any(Number),
          visible_time_seconds: expect.any(Number),
          max_visibility_ratio: 0.6,
        }),
      }),
    )
    expect(attentionCall?.[0].metadata.visible_time_ms).toBeGreaterThanOrEqual(1000)

    document.body.removeChild(section)
    jest.useRealTimers()
  })
})

// ─── useSessionTracking ───────────────────────────────────────────────────────

describe("useSessionTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("does NOT fire if projectId is undefined", () => {
    renderHook(() => useSessionTracking(undefined, "home"))
    expect(mockTrackEvent).not.toHaveBeenCalled()
  })

  it("fires session_start on first mount (key not in sessionStorage)", () => {
    renderHook(() => useSessionTracking("proj-1", "home"))
    const calls = mockTrackEvent.mock.calls.filter((c) => c[0].type === "session_start")
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toMatchObject({
      type: "session_start",
      project_id: "proj-1",
      page_slug: "home",
      funnel_step: "landing",
    })
  })

  it("does NOT fire session_start again if sessionStorage key already set", () => {
    // Simulate key already set from a previous page in same session
    sessionStorage.setItem("_ss-test-session-id", "1")
    renderHook(() => useSessionTracking("proj-1", "about"))
    const calls = mockTrackEvent.mock.calls.filter((c) => c[0].type === "session_start")
    expect(calls).toHaveLength(0)
  })

  it("fires session_end when tab becomes hidden (visibilitychange)", () => {
    renderHook(() => useSessionTracking("proj-1", "home"))
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden", configurable: true,
      })
      document.dispatchEvent(new Event("visibilitychange"))
    })
    const calls = mockTrackEvent.mock.calls.filter((c) => c[0].type === "session_end")
    expect(calls).toHaveLength(1)
    expect(calls[0][0].metadata).toHaveProperty("duration_seconds")
    expect(calls[0][0].metadata).toHaveProperty("page_count")
  })

  it("fires session_end only once even if visibilitychange fires multiple times", () => {
    renderHook(() => useSessionTracking("proj-1", "home"))
    act(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true })
      document.dispatchEvent(new Event("visibilitychange"))
      document.dispatchEvent(new Event("visibilitychange"))
      document.dispatchEvent(new Event("visibilitychange"))
    })
    const calls = mockTrackEvent.mock.calls.filter((c) => c[0].type === "session_end")
    expect(calls).toHaveLength(1)
  })

  it("fires session_end after 5-minute inactivity timeout", () => {
    renderHook(() => useSessionTracking("proj-1", "home"))
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000 + 100)
    })
    const calls = mockTrackEvent.mock.calls.filter((c) => c[0].type === "session_end")
    expect(calls).toHaveLength(1)
  })

  it("cleans up all listeners on unmount", () => {
    const winSpy = jest.spyOn(window, "removeEventListener")
    const docSpy = jest.spyOn(document, "removeEventListener")
    const { unmount } = renderHook(() => useSessionTracking("proj-1", "home"))
    unmount()
    expect(winSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function))
    expect(docSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function))
    winSpy.mockRestore()
    docSpy.mockRestore()
  })
})
