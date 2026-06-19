-- World Tree skeleton: placeholder regions, draft units/lessons, learning branch backfill.

-- ---------------------------------------------------------------------------
-- Regions: Mount N3, N2, N1
-- ---------------------------------------------------------------------------

insert into public.regions (slug, name, description, order_index, unlock_requirement, status)
values
  (
    'mount-n3',
    'Mount N3',
    'The ancient trunk rings. Independent comprehension awaits.',
    4,
    'n4-final-trial',
    'published'
  ),
  (
    'mount-n2',
    'Mount N2',
    'The grand canopy. Advanced wisdom and branch networks.',
    5,
    'n3-final-trial',
    'published'
  ),
  (
    'mount-n1',
    'Mount N1',
    'The celestial crown. Mastery at the highest level.',
    6,
    'n2-final-trial',
    'published'
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Seed draft curriculum per region (units = branches, lessons = mini chapters)
-- ---------------------------------------------------------------------------

do $$
declare
  region_rec record;
  unit_rec record;
  region_id uuid;
  unit_id uuid;
  lesson_idx int;
  branch_names text[];
  target_lessons int;
  lessons_per_branch int;
  branch_count int;
  existing_count int;
  lesson_type text;
  lesson_types text[] := array['vocabulary', 'grammar', 'kanji', 'reading', 'listening'];
begin
  for region_rec in
    select *
    from (
      values
        ('mount-n3', array['Grammar I', 'Grammar II', 'Vocabulary I', 'Vocabulary II', 'Kanji I', 'Kanji II', 'Reading I', 'Reading II', 'Listening I', 'Listening II', 'Conversation', 'Review'], 180),
        ('mount-n2', array['Canopy Hub A', 'Canopy Hub B', 'Canopy Hub C', 'Canopy Hub D', 'Grammar', 'Vocabulary', 'Kanji', 'Reading', 'Listening', 'Review'], 160),
        ('mount-n1', array['Crown Arm α', 'Crown Arm β', 'Crown Arm γ', 'Sky West', 'Sky East', 'Advanced Grammar', 'Advanced Reading', 'Advanced Listening'], 110),
        ('master-summit', array['Summit Mastery', 'Infinite Review'], 20),
        ('mount-n5', array['Greetings', 'Numbers', 'Family', 'Food', 'Places', 'Time', 'Verbs', 'Review'], 95),
        ('mount-n4', array['Daily Life', 'Actions', 'Grammar Core', 'Kanji Trail', 'Reading', 'Listening', 'Work', 'Travel'], 85)
    ) as t(slug, branches, target)
  loop
    select id into region_id from public.regions where slug = region_rec.slug;
    if region_id is null then
      continue;
    end if;

    branch_names := region_rec.branches;
    target_lessons := region_rec.target;
    branch_count := coalesce(array_length(branch_names, 1), 1);

    select count(*) into existing_count
    from public.lessons l
    inner join public.units u on u.id = l.unit_id
    where u.region_id = region_id;

    if existing_count >= target_lessons then
      continue;
    end if;

    lessons_per_branch := greatest(3, (target_lessons - 1) / branch_count);

    for unit_idx in 1..branch_count loop
      insert into public.units (region_id, name, description, order_index, status)
      select
        region_id,
        branch_names[unit_idx],
        'World Tree branch — planned content.',
        unit_idx - 1,
        'draft'
      where not exists (
        select 1
        from public.units u
        where u.region_id = region_id
          and u.name = branch_names[unit_idx]
      );

      select id into unit_id
      from public.units
      where region_id = region_id
        and name = branch_names[unit_idx]
      order by order_index
      limit 1;

      if unit_id is null then
        continue;
      end if;

      for lesson_idx in 1..lessons_per_branch loop
        exit when (
          select count(*)
          from public.lessons l
          inner join public.units u on u.id = l.unit_id
          where u.region_id = region_id
        ) >= target_lessons - 1;

        lesson_type := lesson_types[1 + ((unit_idx + lesson_idx - 2) % array_length(lesson_types, 1))];

        insert into public.lessons (
          unit_id,
          type,
          title,
          description,
          order_index,
          difficulty,
          xp_reward,
          estimated_duration,
          status
        )
        select
          unit_id,
          case
            when lesson_idx = lessons_per_branch then 'practice'
            else lesson_type
          end,
          branch_names[unit_idx] || ' · Chapter ' || lesson_idx,
          'Planned — content in development.',
          lesson_idx - 1,
          2,
          case when lesson_idx = lessons_per_branch then 25 else 10 end,
          5,
          'draft'
        where not exists (
          select 1
          from public.lessons l
          where l.unit_id = unit_id
            and l.order_index = lesson_idx - 1
            and l.title = branch_names[unit_idx] || ' · Chapter ' || lesson_idx
        );
      end loop;
    end loop;

    -- Regional final trial placeholder
    select id into unit_id
    from public.units
    where region_id = region_id
    order by order_index desc
    limit 1;

    if unit_id is not null then
      insert into public.lessons (
        unit_id, type, title, description, order_index, difficulty, xp_reward, estimated_duration, status
      )
      select
        unit_id,
        'application',
        region_rec.slug || ' · Final Trial',
        'Planned — boss examination in development.',
        999,
        3,
        50,
        15,
        'draft'
      where not exists (
        select 1
        from public.lessons l
        where l.unit_id = unit_id
          and l.type = 'application'
          and l.title = region_rec.slug || ' · Final Trial'
      );
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- learning_branches backfill for draft units
-- ---------------------------------------------------------------------------

insert into public.learning_branches (
  region_id,
  unit_id,
  slug,
  name,
  description,
  order_index,
  status
)
select
  u.region_id,
  u.id,
  r.slug || '-' || replace(lower(u.name), ' ', '-'),
  u.name,
  coalesce(u.description, 'World Tree branch'),
  u.order_index,
  case when u.status = 'published' then 'published'::public.content_status else 'draft'::public.content_status end
from public.units u
inner join public.regions r on r.id = u.region_id
where r.slug in ('mount-n3', 'mount-n2', 'mount-n1', 'master-summit', 'mount-n5', 'mount-n4')
  and not exists (
    select 1 from public.learning_branches lb where lb.unit_id = u.id
  );

-- Placeholder trial templates for future region gates
insert into public.trial_templates (
  slug,
  region_slug,
  kind,
  title,
  description,
  boss_name,
  status
)
select
  v.slug,
  v.region_slug,
  v.kind::public.trial_kind,
  v.title,
  v.description,
  v.boss_name,
  v.status::public.content_status
from (
  values
    ('n3-final-trial', 'mount-n3', 'final_trial', 'N3 Final Trial', 'Placeholder gate for Mount N2.', 'N3 Warden', 'draft'),
    ('n2-final-trial', 'mount-n2', 'final_trial', 'N2 Final Trial', 'Placeholder gate for Mount N1.', 'N2 Keeper', 'draft')
) as v(slug, region_slug, kind, title, description, boss_name, status)
where not exists (
  select 1 from public.trial_templates existing where existing.slug = v.slug
);
