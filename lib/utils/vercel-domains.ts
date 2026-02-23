/**
 * Vercel Domains API helper
 *
 * Automatically registers a domain (subdomain or custom domain) with the
 * Vercel project so you never have to add it manually in the dashboard.
 *
 * Required env vars:
 *   VERCEL_API_TOKEN   – your Vercel personal access token (or team token)
 *   VERCEL_PROJECT_ID  – the Vercel project ID (found in Project Settings)
 *   VERCEL_TEAM_ID     – (optional) team ID if the project belongs to a team
 */

export type AddDomainResult =
  | { ok: true; domain: string; alreadyExists?: boolean }
  | { ok: false; domain: string; error: string }

/**
 * Registers `domain` with the Vercel project via the Vercel REST API.
 * For subdomains (e.g. "acme") pass the full hostname: "acme.estabweb.com".
 * For custom domains pass the full hostname: "acmecorp.com".
 *
 * Safe to call multiple times – Vercel returns 409 if the domain already
 * exists, which we treat as a success.
 */
export async function addDomainToVercel(domain: string): Promise<AddDomainResult> {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID // optional

  if (!token || !projectId) {
    console.warn('[vercel-domains] VERCEL_API_TOKEN or VERCEL_PROJECT_ID not set – skipping domain registration.')
    return { ok: false, domain, error: 'VERCEL_API_TOKEN or VERCEL_PROJECT_ID not configured' }
  }

  const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/domains`)
  if (teamId) url.searchParams.set('teamId', teamId)

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    })

    const json = await res.json().catch(() => ({}))

    if (res.ok) {
      console.log(`[vercel-domains] Domain "${domain}" registered successfully.`)
      return { ok: true, domain }
    }

    // 409 = domain already exists on this project – treat as success
    if (res.status === 409) {
      console.log(`[vercel-domains] Domain "${domain}" already registered.`)
      return { ok: true, domain, alreadyExists: true }
    }

    const errMsg = (json as any)?.error?.message || `HTTP ${res.status}`
    console.error(`[vercel-domains] Failed to register "${domain}": ${errMsg}`)
    return { ok: false, domain, error: errMsg }
  } catch (err: any) {
    console.error(`[vercel-domains] Network error registering "${domain}":`, err)
    return { ok: false, domain, error: err?.message || 'Network error' }
  }
}

export type DomainVerificationStatus =
  | { ok: true; domain: string; verified: boolean; configured: boolean; status: 'verified' | 'pending' | 'invalid' }
  | { ok: false; domain: string; error: string }

/**
 * Fetches the verification/configuration status of a domain from Vercel.
 * Returns whether the domain is verified and properly configured.
 */
export async function getDomainStatus(domain: string): Promise<DomainVerificationStatus> {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token || !projectId) {
    return { ok: false, domain, error: 'VERCEL_API_TOKEN or VERCEL_PROJECT_ID not configured' }
  }

  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`)
  if (teamId) url.searchParams.set('teamId', teamId)

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status === 404) {
      return { ok: false, domain, error: 'Domain not found on Vercel project' }
    }

    const json = await res.json().catch(() => ({})) as any

    if (!res.ok) {
      return { ok: false, domain, error: json?.error?.message || `HTTP ${res.status}` }
    }

    // Vercel returns `verified` as a boolean (true = verified).
    // `misconfigured` may be present when DNS is wrong.
    const verified: boolean = json.verified === true
    const configured: boolean = json.misconfigured !== true

    let status: 'verified' | 'pending' | 'invalid'
    if (verified) {
      status = 'verified'
    } else if (json.misconfigured === true) {
      status = 'invalid'
    } else {
      status = 'pending'
    }

    return { ok: true, domain, verified, configured, status }
  } catch (err: any) {
    return { ok: false, domain, error: err?.message || 'Network error' }
  }
}

/**
 * Builds the full hostname for a subdomain and registers it.
 * e.g. addSubdomainToVercel("acme") → registers "acme.estabweb.com"
 */
export async function addSubdomainToVercel(subdomain: string): Promise<AddDomainResult> {
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase()
  const fullDomain = `${subdomain}.${rootDomain}`
  return addDomainToVercel(fullDomain)
}
