import type { ProgressStatus } from "@/features/learning/types/progress.types";

export type TrailNodeState = "locked" | "available" | "in_progress" | "completed";

export type TrailNodeViewModel = {
  id: string;
  label: string;
  subtitle: string | null;
  href: string | null;
  state: TrailNodeState;
  xpReward: number;
};

type TrailLessonInput = {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  progress: ProgressStatus;
};

export function buildTrailNodes(
  lessons: TrailLessonInput[],
  options?: { regionLocked?: boolean },
): TrailNodeViewModel[] {
  if (options?.regionLocked) {
    return lessons.map((lesson) => ({
      id: lesson.id,
      label: lesson.title,
      subtitle: `${lesson.type} · ${lesson.xpReward} XP`,
      href: null,
      state: "locked" as const,
      xpReward: lesson.xpReward,
    }));
  }

  let gateOpen = true;

  return lessons.map((lesson) => {
    const href = `/learn/lesson/${lesson.id}`;
    const subtitle = `${lesson.type} · ${lesson.xpReward} XP`;

    if (lesson.progress === "completed") {
      return {
        id: lesson.id,
        label: lesson.title,
        subtitle,
        href,
        state: "completed" as const,
        xpReward: lesson.xpReward,
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
    };
  });
}

export function flattenRegionTrailLessons(
  units: Array<{
    lessons: TrailLessonInput[];
  }>,
  options?: { regionLocked?: boolean },
): TrailNodeViewModel[] {
  const flatLessons = units.flatMap((unit) => unit.lessons);
  return buildTrailNodes(flatLessons, options);
}
