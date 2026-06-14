"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/visual/glass-panel";
import { cn } from "@/lib/utils";

type JourneyStatusBarProps = {
  displayName: string;
  levelLabel: string;
  currentStreak: number;
  totalXp: number;
  className?: string;
};

export function JourneyStatusBar({
  displayName,
  levelLabel,
  currentStreak,
  totalXp,
  className,
}: JourneyStatusBarProps) {
  return (
    <GlassPanel
      variant="header"
      className={cn(
        "absolute inset-x-4 top-4 z-30 flex items-center gap-3 px-3 py-2",
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-foreground">{displayName}</p>
        <p className="text-caption text-muted-foreground">Level {levelLabel}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-caption">
        <span className="text-trail-glow" title="Current streak">
          {currentStreak}d
        </span>
        <span className="text-reward" title="Total XP">
          {totalXp.toLocaleString()}
        </span>
      </div>
    </GlassPanel>
  );
}
