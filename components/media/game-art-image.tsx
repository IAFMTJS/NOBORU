"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { stickerImageClass } from "@/lib/assets/image-presentation";
import { getGameArtPath } from "@/lib/assets/registry";

type GameArtImageProps = {
  slug: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function GameArtImage({
  slug,
  alt,
  className,
  sizes = "64px",
}: GameArtImageProps) {
  const src = getGameArtPath(slug);
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      sizes={sizes}
      className={stickerImageClass(className)}
    />
  );
}
