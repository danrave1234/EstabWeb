-- ============================================================
-- Migration 005: Views and Indexes
-- ============================================================

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------

-- Domain lookups: used on every page request to resolve the site
create index if not exists projects_subdomain_idx on projects(subdomain);
create index if not exists projects_custom_domain_idx on projects(custom_domain);

-- Subscription status filtering (admin dashboards, publish-gate checks)
create index if not exists projects_subscription_status_idx on projects(subscription_status);

-- Change requests by status (admin queue always filters by 'pending')
create index if not exists change_requests_status_idx on change_requests(status);
create index if not exists change_requests_project_status_idx on change_requests(project_id, status);

-- Lead analytics by type and date (charts, reports)
create index if not exists project_leads_type_idx on project_leads(project_id, type);
create index if not exists project_leads_created_at_idx on project_leads(project_id, created_at desc);

-- Template codes by status (validation checks filter active codes)
create index if not exists template_codes_status_idx on template_codes(status);

-- Code redemptions by user (users viewing their own redemption history)
create index if not exists code_redemptions_user_idx on code_redemptions(redeemed_by);

-- ------------------------------------------------------------
-- VIEWS
-- ------------------------------------------------------------

-- Full project info joined with owner profile (admin + client dashboards)
create or replace view v_project_summary as
select
  p.id,
  p.client_id,
  p.subdomain,
  p.custom_domain,
  p.subscription_status,
  p.trial_ends_at,
  p.subscription_ends_at,
  p.auto_renew,
  p.has_paid_initial,
  p.publish_count,
  p.publish_limit,
  p.publish_count_today,
  p.publish_limit_daily,
  p.config_version,
  p.created_at,
  pr.email     as client_email,
  pr.role      as client_role
from projects p
left join profiles pr on pr.id = p.client_id;

alter view v_project_summary set (security_invoker = true);

-- ----

-- Admin change-request queue: only pending items, with project domain + requester email
create or replace view v_pending_change_requests as
select
  cr.id,
  cr.project_id,
  cr.section_id,
  cr.requested_changes,
  cr.created_at,
  cr.requested_by,
  pr.email       as requester_email,
  p.subdomain,
  p.custom_domain
from change_requests cr
join projects  p  on p.id  = cr.project_id
join profiles  pr on pr.id = cr.requested_by
where cr.status = 'pending';

alter view v_pending_change_requests set (security_invoker = true);

-- ----

-- Pre-aggregated lead counts per project per type (analytics widgets)
create or replace view v_lead_stats as
select
  project_id,
  type,
  count(*)                                                          as total_leads,
  count(*) filter (where created_at >= now() - interval '7 days')  as leads_last_7d,
  count(*) filter (where created_at >= now() - interval '30 days') as leads_last_30d,
  max(created_at)                                                   as last_lead_at
from project_leads
group by project_id, type;

alter view v_lead_stats set (security_invoker = true);

-- ----

-- Only currently usable template codes (code redemption validation)
create or replace view v_active_template_codes as
select *
from template_codes
where status = 'active'
  and (expires_at is null or expires_at > now())
  and (max_uses is null or usage_count < max_uses);

alter view v_active_template_codes set (security_invoker = true);

-- ----

-- Subscription health per project (billing checks, publish gating)
create or replace view v_subscription_health as
select
  p.id,
  p.client_id,
  p.subdomain,
  p.custom_domain,
  p.subscription_status,
  p.trial_ends_at,
  p.subscription_ends_at,
  p.auto_renew,
  p.has_paid_initial,
  case
    when p.subscription_status = 'active'        and p.subscription_ends_at > now() then 'healthy'
    when p.subscription_status = 'trial'         and p.trial_ends_at > now()        then 'trial'
    when p.subscription_status = 'admin_granted'                                    then 'granted'
    when p.subscription_status = 'free'                                             then 'free'
    else 'expired'
  end as health,
  pr.email as client_email
from projects p
left join profiles pr on pr.id = p.client_id;

alter view v_subscription_health set (security_invoker = true);

-- ----

-- Payment history per project with client info (admin billing dashboard)
create or replace view v_payment_history as
select
  pay.id,
  pay.project_id,
  pay.amount,
  pay.currency,
  pay.status,
  pay.paymongo_payment_id,
  pay.paymongo_link_id,
  pay.metadata,
  pay.created_at,
  p.subdomain,
  p.custom_domain,
  pr.email as client_email
from payments pay
left join projects  p  on p.id  = pay.project_id
left join profiles  pr on pr.id = p.client_id;

alter view v_payment_history set (security_invoker = true);
