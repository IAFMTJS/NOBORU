"use client";

import type { ReactNode } from "react";

import { ArtLibraryImage } from "@/features/prototype/components/art-library-image";
import { cn } from "@/lib/utils";

/** How much room the mascot has — drives responsive scale. */
export type PrototypeMascotLayout = "inline" | "spotlight" | "ambient";

const mascotSizeClasses: Record<PrototypeMascotLayout, string> = {
  /** Inside cards or dense rows — modest, capped size. */
  inline: "h-[clamp(6rem,22vw,7.5rem)] w-[clamp(6rem,22vw,7.5rem)]",
  /** Dedicated mascot beat with breathing room — scales with viewport. */
  spotlight: "h-[clamp(10rem,min(34vh,72vw),18rem)] w-[clamp(10rem,min(34vh,72vw),18rem)]",
  /** Large open area (e.g. study floor) — grows into vertical free space. */
  ambient: "h-[clamp(11rem,min(42vh,78vw),22rem)] w-[clamp(11rem,min(42vh,78vw),22rem)]",
};

const stageClasses: Record<PrototypeMascotLayout, string> = {
  inline: "flex justify-center",
  spotlight: "flex min-h-[clamp(10rem,26vh,14rem)] flex-1 items-center justify-center py-1",
  ambient: "flex min-h-[clamp(9rem,22vh,12rem)] flex-1 items-end justify-center pb-1",
};

type PrototypeMascotProps = {
  themedBase: string;
  alt?: string;
  layout?: PrototypeMascotLayout;
  className?: string;
};

export function PrototypeMascot({
  themedBase,
  alt = "Kitsune companion",
  layout = "spotlight",
  className,
}: PrototypeMascotProps) {
  return (
    <ArtLibraryImage
      themedBase={themedBase}
      src=""
      alt={alt}
      className={cn(
        "shrink-0 object-contain drop-shadow-[0_8px_24px_rgba(94,115,87,0.25)]",
        mascotSizeClasses[layout],
        className,
      )}
    />
  );
}

type PrototypeMascotStageProps = {
  children: ReactNode;
  layout?: PrototypeMascotLayout;
  className?: string;
};

/** Wrapper that lets the mascot expand when the tab has unused space. */
export function PrototypeMascotStage({
  children,
  layout = "spotlight",
  className,
}: PrototypeMascotStageProps) {
  return <div className={cn(stageClasses[layout], className)}>{children}</div>;
}
