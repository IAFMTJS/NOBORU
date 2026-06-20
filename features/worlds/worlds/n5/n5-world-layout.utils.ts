import type {
  PlottedSkeletonNode,
  WorldTreeLayoutResult,
} from "@/features/journey/utils/world-tree-layout.utils";
import type { JlptWorldPathViewModel } from "@/features/worlds/types/world.types";
import {
  N5_WORLD_LAYOUT,
  resolveN5TrunkX,
} from "@/features/worlds/worlds/n5/n5-world-layout.constants";

const MAIN_SPINE_KINDS = new Set(["lesson", "checkpoint", "trial"]);

function isMainSpineNode(entry: PlottedSkeletonNode): boolean {
  return (
    entry.spineRole === "main" &&
    entry.node.kind !== "landmark" &&
    MAIN_SPINE_KINDS.has(entry.node.kind)
  );
}

function clampPercent(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function enforceMinimumYSpacing(nodes: PlottedSkeletonNode[], minGap: number): void {
  const spineNodes = nodes
    .filter(isMainSpineNode)
    .sort((a, b) => b.yPercent - a.yPercent);

  for (let index = 1; index < spineNodes.length; index += 1) {
    const prev = spineNodes[index - 1]!;
    const current = spineNodes[index]!;
    if (prev.yPercent - current.yPercent < minGap) {
      current.yPercent = prev.yPercent - minGap;
    }
  }
}

/** Re-distribute N5 spine nodes across region bands aligned to hero art. */
export function tuneN5WorldLayout(
  layout: WorldTreeLayoutResult,
  _worldPath: JlptWorldPathViewModel,
): WorldTreeLayoutResult {
  const nodes = layout.nodes.map((entry) => ({ ...entry }));
  const byRegion = new Map<string, PlottedSkeletonNode[]>();

  for (const entry of nodes) {
    if (!isMainSpineNode(entry)) continue;
    const bucket = byRegion.get(entry.regionSlug) ?? [];
    bucket.push(entry);
    byRegion.set(entry.regionSlug, bucket);
  }

  for (const [regionSlug, regionNodes] of byRegion) {
    const range =
      N5_WORLD_LAYOUT.regionSpineRanges[
        regionSlug as keyof typeof N5_WORLD_LAYOUT.regionSpineRanges
      ];
    if (!range) continue;

    regionNodes.sort((a, b) => a.node.globalIndex - b.node.globalIndex);
    const count = regionNodes.length;

    for (let index = 0; index < count; index += 1) {
      const progress = count > 1 ? index / (count - 1) : 0.5;
      const yPercent = range.yMax - progress * (range.yMax - range.yMin);
      const xPercent = resolveN5TrunkX(progress, regionNodes[index]!.node.globalIndex);

      regionNodes[index]!.yPercent = yPercent;
      regionNodes[index]!.xPercent = clampPercent(xPercent, 14, 86);
    }
  }

  enforceMinimumYSpacing(nodes, N5_WORLD_LAYOUT.minNodeYGapPercent);

  return {
    ...layout,
    nodes,
  };
}

export function resolveN5PortalYPercent(): number {
  return N5_WORLD_LAYOUT.portalYPercent;
}
