-- Phase 9: N5 grammar curriculum (Mount N5)

create table public.grammar_examples (
  id uuid primary key default gen_random_uuid(),
  grammar_id uuid not null references public.grammar_points (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index grammar_examples_grammar_id_idx
  on public.grammar_examples (grammar_id);

create trigger grammar_examples_set_updated_at
  before update on public.grammar_examples
  for each row execute function public.set_updated_at();

alter table public.grammar_examples enable row level security;

create policy "Authenticated users read published grammar examples"
  on public.grammar_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage grammar examples"
  on public.grammar_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select v.title, v.meaning, v.explanation, v.jlpt_level, v.difficulty, v.status
from (
  values
    ('を (o)', 'Direct object particle', 'Marks the direct object of a verb — what receives the action.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('が (ga)', 'Subject marker particle', 'Marks the grammatical subject, often for new information or emphasis.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('に (ni)', 'Direction, time, and location particle', 'Marks direction (to), specific times, and static locations.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('で (de)', 'Location of action and means particle', 'Marks where an action takes place or the means used to do something.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('と (to)', 'And / with particle', 'Connects nouns (and) or marks companions (with).', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('も (mo)', 'Also / too particle', 'Replaces は, が, or を to mean also or too.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('へ (e)', 'Direction toward particle', 'Marks direction toward a place, similar to に but emphasizes movement.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('の (no)', 'Possession and modification particle', 'Links nouns to show possession or describe relationships.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('か (ka)', 'Question particle', 'Placed at the end of a sentence to turn it into a question.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ません (masen)', 'Negative polite form', 'Attaches to verb stems to make polite negative sentences.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ましょう (mashou)', 'Let''s / suggestion form', 'Used to make polite suggestions or invitations.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('あります・います', 'Existence verbs (inanimate / animate)', 'あります for things; います for living beings.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('い-adjective + です', 'Polite い-adjective sentences', 'Connect い-adjectives directly to です in polite speech.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('な-adjective + です', 'Polite な-adjective sentences', 'Place な between a な-adjective and です.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('くない (kunai)', 'い-adjective negative', 'Replace い with くない to negate い-adjectives in plain form.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('が好き (ga suki)', 'Liking something pattern', 'Use が with 好き to express liking a person or thing.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status)
) as v(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = v.title
);

insert into public.grammar_examples (
  grammar_id, japanese_text, romaji, english, order_index, status
)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
    ('を (o)', '水を飲みます。', 'Mizu o nomimasu.', 'I drink water.', 0),
    ('を (o)', 'ご飯を食べます。', 'Gohan o tabemasu.', 'I eat a meal.', 1),
    ('が (ga)', '猫がいます。', 'Neko ga imasu.', 'There is a cat.', 0),
    ('が (ga)', '雨が降ります。', 'Ame ga furimasu.', 'It rains.', 1),
    ('に (ni)', '学校に行きます。', 'Gakkou ni ikimasu.', 'I go to school.', 0),
    ('に (ni)', '七時に起きます。', 'Shichiji ni okimasu.', 'I wake up at seven.', 1),
    ('で (de)', '学校で勉強します。', 'Gakkou de benkyou shimasu.', 'I study at school.', 0),
    ('で (de)', 'バスで行きます。', 'Basu de ikimasu.', 'I go by bus.', 1),
    ('と (to)', '友達と行きます。', 'Tomodachi to ikimasu.', 'I go with a friend.', 0),
    ('と (to)', '水とご飯を買います。', 'Mizu to gohan o kaimasu.', 'I buy water and a meal.', 1),
    ('も (mo)', '私も学生です。', 'Watashi mo gakusei desu.', 'I am also a student.', 0),
    ('も (mo)', '水も飲みます。', 'Mizu mo nomimasu.', 'I also drink water.', 1),
    ('へ (e)', '日本へ行きます。', 'Nihon e ikimasu.', 'I go to Japan.', 0),
    ('へ (e)', '駅へ歩きます。', 'Eki e arukimasu.', 'I walk toward the station.', 1),
    ('の (no)', '私の友達', 'Watashi no tomodachi', 'My friend', 0),
    ('の (no)', '日本の学校', 'Nihon no gakkou', 'A Japanese school', 1),
    ('か (ka)', '学生ですか。', 'Gakusei desu ka.', 'Are you a student?', 0),
    ('か (ka)', '水を飲みますか。', 'Mizu o nomimasu ka.', 'Do you drink water?', 1),
    ('ません (masen)', '行きません。', 'Ikimasen.', 'I do not go.', 0),
    ('ません (masen)', '食べません。', 'Tabemasen.', 'I do not eat.', 1),
    ('ましょう (mashou)', '行きましょう。', 'Ikimashou.', 'Let''s go.', 0),
    ('ましょう (mashou)', '勉強しましょう。', 'Benkyou shimashou.', 'Let''s study.', 1),
    ('あります・います', '本があります。', 'Hon ga arimasu.', 'There is a book.', 0),
    ('あります・います', '猫がいます。', 'Neko ga imasu.', 'There is a cat.', 1),
    ('い-adjective + です', '大きいです。', 'Ookii desu.', 'It is big.', 0),
    ('い-adjective + です', '新しいです。', 'Atarashii desu.', 'It is new.', 1),
    ('な-adjective + です', '静かです。', 'Shizuka desu.', 'It is quiet.', 0),
    ('な-adjective + です', '好きです。', 'Suki desu.', 'I like it.', 1),
    ('くない (kunai)', '大きくない。', 'Ookikunai.', 'It is not big.', 0),
    ('くない (kunai)', '新しくない。', 'Atarashikunai.', 'It is not new.', 1),
    ('が好き (ga suki)', '猫が好きです。', 'Neko ga suki desu.', 'I like cats.', 0),
    ('が好き (ga suki)', '音楽が好きです。', 'Ongaku ga suki desu.', 'I like music.', 1)
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  grammar_id uuid;
  point_title_list text[];
  point_title text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Core Particles I', 'Essential particles for objects, subjects, and locations.', 5, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Core Particles I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Core Particles I' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Object & Subject', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Object & Subject'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Object & Subject' limit 1;

    if lesson_id is not null then
      point_title_list := array['を (o)', 'が (ga)', 'に (ni)', 'で (de)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Core Particles II', 'Particles for connection, emphasis, and possession.', 6, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Core Particles II'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Core Particles II' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Connection & Possession', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Connection & Possession'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Connection & Possession' limit 1;

    if lesson_id is not null then
      point_title_list := array['と (to)', 'も (mo)', 'へ (e)', 'の (no)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Sentence Patterns', 'Questions, negation, and existence patterns.', 7, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Sentence Patterns'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Sentence Patterns' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Questions & Negation', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Questions & Negation'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Questions & Negation' limit 1;

    if lesson_id is not null then
      point_title_list := array['か (ka)', 'ません (masen)', 'ましょう (mashou)', 'あります・います'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Adjective Patterns', 'Describe things with い-adjectives and な-adjectives.', 8, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Adjective Patterns'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Adjective Patterns' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Describing Things', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Describing Things'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Describing Things' limit 1;

    if lesson_id is not null then
      point_title_list := array['い-adjective + です', 'な-adjective + です', 'くない (kunai)', 'が好き (ga suki)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Practice', 'Mixed review across N5 grammar.', 9, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'N5 Grammar Check', 'Mixed recall across the N5 grammar you have learned.', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'N5 Grammar Check'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'N5 Grammar Check' limit 1;

    if lesson_id is not null then
      point_title_list := array['を (o)', 'が (ga)', 'に (ni)', 'で (de)', 'か (ka)', 'あります・います', 'い-adjective + です', 'が好き (ga suki)'];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;
end $seed$;
