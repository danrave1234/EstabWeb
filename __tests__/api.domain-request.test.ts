/**
 * Unit tests for POST /api/domain/request
 *
 * Mocks: @/lib/supabase/server (no real DB/network calls)
 */

import { NextResponse } from 'next/server'

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/domain/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockGetUser = jest.fn()
const mockProfileSingle = jest.fn()
const mockProjectSingle = jest.fn()
const mockExistingSingle = jest.fn()
const mockInsert = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: jest.fn((table: string) => {
      if (table === 'change_requests') {
        return { insert: mockInsert }
      }
      // projects table — returns different singles depending on call order
      return {
        select: jest.fn(() => ({
          eq: jest.fn((col: string, val: string) => ({
            single: col === 'id' ? mockProjectSingle : mockExistingSingle,
            neq: jest.fn(() => ({ maybeSingle: mockExistingSingle })),
            maybeSingle: mockExistingSingle,
          })),
        })),
      }
    }),
  })),
}))

// ─── tests ───────────────────────────────────────────────────────────────────

describe('POST /api/domain/request', () => {
  let POST: (req: Request) => Promise<NextResponse>

  beforeEach(() => {
    jest.clearAllMocks()
    POST = require('@/app/api/domain/request/route').POST
  })

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'test.com' }))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.error).toMatch(/unauthorized/i)
  })

  it('returns 400 when projectId is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const res = await POST(makeRequest({ customDomain: 'test.com' }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/projectId/i)
  })

  it('returns 400 when customDomain is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const res = await POST(makeRequest({ projectId: 'proj-1' }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/customDomain/i)
  })

  it('returns 400 for an invalid domain format', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'not_valid' }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/invalid domain/i)
  })

  it('strips https:// prefix before validating domain', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: 'proj-1', client_id: 'user-1', custom_domain: null },
      error: null,
    })
    mockExistingSingle.mockResolvedValue({ data: null, error: null })
    mockInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'https://acme.com' }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.domain).toBe('acme.com')
  })

  it('returns 404 when project does not exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })

    const res = await POST(makeRequest({ projectId: 'proj-missing', customDomain: 'acme.com' }))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toMatch(/not found/i)
  })

  it('returns 403 when project belongs to a different user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: 'proj-1', client_id: 'other-user', custom_domain: null },
      error: null,
    })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'acme.com' }))
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.error).toMatch(/forbidden/i)
  })

  it('returns 409 when domain is already used by another project', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: 'proj-1', client_id: 'user-1', custom_domain: null },
      error: null,
    })
    mockExistingSingle.mockResolvedValue({ data: { id: 'proj-other' }, error: null })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'taken.com' }))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.error).toMatch(/already in use/i)
  })

  it('returns 200 and inserts a change_request on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: 'proj-1', client_id: 'user-1', custom_domain: null },
      error: null,
    })
    mockExistingSingle.mockResolvedValue({ data: null, error: null })
    mockInsert.mockResolvedValue({ error: null })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'myrestaurant.com' }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.domain).toBe('myrestaurant.com')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        project_id: 'proj-1',
        section_id: 'custom_domain',
        status: 'pending',
        requested_changes: { custom_domain: 'myrestaurant.com' },
      })
    )
  })

  it('returns 500 when change_request insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProjectSingle.mockResolvedValue({
      data: { id: 'proj-1', client_id: 'user-1', custom_domain: null },
      error: null,
    })
    mockExistingSingle.mockResolvedValue({ data: null, error: null })
    mockInsert.mockResolvedValue({ error: { message: 'DB write failed' } })

    const res = await POST(makeRequest({ projectId: 'proj-1', customDomain: 'myrestaurant.com' }))
    const json = await res.json()

    expect(res.status).toBe(500)
    expect(json.error).toMatch(/DB write failed/i)
  })
})
