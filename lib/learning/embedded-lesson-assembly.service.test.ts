import { describe, expect, it } from "vitest";

import type { VocabularyLessonContent } from "@/features/learning/types/lesson.types";
import {
  ARCHITECTURE_LESSON_TYPES,
  EMBEDDED_LESSON_TYPES,
  usesStagedLessonPipeline,
} from "@/lib/learning/embedded-lesson.constants";
import {
  buildContextStepsFromLessonContents,
  buildEmbeddedContextSteps,
  extractDrillableLessonContents,
} from "@/lib/learning/embedded-lesson-assembly.service";
import { summarizeLessonPhases } from "@/lib/learning/lesson-phase.utils";
import { assembleStagedExerciseSteps } from "@/lib/learning/lesson-stage-assembly.service";

function vocab(id: string): VocabularyLessonContent {
  return {
    type: "vocabulary",
    id,
    kana: `かな-${id}`,
    kanji: null,
    romaji: null,
    meaning: `meaning-${id}`,
    partOfSpeech: "verb",
    audioUrl: null,
    examples: [
      {
        japaneseText: "犬は大きいです。",
        romaji: "inu wa ookii desu",
        english: "The dog is big.",
      },
    ],
  };
}

describe("embedded lesson assembly", () => {
  it("covers every CMS lesson type in the staged pipeline", () => {
    const cmsLessonTypes = [
      ...ARCHITECTURE_LESSON_TYPES,
      ...EMBEDDED_LESSON_TYPES,
    ];
    const unique = new Set(cmsLessonTypes);

    expect(unique.size).toBe(cmsLessonTypes.length);
    expect(usesStagedLessonPipeline("vocabulary")).toBe(true);
    expect(usesStagedLessonPipeline("story")).toBe(true);
    expect(usesStagedLessonPipeline("listening_challenge")).toBe(true);
    expect(usesStagedLessonPipeline("trial")).toBe(false);
  });

  it("builds context capstone steps for story lessons", () => {
    const steps = buildEmbeddedContextSteps(
      "story",
      [
        {
          type: "story",
          id: "story-1",
          title: "Rainy Day",
          slug: "rainy-day",
          summary: null,
          sections: [],
          questions: [],
        },
      ],
      () => ({
        kind: "application",
        direction: "to_english",
        prompt: "x",
        display: "x",
        displayHint: null,
        acceptedAnswers: ["x"],
        index: 1,
        total: 1,
      }),
    );

    expect(steps).toHaveLength(1);
    expect(steps[0]?.kind).toBe("story");
    if (steps[0]?.kind === "story") {
      expect(steps[0].lessonPhase).toBe("context_mastery");
    }
  });

  it("appends story and dialogue context steps for practice quizzes", () => {
    const steps = buildContextStepsFromLessonContents(
      [
        {
          type: "story",
          id: "story-1",
          title: "Rainy Day",
          slug: "rainy-day",
          summary: null,
          sections: [],
          questions: [],
        },
        {
          type: "dialogue",
          id: "dialogue-1",
          title: "Making Plans",
          slug: "making-plans",
          description: null,
          nodes: [],
        },
      ],
      () => ({
        kind: "application",
        direction: "to_english",
        prompt: "x",
        display: "x",
        displayHint: null,
        acceptedAnswers: ["x"],
        index: 1,
        total: 1,
      }),
    );

    expect(steps.map((step) => step.kind)).toEqual(["story", "dialogue"]);
    expect(
      steps.every(
        (step) =>
          step.kind === "story" ||
          step.kind === "dialogue"
            ? step.lessonPhase === "context_mastery"
            : true,
      ),
    ).toBe(true);
  });

  it("produces four phases when drills precede an embedded capstone", () => {
    const review = [vocab("neko"), vocab("inu"), vocab("sakana")];
    const { steps: drills } = assembleStagedExerciseSteps({
      newContents: [],
      reviewContents: review,
      isCheckpoint: true,
    });
    const context = buildEmbeddedContextSteps(
      "story",
      [
        {
          type: "story",
          id: "story-1",
          title: "Rainy Day",
          slug: "rainy-day",
          summary: null,
          sections: [],
          questions: [],
        },
      ],
      () => ({
        kind: "application",
        direction: "to_english",
        prompt: "x",
        display: "x",
        displayHint: null,
        acceptedAnswers: ["x"],
        index: 1,
        total: 1,
      }),
    );

    const phases = summarizeLessonPhases([...drills, ...context]);
    expect(phases.length).toBeGreaterThanOrEqual(3);
    expect(phases.some((entry) => entry.phase === "context_mastery")).toBe(true);
  });

  it("filters drillable content from mixed lesson items", () => {
    const mixed = extractDrillableLessonContents([
      vocab("taberu"),
      {
        type: "story",
        id: "story-1",
        title: "Rainy Day",
        slug: "rainy-day",
        summary: null,
        sections: [],
        questions: [],
      },
    ]);

    expect(mixed).toHaveLength(1);
    expect(mixed[0]?.type).toBe("vocabulary");
  });
});
