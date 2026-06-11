-- N5 grammar expansion (Mount N5 units 17-19)

insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select v.title, v.meaning, v.explanation, v.jlpt_level, v.difficulty, v.status
from (
  values
    ('は (wa)', 'Topic particle', 'Marks the topic of a sentence — what the speaker is talking about.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('です (desu)', 'Polite copula', 'Links a noun or adjective to the subject in polite speech.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ます (masu)', 'Polite verb ending', 'Attaches to verb stems to form polite present or future tense.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ました (mashita)', 'Polite past tense', 'Replaces ます to express completed actions in polite speech.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ませんでした (masen deshita)', 'Polite past negative', 'Expresses that something did not happen in polite past tense.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('どこ (doko)', 'Where (question word)', 'Asks about location; often paired with ですか for polite questions.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('なに/何 (nani)', 'What (question word)', 'Asks about things or actions; pronunciation shifts before certain sounds.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('いつ (itsu)', 'When (question word)', 'Asks about time; place before the verb or at the start of a question.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('だれ/誰 (dare)', 'Who (question word)', 'Asks about people; use with は for identity or が for subject emphasis.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('から (kara)', 'From (starting point)', 'Marks a starting point in time or space.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('まで (made)', 'Until / to (ending point)', 'Marks an ending point in time or a destination limit.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('たい (tai)', 'Want to', 'Attaches to verb stems to express desire; often used with です in polite speech.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('てください (te kudasai)', 'Please do', 'Combines the て-form with ください to make polite requests.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('ない (nai)', 'Plain negative', 'Attaches to verb stems for plain negative present tense.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status),
    ('て-form basics', 'Connecting verbs', 'The て-form links verbs in sequence or leads into patterns like てください.', 'n5'::public.jlpt_level, 1, 'published'::public.content_status)
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
    ('は (wa)', '私は学生です。', 'Watashi wa gakusei desu.', 'I am a student.', 0),
    ('は (wa)', '水は冷たいです。', 'Mizu wa tsumetai desu.', 'The water is cold.', 1),
    ('です (desu)', '学生です。', 'Gakusei desu.', 'I am a student.', 0),
    ('です (desu)', '静かです。', 'Shizuka desu.', 'It is quiet.', 1),
    ('ます (masu)', '行きます。', 'Ikimasu.', 'I go.', 0),
    ('ます (masu)', '食べます。', 'Tabemasu.', 'I eat.', 1),
    ('ました (mashita)', '行きました。', 'Ikimashita.', 'I went.', 0),
    ('ました (mashita)', '食べました。', 'Tabemashita.', 'I ate.', 1),
    ('ませんでした (masen deshita)', '行きませんでした。', 'Ikimasen deshita.', 'I did not go.', 0),
    ('ませんでした (masen deshita)', '食べませんでした。', 'Tabemasen deshita.', 'I did not eat.', 1),
    ('どこ (doko)', 'トイレはどこですか。', 'Toire wa doko desu ka.', 'Where is the restroom?', 0),
    ('どこ (doko)', 'どこへ行きますか。', 'Doko e ikimasu ka.', 'Where are you going?', 1),
    ('なに/何 (nani)', 'これは何ですか。', 'Kore wa nan desu ka.', 'What is this?', 0),
    ('なに/何 (nani)', '何を食べますか。', 'Nani o tabemasu ka.', 'What will you eat?', 1),
    ('いつ (itsu)', 'いつ行きますか。', 'Itsu ikimasu ka.', 'When will you go?', 0),
    ('いつ (itsu)', '会議はいつですか。', 'Kaigi wa itsu desu ka.', 'When is the meeting?', 1),
    ('だれ/誰 (dare)', 'あの人は誰ですか。', 'Ano hito wa dare desu ka.', 'Who is that person?', 0),
    ('だれ/誰 (dare)', '誰が来ますか。', 'Dare ga kimasu ka.', 'Who is coming?', 1),
    ('から (kara)', '学校から帰ります。', 'Gakkou kara kaerimasu.', 'I return from school.', 0),
    ('から (kara)', '九時から始まります。', 'Kuji kara hajimarimasu.', 'It starts from nine o''clock.', 1),
    ('まで (made)', '駅まで歩きます。', 'Eki made arukimasu.', 'I walk to the station.', 0),
    ('まで (made)', '五時まで働きます。', 'Go-ji made hatarakimasu.', 'I work until five o''clock.', 1),
    ('たい (tai)', '日本へ行きたいです。', 'Nihon e ikitai desu.', 'I want to go to Japan.', 0),
    ('たい (tai)', '寿司を食べたいです。', 'Sushi o tabetai desu.', 'I want to eat sushi.', 1),
    ('てください (te kudasai)', '座ってください。', 'Suwatte kudasai.', 'Please sit down.', 0),
    ('てください (te kudasai)', '待ってください。', 'Matte kudasai.', 'Please wait.', 1),
    ('ない (nai)', '行かない。', 'Ikanai.', 'I do not go.', 0),
    ('ない (nai)', '食べない。', 'Tabenai.', 'I do not eat.', 1),
    ('て-form basics', '食べて、飲みます。', 'Tabete, nomimasu.', 'I eat and drink.', 0),
    ('て-form basics', '起きて、学校へ行きます。', 'Okite, gakkou e ikimasu.', 'I wake up and go to school.', 1)
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
  select region_id, 'Foundations Review', 'Core sentence patterns: topic marker, copula, and polite verb forms.', 17, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Foundations Review'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Foundations Review' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Foundations Review', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Foundations Review'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Foundations Review' limit 1;

    if lesson_id is not null then
      point_title_list := array['は (wa)', 'です (desu)', 'ます (masu)', 'ました (mashita)'];
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
  select region_id, 'Questions & Negation', 'Question words and negative sentence patterns.', 18, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Questions & Negation'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Questions & Negation' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Questions & Negation', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Questions & Negation'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Questions & Negation' limit 1;

    if lesson_id is not null then
      point_title_list := array['どこ (doko)', 'なに/何 (nani)', 'いつ (itsu)', 'だれ/誰 (dare)', 'ませんでした (masen deshita)', 'ない (nai)'];
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
  select region_id, 'Connection Patterns', 'Range particles, desire, requests, and verb connection.', 19, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Connection Patterns'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Connection Patterns' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'Connection Patterns', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Connection Patterns'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Connection Patterns' limit 1;

    if lesson_id is not null then
      point_title_list := array['から (kara)', 'まで (made)', 'たい (tai)', 'てください (te kudasai)', 'て-form basics'];
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
