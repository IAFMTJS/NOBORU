"use client";

import { useTheme } from "next-themes";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { cn } from "@/lib/utils";

import { N5_ACT_BACKDROP_GRADIENTS, N5_ACT_SENSORY_OVERLAY } from "@/features/worlds/constants/n5-world.constants";
import {
  N5_ACT_SLICE_ART,
  N5_REALM_SILHOUETTE,
} from "@/features/worlds/constants/n5-world-art.constants";
import type { N5BackdropScrollState } from "@/features/worlds/utils/n5-world-backdrop-scroll.utils";

type N5WorldBackdropProps = {
  scrollState: N5BackdropScrollState;
  className?: string;
};

/**
 * Scroll-driven environment compositor — pans through each act slice and crossfades at act seams.
 * @see docs/JWorld/12-n5-art-and-node-placement.md
 */
export function N5WorldBackdrop({ scrollState, className }: N5WorldBackdropProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollState.silhouetteOffsetPercent}%)` }}
      >
        <ArtLibraryImage
          src={N5_REALM_SILHOUETTE[theme]}
          alt=""
          cover
          priority
          className="absolute inset-0 size-full opacity-35"
        />
      </div>

      {([1, 2, 3] as const).map((actIndex) => {
        const layer = scrollState.acts[actIndex];
        if (layer.opacity <= 0.01) return null;

        return (
          <div
            key={actIndex}
            className="absolute inset-0 will-change-[opacity,transform]"
            style={{ opacity: layer.opacity }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <ArtLibraryImage
                src={N5_ACT_SLICE_ART[actIndex][theme]}
                alt=""
                cover
                priority={actIndex === 1}
                className="absolute inset-0 size-full"
                style={{
                  objectPosition: `${layer.objectXPercent}% ${layer.objectYPercent}%`,
                  transform: `scale(${layer.scale})`,
                  transformOrigin: `${layer.objectXPercent}% ${layer.objectYPercent}%`,
                }}
              />
            </div>
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b",
                N5_ACT_BACKDROP_GRADIENTS[actIndex],
              )}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-b motion-safe:opacity-100 motion-reduce:opacity-0",
                N5_ACT_SENSORY_OVERLAY[actIndex],
              )}
            />
          </div>
        );
      })}

      <div
        className="absolute inset-x-[-10%] inset-y-[-5%] opacity-35 will-change-transform"
        style={{ transform: `translateY(${scrollState.mistOffsetPercent}%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-trail-glow/10 via-transparent to-trail-glow/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-background/10 blur-2xl" />
      </div>

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/45 to-transparent" />
    </div>
  );
}
