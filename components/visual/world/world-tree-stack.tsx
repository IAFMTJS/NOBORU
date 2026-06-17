"use client";

import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  worldTreeTileFile,
  WORLD_TREE_TILE_BASES,
  type ArtLibraryTheme,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";
import {
  resolveWorldTreeSegmentPresentation,
  WORLD_TREE_OVERLAP_WIDTH_PERCENT,
  WORLD_TREE_TILE_CANVAS,
} from "@/lib/assets/world-tree-segment-presentation";
import { cn } from "@/lib/utils";

/** @deprecated Use WORLD_TREE_OVERLAP_WIDTH_PERCENT — old value used height % as width %. */
export const WORLD_TREE_OVERLAP_CLASS = "-mt-[6.25%]" as const;

export const WORLD_TREE_STACK: WorldTreeTileBase[] = [
  WORLD_TREE_TILE_BASES.trunk_c,
  WORLD_TREE_TILE_BASES.trunk_b,
  WORLD_TREE_TILE_BASES.trunk_a,
  WORLD_TREE_TILE_BASES.roots_a,
];

type WorldTreeStackProps = {
  tiles?: WorldTreeTileBase[];
  className?: string;
};

/** Single modular tile — fixed aspect, trunk-normalized crop, seam overlap downward. */
function WorldTreeTile({
  base,
  theme,
  overlap,
}: {
  base: WorldTreeTileBase;
  theme: ArtLibraryTheme;
  overlap: boolean;
}) {
  const presentation = resolveWorldTreeSegmentPresentation(base);

  return (
    <div
      className={cn("relative w-full overflow-hidden", overlap && "z-[1]")}
      style={{
        aspectRatio: `${WORLD_TREE_TILE_CANVAS.width} / ${WORLD_TREE_TILE_CANVAS.height}`,
        marginTop: overlap ? `calc(-1 * ${WORLD_TREE_OVERLAP_WIDTH_PERCENT} * 1%)` : undefined,
      }}
      data-world-tree-segment={base.split("/").slice(-2, -1)[0]}
    >
      <ArtLibraryImage
        src={worldTreeTileFile(base, theme)}
        alt=""
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{
          objectPosition: `${presentation.trunkCenterXPercent}% center`,
          transform:
            presentation.presentationScale !== 1
              ? `scale(${presentation.presentationScale})`
              : undefined,
          transformOrigin: `${presentation.trunkCenterXPercent}% center`,
        }}
      />
    </div>
  );
}

/** Modular world-tree canvas — bottom (roots) → top (crown), puzzle seams aligned on trunk. */
export function WorldTreeStack({ tiles, className }: WorldTreeStackProps) {
  const { resolvedTheme } = useTheme();
  const theme: ArtLibraryTheme = resolvedTheme === "light" ? "light" : "dark";
  const stack = tiles ?? WORLD_TREE_STACK;

  return (
    <div className={cn("relative isolate w-full min-w-full", className)} aria-hidden>
      {stack.map((base, index) => (
        <WorldTreeTile
          key={base}
          base={base}
          theme={theme}
          overlap={index > 0}
        />
      ))}
    </div>
  );
}
