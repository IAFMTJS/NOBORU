import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import type { RegionSlug } from "@/lib/design-system/regions";

export type BlueprintNodeKind = "lesson" | "checkpoint" | "trial" | "landmark";
export type BlueprintSpineRole = "main" | "branch";
export type BlueprintSegmentType = "main_spine" | "branch" | "cave";

export type BlueprintSlot = {
  slotId: string;
  regionSlug: RegionSlug;
  zoneId: WorldTreeZoneId;
  branchId: string;
  branchIndex: number;
  slotIndex: number;
  kind: BlueprintNodeKind;
  lessonType: string;
  title: string;
  spineRole: BlueprintSpineRole;
  segmentType: BlueprintSegmentType;
  caveGroup?: string;
};

type RegionGeneratorConfig = {
  regionSlug: RegionSlug;
  zoneId: WorldTreeZoneId;
  targetSlots: number;
  branchNames: readonly string[];
};

const LESSON_TYPES = [
  "vocabulary",
  "grammar",
  "kanji",
  "reading",
  "listening",
] as const;

/** Target lesson + checkpoint + trial slots per region (landmarks added at runtime). */
export const REGION_SLOT_TARGETS: Record<RegionSlug, number> = {
  foothills: 20,
  "forest-trail": 17,
  "mount-n5": 95,
  "mount-n4": 85,
  "mount-n3": 180,
  "mount-n2": 160,
  "mount-n1": 110,
  "master-summit": 20,
};

const REGION_CONFIGS: readonly RegionGeneratorConfig[] = [
  {
    regionSlug: "foothills",
    zoneId: "deep_roots",
    targetSlots: REGION_SLOT_TARGETS.foothills,
    branchNames: ["Hiragana I", "Hiragana II", "Hiragana III", "Reading", "Base Camp"],
  },
  {
    regionSlug: "forest-trail",
    zoneId: "n5_roots",
    targetSlots: REGION_SLOT_TARGETS["forest-trail"],
    branchNames: ["Katakana I", "Katakana II", "Katakana III", "Reading"],
  },
  {
    regionSlug: "mount-n5",
    zoneId: "n5_roots",
    targetSlots: REGION_SLOT_TARGETS["mount-n5"],
    branchNames: [
      "Greetings",
      "Numbers",
      "Family",
      "Food",
      "Places",
      "Time",
      "Verbs",
      "Review",
    ],
  },
  {
    regionSlug: "mount-n4",
    zoneId: "n4_foothills",
    targetSlots: REGION_SLOT_TARGETS["mount-n4"],
    branchNames: [
      "Daily Life",
      "Actions",
      "Grammar Core",
      "Kanji Trail",
      "Reading",
      "Listening",
      "Work",
      "Travel",
    ],
  },
  {
    regionSlug: "mount-n3",
    zoneId: "n3_trunk_1",
    targetSlots: REGION_SLOT_TARGETS["mount-n3"],
    branchNames: [
      "Grammar I",
      "Grammar II",
      "Vocabulary I",
      "Vocabulary II",
      "Kanji I",
      "Kanji II",
      "Reading I",
      "Reading II",
      "Listening I",
      "Listening II",
      "Conversation",
      "Review",
    ],
  },
  {
    regionSlug: "mount-n2",
    zoneId: "n2_canopy",
    targetSlots: REGION_SLOT_TARGETS["mount-n2"],
    branchNames: [
      "Canopy Hub A",
      "Canopy Hub B",
      "Canopy Hub C",
      "Canopy Hub D",
      "Grammar",
      "Vocabulary",
      "Kanji",
      "Reading",
      "Listening",
      "Review",
    ],
  },
  {
    regionSlug: "mount-n1",
    zoneId: "n1_celestial",
    targetSlots: REGION_SLOT_TARGETS["mount-n1"],
    branchNames: [
      "Crown Arm α",
      "Crown Arm β",
      "Crown Arm γ",
      "Sky West",
      "Sky East",
      "Advanced Grammar",
      "Advanced Reading",
      "Advanced Listening",
    ],
  },
  {
    regionSlug: "master-summit",
    zoneId: "n1_celestial",
    targetSlots: REGION_SLOT_TARGETS["master-summit"],
    branchNames: ["Summit Mastery", "Infinite Review"],
  },
];

function lessonTypeForSlot(branchIndex: number, slotIndex: number): string {
  return LESSON_TYPES[(branchIndex + slotIndex) % LESSON_TYPES.length]!;
}

function buildRegionSlots(config: RegionGeneratorConfig): BlueprintSlot[] {
  const slots: BlueprintSlot[] = [];
  const branchCount = config.branchNames.length;
  const trialReserved = 1;
  const contentTarget = config.targetSlots - trialReserved;
  const checkpointsPerBranch = 1;
  const miniPerBranch = Math.max(
    3,
    Math.floor(contentTarget / branchCount) - checkpointsPerBranch,
  );

  let globalSlotIndex = 0;

  for (let branchIndex = 0; branchIndex < branchCount; branchIndex += 1) {
    const branchName = config.branchNames[branchIndex]!;
    const branchId = `${config.regionSlug}-branch-${branchIndex}`;

    for (let chapter = 0; chapter < miniPerBranch; chapter += 1) {
      if (slots.length >= contentTarget - checkpointsPerBranch * (branchCount - branchIndex)) {
        break;
      }

      const spineRole: BlueprintSpineRole = chapter < Math.ceil(miniPerBranch * 0.6) ? "main" : "branch";
      const segmentType: BlueprintSegmentType =
        spineRole === "main" ? "main_spine" : chapter >= miniPerBranch - 1 ? "cave" : "branch";

      slots.push({
        slotId: `${branchId}-ch-${chapter + 1}`,
        regionSlug: config.regionSlug,
        zoneId: config.zoneId,
        branchId,
        branchIndex,
        slotIndex: globalSlotIndex,
        kind: "lesson",
        lessonType: lessonTypeForSlot(branchIndex, chapter),
        title: `${branchName} · Chapter ${chapter + 1}`,
        spineRole,
        segmentType,
        caveGroup: segmentType !== "main_spine" ? `${branchId}-cave` : undefined,
      });
      globalSlotIndex += 1;
    }

    if (slots.filter((s) => s.branchId === branchId).length > 0) {
      slots.push({
        slotId: `${branchId}-checkpoint`,
        regionSlug: config.regionSlug,
        zoneId: config.zoneId,
        branchId,
        branchIndex,
        slotIndex: globalSlotIndex,
        kind: "checkpoint",
        lessonType: "practice",
        title: `${branchName} · Checkpoint`,
        spineRole: "main",
        segmentType: "main_spine",
      });
      globalSlotIndex += 1;
    }
  }

  while (slots.length < contentTarget) {
    const branchIndex = slots.length % branchCount;
    const branchName = config.branchNames[branchIndex]!;
    const branchId = `${config.regionSlug}-branch-${branchIndex}`;
    const chapterNum = slots.filter((s) => s.branchId === branchId && s.kind === "lesson").length + 1;

    slots.push({
      slotId: `${branchId}-overflow-${chapterNum}`,
      regionSlug: config.regionSlug,
      zoneId: config.zoneId,
      branchId,
      branchIndex,
      slotIndex: globalSlotIndex,
      kind: "lesson",
      lessonType: lessonTypeForSlot(branchIndex, chapterNum),
      title: `${branchName} · Chapter ${chapterNum}`,
      spineRole: "branch",
      segmentType: "cave",
      caveGroup: `${branchId}-cave`,
    });
    globalSlotIndex += 1;
  }

  slots.push({
    slotId: `${config.regionSlug}-final-trial`,
    regionSlug: config.regionSlug,
    zoneId: config.zoneId,
    branchId: `${config.regionSlug}-boss`,
    branchIndex: branchCount,
    slotIndex: globalSlotIndex,
    kind: "trial",
    lessonType: "application",
    title: `${config.regionSlug} · Final Trial`,
    spineRole: "main",
    segmentType: "main_spine",
  });

  return slots.slice(0, config.targetSlots);
}

export const WORLD_TREE_CURRICULUM_BLUEPRINT: readonly BlueprintSlot[] =
  REGION_CONFIGS.flatMap(buildRegionSlots);

export function resolveBlueprintSlot(
  regionSlug: string,
  lessonIndexInRegion: number,
): BlueprintSlot | null {
  const regionSlots = WORLD_TREE_CURRICULUM_BLUEPRINT.filter(
    (slot) => slot.regionSlug === regionSlug,
  );
  return regionSlots[lessonIndexInRegion] ?? null;
}

export function countBlueprintSlotsByRegion(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slot of WORLD_TREE_CURRICULUM_BLUEPRINT) {
    counts[slot.regionSlug] = (counts[slot.regionSlug] ?? 0) + 1;
  }
  return counts;
}

export const WORLD_TREE_BLUEPRINT_TOTAL_SLOTS = WORLD_TREE_CURRICULUM_BLUEPRINT.length;

export function getRegionBlueprintSlots(regionSlug: RegionSlug): readonly BlueprintSlot[] {
  return WORLD_TREE_CURRICULUM_BLUEPRINT.filter((slot) => slot.regionSlug === regionSlug);
}
