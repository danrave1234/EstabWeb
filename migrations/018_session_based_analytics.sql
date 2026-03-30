-- ============================================================
-- Migration 018: Session-based analytics foundation
-- ============================================================

CREATE TABLE IF NOT EXISTS project_sessions (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_id text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  source text,
  medium text,
  campaign text,
  device text,
  country text,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_project_sessions_project_started
  ON project_sessions (project_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_sessions_visitor
  ON project_sessions (visitor_id);

ALTER TABLE project_leads
  ADD COLUMN IF NOT EXISTS session_id uuid,
  ADD COLUMN IF NOT EXISTS visitor_id text,
  ADD COLUMN IF NOT EXISTS source text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'project_leads'
      AND column_name = 'session_id'
      AND udt_name <> 'uuid'
  ) THEN
    ALTER TABLE project_leads
      ALTER COLUMN session_id TYPE uuid
      USING CASE
        WHEN NULLIF(session_id, '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN NULLIF(session_id, '')::uuid
        ELSE NULL
      END;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'project_events'
      AND column_name = 'session_id'
      AND udt_name <> 'uuid'
  ) THEN
    ALTER TABLE project_events
      ALTER COLUMN session_id TYPE uuid
      USING CASE
        WHEN NULLIF(session_id, '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN NULLIF(session_id, '')::uuid
        ELSE NULL
      END;
  END IF;
END $$;

INSERT INTO project_sessions (id, project_id, visitor_id, started_at, ended_at, source)
SELECT
  session_rollup.id,
  session_rollup.project_id,
  MAX(session_rollup.visitor_id) AS visitor_id,
  MIN(session_rollup.occurred_at) AS started_at,
  MAX(session_rollup.occurred_at) AS ended_at,
  COALESCE(MAX(session_rollup.source) FILTER (WHERE session_rollup.source IS NOT NULL), 'direct') AS source
FROM (
  SELECT
    session_id AS id,
    project_id,
    visitor_id,
    created_at AS occurred_at,
    source
  FROM project_events
  WHERE session_id IS NOT NULL

  UNION ALL

  SELECT
    session_id AS id,
    project_id,
    visitor_id,
    created_at AS occurred_at,
    source
  FROM project_leads
  WHERE session_id IS NOT NULL
) AS session_rollup
LEFT JOIN project_sessions existing_sessions ON existing_sessions.id = session_rollup.id
WHERE existing_sessions.id IS NULL
GROUP BY session_rollup.id, session_rollup.project_id;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'project_leads'
      AND constraint_name = 'project_leads_session_id_fkey'
  ) THEN
    ALTER TABLE project_leads
      ADD CONSTRAINT project_leads_session_id_fkey
      FOREIGN KEY (session_id) REFERENCES project_sessions(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'project_events'
      AND constraint_name = 'project_events_session_id_fkey'
  ) THEN
    ALTER TABLE project_events
      ADD CONSTRAINT project_events_session_id_fkey
      FOREIGN KEY (session_id) REFERENCES project_sessions(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_project_leads_session_id
  ON project_leads (session_id);
