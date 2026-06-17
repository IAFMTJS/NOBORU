"""Analyze vocabulary gap vs JLPT N5 target bank."""

from __future__ import annotations

import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_kana_from_sources() -> set[str]:
    kana: set[str] = set()
    for src in [
        ROOT / "scripts/build-n5-vocabulary-migration.py",
        ROOT / "scripts/build-n5-vocabulary-expansion.py",
        ROOT / "scripts/build-n5-vocabulary-wave4.py",
        ROOT / "scripts/build-n5-vocabulary-wave5.py",
    ]:
        spec = importlib.util.spec_from_file_location(src.stem, src)
        mod = importlib.util.module_from_spec(spec)
        assert spec.loader is not None
        spec.loader.exec_module(mod)
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
    skip = {"17150000", "17160000", "17170000"}
    for sql in sorted((ROOT / "supabase/migrations").glob("*vocabulary*.sql")):
        if any(token in sql.name for token in skip):
            continue
        text = sql.read_text(encoding="utf-8")
        for m in re.finditer(
            r"\('([^']+)',\s*(?:'[^']*'|null),\s*'[^']*',\s*'[^']*',\s*'n5'",
            text,
        ):
            kana.add(m.group(1))
    return kana


def main() -> None:
    spec = importlib.util.spec_from_file_location(
        "bank", ROOT / "scripts/jlpt_n5_vocabulary_bank.py"
    )
    bank_mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(bank_mod)
    existing = load_kana_from_sources()
    missing = [w for w in bank_mod.BANK if w[0] not in existing]
    print(f"Base existing: {len(existing)}")
    print(f"Bank unique: {len({w[0] for w in bank_mod.BANK})}")
    print(f"Missing from bank: {len(missing)}")
    print(f"Projected total: {len(existing) + len(missing)}")


if __name__ == "__main__":
    main()
