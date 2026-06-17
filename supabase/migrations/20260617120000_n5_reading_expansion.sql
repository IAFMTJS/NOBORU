-- N5 reading expansion wave 2

-- N5 reading stories (wave 2)

insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'A Rainy Day',
  'rainy-day',
  'Yuki stays home and reads on a rainy afternoon.',
  'n5'::public.jlpt_level,
  1,
  3,
  'published'
where not exists (select 1 from public.stories where slug = 'rainy-day');


insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'At the Market',
  'at-the-market',
  'Ken buys fruit and vegetables at the local market.',
  'n5'::public.jlpt_level,
  1,
  4,
  'published'
where not exists (select 1 from public.stories where slug = 'at-the-market');


insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Train Commute',
  'train-commute',
  'Tanaka takes the train to work every morning.',
  'n5'::public.jlpt_level,
  2,
  4,
  'published'
where not exists (select 1 from public.stories where slug = 'train-commute');


insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Birthday Surprise',
  'birthday-surprise',
  'Friends prepare a surprise for Sato''s birthday.',
  'n5'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'birthday-surprise');


insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Weekend Trip',
  'weekend-trip',
  'A family plans a short trip to the mountains.',
  'n5'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'weekend-trip');


do $story_content$
#variable_conflict use_variable
declare
  story_id uuid;
begin

  select id into story_id from public.stories where slug = 'rainy-day' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('今日は雨です。', 'Kyou wa ame desu.', 'Today it is rainy.', 0),
        ('ゆきさんは家にいます。', 'Yuki-san wa ie ni imasu.', 'Yuki is at home.', 1),
        ('本を読んで、お茶を飲みます。', 'Hon o yonde, ocha o nomimasu.', 'She reads a book and drinks tea.', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('What is the weather today?', '["Rainy", "Sunny", "Snowy", "Windy"]'::jsonb, 0, 0),
        ('What does Yuki do?', '["Reads and drinks tea", "Goes shopping", "Plays sports", "Goes to school"]'::jsonb, 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
  select id into story_id from public.stories where slug = 'at-the-market' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('けんさんは市場へ行きます。', 'Ken-san wa ichiba e ikimasu.', 'Ken goes to the market.', 0),
        ('りんごと野菜を買います。', 'Ringo to yasai o kaimasu.', 'He buys apples and vegetables.', 1),
        ('「全部で五百円です。」', 'Zenbu de gohyaku en desu.', '"The total is five hundred yen."', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('Where does Ken go?', '["The market", "The station", "School", "The hospital"]'::jsonb, 0, 0),
        ('What does Ken buy?', '["Apples and vegetables", "Fish and meat", "Books", "Clothes"]'::jsonb, 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
  select id into story_id from public.stories where slug = 'train-commute' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('田中さんは毎朝六時に起きます。', 'Tanaka-san wa maiasa rokuji ni okimasu.', 'Tanaka wakes up at six every morning.', 0),
        ('七時に電車に乗ります。', 'Shichiji ni densha ni norimasu.', 'He gets on the train at seven.', 1),
        ('八時半に会社に着きます。', 'Hachiji han ni kaisha ni tsukimasu.', 'He arrives at the office at eight thirty.', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('When does Tanaka wake up?', '["Six o''clock", "Seven o''clock", "Eight o''clock", "Nine o''clock"]'::jsonb, 0, 0),
        ('When does he arrive at work?', '["Eight thirty", "Seven thirty", "Nine o''clock", "Six thirty"]'::jsonb, 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
  select id into story_id from public.stories where slug = 'birthday-surprise' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('今日は佐藤さんの誕生日です。', 'Kyou wa Satou-san no tanjoubi desu.', 'Today is Sato''s birthday.', 0),
        ('友達はケーキとプレゼントを用意します。', 'Tomodachi wa keeki to purezento o youi shimasu.', 'Friends prepare a cake and a present.', 1),
        ('「お誕生日おめでとう！」', 'Otanjoubi omedetou!', '"Happy birthday!"', 2),
        ('佐藤さんはとても嬉しいです。', 'Satou-san wa totemo ureshii desu.', 'Sato is very happy.', 3)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('Whose birthday is it?', '["Sato''s", "Tanaka''s", "Yuki''s", "Ken''s"]'::jsonb, 0, 0),
        ('How does Sato feel?', '["Very happy", "Angry", "Sad", "Tired"]'::jsonb, 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
  select id into story_id from public.stories where slug = 'weekend-trip' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('土曜日に家族で山へ行きます。', 'Doyoubi ni kazoku de yama e ikimasu.', 'On Saturday the family goes to the mountains.', 0),
        ('天気は晴れです。', 'Tenki wa hare desu.', 'The weather is clear.', 1),
        ('昼ご飯を食べて、写真を撮ります。', 'Hirugohan o tabete, shashin o torimasu.', 'They eat lunch and take photos.', 2),
        ('日曜日の夜、家に帰ります。', 'Nichiyoubi no yoru, ie ni kaerimasu.', 'On Sunday evening they return home.', 3)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('When do they go to the mountains?', '["Saturday", "Sunday", "Monday", "Friday"]'::jsonb, 0, 0),
        ('What is the weather?', '["Clear", "Rainy", "Cloudy", "Snowy"]'::jsonb, 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
end;
$story_content$;

-- N5 dialogue scenarios (wave 2)

insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'At the Doctor',
  'at-the-doctor',
  'Describe symptoms and ask for medicine.',
  'n5'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'at-the-doctor');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Buying Clothes',
  'buying-clothes',
  'Shop for clothes and ask about size.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'buying-clothes');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Making Plans',
  'making-plans',
  'Arrange to meet a friend on the weekend.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'making-plans');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'At the Hotel',
  'at-the-hotel',
  'Check in and ask about breakfast.',
  'n5'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'at-the-hotel');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Asking for Help',
  'asking-help',
  'Ask a stranger for directions on the street.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'asking-help');


do $dialogue_content$
#variable_conflict use_variable
declare
  scenario_id uuid;
begin

  select id into scenario_id from public.dialogue_scenarios where slug = 'at-the-doctor' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Doctor', 'どうしましたか。', 'Dou shimashita ka.', 'What is wrong?', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Patient', '頭が痛いです。', 'Atama ga itai desu.', 'My head hurts.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Doctor', '熱はありますか。', 'Netsu wa arimasu ka.', 'Do you have a fever?', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Patient', 'はい、少しあります。', 'Hai, sukoshi arimasu.', 'Yes, a little.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (2, 'I have a fever.', false, 0),
        (2, 'Yes, a little.', true, 1),
        (2, 'No, thank you.', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'buying-clothes' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', 'いらっしゃいませ。', 'Irasshaimase.', 'Welcome.', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', 'このシャツはいくらですか。', 'Kono shatsu wa ikura desu ka.', 'How much is this shirt?', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', '二千円です。', 'Nisen en desu.', 'It is two thousand yen.', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', 'じゃあ、ください。', 'Jaa, kudasai.', 'Then I will take it.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (1, 'How much is this shirt?', true, 0),
        (1, 'Where is the station?', false, 1),
        (1, 'What time is it?', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'making-plans' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'A', '土曜日、暇ですか。', 'Doyoubi, hima desu ka.', 'Are you free on Saturday?', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'B', 'はい、暇です。', 'Hai, hima desu.', 'Yes, I am free.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'A', '映画を見に行きませんか。', 'Eiga o mi ni ikimasen ka.', 'Shall we go see a movie?', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'B', 'いいですね。三時はどうですか。', 'Ii desu ne. Sanji wa dou desu ka.', 'Sounds good. How about three?', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (2, 'Shall we go see a movie?', true, 0),
        (2, 'Let''s study together.', false, 1),
        (2, 'I am busy today.', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'at-the-hotel' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Guest', '予約をしています。', 'Yoyaku o shite imasu.', 'I have a reservation.', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', 'お名前をお願いします。', 'Onamae o onegaishimasu.', 'Your name, please.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Guest', '山田です。', 'Yamada desu.', 'Yamada.', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', '朝ご飯は七時からです。', 'Asagohan wa shichiji kara desu.', 'Breakfast is from seven.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (1, 'Your name, please.', false, 0),
        (1, 'I have a reservation.', true, 1),
        (1, 'Where is the station?', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'asking-help' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Traveler', 'すみません。', 'Sumimasen.', 'Excuse me.', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Traveler', '駅はどこですか。', 'Eki wa doko desu ka.', 'Where is the station?', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Local', 'まっすぐ行って、右に曲がってください。', 'Massugu itte, migi ni magatte kudasai.', 'Go straight and turn right.', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Traveler', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Thank you very much.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (1, 'Where is the station?', true, 0),
        (1, 'How much is this?', false, 1),
        (1, 'What time is it?', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
end;
$dialogue_content$;


-- Expand reading unit with new stories and dialogues
do $reading_unit$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  story_id uuid;
  scenario_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  select id into unit_id from public.units
  where region_id = region_id and name = 'Reading Comprehension' limit 1;

  if unit_id is null then return; end if;

  for story_id in
    select id from public.stories where status = 'published' and jlpt_level = 'n5' order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'story',
      s.title,
      coalesce(s.summary, 'Read and answer comprehension questions.'),
      s.difficulty,
      15,
      s.estimated_read_time,
      'published'
    from public.stories s
    where s.id = story_id
      and not exists (
        select 1 from public.lessons l where l.unit_id = unit_id and l.title = s.title
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

  for scenario_id in
    select id from public.dialogue_scenarios where status = 'published' and jlpt_level = 'n5' order by title
  loop
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select
      unit_id,
      'dialogue',
      d.title,
      coalesce(d.description, 'Practice a short conversation.'),
      d.difficulty,
      15,
      6,
      'published'
    from public.dialogue_scenarios d
    where d.id = scenario_id
      and not exists (
        select 1 from public.lessons l where l.unit_id = unit_id and l.title = d.title
      );

    select l.id into lesson_id
    from public.lessons l
    inner join public.dialogue_scenarios d on d.title = l.title
    where l.unit_id = unit_id and d.id = scenario_id
    limit 1;

    if lesson_id is not null then
      insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
      select lesson_id, 'dialogue', scenario_id, 0
      where not exists (
        select 1 from public.lesson_items
        where lesson_id = lesson_id and content_type = 'dialogue' and content_id = scenario_id
      );
    end if;
  end loop;
end;
$reading_unit$;
