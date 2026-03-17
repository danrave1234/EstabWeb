-- Migration: Add site_status to projects table
-- Allows admins and clients to disable or archive (soft-delete) a website.
-- Statuses:
--   active   — normal, publicly visible (default)
--   disabled — temporarily offline by client choice; can be re-enabled
--   archived — soft-deleted; hidden from public; only admin can restore
-- Created: 2026-03-14

alter table projects
  add column if not exists site_status text
    not null default 'active'
    check (site_status in ('active', 'disabled', 'archived'));

alter table projects
  add column if not exists site_status_updated_at timestamptz;

alter table projects
  add column if not exists site_status_reason text;

-- Backfill: all existing rows are active
update projects set site_status = 'active' where site_status is null;
