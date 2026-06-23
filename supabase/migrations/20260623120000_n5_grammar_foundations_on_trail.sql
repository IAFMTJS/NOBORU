-- Integrate は / です into Mount N5 grammar trail (no longer Base Camp only)

do $$
declare
  v_region_id uuid;
  v_unit_id uuid;
  v_lesson_id uuid;
  g_wa uuid;
  g_desu uuid;
begin
  select id into v_region_id from public.regions
  where slug in ('n5', 'mount-n5')
  order by case when slug = 'n5' then 0 else 1 end
  limit 1;

  if v_region_id is null then
    return;
  end if;

  select id into g_wa from public.grammar_points where title = 'は (wa)' limit 1;
  select id into g_desu from public.grammar_points where title = 'です' limit 1;

  if g_wa is null or g_desu is null then
    return;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select v_region_id, 'Sentence Foundations', 'Core patterns は and です before particle grammar.', 4, 'published'
  where not exists (
    select 1 from public.units u
    where u.region_id = v_region_id and u.name = 'Sentence Foundations'
  );

  select id into v_unit_id from public.units u
  where u.region_id = v_region_id and u.name = 'Sentence Foundations'
  limit 1;

  if v_unit_id is null then
    return;
  end if;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select v_unit_id, 'grammar', 'Sentence Foundations', 'Learn は and です on the N5 trail.', 1, 12, 6, 'published'
  where not exists (
    select 1 from public.lessons l
    where l.unit_id = v_unit_id and l.title = 'Sentence Foundations'
  );

  select id into v_lesson_id from public.lessons l
  where l.unit_id = v_unit_id and l.title = 'Sentence Foundations'
  limit 1;

  if v_lesson_id is null then
    return;
  end if;

  insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
  select v_lesson_id, 'grammar', g_wa, 0
  where not exists (
    select 1 from public.lesson_items li
    where li.lesson_id = v_lesson_id and li.content_type = 'grammar' and li.content_id = g_wa
  );

  insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
  select v_lesson_id, 'grammar', g_desu, 1
  where not exists (
    select 1 from public.lesson_items li
    where li.lesson_id = v_lesson_id and li.content_type = 'grammar' and li.content_id = g_desu
  );
end $$;
