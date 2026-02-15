-- Table for tracking all successful payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete set null,
  amount decimal(12, 2) not null,
  currency text not null default 'PHP',
  status text not null,
  paymongo_payment_id text unique,
  paymongo_link_id text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS for payments
alter table payments enable row level security;

-- Only admins can see all payments
drop policy if exists "Admins can view all payments" on payments;
create policy "Admins can view all payments" on payments 
  for select 
  to authenticated 
  using (is_admin());

-- Users can see their own project payments
drop policy if exists "Users can view their own payments" on payments;
create policy "Users can view their own payments" on payments 
  for select 
  to authenticated 
  using (
    exists (
      select 1 from projects p 
      where p.id = payments.project_id 
      and p.client_id = auth.uid()
    )
  );

-- Add indexes
create index if not exists payments_project_idx on payments(project_id);
create index if not exists payments_created_at_idx on payments(created_at desc);
