"""Generate Phase 10 N5 kanji academy migration SQL."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260608260000_n5_kanji_academy.sql"

BASE_CHARS = (
    "一七万三上下中九二五人今休何先入八六円出分前北十千午半南友口古右名四国土外多大天女子学安小少山川左年店後手新日時月木本来東校母民水火父生用田男白百目真社空立耳聞花行西見言語読車金長間雨電食高魚駅"
)
EXTRA_CHARS = "力書話会売買問答教方道室家明週毎曜朝昼夜気町牛弱強早"
KANJI_ORDER = list(BASE_CHARS + EXTRA_CHARS[:6])

UNITS = [
    {
        "name": "Kanji Part I",
        "description": "Numbers, time, and core daily kanji.",
        "order_index": 10,
        "lesson_size": 10,
        "start": 0,
        "count": 30,
    },
    {
        "name": "Kanji Part II",
        "description": "People, places, and nature kanji.",
        "order_index": 11,
        "lesson_size": 10,
        "start": 30,
        "count": 30,
    },
    {
        "name": "Kanji Part III",
        "description": "Actions, directions, and school kanji.",
        "order_index": 12,
        "lesson_size": 10,
        "start": 60,
        "count": 30,
    },
    {
        "name": "Kanji Part IV",
        "description": "Advanced N5 kanji and daily life.",
        "order_index": 13,
        "lesson_size": 10,
        "start": 90,
        "count": 13,
    },
]

PRACTICE_TITLE = "N5 Kanji Check"
PRACTICE_DESCRIPTION = "Mixed recall across the N5 kanji you have learned."
PRACTICE_PICK = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 96, 102]

MEANINGS = {
    "一": "one",
    "七": "seven",
    "万": "ten thousand",
    "三": "three",
    "上": "above, up",
    "下": "below, down",
    "中": "middle, inside",
    "九": "nine",
    "二": "two",
    "五": "five",
    "人": "person",
    "今": "now",
    "休": "rest",
    "何": "what",
    "先": "previous, ahead",
    "入": "enter",
    "八": "eight",
    "六": "six",
    "円": "yen, circle",
    "出": "exit, leave",
    "分": "minute, part",
    "前": "before, front",
    "北": "north",
    "十": "ten",
    "千": "thousand",
    "午": "noon",
    "半": "half",
    "南": "south",
    "友": "friend",
    "口": "mouth",
    "古": "old",
    "右": "right",
    "名": "name",
    "四": "four",
    "国": "country",
    "土": "earth, soil",
    "外": "outside",
    "多": "many",
    "大": "big",
    "天": "heaven, sky",
    "女": "woman",
    "子": "child",
    "学": "study",
    "安": "cheap, peaceful",
    "小": "small",
    "少": "few",
    "山": "mountain",
    "川": "river",
    "左": "left",
    "年": "year",
    "店": "shop",
    "後": "after, behind",
    "手": "hand",
    "新": "new",
    "日": "day, sun",
    "時": "time, hour",
    "月": "month, moon",
    "木": "tree, wood",
    "本": "book, origin",
    "来": "come",
    "東": "east",
    "校": "school",
    "母": "mother",
    "民": "people, citizens",
    "水": "water",
    "火": "fire",
    "父": "father",
    "生": "life, birth",
    "用": "use",
    "田": "rice field",
    "男": "man",
    "白": "white",
    "百": "hundred",
    "目": "eye",
    "真": "true",
    "社": "company, shrine",
    "空": "sky, empty",
    "立": "stand",
    "耳": "ear",
    "聞": "hear",
    "花": "flower",
    "行": "go",
    "西": "west",
    "見": "see",
    "言": "say",
    "語": "language",
    "読": "read",
    "車": "car",
    "金": "gold, money",
    "長": "long, leader",
    "間": "interval, between",
    "雨": "rain",
    "電": "electricity",
    "食": "eat",
    "高": "high, expensive",
    "魚": "fish",
    "駅": "station",
    "力": "power",
    "書": "write",
    "話": "talk",
    "会": "meet",
    "売": "sell",
    "買": "buy",
    "問": "ask",
}

STROKES = {
    "一": 1,
    "七": 2,
    "万": 3,
    "三": 3,
    "上": 3,
    "下": 3,
    "中": 4,
    "九": 2,
    "二": 2,
    "五": 4,
    "人": 2,
    "今": 4,
    "休": 6,
    "何": 7,
    "先": 6,
    "入": 2,
    "八": 2,
    "六": 4,
    "円": 4,
    "出": 5,
    "分": 4,
    "前": 9,
    "北": 5,
    "十": 2,
    "千": 3,
    "午": 4,
    "半": 5,
    "南": 9,
    "友": 4,
    "口": 3,
    "古": 5,
    "右": 5,
    "名": 6,
    "四": 5,
    "国": 8,
    "土": 3,
    "外": 5,
    "多": 6,
    "大": 3,
    "天": 4,
    "女": 3,
    "子": 3,
    "学": 8,
    "安": 6,
    "小": 3,
    "少": 4,
    "山": 3,
    "川": 3,
    "左": 5,
    "年": 6,
    "店": 8,
    "後": 9,
    "手": 4,
    "新": 13,
    "日": 4,
    "時": 10,
    "月": 4,
    "木": 4,
    "本": 5,
    "来": 7,
    "東": 8,
    "校": 10,
    "母": 5,
    "民": 5,
    "水": 4,
    "火": 4,
    "父": 4,
    "生": 5,
    "用": 5,
    "田": 5,
    "男": 7,
    "白": 5,
    "百": 6,
    "目": 5,
    "真": 10,
    "社": 7,
    "空": 8,
    "立": 5,
    "耳": 6,
    "聞": 14,
    "花": 7,
    "行": 6,
    "西": 6,
    "見": 7,
    "言": 7,
    "語": 14,
    "読": 14,
    "車": 7,
    "金": 8,
    "長": 8,
    "間": 12,
    "雨": 8,
    "電": 13,
    "食": 9,
    "高": 10,
    "魚": 11,
    "駅": 14,
    "力": 2,
    "書": 10,
    "話": 13,
    "会": 6,
    "売": 7,
    "買": 12,
    "問": 11,
}

READINGS = {
    "一": [("イチ", "onyomi"), ("ひと", "kunyomi")],
    "七": [("シチ", "onyomi"), ("なな", "kunyomi")],
    "万": [("マン", "onyomi")],
    "三": [("サン", "onyomi"), ("みっ", "kunyomi")],
    "上": [("ジョウ", "onyomi"), ("うえ", "kunyomi")],
    "下": [("カ", "onyomi"), ("した", "kunyomi")],
    "中": [("チュウ", "onyomi"), ("なか", "kunyomi")],
    "九": [("キュウ", "onyomi"), ("ここの", "kunyomi")],
    "二": [("ニ", "onyomi"), ("ふた", "kunyomi")],
    "五": [("ゴ", "onyomi"), ("いつ", "kunyomi")],
    "人": [("ジン", "onyomi"), ("ひと", "kunyomi")],
    "今": [("コン", "onyomi"), ("いま", "kunyomi")],
    "休": [("キュウ", "onyomi"), ("やす", "kunyomi")],
    "何": [("カ", "onyomi"), ("なに", "kunyomi")],
    "先": [("セン", "onyomi"), ("さき", "kunyomi")],
    "入": [("ニュウ", "onyomi"), ("はい", "kunyomi")],
    "八": [("ハチ", "onyomi"), ("やっ", "kunyomi")],
    "六": [("ロク", "onyomi"), ("むっ", "kunyomi")],
    "円": [("エン", "onyomi")],
    "出": [("シュツ", "onyomi"), ("で", "kunyomi")],
    "分": [("ブン", "onyomi"), ("わ", "kunyomi")],
    "前": [("ゼン", "onyomi"), ("まえ", "kunyomi")],
    "北": [("ホク", "onyomi"), ("きた", "kunyomi")],
    "十": [("ジュウ", "onyomi"), ("とお", "kunyomi")],
    "千": [("セン", "onyomi"), ("ち", "kunyomi")],
    "午": [("ゴ", "onyomi")],
    "半": [("ハン", "onyomi"), ("なか", "kunyomi")],
    "南": [("ナン", "onyomi"), ("みなみ", "kunyomi")],
    "友": [("ユウ", "onyomi"), ("とも", "kunyomi")],
    "口": [("コウ", "onyomi"), ("くち", "kunyomi")],
    "古": [("コ", "onyomi"), ("ふる", "kunyomi")],
    "右": [("ウ", "onyomi"), ("みぎ", "kunyomi")],
    "名": [("メイ", "onyomi"), ("な", "kunyomi")],
    "四": [("シ", "onyomi"), ("よん", "kunyomi")],
    "国": [("コク", "onyomi"), ("くに", "kunyomi")],
    "土": [("ド", "onyomi"), ("つち", "kunyomi")],
    "外": [("ガイ", "onyomi"), ("そと", "kunyomi")],
    "多": [("タ", "onyomi"), ("おお", "kunyomi")],
    "大": [("ダイ", "onyomi"), ("おお", "kunyomi")],
    "天": [("テン", "onyomi"), ("あま", "kunyomi")],
    "女": [("ジョ", "onyomi"), ("おんな", "kunyomi")],
    "子": [("シ", "onyomi"), ("こ", "kunyomi")],
    "学": [("ガク", "onyomi"), ("まな", "kunyomi")],
    "安": [("アン", "onyomi"), ("やす", "kunyomi")],
    "小": [("ショウ", "onyomi"), ("ちい", "kunyomi")],
    "少": [("ショウ", "onyomi"), ("すく", "kunyomi")],
    "山": [("サン", "onyomi"), ("やま", "kunyomi")],
    "川": [("セン", "onyomi"), ("かわ", "kunyomi")],
    "左": [("サ", "onyomi"), ("ひだり", "kunyomi")],
    "年": [("ネン", "onyomi"), ("とし", "kunyomi")],
    "店": [("テン", "onyomi"), ("みせ", "kunyomi")],
    "後": [("ゴ", "onyomi"), ("あと", "kunyomi")],
    "手": [("シュ", "onyomi"), ("て", "kunyomi")],
    "新": [("シン", "onyomi"), ("あたら", "kunyomi")],
    "日": [("ニチ", "onyomi"), ("ひ", "kunyomi")],
    "時": [("ジ", "onyomi"), ("とき", "kunyomi")],
    "月": [("ゲツ", "onyomi"), ("つき", "kunyomi")],
    "木": [("モク", "onyomi"), ("き", "kunyomi")],
    "本": [("ホン", "onyomi"), ("もと", "kunyomi")],
    "来": [("ライ", "onyomi"), ("く", "kunyomi")],
    "東": [("トウ", "onyomi"), ("ひがし", "kunyomi")],
    "校": [("コウ", "onyomi")],
    "母": [("ボ", "onyomi"), ("はは", "kunyomi")],
    "民": [("ミン", "onyomi"), ("たみ", "kunyomi")],
    "水": [("スイ", "onyomi"), ("みず", "kunyomi")],
    "火": [("カ", "onyomi"), ("ひ", "kunyomi")],
    "父": [("フ", "onyomi"), ("ちち", "kunyomi")],
    "生": [("セイ", "onyomi"), ("い", "kunyomi")],
    "用": [("ヨウ", "onyomi"), ("もち", "kunyomi")],
    "田": [("デン", "onyomi"), ("た", "kunyomi")],
    "男": [("ダン", "onyomi"), ("おとこ", "kunyomi")],
    "白": [("ハク", "onyomi"), ("しろ", "kunyomi")],
    "百": [("ヒャク", "onyomi"), ("もも", "kunyomi")],
    "目": [("モク", "onyomi"), ("め", "kunyomi")],
    "真": [("シン", "onyomi"), ("ま", "kunyomi")],
    "社": [("シャ", "onyomi"), ("やしろ", "kunyomi")],
    "空": [("クウ", "onyomi"), ("そら", "kunyomi")],
    "立": [("リツ", "onyomi"), ("た", "kunyomi")],
    "耳": [("ジ", "onyomi"), ("みみ", "kunyomi")],
    "聞": [("ブン", "onyomi"), ("き", "kunyomi")],
    "花": [("カ", "onyomi"), ("はな", "kunyomi")],
    "行": [("コウ", "onyomi"), ("い", "kunyomi")],
    "西": [("セイ", "onyomi"), ("にし", "kunyomi")],
    "見": [("ケン", "onyomi"), ("み", "kunyomi")],
    "言": [("ゲン", "onyomi"), ("い", "kunyomi")],
    "語": [("ゴ", "onyomi"), ("かた", "kunyomi")],
    "読": [("ドク", "onyomi"), ("よ", "kunyomi")],
    "車": [("シャ", "onyomi"), ("くるま", "kunyomi")],
    "金": [("キン", "onyomi"), ("かね", "kunyomi")],
    "長": [("チョウ", "onyomi"), ("なが", "kunyomi")],
    "間": [("カン", "onyomi"), ("あいだ", "kunyomi")],
    "雨": [("ウ", "onyomi"), ("あめ", "kunyomi")],
    "電": [("デン", "onyomi")],
    "食": [("ショク", "onyomi"), ("た", "kunyomi")],
    "高": [("コウ", "onyomi"), ("たか", "kunyomi")],
    "魚": [("ギョ", "onyomi"), ("さかな", "kunyomi")],
    "駅": [("エキ", "onyomi")],
    "力": [("リョク", "onyomi"), ("ちから", "kunyomi")],
    "書": [("ショ", "onyomi"), ("か", "kunyomi")],
    "話": [("ワ", "onyomi"), ("はな", "kunyomi")],
    "会": [("カイ", "onyomi"), ("あ", "kunyomi")],
    "売": [("バイ", "onyomi"), ("う", "kunyomi")],
    "買": [("バイ", "onyomi"), ("か", "kunyomi")],
    "問": [("モン", "onyomi"), ("と", "kunyomi")],
}

EXAMPLES = {
    "一": ("一つ", "hitotsu", "one (thing)"),
    "人": ("人", "hito", "person"),
    "日": ("日本", "Nihon", "Japan"),
    "学": ("学生", "gakusei", "student"),
    "校": ("学校", "gakkou", "school"),
    "食": ("食べる", "taberu", "to eat"),
}


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def example_for(character: str) -> tuple[str, str, str]:
    if character in EXAMPLES:
        return EXAMPLES[character]
    meaning = MEANINGS[character]
    return (character, "", meaning)


def kanji_values() -> str:
    rows = []
    for character in KANJI_ORDER:
        meaning = MEANINGS[character]
        strokes = STROKES.get(character, 8)
        rows.append(
            f"    ('{sql_str(character)}', '{sql_str(meaning)}', "
            f"'n5'::public.jlpt_level, {strokes}, 'published'::public.content_status)"
        )
    return ",\n".join(rows)


def reading_values() -> str:
    rows = []
    for character in KANJI_ORDER:
        for reading, reading_type in READINGS.get(character, []):
            rows.append(
                f"    ('{sql_str(character)}', '{sql_str(reading)}', '{reading_type}')"
            )
    return ",\n".join(rows)


def example_values() -> str:
    rows = []
    for character in KANJI_ORDER:
        jp, romaji, en = example_for(character)
        rows.append(
            f"    ('{sql_str(character)}', '{sql_str(jp)}', "
            f"'{sql_str(romaji)}', '{sql_str(en)}', 0)"
        )
    return ",\n".join(rows)


def lesson_titles(unit: dict, unit_index: int) -> list[tuple[str, list[str]]]:
    start = unit["start"]
    end = start + unit["count"]
    chars = KANJI_ORDER[start:end]
    size = unit["lesson_size"]
    lessons = []
    for offset in range(0, len(chars), size):
        chunk = chars[offset : offset + size]
        lesson_number = offset // size + 1
        lessons.append((f"{unit['name']} · Lesson {lesson_number}", chunk))
    return lessons


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
        for title, characters in lesson_titles(unit, unit["order_index"]):
            char_array = ", ".join(f"'{sql_str(char)}'" for char in characters)
            parts.append(
                f"""
  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'kanji', '{sql_str(title)}', 'Learn essential N5 kanji.', 1, 12, 6, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(title)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(title)}' limit 1;

    if lesson_id is not null then
      char_list := array[{char_array}];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;"""
            )

    practice_chars = [KANJI_ORDER[index] for index in PRACTICE_PICK if index < len(KANJI_ORDER)]
    practice_array = ", ".join(f"'{sql_str(char)}'" for char in practice_chars)
    parts.append(
        f"""
  insert into public.units (region_id, name, description, order_index, status)
  select region_id, 'Kanji Practice', 'Mixed review across N5 kanji.', 14, 'published'
  where not exists (
    select 1 from public.units where region_id = region_id and name = 'Kanji Practice'
  );

  select id into unit_id from public.units
  where region_id = region_id and name = 'Kanji Practice' limit 1;

  if unit_id is not null then
    insert into public.lessons (unit_id, type, title, description, difficulty, xp_reward, estimated_duration, status)
    select unit_id, 'practice', '{sql_str(PRACTICE_TITLE)}', '{sql_str(PRACTICE_DESCRIPTION)}', 2, 20, 8, 'published'
    where not exists (
      select 1 from public.lessons where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}'
    );

    select id into lesson_id from public.lessons
    where unit_id = unit_id and title = '{sql_str(PRACTICE_TITLE)}' limit 1;

    if lesson_id is not null then
      char_list := array[{practice_array}];
      item_index := 0;
      foreach char_value in array char_list loop
        select id into kanji_id from public.kanji
        where status = 'published' and jlpt_level = 'n5' and character = char_value
        limit 1;
        if kanji_id is null then continue; end if;
        insert into public.lesson_items (lesson_id, content_type, content_id, order_index)
        select lesson_id, 'kanji', kanji_id, item_index
        where not exists (
          select 1 from public.lesson_items
          where lesson_id = lesson_id and content_type = 'kanji' and content_id = kanji_id
        );
        item_index := item_index + 1;
      end loop;
    end if;
  end if;"""
    )

    return "\n".join(parts)


HEADER = """-- Phase 10: N5 kanji academy (Mount N5)

create table public.kanji_examples (
  id uuid primary key default gen_random_uuid(),
  kanji_id uuid not null references public.kanji (id) on delete cascade,
  japanese_text text not null,
  romaji text,
  english text not null,
  order_index integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kanji_examples_kanji_id_idx on public.kanji_examples (kanji_id);

create trigger kanji_examples_set_updated_at
  before update on public.kanji_examples
  for each row execute function public.set_updated_at();

alter table public.kanji_examples enable row level security;

create policy "Authenticated users read published kanji examples"
  on public.kanji_examples for select
  using (
    auth.uid() is not null
    and (
      status = 'published'
      or public.is_content_admin()
    )
  );

create policy "Content admins manage kanji examples"
  on public.kanji_examples for all
  using (public.is_content_admin())
  with check (public.is_content_admin());

insert into public.kanji (character, meaning, jlpt_level, stroke_count, status)
select v.character, v.meaning, v.jlpt_level, v.stroke_count, v.status
from (
  values
"""

KANJI_FOOTER = """
) as v(character, meaning, jlpt_level, stroke_count, status)
where not exists (
  select 1 from public.kanji existing where existing.character = v.character
);

insert into public.kanji_readings (kanji_id, reading, reading_type)
select k.id, r.reading, r.reading_type
from public.kanji k
inner join (
  values
"""

READING_FOOTER = """
) as r(character, reading, reading_type) on r.character = k.character
where k.jlpt_level = 'n5'
  and not exists (
    select 1 from public.kanji_readings existing
    where existing.kanji_id = k.id
      and existing.reading = r.reading
      and existing.reading_type = r.reading_type
  );

insert into public.kanji_examples (
  kanji_id, japanese_text, romaji, english, order_index, status
)
select k.id, e.japanese_text, e.romaji, e.english, e.order_index, 'published'::public.content_status
from public.kanji k
inner join (
  values
"""

EXAMPLE_FOOTER = """
) as e(character, japanese_text, romaji, english, order_index) on e.character = k.character
where k.jlpt_level = 'n5'
  and not exists (
    select 1 from public.kanji_examples existing
    where existing.kanji_id = k.id
      and existing.japanese_text = e.japanese_text
  );

do $seed$
#variable_conflict use_variable
declare
  region_id uuid;
  unit_id uuid;
  lesson_id uuid;
  kanji_id uuid;
  char_list text[];
  char_value text;
  item_index integer;
begin
"""

CURRICULUM_FOOTER = """
end $seed$;
"""


def main() -> None:
    assert len(KANJI_ORDER) == 103, f"Expected 103 kanji, got {len(KANJI_ORDER)}"
    for character in KANJI_ORDER:
        assert character in MEANINGS, f"Missing meaning for {character}"

    sql = (
        HEADER
        + kanji_values()
        + KANJI_FOOTER
        + reading_values()
        + READING_FOOTER
        + example_values()
        + EXAMPLE_FOOTER
        + curriculum_block()
        + CURRICULUM_FOOTER
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT} ({len(KANJI_ORDER)} kanji)")


if __name__ == "__main__":
    main()
