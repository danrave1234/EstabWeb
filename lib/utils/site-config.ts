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
        const project = request.projects;
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
        const { data } = await supabase
          .from("projects")
          .select("id,subdomain,custom_domain,current_config,draft_config")
          .or(`subdomain.eq.${domain},custom_domain.eq.${domain}`)
          .limit(1);
        dbRow = data?.[0];
      }

      if (dbRow) {
        if (isPreview) {
          const hasDraft = dbRow?.draft_config && Object.keys(dbRow.draft_config).length > 0;
          dbConf = hasDraft ? dbRow.draft_config : dbRow.current_config;
        } else {
          const hasCurrent = dbRow?.current_config && Object.keys(dbRow.current_config).length > 0;
          dbConf = hasCurrent ? dbRow.current_config : dbRow.draft_config;
        }
      }
    }
    
    if (dbConf && Object.keys(dbConf).length > 0) {
      return dbConf;
    }
  } catch (error) {
    console.error("Error fetching site config from DB:", error);
  }

  // Fallback to file
  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading site-data.json:", error);
    return null;
  }
}
