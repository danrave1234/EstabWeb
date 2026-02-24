/**
 * Centralised cache key factory for EstabWeb.
 *
 * Every Redis key used anywhere in the app must be defined here so that:
 *  - Keys are consistent and never typo'd across files.
 *  - Invalidation helpers can reference the exact same key shapes.
 *  - TTLs are co-located with the keys they belong to.
 *
 * Naming convention:  <entity>:<id>:<aspect>
 */

// ---------------------------------------------------------------------------
// TTLs (seconds)
// ---------------------------------------------------------------------------
export const TTL = {
  /** Live site config served to public visitors — revalidated on publish */
  SITE_CONFIG: 60 * 5,          // 5 min
  /** Draft config used in the editor preview */
  DRAFT_CONFIG: 60 * 2,         // 2 min
  /** Project metadata (name, subdomain, plan, status) */
  PROJECT_META: 60 * 10,        // 10 min
  /** All projects belonging to a client */
  CLIENT_PROJECTS: 60 * 5,      // 5 min
  /** Version history list for a project */
  VERSION_LIST: 60 * 5,         // 5 min
  /** A single version snapshot */
  VERSION_ITEM: 60 * 60 * 24,   // 24 h (immutable once saved)
  /** Lead/analytics rows for a project */
  LEADS: 60 * 2,                // 2 min
  /** Domain status check result */
  DOMAIN_STATUS: 60 * 1,        // 1 min
  /** Admin dashboard aggregate counts */
  ADMIN_STATS: 60 * 1,          // 1 min
  /** All clients list (admin) */
  ADMIN_CLIENTS: 60 * 5,        // 5 min
  /** Pending change requests list (admin) */
  ADMIN_CHANGE_REQUESTS: 60 * 1, // 1 min
  /** Subscription/plan info for a project */
  SUBSCRIPTION: 60 * 5,         // 5 min
  /** Template codes list (admin) */
  CODES: 60 * 5,                // 5 min
} as const;

// ---------------------------------------------------------------------------
// Key factories
// ---------------------------------------------------------------------------

/** Public live site config for a domain (subdomain or custom domain) */
export const siteConfigKey = (domain: string) =>
  `site:${domain}:config`;

/** Draft config for a project (used in editor preview) */
export const draftConfigKey = (projectId: string) =>
  `project:${projectId}:draft`;

/** Core project metadata row */
export const projectMetaKey = (projectId: string) =>
  `project:${projectId}:meta`;

/** All projects owned by a client user */
export const clientProjectsKey = (clientId: string) =>
  `client:${clientId}:projects`;

/** Ordered list of version IDs for a project */
export const versionListKey = (projectId: string) =>
  `project:${projectId}:versions`;

/** A single immutable version snapshot */
export const versionItemKey = (versionId: string) =>
  `version:${versionId}`;

/** Lead rows for a project (analytics) */
export const leadsKey = (projectId: string) =>
  `project:${projectId}:leads`;

/** Vercel domain verification status */
export const domainStatusKey = (domain: string) =>
  `domain:${domain}:status`;

/** Admin aggregate stats (counts of clients, requests, etc.) */
export const adminStatsKey = () =>
  `admin:stats`;

/** Full client list for admin */
export const adminClientsKey = () =>
  `admin:clients`;

/** Pending change requests list for admin */
export const adminChangeRequestsKey = () =>
  `admin:change-requests`;

/** Subscription/plan record for a project */
export const subscriptionKey = (projectId: string) =>
  `project:${projectId}:subscription`;

/** Template codes list */
export const codesKey = () =>
  `admin:codes`;

// ---------------------------------------------------------------------------
// Tag helpers — used for group invalidation via a Redis Set of keys
// ---------------------------------------------------------------------------

/**
 * Returns the Redis Set key that tracks all cache keys belonging to a project.
 * When any project data changes, iterate this set and delete every member.
 */
export const projectTagKey = (projectId: string) =>
  `tag:project:${projectId}`;

/**
 * Returns the Redis Set key that tracks all cache keys belonging to a client.
 */
export const clientTagKey = (clientId: string) =>
  `tag:client:${clientId}`;
