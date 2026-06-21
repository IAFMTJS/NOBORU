import { describe, expect, it } from "vitest";

import type {
  GrammarLessonContent,
  VocabularyLessonContent,
} from "@/features/learning/types/lesson.types";
import {
  assembleStagedExerciseSteps,
  computeStagePlans,
  enforceExerciseVariety,
} from "@/lib/learning/lesson-stage-assembly.service";
import {
  LESSON_MAX_SCORED_EXERCISES,
  LESSON_MIN_SCORED_EXERCISES,
} from "@/lib/learning/lesson-stage.constants";
import type { ScoredLessonStep } from "@/features/learning/types/lesson.types";

function vocab(id: string, withAudio = false): VocabularyLessonContent {
  return {
    type: "vocabulary",
    id,
    kana: `かな-${id}`,
    kanji: `食-${id}`,
    meaning: `meaning-${id}`,
    partOfSpeech: "verb",
    audioUrl: withAudio ? `https://example.com/${id}.mp3` : null,
    examples: [
      {
        japaneseText: "私はご飯を食べる。",
        romaji: "watashi wa gohan o taberu",
        english: "I eat rice.",
      },
    ],
  };
}

function grammar(id: string): GrammarLessonContent {
  return {
    type: "grammar",
    id,
    title: `grammar-${id}`,
    meaning: `pattern-${id}`,
    explanation: "test",
    examples: [
      {
        japaneseText: "私はご飯を食べる。",
        romaji: null,
        english: "I eat rice.",
      },
    ],
  };
}

describe("lesson stage assembly", () => {
  it("plans 8–15 scored exercises for a single-concept lesson", () => {
    const plans = computeStagePlans(1, false);
    const total = plans.reduce((sum, plan) => sum + plan.count, 0);
    expect(total).toBeGreaterThanOrEqual(LESSON_MIN_SCORED_EXERCISES);
    expect(total).toBeLessThanOrEqual(LESSON_MAX_SCORED_EXERCISES);
  });

  it("assembles spiral exposures across all four learning phases", () => {
    const { steps, stageSummary, phaseSummary } = assembleStagedExerciseSteps({
      newContents: [vocab("taberu", true)],
      reviewContents: [vocab("neko"), vocab("inu")],
      isCheckpoint: false,
    });

    expect(steps.length).toBeGreaterThanOrEqual(LESSON_MIN_SCORED_EXERCISES);
    expect(steps.length).toBeLessThanOrEqual(LESSON_MAX_SCORED_EXERCISES);
    expect(steps.some((step) => step.lessonPhase === "introduction")).toBe(true);
    expect(steps.some((step) => step.lessonPhase === "recognition")).toBe(true);
    expect(steps.some((step) => step.lessonPhase === "active_recall")).toBe(true);
    expect(steps.some((step) => step.lessonPhase === "context_mastery")).toBe(true);
    expect(steps.some((step) => step.stage === "mastery_challenge")).toBe(true);
    expect(steps.some((step) => step.kind === "listening_recall")).toBe(true);
    expect(
      steps.every(
        (step) =>
          ("contentId" in step && step.contentId) ||
          ("contentIds" in step && step.contentIds?.length),
      ),
    ).toBe(true);
    expect(stageSummary.length).toBeGreaterThan(0);
    expect(phaseSummary.length).toBe(4);
  });

  it("builds checkpoint lessons from review pool only", () => {
    const { steps } = assembleStagedExerciseSteps({
      newContents: [],
      reviewContents: [vocab("v1"), vocab("v2"), grammar("g1"), vocab("v3")],
      isCheckpoint: true,
    });

    expect(steps.length).toBeGreaterThanOrEqual(LESSON_MIN_SCORED_EXERCISES);
    expect(steps.every((step) => step.stage !== "introduction")).toBe(true);
    expect(steps.some((step) => step.stage === "mastery_challenge")).toBe(true);
  });

  it("avoids more than two consecutive identical exercise kinds", () => {
    const repetitive: ScoredLessonStep[] = [
      {
        kind: "recall",
        mode: "choice",
        contentType: "vocabulary",
        prompt: "a",
        display: "a",
        options: ["a"],
        correctIndex: 0,
        index: 1,
        total: 6,
      },
      {
        kind: "recall",
        mode: "choice",
        contentType: "vocabulary",
        prompt: "b",
        display: "b",
        options: ["b"],
        correctIndex: 0,
        index: 2,
        total: 6,
      },
      {
        kind: "recall",
        mode: "choice",
        contentType: "vocabulary",
        prompt: "c",
        display: "c",
        options: ["c"],
        correctIndex: 0,
        index: 3,
        total: 6,
      },
      {
        kind: "fill_blank",
        prompt: "d",
        sentenceWithBlank: "___",
        englishHint: "d",
        options: ["d"],
        correctIndex: 0,
        index: 4,
        total: 6,
      },
    ];

    const varied = enforceExerciseVariety(repetitive);
    expect(varied[2]?.kind).not.toBe("recall");
  });
});
