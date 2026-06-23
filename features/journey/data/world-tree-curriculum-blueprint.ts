import type { RegionSlug } from "@/lib/design-system/regions";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";

/** Curriculum placement zone — JWorld world / act ids for blueprint slots. */
export type CurriculumZoneId =
  | "n5_act_1"
  | "n5_act_2"
  | "n5_act_3"
  | "n4_world"
  | "n3_world"
  | "n2_world"
  | "n1_world";

export type BlueprintNodeKind = "lesson" | "checkpoint" | "trial" | "landmark";
export type BlueprintSpineRole = "main" | "branch";
export type BlueprintSegmentType = "main_spine" | "branch" | "cave";

export type BlueprintSlot = {
  slotId: string;
  regionSlug: RegionSlug;
  zoneId: CurriculumZoneId;
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
  zoneId: CurriculumZoneId;
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

/** Target lesson + checkpoint + trial slots per world (landmarks added at runtime). */
export const REGION_SLOT_TARGETS: Record<RegionSlug, number> = {
  n5: 300,
  n4: 85,
  n3: 180,
  n2: 160,
  n1: 130,
};

const REGION_CONFIGS: readonly RegionGeneratorConfig[] = [
  {
    regionSlug: "n5",
    zoneId: "n5_act_1",
    targetSlots: REGION_SLOT_TARGETS.n5,
    branchNames: [
      "Hiragana I",
      "Hiragana II",
      "Hiragana III",
      "Katakana I",
      "Katakana II",
      "Katakana III",
      "Greetings",
      "Numbers",
      "Family",
      "Food",
      "Places",
      "Time",
      "Verbs",
      "Vocabulary I",
      "Vocabulary II",
      "Vocabulary III",
      "Vocabulary IV",
      "Grammar I",
      "Grammar II",
      "Kanji I",
      "Kanji II",
      "Reading",
      "Listening",
      "Review",
    ],
  },
  {
    regionSlug: "n4",
    zoneId: "n4_world",
    targetSlots: REGION_SLOT_TARGETS.n4,
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
    regionSlug: "n3",
    zoneId: "n3_world",
    targetSlots: REGION_SLOT_TARGETS.n3,
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
    regionSlug: "n2",
    zoneId: "n2_world",
    targetSlots: REGION_SLOT_TARGETS.n2,
    branchNames: [
      "Sky Hub A",
      "Sky Hub B",
      "Sky Hub C",
      "Sky Hub D",
      "Grammar",
      "Vocabulary",
      "Kanji",
      "Reading",
      "Listening",
      "Review",
    ],
  },
  {
    regionSlug: "n1",
    zoneId: "n1_world",
    targetSlots: REGION_SLOT_TARGETS.n1,
    branchNames: [
      "Crown Arm α",
      "Crown Arm β",
      "Crown Arm γ",
      "Sky West",
      "Sky East",
      "Advanced Grammar",
      "Advanced Reading",
      "Advanced Listening",
      "Summit Mastery",
      "Infinite Review",
    ],
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
  const world = normalizeRegionSlug(regionSlug);
  const regionSlots = WORLD_TREE_CURRICULUM_BLUEPRINT.filter(
    (slot) => slot.regionSlug === world,
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
