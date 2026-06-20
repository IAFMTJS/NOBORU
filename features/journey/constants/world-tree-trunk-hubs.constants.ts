import {
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type { WorldTreeBand } from "@/features/journey/utils/world-tree-layout.utils";

export type TrunkLimbProfile = "root" | "trunk" | "canopy" | "crown" | "cave";

export type TrunkHubPosition = {
  hubKey: string;
  xPercent: number;
  yPercent: number;
  forkSlot: number;
  hubCount: number;
  profile: TrunkLimbProfile;
};

const ZONE_LIMB_PROFILE: Record<WorldTreeZoneId, TrunkLimbProfile> = {
  deep_roots: "root",
  n5_roots: "root",
  n4_foothills: "trunk",
  n3_trunk_1: "trunk",
  n3_trunk_2: "trunk",
  n3_trunk_3: "trunk",
  n2_canopy: "canopy",
  n1_celestial: "crown",
};

/** Hubs per trunk ring / zone band — matches docs/Skeleton world tree.md. */
const HUBS_PER_ZONE: Record<WorldTreeZoneId, number> = {
  deep_roots: 4,
  n5_roots: 3,
  n4_foothills: 5,
  n3_trunk_1: 3,
  n3_trunk_2: 3,
  n3_trunk_3: 3,
  n2_canopy: 3,
  n1_celestial: 3,
};

function ringYForZone(zoneId: WorldTreeZoneId, zoneBands: Record<WorldTreeZoneId, WorldTreeBand>): number {
  const band = zoneBands[zoneId];
  if (!zoneId.startsWith("n3_trunk")) {
    return (band.yMin + band.yMax) / 2;
  }

  // N3 rings: hubs sit on the ring collar (top of each trunk band).
  return band.yMin + (band.yMax - band.yMin) * 0.22;
}

/**
 * Resolves the trunk hub where a curriculum branch buds from the tree.
 * @see docs/Skeleton world tree.md — hub-and-spoke per zone
 */
export function resolveTrunkHubPosition(
  zoneId: WorldTreeZoneId,
  branchIndex: number,
  zoneBands: Record<WorldTreeZoneId, WorldTreeBand>,
): TrunkHubPosition {
  const hubCount = HUBS_PER_ZONE[zoneId];
  const forkSlot = branchIndex % hubCount;
  const trunkCenter = WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent;
  const ringY = ringYForZone(zoneId, zoneBands);

  return {
    hubKey: `hub:${zoneId}:${forkSlot}`,
    xPercent: trunkCenter,
    yPercent: ringY,
    forkSlot,
    hubCount,
    profile: ZONE_LIMB_PROFILE[zoneId],
  };
}

/** Decorative limb stubs at zone ring collars — same geometry as runtime hubs. */
export function listTrunkRingHubStubs(
  zoneBands: Record<WorldTreeZoneId, WorldTreeBand>,
): TrunkHubPosition[] {
  return WORLD_TREE_SKELETON_ZONES.flatMap((zone) => {
    const count = HUBS_PER_ZONE[zone.id];
    return Array.from({ length: count }, (_, forkSlot) =>
      resolveTrunkHubPosition(zone.id, forkSlot, zoneBands),
    );
  });
}
