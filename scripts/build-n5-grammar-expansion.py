"""Generate N5 grammar expansion migration SQL (Mount N5 units 17-19)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260611150000_n5_grammar_expansion.sql"

GRAMMAR_POINTS = [
    {
        "title": "は (wa)",
        "meaning": "Topic particle",
        "explanation": "Marks the topic of a sentence — what the speaker is talking about.",
        "examples": [
            ("私は学生です。", "Watashi wa gakusei desu.", "I am a student."),
            ("水は冷たいです。", "Mizu wa tsumetai desu.", "The water is cold."),
        ],
    },
    {
        "title": "です (desu)",
        "meaning": "Polite copula",
        "explanation": "Links a noun or adjective to the subject in polite speech.",
        "examples": [
            ("学生です。", "Gakusei desu.", "I am a student."),
            ("静かです。", "Shizuka desu.", "It is quiet."),
        ],
    },
    {
        "title": "ます (masu)",
        "meaning": "Polite verb ending",
        "explanation": "Attaches to verb stems to form polite present or future tense.",
        "examples": [
            ("行きます。", "Ikimasu.", "I go."),
            ("食べます。", "Tabemasu.", "I eat."),
        ],
    },
    {
        "title": "ました (mashita)",
        "meaning": "Polite past tense",
        "explanation": "Replaces ます to express completed actions in polite speech.",
        "examples": [
            ("行きました。", "Ikimashita.", "I went."),
            ("食べました。", "Tabemashita.", "I ate."),
        ],
    },
    {
        "title": "ませんでした (masen deshita)",
        "meaning": "Polite past negative",
        "explanation": "Expresses that something did not happen in polite past tense.",
        "examples": [
            ("行きませんでした。", "Ikimasen deshita.", "I did not go."),
            ("食べませんでした。", "Tabemasen deshita.", "I did not eat."),
        ],
    },
    {
        "title": "どこ (doko)",
        "meaning": "Where (question word)",
        "explanation": "Asks about location; often paired with ですか for polite questions.",
        "examples": [
            ("トイレはどこですか。", "Toire wa doko desu ka.", "Where is the restroom?"),
            ("どこへ行きますか。", "Doko e ikimasu ka.", "Where are you going?"),
        ],
    },
    {
        "title": "なに/何 (nani)",
        "meaning": "What (question word)",
        "explanation": "Asks about things or actions; pronunciation shifts before certain sounds.",
        "examples": [
            ("これは何ですか。", "Kore wa nan desu ka.", "What is this?"),
            ("何を食べますか。", "Nani o tabemasu ka.", "What will you eat?"),
        ],
    },
    {
        "title": "いつ (itsu)",
        "meaning": "When (question word)",
        "explanation": "Asks about time; place before the verb or at the start of a question.",
        "examples": [
            ("いつ行きますか。", "Itsu ikimasu ka.", "When will you go?"),
            ("会議はいつですか。", "Kaigi wa itsu desu ka.", "When is the meeting?"),
        ],
    },
    {
        "title": "だれ/誰 (dare)",
        "meaning": "Who (question word)",
        "explanation": "Asks about people; use with は for identity or が for subject emphasis.",
        "examples": [
            ("あの人は誰ですか。", "Ano hito wa dare desu ka.", "Who is that person?"),
            ("誰が来ますか。", "Dare ga kimasu ka.", "Who is coming?"),
        ],
    },
    {
        "title": "から (kara)",
        "meaning": "From (starting point)",
        "explanation": "Marks a starting point in time or space.",
        "examples": [
            ("学校から帰ります。", "Gakkou kara kaerimasu.", "I return from school."),
            ("九時から始まります。", "Kuji kara hajimarimasu.", "It starts from nine o'clock."),
        ],
    },
    {
        "title": "まで (made)",
        "meaning": "Until / to (ending point)",
        "explanation": "Marks an ending point in time or a destination limit.",
        "examples": [
            ("駅まで歩きます。", "Eki made arukimasu.", "I walk to the station."),
            ("五時まで働きます。", "Go-ji made hatarakimasu.", "I work until five o'clock."),
        ],
    },
    {
        "title": "たい (tai)",
        "meaning": "Want to",
        "explanation": "Attaches to verb stems to express desire; often used with です in polite speech.",
        "examples": [
            ("日本へ行きたいです。", "Nihon e ikitai desu.", "I want to go to Japan."),
            ("寿司を食べたいです。", "Sushi o tabetai desu.", "I want to eat sushi."),
        ],
    },
    {
        "title": "てください (te kudasai)",
        "meaning": "Please do",
        "explanation": "Combines the て-form with ください to make polite requests.",
        "examples": [
            ("座ってください。", "Suwatte kudasai.", "Please sit down."),
            ("待ってください。", "Matte kudasai.", "Please wait."),
        ],
    },
    {
        "title": "ない (nai)",
        "meaning": "Plain negative",
        "explanation": "Attaches to verb stems for plain negative present tense.",
        "examples": [
            ("行かない。", "Ikanai.", "I do not go."),
            ("食べない。", "Tabenai.", "I do not eat."),
        ],
    },
    {
        "title": "て-form basics",
        "meaning": "Connecting verbs",
        "explanation": "The て-form links verbs in sequence or leads into patterns like てください.",
        "examples": [
            ("食べて、飲みます。", "Tabete, nomimasu.", "I eat and drink."),
            ("起きて、学校へ行きます。", "Okite, gakkou e ikimasu.", "I wake up and go to school."),
        ],
    },
]

UNITS = [
    {
        "name": "Foundations Review",
        "description": "Core sentence patterns: topic marker, copula, and polite verb forms.",
        "order_index": 17,
        "lessons": [
            {
                "title": "Foundations Review",
                "points": ["は (wa)", "です (desu)", "ます (masu)", "ました (mashita)"],
            },
        ],
    },
    {
        "name": "Questions & Negation",
        "description": "Question words and negative sentence patterns.",
        "order_index": 18,
        "lessons": [
            {
                "title": "Questions & Negation",
                "points": [
                    "どこ (doko)",
                    "なに/何 (nani)",
                    "いつ (itsu)",
                    "だれ/誰 (dare)",
                    "ませんでした (masen deshita)",
                    "ない (nai)",
                ],
            },
        ],
    },
    {
        "name": "Connection Patterns",
        "description": "Range particles, desire, requests, and verb connection.",
        "order_index": 19,
        "lessons": [
            {
                "title": "Connection Patterns",
                "points": [
                    "から (kara)",
                    "まで (made)",
                    "たい (tai)",
                    "てください (te kudasai)",
                    "て-form basics",
                ],
            },
        ],
    },
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def grammar_values() -> str:
    rows = []
    for point in GRAMMAR_POINTS:
        rows.append(
            "    ("
            f"'{sql_str(point['title'])}', "
            f"'{sql_str(point['meaning'])}', "
            f"'{sql_str(point['explanation'])}', "
            "'n5'::public.jlpt_level, 1, 'published'::public.content_status)"
        )
    return ",\n".join(rows)


def build_example_values() -> str:
    rows = []
    for point in GRAMMAR_POINTS:
        for index, (jp, romaji, en) in enumerate(point["examples"]):
            rows.append(
                "    ("
                f"'{sql_str(point['title'])}', "
                f"'{sql_str(jp)}', "
                f"'{sql_str(romaji)}', "
                f"'{sql_str(en)}', "
                f"{index})"
            )
    return ",\n".join(rows)


def curriculum_block() -> str:
    parts = [
        "  select id into region_id from public.regions where slug = 'mount-n5' limit 1;",
        "  if region_id is null then return; end if;",
    ]

    for unit in UNITS:
        parts.append(
            f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, '{sql_str(unit["name"])}', '{sql_str(unit["description"])}', {unit["order_index"]}, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = '{sql_str(unit["name"])}'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = '{sql_str(unit["name"])}' limit 1;"""
        )
        for lesson in unit["lessons"]:
            title = lesson["title"]
            title_array = ", ".join(f"'{sql_str(point)}'" for point in lesson["points"])
            parts.append(
                f"""
  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'grammar', '{sql_str(title)}', 'Learn essential N5 grammar patterns.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(title)}' limit 1;

    if lesson_id is not null then
      point_title_list := array[{title_array}];
      item_index := 0;
      foreach point_title in array point_title_list loop
        select id into grammar_id from public.grammar_points
        where status = 'published' and jlpt_level = 'n5' and title = point_title
        limit 1;
        if grammar_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'grammar', grammar_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'grammar' and content_id = grammar_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;"""
            )

    return "\n".join(parts)


HEADER = """-- N5 grammar expansion (Mount N5 units 17-19)

insert into public.grammar_points (title, meaning, explanation, jlpt_level, difficulty, status)
select v.title, v.meaning, v.explanation, v.jlpt_level, v.difficulty, v.status
from (
  values
"""

FOOTER = """
) as v(title, meaning, explanation, jlpt_level, difficulty, status)
where not exists (
  select 1 from public.grammar_points existing where existing.title = v.title
);

insert into public.grammar_examples (
  grammar_id, japanese_text, romaji, english, order_index, status
)
select g.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.grammar_points g
inner join (
  values
"""

EXAMPLE_FOOTER = """
) as e(title, japanese_text, romaji, english, order_index) on e.title = g.title
where g.jlpt_level = 'n5'
  and not exists (
    select 1 from public.grammar_examples existing
    where existing.grammar_id = g.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  grammar_id uuid;
  point_title_list text[];
  point_title text;
  item_index integer;
begin
"""

CURRICULUM_FOOTER = """
end $seed$;
"""


def main() -> None:
    sql = (
        HEADER
        + grammar_values()
        + FOOTER
        + build_example_values()
        + EXAMPLE_FOOTER
        + curriculum_block()
        + CURRICULUM_FOOTER
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Grammar points: {len(GRAMMAR_POINTS)}")


if __name__ == "__main__":
    main()
