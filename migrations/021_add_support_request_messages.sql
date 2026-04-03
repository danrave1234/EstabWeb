-- Migration: 021_add_support_request_messages.sql
-- Created: 2026-04-04

alter table support_requests
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists last_replied_at timestamptz,
  add column if not exists last_replied_by uuid references auth.users(id) on delete set null,
  add column if not exists resolved_at timestamptz,
  add column if not exists closed_at timestamptz;

create table if not exists support_request_messages (
  id uuid primary key default gen_random_uuid(),
  support_request_id uuid not null references support_requests(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role text not null check (sender_role in ('client', 'admin')),
  message text not null,
  created_at timestamptz default now()
);

alter table support_request_messages enable row level security;

create index if not exists support_request_messages_request_idx
  on support_request_messages (support_request_id, created_at asc);

create index if not exists support_request_messages_sender_idx
  on support_request_messages (sender_id);

drop policy if exists support_request_messages_select_owner on support_request_messages;
drop policy if exists support_request_messages_insert_owner on support_request_messages;
drop policy if exists support_request_messages_admin_all on support_request_messages;

create policy support_request_messages_select_owner on support_request_messages
  for select to authenticated
  using (
    exists (
      select 1
      from support_requests sr
      where sr.id = support_request_messages.support_request_id
        and sr.user_id = auth.uid()
    )
  );

create policy support_request_messages_insert_owner on support_request_messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and sender_role = 'client'
    and exists (
      select 1
      from support_requests sr
      where sr.id = support_request_messages.support_request_id
        and sr.user_id = auth.uid()
    )
  );

create policy support_request_messages_admin_all on support_request_messages
  for all to authenticated
  using (is_admin())
  with check (is_admin());

create or replace function create_initial_support_request_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.message is not null and length(trim(new.message)) > 0 then
    insert into support_request_messages (
      support_request_id,
      sender_id,
      sender_role,
      message,
      created_at
    )
    values (
      new.id,
      new.user_id,
      'client',
      new.message,
      coalesce(new.created_at, now())
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;

create or replace function sync_support_request_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update support_requests
  set
    updated_at = coalesce(new.created_at, now()),
    last_replied_at = case
      when new.sender_role = 'admin' then coalesce(new.created_at, now())
      else last_replied_at
    end,
    last_replied_by = case
      when new.sender_role = 'admin' then new.sender_id
      else last_replied_by
    end
  where id = new.support_request_id;

  return new;
end;
$$;

drop trigger if exists support_request_create_initial_message on support_requests;
create trigger support_request_create_initial_message
  after insert on support_requests
  for each row execute procedure create_initial_support_request_message();

drop trigger if exists support_request_message_sync on support_request_messages;
create trigger support_request_message_sync
  after insert on support_request_messages
  for each row execute procedure sync_support_request_activity();

insert into support_request_messages (
  support_request_id,
  sender_id,
  sender_role,
  message,
  created_at
)
select
  sr.id,
  sr.user_id,
  'client',
  sr.message,
  sr.created_at
from support_requests sr
where sr.message is not null
  and length(trim(sr.message)) > 0
  and not exists (
    select 1
    from support_request_messages srm
    where srm.support_request_id = sr.id
  );
