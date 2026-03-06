/**
 * @jest-environment jsdom
 *
 * Unit tests for Analytics.tsx client-side helper functions:
 *   getOrCreateVisitorId, getOrCreateSessionId, getOrCreateFirstTouch, resolveTrafficSource
 *
 * All helpers guard against SSR (typeof window === "undefined"), so each test
 * runs in jsdom where window is available.
 */

// We import the real helpers — no mocking of the module itself.
import {
  getOrCreateVisitorId,
  getOrCreateSessionId,
  getOrCreateFirstTouch,
  resolveTrafficSource,
} from "@/components/shared/Analytics"

// ─── helpers ────────────────────────────────────────────────────────────────

function clearStorage() {
  localStorage.clear()
  sessionStorage.clear()
}

// ─── getOrCreateVisitorId ────────────────────────────────────────────────────

describe("getOrCreateVisitorId", () => {
  beforeEach(clearStorage)

  it("creates and returns a UUID on first call", () => {
    const id = getOrCreateVisitorId()
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it("persists the same visitor ID across calls (localStorage)", () => {
    const first  = getOrCreateVisitorId()
    const second = getOrCreateVisitorId()
    expect(first).toBe(second)
  })

  it("returns the pre-existing ID if _vid is already in localStorage", () => {
    localStorage.setItem("_vid", "pre-existing-id")
    const id = getOrCreateVisitorId()
    expect(id).toBe("pre-existing-id")
  })

  it("returns empty string when localStorage throws (private-mode simulation)", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage")!
    Object.defineProperty(window, "localStorage", {
      get() { throw new Error("SecurityError") },
      configurable: true,
    })
    const id = getOrCreateVisitorId()
    expect(id).toBe("")
    Object.defineProperty(window, "localStorage", original)
  })
})

// ─── getOrCreateSessionId ────────────────────────────────────────────────────

describe("getOrCreateSessionId", () => {
  beforeEach(clearStorage)

  it("creates and returns a UUID on first call", () => {
    const id = getOrCreateSessionId()
    expect(id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it("persists the same session ID within the same tab (sessionStorage)", () => {
    const first  = getOrCreateSessionId()
    const second = getOrCreateSessionId()
    expect(first).toBe(second)
  })

  it("returns a different ID from visitor ID (independent UUIDs)", () => {
    const vid = getOrCreateVisitorId()
    const sid = getOrCreateSessionId()
    expect(vid).not.toBe(sid)
  })

  it("returns pre-existing ID when _sid is already set", () => {
    sessionStorage.setItem("_sid", "existing-session")
    expect(getOrCreateSessionId()).toBe("existing-session")
  })

  it("returns empty string when sessionStorage throws", () => {
    const original = Object.getOwnPropertyDescriptor(window, "sessionStorage")!
    Object.defineProperty(window, "sessionStorage", {
      get() { throw new Error("SecurityError") },
      configurable: true,
    })
    expect(getOrCreateSessionId()).toBe("")
    Object.defineProperty(window, "sessionStorage", original)
  })
})

// ─── getOrCreateFirstTouch ────────────────────────────────────────────────────

/**
 * jsdom does not allow navigating via window.location in tests.
 * Instead, mock the URLSearchParams constructor so the helpers read
 * whatever search params we supply without triggering any navigation.
 */
function mockSearchParams(values: Record<string, string> = {}) {
  jest.spyOn(global, "URLSearchParams").mockImplementation(
    () => ({ get: (k: string) => values[k] ?? null }) as unknown as URLSearchParams,
  )
}

describe("getOrCreateFirstTouch", () => {
  beforeEach(() => {
    clearStorage()
    jest.restoreAllMocks()
    mockSearchParams() // default: no UTM params
    Object.defineProperty(document, "referrer", { value: "", writable: true, configurable: true })
  })

  afterEach(() => jest.restoreAllMocks())

  it("returns source=direct when no UTM and no referrer", () => {
    const ft = getOrCreateFirstTouch()
    expect(ft.source).toBe("direct")
    expect(ft.utm).toEqual({})
  })

  it("parses utm_source from URL search params", () => {
    mockSearchParams({ utm_source: "facebook", utm_campaign: "summer" })
    const ft = getOrCreateFirstTouch()
    expect(ft.source).toBe("facebook")
    expect(ft.utm.utm_source).toBe("facebook")
    expect(ft.utm.utm_campaign).toBe("summer")
  })

  it("falls back to referrer hostname when no UTM", () => {
    Object.defineProperty(document, "referrer", {
      value: "https://www.google.com/search?q=test",
      writable: true, configurable: true,
    })
    const ft = getOrCreateFirstTouch()
    expect(ft.source).toBe("www.google.com")
  })

  it("never overwrites an existing first-touch stored in localStorage", () => {
    const stored = { source: "instagram", utm: { utm_source: "instagram" }, ts: 1000 }
    localStorage.setItem("_ft", JSON.stringify(stored))

    // Simulate new visit with different UTM — first-touch must not change
    mockSearchParams({ utm_source: "google" })
    const ft = getOrCreateFirstTouch()
    expect(ft.source).toBe("instagram") // original preserved
    expect(ft.utm.utm_source).toBe("instagram")
  })

  it("includes a timestamp (ts) in the returned object", () => {
    const before = Date.now()
    const ft = getOrCreateFirstTouch()
    expect(ft.ts).toBeGreaterThanOrEqual(before)
  })
})

// ─── resolveTrafficSource ─────────────────────────────────────────────────────

describe("resolveTrafficSource", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    mockSearchParams() // default: no UTM params
    Object.defineProperty(document, "referrer", { value: "", writable: true, configurable: true })
  })

  afterEach(() => jest.restoreAllMocks())

  it("returns 'direct' when no UTM and no referrer", () => {
    expect(resolveTrafficSource()).toBe("direct")
  })

  it("returns utm_source value when present", () => {
    mockSearchParams({ utm_source: "newsletter" })
    expect(resolveTrafficSource()).toBe("newsletter")
  })

  it("returns referrer hostname when no UTM param", () => {
    Object.defineProperty(document, "referrer", {
      value: "https://www.facebook.com/",
      writable: true, configurable: true,
    })
    expect(resolveTrafficSource()).toBe("www.facebook.com")
  })

  it("utm_source takes priority over referrer", () => {
    mockSearchParams({ utm_source: "email" })
    Object.defineProperty(document, "referrer", {
      value: "https://www.google.com/",
      writable: true, configurable: true,
    })
    expect(resolveTrafficSource()).toBe("email")
  })
})
