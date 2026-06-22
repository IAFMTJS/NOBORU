"use client";

import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { cn } from "@/lib/utils";

import {
  N5_ACT_BANDS,
  N5_ACT_BACKDROP_GRADIENTS,
} from "@/features/worlds/constants/n5-world.constants";
import { N5_ACT_SLICE_ART } from "@/features/worlds/constants/n5-world-art.constants";

/** Stacked act slices with Art Library v1 assets + gradient fallback. */
export function N5WorldBackdrop({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {N5_ACT_BANDS.map((band) => (
        <div
          key={band.actIndex}
          className="absolute inset-x-0 overflow-hidden"
          style={{
            top: `${band.yStart}%`,
            bottom: `${100 - band.yEnd}%`,
          }}
        >
          <ArtLibraryImage
            src={N5_ACT_SLICE_ART[band.actIndex][theme]}
            alt=""
            cover
            priority
            className="absolute inset-0"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-50",
              N5_ACT_BACKDROP_GRADIENTS[band.actIndex],
            )}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-background/5 to-background/15" />
      <div className="absolute inset-x-[15%] inset-y-0 bg-gradient-to-b from-trail-glow/5 via-transparent to-trail-glow/8 blur-3xl" />
    </div>
  );
}
