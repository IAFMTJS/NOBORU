-- Phase 13: Listening system (audio exercises, challenges, progress)

create table public.listening_exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  audio_url text,
  japanese_text text not null,
  romaji text,
  english text,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_option_index integer not null default 0,
  jlpt_level public.jlpt_level,
  difficulty integer not null default 1,
  estimated_duration integer not null default 3,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listening_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  jlpt_level public.jlpt_level,
  difficulty integer not null default 1,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listening_challenge_items (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.listening_challenges (id) on delete cascade,
  exercise_id uuid not null references public.listening_exercises (id) on delete cascade,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (challenge_id, exercise_id)
);

create table public.listening_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null check (content_type in ('exercise', 'challenge')),
  content_id uuid not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  score integer not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create index listening_exercises_status_idx on public.listening_exercises (status);
create index listening_challenges_status_idx on public.listening_challenges (status);
create index listening_challenge_items_challenge_id_idx
  on public.listening_challenge_items (challenge_id);
create index listening_progress_user_idx on public.listening_progress (user_id, content_type);

create trigger listening_exercises_set_updated_at
  before update on public.listening_exercises
  for each row execute function public.set_updated_at();

create trigger listening_challenges_set_updated_at
  before update on public.listening_challenges
  for each row execute function public.set_updated_at();

create trigger listening_challenge_items_set_updated_at
  before update on public.listening_challenge_items
  for each row execute function public.set_updated_at();

create trigger listening_progress_set_updated_at
  before update on public.listening_progress
  for each row execute function public.set_updated_at();

alter table public.listening_exercises enable row level security;
alter table public.listening_challenges enable row level security;
alter table public.listening_challenge_items enable row level security;
alter table public.listening_progress enable row level security;

create policy "Authenticated users read published listening exercises"
  on public.listening_exercises for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage listening exercises"
  on public.listening_exercises for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published listening challenges"
  on public.listening_challenges for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage listening challenges"
  on public.listening_challenges for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published listening challenge items"
  on public.listening_challenge_items for select
  using (
    auth.uid() is not null
    and exists (
      select 1
      from public.listening_challenges c
      where c.id = challenge_id
        and (c.status = 'published' or public.is_content_admin())
    )
  );

create policy "Content admins manage listening challenge items"
  on public.listening_challenge_items for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own listening progress"
  on public.listening_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own listening progress"
  on public.listening_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own listening progress"
  on public.listening_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.lesson_items
  drop constraint if exists lesson_items_content_type_check;

alter table public.lesson_items
  add constraint lesson_items_content_type_check
  check (content_type in (
    'vocabulary', 'kanji', 'grammar', 'hiragana', 'katakana', 'reading',
    'story', 'dialogue', 'listening', 'listening_challenge'
  ));

-- Seed N5 listening exercises
insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Greeting a Friend',
  'greeting-friend',
  'こんにちは。元気ですか。',
  'Konnichiwa. Genki desu ka.',
  'Hello. How are you?',
  'What is the speaker asking?',
  '["How are you?", "What is your name?", "Where do you live?", "What time is it?"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'greeting-friend');

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Self Introduction',
  'self-introduction',
  'はじめまして。田中です。どうぞ よろしく。',
  'Hajimemashite. Tanaka desu. Douzo yoroshiku.',
  'Nice to meet you. I am Tanaka. Pleased to meet you.',
  'What is the speaker''s name?',
  '["Tanaka", "Sato", "Yuki", "Ken"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'self-introduction');

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'At the Shop',
  'at-the-shop',
  'すみません。これは いくら ですか。',
  'Sumimasen. Kore wa ikura desu ka.',
  'Excuse me. How much is this?',
  'What does the customer want to know?',
  '["The price", "The time", "The location", "The name"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'at-the-shop');

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Finding the Station',
  'finding-station',
  'すみません。駅は どこ ですか。',
  'Sumimasen. Eki wa doko desu ka.',
  'Excuse me. Where is the station?',
  'What place is the speaker looking for?',
  '["The station", "The school", "The hospital", "The restaurant"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'finding-station');

insert into public.listening_challenges (
  title, slug, description, jlpt_level, difficulty, status
)
select
  'Daily Conversations',
  'daily-conversations',
  'Listen to three short N5 conversations in a row.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.listening_challenges where slug = 'daily-conversations');

do $challenge_items$
#variable_conflict use_variable
declare
  challenge_id uuid;
  exercise_id uuid;
  exercise_slugs text[] := array['greeting-friend', 'self-introduction', 'at-the-shop'];
  slug_value text;
  item_index integer := 0;
begin
  select id into challenge_id from public.listening_challenges
  where slug = 'daily-conversations' limit 1;

  if challenge_id is null then return; end if;

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
end;
$challenge_items$;

-- Mount N5 listening unit
do $listening_unit$
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

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Listening Practice', 'Audio lessons and listening challenges for N5.', 16, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Listening Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Listening Practice' limit 1;

  if unit_id is null then return; end if;

  for exercise_id in
    select id from public.listening_exercises where status = 'published' order by title
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
    select id from public.listening_challenges where status = 'published' order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'listening_challenge',
      c.title,
      'Complete a multi-part listening challenge.',
      c.difficulty,
      20,
      8,
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
$listening_unit$;
