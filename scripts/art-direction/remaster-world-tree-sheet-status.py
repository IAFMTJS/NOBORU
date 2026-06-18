#!/usr/bin/env python3
"""
Track and list World Tree sheet remaster progress.

Usage:
  python scripts/art-direction/remaster-world-tree-sheet-status.py
  python scripts/art-direction/remaster-world-tree-sheet-status.py --pending 01_trunk_segments
  python scripts/art-direction/remaster-world-tree-sheet-status.py --next 10
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXTRACT_MANIFEST = ROOT / "Art Library" / "world-tree" / "sheet-extracts" / "manifest.json"
REMASTER_MANIFEST = ROOT / "Art Library" / "world-tree" / "sheet-remasters" / "manifest.json"
REMASTER_ROOT = ROOT / "Art Library" / "world-tree" / "sheet-remasters"

REMASTER_PROMPT = (
    "EXACT faithful copy of the reference asset. Same silhouette, proportions, colors, "
    "and design — zero design changes, zero added elements. Only higher resolution and "
    "sharper painterly detail. Semi-realistic fantasy Japanese world tree game sprite. "
    "Fully transparent background, no backdrop, no ground, no shadow plate."
)


def load_manifest(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def v2_id(v1_id: str) -> str:
    return v1_id.replace("_v1", "_v2")


def is_done(entry: dict, done_ids: set[str]) -> bool:
    return v2_id(entry["id"]) in done_ids or (REMASTER_ROOT / entry["section"] / f"{v2_id(entry['id'])}.webp").exists()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pending", help="Filter by section id")
    parser.add_argument("--next", type=int, help="Print next N pending asset ids")
    args = parser.parse_args()

    extract = load_manifest(EXTRACT_MANIFEST)
    remaster = load_manifest(REMASTER_MANIFEST)
    done_ids = {item["id"] for item in remaster}

    pending = [e for e in extract if not is_done(e, done_ids)]
    if args.pending:
        pending = [e for e in pending if e["section"] == args.pending]

    by_section: dict[str, int] = {}
    for entry in extract:
        sec = entry["section"]
        by_section[sec] = by_section.get(sec, 0) + 1

    done_by_section: dict[str, int] = {}
    for entry in extract:
        if is_done(entry, done_ids):
            sec = entry["section"]
            done_by_section[sec] = done_by_section.get(sec, 0) + 1

    print(f"Remaster progress: {len(extract) - len(pending)}/{len(extract)}")
    for sec in sorted(by_section):
        done = done_by_section.get(sec, 0)
        total = by_section[sec]
        print(f"  {sec}: {done}/{total}")

    if args.next:
        print("\nNext pending:")
        for entry in pending[: args.next]:
            print(f"  {v2_id(entry['id'])}  <-  {entry['file']}")

    if not args.next and not args.pending:
        print("\nPrompt template:")
        print(REMASTER_PROMPT)


if __name__ == "__main__":
    main()
