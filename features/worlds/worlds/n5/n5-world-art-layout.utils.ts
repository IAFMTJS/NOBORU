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
import { N5_WORLD_ART_SPEC } from "@/features/worlds/worlds/n5/n5-world-art.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";

/** Full N5 world canvas — y=0 crown, y=100 base. */
const N5_CANVAS_BAND = { yMin: 0, yMax: 100 } as const;

function bandLocalToCanvas(localY: number): number {
  const span = N5_CANVAS_BAND.yMax - N5_CANVAS_BAND.yMin;
  return N5_CANVAS_BAND.yMax - localY * span;
}

function placeFillSlot(
  slot: JlptBandFillSlot,
  theme: "light" | "dark",
  slotIndex: number,
): PlacedArtPiece {
  const yTop = bandLocalToCanvas(slot.yEnd);
  const yBottom = bandLocalToCanvas(slot.yStart);
  const heightPercent = Math.max(0.5, yBottom - yTop);
  const width = slot.widthPercent ?? WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent + 10;
  const xOffset = slot.xOffset ?? 0;

  return {
    id: `n5-fill-${slot.segmentId}-${slotIndex}`,
    src: artLibraryPath(worldTreeSegmentArtPath(slot.segmentId, theme)),
    topPercent: yTop,
    heightPercent,
    widthPercent: width,
    leftPercent: N5_WORLD_ART_SPEC.trunkCenterX + xOffset,
    zIndex: slot.zIndex ?? 10,
    kind: "fill",
  };
}

function buildGapSlots(): PlacedGap[] {
  const gaps: PlacedGap[] = [];
  const { hero, gapTint } = N5_WORLD_ART_SPEC;

  if (hero.yStart > 0.04) {
    const heroBottomY = bandLocalToCanvas(hero.yStart);
    gaps.push({
      id: "n5-gap-base",
      bandId: "n5" as WorldTreeJlptBandId,
      topPercent: heroBottomY,
      heightPercent: N5_CANVAS_BAND.yMax - heroBottomY,
      tint: gapTint,
    });
  }

  if (hero.yEnd < 0.96) {
    const heroTopY = bandLocalToCanvas(hero.yEnd);
    gaps.push({
      id: "n5-gap-crown",
      bandId: "n5" as WorldTreeJlptBandId,
      topPercent: N5_CANVAS_BAND.yMin,
      heightPercent: Math.max(0, heroTopY - N5_CANVAS_BAND.yMin),
      tint: gapTint,
    });
  }

  return gaps.filter((gap) => gap.heightPercent > 0.3);
}

/** Builds N5 art placements scaled to the full world canvas. */
export function buildN5WorldArtLayout(theme: "light" | "dark"): JlptZoneArtLayout {
  const fill = N5_WORLD_ART_SPEC.fillSlots.map((slot, index) =>
    placeFillSlot(slot, theme, index),
  );

  const heroTop = bandLocalToCanvas(N5_WORLD_ART_SPEC.hero.yEnd);
  const heroBottom = bandLocalToCanvas(N5_WORLD_ART_SPEC.hero.yStart);

  const heroes: PlacedHero[] = [
    {
      id: "n5-hero",
      bandId: "n5",
      src: artLibraryPath(worldTreeJlptBandArtPath("n5", theme)),
      topPercent: heroTop,
      heightPercent: Math.max(1, heroBottom - heroTop),
      widthPercent: N5_WORLD_ART_SPEC.hero.widthPercent,
      leftPercent: N5_WORLD_ART_SPEC.hero.leftPercent,
      zIndex: 25,
      kind: "hero",
      objectPosition: resolveHeroObjectPosition(N5_WORLD_ART_SPEC.hero.anchor),
      scale: N5_WORLD_ART_SPEC.hero.scale,
    },
  ];

  return {
    fill,
    heroes,
    gaps: buildGapSlots(),
  };
}
