import { cn } from "@/lib/utils";

/** Slightly overscale so characters fill their frame without cropping limbs. */
export const STICKER_FIT_CLASS = "object-contain object-center scale-[1.15]";

export function stickerImageClass(className?: string) {
  return cn(STICKER_FIT_CLASS, className);
}

/** Full-scene region banners — focus on the path/landscape center. */
export const REGION_HERO_IMAGE_CLASS =
  "object-cover object-[center_42%] scale-105";

/** Region hero fallback in immersive mode when scroll art is unavailable. */
export const TRAIL_MAP_IMAGE_CLASS =
  "object-cover object-[center_38%]";

/** Card/unit trail maps — spine art must not crop or anchors misalign with touches. */
export const TRAIL_MAP_CARD_IMAGE_CLASS =
  "object-contain object-center";

/** Immersive Learn — preserve full scroll art so node anchors match painted path. */
export const TRAIL_MAP_IMMERSIVE_IMAGE_CLASS =
  "object-contain object-top w-full h-auto min-h-full";

/** Keeps lesson labels readable over bright/dark trail art. */
export const TRAIL_MAP_SCRIM_CLASS =
  "absolute inset-0 bg-gradient-to-b from-background/25 via-background/5 to-background/45";

/** Subtle top fade so the floating Learn header stays readable. */
export const TRAIL_MAP_IMMERSIVE_HEADER_SCRIM_CLASS =
  "pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-background/80 via-background/35 to-transparent";
