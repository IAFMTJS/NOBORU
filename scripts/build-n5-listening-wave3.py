"""Generate N5 listening expansion wave 3 — final exercises and challenges toward 30/8."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617200000_n5_listening_expansion_wave3.sql"

Exercise = tuple[str, str, str, str, str, str, list[str], int, int, int]

EXERCISES: list[Exercise] = [
    (
        "weather-forecast",
        "Weather Forecast",
        "明日は 晴れ です。暖かい です。",
        "Ashita wa hare desu. Atatakai desu.",
        "Tomorrow it will be clear. It will be warm.",
        "What will the weather be like tomorrow?",
        ["Clear and warm", "Rainy and cold", "Snowy", "Cloudy and windy"],
        0,
        1,
        2,
    ),
    (
        "asking-restroom",
        "Asking for the Restroom",
        "すみません。トイレは どこ ですか。",
        "Sumimasen. Toire wa doko desu ka.",
        "Excuse me. Where is the restroom?",
        "What is the speaker looking for?",
        ["The restroom", "The station", "A restaurant", "A ticket counter"],
        0,
        1,
        2,
    ),
    (
        "library-hours",
        "Library Hours",
        "図書館は 九時から 五時まで です。",
        "Toshokan wa kuji kara goji made desu.",
        "The library is open from nine to five.",
        "When does the library close?",
        ["Five o'clock", "Nine o'clock", "Six o'clock", "Eight o'clock"],
        0,
        1,
        2,
    ),
    (
        "inviting-lunch",
        "Inviting to Lunch",
        "お昼 一緒に 食べませんか。",
        "Ohiru issho ni tabemasen ka.",
        "Shall we eat lunch together?",
        "What does the speaker suggest?",
        ["Eating lunch together", "Going to a movie", "Studying together", "Going home early"],
        0,
        1,
        2,
    ),
    (
        "missed-train",
        "Missed the Train",
        "電車に 乗り遅れました。次は 十五分 後 です。",
        "Densha ni noriokuremashita. Tsugi wa juugofun go desu.",
        "I missed the train. The next one is in fifteen minutes.",
        "How long until the next train?",
        ["Fifteen minutes", "Five minutes", "Thirty minutes", "One hour"],
        0,
        2,
        3,
    ),
    (
        "thanking-help",
        "Thanking for Help",
        "道を 教えて くれて ありがとう ございます。",
        "Michi o oshiete kurete arigatou gozaimasu.",
        "Thank you for telling me the way.",
        "Why is the speaker thanking the other person?",
        ["For giving directions", "For buying a ticket", "For cooking food", "For lending money"],
        0,
        1,
        2,
    ),
]

CHALLENGES: list[dict] = [
    {
        "slug": "daily-services-listening",
        "title": "Daily Services Listening",
        "description": "Listen to everyday service encounters: weather, facilities, and invitations.",
        "slugs": ["weather-forecast", "asking-restroom", "library-hours", "inviting-lunch"],
        "difficulty": 1,
    },
    {
        "slug": "n5-listening-full-mock",
        "title": "N5 Full Listening Mock",
        "description": "Eight-part comprehensive listening mock covering travel, health, school, and social situations.",
        "slugs": [
            "greeting-friend",
            "buying-ticket",
            "feeling-sick",
            "classroom-question",
            "missed-train",
            "birthday-party",
            "thanking-help",
            "goodbye-friend",
        ],
        "difficulty": 3,
    },
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def build_exercise_inserts() -> str:
    parts: list[str] = ["-- N5 listening exercises (wave 3)"]
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
-- Listening challenges (wave 3)
insert into public.listening_challenges (title, slug, description, jlpt_level, difficulty, status)
select c.title, c.slug, c.description, 'n5'::public.jlpt_level, c.difficulty, 'published'
from (
  values
{",".join(challenge_rows)}
) as c(slug, title, description, difficulty)
where not exists (
  select 1 from public.listening_challenges existing where existing.slug = c.slug
);

do $challenge_items_wave3$
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
$challenge_items_wave3$;
"""


def build_curriculum_block() -> str:
    slugs_sql = ", ".join(f"'{sql_str(ex[0])}'" for ex in EXERCISES)
    challenge_slugs_sql = ", ".join(f"'{sql_str(ch['slug'])}'" for ch in CHALLENGES)
    return f"""
-- Wire wave 3 listening content into Listening Practice unit
do $listening_unit_wave3$
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
      and slug in ({slugs_sql})
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
      and slug in ({challenge_slugs_sql})
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
$listening_unit_wave3$;
"""


def main() -> None:
    sql = (
        "-- N5 listening expansion wave 3\n\n"
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
