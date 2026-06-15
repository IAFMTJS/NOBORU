"use client";

import type { ReactNode } from "react";

import { SceneImage } from "@/components/media/scene-image";
import type { SceneId } from "@/components/media/scene-image";
import { IllustratedScreen } from "@/components/visual/illustrated-screen";
import { cn } from "@/lib/utils";

type LessonShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  scene?: SceneId;
  className?: string;
};

/**
 * Doc 03 lesson layer stack — illustrated world with HUD overlay and thumb-zone footer.
 */
export function LessonShell({
  children,
  header,
  footer,
  scene = "study_atmosphere",
  className,
}: LessonShellProps) {
  return (
    <IllustratedScreen
      scrim="minimal"
      fullBleedBackground
      className={cn("min-h-[calc(100dvh-5.5rem-env(safe-area-inset-bottom))]", className)}
      background={
        <SceneImage
          scene={scene}
          alt=""
          className="absolute inset-0 min-h-full rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-[inherit] flex-col">
        {header}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-[calc(3.75rem+env(safe-area-inset-top))]">
          {children}
        </div>
        {footer ? (
          <div className="sticky bottom-0 z-20 border-t border-white/10 bg-black/55 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
            {footer}
          </div>
        ) : null}
      </div>
    </IllustratedScreen>
  );
}
