"""Generate N5 reading expansion migration — stories, dialogues, trail lessons."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617120000_n5_reading_expansion.sql"


def sql_str(value: str) -> str:
    return value.replace("'", "''")


STORIES = [
    {
        "slug": "rainy-day",
        "title": "A Rainy Day",
        "summary": "Yuki stays home and reads on a rainy afternoon.",
        "difficulty": 1,
        "read_time": 3,
        "sections": [
            ("今日は雨です。", "Kyou wa ame desu.", "Today it is rainy.", 0),
            ("ゆきさんは家にいます。", "Yuki-san wa ie ni imasu.", "Yuki is at home.", 1),
            ("本を読んで、お茶を飲みます。", "Hon o yonde, ocha o nomimasu.", "She reads a book and drinks tea.", 2),
        ],
        "questions": [
            ("What is the weather today?", ["Rainy", "Sunny", "Snowy", "Windy"], 0),
            ("What does Yuki do?", ["Reads and drinks tea", "Goes shopping", "Plays sports", "Goes to school"], 0),
        ],
    },
    {
        "slug": "at-the-market",
        "title": "At the Market",
        "summary": "Ken buys fruit and vegetables at the local market.",
        "difficulty": 1,
        "read_time": 4,
        "sections": [
            ("けんさんは市場へ行きます。", "Ken-san wa ichiba e ikimasu.", "Ken goes to the market.", 0),
            ("りんごと野菜を買います。", "Ringo to yasai o kaimasu.", "He buys apples and vegetables.", 1),
            ("「全部で五百円です。」", "Zenbu de gohyaku en desu.", '"The total is five hundred yen."', 2),
        ],
        "questions": [
            ("Where does Ken go?", ["The market", "The station", "School", "The hospital"], 0),
            ("What does Ken buy?", ["Apples and vegetables", "Fish and meat", "Books", "Clothes"], 0),
        ],
    },
    {
        "slug": "train-commute",
        "title": "Train Commute",
        "summary": "Tanaka takes the train to work every morning.",
        "difficulty": 2,
        "read_time": 4,
        "sections": [
            ("田中さんは毎朝六時に起きます。", "Tanaka-san wa maiasa rokuji ni okimasu.", "Tanaka wakes up at six every morning.", 0),
            ("七時に電車に乗ります。", "Shichiji ni densha ni norimasu.", "He gets on the train at seven.", 1),
            ("八時半に会社に着きます。", "Hachiji han ni kaisha ni tsukimasu.", "He arrives at the office at eight thirty.", 2),
        ],
        "questions": [
            ("When does Tanaka wake up?", ["Six o'clock", "Seven o'clock", "Eight o'clock", "Nine o'clock"], 0),
            ("When does he arrive at work?", ["Eight thirty", "Seven thirty", "Nine o'clock", "Six thirty"], 0),
        ],
    },
    {
        "slug": "birthday-surprise",
        "title": "Birthday Surprise",
        "summary": "Friends prepare a surprise for Sato's birthday.",
        "difficulty": 2,
        "read_time": 5,
        "sections": [
            ("今日は佐藤さんの誕生日です。", "Kyou wa Satou-san no tanjoubi desu.", "Today is Sato's birthday.", 0),
            ("友達はケーキとプレゼントを用意します。", "Tomodachi wa keeki to purezento o youi shimasu.", "Friends prepare a cake and a present.", 1),
            ("「お誕生日おめでとう！」", "Otanjoubi omedetou!", '"Happy birthday!"', 2),
            ("佐藤さんはとても嬉しいです。", "Satou-san wa totemo ureshii desu.", "Sato is very happy.", 3),
        ],
        "questions": [
            ("Whose birthday is it?", ["Sato's", "Tanaka's", "Yuki's", "Ken's"], 0),
            ("How does Sato feel?", ["Very happy", "Angry", "Sad", "Tired"], 0),
        ],
    },
    {
        "slug": "weekend-trip",
        "title": "Weekend Trip",
        "summary": "A family plans a short trip to the mountains.",
        "difficulty": 2,
        "read_time": 5,
        "sections": [
            ("土曜日に家族で山へ行きます。", "Doyoubi ni kazoku de yama e ikimasu.", "On Saturday the family goes to the mountains.", 0),
            ("天気は晴れです。", "Tenki wa hare desu.", "The weather is clear.", 1),
            ("昼ご飯を食べて、写真を撮ります。", "Hirugohan o tabete, shashin o torimasu.", "They eat lunch and take photos.", 2),
            ("日曜日の夜、家に帰ります。", "Nichiyoubi no yoru, ie ni kaerimasu.", "On Sunday evening they return home.", 3),
        ],
        "questions": [
            ("When do they go to the mountains?", ["Saturday", "Sunday", "Monday", "Friday"], 0),
            ("What is the weather?", ["Clear", "Rainy", "Cloudy", "Snowy"], 0),
        ],
    },
]

DIALOGUES = [
    {
        "slug": "at-the-doctor",
        "title": "At the Doctor",
        "description": "Describe symptoms and ask for medicine.",
        "difficulty": 2,
        "lines": [
            ("Doctor", "どうしましたか。", "Dou shimashita ka.", "What is wrong?", True, 0),
            ("Patient", "頭が痛いです。", "Atama ga itai desu.", "My head hurts.", False, 1),
            ("Doctor", "熱はありますか。", "Netsu wa arimasu ka.", "Do you have a fever?", False, 2),
            ("Patient", "はい、少しあります。", "Hai, sukoshi arimasu.", "Yes, a little.", False, 3),
        ],
        "choices": [
            (2, "I have a fever.", False, 0),
            (2, "Yes, a little.", True, 1),
            (2, "No, thank you.", False, 2),
        ],
    },
    {
        "slug": "buying-clothes",
        "title": "Buying Clothes",
        "description": "Shop for clothes and ask about size.",
        "difficulty": 1,
        "lines": [
            ("Clerk", "いらっしゃいませ。", "Irasshaimase.", "Welcome.", True, 0),
            ("Customer", "このシャツはいくらですか。", "Kono shatsu wa ikura desu ka.", "How much is this shirt?", False, 1),
            ("Clerk", "二千円です。", "Nisen en desu.", "It is two thousand yen.", False, 2),
            ("Customer", "じゃあ、ください。", "Jaa, kudasai.", "Then I will take it.", False, 3),
        ],
        "choices": [
            (1, "How much is this shirt?", True, 0),
            (1, "Where is the station?", False, 1),
            (1, "What time is it?", False, 2),
        ],
    },
    {
        "slug": "making-plans",
        "title": "Making Plans",
        "description": "Arrange to meet a friend on the weekend.",
        "difficulty": 1,
        "lines": [
            ("A", "土曜日、暇ですか。", "Doyoubi, hima desu ka.", "Are you free on Saturday?", True, 0),
            ("B", "はい、暇です。", "Hai, hima desu.", "Yes, I am free.", False, 1),
            ("A", "映画を見に行きませんか。", "Eiga o mi ni ikimasen ka.", "Shall we go see a movie?", False, 2),
            ("B", "いいですね。三時はどうですか。", "Ii desu ne. Sanji wa dou desu ka.", "Sounds good. How about three?", False, 3),
        ],
        "choices": [
            (2, "Shall we go see a movie?", True, 0),
            (2, "Let's study together.", False, 1),
            (2, "I am busy today.", False, 2),
        ],
    },
    {
        "slug": "at-the-hotel",
        "title": "At the Hotel",
        "description": "Check in and ask about breakfast.",
        "difficulty": 2,
        "lines": [
            ("Guest", "予約をしています。", "Yoyaku o shite imasu.", "I have a reservation.", True, 0),
            ("Clerk", "お名前をお願いします。", "Onamae o onegaishimasu.", "Your name, please.", False, 1),
            ("Guest", "山田です。", "Yamada desu.", "Yamada.", False, 2),
            ("Clerk", "朝ご飯は七時からです。", "Asagohan wa shichiji kara desu.", "Breakfast is from seven.", False, 3),
        ],
        "choices": [
            (1, "Your name, please.", False, 0),
            (1, "I have a reservation.", True, 1),
            (1, "Where is the station?", False, 2),
        ],
    },
    {
        "slug": "asking-help",
        "title": "Asking for Help",
        "description": "Ask a stranger for directions on the street.",
        "difficulty": 1,
        "lines": [
            ("Traveler", "すみません。", "Sumimasen.", "Excuse me.", True, 0),
            ("Traveler", "駅はどこですか。", "Eki wa doko desu ka.", "Where is the station?", False, 1),
            ("Local", "まっすぐ行って、右に曲がってください。", "Massugu itte, migi ni magatte kudasai.", "Go straight and turn right.", False, 2),
            ("Traveler", "ありがとうございます。", "Arigatou gozaimasu.", "Thank you very much.", False, 3),
        ],
        "choices": [
            (1, "Where is the station?", True, 0),
            (1, "How much is this?", False, 1),
            (1, "What time is it?", False, 2),
        ],
    },
]


def build_stories_sql() -> str:
    parts = ["-- N5 reading stories (wave 2)"]
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
do $story_content$
#variable_conflict use_variable
declare
  story_id uuid;
begin
{"".join(story_blocks)}
end;
$story_content$;
"""


def build_dialogues_sql() -> str:
    parts = ["-- N5 dialogue scenarios (wave 2)"]
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

        choice_block = ""
        if dlg.get("choices"):
            choice_rows = []
            for node_order, text, correct, choice_order in dlg["choices"]:
                choice_rows.append(
                    f"({node_order}, '{sql_str(text)}', {str(correct).lower()}, {choice_order})"
                )
            choice_block = f"""
    insert into public.dialogue_choices (node_id, choice_text, is_correct, order_index)
    select n.id, c.choice_text, c.is_correct, c.order_index
    from public.dialogue_nodes n
    inner join (
      values
        {", ".join(f"(v.node_order, v.choice_text, v.is_correct, v.order_index)" for _ in dlg["choices"])}
    ) as c(node_order, choice_text, is_correct, order_index) on c.node_order = n.order_index
    where n.scenario_id = scenario_id
      and not exists (
        select 1 from public.dialogue_choices existing where existing.node_id = n.id limit 1
      );
"""
            # Fix the values part properly
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
do $dialogue_content$
#variable_conflict use_variable
declare
  scenario_id uuid;
begin
{"".join(dlg_blocks)}
end;
$dialogue_content$;
"""


def build_curriculum_block() -> str:
    return """
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
"""


def main() -> None:
    sql = (
        "-- N5 reading expansion wave 2\n\n"
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
    print(
        f"Wrote {OUT.name}: {len(STORIES)} stories, {len(DIALOGUES)} dialogues"
    )


if __name__ == "__main__":
    main()
