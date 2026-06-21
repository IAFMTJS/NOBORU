"use client";

import { useTheme } from "next-themes";

import {
  artLibraryPath,
  artLibraryThemedPath,
  type ArtLibraryTheme,
} from "@/lib/assets/art-library-paths";
import { cn } from "@/lib/utils";

type ArtLibraryImageProps = {
  /** Path under Art Library, e.g. icons/icon_ui_gem_light_v1.png (served as .webp when published) */
  src: string;
  /** Base path without theme suffix */
  themedBase?: string;
  theme?: ArtLibraryTheme;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  /** Fill parent with object-cover — no max-width cap. */
  cover?: boolean;
  priority?: boolean;
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
  width,
  height,
  cover = false,
  priority = false,
}: ArtLibraryImageProps) {
  const { resolvedTheme } = useTheme();
  const theme = resolveTheme(themeProp, resolvedTheme);
  const url = resolveSrc(src, themedBase, theme);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- Art Library static assets
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn(
        cover ? "size-full min-h-full min-w-full object-cover object-center" : "max-w-full",
        className,
      )}
      draggable={false}
    />
  );
}
