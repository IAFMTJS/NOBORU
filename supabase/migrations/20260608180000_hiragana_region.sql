-- Phase 6: Hiragana region content, reading exercises, and review items

create type public.review_state as enum (
  'new',
  'learning',
  'good',
  'strong',
  'mastered',
  'legendary'
);

create table public.hiragana (
  id uuid primary key default gen_random_uuid(),
  character text not null unique,
  romaji text not null,
  row_name text not null,
  row_label text not null,
  order_index integer not null default 0,
  variant_type text not null default 'base'
    check (variant_type in ('base', 'dakuten', 'handakuten', 'combo')),
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reading_exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  japanese_text text not null,
  romaji text,
  english text,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_option_index integer not null default 0,
  difficulty integer not null default 1,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content_type text not null
    check (content_type in ('vocabulary', 'kanji', 'grammar', 'hiragana', 'reading')),
  content_id uuid not null,
  state public.review_state not null default 'new',
  next_review_at timestamptz not null default now(),
  review_count integer not null default 0,
  mastery_score integer not null default 0
    check (mastery_score >= 0 and mastery_score <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

alter table public.lesson_items
  drop constraint if exists lesson_items_content_type_check;

alter table public.lesson_items
  add constraint lesson_items_content_type_check
  check (content_type in ('vocabulary', 'kanji', 'grammar', 'hiragana', 'reading'));

create index hiragana_row_name_idx on public.hiragana (row_name);
create index hiragana_status_idx on public.hiragana (status);
create index reading_exercises_status_idx on public.reading_exercises (status);
create index review_items_user_due_idx on public.review_items (user_id, next_review_at);
create index review_items_content_idx on public.review_items (content_type, content_id);

create trigger hiragana_set_updated_at
  before update on public.hiragana
  for each row execute function public.set_updated_at();

create trigger reading_exercises_set_updated_at
  before update on public.reading_exercises
  for each row execute function public.set_updated_at();

create trigger review_items_set_updated_at
  before update on public.review_items
  for each row execute function public.set_updated_at();

alter table public.hiragana enable row level security;
alter table public.reading_exercises enable row level security;
alter table public.review_items enable row level security;

create policy "Authenticated users read published hiragana"
  on public.hiragana for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage hiragana"
  on public.hiragana for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Authenticated users read published reading exercises"
  on public.reading_exercises for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage reading exercises"
  on public.reading_exercises for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

create policy "Users read own review items"
  on public.review_items for select
  using (auth.uid() = user_id);

create policy "Users insert own review items"
  on public.review_items for insert
  with check (auth.uid() = user_id);

create policy "Users update own review items"
  on public.review_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed hiragana catalog (104 characters)
insert into public.hiragana (character, romaji, row_name, row_label, order_index, variant_type, status)
select v.character, v.romaji, v.row_name, v.row_label, v.order_index, v.variant_type, 'published'
from (
  values
    ('あ', 'a', 'a', 'A row (あ行)', 0, 'base'),
    ('い', 'i', 'a', 'A row (あ行)', 1, 'base'),
    ('う', 'u', 'a', 'A row (あ行)', 2, 'base'),
    ('え', 'e', 'a', 'A row (あ行)', 3, 'base'),
    ('お', 'o', 'a', 'A row (あ行)', 4, 'base'),
    ('か', 'ka', 'ka', 'Ka row (か行)', 5, 'base'),
    ('き', 'ki', 'ka', 'Ka row (か行)', 6, 'base'),
    ('く', 'ku', 'ka', 'Ka row (か行)', 7, 'base'),
    ('け', 'ke', 'ka', 'Ka row (か行)', 8, 'base'),
    ('こ', 'ko', 'ka', 'Ka row (か行)', 9, 'base'),
    ('さ', 'sa', 'sa', 'Sa row (さ行)', 10, 'base'),
    ('し', 'shi', 'sa', 'Sa row (さ行)', 11, 'base'),
    ('す', 'su', 'sa', 'Sa row (さ行)', 12, 'base'),
    ('せ', 'se', 'sa', 'Sa row (さ行)', 13, 'base'),
    ('そ', 'so', 'sa', 'Sa row (さ行)', 14, 'base'),
    ('た', 'ta', 'ta', 'Ta row (た行)', 15, 'base'),
    ('ち', 'chi', 'ta', 'Ta row (た行)', 16, 'base'),
    ('つ', 'tsu', 'ta', 'Ta row (た行)', 17, 'base'),
    ('て', 'te', 'ta', 'Ta row (た行)', 18, 'base'),
    ('と', 'to', 'ta', 'Ta row (た行)', 19, 'base'),
    ('な', 'na', 'na', 'Na row (な行)', 20, 'base'),
    ('に', 'ni', 'na', 'Na row (な行)', 21, 'base'),
    ('ぬ', 'nu', 'na', 'Na row (な行)', 22, 'base'),
    ('ね', 'ne', 'na', 'Na row (な行)', 23, 'base'),
    ('の', 'no', 'na', 'Na row (な行)', 24, 'base'),
    ('は', 'ha', 'ha', 'Ha row (は行)', 25, 'base'),
    ('ひ', 'hi', 'ha', 'Ha row (は行)', 26, 'base'),
    ('ふ', 'fu', 'ha', 'Ha row (は行)', 27, 'base'),
    ('へ', 'he', 'ha', 'Ha row (は行)', 28, 'base'),
    ('ほ', 'ho', 'ha', 'Ha row (は行)', 29, 'base'),
    ('ま', 'ma', 'ma', 'Ma row (ま行)', 30, 'base'),
    ('み', 'mi', 'ma', 'Ma row (ま行)', 31, 'base'),
    ('む', 'mu', 'ma', 'Ma row (ま行)', 32, 'base'),
    ('め', 'me', 'ma', 'Ma row (ま行)', 33, 'base'),
    ('も', 'mo', 'ma', 'Ma row (ま行)', 34, 'base'),
    ('や', 'ya', 'ya', 'Ya row (や行)', 35, 'base'),
    ('ゆ', 'yu', 'ya', 'Ya row (や行)', 36, 'base'),
    ('よ', 'yo', 'ya', 'Ya row (や行)', 37, 'base'),
    ('ら', 'ra', 'ra', 'Ra row (ら行)', 38, 'base'),
    ('り', 'ri', 'ra', 'Ra row (ら行)', 39, 'base'),
    ('る', 'ru', 'ra', 'Ra row (ら行)', 40, 'base'),
    ('れ', 're', 'ra', 'Ra row (ら行)', 41, 'base'),
    ('ろ', 'ro', 'ra', 'Ra row (ら行)', 42, 'base'),
    ('わ', 'wa', 'wa', 'Wa row (わ行)', 43, 'base'),
    ('を', 'wo', 'wa', 'Wa row (わ行)', 44, 'base'),
    ('ん', 'n', 'n', 'N (ん)', 45, 'base'),
    ('が', 'ga', 'voiced', 'Voiced (濁音)', 46, 'dakuten'),
    ('ぎ', 'gi', 'voiced', 'Voiced (濁音)', 47, 'dakuten'),
    ('ぐ', 'gu', 'voiced', 'Voiced (濁音)', 48, 'dakuten'),
    ('げ', 'ge', 'voiced', 'Voiced (濁音)', 49, 'dakuten'),
    ('ご', 'go', 'voiced', 'Voiced (濁音)', 50, 'dakuten'),
    ('ざ', 'za', 'voiced', 'Voiced (濁音)', 51, 'dakuten'),
    ('じ', 'ji', 'voiced', 'Voiced (濁音)', 52, 'dakuten'),
    ('ず', 'zu', 'voiced', 'Voiced (濁音)', 53, 'dakuten'),
    ('ぜ', 'ze', 'voiced', 'Voiced (濁音)', 54, 'dakuten'),
    ('ぞ', 'zo', 'voiced', 'Voiced (濁音)', 55, 'dakuten'),
    ('だ', 'da', 'voiced', 'Voiced (濁音)', 56, 'dakuten'),
    ('ぢ', 'ji', 'voiced', 'Voiced (濁音)', 57, 'dakuten'),
    ('づ', 'zu', 'voiced', 'Voiced (濁音)', 58, 'dakuten'),
    ('で', 'de', 'voiced', 'Voiced (濁音)', 59, 'dakuten'),
    ('ど', 'do', 'voiced', 'Voiced (濁音)', 60, 'dakuten'),
    ('ば', 'ba', 'voiced', 'Voiced (濁音)', 61, 'dakuten'),
    ('び', 'bi', 'voiced', 'Voiced (濁音)', 62, 'dakuten'),
    ('ぶ', 'bu', 'voiced', 'Voiced (濁音)', 63, 'dakuten'),
    ('べ', 'be', 'voiced', 'Voiced (濁音)', 64, 'dakuten'),
    ('ぼ', 'bo', 'voiced', 'Voiced (濁音)', 65, 'dakuten'),
    ('ぱ', 'pa', 'semiVoiced', 'Semi-voiced (半濁音)', 66, 'handakuten'),
    ('ぴ', 'pi', 'semiVoiced', 'Semi-voiced (半濁音)', 67, 'handakuten'),
    ('ぷ', 'pu', 'semiVoiced', 'Semi-voiced (半濁音)', 68, 'handakuten'),
    ('ぺ', 'pe', 'semiVoiced', 'Semi-voiced (半濁音)', 69, 'handakuten'),
    ('ぽ', 'po', 'semiVoiced', 'Semi-voiced (半濁音)', 70, 'handakuten'),
    ('きゃ', 'kya', 'combo', 'Combinations (拗音)', 71, 'combo'),
    ('きゅ', 'kyu', 'combo', 'Combinations (拗音)', 72, 'combo'),
    ('きょ', 'kyo', 'combo', 'Combinations (拗音)', 73, 'combo'),
    ('しゃ', 'sha', 'combo', 'Combinations (拗音)', 74, 'combo'),
    ('しゅ', 'shu', 'combo', 'Combinations (拗音)', 75, 'combo'),
    ('しょ', 'sho', 'combo', 'Combinations (拗音)', 76, 'combo'),
    ('ちゃ', 'cha', 'combo', 'Combinations (拗音)', 77, 'combo'),
    ('ちゅ', 'chu', 'combo', 'Combinations (拗音)', 78, 'combo'),
    ('ちょ', 'cho', 'combo', 'Combinations (拗音)', 79, 'combo'),
    ('にゃ', 'nya', 'combo', 'Combinations (拗音)', 80, 'combo'),
    ('にゅ', 'nyu', 'combo', 'Combinations (拗音)', 81, 'combo'),
    ('にょ', 'nyo', 'combo', 'Combinations (拗音)', 82, 'combo'),
    ('ひゃ', 'hya', 'combo', 'Combinations (拗音)', 83, 'combo'),
    ('ひゅ', 'hyu', 'combo', 'Combinations (拗音)', 84, 'combo'),
    ('ひょ', 'hyo', 'combo', 'Combinations (拗音)', 85, 'combo'),
    ('みゃ', 'mya', 'combo', 'Combinations (拗音)', 86, 'combo'),
    ('みゅ', 'myu', 'combo', 'Combinations (拗音)', 87, 'combo'),
    ('みょ', 'myo', 'combo', 'Combinations (拗音)', 88, 'combo'),
    ('りゃ', 'rya', 'combo', 'Combinations (拗音)', 89, 'combo'),
    ('りゅ', 'ryu', 'combo', 'Combinations (拗音)', 90, 'combo'),
    ('りょ', 'ryo', 'combo', 'Combinations (拗音)', 91, 'combo'),
    ('ぎゃ', 'gya', 'combo', 'Combinations (拗音)', 92, 'combo'),
    ('ぎゅ', 'gyu', 'combo', 'Combinations (拗音)', 93, 'combo'),
    ('ぎょ', 'gyo', 'combo', 'Combinations (拗音)', 94, 'combo'),
    ('じゃ', 'ja', 'combo', 'Combinations (拗音)', 95, 'combo'),
    ('じゅ', 'ju', 'combo', 'Combinations (拗音)', 96, 'combo'),
    ('じょ', 'jo', 'combo', 'Combinations (拗音)', 97, 'combo'),
    ('びゃ', 'bya', 'combo', 'Combinations (拗音)', 98, 'combo'),
    ('びゅ', 'byu', 'combo', 'Combinations (拗音)', 99, 'combo'),
    ('びょ', 'byo', 'combo', 'Combinations (拗音)', 100, 'combo'),
    ('ぴゃ', 'pya', 'combo', 'Combinations (拗音)', 101, 'combo'),
    ('ぴゅ', 'pyu', 'combo', 'Combinations (拗音)', 102, 'combo'),
    ('ぴょ', 'pyo', 'combo', 'Combinations (拗音)', 103, 'combo')
) as v(character, romaji, row_name, row_label, order_index, variant_type)
where not exists (
  select 1 from public.hiragana h where h.character = v.character
);

-- Seed reading exercises
insert into public.reading_exercises (
  title,
  japanese_text,
  romaji,
  english,
  question,
  options,
  correct_option_index,
  status
)
select
  'Morning Routine',
  'あさ ごはん を たべます。',
  'asa gohan o tabemasu.',
  'I eat breakfast.',
  'What does あさ (asa) mean?',
  '["morning", "evening", "night", "afternoon"]'::jsonb,
  0,
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Morning Routine'
);

insert into public.reading_exercises (
  title,
  japanese_text,
  romaji,
  english,
  question,
  options,
  correct_option_index,
  status
)
select
  'Studying Japanese',
  'わたし は にほんご を べんきょう します。',
  'watashi wa nihongo o benkyou shimasu.',
  'I study Japanese.',
  'What language is being studied?',
  '["Japanese", "English", "French", "Korean"]'::jsonb,
  0,
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Studying Japanese'
);

insert into public.reading_exercises (
  title,
  japanese_text,
  romaji,
  english,
  question,
  options,
  correct_option_index,
  status
)
select
  'Meeting a Friend',
  'ともだち に あいます。',
  'tomodachi ni aimasu.',
  'I meet a friend.',
  'Who is being met?',
  '["A friend", "A teacher", "A doctor", "A stranger"]'::jsonb,
  0,
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Meeting a Friend'
);

-- Seed hiragana curriculum under Foothills
do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  reading_id uuid;
  h_id uuid;
  row_names text[];
  row_name text;
  lesson_titles text[] := array[
    'A Row + ん',
    'Ka Row',
    'Sa Row',
    'Ta Row',
    'Na Row',
    'Ha Row',
    'Ma Row',
    'Ya Row',
    'Ra Row',
    'Wa Row',
    'Voiced Hiragana',
    'Semi-voiced Hiragana',
    'Combination Hiragana'
  ];
  row_group_keys text[] := array[
    'a,n',
    'ka',
    'sa',
    'ta',
    'na',
    'ha',
    'ma',
    'ya',
    'ra',
    'wa',
    'voiced',
    'semiVoiced',
    'combo'
  ];
  idx integer;
begin
  select id into region_id from public.regions where slug = 'foothills' limit 1;
  if region_id is null then
    return;
  end if;

  -- Unit: Hiragana Part I
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Hiragana Part I', 'Vowels through the S row.', 1, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Part I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Part I' limit 1;

  for idx in 1..3 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'hiragana', lesson_titles[idx], 'Learn and practice hiragana characters.', 1, 10, 5, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.hiragana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'hiragana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'hiragana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Hiragana Part II
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Hiragana Part II', 'T row through the W row.', 2, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Part II'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Part II' limit 1;

  for idx in 4..10 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'hiragana', lesson_titles[idx], 'Learn and practice hiragana characters.', 1, 10, 5, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.hiragana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'hiragana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'hiragana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Hiragana Advanced
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Hiragana Advanced', 'Voiced, semi-voiced, and combination hiragana.', 3, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Advanced'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Advanced' limit 1;

  for idx in 11..13 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'hiragana', lesson_titles[idx], 'Learn and practice hiragana characters.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.hiragana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'hiragana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'hiragana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Hiragana Reading
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Hiragana Reading', 'Read short hiragana passages.', 4, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Reading'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Reading' limit 1;

  for reading_id in
    select id from public.reading_exercises where status = 'published' order by title
  loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'reading',
      r.title,
      'Read and comprehend a short hiragana passage.',
      1,
      15,
      5,
      'published'
    from public.reading_exercises r
    where r.id = reading_id
      and not exists (
        select 1 from public.lessons l
        where l.unit_id = unit_id and l.title = r.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.reading_exercises r on r.title = l.title
    where l.unit_id = unit_id and r.id = reading_id
    limit 1;

    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select lesson_id, 'reading', reading_id, 0
    where lesson_id is not null
      and not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'reading' and content_id = reading_id
      );
  end loop;

  -- Unit: Hiragana Practice (mixed review lesson)
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Hiragana Practice', 'Mixed practice across all hiragana.', 5, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Hiragana Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Hiragana Practice' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id, 'practice', 'Hiragana Mastery Check', 'Mixed recall across the hiragana you have learned.', 2, 20, 8, 'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Hiragana Mastery Check'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Hiragana Mastery Check' limit 1;

  for h_id in
    select distinct on (row_name) id
    from public.hiragana
    where status = 'published'
      and variant_type = 'base'
      and row_name in ('a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa')
    order by row_name, order_index
  loop
    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select lesson_id, 'hiragana', h_id, (
      select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
    )
    where lesson_id is not null
      and not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'hiragana' and content_id = h_id
      );
  end loop;
end $seed$;
