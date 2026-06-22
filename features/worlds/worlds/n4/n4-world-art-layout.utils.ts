import {
  worldTreeJlptBandArtPath,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { WORLD_TREE_MANIFEST_ANCHORS } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  resolveHeroObjectPosition,
  worldTreeSegmentArtPath,
} from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import type { JlptBandFillSlot } from "@/features/journey/constants/world-tree-jlpt-zone-layout.constants";
import type {
  JlptZoneArtLayout,
  PlacedArtPiece,
  PlacedGap,
  PlacedHero,
} from "@/features/journey/utils/world-tree-jlpt-zone-layout.utils";
import { N4_HERO_ART_VERSION, N4_WORLD_ART_SPEC } from "@/features/worlds/worlds/n4/n4-world-art.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";

const N4_CANVAS_BAND = { yMin: 0, yMax: 100 } as const;

function bandLocalToCanvas(localY: number): number {
  const span = N4_CANVAS_BAND.yMax - N4_CANVAS_BAND.yMin;
  return N4_CANVAS_BAND.yMax - localY * span;
}

function placeFillSlot(
  slot: JlptBandFillSlot & { segmentId: JlptBandFillSlot["segmentId"] | string },
  theme: "light" | "dark",
  slotIndex: number,
): PlacedArtPiece {
  const yTop = bandLocalToCanvas(slot.yEnd);
  const yBottom = bandLocalToCanvas(slot.yStart);
  const heightPercent = Math.max(0.5, yBottom - yTop);
  const width = slot.widthPercent ?? WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent + 10;
  const xOffset = slot.xOffset ?? 0;

  return {
    id: `n4-fill-${slot.segmentId}-${slotIndex}`,
      src: artLibraryPath(
        worldTreeSegmentArtPath(
          slot.segmentId as Parameters<typeof worldTreeSegmentArtPath>[0],
          theme,
        ),
      ),
    topPercent: yTop,
    heightPercent,
    widthPercent: width,
    leftPercent: N4_WORLD_ART_SPEC.trunkCenterX + xOffset,
    zIndex: slot.zIndex ?? 10,
    kind: "fill",
  };
}

function buildGapSlots(): PlacedGap[] {
  const gaps: PlacedGap[] = [];
  const { hero, gapTint, worldHeartBase } = N4_WORLD_ART_SPEC;

  gaps.push({
    id: "n4-gap-world-heart",
    bandId: "n4" as WorldTreeJlptBandId,
    topPercent: 100 - worldHeartBase.heightPercent,
    heightPercent: worldHeartBase.heightPercent,
    tint: worldHeartBase.rootMist,
  });

  if (hero.yStart > 0.04) {
    const heroBottomY = bandLocalToCanvas(hero.yStart);
    gaps.push({
      id: "n4-gap-base",
      bandId: "n4" as WorldTreeJlptBandId,
      topPercent: heroBottomY,
      heightPercent: N4_CANVAS_BAND.yMax - heroBottomY,
      tint: gapTint,
    });
  }

  if (hero.yEnd < 0.96) {
    const heroTopY = bandLocalToCanvas(hero.yEnd);
    gaps.push({
      id: "n4-gap-crown",
      bandId: "n4" as WorldTreeJlptBandId,
      topPercent: N4_CANVAS_BAND.yMin,
      heightPercent: Math.max(0, heroTopY - N4_CANVAS_BAND.yMin),
      tint: gapTint,
    });
  }

  return gaps.filter((gap) => gap.heightPercent > 0.3);
}

/** Builds N4 art placements scaled to the full world canvas. */
export function buildN4WorldArtLayout(theme: "light" | "dark"): JlptZoneArtLayout {
  const fill = N4_WORLD_ART_SPEC.fillSlots.map((slot, index) =>
    placeFillSlot(slot, theme, index),
  );

  const heroTop = bandLocalToCanvas(N4_WORLD_ART_SPEC.hero.yEnd);
  const heroBottom = bandLocalToCanvas(N4_WORLD_ART_SPEC.hero.yStart);

  const heroes: PlacedHero[] = [
    {
      id: "n4-hero",
      bandId: "n4",
      src: artLibraryPath(worldTreeJlptBandArtPath("n4", theme, N4_HERO_ART_VERSION)),
      topPercent: heroTop,
      heightPercent: Math.max(1, heroBottom - heroTop),
      widthPercent: N4_WORLD_ART_SPEC.hero.widthPercent,
      leftPercent: N4_WORLD_ART_SPEC.hero.leftPercent,
      zIndex: 25,
      kind: "hero",
      objectPosition: resolveHeroObjectPosition(N4_WORLD_ART_SPEC.hero.anchor),
      scale: N4_WORLD_ART_SPEC.hero.scale,
    },
  ];

  return {
    fill,
    heroes,
    gaps: buildGapSlots(),
    overlays: [],
  };
}
