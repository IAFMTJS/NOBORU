import {
  JOURNEY_SCROLL_ART_ASPECT,
  JOURNEY_SCROLL_ART_HEIGHT,
  JOURNEY_SCROLL_ART_WIDTH,
} from "@/lib/design-system/journey-path-contracts";

export type TrailScrollPresentation = {
  objectFit: "cover";
  objectPosition: string;
  width: number;
  height: number;
  aspectRatio: number;
};

export type CharacterStickerPresentation = {
  objectFit: "cover";
  objectPosition: string;
  /** Zoom past square canvas padding in source art. */
  scale: number;
};

export const CHARACTER_STICKER_SCALE = 1.15;

export function resolveTrailScrollPresentation(options?: {
  scrollCropFocus?: { x: number; y: number };
  parallaxOffsetPx?: number;
}): TrailScrollPresentation {
  const focusX = options?.scrollCropFocus?.x ?? 50;
  const focusY = options?.scrollCropFocus?.y ?? 50;
  const parallax = options?.parallaxOffsetPx ?? 0;

  return {
    objectFit: "cover",
    objectPosition: `${focusX}% calc(${focusY}% + ${parallax}px)`,
    width: JOURNEY_SCROLL_ART_WIDTH,
    height: JOURNEY_SCROLL_ART_HEIGHT,
    aspectRatio: JOURNEY_SCROLL_ART_ASPECT,
  };
}

export function resolveCharacterStickerPresentation(): CharacterStickerPresentation {
  return {
    objectFit: "cover",
    objectPosition: "center bottom",
    scale: CHARACTER_STICKER_SCALE,
  };
}

export function resolveSceneBackgroundPresentation(): { objectFit: "cover"; objectPosition: string } {
  return {
    objectFit: "cover",
    objectPosition: "center center",
  };
}
