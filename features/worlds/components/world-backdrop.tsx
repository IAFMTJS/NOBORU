"use client";

import type { JlptWorldTheme } from "@/features/worlds/types/world.types";
import { cn } from "@/lib/utils";

type WorldBackdropProps = {
  theme: JlptWorldTheme;
  className?: string;
};

/** Atmospheric backdrop for a single JLPT world. */
export function WorldBackdrop({ theme, className }: WorldBackdropProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
      data-world-backdrop
    >
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${theme.accentColor}22, transparent 60%), ${theme.backgroundLight}`,
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 100%, ${theme.accentGlow}, transparent 55%), ${theme.backgroundDark}`,
        }}
      />
    </div>
  );
}
