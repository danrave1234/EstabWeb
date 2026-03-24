import type { SupabaseClient } from "@supabase/supabase-js";

const SITE_ASSETS_BUCKET = "site-assets";
export const TEMPLATE_DRAFT_TTL_DAYS = 30;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function getSupabaseHost(): string {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return "";
  try {
    return new URL(raw).host.toLowerCase();
  } catch {
    return "";
  }
}

function normalizeStoragePath(value: string): string {
  return decodeURIComponent(value).replace(/^\/+/, "").split("?")[0].split("#")[0];
}

function extractSiteAssetPathFromUrl(value: string, supabaseHost: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (supabaseHost && url.host.toLowerCase() !== supabaseHost) return null;

  const marker = `/storage/v1/object/public/${SITE_ASSETS_BUCKET}/`;
  const idx = url.pathname.indexOf(marker);
  if (idx === -1) return null;

  const path = normalizeStoragePath(url.pathname.slice(idx + marker.length));
  if (!path) return null;
  return path;
}

function collectSiteAssetPathsFromPayload(payload: JsonValue, supabaseHost: string, acc: Set<string>) {
  if (payload === null) return;

  if (typeof payload === "string") {
    const path = extractSiteAssetPathFromUrl(payload, supabaseHost);
    if (path) acc.add(path);
    return;
  }

  if (typeof payload !== "object") return;

  if (Array.isArray(payload)) {
    for (const item of payload) {
      collectSiteAssetPathsFromPayload(item, supabaseHost, acc);
    }
    return;
  }

  for (const value of Object.values(payload)) {
    collectSiteAssetPathsFromPayload(value as JsonValue, supabaseHost, acc);
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function getTemplateDraftExpiryIso(from: Date = new Date()): string {
  const expires = new Date(from.getTime() + TEMPLATE_DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000);
  return expires.toISOString();
}

export async function deleteSiteAssetsFromPayload(
  supabase: SupabaseClient,
  payload: JsonValue | null | undefined,
  excludeDraftId?: string
): Promise<{ deletedAssetCount: number; errors: string[] }> {
  if (!payload) return { deletedAssetCount: 0, errors: [] };

  const supabaseHost = getSupabaseHost();
  const paths = new Set<string>();
  collectSiteAssetPathsFromPayload(payload, supabaseHost, paths);

  if (paths.size === 0) return { deletedAssetCount: 0, errors: [] };

  const errors: string[] = [];
  let deletedAssetCount = 0;

  // Safeguard: Check if any paths are used in active Promo Codes, Projects, or other Drafts
  const [{ data: codes }, { data: projects }] = await Promise.all([
    supabase.from("template_codes").select("payload").not("payload", "is", null),
    supabase.from("projects").select("site_config").not("site_config", "is", null)
  ]);

  let draftsQuery = supabase.from("template_drafts").select("payload").not("payload", "is", null);
  if (excludeDraftId) {
    draftsQuery = draftsQuery.neq("id", excludeDraftId);
  }
  const { data: drafts } = await draftsQuery;

  const combinedActiveText = 
    JSON.stringify(codes || []) + 
    JSON.stringify(projects || []) + 
    JSON.stringify(drafts || []);

  const pathsToDelete = Array.from(paths).filter(path => !combinedActiveText.includes(path));

  if (pathsToDelete.length === 0) return { deletedAssetCount: 0, errors: [] };

  for (const batch of chunk(pathsToDelete, 100)) {
    const { error } = await supabase.storage.from(SITE_ASSETS_BUCKET).remove(batch);
    if (error) {
      errors.push(error.message);
      continue;
    }
    deletedAssetCount += batch.length;
  }

  return { deletedAssetCount, errors };
}

interface ExpiredDraftRow {
  id: string;
  payload: JsonValue | null;
}

export async function cleanupExpiredTemplateDrafts(
  supabase: SupabaseClient,
  limit = 500
): Promise<{
  expiredCount: number;
  deletedDraftCount: number;
  deletedAssetCount: number;
  errors: string[];
}> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("template_drafts")
    .select("id,payload")
    .lt("expires_at", nowIso)
    .limit(limit);

  if (error) {
    return {
      expiredCount: 0,
      deletedDraftCount: 0,
      deletedAssetCount: 0,
      errors: [error.message],
    };
  }

  const rows = (data ?? []) as ExpiredDraftRow[];
  if (rows.length === 0) {
    return {
      expiredCount: 0,
      deletedDraftCount: 0,
      deletedAssetCount: 0,
      errors: [],
    };
  }

  let deletedAssetCount = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const assetResult = await deleteSiteAssetsFromPayload(supabase, row.payload, row.id);
    deletedAssetCount += assetResult.deletedAssetCount;
    if (assetResult.errors.length > 0) {
      errors.push(...assetResult.errors.map((msg) => `draft ${row.id}: ${msg}`));
    }
  }

  const ids = rows.map((row) => row.id);
  const { error: deleteErr } = await supabase.from("template_drafts").delete().in("id", ids);
  if (deleteErr) {
    errors.push(deleteErr.message);
    return {
      expiredCount: rows.length,
      deletedDraftCount: 0,
      deletedAssetCount,
      errors,
    };
  }

  return {
    expiredCount: rows.length,
    deletedDraftCount: ids.length,
    deletedAssetCount,
    errors,
  };
}
