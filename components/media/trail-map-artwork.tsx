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
  /** Lighter scrim when segments stack into one continuous climb. */
  scrim?: "full" | "minimal";
  /** Vertical parallax offset in pixels for immersive scroll art. */
  parallaxOffsetPx?: number;
  /** When false, skip loading heavy scroll artwork (lazy region loading). */
  loadArtwork?: boolean;
  /** Focal point for scroll art cropped into a compact card (percent 0–100). */
  scrollCropFocus?: { x: number; y: number };
};

export function TrailMapArtwork({
  theme,
  className,
  imageClassName,
  priority = false,
  immersive = false,
  regionSlug,
  trailSegmentIndex = 0,
  scrim = "full",
  parallaxOffsetPx = 0,
  loadArtwork = true,
  scrollCropFocus,
}: TrailMapArtworkProps) {
  const scrollSrc =
    hasTrailScrollArt(regionSlug)
      ? getTrailScrollArtPath(regionSlug, theme, trailSegmentIndex)
      : null;
  const regionSrc =
    immersive && !scrollSrc && regionSlug ? getRegionArtPath(regionSlug) : null;
  const spineSrc = getTrailSpineArtPath(theme);
  const compactScrollSrc = !immersive && scrollSrc && trailSegmentIndex > 0 ? scrollSrc : null;

  if (immersive && scrollSrc) {
    if (!loadArtwork) {
      return (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-background/20",
            className,
          )}
          aria-hidden
        />
      );
    }

    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <div
          className="absolute inset-x-0 top-0 w-full"
          style={
            parallaxOffsetPx
              ? { transform: `translate3d(0, ${-parallaxOffsetPx}px, 0)` }
              : undefined
          }
        >
          <Image
            src={scrollSrc}
            alt=""
            width={1200}
            height={2400}
            className={cn(TRAIL_MAP_IMMERSIVE_IMAGE_CLASS, imageClassName)}
            sizes="100vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>
        <div
          className={cn(
            TRAIL_MAP_SCRIM_CLASS,
            scrim === "minimal"
              ? "from-transparent via-transparent to-background/15"
              : "from-background/10 via-transparent to-background/40",
          )}
        />
      </div>
    );
  }

  if (compactScrollSrc) {
    const focusX = scrollCropFocus?.x ?? 50;
    const focusY = scrollCropFocus?.y ?? 50;

    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <Image
          src={compactScrollSrc}
          alt=""
          fill
          className={cn(TRAIL_MAP_IMMERSIVE_IMAGE_CLASS, imageClassName)}
          style={{ objectPosition: `${focusX}% ${focusY}%` }}
          sizes="(max-width: 512px) 100vw, 512px"
          priority={priority}
        />
        <div className={TRAIL_MAP_SCRIM_CLASS} />
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
