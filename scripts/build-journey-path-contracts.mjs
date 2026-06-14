/**
 * Builds authoritative journey path contracts from region spine definitions.
 * Path is the primary object — art follows these waypoints, not the reverse.
 *
 * Usage: node scripts/build-journey-path-contracts.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const anchorContract = JSON.parse(
  await readFile(
    path.join(root, "lib/design-system/trail-path-anchors.json"),
    "utf8",
  ),
);

const REGION_SLUGS = Object.keys(anchorContract.regions);

/** Checkpoint slots along the path (normalized 0–1, bottom=start → top=summit). */
const CHECKPOINT_SLOTS = [0.35, 0.68];
/** Landmark slots between checkpoint bands. */
const LANDMARK_SLOTS = [0.18, 0.52, 0.84];

const contract = {
  version: 1,
  scrollArtWidth: anchorContract.scrollArtWidth,
  scrollArtHeight: anchorContract.scrollArtHeight,
  coordinateSystem:
    "Percentage coords on scroll canvas. y=94 is journey start (base), y=6 is region summit. pathPosition 0=start, 1=summit.",
  regions: {},
  worldSpine: {
    dark: [...anchorContract.spine.dark],
    light: [...anchorContract.spine.light],
  },
};

for (const slug of REGION_SLUGS) {
  const region = anchorContract.regions[slug];
  contract.regions[slug] = {
    spine: {
      dark: region.dark.map((point) => ({ ...point })),
      light: region.light.map((point) => ({ ...point })),
    },
    trails: (region.trails ?? []).map((trail) => ({
      dark: trail.dark.map((point) => ({ ...point })),
      light: trail.light.map((point) => ({ ...point })),
    })),
    checkpointSlots: [...CHECKPOINT_SLOTS],
    landmarkSlots: [...LANDMARK_SLOTS],
  };
}

const outPath = path.join(root, "lib/design-system/journey-path-contracts.json");
await writeFile(outPath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${REGION_SLUGS.length} regions)`);
