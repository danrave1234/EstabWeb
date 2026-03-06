import { revalidatePath, revalidateTag } from "next/cache"

const mockGetUser = jest.fn()
const mockProjectSingle = jest.fn()
const mockVersionSingle = jest.fn()
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
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({ single: mockVersionSingle })),
            })),
          })),
          insert: mockProjectVersionsInsert,
        }
      }
      return {}
    }),
  })),
}))

jest.mock("@/lib/audit", () => ({
  logAudit: jest.fn(async () => undefined),
}))

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/rollback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/rollback", () => {
  let POST: (req: Request) => Promise<Response>

  beforeEach(() => {
    jest.clearAllMocks()
    POST = require("@/app/api/rollback/route").POST
  })

  it("returns 400 when version is missing", async () => {
    const res = await POST(makeRequest({ projectId: "proj-1" }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/missing projectId or version/i)
  })

  it("returns 404 when target version does not exist", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: "proj-1", client_id: "user-1", config_version: 4 },
      error: null,
    })
    mockVersionSingle.mockResolvedValue({ data: null, error: { message: "not found" } })

    const res = await POST(makeRequest({ projectId: "proj-1", version: 2 }))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toMatch(/version not found/i)
  })

  it("restores a snapshot and creates a new version", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } })
    mockProjectSingle.mockResolvedValue({
      data: {
        id: "proj-1",
        client_id: "user-1",
        config_version: 4,
        subdomain: "acme",
        custom_domain: "acme.com",
      },
      error: null,
    })
    mockVersionSingle.mockResolvedValue({
      data: { id: "ver-2", version: 2, snapshot: { brand: { name: "Restored" } } },
      error: null,
    })
    mockProjectsUpdateEq.mockResolvedValue({ error: null })
    mockProjectVersionsInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ projectId: "proj-1", version: 2 }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.version).toBe(5)
    expect(mockProjectVersionsInsert).toHaveBeenCalledWith(
      expect.objectContaining({ project_id: "proj-1", version: 5 }),
    )
    expect(revalidateTag).toHaveBeenCalledWith("site:acme", "max")
    expect(revalidatePath).toHaveBeenCalledWith("/acme")
  })
})
