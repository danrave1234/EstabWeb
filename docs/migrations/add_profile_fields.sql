-- Migration: Add profile fields (full_name, phone, bio) to profiles table
-- Run this in your Supabase SQL editor

alter table profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists bio text;

-- Allow users to update their own profile
drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
