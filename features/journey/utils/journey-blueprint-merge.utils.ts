import {
  getRegionBlueprintSlots,
  type BlueprintSlot,
} from "@/features/journey/data/world-tree-curriculum-blueprint";
import type {
  LessonBlueprintMeta,
  LessonSummaryViewModel,
  RegionPathViewModel,
  UnitSummaryViewModel,
} from "@/features/learning/types/lesson.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { REGION_SLUGS, type RegionSlug } from "@/lib/design-system/regions";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";
import { resolveThematicCategorySlugForUnitName } from "@/lib/learning/world-tree-branch.utils";

const REGION_META: Record<RegionSlug, { name: string; description: string }> =
  Object.fromEntries(
    REGION_SLUGS.map((slug) => {
      const visuals = getRegionVisuals(slug);
      return [slug, { name: visuals.label, description: visuals.label }];
    }),
  ) as Record<RegionSlug, { name: string; description: string }>;

function blueprintKindToLessonType(slot: BlueprintSlot): string {
  if (slot.kind === "checkpoint") return "practice";
  if (slot.kind === "trial") return "application";
  return slot.lessonType;
}

function toBlueprintMeta(slot: BlueprintSlot): LessonBlueprintMeta {
  return {
    slotId: slot.slotId,
    zoneId: slot.zoneId,
    branchId: slot.branchId,
    branchIndex: slot.branchIndex,
    spineRole: slot.spineRole,
    segmentType: slot.segmentType,
    caveGroup: slot.caveGroup,
    slotKind: slot.kind === "landmark" ? "lesson" : slot.kind,
  };
}

function attachBlueprintMeta(
  lesson: LessonSummaryViewModel,
  slot: BlueprintSlot,
): LessonSummaryViewModel {
  return {
    ...lesson,
    blueprint: toBlueprintMeta(slot),
  };
}

function lessonFromBlueprintSlot(
  slot: BlueprintSlot,
  unitId: string,
): LessonSummaryViewModel {
  return attachBlueprintMeta(
    {
      id: `blueprint:${slot.slotId}`,
      unitId,
      type: blueprintKindToLessonType(slot),
      title: slot.title,
      description: "Planned — content in development",
      xpReward: slot.kind === "trial" ? 50 : slot.kind === "checkpoint" ? 25 : 10,
      estimatedDuration: 5,
      progress: "not_started",
      score: 0,
      contentStatus: "draft",
    },
    slot,
  );
}

function contentIndexForSlot(
  slots: readonly BlueprintSlot[],
  slot: BlueprintSlot,
): number {
  const branchSlots = slots.filter((entry) => entry.branchId === slot.branchId);
  const indexInBranch = branchSlots.findIndex((entry) => entry.slotId === slot.slotId);
  if (indexInBranch < 0) return 0;

  return branchSlots
    .slice(0, indexInBranch)
    .filter((entry) => entry.kind === "lesson" || entry.kind === "checkpoint" || entry.kind === "trial")
    .length;
}

function resolveBranchName(slot: BlueprintSlot): string {
  return slot.title.split(" · ")[0]?.trim() ?? slot.branchId;
}

function normalizeBranchLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreUnitBranchMatch(branchName: string, unitName: string): number {
  const branch = normalizeBranchLabel(branchName);
  const unit = normalizeBranchLabel(unitName);
  if (!branch || !unit) return 0;
  if (branch === unit) return 100;
  if (unit.includes(branch) || branch.includes(unit)) return 80;

  if (branch.includes("hiragana") && unit.includes("hiragana")) return 70;
  if (branch.includes("katakana") && unit.includes("katakana")) return 70;

  const branchCategory = resolveThematicCategorySlugForUnitName(branchName);
  const unitCategory = resolveThematicCategorySlugForUnitName(unitName);
  if (branchCategory === unitCategory && branchCategory !== "daily-activities") {
    return 60;
  }

  return 0;
}

function resolveOrdinalIndex(label: string): number | null {
  const match = label.match(/\b(i{1,3}|iv|v|vi{0,3}|[1-9])\b/i);
  if (!match?.[1]) return null;

  const token = match[1].toLowerCase();
  const roman: Record<string, number> = {
    i: 0,
    ii: 1,
    iii: 2,
    iv: 3,
    v: 4,
    vi: 5,
  };
  if (token in roman) return roman[token]!;
  const parsed = Number.parseInt(token, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed - 1) : null;
}

function resolveCmsUnitForSlot(
  slot: BlueprintSlot,
  units: UnitSummaryViewModel[],
): UnitSummaryViewModel | null {
  const branchName = resolveBranchName(slot);
  const ranked = units
    .map((unit, index) => ({
      unit,
      index,
      score: scoreUnitBranchMatch(branchName, unit.name),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);

  if (ranked.length === 0) {
    return null;
  }

  const topScore = ranked[0]!.score;
  const topMatches = ranked.filter((entry) => entry.score === topScore);
  const ordinalIndex = resolveOrdinalIndex(branchName);
  if (ordinalIndex != null && topMatches.length > 1) {
    return topMatches[ordinalIndex]?.unit ?? topMatches[0]!.unit;
  }

  return topMatches[0]!.unit;
}

function resolveCmsLessonForSlot(
  slot: BlueprintSlot,
  slots: readonly BlueprintSlot[],
  units: UnitSummaryViewModel[],
): LessonSummaryViewModel | null {
  const unit = resolveCmsUnitForSlot(slot, units);
  if (!unit) return null;

  const contentIndex = contentIndexForSlot(slots, slot);
  return unit.lessons[contentIndex] ?? null;
}

function unitMatchesBlueprintBranch(
  unit: UnitSummaryViewModel,
  branchName: string,
): boolean {
  return scoreUnitBranchMatch(branchName, unit.name) > 0;
}

function isLessonReservedForBlueprintBranch(
  lesson: LessonSummaryViewModel,
  units: readonly UnitSummaryViewModel[],
  slots: readonly BlueprintSlot[],
): boolean {
  const unit = units.find((entry) => entry.id === lesson.unitId);
  if (!unit) return false;

  const branchNames = new Set(slots.map((slot) => resolveBranchName(slot)));
  for (const branchName of branchNames) {
    if (unitMatchesBlueprintBranch(unit, branchName)) {
      return true;
    }
  }

  return false;
}

function takeNextUnusedLesson(
  flatPool: readonly LessonSummaryViewModel[],
  usedLessonIds: ReadonlySet<string>,
  flatCursor: { current: number },
  units: readonly UnitSummaryViewModel[],
  slots: readonly BlueprintSlot[],
  preferredType?: string,
): LessonSummaryViewModel | null {
  const isEligible = (lesson: LessonSummaryViewModel) =>
    !usedLessonIds.has(lesson.id) &&
    !isLessonReservedForBlueprintBranch(lesson, units, slots);

  if (preferredType) {
    const typedMatch = flatPool.find(
      (lesson) => isEligible(lesson) && lesson.type === preferredType,
    );
    if (typedMatch) return typedMatch;
  }

  while (flatCursor.current < flatPool.length) {
    const lesson = flatPool[flatCursor.current]!;
    flatCursor.current += 1;
    if (isEligible(lesson)) {
      return lesson;
    }
  }

  return null;
}

function resolveSlotLessonType(slot: BlueprintSlot): string {
  if (slot.kind === "checkpoint") return "practice";
  if (slot.kind === "trial") return "application";
  return slot.lessonType;
}

/**
 * Maps CMS lessons onto blueprint slots by branch unit order, falling back to
 * flat CMS order, then virtual draft placeholders. Each CMS lesson is consumed at
 * most once so journey nodes keep unique ids.
 */
function mergeLessonsIntoBlueprint(
  slots: readonly BlueprintSlot[],
  cmsUnits: UnitSummaryViewModel[],
): LessonSummaryViewModel[] {
  const flatPool = cmsUnits.flatMap((unit) => unit.lessons);
  const usedLessonIds = new Set<string>();
  const flatCursor = { current: 0 };

  return slots.map((slot) => {
    const branchLesson = resolveCmsLessonForSlot(slot, slots, cmsUnits);
    if (branchLesson && !usedLessonIds.has(branchLesson.id)) {
      usedLessonIds.add(branchLesson.id);
      return attachBlueprintMeta(branchLesson, slot);
    }

    const branchUnit = resolveCmsUnitForSlot(slot, cmsUnits);
    if (!branchUnit) {
      const fallbackLesson = takeNextUnusedLesson(
        flatPool,
        usedLessonIds,
        flatCursor,
        cmsUnits,
        slots,
        resolveSlotLessonType(slot),
      );
      if (fallbackLesson) {
        usedLessonIds.add(fallbackLesson.id);
        return attachBlueprintMeta(fallbackLesson, slot);
      }
    }

    return lessonFromBlueprintSlot(slot, `blueprint-unit:${slot.branchId}`);
  });
}

function buildUnitsFromSlotsAndLessons(
  slots: readonly BlueprintSlot[],
  mergedLessons: LessonSummaryViewModel[],
): UnitSummaryViewModel[] {
  const branchOrder: string[] = [];
  const lessonsByBranch = new Map<string, LessonSummaryViewModel[]>();

  for (const [index, slot] of slots.entries()) {
    if (!lessonsByBranch.has(slot.branchId)) {
      branchOrder.push(slot.branchId);
      lessonsByBranch.set(slot.branchId, []);
    }
    lessonsByBranch.get(slot.branchId)!.push(mergedLessons[index]!);
  }

  return branchOrder.map((branchId, branchIndex) => {
    const lessons = lessonsByBranch.get(branchId) ?? [];
    const unitId = lessons[0]?.unitId.startsWith("blueprint-unit:")
      ? `blueprint-unit:${branchId}`
      : (lessons[0]?.unitId ?? `blueprint-unit:${branchId}`);
    const branchName = slots.find((slot) => slot.branchId === branchId)?.title.split(" · ")[0]
      ?? `Branch ${branchIndex + 1}`;
    const completedCount = lessons.filter((lesson) => lesson.progress === "completed").length;

    return {
      id: unitId,
      name: branchName,
      description: null,
      orderIndex: branchIndex,
      lessonCount: lessons.length,
      completedCount,
      lessons,
    };
  });
}

function buildRegionFromBlueprint(
  regionSlug: RegionSlug,
  passedTrialSlugs: ReadonlySet<string>,
  baseRegion?: RegionPathViewModel,
): RegionPathViewModel {
  const slots = getRegionBlueprintSlots(regionSlug);
  const access = resolveRegionAccess(regionSlug, passedTrialSlugs);
  const meta = REGION_META[regionSlug];
  const cmsUnits = baseRegion?.units ?? [];
  const mergedLessons = mergeLessonsIntoBlueprint(slots, cmsUnits);
  const units = buildUnitsFromSlotsAndLessons(slots, mergedLessons);

  const lessonCount = units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const completedCount = units.reduce((sum, unit) => sum + unit.completedCount, 0);

  return {
    id: baseRegion?.id ?? `blueprint-region:${regionSlug}`,
    slug: regionSlug,
    name: baseRegion?.name ?? meta.name,
    description: baseRegion?.description ?? meta.description,
    lessonCount,
    completedCount,
    progressPercent:
      lessonCount === 0 ? 0 : Math.round((completedCount / lessonCount) * 100),
    availability: access.availability,
    lockReason: access.lockReason,
    units,
  };
}

/**
 * Ensures every canonical world exists and matches the curriculum blueprint slot count.
 * Virtual draft lessons fill gaps when CMS content or migrations are not yet applied.
 * Legacy region slugs (foothills, mount-n5, …) merge into their JLPT world.
 */
export function augmentRegionsWithBlueprint(
  regions: RegionPathViewModel[],
  passedTrialSlugs: ReadonlySet<string>,
): RegionPathViewModel[] {
  const byWorld = new Map<RegionSlug, RegionPathViewModel>();

  for (const region of regions) {
    const world = normalizeRegionSlug(region.slug);
    const existing = byWorld.get(world);
    if (!existing) {
      byWorld.set(
        world,
        world === region.slug ? region : { ...region, slug: world },
      );
      continue;
    }

    byWorld.set(world, {
      ...existing,
      slug: world,
      lessonCount: existing.lessonCount + region.lessonCount,
      completedCount: existing.completedCount + region.completedCount,
      units: [...existing.units, ...region.units],
    });
  }

  return REGION_SLUGS.map((slug) => {
    const existing = byWorld.get(slug);
    return buildRegionFromBlueprint(slug, passedTrialSlugs, existing);
  });
}

export function isBlueprintLessonId(lessonId: string): boolean {
  return lessonId.startsWith("blueprint:");
}
