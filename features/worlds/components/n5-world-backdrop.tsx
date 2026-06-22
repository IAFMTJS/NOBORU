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
 * Full-bleed scroll environment — learner walks through painted act bands.
 * Set pieces (hamlet, torii, grotto) live in the slices; nodes sit on the UI layer.
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
        className="absolute inset-0 opacity-40"
      />

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
            className={cn(
              "absolute inset-0 scale-[1.03]",
              N5_ACT_SLICE_OBJECT_POSITION[band.actIndex],
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b opacity-80",
              N5_ACT_BACKDROP_GRADIENTS[band.actIndex],
            )}
          />
        </div>
      ))}

      {/* Edge scrims only — keep the corridor readable without washing out the environment */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background/50 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/25 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/25 to-transparent" />
      <div className="absolute inset-x-[12%] inset-y-0 bg-gradient-to-b from-trail-glow/4 via-transparent to-trail-glow/6 blur-3xl" />
    </div>
  );
}
