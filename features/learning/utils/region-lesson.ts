import type {
  LessonSummaryViewModel,
  RegionPathViewModel,
} from "@/features/learning/types/lesson.types";

export function flattenRegionLessons(
  region: RegionPathViewModel,
): LessonSummaryViewModel[] {
  return region.units.flatMap((unit) => unit.lessons);
}

export function findLessonInRegion(
  region: RegionPathViewModel,
  lessonId: string,
): LessonSummaryViewModel | null {
  return flattenRegionLessons(region).find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLessonPositionInRegion(
  region: RegionPathViewModel,
  lessonId: string,
): { index: number; total: number } | null {
  const lessons = flattenRegionLessons(region);
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex === -1) return null;
  return { index: lessonIndex + 1, total: lessons.length };
}

export function getNextLessonInRegion(
  region: RegionPathViewModel,
): { id: string; title: string; href: string } | null {
  for (const unit of region.units) {
    for (const lesson of unit.lessons) {
      if (lesson.progress !== "completed") {
        return {
          id: lesson.id,
          title: lesson.title,
          href: `/learn/lesson/${lesson.id}`,
        };
      }
    }
  }
  return null;
}
