-- Application exercises: use learned kana in translation and production drills
create table if not exists public.application_exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  direction text not null check (direction in ('to_japanese', 'to_english', 'to_romaji')),
  prompt text not null,
  japanese_text text,
  display_hint text,
  accepted_answers jsonb not null default '[]'::jsonb,
  script text not null default 'hiragana' check (script in ('hiragana', 'katakana', 'mixed')),
  difficulty integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists application_exercises_status_script_idx
  on public.application_exercises (status, script);

alter table public.lesson_items
  drop constraint if exists lesson_items_content_type_check;

alter table public.lesson_items
  add constraint lesson_items_content_type_check
  check (content_type in (
    'vocabulary', 'kanji', 'grammar', 'hiragana', 'katakana', 'reading',
    'story', 'dialogue', 'listening', 'listening_challenge', 'application'
  ));

-- Hiragana and katakana application exercises
insert into public.application_exercises (
  title, direction, prompt, japanese_text, display_hint, accepted_answers, script, difficulty, status
)
select
  seed.title,
  seed.direction,
  seed.prompt,
  seed.japanese_text,
  seed.display_hint,
  seed.accepted_answers,
  seed.script,
  seed.difficulty,
  seed.status
from (values
  (
    'Hiragana a',
    'to_japanese',
    'Type in hiragana: a',
    null::text,
    null::text,
    '["あ"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'Hiragana sa romaji',
    'to_romaji',
    'Type the romaji reading',
    'さ',
    null::text,
    '["sa"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'Love in hiragana',
    'to_english',
    'What does this mean?',
    'あい',
    'a + i',
    '["love"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'Morning in hiragana',
    'to_japanese',
    'Type in hiragana: morning (asa)',
    null::text,
    'a + sa',
    '["あさ"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'Umbrella meaning',
    'to_english',
    'What does this mean?',
    'かさ',
    'ka + sa',
    '["umbrella"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'Salmon in hiragana',
    'to_japanese',
    'Type in hiragana: salmon (sake)',
    null::text,
    'sa + ke',
    '["さけ"]'::jsonb,
    'hiragana',
    1,
    'published'
  ),
  (
    'You in hiragana',
    'to_japanese',
    'Type in hiragana: you (anata)',
    null::text,
    'a + na + ta',
    '["あなた"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'You meaning',
    'to_english',
    'What does this mean?',
    'あなた',
    'anata',
    '["you"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'You are well',
    'to_japanese',
    'Translate: You are well',
    null::text,
    'anata wa genki desu',
    '["あなたはげんきです"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'Friend in hiragana',
    'to_japanese',
    'Type in hiragana: friend (tomodachi)',
    null::text,
    'to + mo + da + chi',
    '["ともだち"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'You are happy',
    'to_english',
    'Translate into English',
    'あなたはしあわせです',
    'anata wa shiawase desu',
    '["you are happy", "you''re happy"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'Fish in hiragana',
    'to_english',
    'What does this mean?',
    'さかな',
    'sa + ka + na',
    '["fish"]'::jsonb,
    'hiragana',
    2,
    'published'
  ),
  (
    'Voiced fish',
    'to_japanese',
    'Type in hiragana: river (kawa)',
    null::text,
    'ka + wa',
    '["かわ", "がわ"]'::jsonb,
    'hiragana',
    3,
    'published'
  ),
  (
    'Combination kyō',
    'to_japanese',
    'Type in hiragana: today (kyō)',
    null::text,
    'kyo + u',
    '["きょう"]'::jsonb,
    'hiragana',
    3,
    'published'
  ),
  (
    'Katakana a',
    'to_japanese',
    'Type in katakana: a',
    null::text,
    null::text,
    '["ア"]'::jsonb,
    'katakana',
    1,
    'published'
  ),
  (
    'Katakana sa romaji',
    'to_romaji',
    'Type the romaji reading',
    'サ',
    null::text,
    '["sa"]'::jsonb,
    'katakana',
    1,
    'published'
  ),
  (
    'Ice in katakana',
    'to_english',
    'What does this mean?',
    'アイス',
    'a + i + su',
    '["ice", "ice cream"]'::jsonb,
    'katakana',
    1,
    'published'
  ),
  (
    'Coffee in katakana',
    'to_japanese',
    'Type in katakana: coffee',
    null::text,
    'ko + hi',
    '["コーヒー", "コヒー"]'::jsonb,
    'katakana',
    2,
    'published'
  ),
  (
    'You in katakana',
    'to_japanese',
    'Type in katakana: you (anata)',
    null::text,
    'a + na + ta',
    '["アナタ"]'::jsonb,
    'katakana',
    2,
    'published'
  ),
  (
    'Happy in katakana phrase',
    'to_english',
    'Translate into English',
    'アナタハシアワセデス',
    'anata wa shiawase desu',
    '["you are happy", "you''re happy"]'::jsonb,
    'katakana',
    2,
    'published'
  )
) as seed(title, direction, prompt, japanese_text, display_hint, accepted_answers, script, difficulty, status)
where not exists (
  select 1 from public.application_exercises where title = seed.title
);

-- Reseed foothills units with application camps between hiragana teaching blocks
do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  exercise_titles text[];
  exercise_title text;
  order_idx integer;
begin
  select id into region_id from public.regions where slug = 'foothills' limit 1;
  if region_id is null then
    return;
  end if;

  if exists (
    select 1 from public.units
    where region_id = region_id and name = 'Hiragana Trail Camp 1'
  ) then
    return;
  end if;

  -- Shift existing hiragana units to make room for application camps
  update public.units
  set order_index = order_index + 3
  where region_id = region_id
    and name in ('Hiragana Part II', 'Hiragana Advanced', 'Hiragana Reading', 'Hiragana Practice');

  -- Unit: Hiragana Trail Camp 1 (after Part I)
  insert into public.units (region_id, name, description, order_index, status)
  select region_id,
    'Hiragana Trail Camp 1',
    'Use the A, Ka, and Sa rows you know in short words and translations.',
    2,
    'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Trail Camp 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Trail Camp 1' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id,
    'application',
    'Build with A, Ka, Sa',
    'Apply the hiragana you learned in Part I.',
    1,
    15,
    6,
    'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Build with A, Ka, Sa'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Build with A, Ka, Sa' limit 1;

  exercise_titles := array[
    'Hiragana a',
    'Hiragana sa romaji',
    'Love in hiragana',
    'Morning in hiragana',
    'Umbrella meaning',
    'Salmon in hiragana'
  ];
  order_idx := 0;
  foreach exercise_title in array exercise_titles loop
    select id into exercise_id from public.application_exercises
    where title = exercise_title limit 1;
    if lesson_id is not null and exercise_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'application', exercise_id, order_idx
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'application' and content_id = exercise_id
      );
      order_idx := order_idx + 1;
    end if;
  end loop;

  -- Unit: Hiragana Trail Camp 2 (after Part II)
  insert into public.units (region_id, name, description, order_index, status)
  select region_id,
    'Hiragana Trail Camp 2',
    'Translate short phrases using the hiragana rows you have climbed so far.',
    4,
    'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Trail Camp 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Trail Camp 2' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id,
    'application',
    'Words on the Trail',
    'Put your hiragana knowledge to work in real phrases.',
    2,
    18,
    7,
    'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Words on the Trail'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Words on the Trail' limit 1;

  exercise_titles := array[
    'You in hiragana',
    'You meaning',
    'You are well',
    'Friend in hiragana',
    'You are happy',
    'Fish in hiragana'
  ];
  order_idx := 0;
  foreach exercise_title in array exercise_titles loop
    select id into exercise_id from public.application_exercises
    where title = exercise_title limit 1;
    if lesson_id is not null and exercise_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'application', exercise_id, order_idx
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'application' and content_id = exercise_id
      );
      order_idx := order_idx + 1;
    end if;
  end loop;

  -- Unit: Hiragana Trail Camp 3 (after Advanced)
  insert into public.units (region_id, name, description, order_index, status)
  select region_id,
    'Hiragana Trail Camp 3',
    'Practice voiced and combination hiragana in short sentences.',
    6,
    'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Trail Camp 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Trail Camp 3' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id,
    'application',
    'Advanced Trail Phrases',
    'Combine every hiragana form you have learned so far.',
    2,
    18,
    7,
    'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Advanced Trail Phrases'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Advanced Trail Phrases' limit 1;

  exercise_titles := array[
    'Voiced fish',
    'Combination kyō',
    'You are happy',
    'Fish in hiragana'
  ];
  order_idx := 0;
  foreach exercise_title in array exercise_titles loop
    select id into exercise_id from public.application_exercises
    where title = exercise_title limit 1;
    if lesson_id is not null and exercise_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'application', exercise_id, order_idx
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'application' and content_id = exercise_id
      );
      order_idx := order_idx + 1;
    end if;
  end loop;
end $seed$;

-- Katakana application camps in Forest Trail
do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  exercise_titles text[];
  exercise_title text;
  order_idx integer;
begin
  select id into region_id from public.regions where slug = 'forest-trail' limit 1;
  if region_id is null then
    return;
  end if;

  if exists (
    select 1 from public.units
    where region_id = region_id and name = 'Katakana Trail Camp 1'
  ) then
    return;
  end if;

  update public.units
  set order_index = order_index + 2
  where region_id = region_id
    and name in ('Katakana Part II', 'Katakana Advanced', 'Katakana Reading', 'Katakana Practice');

  insert into public.units (region_id, name, description, order_index, status)
  select region_id,
    'Katakana Trail Camp 1',
    'Use the A, Ka, and Sa katakana rows in loanwords and short phrases.',
    2,
    'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Trail Camp 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Trail Camp 1' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id,
    'application',
    'Katakana on the Trail',
    'Apply katakana from Part I in familiar words.',
    1,
    15,
    6,
    'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Katakana on the Trail'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Katakana on the Trail' limit 1;

  exercise_titles := array[
    'Katakana a',
    'Katakana sa romaji',
    'Ice in katakana'
  ];
  order_idx := 0;
  foreach exercise_title in array exercise_titles loop
    select id into exercise_id from public.application_exercises
    where title = exercise_title limit 1;
    if lesson_id is not null and exercise_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'application', exercise_id, order_idx
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'application' and content_id = exercise_id
      );
      order_idx := order_idx + 1;
    end if;
  end loop;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id,
    'Katakana Trail Camp 2',
    'Translate phrases with the katakana you have learned.',
    4,
    'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Trail Camp 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Trail Camp 2' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id,
    'application',
    'Katakana Phrases',
    'Use your katakana inventory in longer phrases.',
    2,
    18,
    7,
    'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Katakana Phrases'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Katakana Phrases' limit 1;

  exercise_titles := array[
    'Coffee in katakana',
    'You in katakana',
    'Happy in katakana phrase'
  ];
  order_idx := 0;
  foreach exercise_title in array exercise_titles loop
    select id into exercise_id from public.application_exercises
    where title = exercise_title limit 1;
    if lesson_id is not null and exercise_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'application', exercise_id, order_idx
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'application' and content_id = exercise_id
      );
      order_idx := order_idx + 1;
    end if;
  end loop;
end $seed$;
