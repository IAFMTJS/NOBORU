/**
 * Derives continuation-trail (trail-2) anchor polylines from each region's primary path.
 * Writes regions.{slug}.trails[0] — consumed when trailSegmentIndex === 1.
 *
 * Usage: node scripts/sync-trail2-anchors.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contractPath = path.join(root, "lib/design-system/trail-path-anchors.json");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

/** Mirror the primary path with asymmetric sway so trail-2 feels like a sibling route. */
function deriveTrail2Anchors(primaryAnchors) {
  const last = primaryAnchors.length - 1;
  return primaryAnchors.map((point, index) => {
    const phase = last === 0 ? 0 : index / last;
    const mirroredX = 100 - point.x;
    const sway = Math.sin(phase * Math.PI * 1.75) * 5;
    const zig = index % 2 === 0 ? 2.5 : -2.5;

    return {
      x: round1(clamp(mirroredX + sway + zig * 0.35, 26, 74)),
      y: round1(point.y),
    };
  });
}

const contract = JSON.parse(await readFile(contractPath, "utf8"));

for (const [slug, region] of Object.entries(contract.regions)) {
  region.trails = [
    {
      dark: deriveTrail2Anchors(region.dark),
      light: deriveTrail2Anchors(region.light),
    },
  ];
}

await writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`);
console.log(
  `Updated trail-2 anchors for ${Object.keys(contract.regions).length} regions in trail-path-anchors.json`,
);
