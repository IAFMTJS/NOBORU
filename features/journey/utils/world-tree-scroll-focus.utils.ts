import { REGION_SLUG_TO_WORLD_TREE_ZONE } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  findJlptBandCenterY,
  isWorldTreeJlptBandId,
  resolveJlptBandForRegion,
  resolveJlptBandForZone,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import type {
  JourneyNode,
  JourneyPathViewModel,
} from "@/features/journey/types/journey.types";
import {
  findPlottedNode,
  findZoneBandCenterY,
  type WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { RegionSlug } from "@/lib/design-system/regions";

export type WorldTreeScrollFocus = {
  focusYPercent: number | null;
  anchorScrollToBottom: boolean;
  highlightNodeId: string | null;
  focusZoneId: WorldTreeZoneId | null;
  focusJlptBandId: WorldTreeJlptBandId | null;
};

const LESSON_LIKE_KINDS = new Set(["lesson", "checkpoint", "trial"]);

/** Last completed node in global ascent order (bottom → top). */
export function findLastCompletedJourneyNode(
  journey: JourneyPathViewModel,
): JourneyNode | null {
  let lastCompleted: JourneyNode | null = null;

  for (const region of journey.regions) {
    for (const node of region.nodes) {
      if (node.state !== "completed") continue;
      if (!lastCompleted || node.globalIndex >= lastCompleted.globalIndex) {
        lastCompleted = node;
      }
    }
  }

  return lastCompleted;
}

/** First lesson-like node at the World Heart base. */
export function findFirstAscentJourneyNode(
  journey: JourneyPathViewModel,
): JourneyNode | null {
  let first: JourneyNode | null = null;

  for (const region of journey.regions) {
    for (const node of region.nodes) {
      if (!LESSON_LIKE_KINDS.has(node.kind)) continue;
      if (!first || node.globalIndex < first.globalIndex) {
        first = node;
      }
    }
  }

  return first;
}

export function resolveWorldTreeScrollFocus(
  journey: JourneyPathViewModel,
  layout: WorldTreeLayoutResult,
  options: {
    highlightNodeId?: string | null;
    regionSlug?: string | null;
    zoneId?: WorldTreeZoneId | null;
    jlptBandId?: WorldTreeJlptBandId | null;
  } = {},
): WorldTreeScrollFocus {
  const highlightNodeId = options.highlightNodeId ?? null;

  if (highlightNodeId) {
    return {
      focusYPercent: findPlottedNode(layout.nodes, highlightNodeId)?.yPercent ?? null,
      anchorScrollToBottom: false,
      highlightNodeId,
      focusZoneId: null,
      focusJlptBandId: null,
    };
  }

  if (options.jlptBandId) {
    return {
      focusYPercent: findJlptBandCenterY(options.jlptBandId),
      anchorScrollToBottom: false,
      highlightNodeId: null,
      focusZoneId: null,
      focusJlptBandId: options.jlptBandId,
    };
  }

  if (options.zoneId) {
    return {
      focusYPercent: findZoneBandCenterY(options.zoneId),
      anchorScrollToBottom: false,
      highlightNodeId: null,
      focusZoneId: options.zoneId,
      focusJlptBandId: resolveJlptBandForZone(options.zoneId),
    };
  }

  if (options.regionSlug) {
    const jlptBandId = resolveJlptBandForRegion(options.regionSlug);
    const zoneId = REGION_SLUG_TO_WORLD_TREE_ZONE[options.regionSlug as RegionSlug];
    if (jlptBandId) {
      return {
        focusYPercent: findJlptBandCenterY(jlptBandId),
        anchorScrollToBottom: false,
        highlightNodeId: null,
        focusZoneId: zoneId ?? null,
        focusJlptBandId: jlptBandId,
      };
    }
  }

  const lastCompleted = findLastCompletedJourneyNode(journey);
  if (lastCompleted) {
    return {
      focusYPercent: findPlottedNode(layout.nodes, lastCompleted.id)?.yPercent ?? null,
      anchorScrollToBottom: false,
      highlightNodeId: lastCompleted.id,
      focusZoneId: null,
      focusJlptBandId: null,
    };
  }

  const firstNode = findFirstAscentJourneyNode(journey);

  return {
    focusYPercent: null,
    anchorScrollToBottom: true,
    highlightNodeId: firstNode?.id ?? null,
    focusZoneId: null,
    focusJlptBandId: "n5",
  };
}

/** Viewport anchor ratio — higher keeps the focus node closer to the bottom (ascent from roots). */
export const WORLD_TREE_ASCENT_VIEWPORT_ANCHOR = 0.72;

export function resolveWorldTreeScrollTargetTop(
  container: HTMLElement,
  focusYPercent: number,
  anchorRatio: number = WORLD_TREE_ASCENT_VIEWPORT_ANCHOR,
): number {
  const focusY = (focusYPercent / 100) * container.scrollHeight;
  return Math.max(0, focusY - container.clientHeight * anchorRatio);
}
