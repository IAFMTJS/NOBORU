"use client";

import type { ReactNode } from "react";

import type { SceneId } from "@/components/media/scene-image";
import { glassSurface } from "@/components/visual/primitives/glass-surface";
import { IllustratedScreen } from "@/components/visual/illustrated-screen";
import { cn } from "@/lib/utils";

type LessonShellProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  /** @deprecated App shell provides route background */
  scene?: SceneId;
  className?: string;
};

/**
 * Doc 03 lesson layer stack — glass HUD overlay and thumb-zone footer.
 */
export function LessonShell({
  children,
  header,
  footer,
  className,
}: LessonShellProps) {
  return (
    <IllustratedScreen
      className={cn("min-h-[calc(100dvh-var(--nav-clearance))]", className)}
    >
      <div className="relative flex min-h-[inherit] flex-col">
        {header}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-[calc(3.75rem+env(safe-area-inset-top))]">
          {children}
        </div>
        {footer ? (
          <div
            className={cn(
              "sticky bottom-0 z-20 border-t px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3",
              glassSurface.sheet,
              "rounded-none border-x-0",
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </IllustratedScreen>
  );
}
