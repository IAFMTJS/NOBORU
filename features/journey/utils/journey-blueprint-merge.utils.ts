import {
  getRegionBlueprintSlots,
  type BlueprintSlot,
} from "@/features/journey/data/world-tree-curriculum-blueprint";
import type {
  LessonSummaryViewModel,
  RegionPathViewModel,
  UnitSummaryViewModel,
} from "@/features/learning/types/lesson.types";
import { REGION_SLUGS, type RegionSlug } from "@/lib/design-system/regions";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";

const REGION_META: Record<
  RegionSlug,
  { name: string; description: string }
> = {
  foothills: { name: "Foothills", description: "Hiragana foundations" },
  "forest-trail": { name: "Forest Trail", description: "Katakana trail" },
  "mount-n5": { name: "Mount N5", description: "JLPT N5 ascent" },
  "mount-n4": { name: "Mount N4", description: "JLPT N4 ascent" },
  "mount-n3": { name: "Mount N3", description: "JLPT N3 trunk rings" },
  "mount-n2": { name: "Mount N2", description: "JLPT N2 canopy" },
  "mount-n1": { name: "Mount N1", description: "JLPT N1 celestial crown" },
  "master-summit": { name: "Master Summit", description: "Post-N1 mastery" },
};

function blueprintKindToLessonType(slot: BlueprintSlot): string {
  if (slot.kind === "checkpoint") return "practice";
  if (slot.kind === "trial") return "application";
  return slot.lessonType;
}

function lessonFromBlueprintSlot(
  slot: BlueprintSlot,
  unitId: string,
): LessonSummaryViewModel {
  return {
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
  };
}

function flattenLessons(region: RegionPathViewModel): LessonSummaryViewModel[] {
  return region.units.flatMap((unit) => unit.lessons);
}

function mergeLessonsIntoBlueprint(
  slots: readonly BlueprintSlot[],
  cmsLessons: LessonSummaryViewModel[],
): LessonSummaryViewModel[] {
  return slots.map((slot, index) => {
    const cmsLesson = cmsLessons[index];
    if (cmsLesson) return cmsLesson;
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
  cmsLessons: LessonSummaryViewModel[],
  passedTrialSlugs: ReadonlySet<string>,
  baseRegion?: RegionPathViewModel,
): RegionPathViewModel {
  const slots = getRegionBlueprintSlots(regionSlug);
  const access = resolveRegionAccess(regionSlug, passedTrialSlugs);
  const meta = REGION_META[regionSlug];
  const mergedLessons = mergeLessonsIntoBlueprint(slots, cmsLessons);
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
 * Ensures every canonical region exists and matches the curriculum blueprint slot count.
 * Virtual draft lessons fill gaps when CMS content or migrations are not yet applied.
 */
export function augmentRegionsWithBlueprint(
  regions: RegionPathViewModel[],
  passedTrialSlugs: ReadonlySet<string>,
): RegionPathViewModel[] {
  const bySlug = new Map(regions.map((region) => [region.slug, region]));

  return REGION_SLUGS.map((slug) => {
    const existing = bySlug.get(slug);
    const cmsLessons = existing ? flattenLessons(existing) : [];
    return buildRegionFromBlueprint(slug, cmsLessons, passedTrialSlugs, existing);
  });
}

export function isBlueprintLessonId(lessonId: string): boolean {
  return lessonId.startsWith("blueprint:");
}
