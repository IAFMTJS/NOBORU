-- Phase 22 follow-up: N4 reading, listening, trials, and region curriculum wiring

-- N4 stories
insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Office Morning',
  'office-morning',
  'Follow Sato through a busy morning at the office.',
  'n4'::public.jlpt_level,
  2,
  4,
  'published'
where not exists (select 1 from public.stories where slug = 'office-morning');

insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  'Travel Plans',
  'travel-plans-n4',
  'Yuki and Ken decide on weekend travel plans.',
  'n4'::public.jlpt_level,
  2,
  5,
  'published'
where not exists (select 1 from public.stories where slug = 'travel-plans-n4');

do $n4_story_sections$
#variable_conflict use_variable
declare
  story_id uuid;
begin
  select id into story_id from public.stories where slug = 'office-morning' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('佐藤さんは 七時に 起きて、準備を します。', 'Sato-san wa shichiji ni okite, junbi o shimasu.', 'Sato wakes up at seven and gets ready.', 0),
        ('八時に 会社へ 行って、仕事を 始めます。', 'Hachiji ni kaisha e itte, shigoto o hajimemasu.', 'At eight he goes to the company and starts work.', 1),
        ('昼ごはんの あと、会議が あります。', 'Hirugohan no ato, kaigi ga arimasu.', 'After lunch there is a meeting.', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'travel-plans-n4' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
        ('ゆきさんは 週末、旅行に 行く つもり です。', 'Yuki-san wa shuumatsu, ryokou ni iku tsumori desu.', 'Yuki intends to go on a trip this weekend.', 0),
        ('けんさんと 相談して、場所を 決めます。', 'Ken-san to soudan shite, basho o kimemasu.', 'She discusses with Ken and decides on a place.', 1),
        ('「特に 海の 近くが 好きです。」', 'Tokuni umi no chikaku ga suki desu.', '"I especially like places near the sea."', 2)
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );
  end if;
end;
$n4_story_sections$;

do $n4_reading_questions$
#variable_conflict use_variable
declare
  story_id uuid;
begin
  select id into story_id from public.stories where slug = 'office-morning' limit 1;
  if story_id is not null then
    insert into public.reading_questions (story_id, question, options, correct_option_index, order_index, status)
    select story_id, v.question, v.options::jsonb, v.correct_option_index, v.order_index, 'published'
    from (
      values
        ('What time does Sato wake up?', '["Seven o''clock", "Eight o''clock", "Nine o''clock", "Six o''clock"]', 0, 0),
        ('What happens after lunch?', '["A meeting", "A trip", "Shopping", "Exercise"]', 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;

  select id into story_id from public.stories where slug = 'travel-plans-n4' limit 1;
  if story_id is not null then
    insert into public.reading_questions (story_id, question, options, correct_option_index, order_index, status)
    select story_id, v.question, v.options::jsonb, v.correct_option_index, v.order_index, 'published'
    from (
      values
        ('What does Yuki plan to do this weekend?', '["Go on a trip", "Stay home", "Study kanji", "Work overtime"]', 0, 0),
        ('What kind of place does Yuki prefer?', '["Near the sea", "In the mountains", "In the city", "In the countryside"]', 0, 1)
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;
end;
$n4_reading_questions$;

-- N4 dialogues
insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'At the Office',
  'office-chat',
  'Ask a coworker about work plans politely.',
  'n4'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'office-chat');

insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  'Planning a Trip',
  'trip-planning',
  'Discuss weekend travel plans with a friend.',
  'n4'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = 'trip-planning');

do $n4_dialogue_seed$
#variable_conflict use_variable
declare
  scenario_id uuid;
  node_coworker uuid;
  node_you uuid;
  node_coworker2 uuid;
  node_friend uuid;
  node_you2 uuid;
  node_friend2 uuid;
begin
  select id into scenario_id from public.dialogue_scenarios where slug = 'office-chat' limit 1;
  if scenario_id is not null and not exists (
    select 1 from public.dialogue_nodes where scenario_id = scenario_id limit 1
  ) then
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Coworker',
      '今日、仕事は 何時に 始めますか。',
      'Kyou, shigoto wa nanji ni hajimemasu ka.',
      'What time does work start today?',
      'choice',
      true,
      0
    )
    returning id into node_coworker;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'You',
      '九時に 始める つもり です。',
      'Kuji ni hajimeru tsumori desu.',
      'I plan to start at nine.',
      'line',
      false,
      1
    )
    returning id into node_you;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Coworker',
      'わかりました。準備を お願いします。',
      'Wakarimashita. Junbi o onegaishimasu.',
      'Understood. Please get ready.',
      'line',
      false,
      2
    )
    returning id into node_coworker2;

    insert into public.dialogue_choices (node_id, choice_text, next_node_id, is_correct, order_index)
    values
      (node_coworker, '九時です。', node_you, true, 0),
      (node_coworker, '分かりません。', null, false, 1);
  end if;

  select id into scenario_id from public.dialogue_scenarios where slug = 'trip-planning' limit 1;
  if scenario_id is not null and not exists (
    select 1 from public.dialogue_nodes where scenario_id = scenario_id limit 1
  ) then
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Friend',
      '週末、旅行に 行く つもり ですか。',
      'Shuumatsu, ryokou ni iku tsumori desu ka.',
      'Do you plan to go on a trip this weekend?',
      'choice',
      true,
      0
    )
    returning id into node_friend;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'You',
      'はい、海の 近くへ 行きたいです。',
      'Hai, umi no chikaku e ikitai desu.',
      'Yes, I want to go near the sea.',
      'line',
      false,
      1
    )
    returning id into node_you2;

    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    values (
      scenario_id,
      'Friend',
      'いいですね。一緒に 行きましょう。',
      'Ii desu ne. Issho ni ikimashou.',
      'Sounds good. Let us go together.',
      'line',
      false,
      2
    )
    returning id into node_friend2;

    insert into public.dialogue_choices (node_id, choice_text, next_node_id, is_correct, order_index)
    values
      (node_friend, 'はい、行きたいです。', node_you2, true, 0),
      (node_friend, 'いいえ、忙しいです。', null, false, 1);
  end if;
end;
$n4_dialogue_seed$;

-- N4 listening exercises
insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Work Schedule',
  'work-schedule',
  '明日、会社に 行く つもり です。',
  'Ashita, kaisha ni iku tsumori desu.',
  'Tomorrow, I plan to go to the company.',
  'What does the speaker plan to do tomorrow?',
  '["Go to the company", "Stay home", "Go shopping", "Study abroad"]'::jsonb,
  0,
  'n4'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'work-schedule');

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Borrowing a Book',
  'borrowing-book',
  'すみません。本を 借りても いい ですか。',
  'Sumimasen. Hon o karite mo ii desu ka.',
  'Excuse me. May I borrow a book?',
  'What is the speaker asking to do?',
  '["Borrow a book", "Buy a book", "Return a book", "Write a book"]'::jsonb,
  0,
  'n4'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'borrowing-book');

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Weekend Intention',
  'weekend-intention',
  '週末、旅行に 行く つもり です。',
  'Shuumatsu, ryokou ni iku tsumori desu.',
  'I plan to go on a trip this weekend.',
  'What does the speaker intend to do?',
  '["Go on a trip", "Work overtime", "Clean the kitchen", "Borrow money"]'::jsonb,
  0,
  'n4'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'weekend-intention');

insert into public.listening_challenges (
  title, slug, description, jlpt_level, difficulty, status
)
select
  'N4 Daily Life',
  'n4-daily-life',
  'Listen to three short N4 conversations in a row.',
  'n4'::public.jlpt_level,
  2,
  'published'
where not exists (select 1 from public.listening_challenges where slug = 'n4-daily-life');

do $n4_challenge_items$
#variable_conflict use_variable
declare
  challenge_id uuid;
  exercise_id uuid;
  exercise_slugs text[] := array['work-schedule', 'borrowing-book', 'weekend-intention'];
  slug_value text;
  item_index integer := 0;
begin
  select id into challenge_id from public.listening_challenges
  where slug = 'n4-daily-life' limit 1;

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
$n4_challenge_items$;

-- Mount N4 reading unit
do $n4_reading_unit$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  story_id uuid;
  dialogue_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n4' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Reading Comprehension', 'Stories and dialogs for N4 reading practice.', 6, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Reading Comprehension'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Reading Comprehension' limit 1;

  if unit_id is null then return; end if;

  for story_id in
    select id from public.stories where status = 'published' and jlpt_level = 'n4' order by title
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
    select id from public.dialogue_scenarios where status = 'published' and jlpt_level = 'n4' order by title
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
$n4_reading_unit$;

-- Mount N4 listening unit
do $n4_listening_unit$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  challenge_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n4' limit 1;
  if region_id is null then return; end if;

  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Listening Practice', 'Audio lessons and listening challenges for N4.', 7, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Listening Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Listening Practice' limit 1;

  if unit_id is null then return; end if;

  for exercise_id in
    select id from public.listening_exercises
    where status = 'published' and jlpt_level = 'n4'
    order by title
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
    select id from public.listening_challenges
    where status = 'published' and jlpt_level = 'n4'
    order by title
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
$n4_listening_unit$;

-- N4 trials
insert into public.trial_templates (
  slug, region_slug, kind, title, description, boss_name,
  pass_score, time_limit_seconds, ep_reward, min_region_progress_percent,
  prerequisite_trial_slug, sort_order, status
)
select * from (
  values
    (
      'mount-n4-proving-ground',
      'mount-n4',
      'regional_challenge'::public.trial_kind,
      'N4 Proving Ground',
      'Mixed N4 vocabulary and grammar recall before the keeper trial.',
      'Ascent Warden',
      75, 240, 150, 80, null::text, 6, 'published'::public.content_status
    ),
    (
      'n4-keeper',
      'mount-n4',
      'boss_trial'::public.trial_kind,
      'N4 Keeper Trial',
      'Face the keeper guarding the N4 ascent path.',
      'N4 Keeper',
      75, 300, 250, 90, 'mount-n4-proving-ground', 7, 'published'::public.content_status
    ),
    (
      'n4-final-trial',
      'mount-n4',
      'final_trial'::public.trial_kind,
      'Final N4 Trial',
      'The capstone challenge validating N4 recall and comprehension.',
      'Summit Herald',
      80, 420, 350, 95, 'n4-keeper', 8, 'published'::public.content_status
    )
) as seed (slug, region_slug, kind, title, description, boss_name, pass_score, time_limit_seconds, ep_reward, min_region_progress_percent, prerequisite_trial_slug, sort_order, status)
where not exists (select 1 from public.trial_templates existing where existing.slug = seed.slug);

with trial as (
  select id from public.trial_templates where slug = 'mount-n4-proving-ground' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index)
select trial.id, s.order_index, 'choice_recall'::public.trial_step_kind, s.prompt, s.display_text, s.accepted_answers::jsonb, s.options::jsonb, s.correct_index
from trial,
(values
  (1, 'What does this word mean?', '仕事', null, '["Work, job","Travel","Promise","Kitchen"]', 0),
  (2, 'What does this word mean?', '旅行', null, '["Travel, trip","Work","Worry","Experience"]', 0),
  (3, 'What does this word mean?', '準備', null, '["Preparation","Habit","Life","Decision"]', 0),
  (4, 'What does this mean?', '始める', null, '["To begin","To return","To borrow","To lend"]', 0),
  (5, 'What does this mean?', '借りる', null, '["To borrow","To lend","To continue","To decide"]', 0),
  (6, 'Choose the best meaning.', 'つもり', null, '["Intention, plan","Especially","If","Inconvenient"]', 0),
  (7, 'Choose the best meaning.', '特に', null, '["Especially","If","Work","Promise"]', 0),
  (8, 'What does this mean?', '不便', null, '["Inconvenient","Fun","Busy","Cheap"]', 0)
) as s(order_index, prompt, display_text, accepted_answers, options, correct_index)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

with trial as (
  select id from public.trial_templates where slug = 'n4-keeper' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
select trial.id, s.order_index, s.step_kind::public.trial_step_kind, s.prompt, s.display_text,
  s.accepted_answers::jsonb, s.options::jsonb, s.correct_index, s.match_pairs::jsonb
from trial,
(values
  (1, 'typed_recall', 'Type the meaning in English.', '会社', '["company"]', null, null, null),
  (2, 'choice_recall', 'What does this mean?', '経験', null, '["Experience","Promise","Habit","Kitchen"]', 0, null),
  (3, 'typed_recall', 'Type the meaning in English.', '約束', '["promise"]', null, null, null),
  (4, 'choice_recall', 'What does this mean?', '心配', null, '["Worry","Travel","Work","Life"]', 0, null),
  (5, 'matching', 'Match each word to its meaning.', 'Match the pairs', null, null, null,
    '[{"id":"k1","prompt":"続ける","answer":"to continue"},{"id":"k2","prompt":"決める","answer":"to decide"},{"id":"k3","prompt":"戻る","answer":"to return"}]'),
  (6, 'choice_recall', 'What does this mean?', '台所', null, '["Kitchen","Office","Company","Trip"]', 0, null),
  (7, 'typed_recall', 'Type the meaning in English.', '生活', '["life","living"]', null, null, null),
  (8, 'choice_recall', 'What does this mean?', '習慣', null, '["Habit","Promise","Travel","Work"]', 0, null),
  (9, 'typed_recall', 'Type the meaning in English.', 'もし', '["if"]', null, null, null),
  (10, 'choice_recall', 'What does this mean?', '貸す', null, '["To lend","To borrow","To begin","To return"]', 0, null)
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);

with trial as (
  select id from public.trial_templates where slug = 'n4-final-trial' limit 1
)
insert into public.trial_steps (trial_template_id, order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
select trial.id, s.order_index, s.step_kind::public.trial_step_kind, s.prompt, s.display_text,
  s.accepted_answers::jsonb, s.options::jsonb, s.correct_index, s.match_pairs::jsonb
from trial,
(values
  (1, 'choice_recall', 'What does this mean?', '仕事', null, '["Work, job","Travel","Kitchen","Habit"]', 0, null),
  (2, 'typed_recall', 'Type the meaning in English.', '留学', '["study abroad"]', null, null, null),
  (3, 'choice_recall', 'What does this mean?', '旅行', null, '["Travel, trip","Company","Promise","Life"]', 0, null),
  (4, 'typed_recall', 'Type the meaning in English.', '準備', '["preparation"]', null, null, null),
  (5, 'choice_recall', 'What does this mean?', '始める', null, '["To begin","To borrow","To return","To lend"]', 0, null),
  (6, 'matching', 'Match N4 words to meanings.', 'Match the pairs', null, null, null,
    '[{"id":"f1","prompt":"借りる","answer":"to borrow"},{"id":"f2","prompt":"貸す","answer":"to lend"},{"id":"f3","prompt":"続ける","answer":"to continue"},{"id":"f4","prompt":"決める","answer":"to decide"}]'),
  (7, 'choice_recall', 'What does this mean?', '特に', null, '["Especially","If","Work","Promise"]', 0, null),
  (8, 'typed_recall', 'Type the meaning in English.', '不便', '["inconvenient"]', null, null, null),
  (9, 'choice_recall', 'What does this mean?', '生活', null, '["Life, living","Travel","Work","Habit"]', 0, null),
  (10, 'typed_recall', 'Type the meaning in English.', '習慣', '["habit"]', null, null, null),
  (11, 'choice_recall', 'What does this kanji mean?', '働', null, '["Work","Walk","Think","Special"]', 0, null),
  (12, 'choice_recall', 'What does this kanji mean?', '考', null, '["Think","Work","Gather","Change"]', 0, null)
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);
