"use client";

import Link from "next/link";
import { Check, Lock, Map } from "lucide-react";

import { RegionHeroImage } from "@/components/media/region-hero-image";
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
        <div className="mt-4 space-y-3 pb-4">
          {regions.map((region) => {
            const locked = region.availability === "locked";
            const selected = region.slug === selectedSlug;
            const visuals = getRegionVisuals(region.slug);

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
                  mode === "overview" && selected && "ring-1 ring-primary/30",
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
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    ) : selected ? (
                      <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
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
          <Button variant="outline" className="w-full" asChild>
            <Link href="/trials">
              <Map className="mr-2 h-4 w-4" aria-hidden />
              View trials to unlock regions
            </Link>
          </Button>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
