-- Phase 7: Katakana region (Forest Trail)

create table public.katakana (
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

alter table public.reading_exercises
  add column if not exists script text not null default 'hiragana'
    check (script in ('hiragana', 'katakana'));

alter table public.lesson_items
  drop constraint if exists lesson_items_content_type_check;

alter table public.lesson_items
  add constraint lesson_items_content_type_check
  check (content_type in ('vocabulary', 'kanji', 'grammar', 'hiragana', 'katakana', 'reading'));

alter table public.review_items
  drop constraint if exists review_items_content_type_check;

alter table public.review_items
  add constraint review_items_content_type_check
  check (content_type in ('vocabulary', 'kanji', 'grammar', 'hiragana', 'katakana', 'reading'));

create index katakana_row_name_idx on public.katakana (row_name);
create index katakana_status_idx on public.katakana (status);

create trigger katakana_set_updated_at
  before update on public.katakana
  for each row execute function public.set_updated_at();

alter table public.katakana enable row level security;

create policy "Authenticated users read published katakana"
  on public.katakana for select
  using (auth.uid() is not null and (status = 'published' or public.is_content_admin()));

create policy "Content admins manage katakana"
  on public.katakana for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.regions (slug, name, description, order_index, status)
select
  'forest-trail',
  'Forest Trail',
  'The canopy path. Master katakana for loanwords and modern Japanese.',
  1,
  'published'
where not exists (
  select 1 from public.regions where slug = 'forest-trail'
);

insert into public.katakana (character, romaji, row_name, row_label, order_index, variant_type, status)
select v.character, v.romaji, v.row_name, v.row_label, v.order_index, v.variant_type, 'published'
from (
  values
    ('ア', 'a', 'a', 'A row (ア行)', 0, 'base'),
    ('イ', 'i', 'a', 'A row (ア行)', 1, 'base'),
    ('ウ', 'u', 'a', 'A row (ア行)', 2, 'base'),
    ('エ', 'e', 'a', 'A row (ア行)', 3, 'base'),
    ('オ', 'o', 'a', 'A row (ア行)', 4, 'base'),
    ('カ', 'ka', 'ka', 'Ka row (カ行)', 5, 'base'),
    ('キ', 'ki', 'ka', 'Ka row (カ行)', 6, 'base'),
    ('ク', 'ku', 'ka', 'Ka row (カ行)', 7, 'base'),
    ('ケ', 'ke', 'ka', 'Ka row (カ行)', 8, 'base'),
    ('コ', 'ko', 'ka', 'Ka row (カ行)', 9, 'base'),
    ('サ', 'sa', 'sa', 'Sa row (サ行)', 10, 'base'),
    ('シ', 'shi', 'sa', 'Sa row (サ行)', 11, 'base'),
    ('ス', 'su', 'sa', 'Sa row (サ行)', 12, 'base'),
    ('セ', 'se', 'sa', 'Sa row (サ行)', 13, 'base'),
    ('ソ', 'so', 'sa', 'Sa row (サ行)', 14, 'base'),
    ('タ', 'ta', 'ta', 'Ta row (タ行)', 15, 'base'),
    ('チ', 'chi', 'ta', 'Ta row (タ行)', 16, 'base'),
    ('ツ', 'tsu', 'ta', 'Ta row (タ行)', 17, 'base'),
    ('テ', 'te', 'ta', 'Ta row (タ行)', 18, 'base'),
    ('ト', 'to', 'ta', 'Ta row (タ行)', 19, 'base'),
    ('ナ', 'na', 'na', 'Na row (ナ行)', 20, 'base'),
    ('ニ', 'ni', 'na', 'Na row (ナ行)', 21, 'base'),
    ('ヌ', 'nu', 'na', 'Na row (ナ行)', 22, 'base'),
    ('ネ', 'ne', 'na', 'Na row (ナ行)', 23, 'base'),
    ('ノ', 'no', 'na', 'Na row (ナ行)', 24, 'base'),
    ('ハ', 'ha', 'ha', 'Ha row (ハ行)', 25, 'base'),
    ('ヒ', 'hi', 'ha', 'Ha row (ハ行)', 26, 'base'),
    ('フ', 'fu', 'ha', 'Ha row (ハ行)', 27, 'base'),
    ('ヘ', 'he', 'ha', 'Ha row (ハ行)', 28, 'base'),
    ('ホ', 'ho', 'ha', 'Ha row (ハ行)', 29, 'base'),
    ('マ', 'ma', 'ma', 'Ma row (マ行)', 30, 'base'),
    ('ミ', 'mi', 'ma', 'Ma row (マ行)', 31, 'base'),
    ('ム', 'mu', 'ma', 'Ma row (マ行)', 32, 'base'),
    ('メ', 'me', 'ma', 'Ma row (マ行)', 33, 'base'),
    ('モ', 'mo', 'ma', 'Ma row (マ行)', 34, 'base'),
    ('ヤ', 'ya', 'ya', 'Ya row (ヤ行)', 35, 'base'),
    ('ユ', 'yu', 'ya', 'Ya row (ヤ行)', 36, 'base'),
    ('ヨ', 'yo', 'ya', 'Ya row (ヤ行)', 37, 'base'),
    ('ラ', 'ra', 'ra', 'Ra row (ラ行)', 38, 'base'),
    ('リ', 'ri', 'ra', 'Ra row (ラ行)', 39, 'base'),
    ('ル', 'ru', 'ra', 'Ra row (ラ行)', 40, 'base'),
    ('レ', 're', 'ra', 'Ra row (ラ行)', 41, 'base'),
    ('ロ', 'ro', 'ra', 'Ra row (ラ行)', 42, 'base'),
    ('ワ', 'wa', 'wa', 'Wa row (ワ行)', 43, 'base'),
    ('ヲ', 'wo', 'wa', 'Wa row (ワ行)', 44, 'base'),
    ('ン', 'n', 'n', 'N (ン)', 45, 'base'),
    ('ガ', 'ga', 'voiced', 'Voiced (濁音)', 46, 'dakuten'),
    ('ギ', 'gi', 'voiced', 'Voiced (濁音)', 47, 'dakuten'),
    ('グ', 'gu', 'voiced', 'Voiced (濁音)', 48, 'dakuten'),
    ('ゲ', 'ge', 'voiced', 'Voiced (濁音)', 49, 'dakuten'),
    ('ゴ', 'go', 'voiced', 'Voiced (濁音)', 50, 'dakuten'),
    ('ザ', 'za', 'voiced', 'Voiced (濁音)', 51, 'dakuten'),
    ('ジ', 'ji', 'voiced', 'Voiced (濁音)', 52, 'dakuten'),
    ('ズ', 'zu', 'voiced', 'Voiced (濁音)', 53, 'dakuten'),
    ('ゼ', 'ze', 'voiced', 'Voiced (濁音)', 54, 'dakuten'),
    ('ゾ', 'zo', 'voiced', 'Voiced (濁音)', 55, 'dakuten'),
    ('ダ', 'da', 'voiced', 'Voiced (濁音)', 56, 'dakuten'),
    ('ヂ', 'ji', 'voiced', 'Voiced (濁音)', 57, 'dakuten'),
    ('ヅ', 'zu', 'voiced', 'Voiced (濁音)', 58, 'dakuten'),
    ('デ', 'de', 'voiced', 'Voiced (濁音)', 59, 'dakuten'),
    ('ド', 'do', 'voiced', 'Voiced (濁音)', 60, 'dakuten'),
    ('バ', 'ba', 'voiced', 'Voiced (濁音)', 61, 'dakuten'),
    ('ビ', 'bi', 'voiced', 'Voiced (濁音)', 62, 'dakuten'),
    ('ブ', 'bu', 'voiced', 'Voiced (濁音)', 63, 'dakuten'),
    ('ベ', 'be', 'voiced', 'Voiced (濁音)', 64, 'dakuten'),
    ('ボ', 'bo', 'voiced', 'Voiced (濁音)', 65, 'dakuten'),
    ('パ', 'pa', 'semiVoiced', 'Semi-voiced (半濁音)', 66, 'handakuten'),
    ('ピ', 'pi', 'semiVoiced', 'Semi-voiced (半濁音)', 67, 'handakuten'),
    ('プ', 'pu', 'semiVoiced', 'Semi-voiced (半濁音)', 68, 'handakuten'),
    ('ペ', 'pe', 'semiVoiced', 'Semi-voiced (半濁音)', 69, 'handakuten'),
    ('ポ', 'po', 'semiVoiced', 'Semi-voiced (半濁音)', 70, 'handakuten'),
    ('キャ', 'kya', 'combo', 'Combinations (拗音)', 71, 'combo'),
    ('キュ', 'kyu', 'combo', 'Combinations (拗音)', 72, 'combo'),
    ('キョ', 'kyo', 'combo', 'Combinations (拗音)', 73, 'combo'),
    ('シャ', 'sha', 'combo', 'Combinations (拗音)', 74, 'combo'),
    ('シュ', 'shu', 'combo', 'Combinations (拗音)', 75, 'combo'),
    ('ショ', 'sho', 'combo', 'Combinations (拗音)', 76, 'combo'),
    ('チャ', 'cha', 'combo', 'Combinations (拗音)', 77, 'combo'),
    ('チュ', 'chu', 'combo', 'Combinations (拗音)', 78, 'combo'),
    ('チョ', 'cho', 'combo', 'Combinations (拗音)', 79, 'combo'),
    ('ニャ', 'nya', 'combo', 'Combinations (拗音)', 80, 'combo'),
    ('ニュ', 'nyu', 'combo', 'Combinations (拗音)', 81, 'combo'),
    ('ニョ', 'nyo', 'combo', 'Combinations (拗音)', 82, 'combo'),
    ('ヒャ', 'hya', 'combo', 'Combinations (拗音)', 83, 'combo'),
    ('ヒュ', 'hyu', 'combo', 'Combinations (拗音)', 84, 'combo'),
    ('ヒョ', 'hyo', 'combo', 'Combinations (拗音)', 85, 'combo'),
    ('ミャ', 'mya', 'combo', 'Combinations (拗音)', 86, 'combo'),
    ('ミュ', 'myu', 'combo', 'Combinations (拗音)', 87, 'combo'),
    ('ミョ', 'myo', 'combo', 'Combinations (拗音)', 88, 'combo'),
    ('リャ', 'rya', 'combo', 'Combinations (拗音)', 89, 'combo'),
    ('リュ', 'ryu', 'combo', 'Combinations (拗音)', 90, 'combo'),
    ('リョ', 'ryo', 'combo', 'Combinations (拗音)', 91, 'combo'),
    ('ギャ', 'gya', 'combo', 'Combinations (拗音)', 92, 'combo'),
    ('ギュ', 'gyu', 'combo', 'Combinations (拗音)', 93, 'combo'),
    ('ギョ', 'gyo', 'combo', 'Combinations (拗音)', 94, 'combo'),
    ('ジャ', 'ja', 'combo', 'Combinations (拗音)', 95, 'combo'),
    ('ジュ', 'ju', 'combo', 'Combinations (拗音)', 96, 'combo'),
    ('ジョ', 'jo', 'combo', 'Combinations (拗音)', 97, 'combo'),
    ('ビャ', 'bya', 'combo', 'Combinations (拗音)', 98, 'combo'),
    ('ビュ', 'byu', 'combo', 'Combinations (拗音)', 99, 'combo'),
    ('ビョ', 'byo', 'combo', 'Combinations (拗音)', 100, 'combo'),
    ('ピャ', 'pya', 'combo', 'Combinations (拗音)', 101, 'combo'),
    ('ピュ', 'pyu', 'combo', 'Combinations (拗音)', 102, 'combo'),
    ('ピョ', 'pyo', 'combo', 'Combinations (拗音)', 103, 'combo')
) as v(character, romaji, row_name, row_label, order_index, variant_type)
where not exists (
  select 1 from public.katakana k where k.character = v.character
);

insert into public.reading_exercises (
  title, japanese_text, romaji, english, question, options, correct_option_index, script, status
)
select
  'Coffee Break',
  'コーヒー を のみます。',
  'koohii o nomimasu.',
  'I drink coffee.',
  'What drink is mentioned?',
  '["coffee", "tea", "juice", "water"]'::jsonb,
  0,
  'katakana',
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Coffee Break'
);

insert into public.reading_exercises (
  title, japanese_text, romaji, english, question, options, correct_option_index, script, status
)
select
  'Send Email',
  'メール を おくります。',
  'meeru o okurimasu.',
  'I send an email.',
  'What is being sent?',
  '["An email", "A letter", "A package", "A message by phone"]'::jsonb,
  0,
  'katakana',
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Send Email'
);

insert into public.reading_exercises (
  title, japanese_text, romaji, english, question, options, correct_option_index, script, status
)
select
  'Party Night',
  'パーティー に いきます。',
  'paatii ni ikimasu.',
  'I go to a party.',
  'Where is the person going?',
  '["A party", "A meeting", "A restaurant", "A park"]'::jsonb,
  0,
  'katakana',
  'published'
where not exists (
  select 1 from public.reading_exercises where title = 'Party Night'
);
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
    'A Row + ン',
    'Ka Row',
    'Sa Row',
    'Ta Row',
    'Na Row',
    'Ha Row',
    'Ma Row',
    'Ya Row',
    'Ra Row',
    'Wa Row',
    'Voiced Katakana',
    'Semi-voiced Katakana',
    'Combination Katakana'
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
  select id into region_id from public.regions where slug = 'forest-trail' limit 1;
  if region_id is null then
    return;
  end if;

  -- Unit: Katakana Part I
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Katakana Part I', 'Vowels through the S row.', 1, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Part I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Part I' limit 1;

  for idx in 1..3 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'katakana', lesson_titles[idx], 'Learn and practice katakana characters.', 1, 10, 5, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.katakana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'katakana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'katakana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Katakana Part II
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Katakana Part II', 'T row through the W row.', 2, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Part II'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Part II' limit 1;

  for idx in 4..10 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'katakana', lesson_titles[idx], 'Learn and practice katakana characters.', 1, 10, 5, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.katakana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'katakana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'katakana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Katakana Advanced
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Katakana Advanced', 'Voiced, semi-voiced, and combination katakana.', 3, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Advanced'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Advanced' limit 1;

  for idx in 11..13 loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'katakana', lesson_titles[idx], 'Learn and practice katakana characters.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = lesson_titles[idx]
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = lesson_titles[idx] limit 1;

    row_names := string_to_array(row_group_keys[idx], ',');
    foreach row_name in array row_names loop
      for h_id in
        select h.id from public.katakana h
        where h.row_name = row_name and h.status = 'published'
        order by h.order_index
      loop
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'katakana', h_id, (
          select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
        )
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'katakana' and content_id = h_id
        );
      end loop;
    end loop;
  end loop;

  -- Unit: Katakana Reading
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Katakana Reading', 'Read short katakana passages.', 4, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Reading'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Reading' limit 1;

  for reading_id in
    select id from public.reading_exercises where status = 'published' and script = 'katakana' order by title
  loop
    if unit_id is null then continue; end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'reading',
      r.title,
      'Read and comprehend a short katakana passage.',
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

  -- Unit: Katakana Practice (mixed review lesson)
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Katakana Practice', 'Mixed practice across all katakana.', 5, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Katakana Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Katakana Practice' limit 1;

  insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
  select unit_id, 'practice', 'Katakana Mastery Check', 'Mixed recall across the katakana you have learned.', 2, 20, 8, 'published'
  where unit_id is not null
    and not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Katakana Mastery Check'
    );

  select id into lesson_id from public.lessons
  where unit_id = unit_id and title = 'Katakana Mastery Check' limit 1;

  for h_id in
    select distinct on (row_name) id
    from public.katakana
    where status = 'published'
      and variant_type = 'base'
      and row_name in ('a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa')
    order by row_name, order_index
  loop
    insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
    select lesson_id, 'katakana', h_id, (
      select coalesce(max(order_index), -1) + 1 from public.lesson_items where lesson_id = lesson_id
    )
    where lesson_id is not null
      and not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'katakana' and content_id = h_id
      );
  end loop;
end $seed$;
