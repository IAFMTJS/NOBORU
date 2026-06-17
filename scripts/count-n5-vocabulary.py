"""Count unique N5 vocabulary kana across migration and build sources."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_words_from_py(path: Path) -> set[str]:
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    kana: set[str] = set()
    for attr in ("UNITS", "WAVES", "WAVE"):
        if not hasattr(mod, attr):
            continue
        data = getattr(mod, attr)
        waves = data if isinstance(data, list) else [data]
        for wave in waves:
            units = wave.get("units", wave) if isinstance(wave, dict) else wave
            if isinstance(units, dict):
                units = units.get("units", [])
            if not isinstance(units, list):
                continue
            for unit in units:
                for lesson in unit.get("lessons", []):
                    for word in lesson.get("words", []):
                        kana.add(word[0])
    return kana


def load_words_from_sql(path: Path) -> set[str]:
    text = path.read_text(encoding="utf-8")
    found: set[str] = set()
    for m in re.finditer(
        r"\('([^']+)',\s*(?:'[^']*'|null),\s*'[^']*',\s*'[^']*',\s*'n5'",
        text,
    ):
        found.add(m.group(1))
    return found


def main() -> None:
    kana: set[str] = set()
    sources = [
        ROOT / "scripts/build-n5-vocabulary-migration.py",
        ROOT / "scripts/build-n5-vocabulary-expansion.py",
        ROOT / "scripts/build-n5-vocabulary-wave4.py",
        ROOT / "scripts/build-n5-vocabulary-wave5.py",
    ]
    for src in sources:
        if src.exists():
            kana |= load_words_from_py(src)

    for sql in sorted((ROOT / "supabase/migrations").glob("*vocabulary*.sql")):
        kana |= load_words_from_sql(sql)

    print(f"Unique N5 vocabulary (kana): {len(kana)}")
    print(f"Gap to 800 target: {max(0, 800 - len(kana))}")


if __name__ == "__main__":
    main()
