-- Migration 016: Add session_replays table for rrweb session recording
CREATE TABLE IF NOT EXISTS session_replays (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  session_id  text NOT NULL,
  visitor_id  text,
  page_slug   text,
  events      jsonb NOT NULL DEFAULT '[]',
  duration_ms integer,
  started_at  timestamptz NOT NULL DEFAULT now(),
  ended_at    timestamptz,
  metadata    jsonb
);

CREATE INDEX IF NOT EXISTS idx_session_replays_project_id ON session_replays(project_id);
CREATE INDEX IF NOT EXISTS idx_session_replays_session_id ON session_replays(session_id);
CREATE INDEX IF NOT EXISTS idx_session_replays_started_at ON session_replays(started_at DESC);

ALTER TABLE session_replays ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by API routes)
CREATE POLICY "service_role_all_session_replays"
  ON session_replays FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
