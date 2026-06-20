"use client";

import { motion, useReducedMotion } from "framer-motion";

import { resolveWorldPortalYPercent } from "@/features/worlds/utils/world-layout.utils";
import type { WorldPortalState } from "@/features/worlds/types/world.types";
import type { JlptLevel } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type WorldPortalProps = {
  portal: WorldPortalState;
  accentColor: string;
  accentGlow: string;
  worldId: JlptLevel;
  onActivate: () => void;
  className?: string;
};

/** Large portal at the crown of a JLPT world — transitions to the next realm. */
export function WorldPortal({
  portal,
  accentColor,
  accentGlow,
  worldId,
  onActivate,
  className,
}: WorldPortalProps) {
  const prefersReducedMotion = useReducedMotion();
  const yPercent = resolveWorldPortalYPercent(worldId);

  if (!portal.visible) return null;

  return (
    <div
      className={cn("pointer-events-none absolute inset-x-0 z-20", className)}
      style={{ top: `${yPercent}%` }}
      data-world-portal
      data-portal-unlocked={portal.unlocked ? "true" : "false"}
    >
      <div className="relative flex -translate-y-1/2 flex-col items-center px-6">
        <motion.button
          type="button"
          disabled={!portal.unlocked}
          onClick={portal.unlocked ? onActivate : undefined}
          className={cn(
            "pointer-events-auto relative flex h-28 w-28 items-center justify-center rounded-full border-4 sm:h-32 sm:w-32",
            portal.unlocked
              ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              : "cursor-not-allowed opacity-60",
          )}
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 32px ${accentGlow}, inset 0 0 24px ${accentGlow}`,
            background: `radial-gradient(circle at 50% 40%, ${accentColor}88, ${accentColor}22 70%, transparent)`,
          }}
          aria-label={portal.label}
          animate={
            prefersReducedMotion || !portal.unlocked
              ? undefined
              : {
                  scale: [1, 1.04, 1],
                  opacity: [0.92, 1, 0.92],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          whileTap={portal.unlocked && !prefersReducedMotion ? { scale: 0.96 } : undefined}
        >
          <span
            className="text-3xl font-bold uppercase tracking-wider text-white drop-shadow-md sm:text-4xl"
            aria-hidden
          >
            {portal.nextWorldId?.toUpperCase() ?? "★"}
          </span>
        </motion.button>

        <div className="pointer-events-none mt-3 max-w-xs text-center">
          <p className="text-sm font-semibold text-foreground">{portal.label}</p>
          <p className="mt-0.5 text-caption text-muted-foreground">
            {portal.unlocked
              ? portal.description
              : "Complete the final trial to unlock this portal."}
          </p>
        </div>
      </div>
    </div>
  );
}
