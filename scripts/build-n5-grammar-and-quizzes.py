"""Generate N5 grammar expansion wave 2 and unit mini-exam practice lessons."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617130000_n5_grammar_and_quizzes.sql"


def sql_str(value: str) -> str:
    return value.replace("'", "''")


GRAMMAR_POINTS = [
    {
        "title": "ている (te-iru)",
        "meaning": "Ongoing state or action",
        "explanation": "Describes something in progress or a resulting state.",
        "examples": [
            ("今、勉強しています。", "Ima, benkyou shite imasu.", "I am studying now."),
            ("雨が降っています。", "Ame ga futte imasu.", "It is raining."),
        ],
    },
    {
        "title": "ので (node)",
        "meaning": "Because, since (polite reason)",
        "explanation": "Polite reason marker, softer than から for giving explanations.",
        "examples": [
            ("雨なので、家にいます。", "Ame na node, ie ni imasu.", "Because it is rainy, I am at home."),
            ("勉強なので、静かにしてください。", "Benkyou na node, shizuka ni shite kudasai.", "Because I am studying, please be quiet."),
        ],
    },
    {
        "title": "ましょう (mashou)",
        "meaning": "Let's, shall we",
        "explanation": "Suggests doing something together in polite speech.",
        "examples": [
            ("一緒に行きましょう。", "Issho ni ikimashou.", "Let's go together."),
            ("休みましょう。", "Yasumimashou.", "Let's rest."),
        ],
    },
    {
        "title": "ことができる (koto ga dekiru)",
        "meaning": "Can do",
        "explanation": "Expresses ability or possibility using dictionary-form verb + こと.",
        "examples": [
            ("日本語が話せます。", "Nihongo ga hanasemasu.", "I can speak Japanese."),
            ("泳ぐことができます。", "Oyogu koto ga dekimasu.", "I can swim."),
        ],
    },
    {
        "title": "前に (mae ni)",
        "meaning": "Before",
        "explanation": "Indicates something happens before another action.",
        "examples": [
            ("食事の前に手を洗います。", "Shokuji no mae ni te o araimasu.", "I wash my hands before eating."),
            ("寝る前に本を読みます。", "Neru mae ni hon o yomimasu.", "I read before sleeping."),
        ],
    },
    {
        "title": "後で (ato de)",
        "meaning": "After, later",
        "explanation": "Indicates something happens after another action or at a later time.",
        "examples": [
            ("授業の後で遊びます。", "Jugyou no ato de asobimasu.", "I play after class."),
            ("後で電話します。", "Ato de denwa shimasu.", "I will call later."),
        ],
    },
    {
        "title": "あまり〜ない (amari...nai)",
        "meaning": "Not very",
        "explanation": "Used with negatives to mean not much or not very.",
        "examples": [
            ("あまり好きじゃないです。", "Amari suki ja nai desu.", "I do not like it very much."),
            ("あまり分かりません。", "Amari wakarimasen.", "I do not understand very well."),
        ],
    },
    {
        "title": "もう (mou)",
        "meaning": "Already",
        "explanation": "Indicates something has already happened or a state has been reached.",
        "examples": [
            ("もう食べました。", "Mou tabemashita.", "I already ate."),
            ("もう帰ります。", "Mou kaerimasu.", "I am going home now."),
        ],
    },
    {
        "title": "まだ (mada)",
        "meaning": "Still, not yet",
        "explanation": "Used with affirmative for still or with negative for not yet.",
        "examples": [
            ("まだ勉強しています。", "Mada benkyou shite imasu.", "I am still studying."),
            ("まだ食べていません。", "Mada tabete imasen.", "I have not eaten yet."),
        ],
    },
    {
        "title": "より (yori)",
        "meaning": "Than, more than",
        "explanation": "Marks the item being compared against in comparisons.",
        "examples": [
            ("コーヒーよりお茶の方が好きです。", "Koohii yori ocha no hou ga suki desu.", "I like tea more than coffee."),
            ("昨日より暑いです。", "Kinou yori atsui desu.", "It is hotter than yesterday."),
        ],
    },
    {
        "title": "ほうが (hou ga)",
        "meaning": "Is more (comparison)",
        "explanation": "Used with より to express that one option is more preferable.",
        "examples": [
            ("歩くほうがいいです。", "Aruku hou ga ii desu.", "Walking is better."),
            ("こちらのほうが安いです。", "Kochira no hou ga yasui desu.", "This one is cheaper."),
        ],
    },
    {
        "title": "ながら (nagara)",
        "meaning": "While doing",
        "explanation": "Connects two simultaneous actions performed by the same subject.",
        "examples": [
            ("音楽を聞きながら勉強します。", "Ongaku o kikinagara benkyou shimasu.", "I study while listening to music."),
            ("歩きながら話します。", "Arukinagara hanashimasu.", "I talk while walking."),
        ],
    },
    {
        "title": "てから (te kara)",
        "meaning": "After doing",
        "explanation": "Indicates one action happens after another is completed.",
        "examples": [
            ("食べてから出かけます。", "Tabete kara dekakemasu.", "I go out after eating."),
            ("仕事をしてから寝ます。", "Shigoto o shite kara nemasu.", "I sleep after working."),
        ],
    },
    {
        "title": "すぎる (sugiru)",
        "meaning": "Too much",
        "explanation": "Attaches to verb stems or adjective roots to mean excessive degree.",
        "examples": [
            ("食べすぎました。", "Tabesugimashita.", "I ate too much."),
            ("高すぎます。", "Takasugimasu.", "It is too expensive."),
        ],
    },
    {
        "title": "なければならない (nakereba naranai)",
        "meaning": "Must do",
        "explanation": "Expresses obligation or necessity in polite written-style speech.",
        "examples": [
            ("宿題をしなければなりません。", "Shukudai o shinakereba narimasen.", "I must do homework."),
            ("薬を飲まなければなりません。", "Kusuri o nominakereba narimasen.", "I must take medicine."),
        ],
    },
    {
        "title": "かもしれない (kamoshirenai)",
        "meaning": "Might, maybe",
        "explanation": "Expresses uncertainty or possibility.",
        "examples": [
            ("明日は雨かもしれません。", "Ashita wa ame kamoshiremasen.", "It might rain tomorrow."),
            ("彼は来ないかもしれません。", "Kare wa konai kamoshiremasen.", "He might not come."),
        ],
    },
    {
        "title": "ように (you ni)",
        "meaning": "So that, in order to",
        "explanation": "Expresses purpose or manner; often used for goals and instructions.",
        "examples": [
            ("忘れないように書きます。", "Wasurenai you ni kakimasu.", "I write it down so I do not forget."),
            ("健康のように運動します。", "Kenkou no you ni undou shimasu.", "I exercise for my health."),
        ],
    },
    {
        "title": "ために (tame ni)",
        "meaning": "For the sake of, in order to",
        "explanation": "Marks purpose or benefit, often for people or clear goals.",
        "examples": [
            ("試験のために勉強します。", "Shiken no tame ni benkyou shimasu.", "I study for the exam."),
            ("家族のために働きます。", "Kazoku no tame ni hatarakimasu.", "I work for my family."),
        ],
    },
    {
        "title": "について (ni tsuite)",
        "meaning": "About, concerning",
        "explanation": "Introduces the topic of discussion or study.",
        "examples": [
            ("日本文化について話します。", "Nihon bunka ni tsuite hanashimasu.", "I talk about Japanese culture."),
            ("この問題について考えます。", "Kono mondai ni tsuite kangaemasu.", "I think about this problem."),
        ],
    },
    {
        "title": "と思う (to omou)",
        "meaning": "I think that",
        "explanation": "Expresses the speaker's opinion or belief about something.",
        "examples": [
            ("面白いと思います。", "Omoshiroi to omoimasu.", "I think it is interesting."),
            ("明日は晴れると思います。", "Ashita wa hareru to omoimasu.", "I think it will be clear tomorrow."),
        ],
    },
]

UNIT_QUIZZES = [
    {
        "unit_name": "N5 Mini Exam: Vocabulary I",
        "description": "Quiz covering People, Time, and Actions vocabulary.",
        "order_index": 37,
        "grammar_titles": [],
        "vocab_kana": ["わたし", "きょう", "いく", "たべる", "のみる"],
    },
    {
        "unit_name": "N5 Mini Exam: Grammar I",
        "description": "Quiz on particles and basic sentence patterns.",
        "order_index": 38,
        "grammar_titles": ["は (wa)", "です (desu)", "ます (masu)", "を (o)", "に (ni)"],
        "vocab_kana": [],
    },
    {
        "unit_name": "N5 Mini Exam: Kanji I",
        "description": "Mixed kanji recall from Academy Parts I–II.",
        "order_index": 39,
        "grammar_titles": [],
        "vocab_kana": [],
        "kanji_characters": ["一", "二", "三", "日", "月"],
    },
    {
        "unit_name": "N5 Mini Exam: Listening",
        "description": "Listening comprehension quiz across daily situations.",
        "order_index": 40,
        "lesson_type": "listening_challenge",
        "challenge_slug": "n5-listening-mock",
    },
    {
        "unit_name": "N5 Mini Exam: Reading",
        "description": "Reading comprehension quiz with stories and dialogs.",
        "order_index": 41,
        "lesson_type": "reading_quiz",
        "story_slugs": ["rainy-day", "at-the-market"],
        "dialogue_slugs": ["making-plans"],
    },
]


def build_grammar_inserts() -> str:
    rows = []
    for gp in GRAMMAR_POINTS:
        rows.append(
            f"    ('{sql_str(gp['title'])}', '{sql_str(gp['meaning'])}', "
            f"'{sql_str(gp['explanation'])}', 'n5'::public.jlpt_level, 2, 'published'::public.content_status)"
        )
    return f"""
-- N5 grammar expansion wave 2
insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select g.title, g.meaning, g.explanation, g.jlpt_level, g.difficulty, g.status
from (
  values
{",\n".join(rows)}
) as g(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = g.title
);
"""


def build_grammar_examples() -> str:
    example_rows = []
    for gp in GRAMMAR_POINTS:
        for order_index, (jp, romaji, en) in enumerate(gp["examples"]):
            example_rows.append(
                f"    ('{sql_str(gp['title'])}', '{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}', {order_index})"
            )
    return f"""
insert into public.grammar_examples (grammar_id, japanese_text, romaji, english, order_index, status)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
{",\n".join(example_rows)}
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id and existing.japanese_text = e.japanese_text
  );
"""


def build_grammar_curriculum() -> str:
    lessons_per_unit = 4
    unit_blocks = []
    for unit_index in range(0, len(GRAMMAR_POINTS), lessons_per_unit):
        chunk = GRAMMAR_POINTS[unit_index : unit_index + lessons_per_unit]
        unit_num = unit_index // lessons_per_unit + 1
        unit_name = f"Grammar Patterns III — Part {unit_num}"
        unit_order = 20 + unit_index // lessons_per_unit
        lesson_blocks = []
        for lesson_offset, gp in enumerate(chunk):
            lesson_blocks.append(
                f"""
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '{sql_str(gp["title"])}', '{sql_str(gp["meaning"])}', 2, 14, 7, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(gp["title"])}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(gp["title"])}' limit 1;

    if lesson_id is not null then
      select id into grammar_id from public.grammar_points
      where title = '{sql_str(gp["title"])}' and jlpt_level = 'n5' limit 1;
      if grammar_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
      end if;
    end if;"""
            )
        unit_blocks.append(
            f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(unit_name)}', 'Advanced N5 grammar patterns and particles.', {unit_order}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(unit_name)}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(unit_name)}' limit 1;

  if unit_id is not null then
{"".join(lesson_blocks)}
  end if;"""
        )

    return f"""
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
{"".join(unit_blocks)}
end;
$grammar_curriculum$;
"""


def build_quiz_units() -> str:
    quiz_blocks = []
    for quiz in UNIT_QUIZZES:
        lesson_type = quiz.get("lesson_type", "practice")
        practice_title = quiz["unit_name"].replace("N5 Mini Exam: ", "Quiz: ")
        item_seed = ""

        if lesson_type == "practice":
            vocab_kana = quiz.get("vocab_kana", [])
            grammar_titles = quiz.get("grammar_titles", [])
            kanji_chars = quiz.get("kanji_characters", [])

            vocab_array = ", ".join(f"'{sql_str(k)}'" for k in vocab_kana) or "null"
            grammar_array = ", ".join(f"'{sql_str(t)}'" for t in grammar_titles) or "null"
            kanji_array = ", ".join(f"'{sql_str(c)}'" for c in kanji_chars) or "null"

            item_seed = f"""
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
    end if;"""

            vocab_decl = f"word_kana_list := array[{vocab_array}];" if vocab_kana else "word_kana_list := null;"
            grammar_decl = f"grammar_title_list := array[{grammar_array}];" if grammar_titles else "grammar_title_list := null;"
            kanji_decl = f"kanji_char_list := array[{kanji_array}];" if kanji_chars else "kanji_char_list := null;"

            lesson_insert = f"""
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(practice_title)}', '{sql_str(quiz["description"])}', 3, 25, 10, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(practice_title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(practice_title)}' limit 1;

    {vocab_decl}
    {grammar_decl}
    {kanji_decl}
{item_seed}"""

        elif lesson_type == "listening_challenge":
            slug = quiz["challenge_slug"]
            lesson_insert = f"""
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'listening_challenge', '{sql_str(practice_title)}', '{sql_str(quiz["description"])}', 3, 30, 12, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(practice_title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(practice_title)}' limit 1;

    if lesson_id is not null then
      select id into content_id from public.listening_challenges where slug = '{sql_str(slug)}' limit 1;
      if content_id is not null then
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'listening_challenge', content_id, 0
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'listening_challenge' and content_id = content_id
        );
      end if;
    end if;"""

        elif lesson_type == "reading_quiz":
            story_slugs = quiz.get("story_slugs", [])
            dialogue_slugs = quiz.get("dialogue_slugs", [])
            story_array = ", ".join(f"'{sql_str(s)}'" for s in story_slugs)
            dialogue_array = ", ".join(f"'{sql_str(s)}'" for s in dialogue_slugs)
            lesson_insert = f"""
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(practice_title)}', '{sql_str(quiz["description"])}', 3, 25, 12, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(practice_title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(practice_title)}' limit 1;

    if lesson_id is not null then
      item_index := 0;
      foreach story_slug in array array[{story_array}] loop
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
      foreach dialogue_slug in array array[{dialogue_array}] loop
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
    end if;"""

        quiz_blocks.append(
            f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(quiz["unit_name"])}', '{sql_str(quiz["description"])}', {quiz["order_index"]}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(quiz["unit_name"])}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(quiz["unit_name"])}' limit 1;

  if unit_id is not null then
{lesson_insert}
  end if;"""
        )

    return f"""
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
{"".join(quiz_blocks)}
end;
$unit_quizzes$;
"""


def main() -> None:
    sql = (
        "-- N5 grammar expansion wave 2 + unit mini-exams\n\n"
        + build_grammar_inserts()
        + "\n"
        + build_grammar_examples()
        + "\n"
        + build_grammar_curriculum()
        + "\n"
        + build_quiz_units()
    )
    OUT.write_text(sql, encoding="utf-8")
    print(
        f"Wrote {OUT.name}: {len(GRAMMAR_POINTS)} grammar points, "
        f"{len(UNIT_QUIZZES)} mini-exam units"
    )


if __name__ == "__main__":
    main()
