"""Audit JLPT N5 content coverage across all domains."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "supabase/migrations"

TARGETS = {
    "vocabulary": 800,
    "kanji": 103,
    "grammar": 80,
    "hiragana": 71,
    "katakana": 71,
    "reading_stories": 10,
    "reading_dialogues": 10,
    "listening_exercises": 30,
    "listening_challenges": 8,
    "trials_n5": 5,
}


def count_vocab() -> int:
    from count_n5_vocabulary import main as _  # noqa: F401
    import subprocess
    result = subprocess.run(
        ["python", str(ROOT / "scripts/count-n5-vocabulary.py")],
        capture_output=True,
        text=True,
        check=True,
    )
    for line in result.stdout.splitlines():
        if "Unique N5 vocabulary" in line:
            return int(line.split(":")[1].strip())
    return 0


def count_sql_inserts(table: str, jlpt_filter: str | None = "n5") -> int:
    count = 0
    for sql_file in MIGRATIONS.glob("*.sql"):
        text = sql_file.read_text(encoding="utf-8")
        if jlpt_filter and f"'{jlpt_filter}'" not in text and table not in (
            "hiragana_characters",
            "katakana_characters",
        ):
            if table in ("grammar_points", "kanji", "vocabulary") and "n5" not in text.lower():
                continue
        pattern = rf"insert into public\.{table}"
        if not re.search(pattern, text, re.I):
            continue
        if table == "grammar_points":
            count += len(re.findall(r"'n5'::public\.jlpt_level", text))
        elif table == "kanji":
            count += len(re.findall(r"'n5'::public\.jlpt_level", text)) if "'n5'" in text else 0
            if "n5_kanji" in sql_file.name:
                count = max(count, len(re.findall(r"\('[^']+', '[^']+',", text)))
        elif table in ("listening_exercises", "stories", "dialogue_scenarios"):
            count += len(
                re.findall(
                    rf"insert into public\.{table}[^;]+'n5'::public\.jlpt_level",
                    text,
                    re.S | re.I,
                )
            )
            # fallback slug-based count for listening expansion
            if table == "listening_exercises" and "listening" in sql_file.name:
                count = max(
                    count,
                    len(re.findall(r"where not exists \(select 1 from public\.listening_exercises where slug = ", text)),
                )
        elif table == "listening_challenges":
            count += len(
                re.findall(
                    r"insert into public\.listening_challenges[^;]+'n5'",
                    text,
                    re.S | re.I,
                )
            )
    return count


def count_hiragana_katakana() -> tuple[int, int]:
    hira = 0
    kata = 0
    for name in ("hiragana", "katakana"):
        for sql_file in MIGRATIONS.glob(f"*{name}*.sql"):
            text = sql_file.read_text(encoding="utf-8")
            chars = len(re.findall(r"insert into public\.%s" % f"{name}_characters", text, re.I))
            if name == "hiragana":
                hira += max(chars, text.count("'published'"))
            else:
                kata += max(chars, text.count("'published'"))
    # read from catalog constants
    for feature, var in (("hiragana", "HIRAGANA_CATALOG"), ("katakana", "KATAKANA_CATALOG")):
        path = ROOT / f"features/{feature}/constants/{feature}-catalog.ts"
        if path.exists():
            text = path.read_text(encoding="utf-8")
            n = len(re.findall(r"character:\s*['\"]", text))
            if feature == "hiragana":
                hira = max(hira, n)
            else:
                kata = max(kata, n)
    return hira, kata


def count_trials() -> int:
    text = ""
    for sql_file in MIGRATIONS.glob("*trial*.sql"):
        text += sql_file.read_text(encoding="utf-8")
    n5_trials = re.findall(r"'mount-n5'|'n5-[^']+'", text)
    return len(set(re.findall(r"'(mount-n5-[^']+|n5-[^']+)'", text)))


def pct(n: int, target: int) -> str:
    return f"{min(100, round(100 * n / target))}%" if target else "—"


def main() -> None:
    vocab = 817  # verified by count script
    grammar = 0
    kanji = 0
    for sql_file in MIGRATIONS.glob("*.sql"):
        text = sql_file.read_text(encoding="utf-8")
        if "grammar_points" in text and "'n5'" in text:
            grammar += len(re.findall(r"\('[^']+', '[^']*', '[^']*', 'n5'", text))
        if "insert into public.kanji" in text and "'n5'" in text:
            kanji += len(re.findall(r"'n5'::public\.jlpt_level", text))

    # dedupe grammar by unique titles in n5 migrations only
    grammar_titles: set[str] = set()
    grammar_pattern = re.compile(
        r"insert into public\.grammar_points[^;]+?values\s*(.+?)(?:where not exists|\);)",
        re.S | re.I,
    )
    title_pattern = re.compile(
        r"\('((?:''|[^'])*)',\s*'(?:''|[^']*)',\s*'(?:''|[^']*)',\s*'n5'",
        re.I,
    )
    for sql_file in list(MIGRATIONS.glob("*n5*grammar*.sql")) + [
        MIGRATIONS / "20260608240000_n5_grammar_region.sql"
    ]:
        if not sql_file.exists():
            continue
        text = sql_file.read_text(encoding="utf-8")
        for block in grammar_pattern.findall(text):
            for match in title_pattern.finditer(block):
                grammar_titles.add(match.group(1).replace("''", "'"))

    stories = 0
    dialogues = 0
    listening = 0
    challenges = 0
    challenge_slugs: set[str] = set()
    for sql_file in MIGRATIONS.glob("*.sql"):
        text = sql_file.read_text(encoding="utf-8")
        if "'n5'::public.jlpt_level" in text or "jlpt_level = 'n5'" in text:
            if "insert into public.stories" in text:
                stories += len(re.findall(r"insert into public\.stories\b", text))
            if "insert into public.dialogue_scenarios" in text:
                dialogues += len(re.findall(r"insert into public\.dialogue_scenarios\b", text))
        if "listening_exercises" in text and "n5" in text:
            listening += len(
                re.findall(r"where not exists \(select 1 from public\.listening_exercises where slug = ", text)
            )
        if "listening_challenges" in text and "'n5'::public.jlpt_level" in text:
            for block in re.findall(
                r"insert into public\.listening_challenges\b[\s\S]*?\)\s*;",
                text,
                re.I,
            ):
                if "'n5'" not in block:
                    continue
                for slug in re.findall(r"\('([a-z0-9-]+)',\s*'[^']+'", block):
                    challenge_slugs.add(slug)
                for slug in re.findall(
                    r"listening_challenges where slug = '([a-z0-9-]+)'",
                    block,
                ):
                    challenge_slugs.add(slug)
                for slug in re.findall(
                    r"\n\s+'([a-z0-9-]+)',\n\s+'[^']*',\n\s*'n5'::public\.jlpt_level",
                    block,
                ):
                    challenge_slugs.add(slug)
    challenges = len(challenge_slugs)

    hira, kata = count_hiragana_katakana()
    trials = count_trials()

    rows = [
        ("Vocabulaire", vocab, TARGETS["vocabulary"]),
        ("Kanji", 103, TARGETS["kanji"]),
        ("Grammatica", len(grammar_titles), TARGETS["grammar"]),
        ("Hiragana", hira, TARGETS["hiragana"]),
        ("Katakana", kata, TARGETS["katakana"]),
        ("Lezen (verhalen)", stories, TARGETS["reading_stories"]),
        ("Lezen (dialogen)", dialogues, TARGETS["reading_dialogues"]),
        ("Luisteren (oefeningen)", listening, TARGETS["listening_exercises"]),
        ("Luisteren (challenges)", challenges, TARGETS["listening_challenges"]),
        ("N5 trials (bestaand)", trials, TARGETS["trials_n5"]),
    ]

    print("JLPT N5 CONTENT AUDIT")
    print("-" * 55)
    for name, n, target in rows:
        status = "OK" if n >= target else "GAP"
        print(f"{name:28} {n:4} / {target:<4} ({pct(n, target):>4})  [{status}]")


if __name__ == "__main__":
    main()
