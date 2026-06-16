#!/usr/bin/env node
/**
 * Strict transparency audit for Art Library PNGs.
 * Usage: node scripts/art-direction/audit-transparency.mjs [Art Library path]
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(process.argv[2] ?? "Art Library");
const py = `
from pathlib import Path
from PIL import Image
import json, shutil

root = Path(r"${root.replace(/\\/g, "\\\\")}")
rejected = root / "_rejected" / "no_transparency"
rejected.mkdir(parents=True, exist_ok=True)
results = {"pass": [], "warn": [], "fail": [], "corner_fail": []}

def audit(path):
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    total = w * h
    a = list(im.getchannel("A").getdata())
    transparent = sum(1 for x in a if x == 0)
    partial = sum(1 for x in a if 0 < x < 255)
    opaque = sum(1 for x in a if x == 255)
    t_pct = transparent / total * 100
    corners = [(0,0),(w-1,0),(0,h-1),(w-1,h-1)]
    corner_alphas = [im.getpixel(c)[3] for c in corners]
    corner_opaque = sum(1 for x in corner_alphas if x > 32)
    detail = f"RGBA {w}x{h} transparent={t_pct:.1f}% partial={partial} corners={corner_alphas}"
    if transparent == 0:
        return "fail", detail
    if t_pct < 15:
        return "warn", detail
    if corner_opaque >= 3:
        return "corner_fail", detail
    if opaque / total > 0.90 and t_pct < 25:
        return "fail", detail
    return "pass", detail

for folder in sorted(p for p in root.iterdir() if p.is_dir() and not p.name.startswith("_")):
    for path in sorted(folder.rglob("*.png")):
        rel = path.relative_to(root).as_posix()
        status, detail = audit(path)
        results[status].append({"file": rel, "detail": detail})

# Quarantine fails + corner fails
for key in ("fail", "corner_fail"):
    for entry in results[key]:
        src = root / entry["file"]
        dst = rejected / Path(entry["file"]).name
        if src.exists():
            shutil.move(str(src), str(dst))
            entry["quarantined"] = str(dst.relative_to(root))

(root / "_audit_transparency.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
print(f"PASS {len(results['pass'])}")
print(f"WARN {len(results['warn'])}")
print(f"FAIL {len(results['fail'])}")
print(f"CORNER_FAIL {len(results['corner_fail'])}")
print(f"Quarantined to _rejected/no_transparency/")
for key in ("fail", "corner_fail", "warn"):
    if results[key]:
        print(f"--- {key.upper()} ---")
        for e in results[key][:50]:
            print(e['file'], '|', e['detail'])
`;

const r = spawnSync("python", ["-c", py], { encoding: "utf8", stdio: "inherit" });
process.exit(r.status ?? 1);
