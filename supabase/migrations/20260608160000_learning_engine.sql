-- Phase 5: Learning engine — lesson items and user progress

create type public.progress_status as enum (
  'not_started',
  'in_progress',
  'completed'
);

create table public.lesson_items (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  content_type text not null check (content_type in ('vocabulary', 'kanji', 'grammar')),
  content_id uuid not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, content_type, content_id)
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  region_id uuid references public.regions (id) on delete set null,
  unit_id uuid references public.units (id) on delete set null,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status public.progress_status not null default 'not_started',
  score integer not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index lesson_items_lesson_id_idx on public.lesson_items (lesson_id);
create index lesson_items_order_idx on public.lesson_items (lesson_id, order_index);
create index user_progress_user_id_idx on public.user_progress (user_id);
create index user_progress_lesson_id_idx on public.user_progress (lesson_id);
create index user_progress_status_idx on public.user_progress (user_id, status);

create trigger lesson_items_set_updated_at
  before update on public.lesson_items
  for each row execute function public.set_updated_at();

create trigger user_progress_set_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

alter table public.lesson_items enable row level security;
alter table public.user_progress enable row level security;

create policy "Authenticated users read published lesson items"
  on public.lesson_items for select
  using (
    auth.uid() is not null
    and (
      public.is_content_admin()
      or exists (
        select 1
        from public.lessons l
        where l.id = lesson_id and l.status = 'published'
      )
    )
  );

create policy "Content admins manage lesson items"
  on public.lesson_items for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed starter published content and lessons for Base Camp
do $$
declare
  base_unit_id uuid;
  foothills_region_id uuid;
  vocab_lesson_id uuid;
  kanji_lesson_id uuid;
  grammar_lesson_id uuid;
  v1 uuid;
  v2 uuid;
  v3 uuid;
  k1 uuid;
  k2 uuid;
  g1 uuid;
  g2 uuid;
begin
  select r.id into foothills_region_id
  from public.regions r
  where r.slug = 'foothills'
  limit 1;

  select u.id into base_unit_id
  from public.units u
  where u.region_id = foothills_region_id
    and u.name = 'Base Camp'
  limit 1;

  if base_unit_id is null then
    return;
  end if;

  insert into public.vocabulary (kana, meaning, part_of_speech, jlpt_level, difficulty, status)
  select 'こんにちは', 'Hello', 'expression', 'n5', 1, 'published'
  where not exists (select 1 from public.vocabulary where kana = 'こんにちは');

  insert into public.vocabulary (kana, meaning, part_of_speech, jlpt_level, difficulty, status)
  select 'ありがとう', 'Thank you', 'expression', 'n5', 1, 'published'
  where not exists (select 1 from public.vocabulary where kana = 'ありがとう');

  insert into public.vocabulary (kana, meaning, part_of_speech, jlpt_level, difficulty, status)
  select 'さようなら', 'Goodbye', 'expression', 'n5', 1, 'published'
  where not exists (select 1 from public.vocabulary where kana = 'さようなら');

  select id into v1 from public.vocabulary where kana = 'こんにちは' limit 1;
  select id into v2 from public.vocabulary where kana = 'ありがとう' limit 1;
  select id into v3 from public.vocabulary where kana = 'さようなら' limit 1;

  insert into public.kanji (character, meaning, jlpt_level, stroke_count, status)
  values
    ('人', 'person', 'n5', 2, 'published'),
    ('日', 'day / sun', 'n5', 4, 'published')
  on conflict (character) do nothing;

  select id into k1 from public.kanji where character = '人' limit 1;
  select id into k2 from public.kanji where character = '日' limit 1;

  if k1 is not null and not exists (
    select 1 from public.kanji_readings where kanji_id = k1
  ) then
    insert into public.kanji_readings (kanji_id, reading, reading_type)
    values
      (k1, 'ジン', 'onyomi'),
      (k1, 'ニン', 'onyomi'),
      (k1, 'ひと', 'kunyomi');
  end if;

  if k2 is not null and not exists (
    select 1 from public.kanji_readings where kanji_id = k2
  ) then
    insert into public.kanji_readings (kanji_id, reading, reading_type)
    values
      (k2, 'ニチ', 'onyomi'),
      (k2, 'ジツ', 'onyomi'),
      (k2, 'ひ', 'kunyomi'),
      (k2, 'か', 'kunyomi');
  end if;

  insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
  select
    'は (wa)',
    'Topic marker particle',
    'Marks the topic of a sentence. Pronounced "wa" when used as a particle.',
    'n5',
    1,
    'published'
  where not exists (select 1 from public.grammar_points where title = 'は (wa)');

  insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
  select
    'です',
    'Polite copula (is / am / are)',
    'Used at the end of polite sentences to state what something is.',
    'n5',
    1,
    'published'
  where not exists (select 1 from public.grammar_points where title = 'です');

  select id into g1 from public.grammar_points where title = 'は (wa)' limit 1;
  select id into g2 from public.grammar_points where title = 'です' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select base_unit_id, 'vocabulary', 'Greetings', 'Learn essential Japanese greetings.', 1, 10, 5, 'published'
  where not exists (
    select 1 from public.lessons
    where unit_id = base_unit_id and title = 'Greetings'
  );

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select base_unit_id, 'kanji', 'Essential Kanji', 'Meet your first kanji characters.', 1, 10, 5, 'published'
  where not exists (
    select 1 from public.lessons
    where unit_id = base_unit_id and title = 'Essential Kanji'
  );

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select base_unit_id, 'grammar', 'First Sentences', 'Build your first sentence patterns.', 1, 10, 5, 'published'
  where not exists (
    select 1 from public.lessons
    where unit_id = base_unit_id and title = 'First Sentences'
  );

  select id into vocab_lesson_id
  from public.lessons
  where unit_id = base_unit_id and title = 'Greetings'
  limit 1;

  select id into kanji_lesson_id
  from public.lessons
  where unit_id = base_unit_id and title = 'Essential Kanji'
  limit 1;

  select id into grammar_lesson_id
  from public.lessons
  where unit_id = base_unit_id and title = 'First Sentences'
  limit 1;

  if vocab_lesson_id is not null and v1 is not null then
    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select vocab_lesson_id, 'vocabulary', v1, 0
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = vocab_lesson_id and content_id = v1
    );

    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select vocab_lesson_id, 'vocabulary', v2, 1
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = vocab_lesson_id and content_id = v2
    );

    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select vocab_lesson_id, 'vocabulary', v3, 2
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = vocab_lesson_id and content_id = v3
    );
  end if;

  if kanji_lesson_id is not null and k1 is not null then
    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select kanji_lesson_id, 'kanji', k1, 0
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = kanji_lesson_id and content_id = k1
    );

    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select kanji_lesson_id, 'kanji', k2, 1
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = kanji_lesson_id and content_id = k2
    );
  end if;

  if grammar_lesson_id is not null and g1 is not null then
    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select grammar_lesson_id, 'grammar', g1, 0
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = grammar_lesson_id and content_id = g1
    );

    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select grammar_lesson_id, 'grammar', g2, 1
    where not exists (
      select 1 from public.lesson_items
      where lesson_id = grammar_lesson_id and content_id = g2
    );
  end if;
end $$;
