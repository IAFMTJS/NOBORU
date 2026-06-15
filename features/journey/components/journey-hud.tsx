"use client";

import Link from "next/link";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { StoryTitle } from "@/components/visual/story-title";
import { YamaPresence } from "@/features/yama/components/yama-presence";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";

type JourneyHudProps = {
  displayName: string;
  levelLabel: string;
  regionName: string;
  onRegionOverview: () => void;
  className?: string;
};

/** Minimal journey HUD — profile and place, not a dashboard (VISUAL MD FILES Doc 02 / Doc 10). */
export function JourneyHud({
  displayName,
  levelLabel,
  regionName,
  onRegionOverview,
  className,
}: JourneyHudProps) {
  return (
    <header
      className={cn(
        "absolute inset-x-3 top-3 z-30 flex items-center gap-2 rounded-card border border-white/10 bg-black/45 px-2 py-1.5 backdrop-blur-md sm:inset-x-4 sm:px-3 sm:py-2",
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary sm:h-9 sm:w-9 sm:text-sm"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>

      <button
        type="button"
        onClick={onRegionOverview}
        className="mx-auto inline-flex min-w-0 max-w-[55%] items-center gap-1 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 sm:max-w-none"
      >
        <StoryTitle as="h1" className="truncate text-xs sm:text-sm text-white">
          {regionName}
        </StoryTitle>
        <UiIconImage name="chevron_down" size={14} className="shrink-0 opacity-70" />
      </button>

      <p className="ml-auto shrink-0 text-caption text-white/75">Lv {levelLabel}</p>

      <YamaPresence
        presence={yamaService.resolveNavPresence("journey")}
        size="xs"
        showMessage={false}
        className="ml-1 shrink-0"
      />
    </header>
  );
}
