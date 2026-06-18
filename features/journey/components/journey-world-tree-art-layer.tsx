"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  WORLD_TREE_SKELETON_ZONES,
  type WorldTreeZoneId,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  buildWorldTreeZonePieceLayout,
  type WorldTreePlacedPiece,
} from "@/features/journey/utils/world-tree-piece-layout.utils";
import type { WorldTreeBand } from "@/features/journey/utils/world-tree-layout.utils";
import { buildWorldTreeZoneBands } from "@/features/journey/utils/world-tree-layout.utils";
import { WORLD_TREE_SEAM_OVERLAP_PERCENT, type ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type JourneyWorldTreeArtLayerProps = {
  className?: string;
};

function resolveTheme(resolvedTheme: string | undefined): ArtLibraryTheme {
  return resolvedTheme === "light" ? "light" : "dark";
}

function groupPieces(pieces: WorldTreePlacedPiece[]) {
  return {
    backgrounds: pieces.filter((piece) => piece.role === "background"),
    stack: pieces.filter(
      (piece) =>
        piece.role === "trunk" || piece.role === "roots" || piece.role === "branches",
    ),
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
      <ArtLibraryImage
        src={piece.src}
        alt=""
        className="h-auto w-full max-h-[42vh] select-none object-contain drop-shadow-sm"
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

  return (
    <section
      data-world-tree-zone={zoneId}
      data-jlpt-level={zone?.jlptLevel}
      className="absolute inset-x-0 overflow-hidden"
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
            top: `${index * 18}%`,
            height: "36%",
            zIndex: piece.zIndex,
          }}
        >
          <ArtLibraryImage
            src={piece.src}
            alt=""
            cover
            className="h-full w-full select-none"
          />
        </div>
      ))}

      {stack.length > 0 ? (
        <div
          className="absolute inset-x-[24%] bottom-0 top-0 z-10 flex flex-col"
          data-world-tree-stack={zoneId}
        >
          {stack.map((piece, index) => (
            <div
              key={piece.id}
              className="relative min-h-0 flex-1"
              style={{
                marginTop:
                  index > 0 ? `calc(-1 * ${WORLD_TREE_SEAM_OVERLAP_PERCENT} * 1%)` : undefined,
                zIndex: 10 + index,
              }}
            >
              <ArtLibraryImage
                src={piece.src}
                alt=""
                cover
                className="h-full w-full select-none object-cover object-[50%_center]"
              />
            </div>
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
