-- Migration: Add template_drafts table for admin marketing workflow
-- Purpose: store temporary business-specific template drafts (brand/logo/photos/content)
-- before converting to redeemable template codes.
-- Created: 2026-03-25

create table if not exists template_drafts (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  payload    jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists template_drafts_created_by_idx on template_drafts(created_by);
create index if not exists template_drafts_updated_at_idx on template_drafts(updated_at desc);

alter table template_drafts enable row level security;

drop policy if exists template_drafts_admin_all on template_drafts;
create policy template_drafts_admin_all on template_drafts
  for all to authenticated
  using (
    exists (
      select 1
      from profiles
      where id = auth.uid()
        and role in ('admin', 'sub_admin')
    )
  )
  with check (
    exists (
      select 1
      from profiles
      where id = auth.uid()
        and role in ('admin', 'sub_admin')
    )
  );
