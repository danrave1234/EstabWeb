/**
 * Smart cache invalidation for EstabWeb.
 *
 * Each function maps to a real application event (publish, rollback, domain
 * change, subscription update, etc.) and deletes exactly the keys that are
 * stale after that event — no more, no less.
 *
 * Import and call the relevant function at the end of each mutating API route
 * or server action once you are ready to enable caching.
 *
 * Example — in /api/publish/route.ts, after writing to the DB:
 *
 *   await onProjectPublished({ projectId, subdomain, customDomain });
 */

import { cacheDel, invalidateProject, invalidateClient } from "./cache";
import {
  siteConfigKey,
  draftConfigKey,
  projectMetaKey,
  clientProjectsKey,
  versionListKey,
  leadsKey,
  domainStatusKey,
  adminStatsKey,
  adminClientsKey,
  adminChangeRequestsKey,
  subscriptionKey,
  codesKey,
} from "./keys";

// ---------------------------------------------------------------------------
// Project / site events
// ---------------------------------------------------------------------------

/**
 * Call after a change request is approved or a direct publish succeeds.
 * Clears the live site config for every domain the project is reachable on,
 * the draft config, version list, and all admin views that show pending counts.
 */
export async function onProjectPublished(params: {
  projectId: string;
  subdomain?: string | null;
  customDomain?: string | null;
}): Promise<void> {
  const { projectId, subdomain, customDomain } = params;

  const keys: string[] = [
    draftConfigKey(projectId),
    versionListKey(projectId),
    adminChangeRequestsKey(),
    adminStatsKey(),
  ];

  if (subdomain) keys.push(siteConfigKey(subdomain));
  if (customDomain) keys.push(siteConfigKey(customDomain));

  await cacheDel(...keys);
  // Also wipe the full project tag in case any other keys were registered
  await invalidateProject(projectId);
}

/**
 * Call after a version rollback completes.
 * Same surface area as publish — live config and draft are now stale.
 */
export async function onProjectRolledBack(params: {
  projectId: string;
  subdomain?: string | null;
  customDomain?: string | null;
}): Promise<void> {
  await onProjectPublished(params);
}

/**
 * Call when the client saves a draft (auto-save in the editor).
 * Only the draft config needs to be evicted; the live site is unaffected.
 */
export async function onDraftSaved(projectId: string): Promise<void> {
  await cacheDel(draftConfigKey(projectId));
}

/**
 * Call when a change request is submitted by the client.
 * Admin views showing pending counts become stale.
 */
export async function onChangeRequestSubmitted(): Promise<void> {
  await cacheDel(adminChangeRequestsKey(), adminStatsKey());
}

/**
 * Call when an admin approves or rejects a change request.
 */
export async function onChangeRequestResolved(params: {
  projectId: string;
  subdomain?: string | null;
  customDomain?: string | null;
}): Promise<void> {
  await onProjectPublished(params);
}

// ---------------------------------------------------------------------------
// Domain events
// ---------------------------------------------------------------------------

/**
 * Call when a client requests a custom domain or the domain status changes.
 * Clears the domain status cache and the project meta (which stores domain fields).
 */
export async function onDomainUpdated(params: {
  projectId: string;
  domain: string;
}): Promise<void> {
  await cacheDel(
    domainStatusKey(params.domain),
    projectMetaKey(params.projectId)
  );
  await invalidateProject(params.projectId);
}

// ---------------------------------------------------------------------------
// Subscription / payment events
// ---------------------------------------------------------------------------

/**
 * Call after a subscription is created, renewed, upgraded, or cancelled.
 * Clears subscription info, project meta (plan field), and admin stats.
 */
export async function onSubscriptionChanged(params: {
  projectId: string;
  clientId?: string | null;
}): Promise<void> {
  const keys: string[] = [
    subscriptionKey(params.projectId),
    projectMetaKey(params.projectId),
    adminStatsKey(),
  ];

  if (params.clientId) {
    keys.push(clientProjectsKey(params.clientId));
  }

  await cacheDel(...keys);
}

// ---------------------------------------------------------------------------
// Client / user events
// ---------------------------------------------------------------------------

/**
 * Call when a new client project is created (code redemption / onboarding).
 * Clears the client's project list and all admin views.
 */
export async function onProjectCreated(params: {
  clientId: string;
}): Promise<void> {
  await cacheDel(
    clientProjectsKey(params.clientId),
    adminClientsKey(),
    adminStatsKey(),
    codesKey()
  );
  await invalidateClient(params.clientId);
}

/**
 * Call when a client's profile (name, email) is updated.
 */
export async function onClientProfileUpdated(clientId: string): Promise<void> {
  await cacheDel(clientProjectsKey(clientId), adminClientsKey());
  await invalidateClient(clientId);
}

// ---------------------------------------------------------------------------
// Admin events
// ---------------------------------------------------------------------------

/**
 * Call when a template code is created, updated, or deleted.
 */
export async function onCodesChanged(): Promise<void> {
  await cacheDel(codesKey(), adminStatsKey());
}

/**
 * Call when admin settings or plan limits are changed.
 * Broad invalidation — clears all admin-facing aggregates.
 */
export async function onAdminSettingsChanged(): Promise<void> {
  await cacheDel(adminStatsKey(), adminClientsKey(), adminChangeRequestsKey());
}

// ---------------------------------------------------------------------------
// Lead / analytics events
// ---------------------------------------------------------------------------

/**
 * Call after a new lead is tracked via /api/track-lead.
 * Evicts the leads cache so the analytics dashboard shows fresh data.
 */
export async function onLeadTracked(projectId: string): Promise<void> {
  await cacheDel(leadsKey(projectId));
}
