"use client";

import { JourneyPathNode } from "@/features/journey/components/journey-path-node";
import { JourneyPathSpine } from "@/features/journey/components/journey-path-spine";
import { computePathCoordinates } from "@/features/journey/components/path-geometry";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";

type JourneyPreviewMapProps = {
  regionSlug: string;
  nodes: JourneyNode[];
  currentNodeId?: string | null;
  className?: string;
};

export function JourneyPreviewMap({
  regionSlug,
  nodes,
  currentNodeId = null,
  className,
}: JourneyPreviewMapProps) {
  const visuals = getRegionVisuals(regionSlug);
  const previewNodes = nodes.filter((node) => node.kind !== "landmark");

  if (previewNodes.length === 0) {
    return null;
  }

  const geometryOptions = { regionSlug, theme: undefined };
  const normalizedNodes = previewNodes.map((node, index) => ({
    ...node,
    pathPosition:
      previewNodes.length <= 1
        ? 0.5
        : index / (previewNodes.length - 1),
  }));

  const pathHeightPercent = Math.max(
    100,
    normalizedNodes.reduce((max, node) => {
      const { y } = computePathCoordinates(node.pathPosition, geometryOptions);
      return Math.max(max, y);
    }, 0) + 8,
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-primary/20",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full bg-gradient-to-b px-3 py-4",
          visuals.gradient,
        )}
        style={{ minHeight: "12rem" }}
      >
        <div
          className="relative w-full"
          style={{ paddingBottom: `${Math.min(pathHeightPercent, 120)}%` }}
        >
          <JourneyPathSpine
            nodes={normalizedNodes}
            regionSlug={regionSlug}
          />
          <div className="absolute inset-0" role="list" aria-label="Trail preview">
            {normalizedNodes.map((node) => {
              const { x, y } = computePathCoordinates(
                node.pathPosition,
                geometryOptions,
              );
              return (
                <div
                  key={node.id}
                  role="listitem"
                  className="absolute z-10 scale-75"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <JourneyPathNode
                    node={node}
                    isCurrent={node.id === currentNodeId}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
