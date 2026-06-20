import { describe, expect, it } from "vitest";

import type {
  JourneyNode,
  JourneyPathViewModel,
  JourneyRegionViewModel,
} from "@/features/journey/types/journey.types";
import { buildWorldTreeLayout } from "@/features/journey/utils/world-tree-layout.utils";
import {
  findFirstAscentJourneyNode,
  findLastCompletedJourneyNode,
  resolveWorldTreeScrollFocus,
} from "@/features/journey/utils/world-tree-scroll-focus.utils";

function makeNode(overrides: Partial<JourneyNode> = {}): JourneyNode {
  return {
    id: "node-1",
    lessonId: "lesson-1",
    kind: "lesson",
    label: "Lesson 1",
    subtitle: null,
    lessonType: "vocabulary",
    state: "available",
    pathPosition: 0,
    regionIndex: 0,
    globalIndex: 0,
    href: null,
    xpReward: 10,
    ...overrides,
  };
}

function makeRegion(
  overrides: Partial<JourneyRegionViewModel> = {},
): JourneyRegionViewModel {
  return {
    id: "region-1",
    slug: "foothills",
    name: "Foothills",
    description: null,
    availability: "available",
    lockReason: null,
    lessonCount: 1,
    completedCount: 0,
    progressPercent: 0,
    nodes: [makeNode()],
    currentNodeIndex: 0,
    ...overrides,
  };
}

function makeJourney(regions: JourneyRegionViewModel[]): JourneyPathViewModel {
  return {
    regions,
    position: {
      currentRegionSlug: regions[0]?.slug ?? "foothills",
      currentRegionIndex: 0,
      currentLessonId: regions[0]?.nodes[0]?.lessonId ?? null,
      currentNodeId: regions[0]?.nodes[0]?.id ?? null,
      globalNodeIndex: 0,
      globalLessonIndex: 0,
      pathPosition: 0,
    },
    nextLessonId: null,
    nextLessonHref: null,
  };
}

describe("findLastCompletedJourneyNode", () => {
  it("returns the highest global index among completed nodes", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "a", globalIndex: 0, state: "completed" }),
          makeNode({ id: "b", globalIndex: 1, state: "completed" }),
          makeNode({ id: "c", globalIndex: 2, state: "available" }),
        ],
      }),
    ]);

    expect(findLastCompletedJourneyNode(journey)?.id).toBe("b");
  });
});

describe("resolveWorldTreeScrollFocus", () => {
  it("anchors to the bottom when no lessons are completed", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "first", globalIndex: 0 }),
          makeNode({ id: "second", globalIndex: 1, state: "locked" }),
        ],
      }),
    ]);
    const layout = buildWorldTreeLayout(journey);

    expect(resolveWorldTreeScrollFocus(journey, layout)).toEqual({
      focusYPercent: null,
      anchorScrollToBottom: true,
      highlightNodeId: "first",
      focusZoneId: null,
    });
  });

  it("focuses the last completed lesson when progress exists", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "done-1", globalIndex: 0, state: "completed" }),
          makeNode({ id: "done-2", globalIndex: 1, state: "completed" }),
          makeNode({ id: "next", globalIndex: 2, state: "available" }),
        ],
      }),
    ]);
    const layout = buildWorldTreeLayout(journey);
    const focus = resolveWorldTreeScrollFocus(journey, layout);

    expect(focus.anchorScrollToBottom).toBe(false);
    expect(focus.highlightNodeId).toBe("done-2");
    expect(focus.focusYPercent).toBe(
      layout.nodes.find((node) => node.node.id === "done-2")?.yPercent,
    );
  });

  it("prefers explicit node deep links", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "done", globalIndex: 0, state: "completed" }),
          makeNode({ id: "target", globalIndex: 1, state: "available" }),
        ],
      }),
    ]);
    const layout = buildWorldTreeLayout(journey);
    const focus = resolveWorldTreeScrollFocus(journey, layout, {
      highlightNodeId: "target",
    });

    expect(focus.highlightNodeId).toBe("target");
    expect(focus.anchorScrollToBottom).toBe(false);
  });
});

describe("findFirstAscentJourneyNode", () => {
  it("returns the lowest global index lesson-like node", () => {
    const journey = makeJourney([
      makeRegion({
        nodes: [
          makeNode({ id: "lesson", globalIndex: 1, kind: "lesson" }),
          makeNode({ id: "landmark", globalIndex: 0, kind: "landmark", lessonId: null }),
        ],
      }),
    ]);

    expect(findFirstAscentJourneyNode(journey)?.id).toBe("lesson");
  });
});
