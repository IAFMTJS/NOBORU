"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getSceneArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

export type SceneId =
  | "camp_base"
  | "dojo_forest"
  | "shrine_torii"
  | "world_map_peaks"
  | "shop_interior"
  | "lesson_complete"
  | "checkpoint_shrine";

type SceneImageProps = {
  scene: SceneId;
  alt?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
};

export function SceneImage({
  scene,
  alt = "",
  className,
  priority,
  fill = true,
}: SceneImageProps) {
  const { resolvedTheme } = useTheme();
  const src = getSceneArtPath(scene, resolvedTheme);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={cn("object-cover object-center", className)}
      sizes="100vw"
    />
  );
}
