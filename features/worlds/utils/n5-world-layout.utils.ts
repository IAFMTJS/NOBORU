import type { JourneyNode } from "@/features/journey/types/journey.types";
import {
  computeJourneyPathCoordinates,
  type JourneyPathPoint,
} from "@/lib/design-system/journey-path-contracts";

import { N5_LANDMARK_FALLBACKS } from "@/features/worlds/constants/n5-landmarks.constants";
import {
  N5_RESERVED_NODE_SLOTS,
  type N5ReservedNodeAnchor,
  type N5ReservedNodePurpose,
  type N5ReservedNodeSlot,
} from "@/features/worlds/constants/n5-reserved-nodes.constants";
import {
  N5_NODE_PATH_END,
  N5_NODE_PATH_START,
  N5_SCROLL_MIN_HEIGHT_VH_BASE,
  N5_TARGET_NODE_GAP_VH,
  N5_WORLD_SLUG,
  resolveN5ScrollMinHeightVh,
} from "@/features/worlds/constants/n5-world.constants";

export type N5NodeCanvasPosition = JourneyPathPoint & {
  pathPosition: number;
};

export type N5SpineOccupant =
  | { kind: "visible"; node: JourneyNode }
  | { kind: "reserved"; slot: N5ReservedNodeSlot };

export type N5SpineSlotMapEntry = {
  id: string;
  kind: "visible" | "reserved";
  label: string;
  purpose?: N5ReservedNodePurpose;
  branchId?: string;
  spineIndex: number;
  pathPosition: number;
  x: number;
  y: number;
};

function sortVisibleNodes(nodes: readonly JourneyNode[]): JourneyNode[] {
  return [...nodes].sort((a, b) => a.regionIndex - b.regionIndex);
}

function resolveLandmarkLabel(landmarkSlug: string): string | null {
  return (
    N5_LANDMARK_FALLBACKS.find((landmark) => landmark.slug === landmarkSlug)?.label ??
    null
  );
}

function findLandmarkNodeIndex(
  nodes: readonly JourneyNode[],
  landmarkSlug: string,
): number {
  const label = resolveLandmarkLabel(landmarkSlug);
  if (!label) return -1;
  return nodes.findIndex(
    (node) => node.kind === "landmark" && node.label === label,
  );
}

function anchorsMatch(
  left: N5ReservedNodeAnchor,
  right: N5ReservedNodeAnchor,
): boolean {
  return left.type === right.type && left.landmarkSlug === right.landmarkSlug;
}

function resolveReservedInsertIndex(
  slot: N5ReservedNodeSlot,
  visible: readonly JourneyNode[],
  occupants: readonly N5SpineOccupant[],
): number {
  const landmarkIndex = findLandmarkNodeIndex(visible, slot.anchor.landmarkSlug);
  if (landmarkIndex < 0) {
    return occupants.length;
  }

  const landmarkNode = visible[landmarkIndex]!;
  const landmarkOccupantIndex = occupants.findIndex(
    (occupant) =>
      occupant.kind === "visible" && occupant.node.id === landmarkNode.id,
  );
  if (landmarkOccupantIndex < 0) {
    return occupants.length;
  }

  const base =
    slot.anchor.type === "after_landmark"
      ? landmarkOccupantIndex + 1
      : landmarkOccupantIndex;

  const priorAtSameAnchor = occupants
    .slice(0, base)
    .filter(
      (occupant) =>
        occupant.kind === "reserved" &&
        anchorsMatch(occupant.slot.anchor, slot.anchor),
    ).length;

  return base + priorAtSameAnchor;
}

/** Journey-order spine sequence (visible nodes + reserved metadata slots). */
export function buildN5SpineOccupancy(
  nodes: readonly JourneyNode[],
): N5SpineOccupant[] {
  const visible = sortVisibleNodes(nodes);
  const occupants: N5SpineOccupant[] = visible.map((node) => ({
    kind: "visible",
    node,
  }));

  for (const slot of N5_RESERVED_NODE_SLOTS) {
    const index = resolveReservedInsertIndex(slot, visible, occupants);
    occupants.splice(index, 0, { kind: "reserved", slot });
  }

  return occupants;
}

export function resolveN5NodeCanvasPosition(
  node: JourneyNode,
  options?: { theme?: string },
): N5NodeCanvasPosition {
  const coords = computeJourneyPathCoordinates(
    node.pathPosition,
    N5_WORLD_SLUG,
    options,
  );
  return { ...coords, pathPosition: node.pathPosition };
}

function resolveSpreadPathPosition(index: number, total: number): number {
  if (total <= 1) return 0.5;
  const t = index / (total - 1);
  return N5_NODE_PATH_START + t * (N5_NODE_PATH_END - N5_NODE_PATH_START);
}

function measureSpineYSpanPercent(options?: { theme?: string }): number {
  const startY = computeJourneyPathCoordinates(
    N5_NODE_PATH_START,
    N5_WORLD_SLUG,
    options,
  ).y;
  const endY = computeJourneyPathCoordinates(
    N5_NODE_PATH_END,
    N5_WORLD_SLUG,
    options,
  ).y;
  return startY - endY;
}

/** Scroll height used by layout + canvas (may exceed base formula when the spine curve is tight). */
export function resolveN5LayoutScrollMinHeightVh(
  visibleNodeCount: number,
  options?: { theme?: string },
): number {
  if (visibleNodeCount <= 1) {
    return N5_SCROLL_MIN_HEIGHT_VH_BASE;
  }

  let scrollVh = resolveN5ScrollMinHeightVh(visibleNodeCount);
  const availableSpan = measureSpineYSpanPercent(options);
  let minYGapPercent = (N5_TARGET_NODE_GAP_VH / scrollVh) * 100;

  while ((visibleNodeCount - 1) * minYGapPercent > availableSpan) {
    scrollVh += 50;
    minYGapPercent = (N5_TARGET_NODE_GAP_VH / scrollVh) * 100;
  }

  return scrollVh;
}

function findPathPositionForTargetY(
  targetY: number,
  options?: { theme?: string },
): number {
  let low = 0;
  let high = 1;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    const mid = (low + high) / 2;
    const y = computeJourneyPathCoordinates(mid, N5_WORLD_SLUG, options).y;
    if (y > targetY) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/** Visible nodes only — enforces minimum vertical gap along the spine curve. */
function resolveVisibleNodePositions(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  const ordered = sortVisibleNodes(nodes);
  const map = new Map<string, N5NodeCanvasPosition>();
  const count = ordered.length;

  if (count === 0) {
    return map;
  }

  if (count === 1) {
    const pathPosition = 0.5;
    const coords = computeJourneyPathCoordinates(
      pathPosition,
      N5_WORLD_SLUG,
      options,
    );
    map.set(ordered[0]!.id, { ...coords, pathPosition });
    return map;
  }

  const scrollVh = resolveN5LayoutScrollMinHeightVh(count, options);
  const minYGapPercent = (N5_TARGET_NODE_GAP_VH / scrollVh) * 100;
  const startY = computeJourneyPathCoordinates(
    N5_NODE_PATH_START,
    N5_WORLD_SLUG,
    options,
  ).y;
  const endY = computeJourneyPathCoordinates(
    N5_NODE_PATH_END,
    N5_WORLD_SLUG,
    options,
  ).y;
  const availableSpan = startY - endY;

  const evenStep = availableSpan / (count - 1);
  const step = Math.max(evenStep, minYGapPercent);

  for (let index = 0; index < count; index += 1) {
    const targetY = Math.max(endY, startY - index * step);
    const pathPosition = findPathPositionForTargetY(targetY, options);
    const coords = computeJourneyPathCoordinates(
      pathPosition,
      N5_WORLD_SLUG,
      options,
    );
    map.set(ordered[index]!.id, { ...coords, pathPosition });
  }

  return map;
}

function resolveReservedNodePositionMap(
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  const map = new Map<string, N5NodeCanvasPosition>();

  for (const slot of N5_RESERVED_NODE_SLOTS) {
    const coords = computeJourneyPathCoordinates(
      slot.pathPositionHint,
      N5_WORLD_SLUG,
      options,
    );
    map.set(slot.id, { ...coords, pathPosition: slot.pathPositionHint });
  }

  return map;
}

/** Evenly spaces visible nodes along the spine with generous scroll height (see resolveN5ScrollMinHeightVh). */
export function resolveN5NodeCanvasPositions(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  return resolveVisibleNodePositions(nodes, options);
}

export function resolveN5ReservedNodePositions(
  _nodes: readonly JourneyNode[],
  options?: { theme?: string },
): Map<string, N5NodeCanvasPosition> {
  return resolveReservedNodePositionMap(options);
}

/** Full spine map for greybox export and art authoring. */
export function resolveN5FullSpineSlotMap(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): N5SpineSlotMapEntry[] {
  const occupancy = buildN5SpineOccupancy(nodes);
  const visible = resolveVisibleNodePositions(nodes, options);
  const reserved = resolveReservedNodePositionMap(options);

  return occupancy.map((occupant, spineIndex) => {
    if (occupant.kind === "visible") {
      const position = visible.get(occupant.node.id)!;
      return {
        id: occupant.node.id,
        kind: "visible" as const,
        label: occupant.node.label,
        spineIndex,
        pathPosition: position.pathPosition,
        x: position.x,
        y: position.y,
      };
    }

    const position = reserved.get(occupant.slot.id)!;
    return {
      id: occupant.slot.id,
      kind: "reserved" as const,
      label: occupant.slot.label,
      purpose: occupant.slot.purpose,
      branchId: occupant.slot.branchId,
      spineIndex,
      pathPosition: position.pathPosition,
      x: position.x,
      y: position.y,
    };
  });
}

/** Minimum vertical % gap between adjacent visible nodes in journey order. */
export function measureMinVisibleYGapPercent(
  nodes: readonly JourneyNode[],
  options?: { theme?: string },
): number {
  const ordered = sortVisibleNodes(nodes);
  const map = resolveVisibleNodePositions(nodes, options);
  const positions = ordered.map((node) => map.get(node.id)!);

  if (positions.length <= 1) return 100;

  const gaps = positions
    .slice(1)
    .map((point, index) => positions[index]!.y - point.y);
  return Math.min(...gaps);
}
