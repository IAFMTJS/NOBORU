"""Generate N5 listening expansion migration — exercises, challenges, trail lessons."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617100000_n5_listening_expansion.sql"

# (slug, title, japanese, romaji, english, question, options, correct_index, difficulty, duration_min)
Exercise = tuple[str, str, str, str, str, str, list[str], int, int, int]

EXERCISES: list[Exercise] = [
    (
        "ordering-food",
        "Ordering Food",
        "すみません。ラーメンを 一つ ください。",
        "Sumimasen. Raamen o hitotsu kudasai.",
        "Excuse me. One ramen, please.",
        "What does the customer order?",
        ["Ramen", "Rice", "Coffee", "Bread"],
        0,
        1,
        2,
    ),
    (
        "asking-time",
        "Asking the Time",
        "すみません。今 何時 ですか。",
        "Sumimasen. Ima nanji desu ka.",
        "Excuse me. What time is it now?",
        "What is the speaker asking?",
        ["The time", "The price", "The location", "The weather"],
        0,
        1,
        2,
    ),
    (
        "weather-today",
        "Today's Weather",
        "今日は 雨 です。かさを 持って ください。",
        "Kyou wa ame desu. Kasa o motte kudasai.",
        "Today it is rainy. Please bring an umbrella.",
        "What should you bring?",
        ["An umbrella", "A hat", "Glasses", "A bag"],
        0,
        1,
        2,
    ),
    (
        "at-restaurant",
        "At the Restaurant",
        "メニューを 見せて ください。お茶も お願いします。",
        "Menyuu o misete kudasai. Ocha mo onegaishimasu.",
        "Please show me the menu. Tea as well, please.",
        "What else does the customer want?",
        ["Tea", "Water", "Rice", "Beer"],
        0,
        1,
        2,
    ),
    (
        "making-appointment",
        "Making an Appointment",
        "来週の 月曜日、三時は 大丈夫 ですか。",
        "Raishuu no getsuyoubi, sanji wa daijoubu desu ka.",
        "Is three o'clock next Monday okay?",
        "When is the appointment?",
        ["Next Monday at 3", "Today at 3", "Next Friday at 5", "Tomorrow at noon"],
        0,
        2,
        3,
    ),
    (
        "asking-directions-left",
        "Turning Left",
        "この 角を 左に 曲がって ください。",
        "Kono kado o hidari ni magatte kudasai.",
        "Please turn left at this corner.",
        "Which direction should you turn?",
        ["Left", "Right", "Straight", "Back"],
        0,
        1,
        2,
    ),
    (
        "buying-ticket",
        "Buying a Ticket",
        "東京までの 切符を 二枚 ください。",
        "Toukyou made no kippu o nimai kudasai.",
        "Two tickets to Tokyo, please.",
        "How many tickets does the customer want?",
        ["Two", "One", "Three", "Four"],
        0,
        1,
        2,
    ),
    (
        "phone-message",
        "Phone Message",
        "田中です。六時に 家に 帰ります。",
        "Tanaka desu. Rokuji ni ie ni kaerimasu.",
        "This is Tanaka. I will return home at six.",
        "When will Tanaka come home?",
        ["At six", "At eight", "At noon", "Tomorrow"],
        0,
        1,
        2,
    ),
    (
        "feeling-sick",
        "Feeling Unwell",
        "頭が 痛いです。薬を ください。",
        "Atama ga itai desu. Kusuri o kudasai.",
        "My head hurts. Medicine, please.",
        "What does the speaker need?",
        ["Medicine", "Water", "Food", "A map"],
        0,
        2,
        3,
    ),
    (
        "classroom-question",
        "Classroom Question",
        "先生、もう 一度 言って ください。",
        "Sensei, mou ichido itte kudasai.",
        "Teacher, please say it one more time.",
        "What does the student ask the teacher?",
        ["Say it again", "Write it down", "Go slower", "Open the book"],
        0,
        1,
        2,
    ),
    (
        "weekend-hobby",
        "Weekend Hobby",
        "土曜日に 映画を 見に 行きます。",
        "Doyoubi ni eiga o mi ni ikimasu.",
        "On Saturday I will go to see a movie.",
        "What will the speaker do on Saturday?",
        ["Watch a movie", "Play sports", "Study", "Go shopping"],
        0,
        1,
        2,
    ),
    (
        "hotel-checkin",
        "Hotel Check-in",
        "予約を しています。名前は 山田です。",
        "Yoyaku o shite imasu. Namae wa Yamada desu.",
        "I have a reservation. My name is Yamada.",
        "What is the guest's name?",
        ["Yamada", "Tanaka", "Sato", "Suzuki"],
        0,
        2,
        3,
    ),
    (
        "asking-price-discount",
        "Asking About Price",
        "これは いくら ですか。少し 安く なりますか。",
        "Kore wa ikura desu ka. Sukoshi yasuku narimasu ka.",
        "How much is this? Can it be a little cheaper?",
        "What does the customer want?",
        ["A lower price", "A larger size", "Another color", "A receipt"],
        0,
        2,
        3,
    ),
    (
        "meeting-friend-station",
        "Meeting at the Station",
        "駅の 北口で 会いましょう。三時に。",
        "Eki no kitaguchi de aimashou. Sanji ni.",
        "Let's meet at the north exit of the station. At three.",
        "Where will they meet?",
        ["North exit of the station", "South exit", "At home", "At school"],
        0,
        1,
        2,
    ),
    (
        "describing-room",
        "Describing a Room",
        "この 部屋は 広くて 明るいです。",
        "Kono heya wa hirokute akarui desu.",
        "This room is spacious and bright.",
        "How is the room described?",
        ["Spacious and bright", "Small and dark", "Old and noisy", "Cold and wet"],
        0,
        2,
        3,
    ),
    (
        "birthday-party",
        "Birthday Party",
        "日曜日に 誕生日パーティーが あります。来て ください。",
        "Nichiyoubi ni tanjoubi paatii ga arimasu. Kite kudasai.",
        "There is a birthday party on Sunday. Please come.",
        "When is the party?",
        ["Sunday", "Saturday", "Monday", "Friday"],
        0,
        1,
        2,
    ),
    (
        "lost-item",
        "Lost Item",
        "かばんを なくしました。どこで 見つかりますか。",
        "Kaban o nakushimashita. Doko de mitsukarimasu ka.",
        "I lost my bag. Where can I find it?",
        "What did the speaker lose?",
        ["A bag", "A phone", "A ticket", "A book"],
        0,
        2,
        3,
    ),
    (
        "taking-photo",
        "Taking a Photo",
        "すみません。写真を 撮って もらえますか。",
        "Sumimasen. Shashin o totte moraemasu ka.",
        "Excuse me. Could you take a photo for me?",
        "What does the speaker ask for?",
        ["To take a photo", "Directions", "The time", "Help carrying bags"],
        0,
        1,
        2,
    ),
    (
        "study-plan",
        "Study Plan",
        "毎日 一時間 日本語を 勉強します。",
        "Mainichi ichijikan nihongo o benkyou shimasu.",
        "I study Japanese for one hour every day.",
        "How long does the speaker study each day?",
        ["One hour", "Thirty minutes", "Two hours", "Three hours"],
        0,
        1,
        2,
    ),
    (
        "goodbye-friend",
        "Saying Goodbye",
        "じゃあ、また 来週。気を つけて。",
        "Jaa, mata raishuu. Ki o tsukete.",
        "Well then, see you next week. Take care.",
        "When will they meet again?",
        ["Next week", "Tomorrow", "Next month", "Tonight"],
        0,
        1,
        2,
    ),
]

CHALLENGES: list[dict] = [
    {
        "slug": "daily-life-listening",
        "title": "Daily Life Listening",
        "description": "Four short N5 conversations about everyday situations.",
        "slugs": ["ordering-food", "asking-time", "weather-today", "at-restaurant"],
        "difficulty": 1,
    },
    {
        "slug": "travel-and-directions",
        "title": "Travel & Directions",
        "description": "Listen to travel and navigation phrases.",
        "slugs": ["asking-directions-left", "buying-ticket", "meeting-friend-station", "finding-station"],
        "difficulty": 1,
    },
    {
        "slug": "school-and-work",
        "title": "School & Work",
        "description": "Classroom and workplace listening practice.",
        "slugs": ["classroom-question", "phone-message", "study-plan", "making-appointment"],
        "difficulty": 2,
    },
    {
        "slug": "shopping-and-services",
        "title": "Shopping & Services",
        "description": "Shop, hotel, and service encounters.",
        "slugs": ["asking-price-discount", "hotel-checkin", "lost-item", "taking-photo"],
        "difficulty": 2,
    },
    {
        "slug": "n5-listening-mock",
        "title": "N5 Listening Mock Exam",
        "description": "Six-part listening mock exam covering greetings, travel, health, and social situations.",
        "slugs": [
            "greeting-friend",
            "buying-ticket",
            "feeling-sick",
            "weekend-hobby",
            "birthday-party",
            "goodbye-friend",
        ],
        "difficulty": 3,
    },
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def build_exercise_inserts() -> str:
    parts: list[str] = ["-- N5 listening exercises (wave 2)"]
    for ex in EXERCISES:
        slug, title, jp, romaji, en, question, options, correct, diff, duration = ex
        options_json = json.dumps(options, ensure_ascii=False)
        parts.append(
            f"""
insert into public.listening_exercises (
  title, slug, japanese_text, romaji, english, question, options, correct_option_index,
  jlpt_level, difficulty, estimated_duration, status
)
select
  '{sql_str(title)}',
  '{sql_str(slug)}',
  '{sql_str(jp)}',
  '{sql_str(romaji)}',
  '{sql_str(en)}',
  '{sql_str(question)}',
  '{sql_str(options_json)}'::jsonb,
  {correct},
  'n5'::public.jlpt_level,
  {diff},
  {duration},
  'published'
where not exists (select 1 from public.listening_exercises where slug = '{sql_str(slug)}');
"""
        )
    return "\n".join(parts)


def build_challenge_block() -> str:
    challenge_rows = []
    for ch in CHALLENGES:
        challenge_rows.append(
            f"  ('{sql_str(ch['slug'])}', '{sql_str(ch['title'])}', "
            f"'{sql_str(ch['description'])}', {ch['difficulty']})"
        )

    slug_arrays = []
    for ch in CHALLENGES:
        slugs_sql = ", ".join(f"'{sql_str(s)}'" for s in ch["slugs"])
        slug_arrays.append(
            f"    when '{sql_str(ch['slug'])}' then array[{slugs_sql}]"
        )

    return f"""
-- Listening challenges (wave 2)
insert into public.listening_challenges (title, slug, description, jlpt_level, difficulty, status)
select c.title, c.slug, c.description, 'n5'::public.jlpt_level, c.difficulty, 'published'
from (
  values
{",".join(challenge_rows)}
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
    where slug in ({", ".join(f"'{sql_str(ch['slug'])}'" for ch in CHALLENGES)})
  loop
    select id into challenge_id from public.listening_challenges
    where slug = challenge_rec.slug limit 1;

    exercise_slugs := case challenge_rec.slug
{chr(10).join(slug_arrays)}
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
"""


def build_curriculum_block() -> str:
    return """
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
"""


def main() -> None:
    sql = (
        "-- N5 listening expansion wave 2\n\n"
        + build_exercise_inserts()
        + "\n"
        + build_challenge_block()
        + "\n"
        + build_curriculum_block()
    )
    OUT.write_text(sql, encoding="utf-8")
    print(
        f"Wrote {OUT.name}: {len(EXERCISES)} exercises, "
        f"{len(CHALLENGES)} challenges"
    )


if __name__ == "__main__":
    main()
