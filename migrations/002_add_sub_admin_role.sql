-- Migration: Add sub_admin role
-- Adds 'sub_admin' to the allowed roles in the profiles table.
-- sub_admin can access the admin panel but cannot access:
--   Transactions, Codes, Settings, Audit Logs (restricted to admin only)

-- Drop the existing inline check constraint on the role column
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Also drop any constraint that may be named differently (inline check)
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT conname INTO con_name
  FROM pg_constraint
  WHERE conrelid = 'profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%role%';

  IF con_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT ' || quote_ident(con_name);
  END IF;
END $$;

-- Re-add the check constraint with sub_admin included
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'sub_admin', 'client'));

-- Update the is_admin RLS helper if it exists (only super admin)
-- sub_admin access is handled at the application layer
