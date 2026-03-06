-- Migration: 004_add_support_requests_table.sql
-- Created: 2026-02-26T00:00:00.000Z

create table if not exists support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  type text not null check (type in ('bug', 'problem', 'template_request', 'help', 'other')),
  subject text,
  message text not null,
  metadata jsonb default '{}',
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table support_requests enable row level security;

-- Policies
create policy support_requests_select_owner on support_requests 
  for select to authenticated 
  using (user_id = auth.uid());

create policy support_requests_insert_owner on support_requests 
  for insert to authenticated 
  with check (user_id = auth.uid());

create policy support_requests_admin_all on support_requests 
  for all to authenticated 
  using (is_admin());

-- Indexes
create index if not exists support_requests_user_idx on support_requests(user_id);
create index if not exists support_requests_project_idx on support_requests(project_id);
create index if not exists support_requests_status_idx on support_requests(status);
create index if not exists support_requests_type_idx on support_requests(type);
