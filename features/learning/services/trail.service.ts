import type {
  TrailLessonInput,
  TrailNodeKind,
  TrailNodeViewModel,
} from "@/features/learning/types/trail.types";
import type { ProgressStatus } from "@/features/learning/types/progress.types";

function resolveNodeKind(lessonType: string): TrailNodeKind {
  if (lessonType === "practice") return "checkpoint";
  if (lessonType === "application") return "application";
  return "lesson";
}

function resolveSubtitle(lessonType: string, xpReward: number): string {
  if (lessonType === "practice") {
    return `Exam · ${xpReward} XP`;
  }
  if (lessonType === "application") {
    return `Apply · ${xpReward} XP`;
  }
  return `${lessonType} · ${xpReward} XP`;
}

export function buildTrailNodes(
  lessons: TrailLessonInput[],
  options?: { regionLocked?: boolean },
): TrailNodeViewModel[] {
  if (options?.regionLocked) {
    return lessons.map((lesson) => ({
      id: lesson.id,
      label: lesson.title,
      subtitle: resolveSubtitle(lesson.type, lesson.xpReward),
      href: null,
      state: "locked" as const,
      xpReward: lesson.xpReward,
      nodeKind: resolveNodeKind(lesson.type),
    }));
  }

  let gateOpen = true;

  return lessons.map((lesson) => {
    const href = `/learn/lesson/${lesson.id}`;
    const subtitle = resolveSubtitle(lesson.type, lesson.xpReward);
    const nodeKind = resolveNodeKind(lesson.type);

    if (lesson.progress === "completed") {
      return {
        id: lesson.id,
        label: lesson.title,
        subtitle,
        href,
        state: "completed" as const,
        xpReward: lesson.xpReward,
        nodeKind,
      };
    }

    if (!gateOpen) {
      return {
        id: lesson.id,
        label: lesson.title,
        subtitle,
        href: null,
        state: "locked" as const,
        xpReward: lesson.xpReward,
        nodeKind,
      };
    }

    gateOpen = false;
    return {
      id: lesson.id,
      label: lesson.title,
      subtitle,
      href,
      state:
        lesson.progress === "in_progress"
          ? ("in_progress" as const)
          : ("available" as const),
      xpReward: lesson.xpReward,
      nodeKind,
    };
  });
}

export function flattenRegionTrailLessons(
  units: Array<{
    lessons: Array<{
      id: string;
      title: string;
      type: string;
      xpReward: number;
      progress: ProgressStatus;
    }>;
  }>,
  options?: { regionLocked?: boolean },
): TrailNodeViewModel[] {
  const flatLessons = units.flatMap((unit) => unit.lessons);
  return buildTrailNodes(flatLessons, options);
}

export function countRegionTrailLessons(
  units: ReadonlyArray<{ lessons: ReadonlyArray<unknown> }>,
): number {
  return units.reduce((total, unit) => total + unit.lessons.length, 0);
}

export function getUnitTrailPlacementRange(
  units: ReadonlyArray<{ lessons: ReadonlyArray<unknown> }>,
  unitIndex: number,
): { startIndex: number; totalCount: number } {
  const totalCount = countRegionTrailLessons(units);
  let startIndex = 0;
  for (let index = 0; index < unitIndex; index += 1) {
    startIndex += units[index]?.lessons.length ?? 0;
  }
  return { startIndex, totalCount };
}
