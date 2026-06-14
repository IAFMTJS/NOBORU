"use client";

import Image from "next/image";

import { getGameArtPath } from "@/lib/assets/registry";
import { cn } from "@/lib/utils";

type GameArtImageProps = {
  slug: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function GameArtImage({ slug, alt, className, sizes }: GameArtImageProps) {
  const src = getGameArtPath(slug);

  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("h-16 w-16 shrink-0 rounded-xl bg-muted/40", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      sizes={sizes ?? "64px"}
      className={cn("h-16 w-16 shrink-0 rounded-xl object-contain", className)}
    />
  );
}
