"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import {
  WORLD_TREE_SKELETON_ZONES,
  WORLD_TREE_MANIFEST_ANCHORS,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  buildWorldTreeZonePieceLayout,
  type WorldTreePlacedPiece,
} from "@/features/journey/utils/world-tree-piece-layout.utils";
import type { WorldTreeBand } from "@/features/journey/utils/world-tree-layout.utils";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import {
  WORLD_TREE_SEAM_OVERLAP_PERCENT,
  WORLD_TREE_TILE_CANVAS,
  type ArtLibraryTheme,
} from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type JourneyWorldTreeArtLayerProps = {
  className?: string;
};

const STACK_ROLE_ORDER = {
  roots: 0,
  trunk: 1,
  branches: 2,
} as const;

/** Negative margin-top (% of stack column width) matching 96px seam @ 1024px tile height. */
const STACK_SEAM_MARGIN_PERCENT =
  (WORLD_TREE_SEAM_OVERLAP_PERCENT / 100 / WORLD_TREE_TILE_CANVAS.aspectRatio) *
  WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent;

function resolveTheme(resolvedTheme: string | undefined): ArtLibraryTheme {
  return resolvedTheme === "light" ? "light" : "dark";
}

function pieceIndexFromId(id: string): number {
  const match = id.match(/_(\d+)_(?:light|dark)_v\d+$/);
  return match ? Number.parseInt(match[1]!, 10) : 0;
}

function groupPieces(pieces: WorldTreePlacedPiece[]) {
  const stack = pieces
    .filter(
      (piece) =>
        piece.role === "trunk" || piece.role === "roots" || piece.role === "branches",
    )
    .sort((a, b) => {
      const roleDiff = STACK_ROLE_ORDER[a.role] - STACK_ROLE_ORDER[b.role];
      if (roleDiff !== 0) return roleDiff;
      return pieceIndexFromId(a.id) - pieceIndexFromId(b.id);
    });

  return {
    backgrounds: pieces.filter((piece) => piece.role === "background"),
    stack,
    overlays: pieces.filter(
      (piece) => piece.role === "platform" || piece.role === "overlay",
    ),
  };
}

function WorldTreeOverlayPiece({ piece }: { piece: WorldTreePlacedPiece }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${piece.leftPercent}%`,
        top: `${piece.topPercent}%`,
        width: `${piece.widthPercent}%`,
        transform: "translate(-50%, -50%)",
        zIndex: piece.zIndex,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL */}
      <img
        src={piece.src}
        alt=""
        className="h-auto w-full max-h-[42vh] select-none object-contain drop-shadow-sm"
        draggable={false}
      />
    </div>
  );
}

function WorldTreeZoneArt({
  zoneId,
  band,
  theme,
}: {
  zoneId: WorldTreeZoneId;
  band: WorldTreeBand;
  theme: ArtLibraryTheme;
}) {
  const pieces = useMemo(
    () => buildWorldTreeZonePieceLayout(zoneId, theme),
    [zoneId, theme],
  );
  const { backgrounds, stack, overlays } = groupPieces(pieces);
  const zone = WORLD_TREE_SKELETON_ZONES.find((entry) => entry.id === zoneId);
  const height = band.yMax - band.yMin;
  const backgroundSliceHeight =
    backgrounds.length > 0 ? 100 / backgrounds.length : 100;

  return (
    <section
      data-world-tree-zone={zoneId}
      data-jlpt-level={zone?.jlptLevel}
      className="absolute inset-x-0 overflow-visible"
      style={{
        top: `${band.yMin}%`,
        height: `${height}%`,
      }}
    >
      {backgrounds.map((piece, index) => (
        <div
          key={piece.id}
          className="pointer-events-none absolute inset-x-0 overflow-hidden opacity-90"
          style={{
            top: `${index * backgroundSliceHeight}%`,
            height: `${backgroundSliceHeight}%`,
            zIndex: piece.zIndex,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL */}
          <img
            src={piece.src}
            alt=""
            className="size-full min-h-full min-w-full select-none object-cover object-center"
            draggable={false}
          />
        </div>
      ))}

      {stack.length > 0 ? (
        <div
          className="absolute bottom-0 top-0 z-10 flex flex-col items-center justify-end"
          data-world-tree-stack={zoneId}
          style={{
            left: `${50 - WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent / 2}%`,
            width: `${WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent}%`,
          }}
        >
          {stack.map((piece, index) => (
            // eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL
            <img
              key={piece.id}
              src={piece.src}
              alt=""
              className="block h-auto w-full max-w-none select-none object-contain object-bottom"
              style={{
                marginTop: index > 0 ? `-${STACK_SEAM_MARGIN_PERCENT}%` : undefined,
                zIndex: 10 + index,
              }}
              draggable={false}
            />
          ))}
        </div>
      ) : null}

      {overlays.map((piece) => (
        <WorldTreeOverlayPiece key={piece.id} piece={piece} />
      ))}
    </section>
  );
}

/** Composes sheet-remaster puzzle pieces onto the World Tree skeleton zones. */
export function JourneyWorldTreeArtLayer({ className }: JourneyWorldTreeArtLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolveTheme(resolvedTheme);
  const bands = buildWorldTreeZoneBands();

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      data-journey-art-layer
      aria-hidden
    >
      {WORLD_TREE_SKELETON_ZONES.map((zone) => (
        <WorldTreeZoneArt
          key={zone.id}
          zoneId={zone.id}
          band={bands[zone.id]}
          theme={theme}
        />
      ))}
    </div>
  );
}
