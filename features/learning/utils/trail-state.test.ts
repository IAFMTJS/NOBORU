import { describe, expect, it } from "vitest";

import { buildTrailNodes } from "@/features/learning/utils/trail-state";

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
});
