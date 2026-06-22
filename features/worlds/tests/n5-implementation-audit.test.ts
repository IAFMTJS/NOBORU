/**
 * Static implementation audit for N5 ship spec (11-n5-complete-spec.md).
 * Run: npx vitest run features/worlds/tests/n5-implementation-audit.test.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import contract from "@/lib/design-system/journey-path-contracts.json";
import { N5_ACTS } from "@/lib/design-system/worlds";
import { N5_LANDMARK_FALLBACKS } from "@/features/worlds/constants/n5-landmarks.constants";
import { N5_TRIAL_DISPLAY_BY_LEGACY_TITLE } from "@/features/worlds/constants/n5-trial-display.constants";
import {
  N5_ACT_SLICE_ART,
  N5_PORTAL_MATTE,
  N5_REALM_SILHOUETTE,
} from "@/features/worlds/constants/n5-world-art.constants";
import {
  N5_WORLD_SUBTITLE,
  N5_WORLD_TITLE,
  resolveN5ScrollMinHeightVh,
} from "@/features/worlds/constants/n5-world.constants";
import { N5_RESERVED_NODE_SLOTS } from "@/features/worlds/constants/n5-reserved-nodes.constants";

const ROOT = join(process.cwd());

type AuditItem = {
  id: string;
  area: string;
  requirement: string;
  status: "pass" | "fail";
  detail?: string;
};

function auditResults(): AuditItem[] {
  const items: AuditItem[] = [];

  const push = (
    id: string,
    area: string,
    requirement: string,
    ok: boolean,
    detail?: string,
  ) => {
    items.push({ id, area, requirement, status: ok ? "pass" : "fail", detail });
  };

  push(
    "route-tree",
    "Journey / UI",
    "N5 canvas wired at /tree",
    existsSync(join(ROOT, "app/(app)/tree/page.tsx")) &&
      readFileSync(join(ROOT, "app/(app)/tree/page.tsx"), "utf8").includes("N5WorldScreen"),
  );

  push(
    "world-module",
    "Journey / UI",
    "features/worlds module present",
    existsSync(join(ROOT, "features/worlds/components/n5-world-canvas.tsx")),
  );

  push(
    "hud-copy",
    "HUD",
    "Realm title + subtitle constants",
    N5_WORLD_TITLE === "Realm of First Light" &&
      N5_WORLD_SUBTITLE.includes("始まりの境"),
  );

  push(
    "act-labels",
    "HUD",
    "Three act labels defined",
    N5_ACTS[1]?.subtitle === "Awakening" &&
      N5_ACTS[2]?.subtitle === "First steps" &&
      N5_ACTS[3]?.subtitle === "The climb begins",
  );

  push(
    "scroll-height",
    "Layout",
    "Dynamic scroll height for node spacing",
    resolveN5ScrollMinHeightVh(40) >= 800,
  );

  push(
    "path-contract-n5",
    "Layout",
    "journey-path-contracts n5 region",
    "n5" in contract.regions &&
      (contract.regions as Record<string, { landmarkSlots?: number[] }>).n5
        ?.landmarkSlots?.length === 8,
  );

  push(
    "greybox-layout",
    "Layout",
    "n5-world-layout.json exists",
    existsSync(join(ROOT, "scripts/art-direction/n5-world-layout.json")),
  );

  push(
    "reserved-spine-slots",
    "Layout",
    "N5 reserved invisible spine slots for art anchors",
    N5_RESERVED_NODE_SLOTS.length >= 8,
  );

  push(
    "greybox-export",
    "Art",
    "N5 greybox export script",
    existsSync(join(ROOT, "scripts/art-direction/export-n5-greybox.ts")),
  );

  push(
    "landmarks-fallback",
    "Data",
    "8 N5 landmark fallbacks",
    N5_LANDMARK_FALLBACKS.length === 8,
  );

  push(
    "trial-renames",
    "Trials",
    "Legacy trial display map",
    N5_TRIAL_DISPLAY_BY_LEGACY_TITLE["Foothills Guardian"] === "Script Keeper" &&
      N5_TRIAL_DISPLAY_BY_LEGACY_TITLE["Final N5 Trial"] ===
        "Guardian of First Light",
  );

  push(
    "art-pack-constants",
    "Art",
    "Act slices + silhouette + portal registered",
    Boolean(N5_REALM_SILHOUETTE.dark) &&
      Boolean(N5_ACT_SLICE_ART[1].dark) &&
      Boolean(N5_PORTAL_MATTE.dark),
  );

  push(
    "migrations",
    "Data",
    "JWorld + landmarks migrations on disk",
    existsSync(
      join(ROOT, "supabase/migrations/20260622120000_jworld_five_world_regions.sql"),
    ) &&
      existsSync(
        join(ROOT, "supabase/migrations/20260622140000_n5_landmarks_and_trial_copy.sql"),
      ),
  );

  push(
    "launch-check",
    "Validation",
    "Enhanced n5_world launch module",
    existsSync(join(ROOT, "lib/release/n5-world-launch-check.ts")),
  );

  push(
    "world-map-five",
    "Overview",
    "World map builds five realm slugs",
    readFileSync(
      join(ROOT, "features/world-map/services/world-map.service.ts"),
      "utf8",
    ).includes("REGION_SLUGS"),
  );

  push(
    "portal",
    "Portal",
    "N5→N4 portal component",
    existsSync(join(ROOT, "features/worlds/components/n5-portal-transition.tsx")),
  );

  return items;
}

describe("N5 implementation audit (static)", () => {
  const results = auditResults();
  const failures = results.filter((item) => item.status === "fail");

  it(`reports ${results.length} audit items`, () => {
    expect(results.length).toBeGreaterThan(10);
  });

  it("has zero failing static audit items", () => {
    if (failures.length > 0) {
      const report = failures
        .map((item) => `- [${item.id}] ${item.area}: ${item.requirement}`)
        .join("\n");
      expect.fail(`N5 implementation audit failures:\n${report}`);
    }
    expect(failures).toHaveLength(0);
  });
});

export { auditResults };
