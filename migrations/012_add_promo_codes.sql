-- Migration: Add promo_codes and promo_redemptions tables
-- Promo codes allow clients to redeem a free subscription (plan + months) at checkout.
-- Admins control: plan tier, duration (months), max uses, expiry date, and active status.
-- Created: 2026-03-24

create table if not exists promo_codes (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,
  description   text,
  plan_id       text not null default 'basic' check (plan_id in ('basic', 'pro', 'ecommerce', 'custom')),
  months        int  not null default 1 check (months > 0),
  max_uses      int  not null default 1 check (max_uses > 0),
  usage_count   int  not null default 0,
  status        text not null default 'active' check (status in ('active', 'revoked')),
  expires_at    timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists promo_redemptions (
  id            uuid primary key default gen_random_uuid(),
  promo_id      uuid not null references promo_codes(id) on delete cascade,
  redeemed_by   uuid not null references auth.users(id) on delete cascade,
  project_id    uuid references projects(id) on delete set null,
  redeemed_at   timestamptz default now(),
  unique (promo_id, redeemed_by)
);

create index if not exists promo_codes_code_idx on promo_codes(code);
create index if not exists promo_codes_status_idx on promo_codes(status);
create index if not exists promo_redemptions_promo_idx on promo_redemptions(promo_id);
create index if not exists promo_redemptions_user_idx on promo_redemptions(redeemed_by);

-- RLS
alter table promo_codes enable row level security;
alter table promo_redemptions enable row level security;

-- Admins can do everything
create policy promo_codes_admin_all on promo_codes
  for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin','sub_admin')))
  with check (exists (select 1 from profiles where id = auth.uid() and role in ('admin','sub_admin')));

-- Authenticated users can read active codes (for validation at checkout)
create policy promo_codes_client_read on promo_codes
  for select to authenticated
  using (true);

-- Admins can read all redemptions
create policy promo_redemptions_admin_all on promo_redemptions
  for all to authenticated
  using (exists (select 1 from profiles where id = auth.uid() and role in ('admin','sub_admin')))
  with check (exists (select 1 from profiles where id = auth.uid() and role in ('admin','sub_admin')));

-- Users can insert their own redemptions (via service role in API)
create policy promo_redemptions_client_insert on promo_redemptions
  for insert to authenticated
  with check (redeemed_by = auth.uid());

-- Users can read their own redemptions
create policy promo_redemptions_client_read on promo_redemptions
  for select to authenticated
  using (redeemed_by = auth.uid());
