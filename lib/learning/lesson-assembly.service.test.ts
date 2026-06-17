import { describe, expect, it } from "vitest";

import {
  buildCheckpointExerciseCandidates,
  capNewVocabularyInLessonContents,
  computeLessonExerciseSlotCount,
  planLessonExerciseCandidates,
} from "@/lib/learning/lesson-assembly.service";
import { planCheckpointActivities } from "@/lib/learning/checkpoint-assembly.service";
import type {
  GrammarLessonContent,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import type { LessonContent } from "@/features/learning/types/lesson.types";

function vocab(id: string): VocabularyLessonContent {
  return {
    type: "vocabulary",
    id,
    kana: `kana-${id}`,
    kanji: null,
    meaning: `meaning-${id}`,
    partOfSpeech: "noun",
    audioUrl: null,
    examples: [],
  };
}

describe("lesson assembly", () => {
  it("computes exercise slots from new item count", () => {
    expect(computeLessonExerciseSlotCount(6)).toBe(20);
    expect(computeLessonExerciseSlotCount(0)).toBe(0);
  });

  it("caps newly introduced vocabulary per JLPT mini chapter", () => {
    const contents = [
      vocab("known-1"),
      vocab("new-1"),
      vocab("new-2"),
      vocab("new-3"),
      vocab("new-4"),
      vocab("new-5"),
      vocab("new-6"),
      vocab("new-7"),
    ];

    const capped = capNewVocabularyInLessonContents(contents, "n5", new Set(["known-1"]));
    const introduced = capped.filter(
      (content) => content.type === "vocabulary" && content.id !== "known-1",
    );

    expect(introduced).toHaveLength(6);
    expect(capped.some((content) => content.id === "new-7")).toBe(false);
  });

  it("plans review-heavy exercise candidates", () => {
    const candidates = planLessonExerciseCandidates(
      [vocab("new-1"), vocab("new-2")],
      [vocab("review-1"), vocab("review-2"), vocab("review-3"), vocab("review-4")],
    );

    expect(candidates.length).toBeGreaterThan(2);
    expect(candidates.filter((item) => item.isReview).length).toBeGreaterThan(
      candidates.filter((item) => !item.isReview).length,
    );
  });

  it("orders checkpoint exercises by bible activity mix", () => {
    const plans = planCheckpointActivities({
      vocabularyIds: ["v1", "v2"],
      grammarIds: ["g1"],
      listeningIds: [],
      readingIds: [],
      applicationIds: [],
    });
    const contentsById = new Map<string, LessonContent>([
      ["v1", vocab("v1")],
      ["v2", vocab("v2")],
      [
        "g1",
        {
          type: "grammar",
          id: "g1",
          title: "g1",
          meaning: "meaning-g1",
          explanation: "e",
          examples: [],
        } satisfies GrammarLessonContent,
      ],
    ]);

    const candidates = buildCheckpointExerciseCandidates(
      plans,
      contentsById,
      ["context_usage", "vocabulary_recognition"],
    );

    expect(candidates.map((item) => item.id)).toEqual(["g1", "v1", "v2"]);
    expect(candidates.every((item) => item.isReview)).toBe(true);
  });
});
