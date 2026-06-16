"use client";

import Image from "next/image";

import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { resolveArtAsset } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

type WorldArtImageProps = {
  asset: ArtAssetRef;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  renderMode?: "default" | "icon";
};

export function WorldArtImage({
  asset,
  alt,
  width,
  height,
  className,
  priority,
  renderMode = "default",
}: WorldArtImageProps) {
  return (
    <Image
      src={resolveArtAsset(asset)}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn(
        renderMode === "icon"
          ? "object-contain object-center"
          : "object-contain",
        className,
      )}
    />
  );
}
