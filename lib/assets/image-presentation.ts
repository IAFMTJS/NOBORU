import { cn } from "@/lib/utils";

/** Slightly overscale so characters fill their frame without cropping limbs. */
export const STICKER_FIT_CLASS = "object-contain object-center scale-[1.15]";

export function stickerImageClass(className?: string) {
  return cn(STICKER_FIT_CLASS, className);
}

/** Full-scene region banners — focus on the path/landscape center. */
export const REGION_HERO_IMAGE_CLASS =
  "object-cover object-[center_42%] scale-105";

/** Vertical trail spine art — transparent PNG centered in frame. */
export const TRAIL_SPINE_FRAME_CLASS =
  "pointer-events-none absolute inset-y-0 left-1/2 w-[38%] min-w-[7rem] max-w-[12rem] -translate-x-1/2 overflow-hidden opacity-40";

export const TRAIL_SPINE_IMAGE_CLASS = "object-contain object-center";
