-- Store PayMongo link_id -> project_id for webhook lookups
create table if not exists paymongo_links (
  id uuid primary key default gen_random_uuid(),
  link_id text not null,
  project_id uuid not null references projects(id) on delete cascade,
  plan_id text,
  created_at timestamptz default now()
);
create unique index if not exists paymongo_links_link_id_idx on paymongo_links(link_id);
create index if not exists paymongo_links_project_idx on paymongo_links(project_id);

alter table paymongo_links enable row level security;
drop policy if exists paymongo_links_insert_owner on paymongo_links;
create policy paymongo_links_insert_owner on paymongo_links for insert to authenticated
  with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
