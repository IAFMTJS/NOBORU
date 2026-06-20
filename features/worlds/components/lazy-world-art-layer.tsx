"use client";

import { useEffect, useState, type ComponentType } from "react";

import type { JlptLevel } from "@/lib/content/types";

type WorldArtProps = {
  className?: string;
};

type WorldArtLoader = () => Promise<{ default: ComponentType<WorldArtProps> }>;

const WORLD_ART_LOADERS: Record<JlptLevel, WorldArtLoader> = {
  n5: () => import("@/features/worlds/worlds/n5/n5-world-art"),
  n4: () => import("@/features/worlds/worlds/n4/n4-world-art"),
  n3: () => import("@/features/worlds/worlds/n3/n3-world-art"),
  n2: () => import("@/features/worlds/worlds/n2/n2-world-art"),
  n1: () => import("@/features/worlds/worlds/n1/n1-world-art"),
};

type LazyWorldArtLayerProps = {
  worldId: JlptLevel;
  className?: string;
};

/**
 * Loads world art on demand and unloads when the world changes or unmounts.
 * Only one world's art chunk is in memory at a time.
 */
export function LazyWorldArtLayer({ worldId, className }: LazyWorldArtLayerProps) {
  const [ArtComponent, setArtComponent] = useState<ComponentType<WorldArtProps> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    setArtComponent(null);

    WORLD_ART_LOADERS[worldId]()
      .then((module) => {
        if (!cancelled) {
          setArtComponent(() => module.default);
        }
      })
      .catch(() => {
        if (!cancelled) setArtComponent(null);
      });

    return () => {
      cancelled = true;
      setArtComponent(null);
    };
  }, [worldId]);

  if (!ArtComponent) return null;

  return <ArtComponent className={className} />;
}
