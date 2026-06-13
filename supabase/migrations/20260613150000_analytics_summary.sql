-- Aggregate analytics event counts without full table scans in application code.

create or replace function public.get_analytics_event_summary(p_limit_days int default 7)
returns table(name text, count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    ae.name,
    count(*)::bigint
  from public.analytics_events ae
  where ae.occurred_at >= now() - make_interval(days => greatest(p_limit_days, 1))
  group by ae.name
  order by count desc;
$$;

grant execute on function public.get_analytics_event_summary(int) to authenticated;
