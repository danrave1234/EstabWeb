/**
 * Unit tests for POST /api/vercel/add-domain
 *
 * Mocks: @/lib/supabase/server, @/lib/utils/vercel-domains
 */

import { NextResponse } from 'next/server'

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/vercel/add-domain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockGetUser = jest.fn()
const mockProfileEq = jest.fn()
const mockProjectEq = jest.fn()
const mockProfileSingle = jest.fn()
const mockProjectSingle = jest.fn()

const mockAddDomainToVercel = jest.fn()
const mockAddSubdomainToVercel = jest.fn()

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: jest.fn((table: string) => {
      if (table === 'profiles') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({ single: mockProfileSingle })),
          })),
        }
      }
      // projects table
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({ single: mockProjectSingle })),
        })),
      }
    }),
  })),
}))

jest.mock('@/lib/utils/vercel-domains', () => ({
  addDomainToVercel: mockAddDomainToVercel,
  addSubdomainToVercel: mockAddSubdomainToVercel,
}))

// ─── tests ───────────────────────────────────────────────────────────────────

describe('POST /api/vercel/add-domain', () => {
  let POST: (req: Request) => Promise<NextResponse>

  beforeEach(() => {
    jest.clearAllMocks()
    POST = require('@/app/api/vercel/add-domain/route').POST
  })

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await POST(makeRequest({ customDomain: 'test.com' }))
    const json = await res.json()

    expect(res.status).toBe(401)
    expect(json.error).toMatch(/unauthorized/i)
  })

  it('returns 403 when caller is not admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'client' }, error: null })

    const res = await POST(makeRequest({ customDomain: 'test.com' }))
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.error).toMatch(/forbidden/i)
  })

  it('returns 400 when no body fields are provided', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })

    const res = await POST(makeRequest({}))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/provide one of/i)
  })

  it('returns 404 when projectId does not exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })
    mockProjectSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })

    const res = await POST(makeRequest({ projectId: '00000000-0000-0000-0000-000000000000' }))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error).toMatch(/not found/i)
  })

  it('returns 400 when project has no subdomain or custom_domain', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })
    mockProjectSingle.mockResolvedValue({
      data: { subdomain: null, custom_domain: null },
      error: null,
    })

    const res = await POST(makeRequest({ projectId: '00000000-0000-0000-0000-000000000001' }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error).toMatch(/no subdomain or custom_domain/i)
  })

  it('registers customDomain via addDomainToVercel and returns 200', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })
    mockAddDomainToVercel.mockResolvedValue({ ok: true, status: 200 })

    const res = await POST(makeRequest({ customDomain: 'acmecorp.com' }))
    const json = await res.json()

    expect(mockAddDomainToVercel).toHaveBeenCalledWith('acmecorp.com')
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.results.customDomain.ok).toBe(true)
  })

  it('registers subdomain via addSubdomainToVercel and returns 200', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })
    mockAddSubdomainToVercel.mockResolvedValue({ ok: true, status: 200 })

    const res = await POST(makeRequest({ subdomain: 'acme' }))
    const json = await res.json()

    expect(mockAddSubdomainToVercel).toHaveBeenCalledWith('acme')
    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
  })

  it('returns 207 when Vercel registration partially fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-1' } } })
    mockProfileSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })
    mockProjectSingle.mockResolvedValue({
      data: { subdomain: 'acme', custom_domain: 'acmecorp.com' },
      error: null,
    })
    mockAddSubdomainToVercel.mockResolvedValue({ ok: true, status: 200 })
    mockAddDomainToVercel.mockResolvedValue({ ok: false, status: 409 })

    const res = await POST(makeRequest({ projectId: '00000000-0000-0000-0000-000000000002' }))
    const json = await res.json()

    expect(res.status).toBe(207)
    expect(json.success).toBe(false)
    expect(json.results.subdomain.ok).toBe(true)
    expect(json.results.customDomain.ok).toBe(false)
  })
})
