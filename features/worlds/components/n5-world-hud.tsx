"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/visual";
import { cn } from "@/lib/utils";

import {
  N5_WORLD_SUBTITLE,
  N5_WORLD_TITLE,
} from "@/features/worlds/constants/n5-world.constants";

type N5WorldHudProps = {
  actLabel: string;
  completedLessons: number;
  totalLessons: number;
  displayName?: string | null;
  levelLabel?: string | null;
  currentStreak?: number;
  worldMapHref?: string;
};

export function N5WorldHud({
  actLabel,
  completedLessons,
  totalLessons,
  displayName,
  levelLabel,
  currentStreak,
  worldMapHref = "/learn/world",
}: N5WorldHudProps) {
  return (
    <GlassPanel
      variant="header"
      className="pointer-events-auto absolute inset-x-3 top-3 z-30 space-y-2 px-3 py-2"
    >
      <div className="flex items-center gap-2">
        {displayName ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-caption font-semibold text-primary">
            {displayName.charAt(0)}
          </span>
        ) : null}
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-body-sm font-semibold text-foreground">{N5_WORLD_TITLE}</p>
          <p className="truncate text-caption text-muted-foreground">{N5_WORLD_SUBTITLE}</p>
        </div>
        {worldMapHref ? (
          <Link
            href={worldMapHref}
            className="focus-ring shrink-0 rounded-full border border-border/60 px-2 py-1 text-caption text-muted-foreground"
          >
            Map
          </Link>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full border border-trail-glow/30 bg-trail-glow/10 px-2.5 py-0.5 text-caption font-medium text-foreground",
          )}
        >
          {actLabel}
        </span>
        <p className="text-caption text-muted-foreground">
          {completedLessons}/{totalLessons} lessons
        </p>
        {levelLabel ? (
          <p className="text-caption text-muted-foreground">
            {levelLabel}
            {currentStreak != null ? ` · ${currentStreak}d` : ""}
          </p>
        ) : null}
      </div>
    </GlassPanel>
  );
}
