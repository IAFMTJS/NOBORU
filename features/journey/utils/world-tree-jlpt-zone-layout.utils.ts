import {
  WORLD_TREE_JLPT_BANDS,
  buildWorldTreeJlptBandLayout,
  resolveJlptBandForZone,
  type WorldTreeJlptBandId,
} from "@/features/journey/constants/world-tree-jlpt-band.constants";
import {
  WORLD_TREE_JLPT_ZONE_LAYOUT,
  resolveJlptZoneTrunkX,
  type JlptBandFillSlot,
} from "@/features/journey/constants/world-tree-jlpt-zone-layout.constants";
import { WORLD_TREE_MANIFEST_ANCHORS } from "@/features/journey/constants/world-tree-skeleton.constants";
import { worldTreeSegmentArtPath } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { worldTreeJlptBandArtPath } from "@/features/journey/constants/world-tree-jlpt-band.constants";
import { resolveHeroObjectPosition } from "@/features/journey/constants/world-tree-jlpt-segment.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import type { PlottedSkeletonNode } from "@/features/journey/utils/world-tree-layout.utils";

export type PlacedArtPiece = {
  id: string;
  src: string;
  topPercent: number;
  heightPercent: number;
  widthPercent: number;
  leftPercent: number;
  zIndex: number;
  kind: "fill" | "hero" | "transition" | "gap";
};

export type PlacedHero = PlacedArtPiece & {
  bandId: WorldTreeJlptBandId;
  objectPosition: string;
  scale: number;
};

export type PlacedGap = {
  id: string;
  bandId: WorldTreeJlptBandId;
  topPercent: number;
  heightPercent: number;
  tint: string;
};

export type PlacedOverlay = {
  id: string;
  bandId: WorldTreeJlptBandId;
  topPercent: number;
  heightPercent: number;
  zIndex: number;
  /** Inline CSS background (usually a gradient). */
  background: string;
  kind: "crown" | "seam" | "fringe";
};

export type JlptZoneArtLayout = {
  fill: PlacedArtPiece[];
  heroes: PlacedHero[];
  gaps: PlacedGap[];
  overlays: PlacedOverlay[];
};

function bandLocalToCanvas(
  band: { yMin: number; yMax: number },
  localY: number,
): number {
  const span = band.yMax - band.yMin;
  return band.yMax - localY * span;
}

function placeFillSlot(
  slot: JlptBandFillSlot,
  band: { yMin: number; yMax: number },
  bandId: WorldTreeJlptBandId,
  theme: "light" | "dark",
  slotIndex: number,
): PlacedArtPiece {
  const span = band.yMax - band.yMin;
  const yTop = bandLocalToCanvas(band, slot.yEnd);
  const yBottom = bandLocalToCanvas(band, slot.yStart);
  const heightPercent = Math.max(0.5, yBottom - yTop);
  const width =
    slot.widthPercent ?? WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent + 12;
  const xOffset = slot.xOffset ?? 0;

  return {
    id: `${bandId}-fill-${slot.segmentId}-${slotIndex}`,
    src: artLibraryPath(worldTreeSegmentArtPath(slot.segmentId, theme)),
    topPercent: yTop,
    heightPercent,
    widthPercent: width,
    leftPercent: WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent + xOffset,
    zIndex: slot.zIndex ?? 10,
    kind: "fill",
  };
}

function computeGapSlots(
  bandId: WorldTreeJlptBandId,
  band: { yMin: number; yMax: number },
  spec: (typeof WORLD_TREE_JLPT_ZONE_LAYOUT)[WorldTreeJlptBandId],
): PlacedGap[] {
  const gaps: PlacedGap[] = [];
  const span = band.yMax - band.yMin;

  if (spec.hero.yStart > 0.04) {
    const heroBottomY = bandLocalToCanvas(band, spec.hero.yStart);
    gaps.push({
      id: `${bandId}-gap-base`,
      bandId,
      topPercent: heroBottomY,
      heightPercent: band.yMax - heroBottomY,
      tint: spec.gapTint,
    });
  }

  if (spec.hero.yEnd < 0.96) {
    const heroTopY = bandLocalToCanvas(band, spec.hero.yEnd);
    gaps.push({
      id: `${bandId}-gap-crown`,
      bandId,
      topPercent: band.yMin,
      heightPercent: Math.max(0, heroTopY - band.yMin),
      tint: spec.gapTint,
    });
  }

  return gaps.filter((g) => g.heightPercent > 0.3);
}

/** Build art placements for all five JLPT zones. */
export function buildJlptZoneArtLayout(theme: "light" | "dark"): JlptZoneArtLayout {
  const jlptBands = buildWorldTreeJlptBandLayout();
  const fill: PlacedArtPiece[] = [];
  const heroes: PlacedHero[] = [];
  const gaps: PlacedGap[] = [];
  const overlays: PlacedOverlay[] = [];
  const canvasBg = theme === "light" ? "#E9E1D0" : "#0D1320";

  for (const band of WORLD_TREE_JLPT_BANDS) {
    const layout = jlptBands.find((entry) => entry.id === band.id)!;
    const spec = WORLD_TREE_JLPT_ZONE_LAYOUT[band.id];
    const span = layout.yMax - layout.yMin;

    spec.fillSlots.forEach((slot, index) => {
      fill.push(placeFillSlot(slot, layout, band.id, theme, index));
    });

    if (spec.transitionTop) {
      const transitionHeight = span * 0.24;
      fill.push({
        id: `${band.id}-transition`,
        src: artLibraryPath(worldTreeSegmentArtPath(spec.transitionTop, theme)),
        topPercent: layout.yMin - transitionHeight * 0.5,
        heightPercent: transitionHeight,
        widthPercent: WORLD_TREE_MANIFEST_ANCHORS.trunkWidthPercent + 18,
        leftPercent: WORLD_TREE_MANIFEST_ANCHORS.trunkCenterXPercent,
        zIndex: 35,
        kind: "transition",
      });
    }

    const heroTop = bandLocalToCanvas(layout, spec.hero.yEnd);
    const heroBottom = bandLocalToCanvas(layout, spec.hero.yStart);
    heroes.push({
      id: `${band.id}-hero`,
      bandId: band.id,
      src: artLibraryPath(worldTreeJlptBandArtPath(band.id, theme)),
      topPercent: heroTop,
      heightPercent: Math.max(1, heroBottom - heroTop),
      widthPercent: 100,
      leftPercent: 50,
      zIndex: 25,
      kind: "hero",
      objectPosition: resolveHeroObjectPosition(spec.hero.anchor),
      scale: spec.hero.scale,
    });

    gaps.push(...computeGapSlots(band.id, layout, spec));

    // Seam masking overlays — hides harsh underhang fringes and blends hero edges
    // into the canvas background between JLPT bands.
    // NOTE: Each JLPT band is only ~20% of the canvas, so these need to be
    // large enough in absolute canvas-percent to actually cover real fringe pixels.
    const seamH = Math.max(2.4, span * 0.14);
    const fringeH = Math.max(2.0, span * 0.11);
    const crownH = Math.max(2.0, span * 0.12);

    overlays.push({
      id: `${band.id}-crown-mask`,
      bandId: band.id,
      topPercent: heroTop - crownH * 0.3,
      heightPercent: crownH,
      zIndex: 28,
      kind: "crown",
      background: `linear-gradient(to top, transparent 0%, ${spec.gapTint}55 28%, ${canvasBg}EE 80%, ${canvasBg} 100%)`,
    });

    overlays.push({
      id: `${band.id}-seam-mask`,
      bandId: band.id,
      topPercent: heroBottom - seamH * 0.75,
      heightPercent: seamH,
      zIndex: 30,
      kind: "seam",
      background: `linear-gradient(to bottom, transparent 0%, ${spec.gapTint}77 20%, ${canvasBg}EE 78%, ${canvasBg} 100%)`,
    });

    overlays.push({
      id: `${band.id}-fringe-mask`,
      bandId: band.id,
      topPercent: heroBottom - fringeH * 0.45,
      heightPercent: fringeH,
      zIndex: 31,
      kind: "fringe",
      background: `linear-gradient(to bottom, transparent 0%, ${spec.gapTint}44 18%, ${canvasBg}F8 62%, ${canvasBg} 100%)`,
    });
  }

  return { fill, heroes, gaps, overlays };
}

/** Count spine nodes per JLPT band for Y redistribution. */
export function countSpineNodesByJlptBand(
  nodes: PlottedSkeletonNode[],
): Record<WorldTreeJlptBandId, PlottedSkeletonNode[]> {
  const buckets: Record<WorldTreeJlptBandId, PlottedSkeletonNode[]> = {
    n5: [],
    n4: [],
    n3: [],
    n2: [],
    n1: [],
  };

  for (const entry of nodes) {
    if (entry.node.kind === "landmark") continue;
    if (entry.spineRole !== "main") continue;
    const bandId = resolveJlptBandForZone(entry.zoneId);
    buckets[bandId].push(entry);
  }

  for (const bandId of Object.keys(buckets) as WorldTreeJlptBandId[]) {
    buckets[bandId].sort((a, b) => a.node.globalIndex - b.node.globalIndex);
  }

  return buckets;
}

/** Assign spine Y positions band-by-band so nodes align with JLPT art zones. */
export function assignSpineYByJlptBand(
  nodes: PlottedSkeletonNode[],
): Map<string, number> {
  const jlptBands = buildWorldTreeJlptBandLayout();
  const byBand = countSpineNodesByJlptBand(nodes);
  const yByNodeId = new Map<string, number>();

  for (const bandLayout of jlptBands) {
    const bandNodes = byBand[bandLayout.id];
    const spec = WORLD_TREE_JLPT_ZONE_LAYOUT[bandLayout.id];
    const span = bandLayout.yMax - bandLayout.yMin;
    const margin = span * 0.06;
    const yMin = bandLayout.yMin + margin;
    const yMax = bandLayout.yMax - margin;
    const usable = yMax - yMin;

    if (bandNodes.length === 0) continue;

    if (bandNodes.length === 1) {
      const localCenter = (spec.hero.yStart + spec.hero.yEnd) / 2;
      yByNodeId.set(
        bandNodes[0]!.node.id,
        bandLayout.yMax - localCenter * span,
      );
      continue;
    }

    for (let rank = 0; rank < bandNodes.length; rank += 1) {
      const progress = rank / (bandNodes.length - 1);
      yByNodeId.set(bandNodes[rank]!.node.id, yMax - progress * usable);
    }
  }

  return yByNodeId;
}

/** Snap main-spine X to per-zone trunk corridor. */
export function assignSpineXByJlptBand(
  nodes: PlottedSkeletonNode[],
): Map<string, number> {
  const jlptBands = buildWorldTreeJlptBandLayout();
  const byBand = countSpineNodesByJlptBand(nodes);
  const xByNodeId = new Map<string, number>();

  for (const bandLayout of jlptBands) {
    const bandNodes = byBand[bandLayout.id];
    const count = bandNodes.length;
    if (count === 0) continue;

    bandNodes.forEach((entry, index) => {
      const progress = count > 1 ? index / (count - 1) : 0.5;
      xByNodeId.set(
        entry.node.id,
        resolveJlptZoneTrunkX(bandLayout.id, progress, entry.node.globalIndex),
      );
    });
  }

  return xByNodeId;
}
