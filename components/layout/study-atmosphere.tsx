"use client";

import type { ReactNode } from "react";
import { useTheme } from "next-themes";

import { getSceneArtPath } from "@/lib/assets/registry";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { cn } from "@/lib/utils";

type StudyAtmosphereProps = {
  children: ReactNode;
  className?: string;
};

export function StudyAtmosphere({ children, className }: StudyAtmosphereProps) {
  const { resolvedTheme } = useTheme();
  const background = getSceneArtPath("study_atmosphere", resolvedTheme);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {background ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- Art Library static assets */}
          <img
            src={background}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover object-center opacity-35"
            aria-hidden
          />
          <div className="absolute inset-0 bg-background/55" aria-hidden />
        </>
      ) : null}
      <div className={cn("relative", glassSurface.card, "space-y-3 p-4")}>{children}</div>
    </div>
  );
}
