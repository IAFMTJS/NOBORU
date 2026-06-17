"""Generate N5 Sentinel boss examination steps (Learning Architecture Bible step kinds)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617230000_n5_boss_examination_bible_steps.sql"

# order, kind, prompt, display, accepted, options, correct_index, pairs, content_type, content_key
Step = tuple[
    int,
    str,
    str,
    str,
    list[str] | None,
    list[str] | None,
    int | None,
    list[dict[str, str]] | None,
    str | None,
    str | None,
]

STEPS: list[Step] = [
    (
        1,
        "applied_vocabulary",
        "Applied vocabulary: choose the correct meaning.",
        "食べる",
        None,
        ["to eat", "to drink", "to read", "to write"],
        0,
        None,
        "vocabulary",
        "たべる",
    ),
    (
        2,
        "applied_vocabulary",
        "Applied vocabulary: type the meaning in English.",
        "友達",
        ["friend"],
        None,
        None,
        None,
        "vocabulary",
        "ともだち",
    ),
    (
        3,
        "grammar_context",
        "Grammar in context: choose the correct particle.",
        "りんご___食べます。",
        None,
        ["を", "に", "で", "が"],
        0,
        None,
        "grammar",
        "を (o)",
    ),
    (
        4,
        "grammar_context",
        "Grammar in context: choose the correct meaning.",
        "「行きましょう」の意味は？",
        None,
        ["Let's go", "I went", "I will not go", "Please go"],
        0,
        None,
        "grammar",
        "ましょう (mashou)",
    ),
    (
        5,
        "reading_comprehension",
        "Reading: what does Tanaka do every morning?",
        "田中さんは毎朝六時に起きます。",
        None,
        ["Wakes up at six", "Goes to bed at six", "Eats at six", "Studies at six"],
        0,
        None,
        "story",
        "train-commute",
    ),
    (
        6,
        "listening_comprehension",
        "Listening: what does the customer order?",
        "すみません。ラーメンを 一つ ください。",
        None,
        ["Ramen", "Rice", "Coffee", "Bread"],
        0,
        None,
        "listening",
        "ordering-food",
    ),
    (
        7,
        "story_comprehension",
        "Story: what is the weather today?",
        "今日は雨です。ゆきさんは家にいます。",
        None,
        ["Rainy", "Sunny", "Snowy", "Windy"],
        0,
        None,
        "story",
        "rainy-day",
    ),
    (
        8,
        "writing_application",
        "Writing: type the romaji for this hiragana.",
        "さ",
        ["sa"],
        None,
        None,
        None,
        "application",
        "Hiragana sa romaji",
    ),
    (
        9,
        "matching",
        "Boss review: match each word to its meaning.",
        "Match the pairs",
        None,
        None,
        None,
        [
            {"id": "m1", "prompt": "行く", "answer": "to go"},
            {"id": "m2", "prompt": "来る", "answer": "to come"},
            {"id": "m3", "prompt": "見る", "answer": "to see"},
        ],
        None,
        None,
    ),
    (
        10,
        "applied_vocabulary",
        "Applied vocabulary: choose the correct meaning.",
        "駅",
        None,
        ["House", "Station", "Shop", "School"],
        1,
        None,
        "vocabulary",
        "えき",
    ),
    (
        11,
        "applied_vocabulary",
        "Applied vocabulary: type the meaning in English.",
        "時間",
        ["time"],
        None,
        None,
        None,
        "vocabulary",
        "じかん",
    ),
    (
        12,
        "grammar_context",
        "Grammar in context: choose the correct negative.",
        "今日は忙しく___です。",
        None,
        ["ない", "ません", "ないです", "なく"],
        0,
        None,
        "grammar",
        "あまり〜ない (amari...nai)",
    ),
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def json_or_null(value: list | dict | None) -> str:
    if value is None:
        return "null"
    return f"'{sql_str(json.dumps(value, ensure_ascii=False))}'"


def build_migration() -> str:
    rows = []
    for step in STEPS:
        (
            order_index,
            kind,
            prompt,
            display,
            accepted,
            options,
            correct,
            pairs,
            content_type,
            content_key,
        ) = step
        rows.append(
            f"  ({order_index}, '{kind}', '{sql_str(prompt)}', '{sql_str(display)}', "
            f"{json_or_null(accepted)}, {json_or_null(options)}, "
            f"{str(correct) if correct is not None else 'null'}, {json_or_null(pairs)}, "
            f"{f"'{content_type}'" if content_type else 'null'}, "
            f"{f"'{sql_str(content_key)}'" if content_key else 'null'})"
        )

    return f"""-- Learning Architecture Bible: N5 Sentinel boss examination step kinds.

update public.trial_templates
set
  description = 'Branch boss exam covering applied vocabulary, grammar in context, reading, listening, story comprehension, and writing.',
  updated_at = now()
where slug = 'n5-sentinel';

with trial as (
  select id from public.trial_templates where slug = 'n5-sentinel' limit 1
),
should_seed as (
  select t.id
  from trial t
  where not exists (
    select 1
    from public.trial_steps ts
    where ts.trial_template_id = t.id
      and ts.step_kind = 'applied_vocabulary'
  )
),
deleted as (
  delete from public.trial_steps ts
  using should_seed s
  where ts.trial_template_id = s.id
  returning ts.id
)
insert into public.trial_steps (
  trial_template_id,
  order_index,
  step_kind,
  prompt,
  display_text,
  accepted_answers,
  options,
  correct_index,
  match_pairs,
  content_type,
  content_id
)
select
  s.id,
  seed.order_index,
  seed.step_kind::public.trial_step_kind,
  seed.prompt,
  seed.display_text,
  seed.accepted_answers::jsonb,
  seed.options::jsonb,
  seed.correct_index,
  seed.match_pairs::jsonb,
  seed.content_type,
  case seed.content_type
    when 'vocabulary' then (
      select v.id from public.vocabulary v where v.kana = seed.content_key limit 1
    )
    when 'grammar' then (
      select g.id from public.grammar_points g where g.title = seed.content_key limit 1
    )
    when 'story' then (
      select st.id from public.stories st where st.slug = seed.content_key limit 1
    )
    when 'listening' then (
      select le.id from public.listening_exercises le where le.slug = seed.content_key limit 1
    )
    when 'application' then (
      select ae.id from public.application_exercises ae where ae.title = seed.content_key limit 1
    )
    else null
  end
from should_seed s,
(values
{",\n".join(rows)}
) as seed(
  order_index,
  step_kind,
  prompt,
  display_text,
  accepted_answers,
  options,
  correct_index,
  match_pairs,
  content_type,
  content_key
);
"""


def main() -> None:
    OUT.write_text(build_migration(), encoding="utf-8")
    print(f"Wrote {OUT.name}: {len(STEPS)} bible boss exam steps for n5-sentinel")


if __name__ == "__main__":
    main()
