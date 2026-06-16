#!/usr/bin/env node
/**
 * Derive dark-mode icon from light-mode RGBA (same silhouette, recolored).
 * Usage: node scripts/art-direction/derive-dark-icons.mjs [folder]
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const folders = process.argv.slice(2).length
  ? process.argv.slice(2).map((f) => resolve(f))
  : [
      resolve("Art Library/icons"),
      resolve("Art Library/props"),
      resolve("Art Library/achievements"),
    ];

const py = `
import numpy as np
from pathlib import Path
from PIL import Image, ImageEnhance

folders = ${JSON.stringify(folders.map((f) => f.replace(/\\/g, "\\\\")))}
count = 0

for folder_str in folders:
    folder = Path(folder_str)
    if not folder.is_dir():
        continue
    for light in sorted(folder.rglob("*_light_v1.png")):
        dark = light.with_name(light.name.replace("_light_v1", "_dark_v1"))
        if dark.exists():
            continue
        if light.name.startswith("icon_app_"):
            im = Image.open(light).convert("RGBA")
            im.save(dark, format="PNG", optimize=True)
            print(f"app icon copy {dark.name}")
            count += 1
            continue
        im = Image.open(light).convert("RGBA")
        arr = np.array(im, dtype=np.float32)
        rgb = arr[:, :, :3]
        a = arr[:, :, 3]
        mask = a > 8
        if not mask.any():
            im.save(dark)
            count += 1
            continue
        lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
        inv = 255.0 - rgb
        lum3 = np.stack([lum, lum, lum], axis=2)
        new_rgb = np.where(
            mask[:, :, None],
            np.clip(0.62 * inv + 0.28 * lum3 + np.array([18, 16, 8]), 0, 255),
            rgb,
        )
        out = np.dstack([new_rgb, a]).astype(np.uint8)
        Image.fromarray(out, "RGBA").save(dark, format="PNG", optimize=True)
        print(f"derived {dark.name}")
        count += 1

print(f"Derived {count} dark variants")
`;

const result = spawnSync("python", ["-c", py], { encoding: "utf8", stdio: "pipe" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
