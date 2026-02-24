/**
 * Public API for the EstabWeb Redis cache layer.
 *
 * Import everything you need from this single entry point:
 *
 *   import { getOrSet, siteConfigKey, TTL, onProjectPublished } from "@/lib/cache";
 */

// Redis client (rarely needed directly — prefer the helpers below)
export { default as redis } from "./redis";

// Key factories & TTL constants
export * from "./keys";

// Core cache primitives
export { cacheGet, cacheSet, cacheDel, getOrSet, invalidateTag, invalidateProject, invalidateClient, flushAll } from "./cache";
export type { SetOptions } from "./cache";

// Smart invalidation helpers (one function per application event)
export {
  onProjectPublished,
  onProjectRolledBack,
  onDraftSaved,
  onChangeRequestSubmitted,
  onChangeRequestResolved,
  onDomainUpdated,
  onSubscriptionChanged,
  onProjectCreated,
  onClientProfileUpdated,
  onCodesChanged,
  onAdminSettingsChanged,
  onLeadTracked,
} from "./invalidation";
