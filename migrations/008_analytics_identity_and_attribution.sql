-- ============================================================
-- Migration 008: Analytics identity, attribution & deduplication
-- ============================================================
-- project_events: add visitor identity, session, event dedup, funnel step
ALTER TABLE project_events
  ADD COLUMN IF NOT EXISTS visitor_id      text,
  ADD COLUMN IF NOT EXISTS session_id      text,
  ADD COLUMN IF NOT EXISTS event_id        uuid,
  ADD COLUMN IF NOT EXISTS funnel_step     text;

-- project_leads: add identity + first-touch attribution
ALTER TABLE project_leads
  ADD COLUMN IF NOT EXISTS visitor_id          text,
  ADD COLUMN IF NOT EXISTS session_id          text,
  ADD COLUMN IF NOT EXISTS first_touch_source  text,
  ADD COLUMN IF NOT EXISTS first_touch_utm     jsonb;

-- Indexes for identity-based queries (visitor journeys, returning visitors)
CREATE INDEX IF NOT EXISTS idx_project_events_visitor_id  ON project_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_project_events_session_id  ON project_events (session_id);
CREATE INDEX IF NOT EXISTS idx_project_events_event_id    ON project_events (event_id);
CREATE INDEX IF NOT EXISTS idx_project_events_funnel_step ON project_events (funnel_step);

CREATE INDEX IF NOT EXISTS idx_project_leads_visitor_id   ON project_leads (visitor_id);
