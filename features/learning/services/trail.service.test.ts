import { describe, expect, it } from "vitest";

import { buildTrailNodes, getUnitTrailPlacementRange, splitTrailNodesIntoSegments } from "@/features/learning/services/trail.service";

describe("buildTrailNodes", () => {
  it("locks all nodes when the region is locked", () => {
    const nodes = buildTrailNodes(
      [
        {
          id: "1",
          title: "Lesson A",
          type: "vocabulary",
          xpReward: 10,
          progress: "not_started",
        },
        {
          id: "2",
          title: "Lesson B",
          type: "grammar",
          xpReward: 12,
          progress: "not_started",
        },
      ],
      { regionLocked: true },
    );

    expect(nodes.every((node) => node.state === "locked")).toBe(true);
    expect(nodes.every((node) => node.href === null)).toBe(true);
  });

  it("opens the first incomplete lesson in sequence", () => {
    const nodes = buildTrailNodes([
      {
        id: "1",
        title: "Lesson A",
        type: "vocabulary",
        xpReward: 10,
        progress: "completed",
      },
      {
        id: "2",
        title: "Lesson B",
        type: "grammar",
        xpReward: 12,
        progress: "not_started",
      },
      {
        id: "3",
        title: "Lesson C",
        type: "kanji",
        xpReward: 12,
        progress: "not_started",
      },
    ]);

    expect(nodes[0]?.state).toBe("completed");
    expect(nodes[1]?.state).toBe("available");
    expect(nodes[2]?.state).toBe("locked");
  });

  it("marks practice lessons as checkpoint nodes with exam subtitle", () => {
    const nodes = buildTrailNodes([
      {
        id: "1",
        title: "Wave 1 Practice",
        type: "practice",
        xpReward: 20,
        progress: "not_started",
      },
    ]);

    expect(nodes[0]?.nodeKind).toBe("checkpoint");
    expect(nodes[0]?.subtitle).toBe("Exam · 20 XP");
  });

  it("marks application lessons with apply subtitle", () => {
    const nodes = buildTrailNodes([
      {
        id: "1",
        title: "Words on the Trail",
        type: "application",
        xpReward: 18,
        progress: "not_started",
      },
    ]);

    expect(nodes[0]?.nodeKind).toBe("application");
    expect(nodes[0]?.subtitle).toBe("Apply · 18 XP");
  });
});

describe("getUnitTrailPlacementRange", () => {
  it("returns the lesson offset for a unit within the region trail", () => {
    const units = [
      { lessons: [{ id: "1" }, { id: "2" }] },
      { lessons: [{ id: "3" }] },
      { lessons: [{ id: "4" }, { id: "5" }, { id: "6" }] },
    ];

    expect(getUnitTrailPlacementRange(units, 0)).toEqual({
      startIndex: 0,
      totalCount: 6,
      trailSegmentIndex: 0,
    });
    expect(getUnitTrailPlacementRange(units, 2)).toEqual({
      startIndex: 3,
      totalCount: 6,
      trailSegmentIndex: 0,
    });
  });

  it("maps units past lesson 40 onto the next trail segment", () => {
    const units = [
      {
        lessons: Array.from({ length: 38 }, (_, index) => ({ id: `a-${index}` })),
      },
      {
        lessons: [{ id: "b-1" }, { id: "b-2" }, { id: "b-3" }],
      },
    ];

    expect(getUnitTrailPlacementRange(units, 1)).toEqual({
      startIndex: 38,
      totalCount: 40,
      trailSegmentIndex: 0,
    });
  });
});

describe("splitTrailNodesIntoSegments", () => {
  it("splits immersive trails into 40-lesson segments", () => {
    const nodes = Array.from({ length: 55 }, (_, index) => ({
      id: `lesson-${index}`,
    }));

    const segments = splitTrailNodesIntoSegments(nodes, {
      regionLessonCount: 55,
    });

    expect(segments).toHaveLength(2);
    expect(segments[0]?.nodes).toHaveLength(40);
    expect(segments[1]?.nodes).toHaveLength(15);
    expect(segments[0]?.placementRange).toEqual({
      startIndex: 0,
      totalCount: 40,
      trailSegmentIndex: 0,
    });
    expect(segments[1]?.placementRange).toEqual({
      startIndex: 0,
      totalCount: 15,
      trailSegmentIndex: 1,
    });
  });
});
