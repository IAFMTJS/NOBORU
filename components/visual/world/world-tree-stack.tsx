"use client";

import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  worldTreeTileFile,
  WORLD_TREE_TILE_BASES,
  type ArtLibraryTheme,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

/** Tailwind overlap class — must be static for JIT (96px / 1024px). */
export const WORLD_TREE_OVERLAP_CLASS = "-mt-[9.375%]" as const;

export const WORLD_TREE_STACK: WorldTreeTileBase[] = [
  WORLD_TREE_TILE_BASES.foothills03,
  WORLD_TREE_TILE_BASES.foothills02,
  WORLD_TREE_TILE_BASES.foothills01,
  WORLD_TREE_TILE_BASES.roots,
];

type WorldTreeStackProps = {
  tiles?: WorldTreeTileBase[];
  className?: string;
};

/** Modular infinity-tree canvas — vertically stacked Art Library tiles with seam overlap. */
export function WorldTreeStack({ tiles, className }: WorldTreeStackProps) {
  const { resolvedTheme } = useTheme();
  const theme: ArtLibraryTheme = resolvedTheme === "light" ? "light" : "dark";
  const stack = tiles ?? WORLD_TREE_STACK;

  return (
    <div className={cn("relative w-full min-w-full", className)} aria-hidden>
      {stack.map((base, index) => (
        <ArtLibraryImage
          key={base}
          src={worldTreeTileFile(base, theme)}
          alt=""
          className={cn(
            "block w-full min-w-full max-w-none select-none",
            index > 0 && WORLD_TREE_OVERLAP_CLASS,
          )}
        />
      ))}
    </div>
  );
}
