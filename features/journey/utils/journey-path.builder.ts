import {
  JOURNEY_LANDMARKS,
  LANDMARK_EVERY_N_LESSONS,
} from "@/features/journey/constants/journey.constants";
import type {
  JourneyNode,
  JourneyNodeKind,
  JourneyNodeState,
  JourneyLandmarkKind,
  JourneyPathViewModel,
  JourneyPosition,
  JourneyRegionViewModel,
  RegionJourneyInput,
} from "@/features/journey/types/journey.types";
import type { JourneyLandmarkContent } from "@/features/journey/types/journey-content.types";
import type {
  LessonBlueprintMeta,
  RegionPathViewModel,
} from "@/features/learning/types/lesson.types";
import type { ProgressStatus, UserProgressRow } from "@/features/learning/types/progress.types";
import type { ContentStatus } from "@/lib/content/types";
import {
  resolveCheckpointPathPosition,
  resolveLandmarkPathPosition,
} from "@/lib/design-system/journey-path-contracts";
import { resolveRegionAccess } from "@/lib/learning/region-unlock";
import { resolveN5TrialDisplayTitle } from "@/features/worlds/constants/n5-trial-display.constants";

type FlatLesson = {
  id: string;
  type: string;
  title: string;
  xpReward: number;
  progress: ProgressStatus;
  contentStatus: ContentStatus;
  blueprint?: LessonBlueprintMeta;
};

type FlatLessonWithRegion = FlatLesson & {
  regionSlug: string;
  regionIndex: number;
};

export function resolveNodeKind(lessonType: string): JourneyNodeKind {
  if (lessonType === "practice") return "checkpoint";
  if (lessonType === "application") return "trial";
  return "lesson";
}

function resolveNodeSubtitle(lessonType: string, xpReward: number): string | null {
  if (lessonType === "practice") return `Exam Â· ${xpReward} XP`;
  if (lessonType === "application") return `Trial Â· ${xpReward} XP`;
  return `${lessonType} Â· ${xpReward} XP`;
}

function flattenRegionLessons(region: RegionJourneyInput): FlatLesson[] {
  return region.units.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      id: lesson.id,
      type: lesson.type,
      title: lesson.title,
      xpReward: lesson.xpReward,
      progress: lesson.progress,
      contentStatus: lesson.contentStatus ?? "published",
      blueprint: lesson.blueprint,
    })),
  );
}

function buildProgressMap(
  progressRows: ReadonlyArray<UserProgressRow>,
): Map<string, ProgressStatus> {
  return new Map(progressRows.map((row) => [row.lesson_id, row.status]));
}

function resolveLessonProgress(
  lessonId: string,
  embeddedProgress: ProgressStatus,
  progressByLesson: ReadonlyMap<string, ProgressStatus>,
): ProgressStatus {
  return progressByLesson.get(lessonId) ?? embeddedProgress;
}

function resolveLandmarkDefinition(landmarkIndex: number) {
  return (
    JOURNEY_LANDMARKS[landmarkIndex % JOURNEY_LANDMARKS.length] ?? {
      label: "Landmark",
      subtitle: "Destination",
      kind: "overlook" as const,
    }
  );
}


type DraftNode =
  | {
      kind: "lesson";
      lesson: FlatLesson;
    }
  | {
      kind: "landmark";
      id: string;
      label: string;
      subtitle: string;
      landmarkKind: JourneyLandmarkKind;
      landmarkIndex: number;
      afterLessonCount: number;
      pathPositionOverride?: number | null;
    };

function buildDraftNodesFromCmsLandmarks(
  region: RegionJourneyInput,
  progressByLesson: ReadonlyMap<string, ProgressStatus>,
  cmsLandmarks: JourneyLandmarkContent[],
): DraftNode[] {
  const lessons = flattenRegionLessons(region).map((lesson) => ({
    ...lesson,
    progress: resolveLessonProgress(lesson.id, lesson.progress, progressByLesson),
  }));

  const triggers = new Map(
    cmsLandmarks.map((landmark) => [landmark.triggerAfterLessonCount, landmark]),
  );
  const drafts: DraftNode[] = [];
  let landmarkIndex = 0;

  for (const [index, lesson] of lessons.entries()) {
    drafts.push({ kind: "lesson", lesson });

    const lessonNumber = index + 1;
    const cmsLandmark = triggers.get(lessonNumber);
    if (cmsLandmark && lessonNumber < lessons.length) {
      drafts.push({
        kind: "landmark",
        id: cmsLandmark.id,
        label: cmsLandmark.label,
        subtitle: cmsLandmark.subtitle ?? "",
        landmarkKind: cmsLandmark.kind,
        landmarkIndex,
        afterLessonCount: lessonNumber,
        pathPositionOverride: cmsLandmark.pathPosition,
      });
      landmarkIndex += 1;
    }
  }

  return drafts;
}

function buildDraftNodesFromFallback(
  region: RegionJourneyInput,
  progressByLesson: ReadonlyMap<string, ProgressStatus>,
): DraftNode[] {
  const lessons = flattenRegionLessons(region).map((lesson) => ({
    ...lesson,
    progress: resolveLessonProgress(lesson.id, lesson.progress, progressByLesson),
  }));

  const drafts: DraftNode[] = [];
  let landmarkIndex = 0;

  for (const [index, lesson] of lessons.entries()) {
    drafts.push({ kind: "lesson", lesson });

    const lessonNumber = index + 1;
    const isLastLesson = lessonNumber === lessons.length;
    if (!isLastLesson && lessonNumber % LANDMARK_EVERY_N_LESSONS === 0) {
      const landmark = resolveLandmarkDefinition(landmarkIndex);
      drafts.push({
        kind: "landmark",
        id: `landmark-${region.slug}-${landmarkIndex}`,
        label: landmark.label,
        subtitle: landmark.subtitle,
        landmarkKind: landmark.kind,
        landmarkIndex,
        afterLessonCount: lessonNumber,
      });
      landmarkIndex += 1;
    }
  }

  return drafts;
}

function buildDraftNodes(
  region: RegionJourneyInput,
  progressByLesson: ReadonlyMap<string, ProgressStatus>,
  cmsLandmarks: JourneyLandmarkContent[] = [],
): DraftNode[] {
  if (cmsLandmarks.length > 0) {
    return buildDraftNodesFromCmsLandmarks(region, progressByLesson, cmsLandmarks);
  }

  return buildDraftNodesFromFallback(region, progressByLesson);
}

function applyLandmarkPathOverrides(
  nodes: JourneyNode[],
  drafts: DraftNode[],
): void {
  for (const draft of drafts) {
    if (draft.kind !== "landmark" || draft.pathPositionOverride == null) continue;
    const node = nodes.find((entry) => entry.id === draft.id);
    if (node) {
      node.pathPosition = draft.pathPositionOverride;
    }
  }
}

function resolveLessonNodeState(
  lesson: FlatLesson,
  regionLocked: boolean,
  gateOpen: boolean,
): { state: JourneyNodeState; gateOpen: boolean } {
  if (lesson.contentStatus === "draft") {
    return { state: "locked", gateOpen };
  }

  if (regionLocked) {
    return { state: "locked", gateOpen: false };
  }

  if (lesson.progress === "completed") {
    return { state: "completed", gateOpen: true };
  }

  if (!gateOpen) {
    return { state: "locked", gateOpen: false };
  }

  return {
    state: lesson.progress === "in_progress" ? "in_progress" : "available",
    gateOpen: false,
  };
}

function resolveLandmarkNodeState(
  afterLessonCount: number,
  completedLessonCount: number,
  regionLocked: boolean,
): JourneyNodeState {
  if (regionLocked) return "locked";
  if (completedLessonCount >= afterLessonCount) return "completed";
  if (completedLessonCount === afterLessonCount - 1) return "available";
  return "locked";
}

function countCompletedLessons(lessons: FlatLesson[]): number {
  return lessons.filter((lesson) => lesson.progress === "completed").length;
}

function assignNodePathPositions(
  nodes: JourneyNode[],
  regionSlug: string,
): void {
  let checkpointIndex = 0;
  let landmarkIndex = 0;
  const lessonNodes = nodes.filter(
    (node) => node.kind === "lesson" || node.kind === "trial",
  );
  let lessonIndex = 0;

  for (const node of nodes) {
    if (node.kind === "landmark") {
      node.pathPosition = resolveLandmarkPathPosition(regionSlug, landmarkIndex);
      landmarkIndex += 1;
      continue;
    }

    if (node.kind === "checkpoint") {
      node.pathPosition = resolveCheckpointPathPosition(
        regionSlug,
        checkpointIndex,
      );
      checkpointIndex += 1;
      continue;
    }

    if (lessonNodes.length <= 1) {
      node.pathPosition = 0.5;
    } else {
      const t = lessonIndex / (lessonNodes.length - 1);
      node.pathPosition = 0.04 + t * 0.92;
    }
    lessonIndex += 1;
  }
}

export function buildRegionJourney(
  region: RegionJourneyInput,
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
  options?: {
    globalStartIndex?: number;
    cmsLandmarks?: JourneyLandmarkContent[];
  },
): JourneyRegionViewModel {
  const progressByLesson = buildProgressMap(progressRows);
  const access = resolveRegionAccess(region.slug, passedTrialSlugs);
  const regionLocked = access.availability === "locked";
  const lessons = flattenRegionLessons(region).map((lesson) => ({
    ...lesson,
    progress: resolveLessonProgress(lesson.id, lesson.progress, progressByLesson),
  }));
  const completedLessonCount = countCompletedLessons(lessons);
  const drafts = buildDraftNodes(
    region,
    progressByLesson,
    options?.cmsLandmarks ?? [],
  );

  let gateOpen = !regionLocked;
  let currentNodeIndex: number | null = null;
  const globalStartIndex = options?.globalStartIndex ?? 0;

  const nodes: JourneyNode[] = drafts.map((draft, regionIndex) => {
    if (draft.kind === "landmark") {
      const state = resolveLandmarkNodeState(
        draft.afterLessonCount,
        completedLessonCount,
        regionLocked,
      );

      if (
        currentNodeIndex === null &&
        (state === "available" || state === "in_progress")
      ) {
        currentNodeIndex = regionIndex;
      }

      return {
        id: draft.id,
        lessonId: null,
        kind: "landmark",
        landmarkKind: draft.landmarkKind,
        label: draft.label,
        subtitle: draft.subtitle,
        lessonType: null,
        state,
        pathPosition: 0,
        regionIndex,
        globalIndex: globalStartIndex + regionIndex,
        href: null,
        xpReward: null,
      };
    }

    const { state, gateOpen: nextGateOpen } = resolveLessonNodeState(
      draft.lesson,
      regionLocked,
      gateOpen,
    );
    gateOpen = nextGateOpen;

    if (
      currentNodeIndex === null &&
      (state === "available" || state === "in_progress")
    ) {
      currentNodeIndex = regionIndex;
    }

    const href =
      draft.lesson.contentStatus === "draft" ||
      state === "locked" ||
      regionLocked
        ? null
        : `/learn/lesson/${draft.lesson.id}`;

    return {
      id: draft.lesson.id,
      lessonId: draft.lesson.id,
      kind: resolveNodeKind(draft.lesson.type),
      label:
        draft.lesson.type === "application"
          ? resolveN5TrialDisplayTitle(draft.lesson.title, region.slug)
          : draft.lesson.title,
      subtitle: resolveNodeSubtitle(draft.lesson.type, draft.lesson.xpReward),
      lessonType: draft.lesson.type,
      state,
      pathPosition: 0,
      regionIndex,
      globalIndex: globalStartIndex + regionIndex,
      href,
      xpReward: draft.lesson.xpReward,
      contentStatus: draft.lesson.contentStatus,
      isDraft: draft.lesson.contentStatus === "draft",
      blueprint: draft.lesson.blueprint,
    };
  });

  assignNodePathPositions(nodes, region.slug);
  applyLandmarkPathOverrides(nodes, drafts);

  const progressPercent =
    region.lessonCount === 0
      ? 0
      : Math.round((completedLessonCount / region.lessonCount) * 100);

  return {
    id: region.id,
    slug: region.slug,
    name: region.name,
    description: region.description,
    availability: access.availability,
    lockReason: access.lockReason,
    lessonCount: region.lessonCount,
    completedCount: completedLessonCount,
    progressPercent,
    nodes,
    currentNodeIndex,
  };
}

function flattenAccessibleLessons(
  regions: RegionPathViewModel[],
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
): FlatLessonWithRegion[] {
  const progressByLesson = buildProgressMap(progressRows);

  return regions.flatMap((region, regionIndex) => {
    if (resolveRegionAccess(region.slug, passedTrialSlugs).availability === "locked") {
      return [];
    }

    return flattenRegionLessons(region).map((lesson) => ({
      ...lesson,
      progress: resolveLessonProgress(lesson.id, lesson.progress, progressByLesson),
      regionSlug: region.slug,
      regionIndex,
    }));
  });
}

export function canAccessLessonInRegion(
  region: RegionJourneyInput,
  lessonId: string,
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
): boolean {
  const access = resolveRegionAccess(region.slug, passedTrialSlugs);
  if (access.availability === "locked") return false;

  const progressByLesson = buildProgressMap(progressRows);
  const lessons = flattenRegionLessons(region).map((lesson) => ({
    ...lesson,
    progress: resolveLessonProgress(lesson.id, lesson.progress, progressByLesson),
  }));

  let targetLesson: FlatLesson | null = null;
  let priorIncompleteExists = false;

  for (const lesson of lessons) {
    if (lesson.id === lessonId) {
      targetLesson = lesson;
      break;
    }

    if (lesson.progress !== "completed") {
      priorIncompleteExists = true;
    }
  }

  if (!targetLesson) return false;
  if (targetLesson.progress === "completed") return true;
  if (priorIncompleteExists) return false;

  if (targetLesson.type === "practice") {
    return lessons
      .slice(0, lessons.findIndex((lesson) => lesson.id === lessonId))
      .every((lesson) => lesson.progress === "completed");
  }

  return true;
}

export function canAccessLessonInPath(
  regions: RegionPathViewModel[],
  lessonId: string,
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
): boolean {
  for (const region of regions) {
    const lessons = flattenRegionLessons(region);
    if (!lessons.some((lesson) => lesson.id === lessonId)) continue;
    return canAccessLessonInRegion(region, lessonId, progressRows, passedTrialSlugs);
  }

  return false;
}

export function resolveJourneyPositionFromPath(
  regions: RegionPathViewModel[],
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
  landmarksByRegionId: Map<string, JourneyLandmarkContent[]> = new Map(),
): JourneyPosition {
  let globalStartIndex = 0;
  let globalLessonIndex = 0;
  let lastRegionJourney: JourneyRegionViewModel | null = null;

  for (const [regionIndex, region] of regions.entries()) {
    const regionJourney = buildRegionJourney(
      region,
      progressRows,
      passedTrialSlugs,
      {
        globalStartIndex,
        cmsLandmarks: landmarksByRegionId.get(region.id) ?? [],
      },
    );
    lastRegionJourney = regionJourney;

    if (regionJourney.currentNodeIndex !== null) {
      const currentNode = regionJourney.nodes[regionJourney.currentNodeIndex];
      return {
        currentRegionSlug: region.slug,
        currentRegionIndex: regionIndex,
        currentLessonId: currentNode?.lessonId ?? null,
        currentNodeId: currentNode?.id ?? null,
        globalNodeIndex: currentNode?.globalIndex ?? globalStartIndex,
        globalLessonIndex,
        pathPosition: currentNode?.pathPosition ?? 0,
      };
    }

    globalStartIndex += regionJourney.nodes.length;
    globalLessonIndex += flattenRegionLessons(region).length;
  }

  const fallbackRegion = regions[regions.length - 1];
  const lastNode = lastRegionJourney?.nodes.at(-1);

  return {
    currentRegionSlug: fallbackRegion?.slug ?? "n5",
    currentRegionIndex: Math.max(regions.length - 1, 0),
    currentLessonId: null,
    currentNodeId: lastNode?.id ?? null,
    globalNodeIndex: lastNode?.globalIndex ?? 0,
    globalLessonIndex: regions.reduce(
      (total, region) => total + flattenRegionLessons(region).length,
      0,
    ),
    pathPosition: lastNode?.pathPosition ?? 1,
  };
}

export function groupLandmarksByRegionId(
  landmarks: JourneyLandmarkContent[],
): Map<string, JourneyLandmarkContent[]> {
  const grouped = new Map<string, JourneyLandmarkContent[]>();
  for (const landmark of landmarks) {
    const bucket = grouped.get(landmark.regionId) ?? [];
    bucket.push(landmark);
    grouped.set(landmark.regionId, bucket);
  }
  return grouped;
}

export function buildJourneyPathFromData(
  regions: RegionPathViewModel[],
  progressRows: ReadonlyArray<UserProgressRow>,
  passedTrialSlugs: ReadonlySet<string>,
  landmarksByRegionId: Map<string, JourneyLandmarkContent[]> = new Map(),
): JourneyPathViewModel {
  let globalStartIndex = 0;
  const journeyRegions = regions.map((region) => {
    const regionJourney = buildRegionJourney(
      region,
      progressRows,
      passedTrialSlugs,
      {
        globalStartIndex,
        cmsLandmarks: landmarksByRegionId.get(region.id) ?? [],
      },
    );
    globalStartIndex += regionJourney.nodes.length;
    return regionJourney;
  });

  const position = resolveJourneyPositionFromPath(
    regions,
    progressRows,
    passedTrialSlugs,
    landmarksByRegionId,
  );

  const nextLesson = flattenAccessibleLessons(regions, progressRows, passedTrialSlugs).find(
    (lesson) => lesson.progress !== "completed",
  );

  return {
    regions: journeyRegions,
    position,
    nextLessonId: nextLesson?.id ?? null,
    nextLessonHref: nextLesson ? `/learn/lesson/${nextLesson.id}` : null,
  };
}
