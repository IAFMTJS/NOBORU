"""Generate Phase 8 N5 vocabulary migration SQL."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260608220000_n5_vocabulary_region.sql"

UNITS = [
    {
        "name": "People & Places",
        "description": "Essential nouns for people and everyday locations.",
        "order_index": 1,
        "lessons": [
            {
                "title": "People",
                "words": [
                    ("わたし", "私", "I, me", "pronoun", "わたしは学生です。", "Watashi wa gakusei desu.", "I am a student."),
                    ("ひと", "人", "person", "noun", "あの人は先生です。", "Ano hito wa sensei desu.", "That person is a teacher."),
                    ("ともだち", "友達", "friend", "noun", "友達と学校へ行きます。", "Tomodachi to gakkou e ikimasu.", "I go to school with a friend."),
                    ("せんせい", "先生", "teacher", "noun", "先生は親切です。", "Sensei wa shinsetsu desu.", "The teacher is kind."),
                    ("がくせい", "学生", "student", "noun", "学生は図書館にいます。", "Gakusei wa toshokan ni imasu.", "The student is in the library."),
                ],
            },
            {
                "title": "Places",
                "words": [
                    ("がっこう", "学校", "school", "noun", "学校は大きいです。", "Gakkou wa ookii desu.", "The school is big."),
                    ("いえ", "家", "house, home", "noun", "家に帰ります。", "Ie ni kaerimasu.", "I return home."),
                    ("みせ", "店", "shop, store", "noun", "店で水を買います。", "Mise de mizu o kaimasu.", "I buy water at the shop."),
                    ("えき", "駅", "station", "noun", "駅はここです。", "Eki wa koko desu.", "The station is here."),
                    ("くに", "国", "country", "noun", "日本は美しい国です。", "Nihon wa utsukushii kuni desu.", "Japan is a beautiful country."),
                ],
            },
        ],
    },
    {
        "name": "Time & Numbers",
        "description": "Talk about when things happen and basic counting.",
        "order_index": 2,
        "lessons": [
            {
                "title": "Time",
                "words": [
                    ("きょう", "今日", "today", "noun", "今日は忙しいです。", "Kyou wa isogashii desu.", "Today is busy."),
                    ("あした", "明日", "tomorrow", "noun", "明日学校へ行きます。", "Ashita gakkou e ikimasu.", "I will go to school tomorrow."),
                    ("きのう", "昨日", "yesterday", "noun", "昨日友達に会いました。", "Kinou tomodachi ni aimashita.", "I met a friend yesterday."),
                    ("じかん", "時間", "time", "noun", "時間がありません。", "Jikan ga arimasen.", "There is no time."),
                    ("いま", "今", "now", "noun", "今、勉強します。", "Ima, benkyou shimasu.", "I will study now."),
                ],
            },
            {
                "title": "Numbers",
                "words": [
                    ("いち", "一", "one", "noun", "一つください。", "Hitotsu kudasai.", "One please."),
                    ("に", "二", "two", "noun", "二つあります。", "Futatsu arimasu.", "There are two."),
                    ("さん", "三", "three", "noun", "三人います。", "Sannin imasu.", "There are three people."),
                    ("よん", "四", "four", "noun", "四時に会いましょう。", "Yoji ni aimashou.", "Let's meet at four o'clock."),
                    ("ご", "五", "five", "noun", "五つ買いました。", "Itsutsu kaimashita.", "I bought five."),
                ],
            },
        ],
    },
    {
        "name": "Actions & Descriptions",
        "description": "Common verbs and adjectives for daily conversation.",
        "order_index": 3,
        "lessons": [
            {
                "title": "Food & Drink",
                "words": [
                    ("みず", "水", "water", "noun", "水を飲みます。", "Mizu o nomimasu.", "I drink water."),
                    ("ごはん", "ご飯", "rice, meal", "noun", "ご飯を食べます。", "Gohan o tabemasu.", "I eat a meal."),
                    ("にく", "肉", "meat", "noun", "肉が好きです。", "Niku ga suki desu.", "I like meat."),
                    ("さかな", "魚", "fish", "noun", "魚を食べません。", "Sakana o tabemasen.", "I do not eat fish."),
                    ("くだもの", "果物", "fruit", "noun", "果物は安いです。", "Kudamono wa yasui desu.", "Fruit is cheap."),
                ],
            },
            {
                "title": "Common Verbs",
                "words": [
                    ("いく", "行く", "to go", "verb", "学校へ行きます。", "Gakkou e ikimasu.", "I go to school."),
                    ("くる", "来る", "to come", "verb", "友達が来ます。", "Tomodachi ga kimasu.", "A friend is coming."),
                    ("たべる", "食べる", "to eat", "verb", "ご飯を食べます。", "Gohan o tabemasu.", "I eat a meal."),
                    ("のむ", "飲む", "to drink", "verb", "水を飲みます。", "Mizu o nomimasu.", "I drink water."),
                    ("みる", "見る", "to see, watch", "verb", "テレビを見ます。", "Terebi o mimasu.", "I watch TV."),
                ],
            },
            {
                "title": "Descriptors",
                "words": [
                    ("おおきい", "大きい", "big", "adjective", "学校は大きいです。", "Gakkou wa ookii desu.", "The school is big."),
                    ("ちいさい", "小さい", "small", "adjective", "店は小さいです。", "Mise wa chiisai desu.", "The shop is small."),
                    ("あたらしい", "新しい", "new", "adjective", "新しい本です。", "Atarashii hon desu.", "It is a new book."),
                    ("ふるい", "古い", "old", "adjective", "古い家です。", "Furui ie desu.", "It is an old house."),
                    ("いい", "いい", "good", "adjective", "いい天気です。", "Ii tenki desu.", "The weather is good."),
                ],
            },
        ],
    },
]

PRACTICE_TITLE = "N5 Vocabulary Check"
PRACTICE_DESCRIPTION = "Mixed recall across the N5 words you have learned."


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def build_vocab_values() -> str:
    rows = []
    seen = set()
    for unit in UNITS:
        for lesson in unit["lessons"]:
            for word in lesson["words"]:
                kana = word[0]
                if kana in seen:
                    continue
                seen.add(kana)
                kanji, meaning, pos = word[1], word[2], word[3]
                kanji_sql = f"'{sql_str(kanji)}'" if kanji else "null"
                rows.append(
                    f"    ('{sql_str(kana)}', {kanji_sql}, '{sql_str(meaning)}', "
                    f"'{sql_str(pos)}', 'n5'::public.jlpt_level, 'published'::public.content_status)"
                )
    return ",\n".join(rows)


def build_example_seed_block() -> str:
    rows = []
    for unit in UNITS:
        for lesson in unit["lessons"]:
            for word in lesson["words"]:
                kana, _, _, _, jp, romaji, en = word
                rows.append(
                    f"    ('{sql_str(kana)}', '{sql_str(jp)}', '{sql_str(romaji)}', '{sql_str(en)}')"
                )

    return f"""
insert into public.vocabulary_examples (
  vocabulary_id, japanese_text, romaji, english, order_index, status
)
select v.id, e.japanese_text, e.romaji, e.english, 0, 'published'
from public.vocabulary v
inner join (
  values
{",\n".join(rows)}
) as e(kana, japanese_text, romaji, english) on e.kana = v.kana
where v.jlpt_level = 'n5'
  and not exists (
    select 1 from public.vocabulary_examples existing
    where existing.vocabulary_id = v.id
      and existing.japanese_text = e.japanese_text
  );
"""


def build_curriculum_block() -> str:
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
            kana_list = [word[0] for word in lesson["words"]]
            kana_array = ", ".join(f"'{sql_str(kana)}'" for kana in kana_list)
            parts.append(
                f"""
  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'vocabulary', '{sql_str(title)}', 'Learn essential N5 vocabulary.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(title)}' limit 1;

    if lesson_id is not null then
      word_kana_list := array[{kana_array}];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;"""
            )

    practice_kana = []
    for unit in UNITS:
        for lesson in unit["lessons"]:
            if lesson["words"]:
                practice_kana.append(lesson["words"][0][0])

    parts.append(
        f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Vocabulary Practice', 'Mixed review across N5 vocabulary.', 4, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Vocabulary Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Vocabulary Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(PRACTICE_TITLE)}', '{sql_str(PRACTICE_DESCRIPTION)}', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}' limit 1;

    if lesson_id is not null then
      word_kana_list := array[{", ".join(f"'{sql_str(kana)}'" for kana in practice_kana)}];
      item_index := 0;
      foreach word_kana in array word_kana_list loop
        select id into vocab_id from public.vocabulary
        where status = 'published' and jlpt_level = 'n5' and kana = word_kana
        limit 1;
        if vocab_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'vocabulary', vocab_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'vocabulary' and content_id = vocab_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;"""
    )

    return "\n".join(parts)


HEADER = """-- Phase 8: N5 vocabulary region (Mount N5)

create table public.vocabulary_examples (
  id uuid primary key default gen_random_uuid(),
  vocabulary_id uuid not null references public.vocabulary (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vocabulary_examples_vocabulary_id_idx
  on public.vocabulary_examples (vocabulary_id);

create trigger vocabulary_examples_set_updated_at
  before update on public.vocabulary_examples
  for each row execute function public.set_updated_at();

alter table public.vocabulary_examples enable row level security;

create policy "Authenticated users read published vocabulary examples"
  on public.vocabulary_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage vocabulary examples"
  on public.vocabulary_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.regions (slug, name, description, order_index, status)
select
  'mount-n5',
  'Mount N5',
  'The first summit path. Build your core N5 vocabulary.',
  2,
  'published'
where not exists (
  select 1 from public.regions where slug = 'mount-n5'
);

insert into public.vocabulary (kana, kanji, meaning, part_of_speech, jlpt_level, status)
select v.kana, v.kanji, v.meaning, v.part_of_speech, v.jlpt_level, v.status
from (
  values
"""

FOOTER = """
) as v(kana, kanji, meaning, part_of_speech, jlpt_level, status)
where not exists (
  select 1 from public.vocabulary existing where existing.kana = v.kana
);
"""

CURRICULUM_HEADER = """
do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  vocab_id uuid;
  word_kana_list text[];
  word_kana text;
  item_index integer;
begin
"""

CURRICULUM_FOOTER = """
end $seed$;
"""


def main() -> None:
    sql = (
        HEADER
        + build_vocab_values()
        + FOOTER
        + build_example_seed_block()
        + CURRICULUM_HEADER
        + build_curriculum_block()
        + CURRICULUM_FOOTER
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
