"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import {
  WORLD_TREE_MANIFEST_ANCHORS,
} from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  WORLD_TREE_PIECE_MAX_VH,
  WORLD_TREE_REALMS,
  WORLD_TREE_STACK_OVERLAP_FRACTION,
  WORLD_TREE_STRUCTURAL_SPAN,
} from "@/features/journey/constants/world-tree-full-ascent.constants";
import {
  buildWorldTreeFullAscentLayout,
  type WorldTreeDecorPiece,
  type WorldTreeRealmLayout,
} from "@/features/journey/utils/world-tree-full-ascent.utils";
import {
  WORLD_TREE_SEAM_OVERLAP_PERCENT,
  WORLD_TREE_TILE_CANVAS,
  type ArtLibraryTheme,
} from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type JourneyWorldTreeArtLayerProps = {
  className?: string;
};

const STACK_SEAM_MARGIN_PERCENT =
  (WORLD_TREE_SEAM_OVERLAP_PERCENT / 100 / WORLD_TREE_TILE_CANVAS.aspectRatio) *
  WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent *
  (1 + WORLD_TREE_STACK_OVERLAP_FRACTION);

function resolveTheme(resolvedTheme: string | undefined): ArtLibraryTheme {
  return resolvedTheme === "light" ? "light" : "dark";
}

function WorldTreeDecor({ piece }: { piece: WorldTreeDecorPiece }) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${piece.leftPercent}%`,
        top: `${piece.topPercent}%`,
        width: `${piece.widthPercent}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        opacity: 0.82,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL */}
      <img
        src={piece.src}
        alt=""
        className="h-auto w-full max-h-[18vh] select-none object-contain"
        draggable={false}
      />
    </div>
  );
}

function WorldTreeRealmAtmosphere({ realm }: { realm: WorldTreeRealmLayout }) {
  const { resolvedTheme } = useTheme();
  const theme = resolveTheme(resolvedTheme);
  const spec = WORLD_TREE_REALMS.find((entry) => entry.id === realm.id)!;
  const palette = theme === "light" ? spec.atmosphere.light : spec.atmosphere.dark;
  const bandHeight = realm.band.yMax - realm.band.yMin;

  return (
    <section
      data-world-tree-realm={realm.id}
      className="pointer-events-none absolute inset-x-0 overflow-hidden"
      style={{
        top: `${realm.band.yMin}%`,
        height: `${bandHeight}%`,
        zIndex: 0,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${palette.top}, ${palette.mid} 45%, ${palette.bottom})`,
        }}
      />

      {realm.backdrops.map((slice) => (
        <div
          key={slice.id}
          className="absolute inset-x-0 overflow-hidden opacity-50"
          style={{
            top: `${((slice.topPercent - realm.band.yMin) / bandHeight) * 100}%`,
            height: `${(slice.heightPercent / bandHeight) * 100}%`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL */}
          <img
            src={slice.src}
            alt=""
            className="size-full min-h-full min-w-full select-none object-cover object-center"
            draggable={false}
          />
        </div>
      ))}
    </section>
  );
}

/** Five-realm atmosphere with one continuous trunk column. */
export function JourneyWorldTreeArtLayer({ className }: JourneyWorldTreeArtLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolveTheme(resolvedTheme);
  const layout = useMemo(() => buildWorldTreeFullAscentLayout(theme), [theme]);

  const trunkLeft = 50 - WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent / 2;
  const spanHeight = WORLD_TREE_STRUCTURAL_SPAN.yMax - WORLD_TREE_STRUCTURAL_SPAN.yMin;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
      data-journey-art-layer
      aria-hidden
    >
      {layout.realms.map((realm) => (
        <WorldTreeRealmAtmosphere key={realm.id} realm={realm} />
      ))}

      <div
        className="absolute flex flex-col items-center justify-end overflow-visible"
        data-world-tree-stack="global"
        style={{
          top: `${WORLD_TREE_STRUCTURAL_SPAN.yMin}%`,
          height: `${spanHeight}%`,
          left: `${trunkLeft}%`,
          width: `${WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent}%`,
          zIndex: 1,
        }}
      >
        {layout.structural.map((piece, index) => (
          // eslint-disable-next-line @next/next/no-img-element -- resolved Art Library URL
          <img
            key={piece.id}
            src={piece.src}
            alt=""
            data-world-tree-piece={piece.role}
            className="block w-[102%] max-w-none shrink-0 select-none object-contain object-bottom"
            style={{
              maxHeight: `${WORLD_TREE_PIECE_MAX_VH}vh`,
              marginTop: index > 0 ? `-${STACK_SEAM_MARGIN_PERCENT}%` : undefined,
              zIndex: index + 1,
            }}
            draggable={false}
          />
        ))}
      </div>

      {layout.decor.map((piece) => (
        <WorldTreeDecor key={piece.id} piece={piece} />
      ))}
    </div>
  );
}
