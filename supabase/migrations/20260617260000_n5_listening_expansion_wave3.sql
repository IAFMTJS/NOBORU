-- N5 listening expansion wave 3

-- N5 listening exercises (wave 3)

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Weather Forecast',
  'weather-forecast',
  '明日は 晴れ です。暖かい です。',
  'Ashita wa hare desu. Atatakai desu.',
  'Tomorrow it will be clear. It will be warm.',
  'What will the weather be like tomorrow?',
  '["Clear and warm", "Rainy and cold", "Snowy", "Cloudy and windy"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'weather-forecast');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Asking for the Restroom',
  'asking-restroom',
  'すみません。トイレは どこ ですか。',
  'Sumimasen. Toire wa doko desu ka.',
  'Excuse me. Where is the restroom?',
  'What is the speaker looking for?',
  '["The restroom", "The station", "A restaurant", "A ticket counter"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'asking-restroom');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Library Hours',
  'library-hours',
  '図書館は 九時から 五時まで です。',
  'Toshokan wa kuji kara goji made desu.',
  'The library is open from nine to five.',
  'When does the library close?',
  '["Five o''clock", "Nine o''clock", "Six o''clock", "Eight o''clock"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'library-hours');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Inviting to Lunch',
  'inviting-lunch',
  'お昼 一緒に 食べませんか。',
  'Ohiru issho ni tabemasen ka.',
  'Shall we eat lunch together?',
  'What does the speaker suggest?',
  '["Eating lunch together", "Going to a movie", "Studying together", "Going home early"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'inviting-lunch');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Missed the Train',
  'missed-train',
  '電車に 乗り遅れました。次は 十五分 後 です。',
  'Densha ni noriokuremashita. Tsugi wa juugofun go desu.',
  'I missed the train. The next one is in fifteen minutes.',
  'How long until the next train?',
  '["Fifteen minutes", "Five minutes", "Thirty minutes", "One hour"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'missed-train');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Thanking for Help',
  'thanking-help',
  '道を 教えて くれて ありがとう ございます。',
  'Michi o oshiete kurete arigatou gozaimasu.',
  'Thank you for telling me the way.',
  'Why is the speaker thanking the other person?',
  '["For giving directions", "For buying a ticket", "For cooking food", "For lending money"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'thanking-help');


-- Listening challenges (wave 3)
insert into public.listening_challenges (title, slug, description, jlpt_level, difficulty, status)
select c.title, c.slug, c.description, 'n5'::public.jlpt_level, c.difficulty, 'published'
from (
  values
  ('daily-services-listening', 'Daily Services Listening', 'Listen to everyday service encounters: weather, facilities, and invitations.', 1),  ('n5-listening-full-mock', 'N5 Full Listening Mock', 'Eight-part comprehensive listening mock covering travel, health, school, and social situations.', 3)
) as c(slug, title, description, difficulty)
where not exists (
  select 1 from public.listening_challenges existing where existing.slug = c.slug
);

do $challenge_items_wave3$
#variable_conflict use_variable
declare
  challenge_rec record;
  challenge_id uuid;
  exercise_id uuid;
  slug_value text;
  item_index integer;
  exercise_slugs text[];
begin
  for challenge_rec in
    select slug from public.listening_challenges
    where slug in ('daily-services-listening', 'n5-listening-full-mock')
  loop
    select id into challenge_id from public.listening_challenges
    where slug = challenge_rec.slug limit 1;

    exercise_slugs := case challenge_rec.slug
    when 'daily-services-listening' then array['weather-forecast', 'asking-restroom', 'library-hours', 'inviting-lunch']
    when 'n5-listening-full-mock' then array['greeting-friend', 'buying-ticket', 'feeling-sick', 'classroom-question', 'missed-train', 'birthday-party', 'thanking-help', 'goodbye-friend']
      else array[]::text[]
    end;

    item_index := 0;
    foreach slug_value in array exercise_slugs loop
      select id into exercise_id from public.listening_exercises
      where slug = slug_value and status = 'published' limit 1;

      if exercise_id is not null then
        insert into public.listening_challenge_items (challenge_id, exercise_id, order_index)
        select challenge_id, exercise_id, item_index
        where not exists (
          select 1 from public.listening_challenge_items
          where challenge_id = challenge_id and exercise_id = exercise_id
        );
        item_index := item_index + 1;
      end if;
    end loop;
  end loop;
end;
$challenge_items_wave3$;


-- Wire wave 3 listening content into Listening Practice unit
do $listening_unit_wave3$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  challenge_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  select id into unit_id from public.units
  where region_id = region_id and name = 'Listening Practice' limit 1;

  if unit_id is null then return; end if;

  for exercise_id in
    select id from public.listening_exercises
    where status = 'published' and jlpt_level = 'n5'
      and slug in ('weather-forecast', 'asking-restroom', 'library-hours', 'inviting-lunch', 'missed-train', 'thanking-help')
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
      and slug in ('daily-services-listening', 'n5-listening-full-mock')
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
        where lesson_id = lesson_id and content_type = 'listening_challenge' and content_id = challenge_id
      );
    end if;
  end loop;
end;
$listening_unit_wave3$;
