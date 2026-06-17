-- N5 grammar expansion wave 2 + unit mini-exams


-- N5 grammar expansion wave 2
insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select g.title, g.meaning, g.explanation, g.jlpt_level, g.difficulty, g.status
from (
  values
    ('ている (te-iru)', 'Ongoing state or action', 'Describes something in progress or a resulting state.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ので (node)', 'Because, since (polite reason)', 'Polite reason marker, softer than から for giving explanations.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ましょう (mashou)', 'Let''s, shall we', 'Suggests doing something together in polite speech.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ことができる (koto ga dekiru)', 'Can do', 'Expresses ability or possibility using dictionary-form verb + こと.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('前に (mae ni)', 'Before', 'Indicates something happens before another action.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('後で (ato de)', 'After, later', 'Indicates something happens after another action or at a later time.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('あまり〜ない (amari...nai)', 'Not very', 'Used with negatives to mean not much or not very.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('もう (mou)', 'Already', 'Indicates something has already happened or a state has been reached.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('まだ (mada)', 'Still, not yet', 'Used with affirmative for still or with negative for not yet.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('より (yori)', 'Than, more than', 'Marks the item being compared against in comparisons.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ほうが (hou ga)', 'Is more (comparison)', 'Used with より to express that one option is more preferable.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ながら (nagara)', 'While doing', 'Connects two simultaneous actions performed by the same subject.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('てから (te kara)', 'After doing', 'Indicates one action happens after another is completed.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('すぎる (sugiru)', 'Too much', 'Attaches to verb stems or adjective roots to mean excessive degree.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('なければならない (nakereba naranai)', 'Must do', 'Expresses obligation or necessity in polite written-style speech.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('かもしれない (kamoshirenai)', 'Might, maybe', 'Expresses uncertainty or possibility.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ように (you ni)', 'So that, in order to', 'Expresses purpose or manner; often used for goals and instructions.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('ために (tame ni)', 'For the sake of, in order to', 'Marks purpose or benefit, often for people or clear goals.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('について (ni tsuite)', 'About, concerning', 'Introduces the topic of discussion or study.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status),
    ('と思う (to omou)', 'I think that', 'Expresses the speaker''s opinion or belief about something.', 'n5'::public.jlpt_level, 2, 'published'::public.content_status)
) as g(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = g.title
);


insert into public.grammar_examples (grammar_id, japanese_text, romaji, english, order_index, status)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
    ('ている (te-iru)', '今、勉強しています。', 'Ima, benkyou shite imasu.', 'I am studying now.', 0),
    ('ている (te-iru)', '雨が降っています。', 'Ame ga futte imasu.', 'It is raining.', 1),
    ('ので (node)', '雨なので、家にいます。', 'Ame na node, ie ni imasu.', 'Because it is rainy, I am at home.', 0),
    ('ので (node)', '勉強なので、静かにしてください。', 'Benkyou na node, shizuka ni shite kudasai.', 'Because I am studying, please be quiet.', 1),
    ('ましょう (mashou)', '一緒に行きましょう。', 'Issho ni ikimashou.', 'Let''s go together.', 0),
    ('ましょう (mashou)', '休みましょう。', 'Yasumimashou.', 'Let''s rest.', 1),
    ('ことができる (koto ga dekiru)', '日本語が話せます。', 'Nihongo ga hanasemasu.', 'I can speak Japanese.', 0),
    ('ことができる (koto ga dekiru)', '泳ぐことができます。', 'Oyogu koto ga dekimasu.', 'I can swim.', 1),
    ('前に (mae ni)', '食事の前に手を洗います。', 'Shokuji no mae ni te o araimasu.', 'I wash my hands before eating.', 0),
    ('前に (mae ni)', '寝る前に本を読みます。', 'Neru mae ni hon o yomimasu.', 'I read before sleeping.', 1),
    ('後で (ato de)', '授業の後で遊びます。', 'Jugyou no ato de asobimasu.', 'I play after class.', 0),
    ('後で (ato de)', '後で電話します。', 'Ato de denwa shimasu.', 'I will call later.', 1),
    ('あまり〜ない (amari...nai)', 'あまり好きじゃないです。', 'Amari suki ja nai desu.', 'I do not like it very much.', 0),
    ('あまり〜ない (amari...nai)', 'あまり分かりません。', 'Amari wakarimasen.', 'I do not understand very well.', 1),
    ('もう (mou)', 'もう食べました。', 'Mou tabemashita.', 'I already ate.', 0),
    ('もう (mou)', 'もう帰ります。', 'Mou kaerimasu.', 'I am going home now.', 1),
    ('まだ (mada)', 'まだ勉強しています。', 'Mada benkyou shite imasu.', 'I am still studying.', 0),
    ('まだ (mada)', 'まだ食べていません。', 'Mada tabete imasen.', 'I have not eaten yet.', 1),
    ('より (yori)', 'コーヒーよりお茶の方が好きです。', 'Koohii yori ocha no hou ga suki desu.', 'I like tea more than coffee.', 0),
    ('より (yori)', '昨日より暑いです。', 'Kinou yori atsui desu.', 'It is hotter than yesterday.', 1),
    ('ほうが (hou ga)', '歩くほうがいいです。', 'Aruku hou ga ii desu.', 'Walking is better.', 0),
    ('ほうが (hou ga)', 'こちらのほうが安いです。', 'Kochira no hou ga yasui desu.', 'This one is cheaper.', 1),
    ('ながら (nagara)', '音楽を聞きながら勉強します。', 'Ongaku o kikinagara benkyou shimasu.', 'I study while listening to music.', 0),
    ('ながら (nagara)', '歩きながら話します。', 'Arukinagara hanashimasu.', 'I talk while walking.', 1),
    ('てから (te kara)', '食べてから出かけます。', 'Tabete kara dekakemasu.', 'I go out after eating.', 0),
    ('てから (te kara)', '仕事をしてから寝ます。', 'Shigoto o shite kara nemasu.', 'I sleep after working.', 1),
    ('すぎる (sugiru)', '食べすぎました。', 'Tabesugimashita.', 'I ate too much.', 0),
    ('すぎる (sugiru)', '高すぎます。', 'Takasugimasu.', 'It is too expensive.', 1),
    ('なければならない (nakereba naranai)', '宿題をしなければなりません。', 'Shukudai o shinakereba narimasen.', 'I must do homework.', 0),
    ('なければならない (nakereba naranai)', '薬を飲まなければなりません。', 'Kusuri o nominakereba narimasen.', 'I must take medicine.', 1),
    ('かもしれない (kamoshirenai)', '明日は雨かもしれません。', 'Ashita wa ame kamoshiremasen.', 'It might rain tomorrow.', 0),
    ('かもしれない (kamoshirenai)', '彼は来ないかもしれません。', 'Kare wa konai kamoshiremasen.', 'He might not come.', 1),
    ('ように (you ni)', '忘れないように書きます。', 'Wasurenai you ni kakimasu.', 'I write it down so I do not forget.', 0),
    ('ように (you ni)', '健康のように運動します。', 'Kenkou no you ni undou shimasu.', 'I exercise for my health.', 1),
    ('ために (tame ni)', '試験のために勉強します。', 'Shiken no tame ni benkyou shimasu.', 'I study for the exam.', 0),
    ('ために (tame ni)', '家族のために働きます。', 'Kazoku no tame ni hatarakimasu.', 'I work for my family.', 1),
    ('について (ni tsuite)', '日本文化について話します。', 'Nihon bunka ni tsuite hanashimasu.', 'I talk about Japanese culture.', 0),
    ('について (ni tsuite)', 'この問題について考えます。', 'Kono mondai ni tsuite kangaemasu.', 'I think about this problem.', 1),
    ('と思う (to omou)', '面白いと思います。', 'Omoshiroi to omoimasu.', 'I think it is interesting.', 0),
    ('と思う (to omou)', '明日は晴れると思います。', 'Ashita wa hareru to omoimasu.', 'I think it will be clear tomorrow.', 1)
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id and existing.japanese_text = e.japanese_text
  );


do $grammar_curriculum$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  grammar_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns III — Part 1', 'Advanced N5 grammar patterns and particles.', 20, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns III — Part 1'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns III — Part 1' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ている (te-iru)', 'Ongoing state or action', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ている (te-iru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ている (te-iru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ている (te-iru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ので (node)', 'Because, since (polite reason)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ので (node)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ので (node)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ので (node)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ましょう (mashou)', 'Let''s, shall we', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ましょう (mashou)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ましょう (mashou)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ましょう (mashou)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ことができる (koto ga dekiru)', 'Can do', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ことができる (koto ga dekiru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ことができる (koto ga dekiru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ことができる (koto ga dekiru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns III — Part 2', 'Advanced N5 grammar patterns and particles.', 21, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns III — Part 2'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns III — Part 2' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '前に (mae ni)', 'Before', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '前に (mae ni)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '前に (mae ni)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = '前に (mae ni)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '後で (ato de)', 'After, later', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '後で (ato de)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '後で (ato de)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = '後で (ato de)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'あまり〜ない (amari...nai)', 'Not very', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'あまり〜ない (amari...nai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'あまり〜ない (amari...nai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'あまり〜ない (amari...nai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'もう (mou)', 'Already', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'もう (mou)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'もう (mou)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'もう (mou)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns III — Part 3', 'Advanced N5 grammar patterns and particles.', 22, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns III — Part 3'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns III — Part 3' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'まだ (mada)', 'Still, not yet', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'まだ (mada)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'まだ (mada)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'まだ (mada)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'より (yori)', 'Than, more than', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'より (yori)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'より (yori)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'より (yori)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ほうが (hou ga)', 'Is more (comparison)', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ほうが (hou ga)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ほうが (hou ga)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ほうが (hou ga)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ながら (nagara)', 'While doing', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ながら (nagara)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ながら (nagara)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ながら (nagara)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns III — Part 4', 'Advanced N5 grammar patterns and particles.', 23, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns III — Part 4'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns III — Part 4' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'てから (te kara)', 'After doing', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'てから (te kara)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'てから (te kara)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'てから (te kara)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'すぎる (sugiru)', 'Too much', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'すぎる (sugiru)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'すぎる (sugiru)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'すぎる (sugiru)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'なければならない (nakereba naranai)', 'Must do', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'なければならない (nakereba naranai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'なければならない (nakereba naranai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'なければならない (nakereba naranai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'かもしれない (kamoshirenai)', 'Might, maybe', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'かもしれない (kamoshirenai)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'かもしれない (kamoshirenai)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'かもしれない (kamoshirenai)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Patterns III — Part 5', 'Advanced N5 grammar patterns and particles.', 24, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Patterns III — Part 5'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Patterns III — Part 5' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ように (you ni)', 'So that, in order to', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ように (you ni)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ように (you ni)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ように (you ni)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'ために (tame ni)', 'For the sake of, in order to', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'ために (tame ni)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'ために (tame ni)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'ために (tame ni)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'について (ni tsuite)', 'About, concerning', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'について (ni tsuite)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'について (ni tsuite)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'について (ni tsuite)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', 'と思う (to omou)', 'I think that', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'と思う (to omou)'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'と思う (to omou)' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = 'と思う (to omou)' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;
  end if;
end;
$grammar_curriculum$;


-- N5 unit mini-exams (quizzes)
do $unit_quizzes$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  content_id uuid;
  word_kana_list text[];
  word_kana text;
  grammar_title_list text[];
  grammar_title text;
  kanji_char_list text[];
  kanji_char text;
  story_slug text;
  dialogue_slug text;
  item_index integer;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N5 Mini Exam: Vocabulary I', 'Quiz covering People, Time, and Actions vocabulary.', 37, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Mini Exam: Vocabulary I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Mini Exam: Vocabulary I' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'Quiz: Vocabulary I', 'Quiz covering People, Time, and Actions vocabulary.', 3, 25, 10, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quiz: Vocabulary I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quiz: Vocabulary I' limit 1;

    word_kana_list := array['わたし', 'きょう', 'いく', 'たべる', 'のみる'];
    grammar_title_list := null;
    kanji_char_list := null;

    if lesson_id is not null then
      if array_length(word_kana_list, 1) is not null then
        item_index := 0;
        foreach word_kana in array word_kana_list loop
          select id into content_id from public.vocabulary
          where status = 'published' and jlpt_level = 'n5' and kana = word_kana limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'vocabulary', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(grammar_title_list, 1) is not null then
        item_index := 0;
        foreach grammar_title in array grammar_title_list loop
          select id into content_id from public.grammar_points
          where status = 'published' and jlpt_level = 'n5' and title = grammar_title limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'grammar', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'grammar' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(kanji_char_list, 1) is not null then
        item_index := 0;
        foreach kanji_char in array kanji_char_list loop
          select id into content_id from public.kanji
          where status = 'published' and jlpt_level = 'n5' and character = kanji_char limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'kanji', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'kanji' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N5 Mini Exam: Grammar I', 'Quiz on particles and basic sentence patterns.', 38, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Mini Exam: Grammar I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Mini Exam: Grammar I' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'Quiz: Grammar I', 'Quiz on particles and basic sentence patterns.', 3, 25, 10, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quiz: Grammar I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quiz: Grammar I' limit 1;

    word_kana_list := null;
    grammar_title_list := array['は (wa)', 'です (desu)', 'ます (masu)', 'を (o)', 'に (ni)'];
    kanji_char_list := null;

    if lesson_id is not null then
      if array_length(word_kana_list, 1) is not null then
        item_index := 0;
        foreach word_kana in array word_kana_list loop
          select id into content_id from public.vocabulary
          where status = 'published' and jlpt_level = 'n5' and kana = word_kana limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'vocabulary', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(grammar_title_list, 1) is not null then
        item_index := 0;
        foreach grammar_title in array grammar_title_list loop
          select id into content_id from public.grammar_points
          where status = 'published' and jlpt_level = 'n5' and title = grammar_title limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'grammar', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'grammar' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(kanji_char_list, 1) is not null then
        item_index := 0;
        foreach kanji_char in array kanji_char_list loop
          select id into content_id from public.kanji
          where status = 'published' and jlpt_level = 'n5' and character = kanji_char limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'kanji', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'kanji' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N5 Mini Exam: Kanji I', 'Mixed kanji recall from Academy Parts I–II.', 39, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Mini Exam: Kanji I'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Mini Exam: Kanji I' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'Quiz: Kanji I', 'Mixed kanji recall from Academy Parts I–II.', 3, 25, 10, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quiz: Kanji I'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quiz: Kanji I' limit 1;

    word_kana_list := null;
    grammar_title_list := null;
    kanji_char_list := array['一', '二', '三', '日', '月'];

    if lesson_id is not null then
      if array_length(word_kana_list, 1) is not null then
        item_index := 0;
        foreach word_kana in array word_kana_list loop
          select id into content_id from public.vocabulary
          where status = 'published' and jlpt_level = 'n5' and kana = word_kana limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'vocabulary', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(grammar_title_list, 1) is not null then
        item_index := 0;
        foreach grammar_title in array grammar_title_list loop
          select id into content_id from public.grammar_points
          where status = 'published' and jlpt_level = 'n5' and title = grammar_title limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'grammar', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'grammar' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;

      if array_length(kanji_char_list, 1) is not null then
        item_index := 0;
        foreach kanji_char in array kanji_char_list loop
          select id into content_id from public.kanji
          where status = 'published' and jlpt_level = 'n5' and character = kanji_char limit 1;
          if content_id is not null then
            insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
            select lesson_id, 'kanji', content_id, item_index
            where not exists (
              select 1 from public.lesson_items
              where lesson_id = lesson_id and content_type = 'kanji' and content_id = content_id
            );
            item_index := item_index + 1;
          end if;
        end loop;
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N5 Mini Exam: Listening', 'Listening comprehension quiz across daily situations.', 40, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Mini Exam: Listening'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Mini Exam: Listening' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'listening_challenge', 'Quiz: Listening', 'Listening comprehension quiz across daily situations.', 3, 30, 12, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quiz: Listening'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quiz: Listening' limit 1;

    if lesson_id is not null then
      select id into content_id from public.listening_challenges where slug = 'n5-listening-mock' limit 1;
      if content_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'listening_challenge', content_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'listening_challenge' and content_id = content_id
        );
      end if;
    end if;
  end if;
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'N5 Mini Exam: Reading', 'Reading comprehension quiz with stories and dialogs.', 41, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'N5 Mini Exam: Reading'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'N5 Mini Exam: Reading' limit 1;

  if unit_id is not null then

    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', 'Quiz: Reading', 'Reading comprehension quiz with stories and dialogs.', 3, 25, 12, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = 'Quiz: Reading'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = 'Quiz: Reading' limit 1;

    if lesson_id is not null then
      item_index := 0;
      foreach story_slug in array array['rainy-day', 'at-the-market'] loop
        select id into content_id from public.stories where slug = story_slug limit 1;
        if content_id is not null then
          insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
          select lesson_id, 'story', content_id, item_index
          where not exists (
            select 1 from public.lesson_items
            where lesson_id = lesson_id and content_type = 'story' and content_id = content_id
          );
          item_index := item_index + 1;
        end if;
      end loop;
      foreach dialogue_slug in array array['making-plans'] loop
        select id into content_id from public.dialogue_scenarios where slug = dialogue_slug limit 1;
        if content_id is not null then
          insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
          select lesson_id, 'dialogue', content_id, item_index
          where not exists (
            select 1 from public.lesson_items
            where lesson_id = lesson_id and content_type = 'dialogue' and content_id = content_id
          );
          item_index := item_index + 1;
        end if;
      end loop;
    end if;
  end if;
end;
$unit_quizzes$;
