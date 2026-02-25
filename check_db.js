const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://sxedjyocmyqdxscrxtzx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZWRqeW9jbXlxZHhzY3J4dHp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc0MDAzNSwiZXhwIjoyMDg2MzE2MDM1fQ.d7esGs2DEB1kTveOTuA-xOZ5GcUQ8izafddZNFT79nI"
);

supabase
  .from("projects")
  .select("id,subdomain,custom_domain,subscription_status,current_config,draft_config")
  .ilike("subdomain", "lawthingsonline-3ek8mj")
  .then(({ data, error }) => {
    const row = data && data[0];
    if (row) {
      console.log("id:", row.id);
      console.log("subdomain:", row.subdomain);
      console.log("custom_domain:", row.custom_domain);
      console.log("subscription_status:", row.subscription_status);
      console.log("current_config keys:", row.current_config ? Object.keys(row.current_config).length : "NULL");
      console.log("draft_config keys:", row.draft_config ? Object.keys(row.draft_config).length : "NULL");
      if (row.current_config) console.log("current_config sample:", JSON.stringify(row.current_config).slice(0, 300));
    } else {
      console.log("NOT FOUND");
      console.log("error:", error);
    }
  });
