import { NextRequest } from 'next/server'
import {
  isAllowedRequestOrigin,
  shouldBlockCrossSiteMutation,
} from '@/lib/security/request-origin'

describe('isAllowedRequestOrigin', () => {
  const prevRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN
  const prevExtra = process.env.ALLOWED_ORIGIN_HOSTS

  afterEach(() => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = prevRoot
    process.env.ALLOWED_ORIGIN_HOSTS = prevExtra
  })

  it('allows localhost and loopback', () => {
    expect(isAllowedRequestOrigin('http://localhost:3000')).toBe(true)
    expect(isAllowedRequestOrigin('http://127.0.0.1:3000')).toBe(true)
  })

  it('allows root domain and subdomains', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'estabweb.com'
    expect(isAllowedRequestOrigin('https://estabweb.com')).toBe(true)
    expect(isAllowedRequestOrigin('https://app.estabweb.com')).toBe(true)
    expect(isAllowedRequestOrigin('https://tenant.estabweb.com')).toBe(true)
  })

  it('allows vercel preview hostnames', () => {
    expect(isAllowedRequestOrigin('https://foo-bar-abc123.vercel.app')).toBe(true)
  })

  it('allows extra hosts from ALLOWED_ORIGIN_HOSTS', () => {
    process.env.ALLOWED_ORIGIN_HOSTS = 'partner.example.org'
    expect(isAllowedRequestOrigin('https://partner.example.org')).toBe(true)
  })

  it('rejects unrelated origins', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'estabweb.com'
    expect(isAllowedRequestOrigin('https://evil.example')).toBe(false)
  })
})

describe('shouldBlockCrossSiteMutation', () => {
  const prevRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN

  afterEach(() => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = prevRoot
  })

  it('allows mutating requests when Origin matches the request URL (custom domain)', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'estabweb.com'
    const req = new NextRequest('https://www.client-owned.com/api/track-event', {
      method: 'POST',
      headers: { origin: 'https://www.client-owned.com' },
    })
    expect(shouldBlockCrossSiteMutation(req)).toBe(false)
  })

  it('allows mutating requests when Origin matches hub subdomain', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'estabweb.com'
    const req = new NextRequest('https://tenant.estabweb.com/api/track-lead', {
      method: 'POST',
      headers: { origin: 'https://tenant.estabweb.com' },
    })
    expect(shouldBlockCrossSiteMutation(req)).toBe(false)
  })

  it('blocks cross-site POST when Origin is not on allowlist', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'estabweb.com'
    const req = new NextRequest('https://estabweb.com/api/project-config', {
      method: 'POST',
      headers: { origin: 'https://evil.com' },
    })
    expect(shouldBlockCrossSiteMutation(req)).toBe(true)
  })

  it('skips webhook path even with foreign Origin', () => {
    const req = new NextRequest('https://estabweb.com/api/paymongo/webhook', {
      method: 'POST',
      headers: { origin: 'https://api.paymongo.com' },
    })
    expect(shouldBlockCrossSiteMutation(req)).toBe(false)
  })
})
