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

/** Gentle winding x-offset for main spine nodes beside the trunk corridor. */
export function computeWorldTreePathXPercent(globalProgress: number, nodeIndex: number): number {
  const wave = Math.sin(globalProgress * Math.PI * 2.75 + nodeIndex * 0.12) * 11;
  const stagger = (nodeIndex % 2 === 0 ? 1 : -1) * 5;
  return WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + wave + stagger;
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
  if (plotted.length <= 1) return plotted;

  const adjusted = plotted.map((entry) => ({ ...entry }));

  for (let index = 1; index < adjusted.length; index += 1) {
    const previous = adjusted[index - 1]!;
    const current = adjusted[index]!;
    const gap = previous.yPercent - current.yPercent;

    if (gap < WORLD_TREE_NODE_MIN_Y_GAP) {
      current.yPercent = previous.yPercent - WORLD_TREE_NODE_MIN_Y_GAP;
    }
  }

  return adjusted;
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
    zoneId,
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

function distributeYInZone(
  zoneBand: WorldTreeBand,
  indexInZone: number,
  totalInZone: number,
): number {
  if (totalInZone <= 1) return (zoneBand.yMin + zoneBand.yMax) / 2;
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

  for (const entry of entries) {
    const bucket = zoneGroups.get(entry.zoneId) ?? [];
    bucket.push(entry);
    zoneGroups.set(entry.zoneId, bucket);
  }

  const plotted: PlottedSkeletonNode[] = [];
  const forkPoints = new Map<string, { x: number; y: number; nodeId: string }>();

  for (const entry of entries) {
    const zoneEntries = zoneGroups.get(entry.zoneId) ?? [entry];
    const indexInZone = zoneEntries.findIndex((e) => e.node.id === entry.node.id);
    const zoneBand = zoneBands[entry.zoneId] ?? zoneBands[DEFAULT_WORLD_TREE_ZONE]!;
    let yPercent = distributeYInZone(zoneBand, Math.max(0, indexInZone), zoneEntries.length);

    const globalProgress =
      entries.length > 1
        ? entry.node.globalIndex / (entries[entries.length - 1]!.node.globalIndex)
        : 0;

    let xPercent = computeWorldTreePathXPercent(globalProgress, entry.node.globalIndex);
    let forkFromNodeId: string | undefined;

    if (entry.spineRole === "branch" || entry.segmentType !== "main_spine") {
      const mainInZone = zoneEntries.filter((e) => e.spineRole === "main");
      const forkSource = mainInZone[Math.min(mainInZone.length - 1, Math.floor(indexInZone / 3))];
      const forkKey = forkSource?.node.id ?? `${entry.zoneId}-root`;
      const fork = forkPoints.get(forkKey);

      if (fork) {
        xPercent = computeBranchXPercent(fork.x, entry.node.globalIndex, entry.segmentType);
        yPercent = fork.y - (indexInZone % 5) * (WORLD_TREE_NODE_MIN_Y_GAP * 0.35);
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

    if (entry.spineRole === "main" && entry.segmentType === "main_spine") {
      forkPoints.set(entry.node.id, { x: xPercent, y: yPercent, nodeId: entry.node.id });
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
