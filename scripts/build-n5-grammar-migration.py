"""Generate Phase 9 N5 grammar migration SQL."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260608240000_n5_grammar_region.sql"

GRAMMAR_POINTS = [
    {
        "title": "を (o)",
        "meaning": "Direct object particle",
        "explanation": "Marks the direct object of a verb — what receives the action.",
        "examples": [
            ("水を飲みます。", "Mizu o nomimasu.", "I drink water."),
            ("ご飯を食べます。", "Gohan o tabemasu.", "I eat a meal."),
        ],
    },
    {
        "title": "が (ga)",
        "meaning": "Subject marker particle",
        "explanation": "Marks the grammatical subject, often for new information or emphasis.",
        "examples": [
            ("猫がいます。", "Neko ga imasu.", "There is a cat."),
            ("雨が降ります。", "Ame ga furimasu.", "It rains."),
        ],
    },
    {
        "title": "に (ni)",
        "meaning": "Direction, time, and location particle",
        "explanation": "Marks direction (to), specific times, and static locations.",
        "examples": [
            ("学校に行きます。", "Gakkou ni ikimasu.", "I go to school."),
            ("七時に起きます。", "Shichiji ni okimasu.", "I wake up at seven."),
        ],
    },
    {
        "title": "で (de)",
        "meaning": "Location of action and means particle",
        "explanation": "Marks where an action takes place or the means used to do something.",
        "examples": [
            ("学校で勉強します。", "Gakkou de benkyou shimasu.", "I study at school."),
            ("バスで行きます。", "Basu de ikimasu.", "I go by bus."),
        ],
    },
    {
        "title": "と (to)",
        "meaning": "And / with particle",
        "explanation": "Connects nouns (and) or marks companions (with).",
        "examples": [
            ("友達と行きます。", "Tomodachi to ikimasu.", "I go with a friend."),
            ("水とご飯を買います。", "Mizu to gohan o kaimasu.", "I buy water and a meal."),
        ],
    },
    {
        "title": "も (mo)",
        "meaning": "Also / too particle",
        "explanation": "Replaces は, が, or を to mean also or too.",
        "examples": [
            ("私も学生です。", "Watashi mo gakusei desu.", "I am also a student."),
            ("水も飲みます。", "Mizu mo nomimasu.", "I also drink water."),
        ],
    },
    {
        "title": "へ (e)",
        "meaning": "Direction toward particle",
        "explanation": "Marks direction toward a place, similar to に but emphasizes movement.",
        "examples": [
            ("日本へ行きます。", "Nihon e ikimasu.", "I go to Japan."),
            ("駅へ歩きます。", "Eki e arukimasu.", "I walk toward the station."),
        ],
    },
    {
        "title": "の (no)",
        "meaning": "Possession and modification particle",
        "explanation": "Links nouns to show possession or describe relationships.",
        "examples": [
            ("私の友達", "Watashi no tomodachi", "My friend"),
            ("日本の学校", "Nihon no gakkou", "A Japanese school"),
        ],
    },
    {
        "title": "か (ka)",
        "meaning": "Question particle",
        "explanation": "Placed at the end of a sentence to turn it into a question.",
        "examples": [
            ("学生ですか。", "Gakusei desu ka.", "Are you a student?"),
            ("水を飲みますか。", "Mizu o nomimasu ka.", "Do you drink water?"),
        ],
    },
    {
        "title": "ません (masen)",
        "meaning": "Negative polite form",
        "explanation": "Attaches to verb stems to make polite negative sentences.",
        "examples": [
            ("行きません。", "Ikimasen.", "I do not go."),
            ("食べません。", "Tabemasen.", "I do not eat."),
        ],
    },
    {
        "title": "ましょう (mashou)",
        "meaning": "Let's / suggestion form",
        "explanation": "Used to make polite suggestions or invitations.",
        "examples": [
            ("行きましょう。", "Ikimashou.", "Let's go."),
            ("勉強しましょう。", "Benkyou shimashou.", "Let's study."),
        ],
    },
    {
        "title": "あります・います",
        "meaning": "Existence verbs (inanimate / animate)",
        "explanation": "あります for things; います for living beings.",
        "examples": [
            ("本があります。", "Hon ga arimasu.", "There is a book."),
            ("猫がいます。", "Neko ga imasu.", "There is a cat."),
        ],
    },
    {
        "title": "い-adjective + です",
        "meaning": "Polite い-adjective sentences",
        "explanation": "Connect い-adjectives directly to です in polite speech.",
        "examples": [
            ("大きいです。", "Ookii desu.", "It is big."),
            ("新しいです。", "Atarashii desu.", "It is new."),
        ],
    },
    {
        "title": "な-adjective + です",
        "meaning": "Polite な-adjective sentences",
        "explanation": "Place な between a な-adjective and です.",
        "examples": [
            ("静かです。", "Shizuka desu.", "It is quiet."),
            ("好きです。", "Suki desu.", "I like it."),
        ],
    },
    {
        "title": "くない (kunai)",
        "meaning": "い-adjective negative",
        "explanation": "Replace い with くない to negate い-adjectives in plain form.",
        "examples": [
            ("大きくない。", "Ookikunai.", "It is not big."),
            ("新しくない。", "Atarashikunai.", "It is not new."),
        ],
    },
    {
        "title": "が好き (ga suki)",
        "meaning": "Liking something pattern",
        "explanation": "Use が with 好き to express liking a person or thing.",
        "examples": [
            ("猫が好きです。", "Neko ga suki desu.", "I like cats."),
            ("音楽が好きです。", "Ongaku ga suki desu.", "I like music."),
        ],
    },
]

UNITS = [
    {
        "name": "Core Particles I",
        "description": "Essential particles for objects, subjects, and locations.",
        "order_index": 5,
        "lessons": [
            {
                "title": "Object & Subject",
                "points": ["を (o)", "が (ga)", "に (ni)", "で (de)"],
            },
        ],
    },
    {
        "name": "Core Particles II",
        "description": "Particles for connection, emphasis, and possession.",
        "order_index": 6,
        "lessons": [
            {
                "title": "Connection & Possession",
                "points": ["と (to)", "も (mo)", "へ (e)", "の (no)"],
            },
        ],
    },
    {
        "name": "Sentence Patterns",
        "description": "Questions, negation, and existence patterns.",
        "order_index": 7,
        "lessons": [
            {
                "title": "Questions & Negation",
                "points": ["か (ka)", "ません (masen)", "ましょう (mashou)", "あります・います"],
            },
        ],
    },
    {
        "name": "Adjective Patterns",
        "description": "Describe things with い-adjectives and な-adjectives.",
        "order_index": 8,
        "lessons": [
            {
                "title": "Describing Things",
                "points": [
                    "い-adjective + です",
                    "な-adjective + です",
                    "くない (kunai)",
                    "が好き (ga suki)",
                ],
            },
        ],
    },
]

PRACTICE_TITLE = "N5 Grammar Check"
PRACTICE_DESCRIPTION = "Mixed recall across the N5 grammar you have learned."
PRACTICE_POINTS = [
    "を (o)",
    "が (ga)",
    "に (ni)",
    "で (de)",
    "か (ka)",
    "あります・います",
    "い-adjective + です",
    "が好き (ga suki)",
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


def example_seed() -> str:
    rows = []
    for point in GRAMMAR_POINTS:
        for jp, romaji, en in point["examples"]:
            rows.append(
                "    ("
                f"'{sql_str(point['title'])}', "
                f"'{sql_str(jp)}', "
                f"'{sql_str(romaji)}', "
                f"'{sql_str(en)}')"
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

    practice_array = ", ".join(f"'{sql_str(title)}'" for title in PRACTICE_POINTS)
    parts.append(
        f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Grammar Practice', 'Mixed review across N5 grammar.', 9, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Grammar Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Grammar Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(PRACTICE_TITLE)}', '{sql_str(PRACTICE_DESCRIPTION)}', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}' limit 1;

    if lesson_id is not null then
      point_title_list := array[{practice_array}];
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


HEADER = """-- Phase 9: N5 grammar curriculum (Mount N5)

create table public.grammar_examples (
  id uuid primary key default gen_random_uuid(),
  grammar_id uuid not null references public.grammar_points (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index grammar_examples_grammar_id_idx
  on public.grammar_examples (grammar_id);

create trigger grammar_examples_set_updated_at
  before update on public.grammar_examples
  for each row execute function public.set_updated_at();

alter table public.grammar_examples enable row level security;

create policy "Authenticated users read published grammar examples"
  on public.grammar_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage grammar examples"
  on public.grammar_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

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


if __name__ == "__main__":
    main()
