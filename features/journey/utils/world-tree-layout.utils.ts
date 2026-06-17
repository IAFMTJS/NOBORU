import {
  DEFAULT_WORLD_TREE_ZONE,
  REGION_SLUG_TO_WORLD_TREE_ZONE,
  WORLD_TREE_MANIFEST_ANCHORS,
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import { computeJourneyPathCoordinates } from "@/lib/design-system/journey-path-contracts";
import type { RegionSlug } from "@/lib/design-system/regions";
import {
  JOURNEY_WORLD_TREE_TILE_STACK,
  WORLD_TREE_SEAM_OVERLAP_PERCENT,
  WORLD_TREE_TILE_BASES,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";

export type WorldTreeBand = {
  yMin: number;
  yMax: number;
};

export type PlottedSkeletonNode = {
  node: JourneyNode;
  regionSlug: string;
  xPercent: number;
  yPercent: number;
};

function resolveZoneId(regionSlug: string): WorldTreeZoneId {
  return (
    REGION_SLUG_TO_WORLD_TREE_ZONE[regionSlug as RegionSlug] ??
    DEFAULT_WORLD_TREE_ZONE
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

const SEGMENT_ID_BY_TILE_BASE = Object.fromEntries(
  Object.entries(WORLD_TREE_TILE_BASES).map(([segmentId, base]) => [base, segmentId]),
) as Record<WorldTreeTileBase, string>;

function segmentIdFromTileBase(base: WorldTreeTileBase): string {
  return SEGMENT_ID_BY_TILE_BASE[base] ?? base.split("/").slice(-2, -1)[0] ?? base;
}

/** Per-segment vertical bands on the stacked tile canvas (y=100 base, y=0 crown). */
export function buildWorldTreeTileBands(
  stack: readonly WorldTreeTileBase[] = JOURNEY_WORLD_TREE_TILE_STACK,
  overlapPercent = WORLD_TREE_SEAM_OVERLAP_PERCENT,
): Map<string, WorldTreeBand> {
  const tileCount = stack.length;
  if (tileCount === 0) return new Map();

  const step = 1 - overlapPercent / 100;
  const totalHeight = 1 + (tileCount - 1) * step;
  const bands = new Map<string, WorldTreeBand>();

  stack.forEach((base, index) => {
    const top = index * step;
    const bottom = top + 1;
    bands.set(segmentIdFromTileBase(base), {
      yMin: 100 - (bottom / totalHeight) * 100,
      yMax: 100 - (top / totalHeight) * 100,
    });
  });

  return bands;
}

/** Aggregate tile bands per skeleton zone for regions that have produced art. */
export function buildZoneTileBands(
  stack: readonly WorldTreeTileBase[] = JOURNEY_WORLD_TREE_TILE_STACK,
): Partial<Record<WorldTreeZoneId, WorldTreeBand>> {
  const tileBands = buildWorldTreeTileBands(stack);
  const zoneBands: Partial<Record<WorldTreeZoneId, WorldTreeBand>> = {};

  for (const zone of WORLD_TREE_SKELETON_ZONES) {
    const segmentIds = zone.artSegmentIds ?? [];
    const present = segmentIds.filter((id) => tileBands.has(id));
    if (present.length === 0) continue;

    zoneBands[zone.id] = {
      yMin: Math.min(...present.map((id) => tileBands.get(id)!.yMin)),
      yMax: Math.max(...present.map((id) => tileBands.get(id)!.yMax)),
    };
  }

  return zoneBands;
}

function mergeZoneBandsForPlotting(): Record<WorldTreeZoneId, WorldTreeBand> {
  const skeletonBands = buildWorldTreeZoneBands();
  const tileBands = buildZoneTileBands();
  return { ...skeletonBands, ...tileBands };
}

function assignRegionBands(
  regions: JourneyRegionViewModel[],
  zoneBands: Record<WorldTreeZoneId, WorldTreeBand>,
): Map<string, WorldTreeBand> {
  const regionsByZone = new Map<WorldTreeZoneId, JourneyRegionViewModel[]>();

  for (const region of regions) {
    const zoneId = resolveZoneId(region.slug);
    const bucket = regionsByZone.get(zoneId) ?? [];
    bucket.push(region);
    regionsByZone.set(zoneId, bucket);
  }

  const regionBands = new Map<string, WorldTreeBand>();

  for (const [zoneId, zoneRegions] of regionsByZone) {
    const zoneBand = zoneBands[zoneId];
    if (!zoneBand || zoneRegions.length === 0) continue;

    const sliceHeight = (zoneBand.yMax - zoneBand.yMin) / zoneRegions.length;
    zoneRegions.forEach((region, index) => {
      const yMax = zoneBand.yMax - index * sliceHeight;
      regionBands.set(region.slug, {
        yMin: yMax - sliceHeight,
        yMax,
      });
    });
  }

  return regionBands;
}

function plotNodeInRegionBand(
  node: JourneyNode,
  region: JourneyRegionViewModel,
  band: WorldTreeBand,
  theme?: string,
): PlottedSkeletonNode {
  const pathPoint = computeJourneyPathCoordinates(node.pathPosition, region.slug, {
    theme,
  });

  const ySpan = band.yMax - band.yMin;
  const yPercent = band.yMax - node.pathPosition * ySpan;

  const corridorHalf = WORLD_TREE_MANIFEST_ANCHORS.pathCorridorWidthPercent / 2;
  const xPercent = Math.min(
    WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + corridorHalf,
    Math.max(
      WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent - corridorHalf,
      pathPoint.x,
    ),
  );

  return {
    node,
    regionSlug: region.slug,
    xPercent,
    yPercent,
  };
}

/** Plot all journey nodes on the World Tree trunk corridor, aligned to the tile stack when art exists. */
export function plotJourneyNodesOnSkeleton(
  journey: JourneyPathViewModel,
  options?: { theme?: string },
): PlottedSkeletonNode[] {
  const activeRegions = journey.regions.filter((region) => region.nodes.length > 0);
  const regionBands = assignRegionBands(activeRegions, mergeZoneBandsForPlotting());
  const plotted: PlottedSkeletonNode[] = [];

  for (const region of activeRegions) {
    const band = regionBands.get(region.slug);
    if (!band) continue;

    for (const node of region.nodes) {
      plotted.push(plotNodeInRegionBand(node, region, band, options?.theme));
    }
  }

  return plotted.sort((a, b) => a.node.globalIndex - b.node.globalIndex);
}

export function findPlottedNode(
  plotted: PlottedSkeletonNode[],
  nodeId: string | null,
): PlottedSkeletonNode | null {
  if (!nodeId) return null;
  return plotted.find((entry) => entry.node.id === nodeId) ?? null;
}
