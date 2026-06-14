"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

import { getAuthAtmospherePath } from "@/lib/assets/registry";
import { resolveSceneBackgroundPresentation } from "@/lib/assets/image-presentation";

export function AuthAtmosphere() {
  const { resolvedTheme } = useTheme();
  const src = getAuthAtmospherePath(resolvedTheme);
  const presentation = resolveSceneBackgroundPresentation();

  if (!src) {
    return (
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 object-cover"
      style={{
        objectFit: presentation.objectFit,
        objectPosition: presentation.objectPosition,
      }}
      sizes="100vw"
    />
  );
}
