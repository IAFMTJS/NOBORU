"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import type { CSSProperties } from "react";

import {
  artLibraryPath,
  artLibraryThemedPath,
  type ArtLibraryTheme,
} from "@/lib/assets/art-library-paths";
import {
  resolveArtLibraryImageSizes,
  type ArtLibraryImageSizePreset,
} from "@/lib/assets/art-library-image-presentation";
import { cn } from "@/lib/utils";

type ArtLibraryImageProps = {
  /** Path under Art Library, e.g. icons/icon_ui_gem_light_v1.png (served as .webp when published) */
  src: string;
  /** Base path without theme suffix */
  themedBase?: string;
  theme?: ArtLibraryTheme;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  /** Fill parent with object-cover — uses next/image for responsive delivery. */
  cover?: boolean;
  priority?: boolean;
  /** Responsive sizes preset when cover=true — defaults to hero. */
  sizePreset?: ArtLibraryImageSizePreset;
};

function resolveSrc(
  src: string,
  themedBase: string | undefined,
  theme: ArtLibraryTheme,
): string {
  if (src.startsWith("/art-library/") || src.startsWith("/api/art-library/")) {
    return src;
  }
  if (themedBase) {
    const file = `${themedBase.split("/").pop()}_${theme}_v1.png`;
    const folder = themedBase.replace(/\/[^/]+$/, "");
    return artLibraryPath(`${folder}/${file}`);
  }
  if (src.includes("_light_") || src.includes("_dark_")) {
    return artLibraryPath(artLibraryThemedPath(src, theme));
  }
  return artLibraryPath(src);
}

export function resolveArtLibraryImageSrc(
  src: string,
  theme: ArtLibraryTheme = "light",
  themedBase?: string,
): string {
  return resolveSrc(src, themedBase, theme);
}

function resolveTheme(
  themeProp: ArtLibraryTheme | undefined,
  resolvedTheme: string | undefined,
): ArtLibraryTheme {
  if (themeProp) return themeProp;
  return resolvedTheme === "light" ? "light" : "dark";
}

/** Art Library asset — theme-aware light/dark variants. */
export function ArtLibraryImage({
  src,
  themedBase,
  theme: themeProp,
  alt = "",
  className,
  style,
  width,
  height,
  cover = false,
  priority = false,
  sizePreset,
}: ArtLibraryImageProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolveTheme(themeProp, resolvedTheme);
  const url = resolveSrc(src, themedBase, theme);

  if (cover) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={resolveArtLibraryImageSizes(sizePreset)}
        className={cn("object-cover object-center", className)}
        style={style}
        draggable={false}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- small icons skip optimizer overhead
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("max-w-full", className)}
      style={style}
      draggable={false}
    />
  );
}
