import { cn } from "@/lib/utils";

/** Slightly overscale so characters fill their frame without cropping limbs. */
export const STICKER_FIT_CLASS = "object-contain object-center scale-[1.15]";

export function stickerImageClass(className?: string) {
  return cn(STICKER_FIT_CLASS, className);
}

/** Full-scene region banners — focus on the path/landscape center. */
export const REGION_HERO_IMAGE_CLASS =
  "object-cover object-[center_42%] scale-105";

/** Full illustrated trail map scene — dark/light artwork fills the frame. */
export const TRAIL_MAP_IMAGE_CLASS =
  "object-cover object-[center_38%]";

/** Keeps lesson labels readable over bright/dark trail art. */
export const TRAIL_MAP_SCRIM_CLASS =
  "absolute inset-0 bg-gradient-to-b from-background/25 via-background/5 to-background/45";
