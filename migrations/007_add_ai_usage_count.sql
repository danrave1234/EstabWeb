-- Migration to add AI usage tracking to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_usage_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_usage_limit INTEGER;
