"use client";

import { getJourneyPathSpine } from "@/lib/design-system/journey-path-contracts";
import { cn } from "@/lib/utils";

import { N5_WORLD_SLUG } from "@/features/worlds/constants/n5-world.constants";

type N5WorldSpinePathProps = {
  className?: string;
  theme?: "light" | "dark";
};

function pointsToSvgPath(
  points: ReadonlyArray<{ x: number; y: number }>,
): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first!.x} ${first!.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(" ")}`;
}

/** Winding spine polyline — nodes sit on this path. */
export function N5WorldSpinePath({ className, theme = "dark" }: N5WorldSpinePathProps) {
  const spine = getJourneyPathSpine(N5_WORLD_SLUG, { theme });
  const d = pointsToSvgPath(spine);

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke="hsl(var(--trail-glow) / 0.22)"
        strokeWidth="0.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={d}
        fill="none"
        stroke="hsl(var(--trail-glow) / 0.45)"
        strokeWidth="0.28"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray="1.2 2.4"
      />
    </svg>
  );
}
