import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";

export function findJourneyNodeById(
  journey: JourneyPathViewModel,
  nodeId: string | null,
): JourneyNode | null {
  if (!nodeId) return null;

  for (const region of journey.regions) {
    const node = region.nodes.find((entry) => entry.id === nodeId);
    if (node) return node;
  }

  return null;
}

export function findJourneyRegionBySlug(
  journey: JourneyPathViewModel,
  regionSlug: string,
): JourneyRegionViewModel | null {
  return journey.regions.find((region) => region.slug === regionSlug) ?? null;
}

export function findJourneyRegionForNode(
  journey: JourneyPathViewModel,
  nodeId: string | null,
): JourneyRegionViewModel | null {
  if (!nodeId) return null;

  return (
    journey.regions.find((region) =>
      region.nodes.some((node) => node.id === nodeId),
    ) ?? null
  );
}

export function resolveGlobalCurrentNode(
  journey: JourneyPathViewModel,
): JourneyNode | null {
  return findJourneyNodeById(journey, journey.position.currentNodeId);
}

export function resolveGlobalCurrentRegion(
  journey: JourneyPathViewModel,
): JourneyRegionViewModel | null {
  return (
    findJourneyRegionBySlug(journey, journey.position.currentRegionSlug) ??
    findJourneyRegionForNode(journey, journey.position.currentNodeId)
  );
}
