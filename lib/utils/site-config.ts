import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import path from "path";
import fs from "fs/promises";
import { getSectionKey } from "./config-mapping";

const SITE_DATA_PATH = path.join(process.cwd(), "config", "site-data.json");

export const getSiteConfig = cache(async (domain: string, headersList?: Headers) => {
  const isPreview = headersList?.get('x-preview-mode') === 'true';
  const projectId = headersList?.get('x-project-id') || undefined;
  const requestId = headersList?.get('x-request-id') || undefined;

  try {
    const supabase = await createClient();
    let dbConf: any;

    if (requestId) {
      const { data: request, error: reqError } = await supabase
        .from('change_requests')
        .select('*, projects(*)')
        .eq('id', requestId)
        .single();

      if (reqError) {
        console.error(`[getSiteConfig] Error fetching change request:`, reqError);
      }

      if (request && request.projects) {
        const project = Array.isArray(request.projects) ? request.projects[0] : request.projects;
        const sectionId = request.section_id;
        const requestedChanges = request.requested_changes;

        if (!sectionId || sectionId === 'full-site') {
          dbConf = requestedChanges;
        } else {
          dbConf = JSON.parse(JSON.stringify(project.current_config || {}));
          const sectionKey = getSectionKey(sectionId);
          dbConf[sectionKey] = {
            ...(dbConf[sectionKey] || {}),
            ...requestedChanges
          };
        }
      }
    } else {
      let dbRow: any | undefined;

      if (projectId) {
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config")
          .eq("id", projectId)
          .limit(1);
        dbRow = data?.[0];
      } else {
        // 1. Try exact match
        const { data, error, count } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config", { count: 'exact' })
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`);

        dbRow = data?.[0];

        // 2. If no match, and it looks like a subdomain of our root domains, try just the subdomain part
        if (!dbRow) {
          const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase();
          if (domain.endsWith(`.${ROOT_DOMAIN}`)) {
            const sub = domain.slice(0, -(ROOT_DOMAIN.length + 1));
            const { data: subData } = await supabase
              .from("projects")
              .select("id,subdomain,custom_domain,current_config,draft_config")
              .eq("subdomain", sub)
              .limit(1);
            dbRow = subData?.[0];
          }
        }

        // 3. Fallback: Case-insensitive search
        if (!dbRow) {
          const { data: ciData } = await supabase
            .from("projects")
            .select("id,subdomain,custom_domain,current_config,draft_config")
            .ilike("subdomain", domain)
            .limit(1);
          dbRow = ciData?.[0];
        }

        if (error) {
          console.error(`[getSiteConfig] DB Error for domain "${domain}":`, error);
        }
      }

      if (dbRow) {
        if (isPreview) {
          const hasDraft = dbRow?.draft_config && Object.keys(dbRow.draft_config).length > 0;
          dbConf = hasDraft ? dbRow.draft_config : dbRow.current_config;
        } else {
          const hasCurrent = dbRow?.current_config && Object.keys(dbRow.current_config).length > 0;
          dbConf = hasCurrent ? dbRow.current_config : dbRow.draft_config;
        }
      } else if (domain === 'master') {
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "template_master")
          .single();

        if (data) {
          dbConf = data.payload;
        }
      } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
        // Look for global config in site_config table
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "global")
          .single();

        if (data) {
          dbConf = data.payload;
        }
      }
    }

    if (dbConf && Object.keys(dbConf).length > 0) {
      return dbConf;
    }
  } catch (error) {
    console.error("Error fetching site config from DB:", error);
  }

  // Fallback to file if DB fails, is empty, OR NO PROJECT WAS FOUND
  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    const fileData = JSON.parse(raw);

    if (domain === 'master') {
      try {
        const supabase = await createClient();
        const { data: templateConfig } = await supabase
          .from("site_config")
          .select("id")
          .eq("key", "template_master")
          .single();

        if (!templateConfig) {
          await supabase.from("site_config").insert({
            key: "template_master",
            payload: fileData
          });
          console.log("Auto-migrated site-data.json to template_master in DB");
        }
      } catch (migrateErr) {
        console.error("Auto-migration failed for master:", migrateErr);
      }
    } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
      try {
        const supabase = await createClient();
        const { data: globalConfig } = await supabase
          .from("site_config")
          .select("id")
          .eq("key", "global")
          .single();

        if (!globalConfig) {
          await supabase.from("site_config").insert({
            key: "global",
            payload: fileData
          });
          console.log("Auto-migrated site-data.json to site_config table in DB");
        }
      } catch (migrateErr) {
        console.error("Auto-migration failed:", migrateErr);
      }
    }

    return fileData;
  } catch (error) {
    console.error("Error reading site-data.json:", error);
    return null;
  }
});

export const getSiteConfigWithProject = cache(async (domain: string, headersList?: Headers): Promise<{ config: any | null; project: any | null }> => {
  const isPreview = headersList?.get('x-preview-mode') === 'true';
  const projectId = headersList?.get('x-project-id') || undefined;
  const requestId = headersList?.get('x-request-id') || undefined;
  let config: any = null;
  let project: any | null = null;

  try {
    // Use service client (bypasses RLS) for preview and projectId-based lookups
    // so the preview iframe loads correctly even without an authenticated session.
    // Use the regular session client only for domain-based public lookups where
    // RLS correctly limits visibility to the project owner.
    const supabase = (isPreview || projectId || requestId)
      ? createServiceClient()
      : await createClient();

    if (requestId) {
      const { data: request, error: reqError } = await supabase
        .from('change_requests')
        .select('*, projects(*)')
        .eq('id', requestId)
        .single();

      if (reqError) {
        console.error(`[getSiteConfigWithProject] Error fetching change request:`, reqError);
      }

      if (request && request.projects) {
        project = Array.isArray(request.projects) ? request.projects[0] : request.projects;
        const sectionId = request.section_id;
        const requestedChanges = request.requested_changes;

        if (!sectionId || sectionId === 'full-site') {
          config = requestedChanges;
        } else {
          config = JSON.parse(JSON.stringify(project.current_config || {}));
          const sectionKey = getSectionKey(sectionId);
          config[sectionKey] = {
            ...(config[sectionKey] || {}),
            ...requestedChanges,
          };
        }
      }
    } else {
      let dbRow: any | undefined;

      if (projectId) {
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
          .eq("id", projectId)
          .limit(1);
        dbRow = data?.[0];
      } else {
        const { data, error } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`);

        dbRow = data?.[0];

        if (!dbRow) {
          const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase();
          if (domain.endsWith(`.${ROOT_DOMAIN}`)) {
            const sub = domain.slice(0, -(ROOT_DOMAIN.length + 1));
            const { data: subData } = await supabase
              .from("projects")
              .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
              .eq("subdomain", sub)
              .limit(1);
            dbRow = subData?.[0];
          }
        }

        if (!dbRow) {
          const { data: ciData } = await supabase
            .from("projects")
            .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
            .ilike("subdomain", domain)
            .limit(1);
          dbRow = ciData?.[0];
        }

        if (error) {
          console.error(`[getSiteConfigWithProject] DB Error for domain "${domain}":`, error);
        }
      }

      if (dbRow) {
        project = dbRow;
        if (isPreview) {
          const hasDraft = dbRow?.draft_config && Object.keys(dbRow.draft_config).length > 0;
          config = hasDraft ? dbRow.draft_config : dbRow.current_config;
        } else {
          const hasCurrent = dbRow?.current_config && Object.keys(dbRow.current_config).length > 0;
          config = hasCurrent ? dbRow.current_config : dbRow.draft_config;
        }
      } else if (domain === 'master') {
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "template_master")
          .single();

        if (data) {
          config = data.payload;
        }
      } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "global")
          .single();

        if (data) {
          config = data.payload;
        }
      }
    }

    if (config && Object.keys(config).length > 0) {
      return { config, project };
    }
  } catch (error) {
    console.error("Error fetching site config from DB:", error);
  }

  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    const fileData = JSON.parse(raw);

    if (domain === 'master') {
      try {
        const supabase = await createClient();
        const { data: templateConfig } = await supabase
          .from("site_config")
          .select("id")
          .eq("key", "template_master")
          .single();

        if (!templateConfig) {
          await supabase.from("site_config").insert({
            key: "template_master",
            payload: fileData,
          });
          console.log("Auto-migrated site-data.json to template_master in DB");
        }
      } catch (migrateErr) {
        console.error("Auto-migration failed for master:", migrateErr);
      }
    } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
      try {
        const supabase = await createClient();
        const { data: globalConfig } = await supabase
          .from("site_config")
          .select("id")
          .eq("key", "global")
          .single();

        if (!globalConfig) {
          await supabase.from("site_config").insert({
            key: "global",
            payload: fileData,
          });
          console.log("Auto-migrated site-data.json to site_config table in DB");
        }
      } catch (migrateErr) {
        console.error("Auto-migration failed:", migrateErr);
      }
    }

    return { config: fileData, project };
  } catch (error) {
    console.error("Error reading site-data.json:", error);
    return { config: null, project };
  }
});

// ---------------------------------------------------------------------------
// Cached version for public (non-preview) routes
// Cache is keyed per domain with tag `site:{domain}` and a 120s TTL.
// Preview mode, projectId overrides, and requestId previews always bypass
// the cache and call getSiteConfigWithProject directly.
//
// NOTE: unstable_cache is intentionally created fresh on every call (no
// module-level Map memoization). Next.js deduplicates by cache key internally,
// and a module-level Map would prevent revalidateTag from working correctly
// because the old stale closure would persist in the same process instance.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Service-client-based DB fetch — safe to use inside unstable_cache because
// it does NOT call cookies() or headers() (those are banned in cache context).
// ---------------------------------------------------------------------------
async function fetchSiteConfigFromDB(domain: string): Promise<{ config: any | null; project: any | null }> {
  try {
    const supabase = createServiceClient();

    const { data } = await supabase
      .from("projects")
      .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
      .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
      .limit(1);

    let dbRow = data?.[0];

    if (!dbRow) {
      const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase();
      if (domain.endsWith(`.${ROOT_DOMAIN}`)) {
        const sub = domain.slice(0, -(ROOT_DOMAIN.length + 1));
        const { data: subData } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
          .eq("subdomain", sub)
          .limit(1);
        dbRow = subData?.[0];
      }
    }

    if (!dbRow) {
      const { data: ciData } = await supabase
        .from("projects")
        .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at,site_status,site_status_reason")
        .ilike("subdomain", domain)
        .limit(1);
      dbRow = ciData?.[0];
    }

    if (dbRow) {
      const hasCurrent = dbRow.current_config && Object.keys(dbRow.current_config).length > 0;
      const config = hasCurrent ? dbRow.current_config : dbRow.draft_config;
      if (config && Object.keys(config).length > 0) {
        return { config, project: dbRow };
      }
    }
  } catch (error) {
    console.error("[fetchSiteConfigFromDB] Error:", error);
  }

  // Fallback to site-data.json
  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    return { config: JSON.parse(raw), project: null };
  } catch {
    return { config: null, project: null };
  }
}

export async function getCachedSiteConfig(
  domain: string,
  headersList?: Headers
): Promise<{ config: any | null; project: any | null }> {
  const isPreview = headersList?.get("x-preview-mode") === "true";
  const projectId = headersList?.get("x-project-id") || undefined;
  const requestId = headersList?.get("x-request-id") || undefined;

  // Never cache preview, projectId, or requestId requests — always live
  if (isPreview || projectId || requestId) {
    return getSiteConfigWithProject(domain, headersList);
  }

  const fetcher = unstable_cache(
    async (d: string) => fetchSiteConfigFromDB(d),
    [`site:${domain}`],
    {
      tags: [`site:${domain}`],
      revalidate: 120,
    }
  );

  return fetcher(domain);
}
