-- Allow project owners to insert into project_versions (for publish and rollback)
-- Run in Supabase SQL Editor.

drop policy if exists project_versions_insert_owner on project_versions;
create policy project_versions_insert_owner on project_versions for insert to authenticated
  with check (exists (select 1 from projects p where p.id = project_id and p.client_id = auth.uid()));
