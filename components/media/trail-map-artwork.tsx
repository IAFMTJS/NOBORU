"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import {
  getTrailScrollArtPath,
  hasTrailScrollArt,
} from "@/lib/assets/registry";
import {
  resolveTrailScrollPresentation,
} from "@/lib/assets/image-presentation";
import { cn } from "@/lib/utils";

type TrailMapArtworkProps = {
  theme?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  immersive?: boolean;
  regionSlug?: string;
  trailSegmentIndex?: number;
  scrim?: "full" | "minimal";
  parallaxOffsetPx?: number;
  loadArtwork?: boolean;
  scrollCropFocus?: { x: number; y: number };
};

export function TrailMapArtwork({
  theme,
  className,
  imageClassName,
  priority,
  immersive,
  regionSlug,
  trailSegmentIndex,
  scrim = "full",
  parallaxOffsetPx = 0,
  loadArtwork = true,
  scrollCropFocus,
}: TrailMapArtworkProps) {
  const { resolvedTheme } = useTheme();
  const effectiveTheme = theme ?? resolvedTheme ?? "dark";
  const scrollArt =
    regionSlug && hasTrailScrollArt(regionSlug)
      ? getTrailScrollArtPath(regionSlug, effectiveTheme, trailSegmentIndex)
      : null;

  const presentation = resolveTrailScrollPresentation({
    scrollCropFocus,
    parallaxOffsetPx,
  });

  if (!loadArtwork || !scrollArt) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/80",
          immersive && "from-emerald-950/40 via-background/90 to-background",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <>
      <Image
        src={scrollArt}
        alt=""
        fill
        priority={priority}
        aria-hidden
        className={cn(
          "pointer-events-none select-none",
          imageClassName,
        )}
        style={{
          objectFit: presentation.objectFit,
          objectPosition: presentation.objectPosition,
        }}
        sizes="100vw"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          scrim === "full"
            ? "bg-gradient-to-b from-background/70 via-background/20 to-background/85"
            : "bg-gradient-to-t from-background/55 via-transparent to-background/25",
          className,
        )}
        aria-hidden
      />
    </>
  );
}
