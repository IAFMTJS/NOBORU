-- Phase 8: N5 vocabulary region (Mount N5)

create table public.vocabulary_examples (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vocabulary_examples_vocabulary_id_idx
  on public.vocabulary_examples (vocabulary_id);

create trigger vocabulary_examples_set_updated_at
  before update on public.vocabulary_examples
  for each row execute function public.set_updated_at();

alter table public.vocabulary_examples enable row level security;

create policy "Authenticated users read published vocabulary examples"
  on public.vocabulary_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage vocabulary examples"
  on public.vocabulary_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.regions (slug, name, description, order_index, status)
select
  'mount-n5',
  'Mount N5',
  'The first summit path. Build your core N5 vocabulary.',
  2,
  'published'
where not exists (
  select 1 from public.regions where slug = 'mount-n5'
);

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
    ('わたし', '私', 'I, me', 'pronoun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ひと', '人', 'person', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ともだち', '友達', 'friend', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('せんせい', '先生', 'teacher', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('がくせい', '学生', 'student', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('がっこう', '学校', 'school', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いえ', '家', 'house, home', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みせ', '店', 'shop, store', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('えき', '駅', 'station', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くに', '国', 'country', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きょう', '今日', 'today', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あした', '明日', 'tomorrow', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('きのう', '昨日', 'yesterday', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('じかん', '時間', 'time', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いま', '今', 'now', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いち', '一', 'one', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('に', '二', 'two', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さん', '三', 'three', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('よん', '四', 'four', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ご', '五', 'five', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みず', '水', 'water', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ごはん', 'ご飯', 'rice, meal', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('にく', '肉', 'meat', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('さかな', '魚', 'fish', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くだもの', '果物', 'fruit', 'noun', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いく', '行く', 'to go', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('くる', '来る', 'to come', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('たべる', '食べる', 'to eat', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('のむ', '飲む', 'to drink', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('みる', '見る', 'to see, watch', 'verb', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('おおきい', '大きい', 'big', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ちいさい', '小さい', 'small', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('あたらしい', '新しい', 'new', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('ふるい', '古い', 'old', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status),
    ('いい', 'いい', 'good', 'adjective', 'n5'::public.jlpt_level, 'published'::public.content_status)
) as v(kana, kanji, meaning, part_of_speech, jlpt_level, status)
where not exists (
  select 1 from public.vocabulary existing where existing.kana = v.kana
);

insert into public.vocabulary_examples (
  vocabulary_id, japanese_text, romaji, english, order_index, status
)
select v.id, e.japanese_text, e.romaji, e.english, 0, 'published'
from public.vocabulary v
inner join (
  values
    ('わたし', 'わたしは学生です。', 'Watashi wa gakusei desu.', 'I am a student.'),
    ('ひと', 'あの人は先生です。', 'Ano hito wa sensei desu.', 'That person is a teacher.'),
    ('ともだち', '友達と学校へ行きます。', 'Tomodachi to gakkou e ikimasu.', 'I go to school with a friend.'),
    ('せんせい', '先生は親切です。', 'Sensei wa shinsetsu desu.', 'The teacher is kind.'),
    ('がくせい', '学生は図書館にいます。', 'Gakusei wa toshokan ni imasu.', 'The student is in the library.'),
    ('がっこう', '学校は大きいです。', 'Gakkou wa ookii desu.', 'The school is big.'),
    ('いえ', '家に帰ります。', 'Ie ni kaerimasu.', 'I return home.'),
    ('みせ', '店で水を買います。', 'Mise de mizu o kaimasu.', 'I buy water at the shop.'),
    ('えき', '駅はここです。', 'Eki wa koko desu.', 'The station is here.'),
    ('くに', '日本は美しい国です。', 'Nihon wa utsukushii kuni desu.', 'Japan is a beautiful country.'),
    ('きょう', '今日は忙しいです。', 'Kyou wa isogashii desu.', 'Today is busy.'),
    ('あした', '明日学校へ行きます。', 'Ashita gakkou e ikimasu.', 'I will go to school tomorrow.'),
    ('きのう', '昨日友達に会いました。', 'Kinou tomodachi ni aimashita.', 'I met a friend yesterday.'),
    ('じかん', '時間がありません。', 'Jikan ga arimasen.', 'There is no time.'),
    ('いま', '今、勉強します。', 'Ima, benkyou shimasu.', 'I will study now.'),
    ('いち', '一つください。', 'Hitotsu kudasai.', 'One please.'),
    ('に', '二つあります。', 'Futatsu arimasu.', 'There are two.'),
    ('さん', '三人います。', 'Sannin imasu.', 'There are three people.'),
    ('よん', '四時に会いましょう。', 'Yoji ni aimashou.', 'Let''s meet at four o''clock.'),
    ('ご', '五つ買いました。', 'Itsutsu kaimashita.', 'I bought five.'),
    ('みず', '水を飲みます。', 'Mizu o nomimasu.', 'I drink water.'),
    ('ごはん', 'ご飯を食べます。', 'Gohan o tabemasu.', 'I eat a meal.'),
    ('にく', '肉が好きです。', 'Niku ga suki desu.', 'I like meat.'),
    ('さかな', '魚を食べません。', 'Sakana o tabemasen.', 'I do not eat fish.'),
    ('くだもの', '果物は安いです。', 'Kudamono wa yasui desu.', 'Fruit is cheap.'),
    ('いく', '学校へ行きます。', 'Gakkou e ikimasu.', 'I go to school.'),
    ('くる', '友達が来ます。', 'Tomodachi ga kimasu.', 'A friend is coming.'),
    ('たべる', 'ご飯を食べます。', 'Gohan o tabemasu.', 'I eat a meal.'),
    ('のむ', '水を飲みます。', 'Mizu o nomimasu.', 'I drink water.'),
    ('みる', 'テレビを見ます。', 'Terebi o mimasu.', 'I watch TV.'),
    ('おおきい', '学校は大きいです。', 'Gakkou wa ookii desu.', 'The school is big.'),
    ('ちいさい', '店は小さいです。', 'Mise wa chiisai desu.', 'The shop is small.'),
    ('あたらしい', '新しい本です。', 'Atarashii hon desu.', 'It is a new book.'),
    ('ふるい', '古い家です。', 'Furui ie desu.', 'It is an old house.'),
    ('いい', 'いい天気です。', 'Ii tenki desu.', 'The weather is good.')
) as e(kana, japanese_text, romaji, english) on e.kana = v.kana
where v.jlpt_level = 'n5'
  and not exists (
    select 1 from public.vocabulary_examples existing
    where existing.vocabulary_id = v.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  vocab_id uuid;
  word_kana_list text[];
  word_kana text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'People & Places', 'Essential nouns for people and everyday locations.', 1, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'People & Places'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'People & Places' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'People', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'People'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'People' limit 1;

    if lesson_id is not null then
      word_kana_list := array['わたし', 'ひと', 'ともだち', 'せんせい', 'がくせい'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Places', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Places'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Places' limit 1;

    if lesson_id is not null then
      word_kana_list := array['がっこう', 'いえ', 'みせ', 'えき', 'くに'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Time & Numbers', 'Talk about when things happen and basic counting.', 2, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Time & Numbers'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Time & Numbers' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Time', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Time'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Time' limit 1;

    if lesson_id is not null then
      word_kana_list := array['きょう', 'あした', 'きのう', 'じかん', 'いま'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Numbers', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Numbers'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Numbers' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いち', 'に', 'さん', 'よん', 'ご'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Actions & Descriptions', 'Common verbs and adjectives for daily conversation.', 3, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Actions & Descriptions'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Actions & Descriptions' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Food & Drink', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Food & Drink'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Food & Drink' limit 1;

    if lesson_id is not null then
      word_kana_list := array['みず', 'ごはん', 'にく', 'さかな', 'くだもの'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Common Verbs', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Common Verbs'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Common Verbs' limit 1;

    if lesson_id is not null then
      word_kana_list := array['いく', 'くる', 'たべる', 'のむ', 'みる'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', 'Descriptors', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Descriptors'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Descriptors' limit 1;

    if lesson_id is not null then
      word_kana_list := array['おおきい', 'ちいさい', 'あたらしい', 'ふるい', 'いい'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Vocabulary Practice', 'Mixed review across N5 vocabulary.', 4, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Vocabulary Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Vocabulary Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Vocabulary Check', 'Mixed recall across the N5 words you have learned.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Vocabulary Check'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Vocabulary Check' limit 1;

    if lesson_id is not null then
      word_kana_list := array['わたし', 'がっこう', 'きょう', 'いち', 'みず', 'いく', 'おおきい'];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;
end $seed$;
