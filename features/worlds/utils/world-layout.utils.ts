import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  buildWorldTreeLayout,
  buildWorldTreeZoneBands,
  findPlottedNode,
  type WorldTreeLayoutResult,
  type PlottedSkeletonNode,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import type { JlptLevel } from "@/lib/content/types";
import {
  resolveN4PortalYPercent,
  tuneN4WorldLayout,
} from "@/features/worlds/worlds/n4/n4-world-layout.utils";
import {
  resolveN5PortalYPercent,
  tuneN5WorldLayout,
} from "@/features/worlds/worlds/n5/n5-world-layout.utils";

function resolveWorldYBounds(
  zoneIds: readonly WorldTreeZoneId[],
): { yMin: number; yMax: number } {
  const bands = buildWorldTreeZoneBands();
  const mins = zoneIds.map((zoneId) => bands[zoneId].yMin);
  const maxs = zoneIds.map((zoneId) => bands[zoneId].yMax);

  return {
    yMin: Math.min(...mins),
    yMax: Math.max(...maxs),
  };
}

function remapNodeToWorldCanvas(
  node: PlottedSkeletonNode,
  yMin: number,
  yMax: number,
): PlottedSkeletonNode {
  const span = yMax - yMin;
  if (span <= 0) return node;

  const localY = ((node.yPercent - yMin) / span) * 100;

  return {
    ...node,
    yPercent: localY,
  };
}

function remapHubPositions(
  hubPositions: Record<string, { xPercent: number; yPercent: number }>,
  yMin: number,
  yMax: number,
): Record<string, { xPercent: number; yPercent: number }> {
  const span = yMax - yMin;
  if (span <= 0) return hubPositions;

  return Object.fromEntries(
    Object.entries(hubPositions).map(([key, point]) => [
      key,
      {
        xPercent: point.xPercent,
        yPercent: ((point.yPercent - yMin) / span) * 100,
      },
    ]),
  );
}

/**
 * Builds a layout scoped to one JLPT world — remaps global skeleton Y to local 0–100.
 */
export function buildWorldLayout(
  worldPath: JlptWorldPathViewModel,
): WorldTreeLayoutResult {
  const layout = buildWorldTreeLayout(worldPath.journey);
  const { yMin, yMax } = resolveWorldYBounds(worldPath.world.skeletonZoneIds);

  const remappedNodes = layout.nodes.map((node) =>
    remapNodeToWorldCanvas(node, yMin, yMax),
  );

  const remappedSegments = layout.segments.map((segment) => ({
    ...segment,
    forkPoint: segment.forkPoint
      ? {
          xPercent: segment.forkPoint.xPercent,
          yPercent: ((segment.forkPoint.yPercent - yMin) / (yMax - yMin)) * 100,
        }
      : undefined,
    nodes: segment.nodes.map((node) => remapNodeToWorldCanvas(node, yMin, yMax)),
  }));

  const remapped: WorldTreeLayoutResult = {
    nodes: remappedNodes,
    segments: remappedSegments,
    canvasMinHeightVh: worldPath.world.canvasMinHeightVh,
    hubPositions: remapHubPositions(layout.hubPositions, yMin, yMax),
  };

  return applyWorldLayoutTuning(remapped, worldPath);
}

function applyWorldLayoutTuning(
  layout: WorldTreeLayoutResult,
  worldPath: JlptWorldPathViewModel,
): WorldTreeLayoutResult {
  switch (worldPath.world.id) {
    case "n5":
      return tuneN5WorldLayout(layout, worldPath);
    case "n4":
      return tuneN4WorldLayout(layout, worldPath);
    default:
      return layout;
  }
}

export { findPlottedNode };

/** Y-percent for the portal anchor at the crown of a world canvas. */
export function resolveWorldPortalYPercent(worldId?: JlptLevel): number {
  if (worldId === "n5") return resolveN5PortalYPercent();
  if (worldId === "n4") return resolveN4PortalYPercent();
  return 4;
}
