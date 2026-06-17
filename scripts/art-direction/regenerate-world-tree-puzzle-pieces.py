#!/usr/bin/env python3
"""
Post-process World Tree segment PNGs into modular puzzle pieces.

- Forces corner transparency (audit requirement)
- Applies side alpha falloff so painted content stays in the trunk corridor
- Adds top/bottom mist seam zones for vertical stack blend
- Normalizes to 1536×1024

Usage:
  python scripts/art-direction/regenerate-world-tree-puzzle-pieces.py roots_b roots_c
  python scripts/art-direction/regenerate-world-tree-puzzle-pieces.py --all-failed
"""
from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / "Art Library" / "world-tree"
MANIFEST = ROOT / "scripts" / "art-direction" / "world-tree-manifest.json"

CANVAS = (1536, 1024)
TRUNK_CENTER_X = 0.5
CORRIDOR_HALF = 0.18  # ~36% total corridor
SEAM_ZONE = 0.20
VERSION = 2

# Segments that failed puzzle-piece alpha audit (full-bleed or too wide)
FAILED_SEGMENTS = [
    "roots_b",
    "roots_c",
    "roots_d",
    "trunk_c",
    "trunk_e",
    "trunk_f",
    "trunk_g",
]

REFERENCE_BY_FAMILY = {
    "roots": LIB / "segments" / "roots_a" / "wt_roots_a_dark_v2.png",
    "trunk": LIB / "segments" / "trunk_a" / "wt_trunk_a_dark_v2.png",
}


def segment_family(segment_id: str) -> str:
    return "roots" if segment_id.startswith("roots_") else "trunk"


def load_rgba(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    if img.size != CANVAS:
        img = img.resize(CANVAS, Image.Resampling.LANCZOS)
    return img


def horizontal_corridor_mask(width: int, height: int) -> Image.Image:
    """Soft corridor mask — opaque center, transparent sides."""
    mask = Image.new("L", (width, height), 0)
    cx = width * TRUNK_CENTER_X
    half = width * CORRIDOR_HALF
    for y in range(height):
        for x in range(width):
            dist = abs(x - cx) / half
            if dist <= 0.55:
                alpha = 255
            elif dist >= 1.35:
                alpha = 0
            else:
                t = (dist - 0.55) / 0.8
                alpha = int(255 * (1 - t) ** 1.6)
            mask.putpixel((x, y), alpha)
    return mask


def vertical_seam_mask(width: int, height: int) -> Image.Image:
    """Feather top/bottom seam zones for stack overlap."""
    mask = Image.new("L", (width, height), 255)
    seam_px = int(height * SEAM_ZONE)
    for y in range(height):
        if y < seam_px:
            t = y / seam_px
            row_alpha = int(255 * (t**1.4))
        elif y >= height - seam_px:
            t = (height - 1 - y) / seam_px
            row_alpha = int(255 * (t**1.4))
        else:
            continue
        for x in range(width):
            current = mask.getpixel((x, y))
            mask.putpixel((x, y), min(current, row_alpha))
    return mask


def reference_alpha_mask(reference: Path, width: int, height: int) -> Image.Image:
    ref = load_rgba(reference)
    alpha = ref.split()[3]
    # Slight dilation so reference silhouette isn't tighter than corridor math
    return alpha


def corner_clear_mask(width: int, height: int, inset: int = 48) -> Image.Image:
    mask = Image.new("L", (width, height), 255)
    for y in range(height):
        for x in range(width):
            dx = min(x, width - 1 - x)
            dy = min(y, height - 1 - y)
            if dx < inset and dy < inset:
                dist = math.hypot(inset - dx, inset - dy)
                fade = max(0, min(255, int(255 * (dist / inset))))
                mask.putpixel((x, y), min(mask.getpixel((x, y)), fade))
    return mask


def derive_dark_from_light(light: Image.Image) -> Image.Image:
    """Palette swap approximation for dark theme pair."""
    px = light.load()
    w, h = light.size
    out = Image.new("RGBA", (w, h))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                opx[x, y] = (0, 0, 0, 0)
                continue
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            # Keep gold / bioluminescent hues, darken bark and soil
            if g > r and b > r and g > 120:
                nr, ng, nb = int(r * 0.55), int(g * 0.85), int(b * 0.9)
            elif r > 180 and g > 140:
                nr, ng, nb = min(255, int(r * 0.95)), min(255, int(g * 0.75)), int(b * 0.45)
            else:
                nr = int(13 + lum * 40)
                ng = int(19 + lum * 35)
                nb = int(29 + lum * 45)
            opx[x, y] = (nr, ng, nb, a)
    return out


def remove_flat_background(img: Image.Image, tolerance: int = 22) -> Image.Image:
    """Flood-fill corner backdrop (black/white/gray) to transparent."""
    px = img.load()
    w, h = img.size
    visited = bytearray(w * h)
    stack: list[tuple[int, int]] = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
    ]

    def is_backdrop(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        if a < 8:
            return True
        lum = (r + g + b) / 3
        return lum < tolerance or lum > 255 - tolerance

    while stack:
        x, y = stack.pop()
        idx = y * w + x
        if idx < 0 or idx >= len(visited) or visited[idx]:
            continue
        if not is_backdrop(x, y):
            continue
        visited[idx] = 1
        _, _, _, _ = px[x, y]
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        if x > 0:
            stack.append((x - 1, y))
        if x + 1 < w:
            stack.append((x + 1, y))
        if y > 0:
            stack.append((x, y - 1))
        if y + 1 < h:
            stack.append((x, y + 1))

    return img


def process_puzzle_piece(
    source: Image.Image,
    reference_path: Path,
) -> Image.Image:
    w, h = source.size
    source = remove_flat_background(source.copy())
    src_a = source.split()[3]

    corridor = horizontal_corridor_mask(w, h)
    seam = vertical_seam_mask(w, h)
    ref_a = reference_alpha_mask(reference_path, w, h)
    corners = corner_clear_mask(w, h)

    combined = Image.new("L", (w, h), 0)
    for y in range(h):
        for x in range(w):
            a = src_a.getpixel((x, y))
            m = min(
                a,
                corridor.getpixel((x, y)),
                seam.getpixel((x, y)),
                ref_a.getpixel((x, y)),
                corners.getpixel((x, y)),
            )
            combined.putpixel((x, y), m)

    out = source.copy()
    out.putalpha(combined)
    return out


def audit(path: Path) -> dict:
    im = load_rgba(path)
    w, h = im.size
    a = list(im.getchannel("A").getdata())
    total = w * h
    transparent = sum(1 for x in a if x == 0)
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    corner_opaque = sum(1 for c in corners if im.getpixel(c)[3] > 32)

    opaque_coords = [i for i, x in enumerate(a) if x > 32]
    if opaque_coords:
        xs = [i % w for i in opaque_coords]
        bbox_w = (max(xs) - min(xs) + 1) / w * 100
    else:
        bbox_w = 0

    return {
        "transparent_pct": transparent / total * 100,
        "corner_opaque": corner_opaque,
        "opaque_width_pct": bbox_w,
    }


def segment_folder(segment_id: str) -> Path:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for seg in data["segments"]:
        if seg["id"] == segment_id:
            return LIB / seg["folder"]
    return LIB / "segments" / segment_id


def process_segment(segment_id: str, staging: Path | None = None) -> None:
    folder = segment_folder(segment_id)
    folder.mkdir(parents=True, exist_ok=True)
    ref = REFERENCE_BY_FAMILY[segment_family(segment_id)]

    light_name = f"wt_{segment_id}_light_v{VERSION}.png"
    dark_name = f"wt_{segment_id}_dark_v{VERSION}.png"

    if staging:
        staged = staging / light_name
        if not staged.exists():
            raise FileNotFoundError(f"Missing staged light master: {staged}")
        light_src = load_rgba(staged)
    else:
        light_path = folder / light_name
        if not light_path.exists():
            raise FileNotFoundError(f"Missing {light_path}")
        light_src = load_rgba(light_path)

    light_out = process_puzzle_piece(light_src, ref)
    dark_out = derive_dark_from_light(light_out)

    light_path = folder / light_name
    dark_path = folder / dark_name
    light_out.save(light_path, optimize=True)
    dark_out.save(dark_path, optimize=True)

    stats = audit(dark_path)
    print(
        f"{segment_id}: transparent={stats['transparent_pct']:.1f}% "
        f"opaque_w={stats['opaque_width_pct']:.1f}% "
        f"corners={stats['corner_opaque']}/4"
    )


def process_all_from_staging(staging: Path) -> None:
    for segment_id in FAILED_SEGMENTS:
        light_name = f"wt_{segment_id}_light_v{VERSION}.png"
        if not (staging / light_name).exists():
            print(f"skip {segment_id}: missing {light_name}")
            continue
        process_segment(segment_id, staging=staging)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("segments", nargs="*", help="Segment ids to process")
    parser.add_argument("--all-failed", action="store_true")
    parser.add_argument(
        "--staging",
        type=Path,
        default=None,
        help="Folder with wt_*_light_v2.png staged generations",
    )
    args = parser.parse_args()

    targets = FAILED_SEGMENTS if args.all_failed else args.segments
    if not targets:
        parser.error("Provide segment ids or --all-failed")

    if args.all_failed and args.staging:
        process_all_from_staging(args.staging)
        return

    for segment_id in targets:
        process_segment(segment_id, staging=args.staging)


if __name__ == "__main__":
    main()
