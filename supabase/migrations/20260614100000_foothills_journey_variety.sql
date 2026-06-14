-- Phase 5: Foothills journey variety — interleave reading earlier in the climb

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
begin
  select id into region_id from public.regions where slug = 'foothills' limit 1;
  if region_id is null then
    return;
  end if;

  -- Explicit unit order: reading after first application camp for early variety
  update public.units
  set order_index = case name
    when 'Hiragana Part I' then 1
    when 'Hiragana Trail Camp 1' then 2
    when 'Hiragana Reading' then 3
    when 'Hiragana Part II' then 4
    when 'Hiragana Trail Camp 2' then 5
    when 'Hiragana Advanced' then 6
    when 'Hiragana Trail Camp 3' then 7
    when 'Hiragana Practice' then 8
    else order_index
  end
  where region_id = region_id;

  -- Re-backfill lesson order within each unit
  with ranked as (
    select
      l.id,
      row_number() over (
        partition by l.unit_id
        order by l.order_index asc, l.title asc, l.id asc
      ) - 1 as new_order_index
    from public.lessons l
    inner join public.units u on u.id = l.unit_id
    where u.region_id = region_id
  )
  update public.lessons l
  set order_index = ranked.new_order_index
  from ranked
  where l.id = ranked.id;
end;
$seed$;
