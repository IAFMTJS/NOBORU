"use client";

import Link from "next/link";
import { RegionHeroImage } from "@/components/media/region-hero-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
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
  const title = mode === "overview" ? "All Regions" : "Choose Region";
  const description =
    mode === "overview"
      ? "Every trail on your ascent, with progress at a glance."
      : "Switch paths when you want a different climb.";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-2 pb-4">
          {regions.map((region) => {
            const locked = region.availability === "locked";
            const selected = region.slug === selectedSlug;
            const visuals = getRegionVisuals(region.slug);

            if (mode === "picker") {
              return (
                <button
                  key={region.id}
                  type="button"
                  disabled={locked}
                  onClick={() => {
                    if (!locked) {
                      onSelectRegion(region.slug);
                      onOpenChange(false);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    selected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/60 bg-card",
                    locked ? "cursor-not-allowed opacity-70" : "hover:bg-accent/20",
                  )}
                >
                  <RegionHeroImage
                    regionSlug={region.slug}
                    alt={`${region.name} region`}
                    size="thumbnail"
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-sm font-medium">{region.name}</p>
                      {locked ? (
                        <UiIconImage name="lock" size={16} className="opacity-70" />
                      ) : selected ? (
                        <UiIconImage name="check" size={16} />
                      ) : null}
                    </div>
                    <p className="text-caption text-muted-foreground">
                      {region.completedCount}/{region.lessonCount} lessons
                    </p>
                    <ProgressBar
                      value={region.progressPercent}
                      className="space-y-0"
                      indicatorClassName="h-1"
                    />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={region.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  if (!locked) {
                    onSelectRegion(region.slug);
                    onOpenChange(false);
                  }
                }}
                className={cn(
                  "w-full overflow-hidden rounded-xl border text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5 shadow-elevation-1"
                    : "border-border bg-card",
                  locked ? "cursor-not-allowed opacity-70" : "hover:bg-accent/20",
                  selected && "ring-1 ring-primary/30",
                )}
              >
                <RegionHeroImage
                  regionSlug={region.slug}
                  alt={`${region.name} region`}
                  className="h-24 rounded-none sm:h-28"
                />
                <div className="space-y-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-body-sm font-medium">{region.name}</p>
                        {selected ? (
                          <Badge variant="outline">Current</Badge>
                        ) : null}
                        {locked ? (
                          <Badge variant="outline">Locked</Badge>
                        ) : (
                          <Badge className={visuals.badge}>{visuals.label}</Badge>
                        )}
                      </div>
                      {region.description ? (
                        <p className="mt-1 text-caption text-muted-foreground">
                          {region.description}
                        </p>
                      ) : null}
                    </div>
                    {locked ? (
                      <UiIconImage name="lock" size={16} className="opacity-70" />
                    ) : selected ? (
                      <UiIconImage name="check" size={16} />
                    ) : null}
                  </div>
                  <ProgressBar
                    value={region.progressPercent}
                    label={`${region.completedCount}/${region.lessonCount} lessons`}
                    showValue
                  />
                  {locked && region.lockReason ? (
                    <p className="text-caption text-muted-foreground">{region.lockReason}</p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
        {mode === "overview" ? (
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/learn/world">
                <UiIconImage name="map" size={16} className="mr-2" />
                Mountain world map
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/trials">
                View trials to unlock regions
              </Link>
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
