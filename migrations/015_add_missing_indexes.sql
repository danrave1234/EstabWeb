-- ============================================================
-- 015: Add missing composite indexes for analytics & dashboard
-- Created: 2026-03-25
-- ============================================================

-- project_events: analytics queries filter by type + date range
create index if not exists idx_project_events_type_created
  on project_events (project_id, event_type, created_at desc);

-- project_events: page-level analytics filtering
create index if not exists idx_project_events_page_slug
  on project_events (project_id, page_slug);

-- project_leads: dashboard filters leads by status
create index if not exists idx_project_leads_status
  on project_leads (project_id, status);

-- audit_logs: admin audit log filtering per project + action
create index if not exists idx_audit_logs_project_action
  on audit_logs (project_id, action, created_at desc);

-- template_codes: admin filtering by creator
create index if not exists idx_template_codes_created_by
  on template_codes (created_by);

-- code_redemptions: join queries from template_codes → redemptions
create index if not exists idx_code_redemptions_code_id
  on code_redemptions (code_id);

-- projects: cron expiry sweep optimization (partial index)
create index if not exists idx_projects_subscription_expiry
  on projects (subscription_ends_at)
  where subscription_status in ('active', 'trial');

-- projects: filter by plan ID for admin queries
create index if not exists idx_projects_plan_id
  on projects (subscription_plan_id);
