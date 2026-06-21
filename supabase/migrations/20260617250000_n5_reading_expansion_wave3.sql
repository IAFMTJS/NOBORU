-- N5 reading expansion wave 3

-- N5 reading stories (wave 3)

insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Summer Festival',
  'summer-festival',
  'A family enjoys food and fireworks at a summer festival.',
  'n5'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'summer-festival');


insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'First Part-Time Job',
  'first-part-time-job',
  'Yuki starts her first part-time job at a bookstore.',
  'n5'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'first-part-time-job');


do $story_content_wave3$
#variable_conflict use_variable
declare
  story_id uuid;
begin

  select id into story_id from public.stories where slug = 'summer-festival' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('夏祭りに家族で行きます。', 'Natsu matsuri ni kazoku de ikimasu.', 'The family goes to the summer festival.', 0),
        ('たこ焼きとかき氷を食べます。', 'Takoyaki to kakigoori o tabemasu.', 'They eat takoyaki and shaved ice.', 1),
        ('夜、花火がとてもきれいです。', 'Yoru, hanabi ga totemo kirei desu.', 'At night the fireworks are very beautiful.', 2),
        ('子供たちはうれしそうです。', 'Kodomo-tachi wa ureshisou desu.', 'The children look happy.', 3)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('Where does the family go?', '["Summer festival", "School", "Hospital", "Office"]'::jsonb, 0, 0),
        ('What do they eat?', '["Takoyaki and shaved ice", "Sushi and ramen", "Bread and coffee", "Rice and fish"]'::jsonb, 0, 1),
        ('How are the fireworks?', '["Very beautiful", "Very loud only", "Not visible", "Cancelled"]'::jsonb, 0, 2)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
  select id into story_id from public.stories where slug = 'first-part-time-job' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('ゆきさんは初めてアルバイトをします。', 'Yuki-san wa hajimete arubaito o shimasu.', 'Yuki has her first part-time job.', 0),
        ('本屋で週に三回働きます。', 'Hon''ya de shuu ni sankai hatarakimasu.', 'She works at a bookstore three times a week.', 1),
        ('最初は少し緊張しますが、先輩が優しく教えます。', 'Saisho wa sukoshi kinchou shimasu ga, senpai ga yasashiku oshiemasu.', 'At first she is a little nervous, but a senior coworker teaches her kindly.', 2),
        ('今、仕事がだんだん楽しくなりました。', 'Ima, shigoto ga dandan tanoshiku narimashita.', 'Now work is gradually becoming fun.', 3)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
        ('Where does Yuki work?', '["Bookstore", "Restaurant", "School", "Station"]'::jsonb, 0, 0),
        ('How often does she work?', '["Three times a week", "Every day", "Once a month", "Only weekends"]'::jsonb, 0, 1),
        ('How does she feel about work now?', '["It is becoming fun", "She wants to quit", "She is still very nervous", "She is angry"]'::jsonb, 0, 2)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
end;
$story_content_wave3$;

-- N5 dialogue scenarios (wave 3)

insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'At the Post Office',
  'at-the-post-office',
  'Send a package and ask about delivery time.',
  'n5'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'at-the-post-office');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Bus Schedule',
  'bus-schedule',
  'Ask when the next bus leaves for the airport.',
  'n5'::public.jlpt_level,
  1,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'bus-schedule');


insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Ordering a Taxi',
  'ordering-taxi',
  'Call a taxi and give your destination.',
  'n5'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'ordering-taxi');


do $dialogue_content_wave3$
#variable_conflict use_variable
declare
  scenario_id uuid;
begin

  select id into scenario_id from public.dialogue_scenarios where slug = 'at-the-post-office' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', 'いらっしゃいませ。', 'Irasshaimase.', 'Welcome.', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', 'この荷物を送りたいです。', 'Kono nimotsu o okuritai desu.', 'I want to send this package.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', 'どこへ送りますか。', 'Doko e okurimasu ka.', 'Where will you send it?', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', '大阪までお願いします。', 'Oosaka made onegaishimasu.', 'To Osaka, please.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Clerk', '三日くらいかかります。', 'Mikka kurai kakarimasu.', 'It takes about three days.', 'line', false, 4
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 4
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (1, 'I want to send this package.', true, 0),
        (1, 'I want to buy stamps.', false, 1),
        (1, 'Where is the station?', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'bus-schedule' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Traveler', 'すみません。空港行きのバスは何時ですか。', 'Sumimasen. Kuukou yuki no basu wa nanji desu ka.', 'Excuse me. What time is the bus to the airport?', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Staff', '次のバスは十時十五分です。', 'Tsugi no basu wa juuji juugofun desu.', 'The next bus is at ten fifteen.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Traveler', '切符はどこで買えますか。', 'Kippu wa doko de kaemasu ka.', 'Where can I buy a ticket?', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Staff', 'あちらの窓口で買えます。', 'Achira no madoguchi de kaemasu.', 'You can buy one at that counter.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (0, 'What time is the bus to the airport?', true, 0),
        (0, 'Where is the hotel?', false, 1),
        (0, 'How much is this shirt?', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
  select id into scenario_id from public.dialogue_scenarios where slug = 'ordering-taxi' limit 1;
  if scenario_id is not null then

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Driver', 'もしもし、タクシーです。', 'Moshi moshi, takushii desu.', 'Hello, this is the taxi company.', 'line', true, 0
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 0
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', '駅までお願いします。', 'Eki made onegaishimasu.', 'To the station, please.', 'line', false, 1
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 1
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Driver', '今どこにいますか。', 'Ima doko ni imasu ka.', 'Where are you now?', 'line', false, 2
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 2
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Customer', 'ホテルの前にいます。', 'Hoteru no mae ni imasu.', 'I am in front of the hotel.', 'line', false, 3
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 3
    );
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, 'Driver', '五分くらいで着きます。', 'Gofun kurai de tsukimasu.', 'I will arrive in about five minutes.', 'line', false, 4
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = 4
    );

    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        (1, 'To the station, please.', true, 0),
        (1, 'To the airport, please.', false, 1),
        (1, 'I am at school.', false, 2)
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );

  end if;
end;
$dialogue_content_wave3$;


-- Wire wave 3 reading content into Reading Comprehension unit
do $reading_unit_wave3$
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
    select id from public.stories
    where status = 'published' and jlpt_level = 'n5'
      and slug in ('summer-festival', 'first-part-time-job')
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
    select id from public.dialogue_scenarios
    where status = 'published' and jlpt_level = 'n5'
      and slug in ('at-the-post-office', 'bus-schedule', 'ordering-taxi')
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
$reading_unit_wave3$;
