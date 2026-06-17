"use client";

import { useTheme } from "next-themes";

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
  renderMode?: "default" | "icon";
  presentation?: WorldArtPresentation;
};

/** Renders a legacy ArtAssetRef via the published Art Library catalog. */
export function WorldArtImage({
  asset,
  alt,
  width,
  height,
  className,
  presentation = "default",
  renderMode = "default",
}: WorldArtImageProps) {
  const { resolvedTheme } = useTheme();
  const src = resolveArtAsset(asset, resolvedTheme);
  if (!src) return null;

  const isIcon = presentation === "icon" || renderMode === "icon";
  const isBackground = presentation === "background";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Art Library static assets
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        isBackground && "size-full min-h-full min-w-full object-cover object-center",
        isIcon && "object-contain",
        !isBackground && !isIcon && "max-w-full object-contain",
        presentation === "glow" && "mix-blend-screen",
        className,
      )}
      draggable={false}
    />
  );
}
