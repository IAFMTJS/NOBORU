"use client";

import Image from "next/image";

import {
  TRAIL_MAP_IMAGE_CLASS,
  TRAIL_MAP_SCRIM_CLASS,
} from "@/lib/assets/image-presentation";
import { getTrailMapArtPath, getTrailScrollArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type TrailMapArtworkProps = {
  theme: string | undefined;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  immersive?: boolean;
  regionSlug?: string;
};

export function TrailMapArtwork({
  theme,
  className,
  imageClassName,
  priority = false,
  immersive = false,
  regionSlug,
}: TrailMapArtworkProps) {
  const scrollSrc = immersive ? getTrailScrollArtPath(regionSlug, theme) : null;
  const spineSrc = getTrailMapArtPath(theme);

  if (immersive && scrollSrc) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <Image
          src={scrollSrc}
          alt=""
          fill
          className={cn("object-cover object-top", imageClassName)}
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
        className={cn(TRAIL_MAP_IMAGE_CLASS, imageClassName)}
        sizes="(max-width: 512px) 100vw, 512px"
        priority={priority}
      />
      <div className={TRAIL_MAP_SCRIM_CLASS} />
    </div>
  );
}
