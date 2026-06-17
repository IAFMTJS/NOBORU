import {
  WORLD_TREE_TILE_BASES,
  type WorldTreeTileBase,
} from "@/lib/assets/art-library-paths";

/** Tailwind overlap class — must be static for JIT (96px seam @ 1536×1024 tile). */
export const PROTOTYPE_WORLD_TREE_OVERLAP_CLASS = "-mt-[6.25%]" as const;

/**
 * Batch 1 infinity tree — one of each unique segment, top → bottom DOM order.
 * Matches `scripts/art-direction/world-tree-manifest.json` stack order.
 */
export const PROTOTYPE_WORLD_TREE_STACK: WorldTreeTileBase[] = [
  WORLD_TREE_TILE_BASES.trunk_c,
  WORLD_TREE_TILE_BASES.trunk_b,
  WORLD_TREE_TILE_BASES.trunk_a,
  WORLD_TREE_TILE_BASES.roots_a,
];

/** @alias PROTOTYPE_WORLD_TREE_STACK — Kit tab preview uses the same batch. */
export const PROTOTYPE_WORLD_TREE_BATCH1 = PROTOTYPE_WORLD_TREE_STACK;

/** Returns every unique world-tree segment once — no tile duplication. */
export function buildPrototypeWorldTreeStack(): WorldTreeTileBase[] {
  return [...PROTOTYPE_WORLD_TREE_STACK];
}
