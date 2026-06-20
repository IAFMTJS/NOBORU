#!/usr/bin/env python3
"""
Clean World Tree remaster PNGs: checkerboard, baked black mattes, rembg halos.

Rewrites PNG + WebP in place. Use --section for proof batches.

Usage:
  python scripts/art-direction/fix-world-tree-transparency.py --section 01_trunk_segments --dry-run
  python scripts/art-direction/fix-world-tree-transparency.py --section 01_trunk_segments
"""
from __future__ import annotations

import argparse
import json
import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
REMASTER_ROOT = ROOT / "Art Library" / "world-tree" / "sheet-remasters"
MANIFEST_PATH = REMASTER_ROOT / "manifest.json"
PROOF_BACKUP_ROOT = REMASTER_ROOT / "_staging" / "transparency-proof"

CREAM_BG = np.array([245.0, 245.0, 238.0])
PADDING = 12
WEBP_QUALITY = 92
BORDER_KEY_MAX = 42
DEFRINGE_LUM_MAX = 34
DEFRINGE_ALPHA_MAX = 215


def flood_key_border(arr: np.ndarray, *, luminance_max: int) -> int:
    """Remove near-black opaque pixels connected to the image border."""
    h, w = arr.shape[:2]
    alpha = arr[..., 3]
    rgb = arr[..., :3]
    lum = rgb.mean(axis=2)

    keyable = (alpha > 0) & (lum <= luminance_max) & (rgb.max(axis=2) <= luminance_max + 8)
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        queue.append((x, 0))
        queue.append((x, h - 1))
    for y in range(h):
        queue.append((0, y))
        queue.append((w - 1, y))

    removed = 0
    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y, x]:
            continue
        visited[y, x] = True
        if not keyable[y, x]:
            continue
        arr[y, x] = (0, 0, 0, 0)
        removed += 1
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return removed


def defringe_black(arr: np.ndarray, *, light_theme: bool) -> int:
    """Drop semi-transparent near-black edge contamination (rembg halos)."""
    rgb = arr[..., :3].astype(np.float32)
    alpha = arr[..., 3].astype(np.float32)
    lum = rgb.mean(axis=2)
    if light_theme:
        halo = (alpha > 0) & (alpha < DEFRINGE_ALPHA_MAX) & (lum < DEFRINGE_LUM_MAX) & (rgb.max(axis=2) < 48)
    else:
        # Dark-theme puzzle pieces: crush checkerboard gray + rembg fringe, keep painted bark.
        neutral = (np.abs(rgb[..., 0] - rgb[..., 1]) <= 10) & (np.abs(rgb[..., 1] - rgb[..., 2]) <= 10)
        checker = (alpha > 0) & neutral & (lum >= 90) & (lum <= 230)
        halo = (alpha > 0) & (alpha < DEFRINGE_ALPHA_MAX) & (lum < DEFRINGE_LUM_MAX + 6) & (rgb.max(axis=2) < 52)
        halo |= checker
    count = int(np.sum(halo))
    arr[halo] = (0, 0, 0, 0)
    return count


def purge_checkerboard(arr: np.ndarray, light_theme: bool) -> None:
    """Remove opaque checkerboard / backdrop pixels in one vectorized pass."""
    rgb = arr[..., :3].astype(np.float32)
    alpha = arr[..., 3]
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    neutral = (np.abs(rgb[..., 0] - rgb[..., 1]) <= 12) & (np.abs(rgb[..., 1] - rgb[..., 2]) <= 12)
    kill = (alpha > 0) & neutral & (sat <= 20) & (lum >= 100)
    if light_theme:
        dist = np.linalg.norm(rgb - CREAM_BG, axis=2)
        kill |= (alpha > 0) & ((lum > 246) | (dist < 45))
        near_black = (alpha > 0) & (lum < 28) & (rgb.max(axis=2) < 32)
        kill |= near_black
    else:
        kill |= (alpha > 0) & (lum < 22)
    arr[kill] = (0, 0, 0, 0)


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
    lum = rgb.mean(axis=2)
    visible = alpha > 8
    near_black = visible & (lum < 25) & (rgb.max(axis=2) < 35)
    neutral = (np.abs(rgb[..., 0].astype(int) - rgb[..., 1].astype(int)) <= 10) & (
        np.abs(rgb[..., 1].astype(int) - rgb[..., 2].astype(int)) <= 10
    )
    checker = int(
        np.sum((alpha > 0) & neutral & (lum >= 100) & (lum <= 220))
    )
    h, w = alpha.shape
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    corner_black = sum(
        1 for c in corners if alpha[c[1], c[0]] > 200 and rgb[c[1], c[0]].mean() < 30
    )
    fringe_pct = round(float(np.sum(near_black)) / total * 100, 2)
    return {
        "size": [int(w), int(h)],
        "transparent_pct": round(float(np.sum(alpha == 0)) / total * 100, 1),
        "partial_alpha": int(np.sum((alpha > 0) & (alpha < 255))),
        "black_fringe_pct": fringe_pct,
        "checker_remaining": checker,
        "corner_black": corner_black,
        "pass": fringe_pct < 2.0 and checker == 0 and corner_black < 2,
    }


def clean_rgba(img: Image.Image, *, light_theme: bool) -> tuple[Image.Image, dict]:
    arr = np.array(img.convert("RGBA"), dtype=np.uint8)
    stats = {
        "border_removed": flood_key_border(arr, luminance_max=BORDER_KEY_MAX),
        "defringe_removed": defringe_black(arr, light_theme=light_theme),
    }
    purge_checkerboard(arr, light_theme)
    out = crop_to_content(Image.fromarray(arr, "RGBA"))
    return out, stats


def process_file(png_path: Path, *, dry_run: bool, backup_dir: Path | None) -> dict:
    light_theme = "_light_" in png_path.stem
    img = Image.open(png_path).convert("RGBA")
    before = audit(img)

    cleaned, clean_stats = clean_rgba(img, light_theme=light_theme)
    after = audit(cleaned)
    result = {
        "file": png_path.name,
        "path": str(png_path.relative_to(ROOT)).replace("\\", "/"),
        "before": before,
        "after": after,
        "clean_stats": clean_stats,
    }

    if dry_run:
        return result

    if backup_dir is not None:
        backup_dir.mkdir(parents=True, exist_ok=True)
        backup_target = backup_dir / png_path.name
        if not backup_target.exists():
            shutil.copy2(png_path, backup_target)

    cleaned.save(png_path, "PNG", compress_level=6)
    cleaned.save(png_path.with_suffix(".webp"), "WEBP", quality=WEBP_QUALITY, method=4)
    result["fixed"] = True
    return result


def resolve_entries(section: str, limit: int) -> list[dict]:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    if section:
        manifest = [entry for entry in manifest if entry["section"] == section]
    if limit > 0:
        manifest = manifest[:limit]
    return manifest


def write_proof_preview(section: str, results: list[dict]) -> Path:
    """Composite fixed assets on cream + sky backgrounds so halos are obvious."""
    section_dir = REMASTER_ROOT / section
    pngs = sorted(section_dir.glob("*.png"))
    if not pngs:
        raise FileNotFoundError(f"No PNGs in {section_dir}")

    cols = 6
    rows = int(np.ceil(len(pngs) / cols))
    cell_w, cell_h = 320, 280
    pad = 16
    canvas = Image.new("RGB", (cols * cell_w + pad * 2, rows * cell_h + pad * 2), (232, 226, 214))

    for index, png_path in enumerate(pngs):
        col = index % cols
        row = index // cols
        x0 = pad + col * cell_w
        y0 = pad + row * cell_h

        # Split cell: top cream, bottom sky-blue
        cell = Image.new("RGB", (cell_w - 8, cell_h - 8), (244, 239, 227))
        sky = Image.new("RGB", (cell_w - 8, (cell_h - 8) // 2), (186, 214, 232))
        cell.paste(sky, (0, (cell_h - 8) // 2))

        asset = Image.open(png_path).convert("RGBA")
        aw, ah = asset.size
        scale = min((cell_w - 40) / aw, (cell_h - 48) / ah, 1.0)
        nw, nh = max(1, int(aw * scale)), max(1, int(ah * scale))
        asset = asset.resize((nw, nh), Image.Resampling.LANCZOS)
        ox = (cell_w - 8 - nw) // 2
        oy = (cell_h - 8 - nh) // 2
        cell.paste(asset, (ox, oy), asset)
        canvas.paste(cell, (x0 + 4, y0 + 4))

    out_dir = REMASTER_ROOT / "_previews"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"transparency_proof_{section}.jpg"
    canvas.save(out_path, "JPEG", quality=90, optimize=True)
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Clean World Tree remaster transparency.")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--section", type=str, default="", help="e.g. 01_trunk_segments")
    parser.add_argument("--only", type=str, default="", help="Fix a single PNG path")
    parser.add_argument("--preview", action="store_true", help="Write halo-check preview JPEG")
    parser.add_argument("--no-backup", action="store_true")
    args = parser.parse_args()

    if args.only:
        result = process_file(Path(args.only), dry_run=args.dry_run, backup_dir=None)
        print(json.dumps(result, indent=2))
        return

    entries = resolve_entries(args.section, args.limit)
    if not entries:
        raise SystemExit(f"No manifest entries for section={args.section!r}")

    backup_dir = None
    if not args.no_backup and args.section and not args.dry_run:
        backup_dir = PROOF_BACKUP_ROOT / args.section

    results: list[dict] = []
    passed = 0
    for i, entry in enumerate(entries, start=1):
        png_path = ROOT / entry["png"].replace("/", "\\")
        result = process_file(png_path, dry_run=args.dry_run, backup_dir=backup_dir)
        results.append(result)
        if result["after"]["pass"]:
            passed += 1
        if i % 10 == 0 or i == len(entries):
            print(f"  {i}/{len(entries)}", flush=True)

    report_name = f"_transparency_fix_{args.section or 'all'}.json"
    report_path = REMASTER_ROOT / report_name
    report_path.write_text(
        json.dumps(
            {
                "section": args.section or "all",
                "processed": len(entries),
                "dry_run": args.dry_run,
                "passed": passed,
                "failed": len(entries) - passed,
                "results": results,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"Done: {len(entries)} files ({'dry-run' if args.dry_run else 'fixed'})")
    print(f"Audit pass: {passed}/{len(entries)}")
    print(f"Report: {report_path.relative_to(ROOT)}")
    if backup_dir:
        print(f"Backups: {backup_dir.relative_to(ROOT)}")

    failures = [r for r in results if not r["after"]["pass"]]
    if failures:
        print("Still failing:")
        for item in failures[:10]:
            after = item["after"]
            print(
                f"  {item['file']}: fringe={after['black_fringe_pct']}% "
                f"checker={after['checker_remaining']} corners={after['corner_black']}"
            )

    if args.preview and args.section and not args.dry_run:
        preview_path = write_proof_preview(args.section, results)
        print(f"Preview: {preview_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
