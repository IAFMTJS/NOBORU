#!/usr/bin/env python3
"""
Extract individual World Tree assets from the master reference sheet.

Faithful extraction only — crops each sprite, removes sheet background,
upscales, and writes transparent WebP. No generative redraw.

Usage:
  python scripts/art-direction/extract-world-tree-sheet.py
  python scripts/art-direction/extract-world-tree-sheet.py --scale 3 --min-area 250
"""
from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "Art Library" / "world-tree" / "_reference" / "world-tree-master-sheet_v1.png"
OUTPUT_ROOT = ROOT / "Art Library" / "world-tree" / "sheet-extracts"
MANIFEST_PATH = OUTPUT_ROOT / "manifest.json"

# Approximate Y bands for sheet sections (1024×682 reference layout).
SECTION_BANDS: list[tuple[str, int, int]] = [
    ("01_trunk_segments", 0, 78),
    ("02_branches_limbs", 78, 118),
    ("03_roots_bases", 118, 148),
    ("04_platforms_ledges", 148, 178),
    ("05_floating_islands", 178, 208),
    # Row 06 art sits above the label strip (208–238); label-only band yielded tiny fragments.
    ("06_settlements_buildings", 165, 210),
    ("07_shrines_sacred", 238, 268),
    ("08_camps_learning", 268, 298),
    ("09_bridges_connections", 298, 328),
    ("10_decorations_props", 328, 358),
    ("11_nature_vegetation", 358, 388),
    ("12_special_elements", 388, 418),
    ("13_background_composition", 418, 445),
    ("14_underground_root_passages", 445, 475),
    ("15_root_chambers_caverns", 475, 505),
    ("16_underground_platforms", 505, 535),
    ("17_underground_settlements", 535, 565),
    ("18_underground_props", 565, 595),
    ("19_underground_fungi", 595, 625),
    ("20_underground_crystals", 625, 655),
    ("21_underground_special", 655, 672),
    ("22_cave_backgrounds", 672, 682),
]

LIGHT_SPLIT_Y = 445
CREAM_BG = np.array([245.0, 245.0, 238.0])
DARK_BG = np.array([20.0, 20.0, 22.0])
BG_TOLERANCE = 38
PADDING = 4


@dataclass
class ExtractedAsset:
    id: str
    section: str
    index: int
    bbox: list[int]
    source_area: int
    output_size: list[int]
    theme: str
    file: str


def load_rgb(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("RGB"), dtype=np.float32)


def background_mask(rgb: np.ndarray) -> np.ndarray:
    h, _ = rgb.shape[:2]
    mask = np.zeros((h, rgb.shape[1]), dtype=bool)
    mask[:LIGHT_SPLIT_Y] = np.linalg.norm(rgb[:LIGHT_SPLIT_Y] - CREAM_BG, axis=2) < BG_TOLERANCE
    mask[LIGHT_SPLIT_Y:] = np.linalg.norm(rgb[LIGHT_SPLIT_Y:] - DARK_BG, axis=2) < BG_TOLERANCE
    return mask


def section_for_y(cy: float) -> str:
    y = int(cy)
    for section_id, y0, y1 in SECTION_BANDS:
        if y0 <= y < y1:
            return section_id
    return SECTION_BANDS[-1][0]


def refine_alpha(rgba: Image.Image, *, light_theme: bool) -> Image.Image:
    """Remove sheet background spill; keep painted pixels only."""
    arr = np.array(rgba, dtype=np.float32)
    rgb = arr[..., :3]
    alpha = arr[..., 3].copy()

    cream_dist = np.linalg.norm(rgb - CREAM_BG, axis=2)
    dark_dist = np.linalg.norm(rgb - DARK_BG, axis=2)
    bg_dist = cream_dist if light_theme else dark_dist

    hard_key = bg_dist < BG_TOLERANCE * 0.75
    alpha[hard_key] = 0

    soft = bg_dist < BG_TOLERANCE * 1.35
    fade = np.clip((bg_dist - BG_TOLERANCE * 0.45) / (BG_TOLERANCE * 0.9), 0, 1)
    alpha[soft] = np.minimum(alpha[soft], fade[soft] * 255)

    # Crush near-black fringe on light-theme crops.
    if light_theme:
        near_black = np.all(rgb < 28, axis=2)
        alpha[near_black] = 0

    arr[..., 3] = alpha.astype(np.uint8)
    rgb[alpha == 0] = 0
    arr[..., :3] = rgb
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def crop_to_content(rgba: Image.Image, pad: int = PADDING) -> Image.Image:
    arr = np.array(rgba)
    alpha = arr[..., 3]
    ys, xs = np.where(alpha > 8)
    if len(xs) == 0:
        return rgba
    x0, x1 = max(0, xs.min() - pad), min(arr.shape[1], xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(arr.shape[0], ys.max() + pad + 1)
    return Image.fromarray(arr[y0:y1, x0:x1], "RGBA")


def extract_assets(
    source: Path,
    scale: int,
    min_area: int,
    *,
    only_sections: set[str] | None = None,
) -> list[ExtractedAsset]:
    rgb = load_rgb(source)
    h, w = rgb.shape[:2]

    if only_sections:
        manifest: list[ExtractedAsset] = []
        for section_id, y0, y1 in SECTION_BANDS:
            if section_id not in only_sections:
                continue
            manifest.extend(
                extract_band(
                    rgb,
                    section_id=section_id,
                    y0=y0,
                    y1=y1,
                    scale=scale,
                    min_area=min_area,
                )
            )
        manifest.sort(key=lambda item: (item.section, item.index))
        return manifest

    fg = ~background_mask(rgb)

    labeled, count = ndimage.label(fg)
    sizes = ndimage.sum(fg, labeled, range(1, count + 1))

    section_counters: dict[str, int] = {}
    manifest = []

    base_rgba = Image.fromarray(rgb.astype(np.uint8), "RGB").convert("RGBA")
    base_arr = np.array(base_rgba)
    base_arr[..., 3] = (fg * 255).astype(np.uint8)
    sheet = Image.fromarray(base_arr, "RGBA")

    for label_id, area in enumerate(sizes, start=1):
        if area < min_area:
            continue

        component = labeled == label_id
        ys, xs = np.where(component)
        cy = ys.mean()
        section = section_for_y(cy)
        section_counters[section] = section_counters.get(section, 0) + 1
        index = section_counters[section]

        x0, x1 = int(xs.min()), int(xs.max()) + 1
        y0, y1 = int(ys.min()), int(ys.max()) + 1
        crop = sheet.crop((x0, y0, x1, y1))
        crop = refine_alpha(crop, light_theme=cy < LIGHT_SPLIT_Y)
        crop = crop_to_content(crop)

        if scale > 1:
            new_size = (crop.width * scale, crop.height * scale)
            crop = crop.resize(new_size, Image.Resampling.LANCZOS)

        theme = "light" if cy < LIGHT_SPLIT_Y else "dark"
        asset_id = f"wt_{section}_{index:02d}_{theme}_v1"
        out_dir = OUTPUT_ROOT / section
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{asset_id}.webp"
        crop.save(out_path, "WEBP", lossless=True, method=6)

        manifest.append(
            ExtractedAsset(
                id=asset_id,
                section=section,
                index=index,
                bbox=[x0, y0, x1, y1],
                source_area=int(area),
                output_size=[crop.width, crop.height],
                theme=theme,
                file=str(out_path.relative_to(ROOT)).replace("\\", "/"),
            )
        )

    manifest.sort(key=lambda item: (item.section, item.index))
    return manifest


def extract_band(
    rgb: np.ndarray,
    *,
    section_id: str,
    y0: int,
    y1: int,
    scale: int,
    min_area: int,
) -> list[ExtractedAsset]:
    """Extract within one sheet band — avoids cross-row component mis-assignment."""
    band_rgb = rgb[y0:y1, :, :]
    light_theme = y0 < LIGHT_SPLIT_Y
    cream = CREAM_BG if light_theme else DARK_BG
    fg = np.linalg.norm(band_rgb - cream, axis=2) >= BG_TOLERANCE

    labeled, count = ndimage.label(fg)
    sizes = ndimage.sum(fg, labeled, range(1, count + 1))

    base_rgba = Image.fromarray(band_rgb.astype(np.uint8), "RGB").convert("RGBA")
    base_arr = np.array(base_rgba)
    base_arr[..., 3] = (fg * 255).astype(np.uint8)
    sheet = Image.fromarray(base_arr, "RGBA")

    manifest: list[ExtractedAsset] = []
    index = 0

    for label_id, area in enumerate(sizes, start=1):
        if area < min_area:
            continue

        component = labeled == label_id
        ys, xs = np.where(component)
        index += 1

        x0, x1 = int(xs.min()), int(xs.max()) + 1
        by0, by1 = int(ys.min()), int(ys.max()) + 1
        crop = sheet.crop((x0, by0, x1, by1))
        crop = refine_alpha(crop, light_theme=light_theme)
        crop = crop_to_content(crop)

        if scale > 1:
            crop = crop.resize((crop.width * scale, crop.height * scale), Image.Resampling.LANCZOS)

        theme = "light" if light_theme else "dark"
        asset_id = f"wt_{section_id}_{index:02d}_{theme}_v1"
        out_dir = OUTPUT_ROOT / section_id
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"{asset_id}.webp"
        crop.save(out_path, "WEBP", lossless=True, method=6)

        manifest.append(
            ExtractedAsset(
                id=asset_id,
                section=section_id,
                index=index,
                bbox=[x0, y0 + by0, x1, y0 + by1],
                source_area=int(area),
                output_size=[crop.width, crop.height],
                theme=theme,
                file=str(out_path.relative_to(ROOT)).replace("\\", "/"),
            )
        )

    return manifest


def merge_manifest(existing: list[dict], new_items: list[ExtractedAsset]) -> list[dict]:
    if not new_items:
        return existing
    replaced = {item.section for item in new_items}
    kept = [item for item in existing if item["section"] not in replaced]
    merged = kept + [asdict(item) for item in new_items]
    merged.sort(key=lambda item: (item["section"], item["index"]))
    return merged


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract World Tree sheet sprites to transparent WebP.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--scale", type=int, default=2, help="Upscale factor after crop (default: 2)")
    parser.add_argument("--min-area", type=int, default=200, help="Minimum sprite area in source pixels")
    parser.add_argument(
        "--sections",
        type=str,
        default="",
        help="Comma-separated section ids to re-extract in isolation and merge into manifest",
    )
    args = parser.parse_args()

    if not args.source.exists():
        raise SystemExit(f"Source sheet not found: {args.source}")

    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    only_sections = {part.strip() for part in args.sections.split(",") if part.strip()} or None
    manifest_items = extract_assets(
        args.source,
        scale=args.scale,
        min_area=args.min_area,
        only_sections=only_sections,
    )

    if only_sections and MANIFEST_PATH.exists():
        existing = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        manifest_payload = merge_manifest(existing, manifest_items)
    else:
        manifest_payload = [asdict(item) for item in manifest_items]

    MANIFEST_PATH.write_text(json.dumps(manifest_payload, indent=2), encoding="utf-8")

    by_section: dict[str, int] = {}
    for item in manifest_payload:
        by_section[item["section"]] = by_section.get(item["section"], 0) + 1

    print(f"Extracted {len(manifest_items)} assets -> {OUTPUT_ROOT}")
    for section, count in sorted(by_section.items()):
        if only_sections and section not in only_sections:
            continue
        print(f"  {section}: {count}")
    print(f"Manifest: {MANIFEST_PATH} ({len(manifest_payload)} total)")


if __name__ == "__main__":
    main()
