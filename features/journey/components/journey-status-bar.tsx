"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
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
    <div
      className={cn(
        "absolute inset-x-4 top-4 z-30 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md",
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/25 text-sm font-semibold text-primary"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-white">{displayName}</p>
        <p className="text-caption text-white/60">Level {levelLabel}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-caption text-white/90">
        <span className="inline-flex items-center gap-1" title="Current streak">
          <UiIconImage name="flame" size={14} />
          {currentStreak}
        </span>
        <span className="inline-flex items-center gap-1 text-reward" title="Total XP">
          <UiIconImage name="gem" size={14} />
          {totalXp.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
