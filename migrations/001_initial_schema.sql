-- ============================================================
-- Initial Schema Consolidation
-- Created: 2026-02-24
-- ============================================================

-- ------------------------------------------------------------
-- TABLES
-- ------------------------------------------------------------

-- Profiles: roles + user metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'client' check (role in ('admin', 'sub_admin', 'client')),
  avatar_url text,
  full_name text,
  phone text,
  bio text,
  created_at timestamptz default now()
);

-- Admin check helper
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- Projects: ownership + draft/live + versions for rollback
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references auth.users(id),
  subdomain text unique,
  custom_domain text unique,
  current_config jsonb default '{}',
  draft_config jsonb default '{}',
  config_version int default 0,
  created_at timestamptz default now(),
  
  -- Subscription & Publish Limits
  subscription_status text default 'free' check (subscription_status in ('free','trial','active','admin_granted')),
  trial_ends_at timestamptz,
  subscription_ends_at timestamptz,
  auto_renew boolean default true,
  has_paid_initial boolean default false,
  renewal_link text,
  renewal_link_id text,
  renewal_link_created_at timestamptz,
  paymongo_customer_id text,
  paymongo_subscription_id text,
  paymongo_plan_id text,
  publish_limit int default 50,
  publish_limit_daily int default 3,
  publish_count int default 0,
  publish_count_today int default 0,
  publish_date timestamptz,
  publish_period_start timestamptz default now(),
  admin_granted_by uuid references auth.users(id),
  admin_granted_at timestamptz,
  subscription_plan_id text
);

-- Template Codes core tables
create table if not exists template_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text,
  payload jsonb not null,
  preset_key text,
  created_by uuid,
  created_at timestamptz default now(),
  expires_at timestamptz,
  max_uses int default 1,
  usage_count int default 0,
  status text default 'active' check (status in ('active','revoked','expired'))
);

-- Usage increment helper
create or replace function increment_usage(p_code_id uuid)
returns void
language sql
security definer
as $$
  update template_codes set usage_count = usage_count + 1 where id = p_code_id;
$$;

-- Code Redemptions
create table if not exists code_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references template_codes(id) on delete cascade,
  redeemed_by uuid references auth.users(id),
  project_id uuid references projects(id),
  redeemed_at timestamptz default now(),
  success boolean not null default true,
  reason text
);

-- Project Versions
create table if not exists project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  version int not null,
  snapshot jsonb not null,
  created_at timestamptz default now()
);

-- Client change requests queue
create table if not exists change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  requested_by uuid references auth.users(id),
  section_id text,
  requested_changes jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id),
  admin_note text
);

-- Global Site Configuration & Presets
create table if not exists site_config (
  id uuid primary key default gen_random_uuid(),
  key text unique not null, -- e.g. 'global', 'presets'
  payload jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- Project Leads
create table if not exists project_leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  type text not null check (type in ('messenger', 'viber', 'call', 'form')),
  metadata jsonb default '{}',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PayMongo Links lookup
create table if not exists paymongo_links (
  id uuid primary key default gen_random_uuid(),
  link_id text not null,
  project_id uuid not null references projects(id) on delete cascade,
  plan_id text,
  created_at timestamptz default now()
);

-- Payments tracking
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  amount decimal(12, 2) not null,
  currency text not null default 'PHP',
  status text not null,
  paymongo_payment_id text unique,
  paymongo_link_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Unified event tracking for analytics
create table if not exists project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  event_type text not null check (event_type in ('page_view', 'cta_click', 'lead_submit')),
  page_slug text,
  section_key text,
  cta_id text,
  source text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Audit Logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,           -- 'publish' | 'rollback' | 'preset_change' | 'domain_change'
  performed_by uuid references auth.users(id),
  project_id uuid references projects(id) on delete set null,
  metadata jsonb default '{}',    -- extra context (version, preset key, domain, etc.)
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------

create index if not exists profiles_role_idx on profiles(role);
create index if not exists projects_client_idx on projects(client_id);
create index if not exists projects_subdomain_idx on projects(subdomain);
create index if not exists projects_custom_domain_idx on projects(custom_domain);
create index if not exists projects_subscription_status_idx on projects(subscription_status);
create index if not exists project_versions_project_idx on project_versions(project_id, version desc);
create index if not exists change_requests_status_idx on change_requests(status);
create index if not exists change_requests_project_status_idx on change_requests(project_id, status);
create index if not exists project_leads_project_idx on project_leads(project_id);
create index if not exists project_leads_type_idx on project_leads(project_id, type);
create index if not exists project_leads_created_at_idx on project_leads(project_id, created_at desc);
create index if not exists template_codes_status_idx on template_codes(status);
create index if not exists code_redemptions_user_idx on code_redemptions(redeemed_by);
create unique index if not exists paymongo_links_link_id_idx on paymongo_links(link_id);
create index if not exists paymongo_links_project_idx on paymongo_links(project_id);
create index if not exists payments_project_idx on payments(project_id);
create index if not exists payments_created_at_idx on payments(created_at desc);
create index if not exists idx_project_events_project_created on project_events (project_id, created_at desc);
create index if not exists idx_project_events_type on project_events (event_type);
create index if not exists audit_logs_action_idx on audit_logs(action);
create index if not exists audit_logs_project_idx on audit_logs(project_id);
create index if not exists audit_logs_created_idx on audit_logs(created_at desc);

-- ------------------------------------------------------------
-- VIEWS
-- ------------------------------------------------------------

-- Full project info joined with owner profile
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

-- Admin change-request queue
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

-- Pre-aggregated lead counts per project per type
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

-- Only currently usable template codes
create or replace view v_active_template_codes as
select *
from template_codes
where status = 'active'
  and (expires_at is null or expires_at > now())
  and (max_uses is null or usage_count < max_uses);

alter view v_active_template_codes set (security_invoker = true);

-- Subscription health per project
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

-- Payment history per project
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

-- ------------------------------------------------------------
-- RLS ENABLEMENT
-- ------------------------------------------------------------

alter table profiles enable row level security;
alter table projects enable row level security;
alter table template_codes enable row level security;
alter table code_redemptions enable row level security;
alter table project_versions enable row level security;
alter table change_requests enable row level security;
alter table site_config enable row level security;
alter table project_leads enable row level security;
alter table paymongo_links enable row level security;
alter table payments enable row level security;
alter table project_events enable row level security;
alter table audit_logs enable row level security;

-- ------------------------------------------------------------
-- POLICIES
-- ------------------------------------------------------------

-- Profiles
drop policy if exists profiles_select_self on profiles;
drop policy if exists profiles_insert_self on profiles;
drop policy if exists profiles_update_self on profiles;
drop policy if exists profiles_admin_select on profiles;
create policy profiles_select_self on profiles for select to authenticated using (auth.uid() = id);
create policy profiles_insert_self on profiles for insert to authenticated with check (auth.uid() = id);
create policy profiles_update_self on profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_admin_select on profiles for select to authenticated using (is_admin());

-- Projects
drop policy if exists projects_select_owner on projects;
drop policy if exists projects_insert_owner on projects;
drop policy if exists projects_update_owner on projects;
drop policy if exists projects_admin_select on projects;
drop policy if exists projects_admin_update on projects;
create policy projects_select_owner on projects for select to authenticated using (client_id = auth.uid());
create policy projects_insert_owner on projects for insert to authenticated with check (client_id = auth.uid());
create policy projects_update_owner on projects for update to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());
create policy projects_admin_select on projects for select to authenticated using (is_admin());
create policy projects_admin_update on projects for update to authenticated using (is_admin()) with check (is_admin());

-- Template Codes
drop policy if exists template_codes_admin_all on template_codes;
drop policy if exists "Users can view codes for validation" on template_codes;
create policy template_codes_admin_all on template_codes for all to authenticated using (is_admin()) with check (is_admin());
create policy "Users can view codes for validation" on template_codes for select to authenticated using (true);

-- Code Redemptions
drop policy if exists "Users can view their own redemptions" on code_redemptions;
drop policy if exists cr_insert_auth on code_redemptions;
create policy "Users can view their own redemptions" on code_redemptions for select to authenticated using (redeemed_by = auth.uid());
create policy cr_insert_auth on code_redemptions for insert to authenticated with check (auth.uid() = redeemed_by);

-- Project Versions
drop policy if exists project_versions_select_owner on project_versions;
drop policy if exists project_versions_insert_owner on project_versions;
drop policy if exists project_versions_admin_all on project_versions;
create policy project_versions_select_owner on project_versions for select to authenticated using (exists (select 1 from projects p where p.id = project_versions.project_id and p.client_id = auth.uid()));
create policy project_versions_insert_owner on project_versions for insert to authenticated with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
create policy project_versions_admin_all on project_versions for all to authenticated using (is_admin());

-- Change Requests
drop policy if exists change_requests_select_owner on change_requests;
drop policy if exists change_requests_insert on change_requests;
drop policy if exists change_requests_admin_all on change_requests;
create policy change_requests_select_owner on change_requests for select to authenticated using (exists (select 1 from projects p where p.id = change_requests.project_id and p.client_id = auth.uid()));
create policy change_requests_insert on change_requests for insert to authenticated with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
create policy change_requests_admin_all on change_requests for all to authenticated using (is_admin());

-- Site Config
drop policy if exists "Public read access for site_config" on site_config;
drop policy if exists "Admin all access for site_config" on site_config;
create policy "Public read access for site_config" on site_config for select using (true);
create policy "Admin all access for site_config" on site_config for all to authenticated using (is_admin()) with check (is_admin());

-- Project Leads
drop policy if exists project_leads_select_owner on project_leads;
drop policy if exists project_leads_insert_public on project_leads;
drop policy if exists project_leads_update_owner on project_leads;
drop policy if exists project_leads_admin_all on project_leads;
create policy project_leads_select_owner on project_leads for select to authenticated using (exists (select 1 from projects p where p.id = project_leads.project_id and p.client_id = auth.uid()));
create policy project_leads_insert_public on project_leads for insert with check (true);
create policy project_leads_update_owner on project_leads for update to authenticated using (exists (select 1 from projects p where p.id = project_leads.project_id and p.client_id = auth.uid())) with check (exists (select 1 from projects p where p.id = project_leads.project_id and p.client_id = auth.uid()));
create policy project_leads_admin_all on project_leads for all to authenticated using (is_admin());

-- PayMongo Links
drop policy if exists paymongo_links_insert_owner on paymongo_links;
create policy paymongo_links_insert_owner on paymongo_links for insert to authenticated with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

-- Payments
drop policy if exists "Admins can view all payments" on payments;
drop policy if exists "Users can view their own payments" on payments;
create policy "Admins can view all payments" on payments for select to authenticated using (is_admin());
create policy "Users can view their own payments" on payments for select to authenticated using (exists (select 1 from projects p where p.id = payments.project_id and p.client_id = auth.uid()));

-- Project Events
drop policy if exists project_events_insert_anon on project_events;
drop policy if exists project_events_select_owner on project_events;
drop policy if exists project_events_admin_all on project_events;
create policy project_events_insert_anon on project_events for insert with check (true);
create policy project_events_select_owner on project_events for select to authenticated using (exists (select 1 from projects p where p.id = project_events.project_id and p.client_id = auth.uid()));
create policy project_events_admin_all on project_events for all to authenticated using (is_admin());

-- ------------------------------------------------------------
-- TRIGGERS
-- ------------------------------------------------------------

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role, avatar_url)
  values (new.id, new.email, 'client', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do update set
    email = excluded.email,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- STORAGE
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public) 
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Owner Delete" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'site-assets');
create policy "Authenticated Upload" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets');
create policy "Owner Delete" on storage.objects for delete to authenticated using (bucket_id = 'site-assets');
