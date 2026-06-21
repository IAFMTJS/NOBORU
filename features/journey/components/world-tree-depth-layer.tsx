"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { artLibraryPath } from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

const DEPTH_PIECES = [
  {
    id: "depth-tree-01",
    base: "world-tree/depth/wt_depth_distant_tree_01",
    imageClassName: "object-left-bottom",
    wrapperClassName: "opacity-[0.42] dark:opacity-[0.38]",
    style: { bottom: 0, left: 0, width: "55%", height: "45%" },
  },
  {
    id: "depth-tree-01-mirror",
    base: "world-tree/depth/wt_depth_distant_tree_01",
    imageClassName: "object-right-bottom scale-x-[-1]",
    wrapperClassName: "opacity-[0.32] dark:opacity-[0.28]",
    style: { bottom: 0, right: 0, width: "50%", height: "40%" },
  },
  {
    id: "depth-tree-02",
    base: "world-tree/depth/wt_depth_distant_tree_02",
    imageClassName: "object-left-top",
    wrapperClassName: "opacity-[0.28] dark:opacity-[0.24]",
    style: { top: 0, left: 0, width: "48%", height: "35%" },
  },
  {
    id: "depth-tree-02-mirror",
    base: "world-tree/depth/wt_depth_distant_tree_02",
    imageClassName: "object-right-top scale-x-[-1]",
    wrapperClassName: "opacity-[0.24] dark:opacity-[0.2]",
    style: { top: 0, right: 0, width: "45%", height: "32%" },
  },
] as const;

type WorldTreeDepthLayerProps = {
  className?: string;
};

/** Soft branch silhouettes that fill parchment gaps around the trunk column. */
export function WorldTreeDepthLayer({ className }: WorldTreeDepthLayerProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-world-tree-depth
      aria-hidden
    >
      {DEPTH_PIECES.map((piece) => (
        <div
          key={piece.id}
          className={cn("absolute", piece.wrapperClassName)}
          style={piece.style}
        >
          <Image
            src={artLibraryPath(`${piece.base}_${theme}_v1.png`)}
            alt=""
            fill
            className={cn("object-contain", piece.imageClassName)}
            sizes="50vw"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
