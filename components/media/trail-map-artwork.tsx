"use client";

import Image from "next/image";

import {
  TRAIL_MAP_CARD_IMAGE_CLASS,
  TRAIL_MAP_IMMERSIVE_IMAGE_CLASS,
  TRAIL_MAP_SCRIM_CLASS,
} from "@/lib/assets/image-presentation";
import {
  getRegionArtPath,
  getTrailScrollArtPath,
  getTrailSpineArtPath,
  hasTrailScrollArt,
} from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type TrailMapArtworkProps = {
  theme: string | undefined;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  immersive?: boolean;
  regionSlug?: string;
  trailSegmentIndex?: number;
};

export function TrailMapArtwork({
  theme,
  className,
  imageClassName,
  priority = false,
  immersive = false,
  regionSlug,
  trailSegmentIndex = 0,
}: TrailMapArtworkProps) {
  const scrollSrc =
    immersive && hasTrailScrollArt(regionSlug)
      ? getTrailScrollArtPath(regionSlug, theme, trailSegmentIndex)
      : null;
  const regionSrc =
    immersive && !scrollSrc && regionSlug ? getRegionArtPath(regionSlug) : null;
  const spineSrc = getTrailSpineArtPath(theme);

  if (immersive && scrollSrc) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <Image
          src={scrollSrc}
          alt=""
          fill
          className={cn(TRAIL_MAP_IMMERSIVE_IMAGE_CLASS, imageClassName)}
          sizes="100vw"
          priority={priority}
        />
        <div
          className={cn(
            TRAIL_MAP_SCRIM_CLASS,
            "from-background/10 via-transparent to-background/40",
          )}
        />
      </div>
    );
  }

  if (immersive && regionSrc) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <Image
          src={regionSrc}
          alt=""
          fill
          className={cn(TRAIL_MAP_CARD_IMAGE_CLASS, imageClassName)}
          sizes="100vw"
          loading="lazy"
        />
        <div
          className={cn(
            TRAIL_MAP_SCRIM_CLASS,
            "from-background/20 via-background/10 to-background/50",
          )}
        />
      </div>
    );
  }

  if (immersive) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 bg-background", className)} aria-hidden />
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <Image
        src={spineSrc}
        alt=""
        fill
        className={cn(TRAIL_MAP_CARD_IMAGE_CLASS, imageClassName)}
        sizes="(max-width: 512px) 100vw, 512px"
        loading="lazy"
        priority={priority}
      />
      <div className={TRAIL_MAP_SCRIM_CLASS} />
    </div>
  );
}
