"use client";

import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
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
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="world_map_peaks"
          alt=""
          className="absolute inset-0 min-h-dvh rounded-none"
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 space-y-3 p-4 pt-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-body-sm text-white/70 transition-colors hover:text-white"
          >
            <UiIconImage name="arrow_left" size={16} />
            Journey
          </Link>

          <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              Mountain World
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              The full climb — from Hiragana foothills to the celestial summit
            </p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-2">
          <div className="mx-auto max-w-md space-y-4 pb-4">
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
        </main>
      </div>
    </IllustratedScreen>
  );
}
