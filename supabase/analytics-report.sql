-- 1. Funnel sessions and conversion from LandingView.
with ordered_events(event_name, step_order) as (
  values
    ('LandingView', 1),
    ('GameReady', 2),
    ('GameStart', 3),
    ('FirstBrushContact', 4),
    ('FirstZoneCleaned', 5),
    ('FirstPhaseComplete', 6),
    ('GameOver', 7),
    ('ResultViewed', 8),
    ('AmazonCtaViewed', 9),
    ('AmazonOutboundClick', 10),
    ('ShareResult', 11)
), counts as (
  select event_name, count(distinct session_id) as sessions
  from public.analytics_events
  group by event_name
), landing as (
  select coalesce((select sessions from counts where event_name = 'LandingView'), 0) as sessions
)
select
  ordered_events.step_order,
  ordered_events.event_name,
  coalesce(counts.sessions, 0) as sessions,
  round(100.0 * coalesce(counts.sessions, 0) / nullif(landing.sessions, 0), 1) as conversion_from_landing_pct
from ordered_events
left join counts using (event_name)
cross join landing
order by ordered_events.step_order;

-- 2. Average active play time and score at important outcomes.
select
  event_name,
  count(distinct session_id) as sessions,
  round(avg(play_time_ms) / 1000.0, 1) as avg_active_play_seconds,
  round(avg(score), 1) as avg_score,
  round(avg(phase), 1) as avg_phase
from public.analytics_events
where event_name in ('GameOver', 'AmazonOutboundClick', 'ShareResult')
group by event_name
order by event_name;

-- 3. Campaign-level funnel summary.
select
  coalesce(nullif(utm_campaign, ''), '(none)') as campaign,
  count(distinct session_id) filter (where event_name = 'LandingView') as landing_sessions,
  count(distinct session_id) filter (where event_name = 'GameStart') as game_start_sessions,
  count(distinct session_id) filter (where event_name = 'FirstZoneCleaned') as first_clean_sessions,
  count(distinct session_id) filter (where event_name = 'FirstPhaseComplete') as first_phase_sessions,
  count(distinct session_id) filter (where event_name = 'AmazonOutboundClick') as amazon_click_sessions
from public.analytics_events
group by coalesce(nullif(utm_campaign, ''), '(none)')
order by landing_sessions desc;
