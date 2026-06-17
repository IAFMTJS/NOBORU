-- N5 listening expansion wave 2

-- N5 listening exercises (wave 2)

insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Ordering Food',
  'ordering-food',
  'すみません。ラーメンを 一つ ください。',
  'Sumimasen. Raamen o hitotsu kudasai.',
  'Excuse me. One ramen, please.',
  'What does the customer order?',
  '["Ramen", "Rice", "Coffee", "Bread"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'ordering-food');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Asking the Time',
  'asking-time',
  'すみません。今 何時 ですか。',
  'Sumimasen. Ima nanji desu ka.',
  'Excuse me. What time is it now?',
  'What is the speaker asking?',
  '["The time", "The price", "The location", "The weather"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'asking-time');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Today''s Weather',
  'weather-today',
  '今日は 雨 です。かさを 持って ください。',
  'Kyou wa ame desu. Kasa o motte kudasai.',
  'Today it is rainy. Please bring an umbrella.',
  'What should you bring?',
  '["An umbrella", "A hat", "Glasses", "A bag"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'weather-today');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'At the Restaurant',
  'at-restaurant',
  'メニューを 見せて ください。お茶も お願いします。',
  'Menyuu o misete kudasai. Ocha mo onegaishimasu.',
  'Please show me the menu. Tea as well, please.',
  'What else does the customer want?',
  '["Tea", "Water", "Rice", "Beer"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'at-restaurant');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Making an Appointment',
  'making-appointment',
  '来週の 月曜日、三時は 大丈夫 ですか。',
  'Raishuu no getsuyoubi, sanji wa daijoubu desu ka.',
  'Is three o''clock next Monday okay?',
  'When is the appointment?',
  '["Next Monday at 3", "Today at 3", "Next Friday at 5", "Tomorrow at noon"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'making-appointment');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Turning Left',
  'asking-directions-left',
  'この 角を 左に 曲がって ください。',
  'Kono kado o hidari ni magatte kudasai.',
  'Please turn left at this corner.',
  'Which direction should you turn?',
  '["Left", "Right", "Straight", "Back"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'asking-directions-left');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Buying a Ticket',
  'buying-ticket',
  '東京までの 切符を 二枚 ください。',
  'Toukyou made no kippu o nimai kudasai.',
  'Two tickets to Tokyo, please.',
  'How many tickets does the customer want?',
  '["Two", "One", "Three", "Four"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'buying-ticket');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Phone Message',
  'phone-message',
  '田中です。六時に 家に 帰ります。',
  'Tanaka desu. Rokuji ni ie ni kaerimasu.',
  'This is Tanaka. I will return home at six.',
  'When will Tanaka come home?',
  '["At six", "At eight", "At noon", "Tomorrow"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'phone-message');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Feeling Unwell',
  'feeling-sick',
  '頭が 痛いです。薬を ください。',
  'Atama ga itai desu. Kusuri o kudasai.',
  'My head hurts. Medicine, please.',
  'What does the speaker need?',
  '["Medicine", "Water", "Food", "A map"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'feeling-sick');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Classroom Question',
  'classroom-question',
  '先生、もう 一度 言って ください。',
  'Sensei, mou ichido itte kudasai.',
  'Teacher, please say it one more time.',
  'What does the student ask the teacher?',
  '["Say it again", "Write it down", "Go slower", "Open the book"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'classroom-question');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Weekend Hobby',
  'weekend-hobby',
  '土曜日に 映画を 見に 行きます。',
  'Doyoubi ni eiga o mi ni ikimasu.',
  'On Saturday I will go to see a movie.',
  'What will the speaker do on Saturday?',
  '["Watch a movie", "Play sports", "Study", "Go shopping"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'weekend-hobby');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Hotel Check-in',
  'hotel-checkin',
  '予約を しています。名前は 山田です。',
  'Yoyaku o shite imasu. Namae wa Yamada desu.',
  'I have a reservation. My name is Yamada.',
  'What is the guest''s name?',
  '["Yamada", "Tanaka", "Sato", "Suzuki"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'hotel-checkin');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Asking About Price',
  'asking-price-discount',
  'これは いくら ですか。少し 安く なりますか。',
  'Kore wa ikura desu ka. Sukoshi yasuku narimasu ka.',
  'How much is this? Can it be a little cheaper?',
  'What does the customer want?',
  '["A lower price", "A larger size", "Another color", "A receipt"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'asking-price-discount');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Meeting at the Station',
  'meeting-friend-station',
  '駅の 北口で 会いましょう。三時に。',
  'Eki no kitaguchi de aimashou. Sanji ni.',
  'Let''s meet at the north exit of the station. At three.',
  'Where will they meet?',
  '["North exit of the station", "South exit", "At home", "At school"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'meeting-friend-station');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Describing a Room',
  'describing-room',
  'この 部屋は 広くて 明るいです。',
  'Kono heya wa hirokute akarui desu.',
  'This room is spacious and bright.',
  'How is the room described?',
  '["Spacious and bright", "Small and dark", "Old and noisy", "Cold and wet"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'describing-room');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Birthday Party',
  'birthday-party',
  '日曜日に 誕生日パーティーが あります。来て ください。',
  'Nichiyoubi ni tanjoubi paatii ga arimasu. Kite kudasai.',
  'There is a birthday party on Sunday. Please come.',
  'When is the party?',
  '["Sunday", "Saturday", "Monday", "Friday"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'birthday-party');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Lost Item',
  'lost-item',
  'かばんを なくしました。どこで 見つかりますか。',
  'Kaban o nakushimashita. Doko de mitsukarimasu ka.',
  'I lost my bag. Where can I find it?',
  'What did the speaker lose?',
  '["A bag", "A phone", "A ticket", "A book"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  2,
  3,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'lost-item');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Taking a Photo',
  'taking-photo',
  'すみません。写真を 撮って もらえますか。',
  'Sumimasen. Shashin o totte moraemasu ka.',
  'Excuse me. Could you take a photo for me?',
  'What does the speaker ask for?',
  '["To take a photo", "Directions", "The time", "Help carrying bags"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'taking-photo');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Study Plan',
  'study-plan',
  '毎日 一時間 日本語を 勉強します。',
  'Mainichi ichijikan nihongo o benkyou shimasu.',
  'I study Japanese for one hour every day.',
  'How long does the speaker study each day?',
  '["One hour", "Thirty minutes", "Two hours", "Three hours"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'study-plan');


insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  'Saying Goodbye',
  'goodbye-friend',
  'じゃあ、また 来週。気を つけて。',
  'Jaa, mata raishuu. Ki o tsukete.',
  'Well then, see you next week. Take care.',
  'When will they meet again?',
  '["Next week", "Tomorrow", "Next month", "Tonight"]'::jsonb,
  0,
  'n5'::public.jlpt_level,
  1,
  2,
  'published'
where not exists (select 1 from public.listening_exercises where slug = 'goodbye-friend');


-- Listening challenges (wave 2)
insert into public.listening_challenges (title, slug, description, jlpt_level, difficulty, status)
select c.title, c.slug, c.description, 'n5'::public.jlpt_level, c.difficulty, 'published'
from (
  values
  ('daily-life-listening', 'Daily Life Listening', 'Four short N5 conversations about everyday situations.', 1),  ('travel-and-directions', 'Travel & Directions', 'Listen to travel and navigation phrases.', 1),  ('school-and-work', 'School & Work', 'Classroom and workplace listening practice.', 2),  ('shopping-and-services', 'Shopping & Services', 'Shop, hotel, and service encounters.', 2),  ('n5-listening-mock', 'N5 Listening Mock Exam', 'Six-part listening mock exam covering greetings, travel, health, and social situations.', 3)
) as c(slug, title, description, difficulty)
where not exists (
  select 1 from public.listening_challenges existing where existing.slug = c.slug
);

do $challenge_items$
#variable_conflict use_variable
declare
  challenge_rec record;
  challenge_id uuid;
  exercise_id uuid;
  slug_value text;
  item_index integer;
  exercise_slugs text[];
begin
  for challenge_rec in
    select slug from public.listening_challenges
    where slug in ('daily-life-listening', 'travel-and-directions', 'school-and-work', 'shopping-and-services', 'n5-listening-mock')
  loop
    select id into challenge_id from public.listening_challenges
    where slug = challenge_rec.slug limit 1;

    exercise_slugs := case challenge_rec.slug
    when 'daily-life-listening' then array['ordering-food', 'asking-time', 'weather-today', 'at-restaurant']
    when 'travel-and-directions' then array['asking-directions-left', 'buying-ticket', 'meeting-friend-station', 'finding-station']
    when 'school-and-work' then array['classroom-question', 'phone-message', 'study-plan', 'making-appointment']
    when 'shopping-and-services' then array['asking-price-discount', 'hotel-checkin', 'lost-item', 'taking-photo']
    when 'n5-listening-mock' then array['greeting-friend', 'buying-ticket', 'feeling-sick', 'weekend-hobby', 'birthday-party', 'goodbye-friend']
      else array[]::text[]
    end;

    item_index := 0;
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
  end loop;
end;
$challenge_items$;


-- Expand listening unit with new exercises and challenges
do $listening_unit$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  exercise_id uuid;
  challenge_id uuid;
begin
  select id into region_id from public.regions where slug = 'mount-n5' limit 1;
  if region_id is null then return; end if;

  select id into unit_id from public.units
  where region_id = region_id and name = 'Listening Practice' limit 1;

  if unit_id is null then return; end if;

  for exercise_id in
    select id from public.listening_exercises
    where status = 'published' and jlpt_level = 'n5'
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
    where status = 'published' and jlpt_level = 'n5'
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
      10,
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
$listening_unit$;
