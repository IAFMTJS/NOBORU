import type {
  JourneyNode,
  JourneyNodeKind,
  JourneyNodeState,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";

export function resolveCurrentJourneyNode(
  region: JourneyRegionViewModel,
): JourneyNode | null {
  if (region.currentNodeIndex !== null) {
    return region.nodes[region.currentNodeIndex] ?? null;
  }

  return (
    region.nodes.find((node) => node.state === "in_progress") ??
    region.nodes.find((node) => node.state === "available") ??
    null
  );
}

/**
 * Opacity for nodes based on distance from the viewport center.
 * Preserves discovery: nearby content is clear, distant summit/trial fades.
 */
export function resolveNodeDiscoveryOpacity(
  nodeY: number,
  viewportCenterY: number,
  nodeState: JourneyNodeState,
  nodeKind: JourneyNodeKind,
): number {
  const distance = Math.abs(nodeY - viewportCenterY);
  const aheadOnTrail = nodeY < viewportCenterY;

  let opacity: number;
  if (distance <= 10) opacity = 1;
  else if (distance <= 22) opacity = 0.92;
  else if (distance <= 35) opacity = 0.75;
  else if (distance <= 48) opacity = 0.55;
  else opacity = 0.34;

  if (nodeKind === "trial" && aheadOnTrail && distance > 28) {
    opacity = Math.min(opacity, 0.4);
  }

  if (nodeKind === "landmark" && distance > 40) {
    opacity = Math.min(opacity, 0.5);
  }

  if (nodeState === "locked" && distance > 28) {
    opacity = Math.min(opacity, 0.42);
  }

  return opacity;
}
