"use client";

import Link from "next/link";

import { GlassPanel } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { WorldMapRegionNode } from "@/features/world-map/components/world-map-region-node";
import { WorldMapSpineConnector } from "@/features/world-map/components/world-map-spine-connector";
import type { WorldMapViewModel } from "@/features/world-map/types/world-map.types";

const WORLD_MAP_ASPECT = 9 / 16;

type WorldMapScreenProps = {
  data: WorldMapViewModel;
};

function resolveMapMinHeight(regionCount: number): string {
  const rem = Math.max(28, regionCount * 4.25);
  return `${rem}rem`;
}

export function WorldMapScreen({ data }: WorldMapScreenProps) {
  return (
    <SecondaryScreenShell
      title="Mountain World"
      subtitle="The full climb — from Hiragana foothills to the celestial summit"
      backHref="/learn"
      backLabel="Journey"
      contentClassName="pb-2"
    >
      <div className="mx-auto max-w-md space-y-4">
        <GlassPanel
          className="relative w-full overflow-hidden p-0"
          style={{
            aspectRatio: String(WORLD_MAP_ASPECT),
            minHeight: resolveMapMinHeight(data.regions.length),
          }}
          role="img"
          aria-label="Mountain journey map showing regions along the climb path"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/35 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-[8%] bottom-[4%] top-[4%] rounded-full bg-gradient-to-t from-trail-glow/10 via-transparent to-primary/5 blur-2xl"
            aria-hidden
          />

          <WorldMapSpineConnector regions={data.regions} />

          {data.regions.map((region) => (
            <WorldMapRegionNode key={region.slug} region={region} />
          ))}
        </GlassPanel>

        <Link
          href={data.returnTrailHref}
          className="block text-center text-body-sm text-primary underline-offset-4 hover:underline"
        >
          Return to current trail
        </Link>
      </div>
    </SecondaryScreenShell>
  );
}
