"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { cn } from "@/lib/utils";

type JourneyStatusBarProps = {
  displayName: string;
  levelLabel: string;
  currentStreak: number;
  totalXp: number;
  regionName: string;
  completedCount: number;
  lessonCount: number;
  progressPercent: number;
  onRegionClick: () => void;
  className?: string;
};

export function JourneyStatusBar({
  displayName,
  levelLabel,
  currentStreak,
  totalXp,
  regionName,
  completedCount,
  lessonCount,
  progressPercent,
  onRegionClick,
  className,
}: JourneyStatusBarProps) {
  return (
    <header
      className={cn(
        "absolute inset-x-3 top-3 z-30 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-2 py-1.5 backdrop-blur-md sm:inset-x-4 sm:gap-3 sm:px-3 sm:py-2",
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/25 text-xs font-semibold text-primary sm:h-9 sm:w-9 sm:text-sm"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>

      <div className="hidden min-w-0 sm:block sm:max-w-[5rem]">
        <p className="truncate text-caption font-medium text-white">{displayName}</p>
        <p className="text-[10px] text-white/55">Lv {levelLabel}</p>
      </div>

      <button
        type="button"
        onClick={onRegionClick}
        className="mx-auto inline-flex min-w-0 max-w-[40%] shrink items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-caption font-medium text-white sm:max-w-none sm:px-3 sm:py-1.5 sm:text-body-sm"
      >
        <span className="truncate">{regionName}</span>
        <UiIconImage name="chevron_down" size={14} className="shrink-0 opacity-80" />
      </button>

      <p className="hidden shrink-0 text-caption tabular-nums text-trail-glow md:block">
        {completedCount}/{lessonCount} · {progressPercent}%
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-2 text-caption text-white/90">
        <span className="inline-flex items-center gap-0.5" title="Current streak">
          <UiIconImage name="flame" size={12} />
          {currentStreak}
        </span>
        <span className="hidden items-center gap-0.5 text-reward sm:inline-flex" title="Total XP">
          <UiIconImage name="gem" size={12} />
          {totalXp.toLocaleString()}
        </span>
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 hover:bg-black/50"
          aria-label="Settings"
        >
          <UiIconImage name="settings" size={16} />
        </Link>
      </div>
    </header>
  );
}
