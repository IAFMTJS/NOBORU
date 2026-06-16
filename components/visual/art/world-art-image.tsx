"use client";

import Image from "next/image";

import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { resolveArtAsset } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

export type WorldArtPresentation = "default" | "icon" | "prop" | "glow" | "background";

type WorldArtImageProps = {
  asset: ArtAssetRef;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /** @deprecated Use presentation */
  renderMode?: "default" | "icon";
  presentation?: WorldArtPresentation;
};

const PRESENTATION_CLASS: Record<WorldArtPresentation, string> = {
  default: "object-contain",
  icon: "object-contain object-center",
  prop: "object-contain object-bottom drop-shadow-lg",
  glow: "object-contain object-center mix-blend-screen",
  background: "object-cover object-center",
};

export function WorldArtImage({
  asset,
  alt,
  width,
  height,
  className,
  priority,
  renderMode = "default",
  presentation,
}: WorldArtImageProps) {
  const resolvedPresentation =
    presentation ?? (renderMode === "icon" ? "icon" : "default");

  return (
    <Image
      src={resolveArtAsset(asset)}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn(PRESENTATION_CLASS[resolvedPresentation], className)}
    />
  );
}
