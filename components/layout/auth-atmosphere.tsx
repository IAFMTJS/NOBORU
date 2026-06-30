"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { resolveArtLibraryImageSizes } from "@/lib/assets/art-library-image-presentation";
import { getAuthAtmospherePath } from "@/lib/assets/registry";

export function AuthAtmosphere() {
  const { resolvedTheme } = useTheme();
  const src = getAuthAtmospherePath(resolvedTheme);

  if (!src) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes={resolveArtLibraryImageSizes("hero")}
        className="object-cover object-center opacity-50"
      />
      <div className="absolute inset-0 bg-background/70" />
    </div>
  );
}
