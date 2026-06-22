import { describe, expect, it } from "vitest";

import { LANDMARK_EVERY_N_LESSONS } from "@/features/journey/constants/journey.constants";
import {
  buildRegionJourney,
  canAccessLessonInPath,
  canAccessLessonInRegion,
  resolveNodeKind,
} from "@/features/journey/services/journey.service";
import type { RegionJourneyInput } from "@/features/journey/types/journey.types";
import type { RegionPathViewModel } from "@/features/learning/types/lesson.types";
import type { UserProgressRow } from "@/features/learning/types/progress.types";

function makeRegion(
  overrides: Partial<RegionJourneyInput> & Pick<RegionJourneyInput, "slug">,
): RegionJourneyInput {
  return {
    id: "region-1",
    name: "Foothills",
    description: null,
    availability: "available",
    lockReason: null,
    lessonCount: 0,
    completedCount: 0,
    units: [],
    ...overrides,
  };
}

function makeLesson(
  id: string,
  type: string,
  progress: "not_started" | "in_progress" | "completed" = "not_started",
  contentStatus: "published" | "draft" = "published",
) {
  return {
    id,
    type,
    title: `Lesson ${id}`,
    xpReward: 10,
    progress,
    contentStatus,
  };
}

function makeLessonSummary(
  id: string,
  type: string,
  progress: "not_started" | "in_progress" | "completed" = "not_started",
) {
  return {
    id,
    unitId: "unit-1",
    type,
    title: `Lesson ${id}`,
    description: null,
    xpReward: 10,
    estimatedDuration: 5,
    progress,
    score: progress === "completed" ? 100 : 0,
    contentStatus: "published" as const,
  };
}

function makeProgressRow(lessonId: string, status: UserProgressRow["status"]): UserProgressRow {
  return {
    id: `progress-${lessonId}`,
    user_id: "user-1",
    region_id: "region-1",
    unit_id: "unit-1",
    lesson_id: lessonId,
    status,
    score: status === "completed" ? 100 : 0,
    completed_at: status === "completed" ? "2026-01-01T00:00:00.000Z" : null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

describe("resolveNodeKind", () => {
  it("maps practice to checkpoint and application to trial", () => {
    expect(resolveNodeKind("practice")).toBe("checkpoint");
    expect(resolveNodeKind("application")).toBe("trial");
    expect(resolveNodeKind("vocabulary")).toBe("lesson");
  });
});

describe("buildRegionJourney", () => {
  it("assigns lesson nodes along the regional path contract", () => {
    const region = makeRegion({
      slug: "n5",
      lessonCount: 3,
      units: [
        {
          lessons: [
            makeLesson("1", "vocabulary", "completed"),
            makeLesson("2", "grammar", "not_started"),
            makeLesson("3", "reading", "not_started"),
          ],
        },
      ],
    });

    const journey = buildRegionJourney(region, [], new Set());
    const lessonNodes = journey.nodes.filter((node) => node.kind === "lesson");

    expect(lessonNodes).toHaveLength(3);
    expect(lessonNodes[0]?.pathPosition).toBeCloseTo(0.04, 2);
    expect(lessonNodes[1]?.pathPosition).toBeCloseTo(0.5, 2);
    expect(lessonNodes[2]?.pathPosition).toBeCloseTo(0.96, 2);
  });

  it("uses CMS landmarks when provided", () => {
    const lessons = Array.from({ length: 6 }, (_, index) =>
      makeLesson(`lesson-${index + 1}`, "vocabulary"),
    );

    const region = makeRegion({
      id: "region-cms",
      slug: "n5",
      lessonCount: lessons.length,
      units: [{ lessons }],
    });

    const journey = buildRegionJourney(region, [], new Set(), {
      cmsLandmarks: [
        {
          id: "landmark-cms-1",
          regionId: "region-cms",
          slug: "village-gate",
          label: "Hinori Village",
          subtitle: "First rest stop",
          kind: "village",
          triggerAfterLessonCount: 3,
          pathPosition: 0.42,
          orderIndex: 0,
        },
      ],
    });

    const landmarks = journey.nodes.filter((node) => node.kind === "landmark");
    expect(landmarks).toHaveLength(1);
    expect(landmarks[0]?.label).toBe("Hinori Village");
    expect(landmarks[0]?.pathPosition).toBeCloseTo(0.42, 2);
  });

  it("inserts landmarks every N lessons", () => {
    const lessons = Array.from({ length: LANDMARK_EVERY_N_LESSONS + 2 }, (_, index) =>
      makeLesson(`lesson-${index + 1}`, "vocabulary"),
    );

    const region = makeRegion({
      slug: "n5",
      lessonCount: lessons.length,
      units: [{ lessons }],
    });

    const journey = buildRegionJourney(region, [], new Set());
    const landmarks = journey.nodes.filter((node) => node.kind === "landmark");

    expect(landmarks).toHaveLength(1);
    expect(landmarks[0]?.regionIndex).toBe(LANDMARK_EVERY_N_LESSONS);
    expect(landmarks[0]?.landmarkKind).toBe("village");
    expect(landmarks[0]?.subtitle).toBe("Journey begins");
  });

  it("locks all nodes when the region trial prerequisite is missing", () => {
    const region = makeRegion({
      slug: "n4",
      availability: "locked",
      lockReason: "Complete Final N5 Trial to unlock this region.",
      lessonCount: 2,
      units: [
        {
          lessons: [makeLesson("1", "vocabulary"), makeLesson("2", "grammar")],
        },
      ],
    });

    const journey = buildRegionJourney(region, [], new Set());

    expect(journey.availability).toBe("locked");
    expect(journey.nodes.every((node) => node.state === "locked")).toBe(true);
    expect(journey.nodes.every((node) => node.href === null)).toBe(true);
  });

  it("opens only the first incomplete lesson in sequence", () => {
    const region = makeRegion({
      slug: "n5",
      lessonCount: 3,
      units: [
        {
          lessons: [
            makeLesson("1", "vocabulary", "completed"),
            makeLesson("2", "grammar", "not_started"),
            makeLesson("3", "practice", "not_started"),
          ],
        },
      ],
    });

    const journey = buildRegionJourney(region, [], new Set());
    const lessonNodes = journey.nodes.filter((node) => node.lessonId !== null);

    expect(lessonNodes[0]?.state).toBe("completed");
    expect(lessonNodes[1]?.state).toBe("available");
    expect(lessonNodes[2]?.state).toBe("locked");
    expect(lessonNodes[1]?.kind).toBe("lesson");
    expect(lessonNodes[2]?.kind).toBe("checkpoint");
  });
});

describe("canAccessLessonInRegion", () => {
  const region = makeRegion({
    slug: "n5",
    lessonCount: 4,
    units: [
      {
        lessons: [
          makeLesson("1", "vocabulary", "completed"),
          makeLesson("2", "grammar", "not_started"),
          makeLesson("3", "reading", "not_started"),
          makeLesson("4", "practice", "not_started"),
        ],
      },
    ],
  });

  it("allows completed lessons and the first incomplete lesson", () => {
    expect(canAccessLessonInRegion(region, "1", [], new Set())).toBe(true);
    expect(canAccessLessonInRegion(region, "2", [], new Set())).toBe(true);
  });

  it("blocks lessons beyond the first incomplete node", () => {
    expect(canAccessLessonInRegion(region, "3", [], new Set())).toBe(false);
    expect(canAccessLessonInRegion(region, "4", [], new Set())).toBe(false);
  });

  it("blocks checkpoint access until prior lessons are complete", () => {
    const checkpointRegion = makeRegion({
      slug: "n5",
      lessonCount: 3,
      units: [
        {
          lessons: [
            makeLesson("1", "vocabulary", "completed"),
            makeLesson("2", "grammar", "completed"),
            makeLesson("3", "practice", "not_started"),
          ],
        },
      ],
    });

    expect(canAccessLessonInRegion(checkpointRegion, "3", [], new Set())).toBe(true);
  });

  it("blocks all lessons in a region locked by trial prerequisites", () => {
    const lockedRegion = makeRegion({
      slug: "n4",
      lessonCount: 1,
      units: [{ lessons: [makeLesson("1", "vocabulary")] }],
    });

    expect(canAccessLessonInRegion(lockedRegion, "1", [], new Set())).toBe(false);
  });
});

describe("canAccessLessonInPath", () => {
  it("resolves access against the region that owns the lesson", () => {
    const regions: RegionPathViewModel[] = [
      {
        id: "region-1",
        slug: "n5",
        name: "Foothills",
        description: null,
        lessonCount: 1,
        completedCount: 0,
        progressPercent: 0,
        availability: "available",
        lockReason: null,
        units: [
          {
            id: "unit-1",
            name: "Unit 1",
            description: null,
            orderIndex: 0,
            lessonCount: 1,
            completedCount: 0,
            lessons: [makeLessonSummary("lesson-a", "vocabulary")],
          },
        ],
      },
    ];

    expect(canAccessLessonInPath(regions, "lesson-a", [], new Set())).toBe(true);
    expect(canAccessLessonInPath(regions, "missing", [], new Set())).toBe(false);
  });

  it("honors progress rows over embedded lesson progress", () => {
    const region = makeRegion({
      slug: "n5",
      lessonCount: 2,
      units: [
        {
          lessons: [
            makeLesson("1", "vocabulary", "not_started"),
            makeLesson("2", "grammar", "not_started"),
          ],
        },
      ],
    });

    const progressRows = [makeProgressRow("1", "completed")];

    expect(canAccessLessonInRegion(region, "1", progressRows, new Set())).toBe(true);
    expect(canAccessLessonInRegion(region, "2", progressRows, new Set())).toBe(true);
    expect(canAccessLessonInRegion(region, "2", [], new Set())).toBe(false);
  });
});

describe("draft CMS lessons", () => {
  it("shows draft lessons as locked with no href", () => {
    const region = makeRegion({
      slug: "mount-n3",
      units: [
        {
          lessons: [makeLesson("draft-1", "vocabulary", "not_started", "draft")],
        },
      ],
      lessonCount: 1,
    });

    const journey = buildRegionJourney(region, [], new Set());
    const node = journey.nodes[0];

    expect(node?.state).toBe("locked");
    expect(node?.href).toBeNull();
    expect(node?.isDraft).toBe(true);
    expect(node?.contentStatus).toBe("draft");
  });

  it("does not block progression gate for published lessons after draft placeholders", () => {
    const region = makeRegion({
      slug: "n5",
      units: [
        {
          lessons: [
            makeLesson("published-1", "vocabulary", "completed", "published"),
            makeLesson("draft-2", "vocabulary", "not_started", "draft"),
            makeLesson("published-3", "grammar", "not_started", "published"),
          ],
        },
      ],
      lessonCount: 2,
    });

    const journey = buildRegionJourney(region, [], new Set());
    const publishedNode = journey.nodes.find((node) => node.id === "published-3");

    expect(publishedNode?.state).toBe("available");
  });
});
