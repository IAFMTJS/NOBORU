"use client";

import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import { JOURNEY_WORLD_ASSETS } from "@/lib/assets/art-mappings";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type WorldToriiGateProps = {
  asset?: ArtAssetRef;
  locked?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

/** Doc 11 — unified torii gate for journey and camp transitions. */
export function WorldToriiGate({
  asset = JOURNEY_WORLD_ASSETS.region_gate,
  locked = false,
  className,
  width = 96,
  height = 64,
}: WorldToriiGateProps) {
  return (
    <WorldArtImage
      asset={asset}
      alt=""
      width={width}
      height={height}
      className={cn(
        "object-cover drop-shadow-md",
        locked && "opacity-50 grayscale",
        className,
      )}
    />
  );
}
