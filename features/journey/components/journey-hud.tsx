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
  zoneLabel?: string | null;
  globalNodeIndex?: number;
  totalNodes?: number;
  currentStreak?: number;
  totalXp?: number;
  onRegionOverview: () => void;
  className?: string;
};

/** Journey HUD — glass profile chip, region, zone, streak, gems. */
export function JourneyHud({
  displayName,
  levelLabel,
  regionName,
  zoneLabel = null,
  globalNodeIndex = 0,
  totalNodes = 0,
  currentStreak = 0,
  totalXp = 0,
  onRegionOverview,
  className,
}: JourneyHudProps) {
  const gemCount = resolveDisplayGemCount(totalXp);
  const climbProgress =
    totalNodes > 0 ? Math.round((globalNodeIndex / totalNodes) * 100) : 0;

  return (
    <header
      className={cn(
        "pointer-events-auto absolute inset-x-3 top-3 z-30 flex flex-col gap-1.5 px-2 py-1.5",
        glassSurface.hud,
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
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
          <span className="block truncate font-sans text-[10px] font-medium uppercase text-muted-foreground">
            {zoneLabel ?? regionName}
          </span>
          <span className="block truncate font-sans text-body font-semibold uppercase">
            {regionName}
          </span>
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
      </div>

      {totalNodes > 0 ? (
        <GlassSurfacePanel className="h-1.5 overflow-hidden rounded-full px-0 py-0">
          <div
            className="h-full rounded-full bg-primary/70 transition-[width]"
            style={{ width: `${Math.min(100, climbProgress)}%` }}
            role="progressbar"
            aria-valuenow={climbProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="World tree climb progress"
          />
        </GlassSurfacePanel>
      ) : null}
    </header>
  );
}
