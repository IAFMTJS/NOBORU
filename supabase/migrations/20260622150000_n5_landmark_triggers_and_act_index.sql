-- Sync N5 landmark trigger_after_lesson_count from merged unit spine (post JWorld merge).

alter table public.units
  add column if not exists act_index smallint;

do $$
declare
  n5_id uuid;
begin
  select id into n5_id from public.regions where slug = 'n5' limit 1;
  if n5_id is null then
    return;
  end if;

  with unit_lessons as (
    select
      u.name,
      coalesce(u.act_index, 1) as act_index,
      u.order_index,
      count(l.id)::int as lesson_count
    from public.units u
    left join public.lessons l
      on l.unit_id = u.id
      and l.status in ('published', 'draft')
    where u.region_id = n5_id
    group by u.name, u.act_index, u.order_index
  ),
  cumulative as (
    select
      name,
      act_index,
      order_index,
      sum(lesson_count) over (
        order by act_index, order_index
        rows between unbounded preceding and current row
      ) as lessons_through_unit
    from unit_lessons
  ),
  market_unit as (
    select lessons_through_unit
    from cumulative
    where name ilike '%Numbers%'
       or name ilike '%Greetings%'
       or name ilike '%Family%'
    order by act_index, order_index
    limit 1
  ),
  torii_unit as (
    select lessons_through_unit
    from cumulative
    where act_index = 2
      and (
        name ilike '%Grammar%'
        or name ilike '%Foundations%'
        or name ilike '%Questions%'
      )
    order by order_index
    limit 1
  ),
  slope_unit as (
    select lessons_through_unit
    from cumulative
    where act_index = 3
      and (name ilike '%Listening%' or name ilike '%Reading%')
    order by order_index
    limit 1
  )
  update public.journey_landmarks jl
  set
    trigger_after_lesson_count = mapped.trigger_count,
    updated_at = now()
  from (
    select 'ember-threshold'::text as slug, 1 as trigger_count
    union all
    select 'script-sanctum', greatest(1, coalesce((select lessons_through_unit::int from cumulative where name = 'Hiragana Part I'), 12))
    union all
    select 'kana-bridge', greatest(1, coalesce((select lessons_through_unit::int from cumulative where name = 'Hiragana Practice'), 28))
    union all
    select 'lantern-hamlet', greatest(1, coalesce((select lessons_through_unit::int from cumulative where name = 'Katakana Part I'), 38))
    union all
    select 'market-bend', greatest(1, coalesce((select lessons_through_unit::int from market_unit), 52))
    union all
    select 'forest-torii', greatest(1, coalesce((select lessons_through_unit::int from torii_unit), 68))
    union all
    select 'kanji-grove', greatest(1, coalesce((select lessons_through_unit::int from cumulative where name ilike 'Kanji Part I'), 78))
    union all
    select 'first-slope-shrine', greatest(1, coalesce((select lessons_through_unit::int from slope_unit), 92))
  ) as mapped
  where jl.region_id = n5_id
    and jl.slug = mapped.slug;
end $$;

-- Verify act_index populated on n5 units (backfill safety)
update public.units u
set act_index = coalesce(u.act_index, 1)
from public.regions r
where u.region_id = r.id
  and r.slug = 'n5'
  and u.act_index is null;
