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
  redeemed_by uuid,
  project_id uuid,
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
  created_at timestamptz default now()
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
  section_key text,
  requested_data jsonb not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now()
);

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

-- Profiles: roles + user metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'client' check (role in ('admin', 'client')),
  created_at timestamptz default now()
);

-- RLS Enablement
alter table if exists profiles enable row level security;
alter table if exists template_codes enable row level security;
alter table if exists code_redemptions enable row level security;
alter table if exists projects enable row level security;
alter table if exists project_versions enable row level security;
alter table if exists change_requests enable row level security;

-- POLICIES: Profiles
drop policy if exists profiles_select_self on profiles;
create policy profiles_select_self on profiles for select to authenticated using (auth.uid() = id);

drop policy if exists profiles_admin_select on profiles;
create policy profiles_admin_select on profiles for select to authenticated using (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin'));

-- POLICIES: Projects
drop policy if exists projects_select_owner on projects;
create policy projects_select_owner on projects for select to authenticated using (client_id = auth.uid());

drop policy if exists projects_insert_owner on projects;
create policy projects_insert_owner on projects for insert to authenticated with check (client_id = auth.uid());

drop policy if exists projects_update_owner on projects;
create policy projects_update_owner on projects for update to authenticated using (client_id = auth.uid()) with check (client_id = auth.uid());

drop policy if exists projects_admin_select on projects;
create policy projects_admin_select on projects for select to authenticated using (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin'));

-- POLICIES: Template Codes
drop policy if exists template_codes_admin_all on template_codes;
create policy template_codes_admin_all on template_codes for all to authenticated using (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin')) with check (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin'));

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
create policy change_requests_admin_all on change_requests for all to authenticated using (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin'));

-- POLICIES: Project Versions
drop policy if exists project_versions_select_owner on project_versions;
create policy project_versions_select_owner on project_versions for select to authenticated using (exists (select 1 from projects p where p.id = project_versions.project_id and p.client_id = auth.uid()));

drop policy if exists project_versions_admin_select on project_versions;
create policy project_versions_admin_select on project_versions for select to authenticated using (exists (select 1 from profiles pr where pr.id = auth.uid() and pr.role = 'admin'));
