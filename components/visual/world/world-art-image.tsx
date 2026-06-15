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
};

export function WorldArtImage({
  asset,
  alt,
  width,
  height,
  className,
  priority,
}: WorldArtImageProps) {
  return (
    <Image
      src={resolveArtAsset(asset)}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
