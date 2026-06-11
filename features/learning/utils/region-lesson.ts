import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";

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
