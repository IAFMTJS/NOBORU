"use client";

import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { REGION_VISUALS } from "@/lib/design-system/region-tokens";
import type { WorldMapViewModel } from "@/features/world-map/types/world-map.types";
import { cn } from "@/lib/utils";
import { glassClass, resolveVisualTier } from "@/lib/performance/visual-tier";

type WorldMapScreenProps = {
  data: WorldMapViewModel;
};

export function WorldMapScreen({ data }: WorldMapScreenProps) {
  const tier = resolveVisualTier();
  const glass = glassClass(tier);

  return (
    <PageContainer>
      <ScreenHeader
        title="Mountain World"
        subtitle="The full climb — from Hiragana foothills to the celestial summit"
      />

      <div className="relative space-y-3">
        {data.regions.map((region, index) => {
          const tokens = REGION_VISUALS[region.slug];
          const isCurrent = region.slug === data.currentRegionSlug;

          return (
            <Link
              key={region.slug}
              href={region.availability === "locked" ? "#" : region.href}
              className={cn(
                "block rounded-2xl border p-4 transition-opacity",
                glass,
                region.availability === "locked" && "pointer-events-none opacity-50",
                isCurrent && "border-primary/40 ring-1 ring-primary/20",
              )}
              style={{
                marginLeft: `${Math.min(index * 4, 24)}px`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{region.name}</p>
                  <p className="text-caption text-muted-foreground">
                    {tokens?.badge ?? region.slug}
                  </p>
                </div>
                <span className="text-caption capitalize">{region.availability}</span>
              </div>
              <ProgressBar
                value={region.progressPercent}
                className="mt-2"
                showValue={false}
              />
            </Link>
          );
        })}
      </div>

      <Link
        href="/learn"
        className="block text-center text-body-sm text-primary underline-offset-4 hover:underline"
      >
        Return to current trail
      </Link>
    </PageContainer>
  );
}
