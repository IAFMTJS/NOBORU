"use client";

import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ScreenHeader } from "@/components/layout/screen-header";
import { WorldMapRegionNode } from "@/features/world-map/components/world-map-region-node";
import { WorldMapSpineConnector } from "@/features/world-map/components/world-map-spine-connector";
import type { WorldMapViewModel } from "@/features/world-map/types/world-map.types";
import { TRAIL_MAP_ART_ASPECT } from "@/lib/design-system/trail-path-anchors";
import { cn } from "@/lib/utils";
import { glassClass, resolveVisualTier } from "@/lib/performance/visual-tier";

type WorldMapScreenProps = {
  data: WorldMapViewModel;
};

function resolveMapMinHeight(regionCount: number): string {
  const rem = Math.max(28, regionCount * 4.25);
  return `${rem}rem`;
}

export function WorldMapScreen({ data }: WorldMapScreenProps) {
  const tier = resolveVisualTier();
  const glass = glassClass(tier);

  return (
    <PageContainer>
      <ScreenHeader
        title="Mountain World"
        subtitle="The full climb — from Hiragana foothills to the celestial summit"
      />

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-border/60",
          glass,
        )}
        style={{
          aspectRatio: String(TRAIL_MAP_ART_ASPECT),
          minHeight: resolveMapMinHeight(data.regions.length),
        }}
        role="img"
        aria-label="Mountain journey map showing regions along the climb path"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-primary/5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-[8%] bottom-[4%] top-[4%] rounded-full bg-gradient-to-t from-muted/20 via-transparent to-primary/10 blur-2xl"
          aria-hidden
        />

        <WorldMapSpineConnector regions={data.regions} />

        {data.regions.map((region) => (
          <WorldMapRegionNode key={region.slug} region={region} />
        ))}
      </div>

      <Link
        href={data.returnTrailHref}
        className="mt-4 block text-center text-body-sm text-primary underline-offset-4 hover:underline"
      >
        Return to current trail
      </Link>
    </PageContainer>
  );
}
