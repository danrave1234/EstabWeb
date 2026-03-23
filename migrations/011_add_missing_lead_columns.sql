-- ============================================================
-- Migration 011: Add missing attribution columns to project_leads
-- ============================================================

ALTER TABLE project_leads
  ADD COLUMN IF NOT EXISTS page_slug    text,
  ADD COLUMN IF NOT EXISTS section_key  text,
  ADD COLUMN IF NOT EXISTS source       text;

-- Add indexes for common CRM queries
CREATE INDEX IF NOT EXISTS idx_project_leads_page_slug ON project_leads (page_slug);
CREATE INDEX IF NOT EXISTS idx_project_leads_source    ON project_leads (source);
