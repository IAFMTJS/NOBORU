"""Generate N5 vocabulary completion waves 6–8 to reach ~800 JLPT N5 words."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "supabase" / "migrations"

_spec = importlib.util.spec_from_file_location(
    "vocab_expansion",
    ROOT / "scripts" / "build-n5-vocabulary-expansion.py",
)
_expansion = importlib.util.module_from_spec(_spec)
assert _spec.loader is not None
_spec.loader.exec_module(_expansion)

Word = tuple[str, str, str, str, str, str, str]
build_wave_sql = _expansion.build_wave_sql
collect_words = _expansion.collect_words
count_lessons = _expansion.count_lessons
sql_str = _expansion.sql_str

TARGET = 800


def load_existing_kana() -> set[str]:
    kana: set[str] = set()
    sources = [
        ROOT / "scripts/build-n5-vocabulary-migration.py",
        ROOT / "scripts/build-n5-vocabulary-expansion.py",
        ROOT / "scripts/build-n5-vocabulary-wave4.py",
        ROOT / "scripts/build-n5-vocabulary-wave5.py",
    ]
    for src in sources:
        if not src.exists():
            continue
        spec = importlib.util.spec_from_file_location(src.stem, src)
        mod = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(mod)
        if hasattr(mod, "BANK"):
            for word in mod.BANK:
                kana.add(word[0])
        for attr in ("UNITS", "WAVES", "WAVE"):
            if not hasattr(mod, attr):
                continue
            data = getattr(mod, attr)
            waves = data if isinstance(data, list) else [data]
            for wave in waves:
                units = wave.get("units", []) if isinstance(wave, dict) else []
                for unit in units:
                    for lesson in unit.get("lessons", []):
                        for word in lesson.get("words", []):
                            kana.add(word[0])
    for sql in (ROOT / "supabase/migrations").glob("*vocabulary*.sql"):
        if any(
            token in sql.name
            for token in (
                "17150000",
                "17160000",
                "17170000",
                "wave6",
                "wave7",
                "wave8",
            )
        ):
            continue
        text = sql.read_text(encoding="utf-8")
        for m in re.finditer(
            r"\('([^']+)',\s*(?:'[^']*'|null),\s*'[^']*',\s*'[^']*',\s*'n5'",
            text,
        ):
            kana.add(m.group(1))
    return kana


def chunk_words(words: list[Word], words_per_lesson: int = 5) -> list[list[Word]]:
    lessons: list[list[Word]] = []
    for i in range(0, len(words), words_per_lesson):
        lessons.append(words[i : i + words_per_lesson])
    return lessons


def build_units(
    name_prefix: str,
    description: str,
    themed_chunks: list[tuple[str, list[Word]]],
) -> list[dict]:
    units: list[dict] = []
    for index, (theme, words) in enumerate(themed_chunks, start=1):
        lessons = []
        for lesson_index, lesson_words in enumerate(chunk_words(words), start=1):
            lessons.append(
                {
                    "title": f"{theme} {lesson_index}" if len(chunk_words(words)) > 1 else theme,
                    "words": lesson_words,
                }
            )
        units.append(
            {
                "name": f"{name_prefix} — {theme}",
                "description": description,
                "lessons": lessons,
            }
        )
    return units


def build_waves(bank: list[Word], existing: set[str], start_index: int) -> list[dict]:
    missing = [w for w in bank if w[0] not in existing]
    seen: set[str] = set()
    unique_missing: list[Word] = []
    for word in missing:
        if word[0] in seen:
            continue
        seen.add(word[0])
        unique_missing.append(word)

    wave_size = max(1, (len(unique_missing) + 2) // 3)
    waves: list[dict] = []
    for wave_num, offset in enumerate(range(0, len(unique_missing), wave_size), start=6):
        slice_words = unique_missing[offset : offset + wave_size]
        if not slice_words:
            continue
        themed: list[tuple[str, list[Word]]] = []
        chunk_size = max(20, len(slice_words) // 4)
        for i in range(0, len(slice_words), chunk_size):
            part = slice_words[i : i + chunk_size]
            themed.append((f"Set {(i // chunk_size) + 1}", part))
        order = start_index + (wave_num - 6) * (len(themed) + 1)
        waves.append(
            {
                "filename": f"202606171{50000 + (wave_num - 6) * 10000}_n5_vocabulary_expansion_wave{wave_num}.sql",
                "title": f"N5 vocabulary expansion wave {wave_num}",
                "start_order_index": order,
                "practice_title": f"N5 Vocabulary Practice: Wave {wave_num}",
                "practice_description": f"Mixed recall quiz across wave {wave_num} N5 vocabulary.",
                "units": build_units(
                    f"N5 Vocabulary Wave {wave_num}",
                    f"JLPT N5 vocabulary wave {wave_num} toward full N5 word coverage.",
                    themed,
                ),
            }
        )
    return waves


def main() -> None:
    bank_spec = importlib.util.spec_from_file_location(
        "jlpt_n5_vocabulary_bank",
        ROOT / "scripts" / "jlpt_n5_vocabulary_bank.py",
    )
    bank_mod = importlib.util.module_from_spec(bank_spec)
    assert bank_spec.loader is not None
    bank_spec.loader.exec_module(bank_mod)
    bank: list[Word] = bank_mod.BANK

    existing = load_existing_kana()
    waves = build_waves(bank, existing, start_index=50)
    if not waves:
        print("No missing vocabulary — N5 bank already complete.")
        return

    total_new = 0
    for wave in waves:
        out = MIGRATIONS / wave["filename"]
        out.write_text(build_wave_sql(wave), encoding="utf-8")
        words = collect_words(wave["units"])
        lessons = count_lessons(wave["units"])
        total_new += len(words)
        print(
            f"Wrote {out.name}: {len(words)} new words, "
            f"{lessons} lessons + 1 practice quiz"
        )

    projected = len(existing) + total_new
    print(f"Existing: {len(existing)} | New: {total_new} | Projected: {projected} | Target: {TARGET}")


if __name__ == "__main__":
    main()
