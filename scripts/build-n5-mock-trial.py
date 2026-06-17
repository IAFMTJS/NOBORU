"""Generate N5 full JLPT mock trial — multi-domain capstone exam."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "supabase" / "migrations" / "20260617210000_n5_jlpt_mock_trial.sql"

# (order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
Step = tuple[int, str, str, str, list[str] | None, list[str] | None, int | None, list[dict] | None]

STEPS: list[Step] = [
  # Section 1: Vocabulary (choice recall)
  (1, "choice_recall", "Vocabulary: choose the correct meaning.", "食べる", None, ["to eat", "to drink", "to read", "to write"], 0, None),
  (2, "choice_recall", "Vocabulary: choose the correct meaning.", "飲む", None, ["to drink", "to eat", "to sleep", "to walk"], 0, None),
  (3, "choice_recall", "Vocabulary: choose the correct meaning.", "大きい", None, ["big", "small", "new", "old"], 0, None),
  (4, "choice_recall", "Vocabulary: choose the correct meaning.", "新しい", None, ["new", "old", "big", "small"], 0, None),
  (5, "choice_recall", "Vocabulary: choose the correct meaning.", "病院", None, ["hospital", "school", "station", "shop"], 0, None),
  # Section 2: Grammar (choice recall)
  (6, "choice_recall", "Grammar: choose the correct particle.", "学校___行きます。", None, ["に", "を", "が", "の"], 0, None),
  (7, "choice_recall", "Grammar: choose the correct particle.", "りんご___食べます。", None, ["を", "に", "で", "が"], 0, None),
  (8, "choice_recall", "Grammar: choose the correct form.", "昨日、映画を___。", None, ["見ました", "見ます", "見る", "見て"], 0, None),
  (9, "choice_recall", "Grammar: choose the correct negative.", "今日は忙しく___です。", None, ["ない", "ません", "ないです", "なく"], 0, None),
  (10, "choice_recall", "Grammar: choose the correct answer.", "「行きましょう」の意味は？", None, ["Let's go", "I went", "I will not go", "Please go"], 0, None),
  # Section 3: Kanji (typed + choice)
  (11, "typed_recall", "Kanji: type the meaning in English.", "人", ["person", "people"], None, None, None),
  (12, "typed_recall", "Kanji: type the meaning in English.", "水", ["water"], None, None, None),
  (13, "choice_recall", "Kanji: choose the correct reading.", "日", None, ["hi/nichi", "tsuki", "hoshi", "kaze"], 0, None),
  (14, "choice_recall", "Kanji: choose the correct meaning.", "山", None, ["mountain", "river", "tree", "fire"], 0, None),
  # Section 4: Listening-style comprehension (choice recall on Japanese text)
  (15, "choice_recall", "Listening: what does the speaker order?", "コーヒーを 一つ ください。", None, ["Coffee", "Tea", "Water", "Juice"], 0, None),
  (16, "choice_recall", "Listening: what time is mentioned?", "三時に 会いましょう。", None, ["Three o'clock", "Two o'clock", "Four o'clock", "Five o'clock"], 0, None),
  (17, "choice_recall", "Listening: what is the weather?", "今日は 雪 です。", None, ["Snowy", "Rainy", "Sunny", "Windy"], 0, None),
  (18, "choice_recall", "Listening: where are they meeting?", "駅の 南口で 待ちます。", None, ["South exit of the station", "North exit", "At home", "At school"], 0, None),
  # Section 5: Reading comprehension
  (19, "choice_recall", "Reading: what does Tanaka do every morning?", "田中さんは毎朝六時に起きます。", None, ["Wakes up at six", "Goes to bed at six", "Eats at six", "Studies at six"], 0, None),
  (20, "choice_recall", "Reading: how does Sato feel?", "佐藤さんはとても嬉しいです。", None, ["Very happy", "Very sad", "Very angry", "Very tired"], 0, None),
  # Section 6: Mixed matching capstone
  (21, "matching", "Final review: match each word to its meaning.", "Match the pairs", None, None, None, [
    {"id": "m1", "prompt": "本", "answer": "book"},
    {"id": "m2", "prompt": "車", "answer": "car"},
    {"id": "m3", "prompt": "電話", "answer": "phone"},
    {"id": "m4", "prompt": "天気", "answer": "weather"},
  ]),
  (22, "matching", "Final review: match particles to their function.", "Match the pairs", None, None, None, [
    {"id": "p1", "prompt": "は", "answer": "topic marker"},
    {"id": "p2", "prompt": "を", "answer": "object marker"},
    {"id": "p3", "prompt": "に", "answer": "time/destination"},
  ]),
  # Section 7: Final recall
  (23, "typed_recall", "Type the romaji for this hiragana.", "み", ["mi"], None, None, None),
  (24, "typed_recall", "Type the romaji for this katakana.", "ミ", ["mi"], None, None, None),
  (25, "choice_recall", "Choose the correct meaning.", "ありがとうございます", None, ["Thank you very much", "Good morning", "Goodbye", "Excuse me"], 0, None),
]


def sql_str(value: str) -> str:
    return value.replace("'", "''")


def json_or_null(value: list | dict | None) -> str:
    if value is None:
        return "null"
    return f"'{sql_str(json.dumps(value, ensure_ascii=False))}'"


def build_trial_template() -> str:
    return """
-- N5 full JLPT mock trial (capstone exam)
insert into public.trial_templates (
  slug, region_slug, kind, title, description, boss_name,
  pass_score, time_limit_seconds, ep_reward, min_region_progress_percent,
  prerequisite_trial_slug, sort_order, status
)
select
  'n5-jlpt-mock',
  'mount-n5',
  'final_trial'::public.trial_kind,
  'N5 JLPT Mock Exam',
  'Full-length N5 mock covering vocabulary, grammar, kanji, listening-style, and reading comprehension.',
  'Summit Examiner',
  70,
  900,
  500,
  95,
  'n5-final-trial',
  6,
  'published'
where not exists (
  select 1 from public.trial_templates where slug = 'n5-jlpt-mock'
);
"""


def build_trial_steps() -> str:
    rows = []
    for step in STEPS:
        order_index, kind, prompt, display, accepted, options, correct, pairs = step
        accepted_sql = json_or_null(accepted)
        options_sql = json_or_null(options)
        correct_sql = str(correct) if correct is not None else "null"
        pairs_sql = json_or_null(pairs)
        rows.append(
            f"  ({order_index}, '{kind}', '{sql_str(prompt)}', '{sql_str(display)}', "
            f"{accepted_sql}, {options_sql}, {correct_sql}, {pairs_sql})"
        )

    return f"""
with trial as (
  select id from public.trial_templates where slug = 'n5-jlpt-mock' limit 1
)
insert into public.trial_steps (
  trial_template_id, order_index, step_kind, prompt, display_text,
  accepted_answers, options, correct_index, match_pairs
)
select
  trial.id,
  s.order_index,
  s.step_kind::public.trial_step_kind,
  s.prompt,
  s.display_text,
  s.accepted_answers::jsonb,
  s.options::jsonb,
  s.correct_index,
  s.match_pairs::jsonb
from trial,
(values
{",\n".join(rows)}
) as s(order_index, step_kind, prompt, display_text, accepted_answers, options, correct_index, match_pairs)
where not exists (
  select 1 from public.trial_steps existing
  where existing.trial_template_id = trial.id
);
"""


def main() -> None:
    sql = (
        "-- N5 full JLPT mock trial\n\n"
        + build_trial_template()
        + "\n"
        + build_trial_steps()
    )
    OUT.write_text(sql, encoding="utf-8")
    print(f"Wrote {OUT.name}: 1 trial template, {len(STEPS)} steps")


if __name__ == "__main__":
    main()
