-- Migration 006: Add renewal_link fields to projects for auto-renew cron
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS renewal_link text,
  ADD COLUMN IF NOT EXISTS renewal_link_id text,
  ADD COLUMN IF NOT EXISTS renewal_link_created_at timestamptz;
