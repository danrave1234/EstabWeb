import { createClient } from "@/lib/supabase/server";
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
      const { data: request } = await supabase
        .from('change_requests')
        .select('*, projects(*)')
        .eq('id', requestId)
        .single();
      
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
        console.log(`[getSiteConfig] Searching by projectId: ${projectId}`);
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config")
          .eq("id", projectId)
          .limit(1);
        dbRow = data?.[0];
      } else {
        console.log(`[getSiteConfig] Searching by domain: ${domain}`);
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config")
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
          .limit(1);
        dbRow = data?.[0];
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
      } else if (domain === 'master' || domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
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

  // Fallback to file only if DB fails or is empty
  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    const fileData = JSON.parse(raw);
    
    // AUTO-MIGRATION: If we have file data but no DB data for 'global', seed it.
    if (domain === 'master' || domain === 'localhost' || domain === 'localhost:3000' || domain === 'localhost:3001') {
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
