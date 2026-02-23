-- Migration 007: Add PayMongo Customer and Subscription IDs to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS paymongo_customer_id text,
  ADD COLUMN IF NOT EXISTS paymongo_subscription_id text,
  ADD COLUMN IF NOT EXISTS paymongo_plan_id text;
