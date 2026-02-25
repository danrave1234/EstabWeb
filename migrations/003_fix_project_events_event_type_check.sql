-- Migration: Fix project_events event_type check constraint
-- Adds missing event types: section_view, lead_form, lead_call, lead_messenger, lead_viber
-- Created: 2026-02-25

alter table project_events
  drop constraint if exists project_events_event_type_check;

alter table project_events
  add constraint project_events_event_type_check
  check (event_type in ('page_view', 'section_view', 'cta_click', 'lead_submit', 'lead_form', 'lead_call', 'lead_messenger', 'lead_viber'));
