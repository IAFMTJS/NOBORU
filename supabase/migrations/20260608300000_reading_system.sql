-- Phase 12: Reading system (stories, dialogs, comprehension questions, progress)

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  jlpt_level public.jlpt_level,
  difficulty integer not null default 1,
  estimated_read_time integer not null default 5,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.story_sections (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reading_questions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories (id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_option_index integer not null default 0,
  difficulty integer not null default 1,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dialogue_scenarios (
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

create table public.dialogue_nodes (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid not null references public.dialogue_scenarios (id) on delete cascade,
  speaker text not null,
  japanese_text text not null,
  romaji text,
  english text,
  node_type text not null default 'line'
    check (node_type in ('line', 'choice')),
  is_entry boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dialogue_choices (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.dialogue_nodes (id) on delete cascade,
  choice_text text not null,
  next_node_id uuid references public.dialogue_nodes (id) on delete set null,
  is_correct boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null check (content_type in ('story', 'dialogue')),
  content_id uuid not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  score integer not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create index stories_status_idx on public.stories (status);
create index story_sections_story_id_idx on public.story_sections (story_id);
create index reading_questions_story_id_idx on public.reading_questions (story_id);
create index dialogue_scenarios_status_idx on public.dialogue_scenarios (status);
create index dialogue_nodes_scenario_id_idx on public.dialogue_nodes (scenario_id);
create index dialogue_choices_node_id_idx on public.dialogue_choices (node_id);
create index reading_progress_user_idx on public.reading_progress (user_id, content_type);

create trigger stories_set_updated_at
  before update on public.stories
  for each row execute function public.set_updated_at();

create trigger story_sections_set_updated_at
  before update on public.story_sections
  for each row execute function public.set_updated_at();

create trigger reading_questions_set_updated_at
  before update on public.reading_questions
  for each row execute function public.set_updated_at();

create trigger dialogue_scenarios_set_updated_at
  before update on public.dialogue_scenarios
  for each row execute function public.set_updated_at();

create trigger dialogue_nodes_set_updated_at
  before update on public.dialogue_nodes
  for each row execute function public.set_updated_at();

create trigger dialogue_choices_set_updated_at
  before update on public.dialogue_choices
  for each row execute function public.set_updated_at();

create trigger reading_progress_set_updated_at
  before update on public.reading_progress
  for each row execute function public.set_updated_at();

alter table public.stories enable row level security;
alter table public.story_sections enable row level security;
alter table public.reading_questions enable row level security;
alter table public.dialogue_scenarios enable row level security;
alter table public.dialogue_nodes enable row level security;
alter table public.dialogue_choices enable row level security;
alter table public.reading_progress enable row level security;

create policy "Authenticated users read published stories"
  on public.stories for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage stories"
  on public.stories for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published story sections"
  on public.story_sections for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage story sections"
  on public.story_sections for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published reading questions"
  on public.reading_questions for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage reading questions"
  on public.reading_questions for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published dialogue scenarios"
  on public.dialogue_scenarios for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage dialogue scenarios"
  on public.dialogue_scenarios for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published dialogue nodes"
  on public.dialogue_nodes for select
  using (
    auth.uid() is not null
    and exists (
      select 1
      from public.dialogue_scenarios s
      where s.id = scenario_id
        and (s.status = 'published' or public.is_content_admin())
    )
  );

create policy "Content admins manage dialogue nodes"
  on public.dialogue_nodes for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published dialogue choices"
  on public.dialogue_choices for select
  using (
    auth.uid() is not null
    and exists (
      select 1
      from public.dialogue_nodes n
      inner join public.dialogue_scenarios s on s.id = n.scenario_id
      where n.id = node_id
        and (s.status = 'published' or public.is_content_admin())
    )
  );

create policy "Content admins manage dialogue choices"
  on public.dialogue_choices for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own reading progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "Users insert own reading progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own reading progress"
  on public.reading_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.lesson_items
  drop constraint if exists lesson_items_content_type_check;

alter table public.lesson_items
  add constraint lesson_items_content_type_check
  check (content_type in (
    'vocabulary', 'kanji', 'grammar', 'hiragana', 'katakana', 'reading', 'story', 'dialogue'
  ));

-- Seed N5 stories
insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Tanaka''s Morning',
  'tanaka-morning',
  'Follow Tanaka through a simple weekday morning.',
  'n5'::public.jlpt_level,
  1,
  3,
  'published'
where not exists (select 1 from public.stories where slug = 'tanaka-morning');

insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'First Day at School',
  'first-day-school',
  'Yuki arrives at school and meets her classmates.',
  'n5'::public.jlpt_level,
  1,
  4,
  'published'
where not exists (select 1 from public.stories where slug = 'first-day-school');

insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Weekend Plans',
  'weekend-plans',
  'Ken and Sato discuss what to do on Saturday.',
  'n5'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'weekend-plans');

do $story_sections$
#variable_conflict use_variable
declare
  story_id uuid;
begin
  select id into story_id from public.stories where slug = 'tanaka-morning' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('田中さんは 朝 六時に 起きます。', 'Tanaka-san wa asa rokuji ni okimasu.', 'Tanaka wakes up at six in the morning.', 0),
        ('朝ごはんを 食べて、コーヒーを のみます。', 'Asagohan o tabete, koohii o nomimasu.', 'He eats breakfast and drinks coffee.', 1),
        ('八時に 家を 出て、電車で 会社へ 行きます。', 'Hachiji ni ie o dete, densha de kaisha e ikimasu.', 'At eight he leaves home and goes to work by train.', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'first-day-school' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('ゆきさんは 今日 学校へ 行きます。', 'Yuki-san wa kyou gakkou e ikimasu.', 'Yuki goes to school today.', 0),
        ('教室で 新しい 友だちに 会います。', 'Kyoushitsu de atarashii tomodachi ni aimasu.', 'In the classroom she meets new friends.', 1),
        ('「はじめまして。ゆきです。」', 'Hajimemashite. Yuki desu.', '"Nice to meet you. I am Yuki."', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'weekend-plans' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('土曜日、けんさんと さとさんは 会います。', 'Doyoubi, Ken-san to Sato-san wa aimasu.', 'On Saturday Ken and Sato meet.', 0),
        ('「えいがを 見ませんか。」', 'Eiga o mimasen ka.', '"Shall we watch a movie?"', 1),
        ('「いいですね。レストランも 行きましょう。」', 'Ii desu ne. Resutoran mo ikimashou.', '"Sounds good. Let us go to a restaurant too."', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );
  end if;
end;
$story_sections$;

do $reading_questions$
#variable_conflict use_variable
declare
  story_id uuid;
begin
  select id into story_id from public.stories where slug = 'tanaka-morning' limit 1;
  if story_id is not null then
    insert into public.reading_questions (story_id, question, options, correct_option_index, order_index, status)
    select story_id, v.question, v.options::jsonb, v.correct_option_index, v.order_index, 'published'
    from (
      values
        ('What time does Tanaka wake up?', '["Six o''clock", "Seven o''clock", "Eight o''clock", "Nine o''clock"]', 0, 0),
        ('How does Tanaka go to work?', '["By train", "By bus", "By car", "On foot"]', 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'first-day-school' limit 1;
  if story_id is not null then
    insert into public.reading_questions (story_id, question, options, correct_option_index, order_index, status)
    select story_id, v.question, v.options::jsonb, v.correct_option_index, v.order_index, 'published'
    from (
      values
        ('Where does Yuki meet new friends?', '["In the classroom", "At home", "In the library", "On the train"]', 0, 0),
        ('What does Yuki say when introducing herself?', '["Nice to meet you. I am Yuki.", "Goodbye.", "Thank you.", "See you tomorrow."]', 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'weekend-plans' limit 1;
  if story_id is not null then
    insert into public.reading_questions (story_id, question, options, correct_option_index, order_index, status)
    select story_id, v.question, v.options::jsonb, v.correct_option_index, v.order_index, 'published'
    from (
      values
        ('When do Ken and Sato meet?', '["Saturday", "Sunday", "Monday", "Friday"]', 0, 0),
        ('What activity do they plan first?', '["Watch a movie", "Go shopping", "Study kanji", "Play games"]', 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
end;
$reading_questions$;

-- Seed dialogue scenarios
insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'At the Cafe',
  'cafe-order',
  'Order a drink politely at a Japanese cafe.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'cafe-order');

insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Meeting a Friend',
  'meeting-friend',
  'Greet a friend and make simple weekend plans.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'meeting-friend');

do $dialogue_seed$
#variable_conflict use_variable
declare
  scenario_id uuid;
  node_staff uuid;
  node_you uuid;
  node_staff2 uuid;
  node_friend uuid;
  node_you2 uuid;
  node_friend2 uuid;
begin
  select id into scenario_id from public.dialogue_scenarios where slug = 'cafe-order' limit 1;
  if scenario_id is not null and not exists (
    select 1 from public.dialogue_nodes where scenario_id = scenario_id limit 1
  ) then
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Staff',
      'いらっしゃいませ。ご注文は 何に なさいますか。',
      'Irasshaimase. Gochuumon wa nani ni nasaimasu ka.',
      'Welcome. What would you like to order?',
      'choice',
      true,
      0
    )
    returning id into node_staff;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'You',
      'コーヒーを ください。',
      'Koohii o kudasai.',
      'Coffee, please.',
      'line',
      false,
      1
    )
    returning id into node_you;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Staff',
      'はい、かしこまりました。少々 お待ちください。',
      'Hai, kashikomarimashita. Shoushou omachi kudasai.',
      'Certainly. Please wait a moment.',
      'line',
      false,
      2
    )
    returning id into node_staff2;

    insert into public.dialogue_choices (node_id, choice_text, next_node_id, is_correct, order_index)
    values
      (node_staff, 'コーヒーを ください。', node_you, true, 0),
      (node_staff, 'さようなら。', null, false, 1);
  end if;

  select id into scenario_id from public.dialogue_scenarios where slug = 'meeting-friend' limit 1;
  if scenario_id is not null and not exists (
    select 1 from public.dialogue_nodes where scenario_id = scenario_id limit 1
  ) then
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Friend',
      'こんにちは！ 元気ですか。',
      'Konnichiwa! Genki desu ka.',
      'Hello! How are you?',
      'line',
      true,
      0
    )
    returning id into node_friend;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'You',
      '元気です。ありがとう。',
      'Genki desu. Arigatou.',
      'I am fine. Thank you.',
      'choice',
      false,
      1
    )
    returning id into node_you2;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Friend',
      '土曜日、一緒に 映画を 見ませんか。',
      'Doyoubi, issho ni eiga o mimasen ka.',
      'Shall we watch a movie together on Saturday?',
      'line',
      false,
      2
    )
    returning id into node_friend2;

    insert into public.dialogue_choices (node_id, choice_text, next_node_id, is_correct, order_index)
    values
      (node_you2, 'はい、行きましょう。', node_friend2, true, 0),
      (node_you2, 'いいえ、忙しいです。', null, false, 1);
  end if;
end;
$dialogue_seed$;

-- Mount N5 reading unit
do $reading_unit$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  story_id uuid;
  dialogue_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Reading Comprehension', 'Stories and dialogs for N5 reading practice.', 15, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Reading Comprehension'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Reading Comprehension' limit 1;

  if unit_id is null then return; end if;

  for story_id in
    select id from public.stories where status = 'published' order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'story',
      s.title,
      'Read the story and answer comprehension questions.',
      s.difficulty,
      15,
      s.estimated_read_time,
      'published'
    from public.stories s
    where s.id = story_id
      and not exists (
        select 1 from public.lessons l
        where l.unit_id = unit_id and l.title = s.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.stories s on s.title = l.title
    where l.unit_id = unit_id and s.id = story_id
    limit 1;

    if lesson_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'story', story_id, 0
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'story' and content_id = story_id
      );
    end if;
  end loop;

  for dialogue_id in
    select id from public.dialogue_scenarios where status = 'published' order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'dialogue',
      d.title,
      'Practice a short conversation with choices.',
      d.difficulty,
      12,
      4,
      'published'
    from public.dialogue_scenarios d
    where d.id = dialogue_id
      and not exists (
        select 1 from public.lessons l
        where l.unit_id = unit_id and l.title = d.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.dialogue_scenarios d on d.title = l.title
    where l.unit_id = unit_id and d.id = dialogue_id
    limit 1;

    if lesson_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'dialogue', dialogue_id, 0
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'dialogue' and content_id = dialogue_id
      );
    end if;
  end loop;
end;
$reading_unit$;
