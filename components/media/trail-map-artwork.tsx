"use client";

import Image from "next/image";

import {
  TRAIL_MAP_IMAGE_CLASS,
  TRAIL_MAP_SCRIM_CLASS,
} from "@/lib/assets/image-presentation";
import { getTrailMapArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type TrailMapArtworkProps = {
  theme: string | undefined;
  className?: string;
  priority?: boolean;
};

export function TrailMapArtwork({
  theme,
  className,
  priority = false,
}: TrailMapArtworkProps) {
  const src = getTrailMapArtPath(theme);

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        className={TRAIL_MAP_IMAGE_CLASS}
        sizes="(max-width: 512px) 100vw, 512px"
        priority={priority}
      />
      <div className={TRAIL_MAP_SCRIM_CLASS} />
    </div>
  );
}
