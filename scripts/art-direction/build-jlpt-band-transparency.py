#!/usr/bin/env python3
"""
Extract true alpha from JLPT band source PNGs (chroma-key + edge cleanup).

Source masters may use solid #FF00FF or sky-blue backdrops from generation.
Outputs production puzzle strips to Art Library/world-tree/jlpt-bands/.

Usage:
  python scripts/art-direction/build-jlpt-band-transparency.py
  python scripts/art-direction/build-jlpt-band-transparency.py --band n5 --theme light
"""
from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BAND_ROOT = ROOT / "Art Library" / "world-tree" / "jlpt-bands"
SOURCE_ROOT = BAND_ROOT / "_source"
TARGET_SIZE = (1536, 2048)
CHROMA_KEY = np.array([255, 0, 255], dtype=np.float32)
CHROMA_TOLERANCE = 95
SKY_BLUE = np.array([135, 206, 235], dtype=np.float32)
SKY_TOLERANCE = 72

BANDS = ("n5", "n4", "n3", "n2", "n1")
THEMES = ("light", "dark")


def load_rgba(path: Path) -> np.ndarray:
    img = Image.open(path).convert("RGBA")
    if img.size != TARGET_SIZE:
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    return np.array(img)


def color_distance(rgb: np.ndarray, target: np.ndarray) -> np.ndarray:
    diff = rgb.astype(np.float32) - target
    return np.sqrt(np.sum(diff * diff, axis=2))


def key_chroma(arr: np.ndarray) -> int:
    rgb = arr[..., :3]
    alpha = arr[..., 3]
    dist_magenta = color_distance(rgb, CHROMA_KEY)
    dist_sky = color_distance(rgb, SKY_BLUE)
    kill = (alpha > 0) & ((dist_magenta < CHROMA_TOLERANCE) | (dist_sky < SKY_TOLERANCE))
    count = int(np.sum(kill))
    arr[kill] = (0, 0, 0, 0)
    return count


def flood_border(arr: np.ndarray, *, lum_max: float = 248.0, sat_max: float = 18.0) -> int:
    """Remove bright neutral border pixels connected to edges (white/cream/sky fill)."""
    h, w = arr.shape[:2]
    rgb = arr[..., :3].astype(np.float32)
    alpha = arr[..., 3]
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    keyable = (alpha > 0) & (lum >= lum_max) & (sat <= sat_max)
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


def defringe(arr: np.ndarray) -> int:
    rgb = arr[..., :3].astype(np.float32)
    alpha = arr[..., 3].astype(np.float32)
    lum = rgb.mean(axis=2)
    halo = (alpha > 0) & (alpha < 200) & (lum > 220)
    count = int(np.sum(halo))
    arr[halo] = (0, 0, 0, 0)
    return count


def alpha_audit(arr: np.ndarray) -> dict[str, float | int]:
    alpha = arr[..., 3]
    opaque = int(np.sum(alpha > 200))
    transparent = int(np.sum(alpha == 0))
    total = alpha.size
    return {
        "opaque_pixels": opaque,
        "transparent_pixels": transparent,
        "opaque_percent": round(100 * opaque / total, 2),
    }


def process_file(source: Path, dest: Path) -> dict[str, object]:
    arr = load_rgba(source)
    stats = {
        "source": str(source.relative_to(ROOT)),
        "chroma_removed": key_chroma(arr),
        "border_removed": flood_border(arr),
        "defringe_removed": defringe(arr),
    }
    stats.update(alpha_audit(arr))

    dest.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(arr).save(dest, optimize=True)
    stats["dest"] = str(dest.relative_to(ROOT))
    return stats


def resolve_paths(band: str, theme: str) -> tuple[Path, Path]:
    source = SOURCE_ROOT / band / f"wt_jlpt_{band}_{theme}_raw.png"
    dest = BAND_ROOT / band / f"wt_jlpt_{band}_{theme}_v1.png"
    return source, dest


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--band", choices=BANDS)
    parser.add_argument("--theme", choices=THEMES)
    args = parser.parse_args()

    bands = [args.band] if args.band else list(BANDS)
    themes = [args.theme] if args.theme else list(THEMES)

    for band in bands:
        for theme in themes:
            source, dest = resolve_paths(band, theme)
            if not source.exists():
                print(f"SKIP missing source: {source.relative_to(ROOT)}")
                continue
            stats = process_file(source, dest)
            print(
                f"OK {band}/{theme}: opaque={stats['opaque_percent']}% "
                f"chroma={stats['chroma_removed']} border={stats['border_removed']}"
            )


if __name__ == "__main__":
    main()
