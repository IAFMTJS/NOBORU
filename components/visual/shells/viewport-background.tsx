"use client";

import type { ReactNode } from "react";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import { cn } from "@/lib/utils";

export const viewportBgShellClass =
  "pointer-events-none fixed inset-0 z-0 h-dvh w-screen overflow-hidden";

export const viewportBgImageClass =
  "absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center";

export const viewportScrimClass = "absolute inset-0 h-full w-full";

type ViewportBackgroundProps = {
  src: string;
  scrimClassName?: string;
  imageClassName?: string;
};

export function ViewportBackground({
  src,
  scrimClassName,
  imageClassName,
}: ViewportBackgroundProps) {
  return (
    <div className={viewportBgShellClass}>
      <ArtLibraryImage src={src} alt="" className={cn(viewportBgImageClass, imageClassName)} cover />
      {scrimClassName ? (
        <div className={cn(viewportScrimClass, scrimClassName)} aria-hidden />
      ) : null}
    </div>
  );
}

/** Foreground content above a fixed viewport background. */
export function TabScene({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("relative z-10 min-h-full w-full", className)}>{children}</div>;
}
