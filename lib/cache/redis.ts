/**
 * Redis client singleton for EstabWeb.
 *
 * Uses the official `redis` (node-redis) package with explicit host/port/auth
 * config. The client connects lazily on first use and is reused across the
 * Node.js process lifetime (compatible with Next.js serverless warm instances).
 *
 * Connection is driven by environment variables so credentials are never
 * hard-coded in source:
 *
 *   REDIS_HOST     – Redis server hostname
 *   REDIS_PORT     – Redis server port (default: 6379)
 *   REDIS_USERNAME – Redis ACL username (default: "default")
 *   REDIS_PASSWORD – Redis password
 *
 * If none of the above are set the client is null and all cache helpers
 * become no-ops, so the app works without Redis during local development.
 */
import { createClient, RedisClientType } from "redis";

declare global {
  // Persist the client across Next.js hot-reloads in development
  // eslint-disable-next-line no-var
  var __redis: RedisClientType | null | undefined;
}

async function createRedisClient(): Promise<RedisClientType | null> {
  const host = process.env.REDIS_HOST;
  const port = parseInt(process.env.REDIS_PORT ?? "6379", 10);
  const username = process.env.REDIS_USERNAME ?? "default";
  const password = process.env.REDIS_PASSWORD;

  if (!host || !password) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[cache] REDIS_HOST / REDIS_PASSWORD not set — Redis cache disabled."
      );
    }
    return null;
  }

  const client = createClient({
    username,
    password,
    socket: { host, port },
  }) as RedisClientType;

  client.on("error", (err: Error) => {
    console.error("[cache] Redis error:", err.message);
  });

  client.on("connect", () => {
    console.info("[cache] Redis connected.");
  });

  await client.connect();
  return client;
}

// Module-level promise so we only connect once per process
let _clientPromise: Promise<RedisClientType | null> | null = null;

function getClientPromise(): Promise<RedisClientType | null> {
  if (process.env.NODE_ENV === "development") {
    // Reuse across hot-reloads in dev
    if (!global.__redis) {
      _clientPromise = createRedisClient().then((c) => {
        global.__redis = c;
        return c;
      });
    } else {
      _clientPromise = Promise.resolve(global.__redis);
    }
    return _clientPromise;
  }

  if (!_clientPromise) {
    _clientPromise = createRedisClient();
  }
  return _clientPromise;
}

/**
 * Returns the connected Redis client, or null if Redis is not configured.
 * All callers should handle the null case gracefully.
 */
export async function getRedis(): Promise<RedisClientType | null> {
  return getClientPromise();
}

export default getRedis;
