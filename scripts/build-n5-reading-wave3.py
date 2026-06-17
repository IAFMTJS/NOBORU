"""Generate N5 reading expansion wave 3 — final stories and dialogues toward 10/10."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617190000_n5_reading_expansion_wave3.sql"


def sql_str(value: str) -> str:
    return value.replace("'", "''")


STORIES = [
    {
        "slug": "summer-festival",
        "title": "Summer Festival",
        "summary": "A family enjoys food and fireworks at a summer festival.",
        "difficulty": 2,
        "read_time": 5,
        "sections": [
            ("夏祭りに家族で行きます。", "Natsu matsuri ni kazoku de ikimasu.", "The family goes to the summer festival.", 0),
            ("たこ焼きとかき氷を食べます。", "Takoyaki to kakigoori o tabemasu.", "They eat takoyaki and shaved ice.", 1),
            ("夜、花火がとてもきれいです。", "Yoru, hanabi ga totemo kirei desu.", "At night the fireworks are very beautiful.", 2),
            ("子供たちはうれしそうです。", "Kodomo-tachi wa ureshisou desu.", "The children look happy.", 3),
        ],
        "questions": [
            ("Where does the family go?", ["Summer festival", "School", "Hospital", "Office"], 0),
            ("What do they eat?", ["Takoyaki and shaved ice", "Sushi and ramen", "Bread and coffee", "Rice and fish"], 0),
            ("How are the fireworks?", ["Very beautiful", "Very loud only", "Not visible", "Cancelled"], 0),
        ],
    },
    {
        "slug": "first-part-time-job",
        "title": "First Part-Time Job",
        "summary": "Yuki starts her first part-time job at a bookstore.",
        "difficulty": 2,
        "read_time": 5,
        "sections": [
            ("ゆきさんは初めてアルバイトをします。", "Yuki-san wa hajimete arubaito o shimasu.", "Yuki has her first part-time job.", 0),
            ("本屋で週に三回働きます。", "Hon'ya de shuu ni sankai hatarakimasu.", "She works at a bookstore three times a week.", 1),
            ("最初は少し緊張しますが、先輩が優しく教えます。", "Saisho wa sukoshi kinchou shimasu ga, senpai ga yasashiku oshiemasu.", "At first she is a little nervous, but a senior coworker teaches her kindly.", 2),
            ("今、仕事がだんだん楽しくなりました。", "Ima, shigoto ga dandan tanoshiku narimashita.", "Now work is gradually becoming fun.", 3),
        ],
        "questions": [
            ("Where does Yuki work?", ["Bookstore", "Restaurant", "School", "Station"], 0),
            ("How often does she work?", ["Three times a week", "Every day", "Once a month", "Only weekends"], 0),
            ("How does she feel about work now?", ["It is becoming fun", "She wants to quit", "She is still very nervous", "She is angry"], 0),
        ],
    },
]

DIALOGUES = [
    {
        "slug": "at-the-post-office",
        "title": "At the Post Office",
        "description": "Send a package and ask about delivery time.",
        "difficulty": 2,
        "lines": [
            ("Clerk", "いらっしゃいませ。", "Irasshaimase.", "Welcome.", True, 0),
            ("Customer", "この荷物を送りたいです。", "Kono nimotsu o okuritai desu.", "I want to send this package.", False, 1),
            ("Clerk", "どこへ送りますか。", "Doko e okurimasu ka.", "Where will you send it?", False, 2),
            ("Customer", "大阪までお願いします。", "Oosaka made onegaishimasu.", "To Osaka, please.", False, 3),
            ("Clerk", "三日くらいかかります。", "Mikka kurai kakarimasu.", "It takes about three days.", False, 4),
        ],
        "choices": [
            (1, "I want to send this package.", True, 0),
            (1, "I want to buy stamps.", False, 1),
            (1, "Where is the station?", False, 2),
        ],
    },
    {
        "slug": "bus-schedule",
        "title": "Bus Schedule",
        "description": "Ask when the next bus leaves for the airport.",
        "difficulty": 1,
        "lines": [
            ("Traveler", "すみません。空港行きのバスは何時ですか。", "Sumimasen. Kuukou yuki no basu wa nanji desu ka.", "Excuse me. What time is the bus to the airport?", True, 0),
            ("Staff", "次のバスは十時十五分です。", "Tsugi no basu wa juuji juugofun desu.", "The next bus is at ten fifteen.", False, 1),
            ("Traveler", "切符はどこで買えますか。", "Kippu wa doko de kaemasu ka.", "Where can I buy a ticket?", False, 2),
            ("Staff", "あちらの窓口で買えます。", "Achira no madoguchi de kaemasu.", "You can buy one at that counter.", False, 3),
        ],
        "choices": [
            (0, "What time is the bus to the airport?", True, 0),
            (0, "Where is the hotel?", False, 1),
            (0, "How much is this shirt?", False, 2),
        ],
    },
    {
        "slug": "ordering-taxi",
        "title": "Ordering a Taxi",
        "description": "Call a taxi and give your destination.",
        "difficulty": 2,
        "lines": [
            ("Driver", "もしもし、タクシーです。", "Moshi moshi, takushii desu.", "Hello, this is the taxi company.", True, 0),
            ("Customer", "駅までお願いします。", "Eki made onegaishimasu.", "To the station, please.", False, 1),
            ("Driver", "今どこにいますか。", "Ima doko ni imasu ka.", "Where are you now?", False, 2),
            ("Customer", "ホテルの前にいます。", "Hoteru no mae ni imasu.", "I am in front of the hotel.", False, 3),
            ("Driver", "五分くらいで着きます。", "Gofun kurai de tsukimasu.", "I will arrive in about five minutes.", False, 4),
        ],
        "choices": [
            (1, "To the station, please.", True, 0),
            (1, "To the airport, please.", False, 1),
            (1, "I am at school.", False, 2),
        ],
    },
]


def build_stories_sql() -> str:
    parts = ["-- N5 reading stories (wave 3)"]
    for story in STORIES:
        parts.append(
            f"""
insert into public.stories (title, slug, summary, jlpt_level, difficulty, estimated_read_time, status)
select
  '{sql_str(story["title"])}',
  '{sql_str(story["slug"])}',
  '{sql_str(story["summary"])}',
  'n5'::public.jlpt_level,
  {story["difficulty"]},
  {story["read_time"]},
  'published'
where not exists (select 1 from public.stories where slug = '{sql_str(story["slug"])}');
"""
        )
    return "\n".join(parts)


def build_story_content_block() -> str:
    story_blocks = []
    for story in STORIES:
        section_rows = ",\n".join(
            f"        ('{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}', {idx})"
            for jp, romaji, en, idx in story["sections"]
        )
        question_rows = ",\n".join(
            f"        ('{sql_str(q)}', '{sql_str(json.dumps(opts, ensure_ascii=False))}'::jsonb, {ci}, {oi})"
            for oi, (q, opts, ci) in enumerate(story["questions"])
        )
        story_blocks.append(
            f"""
  select id into story_id from public.stories where slug = '{sql_str(story["slug"])}' limit 1;
  if story_id is not null then
    insert into public.story_sections (story_id, japanese_text, romaji, english, order_index, status)
    select story_id, v.japanese_text, v.romaji, v.english, v.order_index, 'published'
    from (
      values
{section_rows}
    ) as v(japanese_text, romaji, english, order_index)
    where not exists (
      select 1 from public.story_sections where story_id = story_id limit 1
    );

    insert into public.reading_questions (story_id, question, options, correct_option_index, difficulty, order_index, status)
    select story_id, v.question, v.options, v.correct_option_index, 1, v.order_index, 'published'
    from (
      values
{question_rows}
    ) as v(question, options, correct_option_index, order_index)
    where not exists (
      select 1 from public.reading_questions where story_id = story_id limit 1
    );
  end if;"""
        )

    return f"""
do $story_content_wave3$
#variable_conflict use_variable
declare
  story_id uuid;
begin
{"".join(story_blocks)}
end;
$story_content_wave3$;
"""


def build_dialogues_sql() -> str:
    parts = ["-- N5 dialogue scenarios (wave 3)"]
    for dlg in DIALOGUES:
        parts.append(
            f"""
insert into public.dialogue_scenarios (title, slug, description, jlpt_level, difficulty, status)
select
  '{sql_str(dlg["title"])}',
  '{sql_str(dlg["slug"])}',
  '{sql_str(dlg["description"])}',
  'n5'::public.jlpt_level,
  {dlg["difficulty"]},
  'published'
where not exists (select 1 from public.dialogue_scenarios where slug = '{sql_str(dlg["slug"])}');
"""
        )
    return "\n".join(parts)


def build_dialogue_content_block() -> str:
    dlg_blocks = []
    for dlg in DIALOGUES:
        line_inserts = []
        for speaker, jp, romaji, en, is_entry, order_idx in dlg["lines"]:
            line_inserts.append(
                f"""
    insert into public.dialogue_nodes (scenario_id, speaker, japanese_text, romaji, english, node_type, is_entry, order_index)
    select scenario_id, '{sql_str(speaker)}', '{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}', 'line', {str(is_entry).lower()}, {order_idx}
    where not exists (
      select 1 from public.dialogue_nodes where scenario_id = scenario_id and order_index = {order_idx}
    );"""
            )

        values_sql = ",\n        ".join(
            f"({node_order}, '{sql_str(text)}', {str(correct).lower()}, {choice_order})"
            for node_order, text, correct, choice_order in dlg["choices"]
        )
        choice_block = f"""
    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        {values_sql}
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );
"""

        dlg_blocks.append(
            f"""
  select id into scenario_id from public.dialogue_scenarios where slug = '{sql_str(dlg["slug"])}' limit 1;
  if scenario_id is not null then
{"".join(line_inserts)}
{choice_block}
  end if;"""
        )

    return f"""
do $dialogue_content_wave3$
#variable_conflict use_variable
declare
  scenario_id uuid;
begin
{"".join(dlg_blocks)}
end;
$dialogue_content_wave3$;
"""


def build_curriculum_block() -> str:
    return """
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
"""


def main() -> None:
    sql = (
        "-- N5 reading expansion wave 3\n\n"
        + build_stories_sql()
        + "\n"
        + build_story_content_block()
        + "\n"
        + build_dialogues_sql()
        + "\n"
        + build_dialogue_content_block()
        + "\n"
        + build_curriculum_block()
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT.name}: {len(STORIES)} stories, {len(DIALOGUES)} dialogues")


if __name__ == "__main__":
    main()
