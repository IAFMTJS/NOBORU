-- Reconcile N5 listening lessons under the n5 world region.
-- Earlier listening migrations only targeted mount-n5; after JWorld merge some
-- environments have exercises seeded but no published trail lessons on n5.

do $n5_listening_reconcile$
#variable_conflict use_variable
declare
  n5_region_id uuid;
  legacy_region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  challenge_id uuid;
begin
  select id into n5_region_id
  from public.regions
  where slug = 'n5' and status = 'published'
  limit 1;

  select id into legacy_region_id
  from public.regions
  where slug = 'mount-n5'
  limit 1;

  if n5_region_id is null and legacy_region_id is null then
    return;
  end if;

  select u.id into unit_id
  from public.units u
  where u.name = 'Listening Practice'
    and u.region_id in (
      select id from public.regions where slug in ('n5', 'mount-n5')
    )
  order by case when u.region_id = n5_region_id then 0 else 1 end
  limit 1;

  if unit_id is null and n5_region_id is not null then
    insert into public.units (region_id, name, description, order_index, act_index, status)
    values (
      n5_region_id,
      'Listening Practice',
      'Audio lessons and listening challenges for N5.',
      coalesce(
        (select max(order_index) + 1 from public.units where region_id = n5_region_id),
        0
      ),
      3,
      'published'
    )
    returning id into unit_id;
  end if;

  if unit_id is null then
    return;
  end if;

  if n5_region_id is not null then
    update public.units
    set region_id = n5_region_id, act_index = coalesce(act_index, 3)
    where id = unit_id and region_id is distinct from n5_region_id;
  end if;

  for exercise_id in
    select id from public.listening_exercises
    where status = 'published' and jlpt_level = 'n5'
    order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'listening',
      e.title,
      'Listen and answer a comprehension question.',
      e.difficulty,
      12,
      e.estimated_duration,
      'published'
    from public.listening_exercises e
    where e.id = exercise_id
      and not exists (
        select 1 from public.lessons l
        where l.unit_id = unit_id and l.title = e.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.listening_exercises e on e.title = l.title
    where l.unit_id = unit_id and e.id = exercise_id
    limit 1;

    if lesson_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'listening', exercise_id, 0
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'listening' and content_id = exercise_id
      );
    end if;
  end loop;

  for challenge_id in
    select id from public.listening_challenges
    where status = 'published' and jlpt_level = 'n5'
    order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'listening_challenge',
      c.title,
      'Complete a multi-part listening challenge.',
      c.difficulty,
      20,
      10,
      'published'
    from public.listening_challenges c
    where c.id = challenge_id
      and not exists (
        select 1 from public.lessons l
        where l.unit_id = unit_id and l.title = c.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.listening_challenges c on c.title = l.title
    where l.unit_id = unit_id and c.id = challenge_id
    limit 1;

    if lesson_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'listening_challenge', challenge_id, 0
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id
          and content_type = 'listening_challenge'
          and content_id = challenge_id
      );
    end if;
  end loop;
end;
$n5_listening_reconcile$;
