import {
  DEFAULT_WORLD_TREE_ZONE,
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_MAX_MAIN_SPINE_NODES,
  WORLD_TREE_NODE_MIN_Y_GAP,
  WORLD_TREE_SKELETON_MIN_HEIGHT_VH,
  WORLD_TREE_SKELETON_VH_PER_PERCENT,
  WORLD_TREE_SKELETON_ZONES,
  resolveWorldTreeZoneForNode,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
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
  nodes: PlottedSkeletonNode[];
};

export type WorldTreeLayoutResult = {
  nodes: PlottedSkeletonNode[];
  segments: WorldTreeLayoutSegment[];
  canvasMinHeightVh: number;
};

/** y=100 is the World Heart base — first lesson anchors here, then we climb up. */
export const WORLD_TREE_JOURNEY_BASE_Y = 100;

/** Small top margin so the crown node stays inside the canvas. */
export const WORLD_TREE_JOURNEY_CROWN_Y = 3;

function clampPercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
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

/** Gentle winding x-offset — stays inside the trunk corridor. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 2.75 + nodeIndex * 0.12) * 4;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 2;
  const corridorHalf = WORLD_TREE_MANIFEST_ANCHORS.pathCorridorWidthPercent / 2;
  const raw =
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + wave + stagger;

  return clampPercent(
    raw,
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent - corridorHalf + 2,
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + corridorHalf - 2,
  );
}

function computeBranchXPercent(
  forkX: number,
  branchIndex: number,
  segmentType: BlueprintSegmentType,
): number {
  const direction = branchIndex % 2 === 0 ? -1 : 1;
  const depth = segmentType === "cave" ? 38 : 28;
  return Math.min(92, Math.max(8, forkX + direction * depth));
}

/** Minimum canvas height (vh) so nodes can maintain vertical spacing. */
export function resolveWorldTreeCanvasMinHeightVh(nodeCount: number): number {
  if (nodeCount <= 1) return WORLD_TREE_SKELETON_MIN_HEIGHT_VH;

  const requiredSpanPercent = (nodeCount - 1) * WORLD_TREE_NODE_MIN_Y_GAP + 12;
  const scale = Math.max(1, requiredSpanPercent / 100);
  return Math.ceil(WORLD_TREE_SKELETON_MIN_HEIGHT_VH * scale);
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

function isMainSpineEntry(entry: LayoutEntry): boolean {
  return entry.spineRole === "main" && entry.segmentType === "main_spine";
}

/** Bottom-anchored ascent: global order 0 at base, last node near crown — always within 0–100%. */
function assignGlobalSpineYPositions(entries: LayoutEntry[]): Map<string, number> {
  const spineEntries = entries
    .filter(isMainSpineEntry)
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

function findLatestMainSpineBefore(
  mainSpineByGlobalIndex: { globalIndex: number; x: number; y: number; nodeId: string }[],
  globalIndex: number,
): { x: number; y: number; nodeId: string } | null {
  let latest: { globalIndex: number; x: number; y: number; nodeId: string } | null = null;

  for (const entry of mainSpineByGlobalIndex) {
    if (entry.globalIndex <= globalIndex) {
      latest = entry;
    } else {
      break;
    }
  }

  return latest;
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

/** Plot journey nodes on the skeleton with zone-aware placement, branches, and spacing. */
export function buildWorldTreeLayout(journey: JourneyPathViewModel): WorldTreeLayoutResult {
  const entries = journey.regions.flatMap((region) => {
    const lessonNodes = region.nodes.filter((node) => node.kind !== "landmark");
    let lessonIndex = 0;
    let lastLessonBlueprint: LessonBlueprintMeta | undefined;

    return region.nodes.map((node) => {
      const isLessonLike =
        node.kind === "lesson" || node.kind === "checkpoint" || node.kind === "trial";
      const currentLessonIndex = isLessonLike ? lessonIndex : lessonIndex;
      if (isLessonLike) lessonIndex += 1;
      if (isLessonLike && node.blueprint) {
        lastLessonBlueprint = node.blueprint;
      }

      const meta =
        node.kind === "landmark" && lastLessonBlueprint
          ? {
              ...resolveLayoutMetaFromBlueprint(
                lastLessonBlueprint,
                region.slug,
                currentLessonIndex,
                lessonNodes.length,
              ),
              spineRole: "main" as const,
              segmentType: "main_spine" as const,
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
    return { nodes: [], segments: [], canvasMinHeightVh: WORLD_TREE_SKELETON_MIN_HEIGHT_VH };
  }

  const zoneBands = buildWorldTreeZoneBands();
  const zoneGroups = new Map<WorldTreeZoneId, LayoutEntry[]>();
  const globalSpineY = assignGlobalSpineYPositions(entries);

  for (const entry of entries) {
    const bucket = zoneGroups.get(entry.zoneId) ?? [];
    bucket.push(entry);
    zoneGroups.set(entry.zoneId, bucket);
  }

  const plotted: PlottedSkeletonNode[] = [];
  const mainSpineTrail: { globalIndex: number; x: number; y: number; nodeId: string }[] = [];
  const branchCounts = new Map<string, number>();

  for (const entry of entries) {
    const zoneEntries = zoneGroups.get(entry.zoneId) ?? [entry];
    const indexInZone = zoneEntries.findIndex((e) => e.node.id === entry.node.id);
    const zoneBand = zoneBands[entry.zoneId] ?? zoneBands[DEFAULT_WORLD_TREE_ZONE]!;
    const onMainSpine = isMainSpineEntry(entry);

    let yPercent =
      globalSpineY.get(entry.node.id) ??
      distributeYInZone(zoneBand, Math.max(0, indexInZone), zoneEntries.length);

    const globalProgress =
      entries.length > 1
        ? entry.node.globalIndex / (entries[entries.length - 1]!.node.globalIndex)
        : 0;

    let xPercent = computeWorldTreePathXPercent(globalProgress, entry.node.globalIndex);
    let forkFromNodeId: string | undefined;

    if (!onMainSpine) {
      const fork = findLatestMainSpineBefore(mainSpineTrail, entry.node.globalIndex);
      const branchKey = `${entry.branchId}-${fork?.nodeId ?? entry.zoneId}`;
      const branchIndex = branchCounts.get(branchKey) ?? 0;
      branchCounts.set(branchKey, branchIndex + 1);

      if (fork) {
        xPercent = computeBranchXPercent(fork.x, branchIndex, entry.segmentType);
        yPercent = fork.y - (branchIndex + 1) * (WORLD_TREE_NODE_MIN_Y_GAP * 0.25);
        forkFromNodeId = fork.nodeId;
      }
    }

    const plottedNode: PlottedSkeletonNode = {
      node: entry.node,
      regionSlug: entry.regionSlug,
      zoneId: entry.zoneId,
      xPercent,
      yPercent,
      spineRole: entry.spineRole,
      segmentType: entry.segmentType,
      branchId: entry.branchId,
      caveGroup: entry.caveGroup,
      forkFromNodeId,
    };

    if (onMainSpine) {
      mainSpineTrail.push({
        globalIndex: entry.node.globalIndex,
        x: xPercent,
        y: yPercent,
        nodeId: entry.node.id,
      });
    }

    plotted.push(plottedNode);
  }

  const spaced = enforceMinimumNodeSpacing(plotted);

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
    segments.push({
      segmentId: segmentKey,
      zoneId: first.zoneId,
      type: first.segmentType,
      forkFromNodeId: first.forkFromNodeId,
      nodes: nodes.sort((a, b) => b.yPercent - a.yPercent),
    });
  }

  return {
    nodes: spaced,
    segments,
    canvasMinHeightVh: resolveWorldTreeCanvasMinHeightVh(spaced.length),
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
