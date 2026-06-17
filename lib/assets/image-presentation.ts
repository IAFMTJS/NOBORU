export type CharacterStickerPresentation = {
  objectFit: "cover";
  objectPosition: string;
  /** Zoom past square canvas padding in source art. */
  scale: number;
};

export const CHARACTER_STICKER_SCALE = 1.15;

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
