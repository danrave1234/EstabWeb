-- Subscription & publish limit fields for projects
-- Run this migration in Supabase SQL Editor after the base schema.
-- Existing projects will default to subscription_status='free' (requires admin approval).

-- Add subscription columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free' 
  CHECK (subscription_status IN ('free', 'trial', 'active', 'admin_granted'));

ALTER TABLE projects ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_limit int DEFAULT 50;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_limit_daily int DEFAULT 3;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_count int DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_count_today int DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_period_start timestamptz DEFAULT now();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS admin_granted_by uuid REFERENCES auth.users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS admin_granted_at timestamptz;

-- Add comment for reference
COMMENT ON COLUMN projects.subscription_status IS 'free=requires approval, trial/active/admin_granted=can publish directly with limits';
COMMENT ON COLUMN projects.publish_limit IS 'Max publishes per period (30 days) for paid/trial clients';
COMMENT ON COLUMN projects.publish_limit_daily IS 'Max publishes per day (e.g. 3)';
