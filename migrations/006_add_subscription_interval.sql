-- Migration: 006_add_subscription_interval.sql
-- Created: 2026-02-26T15:10:00.000Z

-- Add subscription_interval to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS subscription_interval TEXT DEFAULT 'monthly' CHECK (subscription_interval IN ('monthly', 'yearly'));

-- Add comment for clarity
COMMENT ON COLUMN projects.subscription_interval IS 'Billing interval for the subscription: monthly or yearly';
