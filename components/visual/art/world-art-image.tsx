import type { ArtAssetRef } from "@/lib/assets/art-mappings";

export type WorldArtPresentation = "default" | "icon" | "prop" | "glow" | "background";

type WorldArtImageProps = {
  asset: ArtAssetRef;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  renderMode?: "default" | "icon";
  presentation?: WorldArtPresentation;
};

/** Stub — visuals stripped. */
export function WorldArtImage(_props: WorldArtImageProps) {
  return null;
}
