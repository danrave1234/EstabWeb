-- Migration: allow summarized section attention events for heatmap-style analytics

alter table project_events
  drop constraint if exists project_events_event_type_check;

alter table project_events
  add constraint project_events_event_type_check
  check (event_type in (
    'page_view',
    'section_view',
    'section_attention',
    'cta_click',
    'lead_submit',
    'lead_form',
    'lead_call',
    'lead_messenger',
    'lead_viber',
    'map_interact',
    'scroll_depth',
    'click_map',
    'form_start',
    'session_start',
    'session_end'
  ));