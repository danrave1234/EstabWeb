/**
 * Core cache helpers for EstabWeb.
 *
 * All functions are safe no-ops when Redis is unavailable (REDIS_HOST /
 * REDIS_PASSWORD not set). Errors are caught and logged — a cache miss
 * never breaks the request.
 *
 * Usage pattern (cache-aside):
 *
 *   const data = await getOrSet(
 *     siteConfigKey(domain),
 *     TTL.SITE_CONFIG,
 *     () => fetchFromDB(domain),
 *     { tags: [projectTagKey(projectId)] }
 *   );
 */
import getRedis from "./redis";
import { projectTagKey, clientTagKey } from "./keys";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface SetOptions {
  /**
   * Tag Set keys (e.g. projectTagKey, clientTagKey) that this cache entry
   * should be registered under. Used by invalidation helpers to find and
   * delete all keys belonging to a project or client in one call.
   */
  tags?: string[];
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/**
 * Retrieve a cached value. Returns `null` on miss or Redis unavailability.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get(key);
    if (raw === null || raw === undefined) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[cache] GET error for key "${key}":`, err);
    return null;
  }
}

/**
 * Store a value in the cache with a TTL (seconds).
 * Optionally registers the key under one or more tag Sets for group invalidation.
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number,
  options: SetOptions = {}
): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    const serialised = JSON.stringify(value);
    await redis.set(key, serialised, { EX: ttlSeconds });

    // Register key under each tag Set so invalidation can find it later.
    // Tag Sets themselves are given a generous TTL to avoid orphaned entries.
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        await redis.sAdd(tag, key);
        await redis.expire(tag, ttlSeconds * 2);
      }
    }
  } catch (err) {
    console.error(`[cache] SET error for key "${key}":`, err);
  }
}

/**
 * Delete one or more keys from the cache.
 */
export async function cacheDel(...keys: string[]): Promise<void> {
  const redis = await getRedis();
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(keys);
  } catch (err) {
    console.error(`[cache] DEL error for keys [${keys.join(", ")}]:`, err);
  }
}

/**
 * Cache-aside helper: return cached value if present, otherwise call `fetcher`,
 * store the result, and return it.
 *
 * @param key       Cache key
 * @param ttl       TTL in seconds
 * @param fetcher   Async function that produces the value on a cache miss
 * @param options   Optional tag registration
 */
export async function getOrSet<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
  options: SetOptions = {}
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;
  const fresh = await fetcher();
  // Fire-and-forget — don't let a cache write failure block the response
  cacheSet(key, fresh, ttl, options).catch(() => {});
  return fresh;
}

// ---------------------------------------------------------------------------
// Tag-based group invalidation
// ---------------------------------------------------------------------------

/**
 * Delete every cache key registered under a tag Set, then delete the Set itself.
 * Safe to call even if the tag Set doesn't exist.
 */
export async function invalidateTag(tagKey: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    const members = await redis.sMembers(tagKey);
    if (members.length > 0) {
      await redis.del(members);
    }
    await redis.del(tagKey);
  } catch (err) {
    console.error(`[cache] invalidateTag error for tag "${tagKey}":`, err);
  }
}

/**
 * Invalidate all cache entries associated with a project.
 * Call this whenever project data changes (publish, rollback, domain update, etc.).
 */
export async function invalidateProject(projectId: string): Promise<void> {
  await invalidateTag(projectTagKey(projectId));
}

/**
 * Invalidate all cache entries associated with a client user.
 * Call this when a client's project list or profile changes.
 */
export async function invalidateClient(clientId: string): Promise<void> {
  await invalidateTag(clientTagKey(clientId));
}

/**
 * Flush the entire cache. Use with caution — intended for admin tooling or
 * emergency cache busts only.
 */
export async function flushAll(): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    await redis.flushDb();
    console.warn("[cache] flushAll: entire Redis DB flushed.");
  } catch (err) {
    console.error("[cache] flushAll error:", err);
  }
}
