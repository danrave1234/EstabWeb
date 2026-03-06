import { revalidatePath, revalidateTag } from "next/cache"

const mockGetUser = jest.fn()
const mockProjectSingle = jest.fn()
const mockProjectsUpdateEq = jest.fn()
const mockProjectsUpdate = jest.fn(() => ({ eq: mockProjectsUpdateEq }))
const mockProjectVersionsInsert = jest.fn()

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
}))

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: jest.fn((table: string) => {
      if (table === "projects") {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({ single: mockProjectSingle })),
          })),
          update: mockProjectsUpdate,
        }
      }
      if (table === "project_versions") {
        return { insert: mockProjectVersionsInsert }
      }
      return {}
    }),
  })),
}))

jest.mock("@/lib/utils", () => ({
  normalizeConfig: jest.fn((v) => v),
}))

jest.mock("@/lib/subscription", () => ({
  canPublishDirectly: jest.fn(() => true),
  canPublishNow: jest.fn(() => true),
  getPublishStats: jest.fn(() => ({
    limit: 10,
    used: 0,
    remaining: 10,
    limitDaily: 5,
    usedToday: 0,
    remainingToday: 5,
  })),
  DEFAULT_PUBLISH_LIMIT: 10,
  DEFAULT_PUBLISH_LIMIT_DAILY: 5,
}))

jest.mock("@/lib/utils/site-pages", () => ({
  normalizePagesWithDefaults: jest.fn(() => []),
  getPlanLimits: jest.fn(async () => ({})),
  getMaxPagesForProject: jest.fn(() => 1),
  isLegalPageSlug: jest.fn(() => false),
}))

jest.mock("@/lib/codes", () => ({
  generateSubdomain: jest.fn(() => "new-brand"),
}))

jest.mock("@/lib/audit", () => ({
  logAudit: jest.fn(async () => undefined),
}))

jest.mock("@/lib/cache/invalidation", () => ({
  onProjectPublished: jest.fn(async () => undefined),
}))

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/publish", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/publish", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    POST = require("@/app/api/publish/route").POST
  })

  it("returns 401 for unauthenticated users", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await POST(makeRequest({ projectId: "proj-1" }))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.error).toMatch(/unauthorized/i)
  })

  it("returns 400 when no draft changes exist", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } })
    mockProjectSingle.mockResolvedValue({
      data: {
        id: "proj-1",
        client_id: "user-1",
        draft_config: null,
      },
      error: null,
    })

    const res = await POST(makeRequest({ projectId: "proj-1" }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/no draft changes/i)
  })

  it("publishes draft config and writes version snapshot", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } })
    mockProjectSingle.mockResolvedValue({
      data: {
        id: "proj-1",
        client_id: "user-1",
        current_config: { brand: { name: "Old" } },
        draft_config: { brand: { name: "New Brand" } },
        config_version: 2,
        subdomain: "old",
        custom_domain: "acme.com",
        publish_period_start: new Date().toISOString(),
        publish_count: 1,
        publish_count_today: 0,
        publish_date: null,
      },
      error: null,
    })
    mockProjectsUpdateEq.mockResolvedValue({ error: null })
    mockProjectVersionsInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ projectId: "proj-1" }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.version).toBe(3)
    expect(mockProjectsUpdate).toHaveBeenCalled()
    expect(mockProjectVersionsInsert).toHaveBeenCalledWith(
      expect.objectContaining({ project_id: "proj-1", version: 3 }),
    )
    expect(revalidateTag).toHaveBeenCalledWith("site:old", "max")
    expect(revalidatePath).toHaveBeenCalled()
  })
})
