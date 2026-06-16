/**
 * Post-process icon PNGs to true RGBA transparency via rembg.
 * Usage: node scripts/art-direction/strip-icon-backgrounds.mjs [folder]
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const folder = resolve(process.argv[2] ?? "Art Library/icons");
const py = `
from pathlib import Path
from io import BytesIO
from rembg import remove
from PIL import Image

folder = Path(r"${folder.replace(/\\/g, "\\\\")}")
patterns = ["**/*_light_v1.png", "**/*_dark_v1.png"]
files = []
if folder.is_dir():
    for pat in patterns:
        files.extend(folder.glob(pat))
files = sorted(set(files))
if not files:
    raise SystemExit("No icon files found in " + str(folder))

def trim(im, pad=24):
    bbox = im.getbbox()
    if not bbox:
        return im
    im = im.crop(bbox)
    w, h = im.size
    side = max(w, h) + pad * 2
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - w) // 2
    oy = (side - h) // 2
    canvas.paste(im, (ox, oy), im)
    return canvas

for path in files:
    if path.name.startswith("icon_app_"):
        dark = path.with_name(path.name.replace("_light_v1", "_dark_v1"))
        if not dark.exists() and "_light_v1" in path.name:
            im = Image.open(path).convert("RGBA")
            im.save(dark, format="PNG", optimize=True)
            print(f"skipped strip (app icon), copied to {dark.name}")
        continue
    if "_dark_v1" in path.name:
        continue
    raw = path.read_bytes()
    out = remove(raw)
    im = Image.open(BytesIO(out)).convert("RGBA")
    im = trim(im)
    im.save(path, format="PNG", optimize=True)
    alpha = im.getchannel("A")
    transparent = sum(1 for a in alpha.getdata() if a == 0)
    print(f"{path.name}: {im.mode} {im.size[0]}x{im.size[1]} transparent_px={transparent}")

print(f"Processed {len(files)} icons")
`;

const result = spawnSync("python", ["-c", py], { encoding: "utf8", stdio: "pipe" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.status ?? 1);
