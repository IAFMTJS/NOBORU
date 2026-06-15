"use client";

import Link from "next/link";
import { useMemo } from "react";

import { RegionHeroImage } from "@/components/media/region-hero-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import {
  NARRATIVE_ARCS,
  REGION_NARRATIVE_ARC,
  type NarrativeArcId,
} from "@/lib/design-system/narrative-regions";
import type { RegionSlug } from "@/lib/design-system/regions";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { cn } from "@/lib/utils";

type RegionSelectSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regions: RegionPathViewModel[];
  selectedSlug: string;
  onSelectRegion: (slug: string) => void;
  mode?: "picker" | "overview";
};

export function RegionSelectSheet({
  open,
  onOpenChange,
  regions,
  selectedSlug,
  onSelectRegion,
  mode = "picker",
}: RegionSelectSheetProps) {
  const title = mode === "overview" ? "Trail atlas" : "Travel to region";
  const description =
    mode === "overview"
      ? "A painted map of discovered landmarks — explore, never select."
      : "Follow the torii to another stretch of the continuous climb.";

  const arcOrder: NarrativeArcId[] = [
    "foot-hills",
    "forest-trail",
    "temple-peak",
    "summit",
  ];

  const regionsByArc = useMemo(() => {
    const groups = new Map<NarrativeArcId, RegionPathViewModel[]>();
    for (const arcId of arcOrder) {
      groups.set(arcId, []);
    }
    for (const region of regions) {
      const arcId = REGION_NARRATIVE_ARC[region.slug as RegionSlug];
      groups.get(arcId)?.push(region);
    }
    return groups;
  }, [regions]);

  const renderRegionLocation = (region: RegionPathViewModel) => {
    const locked = region.availability === "locked";
    const selected = region.slug === selectedSlug;
    const visuals = getRegionVisuals(region.slug);
    const arcId = REGION_NARRATIVE_ARC[region.slug as RegionSlug];
    const arc = NARRATIVE_ARCS[arcId];
    const discovered = !locked;
    const cleared = region.progressPercent >= 100;

    return (
      <button
        key={region.id}
        type="button"
        disabled={mode === "picker" && locked}
        onClick={() => {
          if (locked && mode === "picker") return;
          onSelectRegion(region.slug);
          onOpenChange(false);
        }}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border text-left transition-all",
          selected
            ? "border-trail-glow/50 shadow-[0_0_20px_hsl(var(--trail-glow)/0.15)]"
            : "border-white/12 hover:border-trail-glow/35",
          locked ? "opacity-80" : "hover:brightness-110",
        )}
      >
        <div className="relative h-28 w-full sm:h-32">
          <RegionHeroImage
            regionSlug={region.slug}
            alt={`${region.name} trail`}
            className="absolute inset-0 h-full w-full rounded-none object-cover"
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10",
              locked && "from-black/90 via-black/60",
            )}
          />
          <WorldArtImage
            asset={arc.gateIcon}
            alt=""
            width={36}
            height={36}
            className="absolute left-3 top-3 drop-shadow-lg"
          />
          {locked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-1 text-white/80">
                <UiIconImage name="lock" size={22} />
                <span className="text-caption">Awaiting discovery</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-2 bg-black/55 px-3 py-3 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-story text-sm text-white">{region.name}</p>
                {selected ? <Badge variant="outline">You are here</Badge> : null}
                {cleared ? (
                  <Badge className="bg-success/20 text-success">Cleared</Badge>
                ) : discovered ? (
                  <Badge className={visuals.badge}>{region.progressPercent}%</Badge>
                ) : null}
              </div>
              {region.description ? (
                <p className="text-caption text-white/65 line-clamp-2">
                  {region.description}
                </p>
              ) : null}
            </div>
            {cleared ? (
              <UiIconImage name="check" size={18} className="shrink-0 text-success" />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-trail-glow/80 transition-all"
                style={{ width: `${region.progressPercent}%` }}
              />
            </div>
            <span className="shrink-0 text-caption tabular-nums text-white/70">
              {region.completedCount}/{region.lessonCount}
            </span>
          </div>

          {locked && region.lockReason ? (
            <p className="text-caption text-white/55">{region.lockReason}</p>
          ) : (
            <p className="text-[10px] uppercase tracking-wide text-trail-glow/80">
              {discovered ? "Continue exploring" : "Hidden beyond the fog"}
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-white/10 bg-black/80 backdrop-blur-md"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-story text-story-title">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-6 pb-4">
          {mode === "overview"
            ? arcOrder.map((arcId) => {
                const arc = NARRATIVE_ARCS[arcId];
                const arcRegions = regionsByArc.get(arcId) ?? [];
                if (arcRegions.length === 0) return null;

                const arcCompleted = arcRegions.reduce(
                  (sum, region) => sum + region.completedCount,
                  0,
                );
                const arcTotal = arcRegions.reduce(
                  (sum, region) => sum + region.lessonCount,
                  0,
                );
                const arcPercent =
                  arcTotal === 0 ? 0 : Math.round((arcCompleted / arcTotal) * 100);
                const lockedRegions = arcRegions.filter(
                  (region) => region.availability === "locked",
                ).length;

                return (
                  <section key={arcId} className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                      <WorldArtImage
                        asset={arc.gateIcon}
                        alt=""
                        width={44}
                        height={44}
                        className="shrink-0 drop-shadow-md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-story text-sm text-white">{arc.name}</p>
                          {lockedRegions > 0 ? (
                            <Badge variant="outline">Boss trial ahead</Badge>
                          ) : arcPercent === 100 ? (
                            <Badge variant="secondary">Arc cleared</Badge>
                          ) : null}
                        </div>
                        <p className="text-caption text-white/60">{arc.description}</p>
                        <p className="mt-1 text-caption tabular-nums text-trail-glow/90">
                          {arcCompleted}/{arcTotal} lessons · {arcPercent}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">{arcRegions.map(renderRegionLocation)}</div>
                  </section>
                );
              })
            : regions.map(renderRegionLocation)}
        </div>
        {mode === "overview" ? (
          <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
            <Button variant="outline" className="w-full border-white/15 bg-black/40" asChild>
              <Link href="/world">
                <UiIconImage name="map" size={16} className="mr-2" />
                Discover lore & culture
              </Link>
            </Button>
            <Button variant="ghost" className="w-full text-white/70" asChild>
              <Link href="/learn/world">Mountain world map</Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
