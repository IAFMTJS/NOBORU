import type { ProgressStatus } from "@/features/learning/types/progress.types";

export type TrailNodeState = "locked" | "available" | "in_progress" | "completed";

export type TrailNodeKind = "lesson" | "checkpoint";

export type TrailNodeViewModel = {
  id: string;
  label: string;
  subtitle: string | null;
  href: string | null;
  state: TrailNodeState;
  xpReward: number;
  nodeKind: TrailNodeKind;
};

type TrailLessonInput = {
  id: string;
  title: string;
  type: string;
  xpReward: number;
  progress: ProgressStatus;
};

function resolveNodeKind(lessonType: string): TrailNodeKind {
  return lessonType === "practice" ? "checkpoint" : "lesson";
}

function resolveSubtitle(lessonType: string, xpReward: number): string {
  if (lessonType === "practice") {
    return `Exam · ${xpReward} XP`;
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
    lessons: TrailLessonInput[];
  }>,
  options?: { regionLocked?: boolean },
): TrailNodeViewModel[] {
  const flatLessons = units.flatMap((unit) => unit.lessons);
  return buildTrailNodes(flatLessons, options);
}
