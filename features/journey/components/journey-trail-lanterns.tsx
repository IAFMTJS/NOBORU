"use client";

import { useMemo } from "react";

import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { computePathCoordinates, type PathGeometryOptions } from "@/features/journey/components/path-geometry";
import type { JourneyNode } from "@/features/journey/types/journey.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

const LANTERN_EVERY_N_LESSON_NODES = 4;

type JourneyTrailLanternsProps = {
  nodes: JourneyNode[];
  geometryOptions: PathGeometryOptions;
  className?: string;
};

function isLessonNode(node: JourneyNode): boolean {
  return node.kind === "lesson";
}

export function JourneyTrailLanterns({
  nodes,
  geometryOptions,
  className,
}: JourneyTrailLanternsProps) {
  const lanternPositions = useMemo(() => {
    const lessonNodes = nodes.filter(isLessonNode);
    const placements: Array<{ x: number; y: number; lit: boolean }> = [];

    for (let index = LANTERN_EVERY_N_LESSON_NODES - 1;
      index < lessonNodes.length;
      index += LANTERN_EVERY_N_LESSON_NODES) {
      const node = lessonNodes[index];
      if (!node) continue;

      const coords = computePathCoordinates(node.pathPosition, geometryOptions);
      const offsetX = coords.x <= 50 ? coords.x + 8 : coords.x - 8;
      placements.push({
        x: Math.min(88, Math.max(12, offsetX)),
        y: coords.y,
        lit: node.state === "completed",
      });
    }

    return placements;
  }, [geometryOptions, nodes]);

  if (lanternPositions.length === 0) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-[6]", className)} aria-hidden>
      {lanternPositions.map((lantern, index) => (
        <div
          key={`lantern-${index}`}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2",
            lantern.lit && "trail-glow-warm",
          )}
          style={{
            left: `${lantern.x}%`,
            top: `${lantern.y}%`,
          }}
        >
          <WorldArtImage
            asset={
              lantern.lit
                ? INVENTORY_ITEM_ASSETS.lantern
                : INVENTORY_ITEM_ASSETS.stone_lantern
            }
            alt=""
            width={28}
            height={28}
            className={cn(
              "h-7 w-7 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]",
              lantern.lit ? "opacity-95" : "opacity-40 saturate-0 brightness-75",
            )}
          />
        </div>
      ))}
    </div>
  );
}
