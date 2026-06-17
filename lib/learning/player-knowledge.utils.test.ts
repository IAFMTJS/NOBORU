import { describe, expect, it } from "vitest";

import type { LearnedContentSnapshot } from "@/lib/learning/player-knowledge.utils";
import {
  getKnownIdsFromSnapshot,
  getMasteredIdsFromSnapshot,
  getWeakIdsFromSnapshot,
  prioritizeReviewContentIds,
} from "@/lib/learning/player-knowledge.utils";

function snapshot(
  reviewItems: LearnedContentSnapshot["reviewItems"],
): LearnedContentSnapshot {
  const reviewIdsByType = new Map<string, Set<string>>();
  for (const item of reviewItems) {
    const bucket = reviewIdsByType.get(item.contentType) ?? new Set<string>();
    bucket.add(item.contentId);
    reviewIdsByType.set(item.contentType, bucket);
  }

  return {
    completedLessonIds: [],
    reviewIdsByType,
    lessonItemIdsByType: new Map(),
    reviewItems,
  };
}

describe("player knowledge utils", () => {
  it("derives known and mastered vocabulary ids", () => {
    const data = snapshot([
      {
        contentType: "vocabulary",
        contentId: "v1",
        state: "mastered",
        masteryScore: 92,
        nextReviewAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
      {
        contentType: "vocabulary",
        contentId: "v2",
        state: "learning",
        masteryScore: 40,
        nextReviewAt: new Date(Date.now() - 86_400_000).toISOString(),
      },
    ]);

    expect(getKnownIdsFromSnapshot(data, "vocabulary")).toEqual(["v1", "v2"]);
    expect(getMasteredIdsFromSnapshot(data, "vocabulary")).toEqual(["v1"]);
    expect(getWeakIdsFromSnapshot(data, "vocabulary")).toEqual(["v2"]);
  });

  it("prioritizes weak and due review ids before other known ids", () => {
    const data = snapshot([
      {
        contentType: "vocabulary",
        contentId: "weak",
        state: "learning",
        masteryScore: 30,
        nextReviewAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
      {
        contentType: "vocabulary",
        contentId: "stable",
        state: "good",
        masteryScore: 80,
        nextReviewAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
    ]);

    expect(
      prioritizeReviewContentIds(data, "vocabulary", { limit: 2 }),
    ).toEqual(["weak", "stable"]);
  });
});
