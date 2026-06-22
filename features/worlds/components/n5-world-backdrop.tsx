"use client";

import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { cn } from "@/lib/utils";

import {
  N5_ACT_BANDS,
  N5_ACT_BACKDROP_GRADIENTS,
  N5_ACT_SLICE_OBJECT_POSITION,
} from "@/features/worlds/constants/n5-world.constants";
import {
  N5_ACT_SLICE_ART,
  N5_REALM_SILHOUETTE,
} from "@/features/worlds/constants/n5-world-art.constants";

/**
 * Full-bleed scroll environment — one viewport of painted art per act while scrolling.
 * Node spacing can grow the canvas to thousands of vh; sticky bands keep art at readable scale.
 * @see docs/JWorld/12-n5-art-and-node-placement.md
 */
export function N5WorldBackdrop({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <ArtLibraryImage
        src={N5_REALM_SILHOUETTE[theme]}
        alt=""
        cover
        priority
        className="fixed inset-0 z-0 h-dvh w-full opacity-30"
      />

      {N5_ACT_BANDS.map((band) => (
        <div
          key={band.actIndex}
          className="absolute inset-x-0 z-[1]"
          style={{
            top: `${band.yStart}%`,
            bottom: `${100 - band.yEnd}%`,
          }}
        >
          <div className="sticky top-0 h-dvh w-full overflow-hidden">
            <ArtLibraryImage
              src={N5_ACT_SLICE_ART[band.actIndex][theme]}
              alt=""
              cover
              priority
              className={cn(
                "absolute inset-0 size-full",
                N5_ACT_SLICE_OBJECT_POSITION[band.actIndex],
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b",
                N5_ACT_BACKDROP_GRADIENTS[band.actIndex],
              )}
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
}
