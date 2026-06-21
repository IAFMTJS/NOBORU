"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useTheme } from "next-themes";

import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import {
  WORLD_TREE_JLPT_BAND_ART,
  worldTreeSegmentArtPath,
  type WorldTreeSegmentId,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { WORLD_TREE_MANIFEST_ANCHORS } from "@/features/journey/constants/world-tree-skeleton.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

const STACK_OVERLAP = 0.18;

type WorldTreeJlptFillLayerProps = {
  className?: string;
};

type PlacedSegment = {
  id: string;
  src: string;
  topPercent: number;
  heightPercent: number;
  widthPercent: number;
  leftPercent: number;
  zIndex: number;
};

function stackSegmentsInBand(
  segmentIds: readonly WorldTreeSegmentId[],
  band: { yMin: number; yMax: number },
  theme: "light" | "dark",
  zBase: number,
): PlacedSegment[] {
  if (segmentIds.length === 0) return [];

  const span = band.yMax - band.yMin;
  const pieceHeight = span / Math.max(1, segmentIds.length - STACK_OVERLAP);
  const { trunkCenterXPercent, trunkWidthPercent } = WORLD_TREE_MANIFEST_ANCHORS;

  return segmentIds.map((segmentId, index) => {
    const topPercent = band.yMin + index * pieceHeight * (1 - STACK_OVERLAP);
    return {
      id: `${segmentId}-${index}`,
      src: artLibraryPath(worldTreeSegmentArtPath(segmentId, theme)),
      topPercent,
      heightPercent: pieceHeight * (1 + STACK_OVERLAP),
      widthPercent: trunkWidthPercent + 6,
      leftPercent: trunkCenterXPercent,
      zIndex: zBase + index,
    };
  });
}

/**
 * Puzzle-piece fill between JLPT hero bands — roots/trunk segments + transition seams.
 */
export function WorldTreeJlptFillLayer({ className }: WorldTreeJlptFillLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const jlptBands = buildWorldTreeJlptBandLayout();

  const placed = useMemo(() => {
    const bandFill: PlacedSegment[] = [];

    for (const band of WORLD_TREE_JLPT_BANDS) {
      const layout = jlptBands.find((entry) => entry.id === band.id)!;
      const spec = WORLD_TREE_JLPT_BAND_ART[band.id as WorldTreeJlptBandId];
      bandFill.push(...stackSegmentsInBand(spec.fillSegments, layout, theme, 20));

      if (spec.transitionTop) {
        const transitionHeight = (layout.yMax - layout.yMin) * 0.22;
        bandFill.push({
          id: `${band.id}-transition`,
          src: artLibraryPath(worldTreeSegmentArtPath(spec.transitionTop, theme)),
          topPercent: layout.yMin - transitionHeight * 0.35,
          heightPercent: transitionHeight,
          widthPercent: WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent + 10,
          leftPercent: WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent,
          zIndex: 40,
        });
      }
    }

    return bandFill;
  }, [jlptBands, theme]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-tree-jlpt-fill
      aria-hidden
    >
      {placed.map((piece) => (
        <div
          key={piece.id}
          className="absolute -translate-x-1/2"
          style={{
            top: `${piece.topPercent}%`,
            left: `${piece.leftPercent}%`,
            width: `${piece.widthPercent}%`,
            height: `${piece.heightPercent}%`,
            zIndex: piece.zIndex,
          }}
          data-segment-piece={piece.id}
        >
          <Image
            src={piece.src}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="50vw"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
