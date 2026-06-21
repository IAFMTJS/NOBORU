#!/usr/bin/env python3
"""Batch transparency fix for world-tree segments, jlpt bands, and transitions."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "art-direction" / "fix-world-tree-transparency.py"
spec = importlib.util.spec_from_file_location("fix_wt", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(mod)
process_file = mod.process_file

WT = ROOT / "Art Library" / "world-tree"

TARGET_DIRS = ["segments", "jlpt-bands", "transitions"]


def main() -> None:
    targets: list[Path] = []
    for sub in TARGET_DIRS:
        folder = WT / sub
        if folder.exists():
            targets.extend(sorted(folder.rglob("*.png")))

    results = []
    passed = 0
    for png in targets:
        if "_staging" in str(png) or "sheet-" in str(png):
            continue
        result = process_file(png, dry_run=False, backup_dir=None)
        results.append(result)
        if result["after"]["pass"]:
            passed += 1
        status = "OK" if result["after"]["pass"] else "FAIL"
        after = result["after"]
        print(
            f"{status} {png.name} "
            f"transparent={after['transparent_pct']}% fringe={after['black_fringe_pct']}%"
        )

    report = WT / "_transparency_fix_segments.json"
    report.write_text(
        json.dumps({"processed": len(results), "passed": passed, "results": results}, indent=2),
        encoding="utf-8",
    )
    print(f"Fixed {len(results)} files, {passed} passed audit")
    print(f"Report: {report.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
