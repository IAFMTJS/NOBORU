#!/usr/bin/env python3
"""
Remove baked checkerboard / white-gray fake transparency from World Tree remasters.

Vectorized single pass — no slow flood-fill loops. Rewrites PNG + WebP.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
REMASTER_ROOT = ROOT / "Art Library" / "world-tree" / "sheet-remasters"
MANIFEST_PATH = REMASTER_ROOT / "manifest.json"

CREAM_BG = np.array([245.0, 245.0, 238.0])
PADDING = 12
WEBP_QUALITY = 92


def purge_checkerboard(img: Image.Image, light_theme: bool) -> Image.Image:
    """Remove opaque checkerboard / backdrop pixels in one vectorized pass."""
    arr = np.array(img, dtype=np.uint8)
    rgb = arr[..., :3].astype(np.float32)
    alpha = arr[..., 3]
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    neutral = (np.abs(rgb[..., 0] - rgb[..., 1]) <= 12) & (np.abs(rgb[..., 1] - rgb[..., 2]) <= 12)
    kill = (alpha > 0) & neutral & (sat <= 20) & (lum >= 100)
    if light_theme:
        dist = np.linalg.norm(rgb - CREAM_BG, axis=2)
        kill |= (alpha > 0) & ((lum > 246) | (dist < 45))
    else:
        kill |= (alpha > 0) & (lum < 40)
    arr[kill] = (0, 0, 0, 0)
    return Image.fromarray(arr, "RGBA")


def crop_to_content(img: Image.Image, pad: int = PADDING) -> Image.Image:
    arr = np.array(img)
    alpha = arr[..., 3]
    ys, xs = np.where(alpha > 8)
    if len(xs) == 0:
        return img
    x0 = max(0, int(xs.min()) - pad)
    x1 = min(arr.shape[1], int(xs.max()) + pad + 1)
    y0 = max(0, int(ys.min()) - pad)
    y1 = min(arr.shape[0], int(ys.max()) + pad + 1)
    return Image.fromarray(arr[y0:y1, x0:x1], "RGBA")


def audit(img: Image.Image) -> dict:
    arr = np.array(img)
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    total = alpha.size
    neutral = (np.abs(rgb[..., 0].astype(int) - rgb[..., 1].astype(int)) <= 10) & (
        np.abs(rgb[..., 1].astype(int) - rgb[..., 2].astype(int)) <= 10
    )
    checker = int(
        np.sum((alpha > 0) & neutral & (rgb.mean(axis=2) >= 100) & (rgb.mean(axis=2) <= 220))
    )
    return {
        "transparent_pct": round(float(np.sum(alpha == 0)) / total * 100, 1),
        "checker_remaining": checker,
    }


def process_file(png_path: Path, *, dry_run: bool) -> dict:
    light_theme = "_light_" in png_path.stem
    img = Image.open(png_path).convert("RGBA")
    before = audit(img)

    img = purge_checkerboard(img, light_theme)
    img = crop_to_content(img)
    after = audit(img)
    result = {"file": png_path.name, "before": before, "after": after}

    if dry_run:
        return result

    img.save(png_path, "PNG", compress_level=6)
    img.save(png_path.with_suffix(".webp"), "WEBP", quality=WEBP_QUALITY, method=4)
    result["fixed"] = True
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove checkerboard from World Tree remasters.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--only", type=str, default="", help="Fix a single PNG path")
    args = parser.parse_args()

    if args.only:
        result = process_file(Path(args.only), dry_run=args.dry_run)
        print(json.dumps(result, indent=2))
        return

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    entries = manifest if args.limit <= 0 else manifest[: args.limit]

    issues = []
    for i, entry in enumerate(entries, start=1):
        png_path = ROOT / entry["png"].replace("/", "\\")
        result = process_file(png_path, dry_run=args.dry_run)
        if result["after"]["checker_remaining"] > 0:
            issues.append(result)
        if i % 50 == 0 or i == len(entries):
            print(f"  {i}/{len(entries)}", flush=True)

    report_path = REMASTER_ROOT / "_transparency_fix_report.json"
    report_path.write_text(
        json.dumps({"processed": len(entries), "issues": issues}, indent=2),
        encoding="utf-8",
    )
    print(f"Done: {len(entries)} remasters ({'dry-run' if args.dry_run else 'fixed'})")
    print(f"Checker pixels remaining: {len(issues)} files")
    if issues:
        for item in issues[:15]:
            print(f"  {item['file']}: {item['after']['checker_remaining']} px")


if __name__ == "__main__":
    main()
