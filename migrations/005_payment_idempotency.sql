-- ============================================================
-- Migration 005: Payment Idempotency
-- Created: 2026-02-26
-- ============================================================
-- Ensures webhook events are deduplicated so duplicate deliveries
-- from PayMongo cannot activate a subscription twice, reset publish
-- counters, or insert duplicate payment rows.
-- ============================================================

-- 1. Webhook event deduplication table
--    Stores every processed PayMongo event ID.
--    The UNIQUE constraint on event_id makes duplicate inserts fail fast.
create table if not exists processed_webhook_events (
  id         uuid        primary key default gen_random_uuid(),
  event_id   text        not null unique,
  event_type text,
  created_at timestamptz default now()
);

-- Index for fast look-up by event_id
create index if not exists processed_webhook_events_event_id_idx
  on processed_webhook_events (event_id);

-- RLS: only service role can touch this table (webhooks use service client)
alter table processed_webhook_events enable row level security;

-- Admins can audit the table
drop policy if exists "Admins can view processed webhook events" on processed_webhook_events;
create policy "Admins can view processed webhook events"
  on processed_webhook_events for select
  to authenticated
  using (is_admin());

-- 2. Ensure payments.paymongo_payment_id is UNIQUE
--    (already set in initial schema, but this migration is idempotent)
do $$
begin
  if not exists (
    select 1
    from   pg_constraint
    where  conname = 'payments_paymongo_payment_id_key'
      and  conrelid = 'payments'::regclass
  ) then
    alter table payments
      add constraint payments_paymongo_payment_id_key
      unique (paymongo_payment_id);
  end if;
end$$;

-- 3. Auto-cleanup: drop processed events older than 90 days
--    (run this as a scheduled job / cron; provided here as reference)
-- delete from processed_webhook_events where created_at < now() - interval '90 days';
