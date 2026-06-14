"use client";

import { useTheme } from "next-themes";

import { TrailMapArtwork } from "@/components/media/trail-map-artwork";
import { JourneyPathNode } from "@/features/journey/components/journey-path-node";
import { computePathCoordinates } from "@/features/journey/components/path-geometry";
import type { JourneyNode } from "@/features/journey/types/journey.types";
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
  const { resolvedTheme } = useTheme();
  const previewNodes = nodes.filter((node) => node.kind !== "landmark");

  if (previewNodes.length === 0) {
    return null;
  }

  const geometryOptions = { regionSlug, theme: resolvedTheme };
  const normalizedNodes = previewNodes.map((node, index) => ({
    ...node,
    pathPosition:
      previewNodes.length <= 1 ? 0.5 : index / (previewNodes.length - 1),
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
        "relative overflow-hidden rounded-xl border border-trail-glow/25 trail-glow-warm",
        className,
      )}
    >
      <div
        className="relative w-full"
        style={{ minHeight: "12rem" }}
      >
        <TrailMapArtwork
          theme={resolvedTheme}
          regionSlug={regionSlug}
          immersive={false}
          scrim="minimal"
          scrollCropFocus={{ x: 50, y: 35 }}
          className="absolute inset-0"
          imageClassName="object-cover object-center scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div
          className="relative w-full px-3 py-4"
          style={{ paddingBottom: `${Math.min(pathHeightPercent, 120)}%` }}
        >
          <div className="absolute inset-0" role="list" aria-label="Trail preview">
            {normalizedNodes.map((node) => {
              const { x, y } = computePathCoordinates(
                node.pathPosition,
                geometryOptions,
              );
              const isCurrent = node.id === currentNodeId;
              return (
                <div
                  key={node.id}
                  role="listitem"
                  className={cn(
                    "absolute z-10 scale-75",
                    isCurrent && "scale-90",
                  )}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <JourneyPathNode node={node} isCurrent={isCurrent} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
