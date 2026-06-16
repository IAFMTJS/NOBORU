"use client";

import Link from "next/link";

import { ArtLibraryImage } from "@/components/media/art-library-image";
import {
  GlassSurfaceChip,
  GlassSurfacePanel,
  glassSurface,
} from "@/components/visual/primitives/glass-surface";
import { resolveDisplayGemCount } from "@/components/visual/tokens";
import { cn } from "@/lib/utils";

type JourneyHudProps = {
  displayName: string;
  levelLabel: string;
  regionName: string;
  currentStreak?: number;
  totalXp?: number;
  onRegionOverview: () => void;
  className?: string;
};

/** Journey HUD — glass profile chip, region, streak, gems. */
export function JourneyHud({
  displayName,
  levelLabel,
  regionName,
  currentStreak = 0,
  totalXp = 0,
  onRegionOverview,
  className,
}: JourneyHudProps) {
  const gemCount = resolveDisplayGemCount(totalXp);

  return (
    <header
      className={cn(
        "pointer-events-auto absolute inset-x-3 top-3 z-30 flex items-center gap-1.5 px-2 py-1.5",
        glassSurface.hud,
        className,
      )}
    >
      <Link
        href="/profile"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-caption font-semibold text-primary backdrop-blur-sm"
        aria-label={`Profile: ${displayName}`}
      >
        {displayName.charAt(0).toUpperCase()}
      </Link>

      <button
        type="button"
        onClick={onRegionOverview}
        className={cn(glassSurface.chip, "focus-ring mx-auto max-w-[48%] px-2.5 py-1")}
      >
        <span className="truncate font-sans text-body font-semibold uppercase">{regionName}</span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <p className="text-caption text-muted-foreground">Lv {levelLabel}</p>
        <GlassSurfaceChip>
          <ArtLibraryImage themedBase="icons/icon_ui_flame_streak" src="" alt="" width={13} height={13} />
          {currentStreak}
        </GlassSurfaceChip>
        <GlassSurfaceChip className="text-violet-700">
          <ArtLibraryImage themedBase="icons/icon_ui_gem" src="" alt="" width={13} height={13} />
          {gemCount}
        </GlassSurfaceChip>
      </div>
    </header>
  );
}
