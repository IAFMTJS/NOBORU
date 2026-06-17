import type { ArtAssetRef } from "@/lib/assets/art-mappings";
import type { TrailNodeKind, TrailNodeState } from "@/features/learning/types/trail.types";

export type LessonNodeVisualKind = TrailNodeKind | "trial" | "landmark" | "event";

export const LESSON_NODE_ASSETS = {
  locked: { category: "ui/icons/nodes", id: "icon-node-lock" },
  available: { category: "ui/icons/nodes", id: "icon-node-lesson-camp" },
  in_progress: { category: "ui/icons/nodes", id: "icon-node-lesson-camp" },
  completed: { category: "ui/icons/nodes", id: "icon-node-complete-check" },
  checkpoint: { category: "ui/icons/nodes", id: "icon-node-complete-check" },
  trial: { category: "ui/icons/nodes", id: "icon-node-boss-mask" },
  application: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  vocabulary: { category: "ui/icons/nodes", id: "icon-node-vocabulary" },
  kanji: { category: "ui/icons/nodes", id: "icon-node-kanji" },
  listening: { category: "ui/icons/nodes", id: "icon-node-listening" },
  event: { category: "ui/icons/nodes", id: "icon-node-event-sakura" },
  landmark: { category: "ui/icons/nodes", id: "icon-node-region-foot-hills" },
} as const satisfies Record<string, ArtAssetRef>;

export const NARRATIVE_GATE_ASSETS = {
  foot_hills: { category: "ui/icons/nodes", id: "icon-node-region-foot-hills" },
  forest: { category: "ui/icons/nodes", id: "icon-node-region-forest" },
  temple_peak: { category: "ui/icons/nodes", id: "icon-node-region-temple-peak" },
  summit: { category: "ui/icons/nodes", id: "icon-node-region-summit" },
  torii_transition: {
    category: "backgrounds/shrine",
    id: "bg-shrine-region-transition-torii",
  },
} as const satisfies Record<string, ArtAssetRef>;

export const FX_ASSETS = {
  ember: { category: "props/particles", id: "particle-ember" },
  golden_star: { category: "props/particles", id: "particle-golden-star" },
  magic_ring: { category: "props/particles", id: "particle-magic-ring" },
  sakura: { category: "props/particles", id: "particle-sakura-petals" },
  snowflake: { category: "props/particles", id: "particle-snowflake" },
  rain: { category: "props/particles", id: "particle-rain-streak" },
  spark: { category: "props/particles", id: "particle-spark" },
} as const satisfies Record<string, ArtAssetRef>;

export const FOG_ASSETS = {
  locked_region: { category: "backgrounds/shrine", id: "bg-shrine-locked-region" },
  boss_atmosphere: { category: "backgrounds/shrine", id: "bg-shrine-boss-atmosphere" },
} as const satisfies Record<string, ArtAssetRef>;

export const INVENTORY_ITEM_ASSETS: Record<string, ArtAssetRef> = {
  lantern: { category: "props/inventory", id: "item-lantern" },
  stone_lantern: { category: "props/inventory", id: "item-stone-lantern" },
  omamori: { category: "props/inventory", id: "item-omamori" },
  daruma: { category: "props/inventory", id: "item-daruma" },
  fox_mask: { category: "props/inventory", id: "item-fox-mask" },
  scarf: { category: "props/inventory", id: "item-scarf-crimson" },
  backpack: { category: "props/inventory", id: "item-backpack-bamboo" },
  fan: { category: "props/inventory", id: "item-fan" },
  onigiri: { category: "props/inventory", id: "item-onigiri" },
  dango: { category: "props/inventory", id: "item-dango" },
  sakura: { category: "props/inventory", id: "item-sakura" },
  scroll: { category: "props/inventory", id: "item-scroll" },
};

type ResolveLessonNodeAssetInput = {
  state: TrailNodeState;
  nodeKind?: LessonNodeVisualKind;
  lessonType?: string | null;
};

export function resolveLessonNodeAsset({
  state,
  nodeKind = "lesson",
  lessonType,
}: ResolveLessonNodeAssetInput): ArtAssetRef {
  if (state === "locked") return LESSON_NODE_ASSETS.locked;
  if (nodeKind === "trial") return LESSON_NODE_ASSETS.trial;
  if (nodeKind === "checkpoint") return LESSON_NODE_ASSETS.checkpoint;
  if (nodeKind === "application") return LESSON_NODE_ASSETS.application;
  if (nodeKind === "event") return LESSON_NODE_ASSETS.event;
  if (nodeKind === "landmark") return LESSON_NODE_ASSETS.landmark;
  if (state === "completed") return LESSON_NODE_ASSETS.completed;

  const type = lessonType?.toLowerCase() ?? "";
  if (type.includes("kanji")) return LESSON_NODE_ASSETS.kanji;
  if (type.includes("listen")) return LESSON_NODE_ASSETS.listening;
  if (type.includes("vocab")) return LESSON_NODE_ASSETS.vocabulary;

  return LESSON_NODE_ASSETS[state === "in_progress" ? "in_progress" : "available"];
}
