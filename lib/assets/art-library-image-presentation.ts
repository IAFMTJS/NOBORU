/** Responsive `sizes` presets — see docs/asset-delivery.md */
export const ART_LIBRARY_IMAGE_SIZES = {
  icon: "48px",
  thumbnail: "(max-width: 640px) 64px, 80px",
  card: "(max-width: 640px) 100vw, 480px",
  hero: "(max-width: 768px) 100vw, 1200px",
  presence: "(max-width: 640px) 120px, 160px",
} as const;

export type ArtLibraryImageSizePreset = keyof typeof ART_LIBRARY_IMAGE_SIZES;

export function resolveArtLibraryImageSizes(
  preset?: ArtLibraryImageSizePreset,
): string {
  if (!preset) {
    return ART_LIBRARY_IMAGE_SIZES.hero;
  }
  return ART_LIBRARY_IMAGE_SIZES[preset];
}
