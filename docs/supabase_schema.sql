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

create table if not exists code_redemptions (
  id uuid primary key default gen_random_uuid(),
  code_id uuid references template_codes(id) on delete cascade,
  redeemed_by uuid references auth.users(id),
  project_id uuid references projects(id),
  redeemed_at timestamptz default now(),
  success boolean not null default true,
  reason text
);

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
  publish_limit int default 10,
  publish_limit_daily int default 3,
  publish_count int default 0,
  publish_count_today int default 0,
  publish_date timestamptz,
  publish_period_start timestamptz default now()
);

create index if not exists projects_client_idx on projects(client_id);

create table if not exists project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  version int not null,
  snapshot jsonb not null,
  created_at timestamptz default now()
);
create index if not exists project_versions_project_idx on project_versions(project_id, version desc);

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

-- RLS for site_config
alter table if exists site_config enable row level security;

drop policy if exists "Public read access for site_config" on site_config;
create policy "Public read access for site_config" on site_config for select using (true);

drop policy if exists "Admin all access for site_config" on site_config;
create policy "Admin all access for site_config" on site_config for all to authenticated using (is_admin()) with check (is_admin());

-- Usage increment helper
create or replace function increment_usage(p_code_id uuid)
returns void
language sql
security definer
as $$
  update template_codes set usage_count = usage_count + 1 where id = p_code_id;
$$;
revoke all on function increment_usage(uuid) from public;
grant execute on function increment_usage(uuid) to authenticated;

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
revoke all on function is_admin() from public;
grant execute on function is_admin() to authenticated;

-- Profiles: roles + user metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'client');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Project Analytics/Leads
create table if not exists project_leads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  type text not null check (type in ('messenger', 'viber', 'call', 'form')),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
create index if not exists project_leads_project_idx on project_leads(project_id);

-- RLS Enablement
alter table if exists profiles enable row level security;
alter table if exists template_codes enable row level security;
alter table if exists code_redemptions enable row level security;
alter table if exists projects enable row level security;
alter table if exists project_versions enable row level security;
alter table if exists change_requests enable row level security;
alter table if exists project_leads enable row level security;

-- POLICIES: Project Leads
drop policy if exists project_leads_select_owner on project_leads;
create policy project_leads_select_owner on project_leads for select to authenticated using (exists (select 1 from projects p where p.id = project_leads.project_id and p.client_id = auth.uid()));

drop policy if exists project_leads_insert_public on project_leads;
create policy project_leads_insert_public on project_leads for insert with check (true);

drop policy if exists project_leads_admin_all on project_leads;
create policy project_leads_admin_all on project_leads for all to authenticated using (is_admin());

-- POLICIES: Profiles
drop policy if exists profiles_select_self on profiles;
create policy profiles_select_self on profiles for select to authenticated using (auth.uid() = id);

drop policy if exists profiles_insert_self on profiles;
create policy profiles_insert_self on profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists profiles_admin_select on profiles;
create policy profiles_admin_select on profiles for select to authenticated using (is_admin());

-- POLICIES: Projects
drop policy if exists projects_select_owner on projects;
create policy projects_select_owner on projects for select to authenticated using (client_id = auth.uid());

drop policy if exists projects_insert_owner on projects;
create policy projects_insert_owner on projects for insert to authenticated with check (client_id = auth.uid());

drop policy if exists projects_update_owner on projects;
create policy projects_update_owner on projects for update to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists projects_admin_select on projects;
create policy projects_admin_select on projects for select to authenticated using (is_admin());

drop policy if exists projects_admin_update on projects;
create policy projects_admin_update on projects for update to authenticated using (is_admin()) with check (is_admin());

-- POLICIES: Template Codes
drop policy if exists template_codes_admin_all on template_codes;
create policy template_codes_admin_all on template_codes for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "Users can view codes for validation" on template_codes;
create policy "Users can view codes for validation" on template_codes for select to authenticated using (true);

-- POLICIES: Code Redemptions
drop policy if exists "Users can view their own redemptions" on code_redemptions;
create policy "Users can view their own redemptions" on code_redemptions for select to authenticated using (redeemed_by = auth.uid());

drop policy if exists cr_insert_auth on code_redemptions;
create policy cr_insert_auth on code_redemptions for insert to authenticated with check (auth.uid() = redeemed_by);

-- POLICIES: Change Requests
drop policy if exists change_requests_select_owner on change_requests;
create policy change_requests_select_owner on change_requests for select to authenticated using (exists (select 1 from projects p where p.id = change_requests.project_id and p.client_id = auth.uid()));

drop policy if exists change_requests_insert on change_requests;
create policy change_requests_insert on change_requests for insert to authenticated with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));

drop policy if exists change_requests_admin_all on change_requests;
create policy change_requests_admin_all on change_requests for all to authenticated using (is_admin());

-- POLICIES: Project Versions
drop policy if exists project_versions_select_owner on project_versions;
create policy project_versions_select_owner on project_versions for select to authenticated using (exists (select 1 from projects p where p.id = project_versions.project_id and p.client_id = auth.uid()));

drop policy if exists project_versions_admin_select on project_versions;
create policy project_versions_admin_all on project_versions for all to authenticated using (is_admin());

-- STORAGE: site-assets bucket and policies
-- Note: Run these in the SQL Editor to ensure the storage schema exists
insert into storage.buckets (id, name, public) 
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'site-assets');

drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets');

drop policy if exists "Owner Delete" on storage.objects;
create policy "Owner Delete" on storage.objects for delete to authenticated using (bucket_id = 'site-assets');
