"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { REGION_VISUALS } from "@/lib/design-system/region-tokens";
import type { WorldMapRegionViewModel } from "@/features/world-map/types/world-map.types";
import { cn } from "@/lib/utils";
import { glassClass, resolveVisualTier } from "@/lib/performance/visual-tier";

type WorldMapRegionNodeProps = {
  region: WorldMapRegionViewModel;
};

export function WorldMapRegionNode({ region }: WorldMapRegionNodeProps) {
  const tier = resolveVisualTier();
  const glass = glassClass(tier);
  const tokens = REGION_VISUALS[region.slug];
  const isLocked = region.availability === "locked";
  const isCompleted = region.availability === "completed";

  const content = (
    <div
      className={cn(
        "w-[min(11rem,42vw)] rounded-2xl border p-3 transition-all",
        glass,
        tokens?.border,
        isLocked && "opacity-45 saturate-50",
        region.isCurrent && "border-primary/50 ring-2 ring-primary/30 shadow-elevation-2",
        isCompleted && !region.isCurrent && "border-success/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-medium",
              region.isCurrent && "text-primary",
            )}
          >
            {region.name}
          </p>
          {tokens?.badge ? (
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-medium",
                tokens.badge,
              )}
            >
              {tokens.label}
            </span>
          ) : null}
        </div>
        {isLocked ? (
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : (
          <span className="shrink-0 text-caption font-medium tabular-nums">
            {region.progressPercent}%
          </span>
        )}
      </div>
      <ProgressBar
        value={region.progressPercent}
        className="mt-2"
        showValue={false}
        indicatorClassName={isCompleted ? "bg-success" : undefined}
      />
    </div>
  );

  const ariaLabel = isLocked
    ? `${region.name}, locked region, ${region.progressPercent}% progress`
    : region.isCurrent
      ? `${region.name}, current region, ${region.progressPercent}% progress`
      : `${region.name}, ${region.progressPercent}% progress`;

  if (isLocked) {
    return (
      <div
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${region.position.x}%`,
          top: `${region.position.y}%`,
        }}
        aria-label={ariaLabel}
        role="img"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={region.href}
      className={cn(
        "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      style={{
        left: `${region.position.x}%`,
        top: `${region.position.y}%`,
      }}
      aria-label={ariaLabel}
      aria-current={region.isCurrent ? "location" : undefined}
    >
      {content}
    </Link>
  );
}
