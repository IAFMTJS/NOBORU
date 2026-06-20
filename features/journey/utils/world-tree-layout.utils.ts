import {
  DEFAULT_WORLD_TREE_ZONE,
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_MAX_MAIN_SPINE_NODES,
  WORLD_TREE_MIN_NODE_GAP_VH,
  WORLD_TREE_SKELETON_MIN_HEIGHT_VH,
  WORLD_TREE_SKELETON_VH_PER_PERCENT,
  WORLD_TREE_SKELETON_ZONES,
  resolveWorldTreeZoneForNode,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  resolveTrunkHubPosition,
  type TrunkLimbProfile,
} from "@/features/journey/constants/world-tree-trunk-hubs.constants";
import { resolveBlueprintSlot } from "@/features/journey/data/world-tree-curriculum-blueprint";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import type { LessonBlueprintMeta } from "@/features/learning/types/lesson.types";

export type WorldTreeBand = {
  yMin: number;
  yMax: number;
};

export type BlueprintSegmentType = "main_spine" | "branch" | "cave";

export type PlottedSkeletonNode = {
  node: JourneyNode;
  regionSlug: string;
  zoneId: WorldTreeZoneId;
  xPercent: number;
  yPercent: number;
  spineRole: "main" | "branch";
  segmentType: BlueprintSegmentType;
  branchId: string;
  caveGroup?: string;
  forkFromNodeId?: string;
};

export type WorldTreeLayoutSegment = {
  segmentId: string;
  zoneId: WorldTreeZoneId;
  type: BlueprintSegmentType;
  forkFromNodeId?: string;
  forkPoint?: { xPercent: number; yPercent: number };
  nodes: PlottedSkeletonNode[];
};

export type WorldTreeLayoutResult = {
  nodes: PlottedSkeletonNode[];
  segments: WorldTreeLayoutSegment[];
  canvasMinHeightVh: number;
  hubPositions: Record<string, { xPercent: number; yPercent: number }>;
};

/** Visible y-percent band for viewport culling (0 = crown, 100 = base). */
export type WorldTreeVisibleYBand = {
  min: number;
  max: number;
};

/** y=100 is the World Heart base — first lesson anchors here, then we climb up. */
export const WORLD_TREE_JOURNEY_BASE_Y = 100;

/** Small top margin so the crown node stays inside the canvas. */
export const WORLD_TREE_JOURNEY_CROWN_Y = 3;

/** Minimum horizontal separation when nodes share a similar height band. */
const WORLD_TREE_MIN_NODE_X_GAP_PERCENT = 5;

function clampPercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveMinYGapPercent(nodeCount: number): number {
  const canvasVh = resolveWorldTreeCanvasMinHeightVh(nodeCount);
  return (WORLD_TREE_MIN_NODE_GAP_VH / canvasVh) * 100;
}

function isMainSpineLessonEntry(entry: LayoutEntry): boolean {
  return (
    entry.node.kind !== "landmark" &&
    (entry.node.kind === "checkpoint" || entry.node.kind === "trial")
  );
}

function isBranchPlacedEntry(entry: LayoutEntry): boolean {
  return entry.node.kind !== "landmark" && !isMainSpineLessonEntry(entry);
}

function isMainSpineLessonNode(entry: PlottedSkeletonNode): boolean {
  return (
    entry.node.kind !== "landmark" &&
    entry.spineRole === "main"
  );
}

/** Cumulative y bands per zone — y=100 is base, y=0 is crown. */
export function buildWorldTreeZoneBands(): Record<WorldTreeZoneId, WorldTreeBand> {
  let cursor = 100;
  const bands = {} as Record<WorldTreeZoneId, WorldTreeBand>;

  for (const zone of WORLD_TREE_SKELETON_ZONES) {
    const yMax = cursor;
    const yMin = cursor - zone.heightPercent;
    bands[zone.id] = { yMin, yMax };
    cursor = yMin;
  }

  return bands;
}

/** Full vertical span reserved for the skeleton ascent (roots base → crown). */
export function buildSkeletonAscentBand(): WorldTreeBand {
  return { yMin: 0, yMax: 100 };
}

/** Trunk ascent — stays inside the corridor with a subtle natural sway. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 1.35 + nodeIndex * 0.08) * 1.4;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 0.75;
  const corridorHalf = WORLD_TREE_MANIFEST_ANCHORS.pathCorridorWidthPercent / 2;
  const raw =
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + wave + stagger;

  return clampPercent(
    raw,
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent - corridorHalf + 2,
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + corridorHalf - 2,
  );
}

type TreeLimbPosition = {
  xPercent: number;
  yPercent: number;
};

/** Place branch nodes along a limb that buds from a trunk ring hub. */
function computeTreeLimbPosition(
  hubX: number,
  hubY: number,
  forkSlot: number,
  branchIndex: number,
  hubCount: number,
  depth: number,
  segmentType: BlueprintSegmentType,
  limbStepPercent: number,
  profile: TrunkLimbProfile,
): TreeLimbPosition {
  const trunkCenter = WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent;
  const side = branchIndex % 2 === 0 ? -1 : 1;
  const tier = Math.floor(branchIndex / 2);
  const hubRing = Math.floor(branchIndex / Math.max(hubCount, 1));
  const isCave = segmentType === "cave" || profile === "root";

  const reach = (depth + 1) * limbStepPercent;
  const spreadGain =
    profile === "canopy" ? 1.25 : profile === "crown" ? 1.05 : isCave ? 1.1 : 0.88;
  const riseGain =
    profile === "canopy"
      ? 0.38
      : profile === "crown"
        ? 0.72
        : profile === "root" || isCave
          ? -0.48
          : 0.56;
  const baseSpread =
    profile === "canopy" ? 8 + tier * 3 : profile === "crown" ? 6 + tier * 2.5 : 3 + tier * 2.5;
  const hubCollisionSpread = hubRing * 5.5 + forkSlot * 0.35;

  const targetX = trunkCenter + side * (baseSpread + hubCollisionSpread + reach * spreadGain);
  const targetY = hubY - reach * riseGain - hubRing * 0.35 - depth * 0.42;

  if (depth === 0) {
    const budBlend = isCave ? 0.28 : 0.18;
    return {
      xPercent: clampPercent(hubX * (1 - budBlend) + targetX * budBlend, 12, 88),
      yPercent: clampPercent(
        hubY - limbStepPercent * (isCave ? 0.24 : 0.28),
        WORLD_TREE_JOURNEY_CROWN_Y,
        WORLD_TREE_JOURNEY_BASE_Y,
      ),
    };
  }

  return {
    xPercent: clampPercent(targetX, 12, 88),
    yPercent: clampPercent(targetY, WORLD_TREE_JOURNEY_CROWN_Y, WORLD_TREE_JOURNEY_BASE_Y),
  };
}

function resolveBranchIndex(entry: LayoutEntry): number {
  if (entry.node.blueprint?.branchIndex != null) {
    return entry.node.blueprint.branchIndex;
  }

  const match = entry.branchId.match(/-branch-(\d+)$/);
  return match ? Number.parseInt(match[1]!, 10) : 0;
}

function buildBranchDepthIndex(entries: LayoutEntry[]): Map<string, number> {
  const depthByNodeId = new Map<string, number>();
  const counters = new Map<string, number>();

  for (const entry of entries.filter(isBranchPlacedEntry)) {
    const key = `${entry.zoneId}:${entry.branchId}`;
    const depth = counters.get(key) ?? 0;
    counters.set(key, depth + 1);
    depthByNodeId.set(entry.node.id, depth);
  }

  return depthByNodeId;
}

/** Canvas height (vh) for normalized Y layout — scales for tap spacing, not legacy y-gap %. */
export function resolveWorldTreeCanvasMinHeightVh(nodeCount: number): number {
  if (nodeCount <= 1) return WORLD_TREE_SKELETON_MIN_HEIGHT_VH;

  const ascentSpanVh = (nodeCount - 1) * WORLD_TREE_MIN_NODE_GAP_VH + 12;
  return Math.ceil(Math.max(WORLD_TREE_SKELETON_MIN_HEIGHT_VH, ascentSpanVh));
}

function enforceMinimumNodeSpacing(plotted: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  return plotted.map((entry) => ({
    ...entry,
    xPercent: clampPercent(entry.xPercent, 12, 88),
    yPercent: clampPercent(
      entry.yPercent,
      WORLD_TREE_JOURNEY_CROWN_Y,
      WORLD_TREE_JOURNEY_BASE_Y,
    ),
  }));
}

type LayoutEntry = {
  node: JourneyNode;
  regionSlug: string;
  zoneId: WorldTreeZoneId;
  spineRole: "main" | "branch";
  segmentType: BlueprintSegmentType;
  branchId: string;
  caveGroup?: string;
  lessonIndexInRegion: number;
};

function resolveLayoutMetaFromBlueprint(
  blueprint: LessonBlueprintMeta,
  regionSlug: string,
  lessonIndexInRegion: number,
  totalNodesInRegion: number,
): Omit<LayoutEntry, "node" | "regionSlug" | "lessonIndexInRegion"> {
  const zoneId =
    regionSlug === "mount-n3"
      ? resolveWorldTreeZoneForNode(
          regionSlug,
          lessonIndexInRegion,
          totalNodesInRegion,
          blueprint.branchIndex,
        )
      : blueprint.zoneId;

  return {
    zoneId: zoneId as WorldTreeZoneId,
    spineRole: blueprint.spineRole,
    segmentType: blueprint.segmentType,
    branchId: blueprint.branchId,
    caveGroup: blueprint.caveGroup,
  };
}

function resolveLayoutMeta(
  node: JourneyNode,
  regionSlug: string,
  lessonIndexInRegion: number,
  totalNodesInRegion: number,
): Omit<LayoutEntry, "node" | "regionSlug" | "lessonIndexInRegion"> {
  if (node.blueprint) {
    return resolveLayoutMetaFromBlueprint(
      node.blueprint,
      regionSlug,
      lessonIndexInRegion,
      totalNodesInRegion,
    );
  }

  const blueprint = resolveBlueprintSlot(regionSlug, lessonIndexInRegion);

  const zoneId = resolveWorldTreeZoneForNode(
    regionSlug,
    lessonIndexInRegion,
    totalNodesInRegion,
  );

  if (blueprint) {
    const zoneId =
      regionSlug === "mount-n3"
        ? resolveWorldTreeZoneForNode(
            regionSlug,
            lessonIndexInRegion,
            totalNodesInRegion,
            blueprint.branchIndex,
          )
        : blueprint.zoneId;

    return {
      zoneId,
      spineRole: blueprint.spineRole,
      segmentType: blueprint.segmentType,
      branchId: blueprint.branchId,
      caveGroup: blueprint.caveGroup,
    };
  }

  const overflowToCave =
    lessonIndexInRegion > 0 &&
    lessonIndexInRegion % WORLD_TREE_MAX_MAIN_SPINE_NODES === 0;

  return {
    zoneId,
    spineRole: overflowToCave ? "branch" : "main",
    segmentType: overflowToCave ? "cave" : "main_spine",
    branchId: `${regionSlug}-main`,
    caveGroup: overflowToCave ? `${regionSlug}-overflow-cave` : undefined,
  };
}

function assignGlobalSpineYPositions(entries: LayoutEntry[]): Map<string, number> {
  const spineEntries = entries
    .filter(isMainSpineLessonEntry)
    .sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  const yByNodeId = new Map<string, number>();
  const count = spineEntries.length;

  if (count === 0) return yByNodeId;

  if (count === 1) {
    yByNodeId.set(spineEntries[0]!.node.id, WORLD_TREE_JOURNEY_BASE_Y);
    return yByNodeId;
  }

  const span = WORLD_TREE_JOURNEY_BASE_Y - WORLD_TREE_JOURNEY_CROWN_Y;

  for (let rank = 0; rank < count; rank += 1) {
    const progress = rank / (count - 1);
    yByNodeId.set(
      spineEntries[rank]!.node.id,
      WORLD_TREE_JOURNEY_BASE_Y - progress * span,
    );
  }

  return yByNodeId;
}

function distributeYInZone(
  zoneBand: WorldTreeBand,
  indexInZone: number,
  totalInZone: number,
): number {
  if (totalInZone <= 1) return zoneBand.yMax;
  const progress = indexInZone / (totalInZone - 1);
  return zoneBand.yMax - progress * (zoneBand.yMax - zoneBand.yMin);
}

function attachLandmarkSpurs(plotted: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  return plotted.map((entry) => {
    if (entry.node.kind !== "landmark") return entry;

    const anchor = plotted
      .filter(
        (candidate) =>
          candidate.node.kind !== "landmark" &&
          candidate.node.globalIndex < entry.node.globalIndex,
      )
      .sort((a, b) => b.node.globalIndex - a.node.globalIndex)[0];

    if (!anchor) return entry;

    const side = entry.node.globalIndex % 2 === 0 ? 1 : -1;

    return {
      ...entry,
      spineRole: "branch",
      segmentType: "branch",
      branchId: `landmark-spur-${entry.node.id}`,
      xPercent: clampPercent(anchor.xPercent + side * 18, 10, 90),
      yPercent: clampPercent(
        anchor.yPercent - 0.6,
        WORLD_TREE_JOURNEY_CROWN_Y,
        WORLD_TREE_JOURNEY_BASE_Y,
      ),
      forkFromNodeId: anchor.node.id,
    };
  });
}

function separateNearbyNodes(
  plotted: PlottedSkeletonNode[],
  minYGapPercent: number,
): PlottedSkeletonNode[] {
  const result = plotted.map((entry) => ({ ...entry }));

  for (let iteration = 0; iteration < 6; iteration += 1) {
    let moved = false;

    for (let left = 0; left < result.length; left += 1) {
      for (let right = left + 1; right < result.length; right += 1) {
        const a = result[left]!;
        const b = result[right]!;
        if (isMainSpineLessonNode(a) && isMainSpineLessonNode(b)) {
          continue;
        }

        const dy = Math.abs(a.yPercent - b.yPercent);
        const dx = Math.abs(a.xPercent - b.xPercent);

        if (dy >= minYGapPercent * 0.9 || dx >= WORLD_TREE_MIN_NODE_X_GAP_PERCENT * 2) {
          continue;
        }

        const pushY = (minYGapPercent - dy) + 0.08;
        const pushX =
          dx < WORLD_TREE_MIN_NODE_X_GAP_PERCENT
            ? (WORLD_TREE_MIN_NODE_X_GAP_PERCENT - dx) + 0.5
            : 0;

        const nudgeY = (target: PlottedSkeletonNode, delta: number) => {
          target.yPercent = clampPercent(
            target.yPercent + delta,
            WORLD_TREE_JOURNEY_CROWN_Y,
            WORLD_TREE_JOURNEY_BASE_Y,
          );
        };

        const nudgeX = (target: PlottedSkeletonNode, delta: number) => {
          target.xPercent = clampPercent(target.xPercent + delta, 12, 88);
        };

        if (isMainSpineLessonNode(a)) {
          nudgeY(b, b.yPercent < a.yPercent ? -pushY : pushY);
          if (pushX > 0) {
            nudgeX(b, b.node.globalIndex % 2 === 0 ? pushX : -pushX);
          }
          moved = true;
          continue;
        }

        if (isMainSpineLessonNode(b)) {
          nudgeY(a, a.yPercent < b.yPercent ? -pushY : pushY);
          if (pushX > 0) {
            nudgeX(a, a.node.globalIndex % 2 === 0 ? pushX : -pushX);
          }
          moved = true;
          continue;
        }

        const halfPushY = pushY / 2;
        if (a.yPercent >= b.yPercent) {
          nudgeY(a, halfPushY);
          nudgeY(b, -halfPushY);
        } else {
          nudgeY(a, -halfPushY);
          nudgeY(b, halfPushY);
        }

        if (pushX > 0) {
          nudgeX(a, a.node.globalIndex % 2 === 0 ? pushX / 2 : -pushX / 2);
          nudgeX(b, b.node.globalIndex % 2 === 0 ? -pushX / 2 : pushX / 2);
        }

        moved = true;
      }
    }

    if (!moved) break;
  }

  return result;
}

function stabilizeBranchLimbs(plotted: PlottedSkeletonNode[]): PlottedSkeletonNode[] {
  const trunkCenter = WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent;
  const result = plotted.map((entry) => ({ ...entry }));
  const branchGroups = new Map<string, PlottedSkeletonNode[]>();

  for (const node of result) {
    if (isMainSpineLessonNode(node)) continue;
    const bucket = branchGroups.get(node.branchId) ?? [];
    bucket.push(node);
    branchGroups.set(node.branchId, bucket);
  }

  for (const branchNodes of branchGroups.values()) {
    const ordered = [...branchNodes].sort((a, b) => a.node.globalIndex - b.node.globalIndex);
    let minSpread = 0;

    for (const node of ordered) {
      const side = node.xPercent >= trunkCenter ? 1 : node.xPercent < trunkCenter ? -1 : 1;
      const spread = Math.abs(node.xPercent - trunkCenter);
      const nextSpread = Math.max(spread, minSpread + 2.2);

      node.xPercent = clampPercent(trunkCenter + side * nextSpread, 12, 88);
      minSpread = Math.abs(node.xPercent - trunkCenter);
    }
  }

  return result;
}

function enforceUniqueCoordinates(
  plotted: PlottedSkeletonNode[],
): PlottedSkeletonNode[] {
  const result = plotted.map((entry) => ({ ...entry }));
  const seen = new Set<string>();

  for (const node of [...result].sort((a, b) => a.node.globalIndex - b.node.globalIndex)) {
    let key = `${node.xPercent.toFixed(1)}:${node.yPercent.toFixed(1)}`;
    let attempt = 0;

    while (seen.has(key) && attempt < 24) {
      if (!isMainSpineLessonNode(node)) {
        const direction = attempt % 2 === 0 ? 1 : -1;
        node.xPercent = clampPercent(node.xPercent + direction * (attempt + 1) * 0.9, 12, 88);
        node.yPercent = clampPercent(
          node.yPercent - 0.35,
          WORLD_TREE_JOURNEY_CROWN_Y,
          WORLD_TREE_JOURNEY_BASE_Y,
        );
      }

      key = `${node.xPercent.toFixed(1)}:${node.yPercent.toFixed(1)}`;
      attempt += 1;
    }

    seen.add(key);
  }

  return result;
}

/** Plot journey nodes on the skeleton with zone-aware placement, branches, and spacing. */
export function buildWorldTreeLayout(journey: JourneyPathViewModel): WorldTreeLayoutResult {
  const entries = journey.regions.flatMap((region) => {
    const lessonNodes = region.nodes.filter((node) => node.kind !== "landmark");
    let lessonIndex = 0;

    return region.nodes.map((node) => {
      const isLessonLike =
        node.kind === "lesson" || node.kind === "checkpoint" || node.kind === "trial";
      const currentLessonIndex = isLessonLike ? lessonIndex : lessonIndex;
      if (isLessonLike) lessonIndex += 1;

      const meta =
        node.kind === "landmark"
          ? {
              zoneId: resolveWorldTreeZoneForNode(
                region.slug,
                currentLessonIndex,
                lessonNodes.length,
              ),
              spineRole: "branch" as const,
              segmentType: "branch" as const,
              branchId: `landmark-spur-${node.id}`,
            }
          : resolveLayoutMeta(
              node,
              region.slug,
              isLessonLike ? currentLessonIndex : lessonIndex,
              lessonNodes.length,
            );

      return {
        node,
        regionSlug: region.slug,
        lessonIndexInRegion: currentLessonIndex,
        ...meta,
      } satisfies LayoutEntry;
    });
  }).sort((a, b) => a.node.globalIndex - b.node.globalIndex);

  if (entries.length === 0) {
    return {
      nodes: [],
      segments: [],
      canvasMinHeightVh: WORLD_TREE_SKELETON_MIN_HEIGHT_VH,
      hubPositions: {},
    };
  }

  const zoneBands = buildWorldTreeZoneBands();
  const zoneGroups = new Map<WorldTreeZoneId, LayoutEntry[]>();
  const globalSpineY = assignGlobalSpineYPositions(entries);
  const branchDepthByNodeId = buildBranchDepthIndex(entries);
  const hubPositions: Record<string, { xPercent: number; yPercent: number }> = {};

  for (const entry of entries) {
    const bucket = zoneGroups.get(entry.zoneId) ?? [];
    bucket.push(entry);
    zoneGroups.set(entry.zoneId, bucket);
  }

  const plotted: PlottedSkeletonNode[] = [];
  const minBranchYGapPercent = resolveMinYGapPercent(entries.length) * 0.9;

  for (const entry of entries) {
    const zoneEntries = zoneGroups.get(entry.zoneId) ?? [entry];
    const indexInZone = zoneEntries.findIndex((e) => e.node.id === entry.node.id);
    const zoneBand = zoneBands[entry.zoneId] ?? zoneBands[DEFAULT_WORLD_TREE_ZONE]!;
    const onTrunkSpine = isMainSpineLessonEntry(entry);

    let yPercent =
      globalSpineY.get(entry.node.id) ??
      distributeYInZone(zoneBand, Math.max(0, indexInZone), zoneEntries.length);

    const globalProgress =
      entries.length > 1
        ? entry.node.globalIndex / (entries[entries.length - 1]!.node.globalIndex)
        : 0;

    let xPercent = computeWorldTreePathXPercent(globalProgress, entry.node.globalIndex);
    let forkFromNodeId: string | undefined;

    if (isBranchPlacedEntry(entry)) {
      const branchIndex = resolveBranchIndex(entry);
      const hub = resolveTrunkHubPosition(entry.zoneId, branchIndex, zoneBands);
      hubPositions[hub.hubKey] = { xPercent: hub.xPercent, yPercent: hub.yPercent };

      const depth = branchDepthByNodeId.get(entry.node.id) ?? 0;
      const limb = computeTreeLimbPosition(
        hub.xPercent,
        hub.yPercent,
        hub.forkSlot,
        branchIndex,
        hub.hubCount,
        depth,
        entry.segmentType,
        minBranchYGapPercent,
        hub.profile,
      );

      xPercent = limb.xPercent;
      yPercent = limb.yPercent;
      forkFromNodeId = hub.hubKey;
    }

    plotted.push({
      node: entry.node,
      regionSlug: entry.regionSlug,
      zoneId: entry.zoneId,
      xPercent,
      yPercent,
      spineRole: onTrunkSpine ? "main" : "branch",
      segmentType: entry.segmentType,
      branchId: entry.branchId,
      caveGroup: entry.caveGroup,
      forkFromNodeId,
    });
  }

  const canvasMinHeightVh = resolveWorldTreeCanvasMinHeightVh(plotted.length);
  const minYGapPercent = (WORLD_TREE_MIN_NODE_GAP_VH / canvasMinHeightVh) * 100;
  const spaced = enforceUniqueCoordinates(
    stabilizeBranchLimbs(
      separateNearbyNodes(
        enforceMinimumNodeSpacing(attachLandmarkSpurs(plotted)),
        minYGapPercent,
      ),
    ),
  );

  const segments: WorldTreeLayoutSegment[] = [];
  const segmentMap = new Map<string, PlottedSkeletonNode[]>();

  for (const node of spaced) {
    const segmentKey = `${node.zoneId}-${node.segmentType}-${node.branchId}`;
    const bucket = segmentMap.get(segmentKey) ?? [];
    bucket.push(node);
    segmentMap.set(segmentKey, bucket);
  }

  for (const [segmentKey, nodes] of segmentMap.entries()) {
    const first = nodes[0]!;
    const forkPoint =
      first.forkFromNodeId?.startsWith("hub:")
        ? hubPositions[first.forkFromNodeId]
        : undefined;

    segments.push({
      segmentId: segmentKey,
      zoneId: first.zoneId,
      type: first.segmentType,
      forkFromNodeId: first.forkFromNodeId,
      forkPoint,
      nodes: nodes.sort((a, b) => b.yPercent - a.yPercent),
    });
  }

  return {
    nodes: spaced,
    segments,
    canvasMinHeightVh,
    hubPositions,
  };
}

/** @deprecated Use buildWorldTreeLayout — kept for gradual migration. */
export function plotJourneyNodesOnSkeleton(
  journey: JourneyPathViewModel,
): PlottedSkeletonNode[] {
  return buildWorldTreeLayout(journey).nodes;
}

export function findPlottedNode(
  plotted: PlottedSkeletonNode[],
  nodeId: string | null,
): PlottedSkeletonNode | null {
  if (!nodeId) return null;
  return plotted.find((entry) => entry.node.id === nodeId) ?? null;
}

export function countJourneyNodes(journey: JourneyPathViewModel): number {
  return journey.regions.reduce((sum, region) => sum + region.nodes.length, 0);
}

export function findZoneBandCenterY(zoneId: WorldTreeZoneId): number {
  const bands = buildWorldTreeZoneBands();
  const band = bands[zoneId];
  return (band.yMin + band.yMax) / 2;
}

/** @internal test helper */
export { WORLD_TREE_SKELETON_VH_PER_PERCENT };
