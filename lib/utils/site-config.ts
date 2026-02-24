import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import path from "path";
import fs from "fs/promises";
import { getSectionKey } from "./config-mapping";

const SITE_DATA_PATH = path.join(process.cwd(), "config", "site-data.json");

export async function getSiteConfig(domain: string, headersList?: Headers) {
  const isPreview = headersList?.get('x-preview-mode') === 'true';
  const projectId = headersList?.get('x-project-id') || undefined;
  const requestId = headersList?.get('x-request-id') || undefined;

  try {
    const supabase = await createClient();
    let dbConf: any;

    if (requestId) {
      console.log(`[getSiteConfig] Fetching by requestId: ${requestId}`);
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

        console.log(`[getSiteConfig] Applying changes for section: ${sectionId}`);

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
        console.log(`[getSiteConfig] Searching by projectId: ${projectId}`);
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config")
          .eq("id", projectId)
          .limit(1);
        dbRow = data?.[0];
      } else {
        console.log(`[getSiteConfig] Searching by domain: "${domain}"`);
        
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
            console.log(`[getSiteConfig] No exact match for "${domain}", trying subdomain "${sub}"`);
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
          console.log(`[getSiteConfig] Still no match, trying case-insensitive search for "${domain}"`);
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
        console.log(`[getSiteConfig] Found project in DB: ${dbRow.id}`);
        if (isPreview) {
          const hasDraft = dbRow?.draft_config && Object.keys(dbRow.draft_config).length > 0;
          dbConf = hasDraft ? dbRow.draft_config : dbRow.current_config;
        } else {
          const hasCurrent = dbRow?.current_config && Object.keys(dbRow.current_config).length > 0;
          dbConf = hasCurrent ? dbRow.current_config : dbRow.draft_config;
        }
      } else if (domain === 'master') {
        console.log(`[getSiteConfig] Fetching master template config`);
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "template_master")
          .single();
        
        if (data) {
          dbConf = data.payload;
        }
      } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
        console.log(`[getSiteConfig] Falling back to global site_config for: ${domain}`);
        // Look for global config in site_config table
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "global")
          .single();
        
        if (data) {
          dbConf = data.payload;
        }
      } else {
      console.log(`[getSiteConfig] No project found for domain: ${domain}`);
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
    
    console.log(`[getSiteConfig] Using file fallback for domain: "${domain}"`);
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
}

export async function getSiteConfigWithProject(domain: string, headersList?: Headers): Promise<{ config: any | null; project: any | null }> {
  const isPreview = headersList?.get('x-preview-mode') === 'true';
  const projectId = headersList?.get('x-project-id') || undefined;
  const requestId = headersList?.get('x-request-id') || undefined;
  let config: any = null;
  let project: any | null = null;

  try {
    const supabase = await createClient();

    if (requestId) {
      console.log(`[getSiteConfigWithProject] Fetching by requestId: ${requestId}`);
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

        console.log(`[getSiteConfigWithProject] Applying changes for section: ${sectionId}`);

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
        console.log(`[getSiteConfigWithProject] Searching by projectId: ${projectId}`);
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at")
          .eq("id", projectId)
          .limit(1);
        dbRow = data?.[0];
      } else {
        console.log(`[getSiteConfigWithProject] Searching by domain: "${domain}"`);

        const { data, error } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at")
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`);

        dbRow = data?.[0];

        if (!dbRow) {
          const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'estabweb.com').toLowerCase();
          if (domain.endsWith(`.${ROOT_DOMAIN}`)) {
            const sub = domain.slice(0, -(ROOT_DOMAIN.length + 1));
            console.log(`[getSiteConfigWithProject] No exact match for "${domain}", trying subdomain "${sub}"`);
            const { data: subData } = await supabase
              .from("projects")
              .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at")
              .eq("subdomain", sub)
              .limit(1);
            dbRow = subData?.[0];
          }
        }

        if (!dbRow) {
          console.log(`[getSiteConfigWithProject] Still no match, trying case-insensitive search for "${domain}"`);
          const { data: ciData } = await supabase
            .from("projects")
            .select("id,subdomain,custom_domain,current_config,draft_config,subscription_status,trial_ends_at,subscription_ends_at")
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
        console.log(`[getSiteConfigWithProject] Found project in DB: ${dbRow.id}`);
        if (isPreview) {
          const hasDraft = dbRow?.draft_config && Object.keys(dbRow.draft_config).length > 0;
          config = hasDraft ? dbRow.draft_config : dbRow.current_config;
        } else {
          const hasCurrent = dbRow?.current_config && Object.keys(dbRow.current_config).length > 0;
          config = hasCurrent ? dbRow.current_config : dbRow.draft_config;
        }
      } else if (domain === 'master') {
        console.log(`[getSiteConfigWithProject] Fetching master template config`);
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "template_master")
          .single();

        if (data) {
          config = data.payload;
        }
      } else if (domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
        console.log(`[getSiteConfigWithProject] Falling back to global site_config for: ${domain}`);
        const { data } = await supabase
          .from("site_config")
          .select("payload")
          .eq("key", "global")
          .single();

        if (data) {
          config = data.payload;
        }
      } else {
        console.log(`[getSiteConfigWithProject] No project found for domain: ${domain}`);
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

    console.log(`[getSiteConfigWithProject] Using file fallback for domain: "${domain}"`);
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
}

// ---------------------------------------------------------------------------
// Cached version for public (non-preview) routes
// Cache is keyed per domain with tag `site:{domain}` and a 120s TTL.
// Preview mode, projectId overrides, and requestId previews always bypass
// the cache and call getSiteConfigWithProject directly.
// ---------------------------------------------------------------------------
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
    async (d: string) => getSiteConfigWithProject(d),
    [`site:${domain}`],
    {
      tags: [`site:${domain}`],
      revalidate: 120,
    }
  );

  return fetcher(domain);
}
