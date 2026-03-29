/**
 * IP-based rate limiter with Redis (sliding window) + in-memory fallback.
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 10, windowMs: 60_000 })
 *   const result  = await limiter.check(ip)
 *   if (!result.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
 *
 * Redis keys: `rl:<namespace>:<ip>` — expire automatically after the window.
 * Falls back to a module-level Map when Redis is unavailable.
 */

import Redis from 'ioredis'

// ---------------------------------------------------------------------------
// Shared Redis client (lazy, singleton per process)
// ---------------------------------------------------------------------------
let _redis: Redis | null = null
let _redisConnected = false

function getRedis(): Redis | null {
  if (_redis) return _redisConnected ? _redis : null

  const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env
  if (!REDIS_HOST || !REDIS_PORT) return null

  try {
    _redis = new Redis({
      host: REDIS_HOST,
      port: parseInt(REDIS_PORT, 10),
      username: REDIS_USERNAME || undefined,
      password: REDIS_PASSWORD || undefined,
      tls: {},
      lazyConnect: true,
      connectTimeout: 3000,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    })

    _redis.on('ready', () => { _redisConnected = true })
    _redis.on('error', () => { _redisConnected = false })

    _redis.connect().catch(() => { _redisConnected = false })
  } catch {
    _redis = null
  }

  return _redisConnected ? _redis : null
}

// ---------------------------------------------------------------------------
// In-memory fallback store
// ---------------------------------------------------------------------------
const memoryStore = new Map<string, { count: number; resetAt: number }>()

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
  /** Namespace prefix to avoid key collisions between different limiters */
  namespace?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export interface RateLimiter {
  check(ip: string): Promise<RateLimitResult>
}

export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { limit, windowMs, namespace = 'default' } = options

  return {
    async check(ip: string): Promise<RateLimitResult> {
      const now = Date.now()
      const key = `rl:${namespace}:${ip}`
      const windowSec = Math.ceil(windowMs / 1000)

      // --- Try Redis first ---
      const redis = getRedis()
      if (redis) {
        try {
          const pipeline = redis.pipeline()
          pipeline.incr(key)
          pipeline.pttl(key)
          const results = await pipeline.exec()

          const count = (results?.[0]?.[1] as number) ?? 1
          const pttl  = (results?.[1]?.[1] as number) ?? -1

          // Set expiry on first request
          if (count === 1 || pttl < 0) {
            await redis.expire(key, windowSec)
          }

          const resetAt = now + (pttl > 0 ? pttl : windowMs)
          return {
            allowed:   count <= limit,
            remaining: Math.max(0, limit - count),
            resetAt,
          }
        } catch {
          // Redis error — fall through to memory store
        }
      }

      // --- In-memory fallback ---
      const entry = memoryStore.get(key)
      if (!entry || now > entry.resetAt) {
        memoryStore.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
      }

      entry.count++
      return {
        allowed:   entry.count <= limit,
        remaining: Math.max(0, limit - entry.count),
        resetAt:   entry.resetAt,
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Pre-built limiters for common use cases
// ---------------------------------------------------------------------------

/** Public analytics events — 120 req / hour per IP */
export const trackEventLimiter = createRateLimiter({
  namespace: 'track-event',
  limit: 120,
  windowMs: 60 * 60 * 1000,
})

/** Lead form submissions — 10 req / hour per IP */
export const trackLeadLimiter = createRateLimiter({
  namespace: 'track-lead',
  limit: 10,
  windowMs: 60 * 60 * 1000,
})

/** Template code validation — 30 req / 15 min per IP */
export const codeValidateLimiter = createRateLimiter({
  namespace: 'code-validate',
  limit: 30,
  windowMs: 15 * 60 * 1000,
})

/** Template code redemption — 5 req / 15 min per IP */
export const codeRedeemLimiter = createRateLimiter({
  namespace: 'code-redeem',
  limit: 5,
  windowMs: 15 * 60 * 1000,
})

// ---------------------------------------------------------------------------
// Legacy functional API (used by AI routes)
// ---------------------------------------------------------------------------

export const RATE_LIMIT_PRESETS = {
  /** AI suggestion/generation endpoints — 10 req / min per IP */
  ai: { namespace: 'ai', limit: 10, windowMs: 60 * 1000 },
  /** General API endpoints — 60 req / min per IP */
  default: { namespace: 'default', limit: 60, windowMs: 60 * 1000 },
} as const

/**
 * Extract the real client IP from request headers.
 * Works with Vercel's `x-forwarded-for` and `x-real-ip` headers.
 */
export function getClientIp(hdrs: Headers | { get(name: string): string | null }): string {
  return (
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Functional rate-limit helper for one-off checks.
 * @example
 *   const rl = await rateLimit(ip, RATE_LIMIT_PRESETS.ai)
 *   if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
 */
export async function rateLimit(
  ip: string,
  preset: { namespace: string; limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const limiter = createRateLimiter(preset)
  return limiter.check(ip)
}
