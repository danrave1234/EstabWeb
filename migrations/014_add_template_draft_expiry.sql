-- Migration: Add expiry lifecycle for admin template drafts
-- Purpose: auto-expire temporary marketing drafts after 30 days.
-- Created: 2026-03-25

alter table if exists template_drafts
  add column if not exists expires_at timestamptz;

update template_drafts
set expires_at = coalesce(expires_at, created_at + interval '30 days')
where expires_at is null;

alter table template_drafts
  alter column expires_at set default (now() + interval '30 days');

alter table template_drafts
  alter column expires_at set not null;

create index if not exists template_drafts_expires_at_idx on template_drafts(expires_at);
