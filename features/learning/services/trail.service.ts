import { MAX_LESSONS_PER_TRAIL_PATH } from "@/features/learning/constants/trail.constants";
import type {
  TrailLessonInput,
  TrailNodeKind,
  TrailNodeViewModel,
  TrailPlacementRange,
  TrailSegmentSlice,
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

export function countTrailSegments(
  lessonCount: number,
  maxPerSegment: number = MAX_LESSONS_PER_TRAIL_PATH,
): number {
  if (lessonCount <= 0) return 0;
  return Math.ceil(lessonCount / maxPerSegment);
}

export function resolveTrailSegmentIndex(
  globalLessonIndex: number,
  maxPerSegment: number = MAX_LESSONS_PER_TRAIL_PATH,
): number {
  return Math.floor(globalLessonIndex / maxPerSegment);
}

export function getTrailSegmentLessonCapacity(
  regionLessonCount: number,
  trailSegmentIndex: number,
  maxPerSegment: number = MAX_LESSONS_PER_TRAIL_PATH,
): number {
  if (regionLessonCount <= 0 || trailSegmentIndex < 0) return 0;
  const segmentStart = trailSegmentIndex * maxPerSegment;
  if (segmentStart >= regionLessonCount) return 0;
  return Math.min(maxPerSegment, regionLessonCount - segmentStart);
}

export function buildTrailPlacementRange(
  globalStartIndex: number,
  regionLessonCount: number,
  maxPerSegment: number = MAX_LESSONS_PER_TRAIL_PATH,
): TrailPlacementRange {
  const trailSegmentIndex = resolveTrailSegmentIndex(globalStartIndex, maxPerSegment);
  const segmentGlobalStart = trailSegmentIndex * maxPerSegment;

  return {
    startIndex: globalStartIndex - segmentGlobalStart,
    totalCount: getTrailSegmentLessonCapacity(
      regionLessonCount,
      trailSegmentIndex,
      maxPerSegment,
    ),
    trailSegmentIndex,
  };
}

export function splitTrailNodesIntoSegments<T>(
  nodes: ReadonlyArray<T>,
  options?: {
    globalStartIndex?: number;
    regionLessonCount?: number;
    maxPerSegment?: number;
  },
): TrailSegmentSlice<T>[] {
  const maxPerSegment = options?.maxPerSegment ?? MAX_LESSONS_PER_TRAIL_PATH;
  const globalStart = options?.globalStartIndex ?? 0;
  const regionTotal = options?.regionLessonCount ?? globalStart + nodes.length;

  if (nodes.length === 0) return [];

  const slices: TrailSegmentSlice<T>[] = [];
  let localOffset = 0;

  while (localOffset < nodes.length) {
    const globalIndex = globalStart + localOffset;
    const trailSegmentIndex = resolveTrailSegmentIndex(globalIndex, maxPerSegment);
    const segmentGlobalStart = trailSegmentIndex * maxPerSegment;
    const roomInSegment = maxPerSegment - (globalIndex - segmentGlobalStart);
    const chunkSize = Math.min(roomInSegment, nodes.length - localOffset);

    slices.push({
      trailSegmentIndex,
      nodes: nodes.slice(localOffset, localOffset + chunkSize),
      placementRange: {
        startIndex: globalIndex - segmentGlobalStart,
        totalCount: getTrailSegmentLessonCapacity(
          regionTotal,
          trailSegmentIndex,
          maxPerSegment,
        ),
        trailSegmentIndex,
      },
    });

    localOffset += chunkSize;
  }

  return slices;
}

export function getUnitTrailPlacementRange(
  units: ReadonlyArray<{ lessons: ReadonlyArray<unknown> }>,
  unitIndex: number,
): TrailPlacementRange {
  const regionLessonCount = countRegionTrailLessons(units);
  let globalStartIndex = 0;
  for (let index = 0; index < unitIndex; index += 1) {
    globalStartIndex += units[index]?.lessons.length ?? 0;
  }
  return buildTrailPlacementRange(globalStartIndex, regionLessonCount);
}

export function getUnitTrailSegmentSlices<
  T extends { id: string },
>(
  units: ReadonlyArray<{ lessons: ReadonlyArray<T> }>,
  unitIndex: number,
): TrailSegmentSlice<T>[] {
  const regionLessonCount = countRegionTrailLessons(units);
  let globalStartIndex = 0;
  for (let index = 0; index < unitIndex; index += 1) {
    globalStartIndex += units[index]?.lessons.length ?? 0;
  }

  const unitLessons = units[unitIndex]?.lessons ?? [];
  return splitTrailNodesIntoSegments(unitLessons, {
    globalStartIndex,
    regionLessonCount,
  });
}
