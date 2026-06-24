import { describe, expect, it } from "vitest";

import type { VocabularyLessonContent } from "@/features/learning/types/lesson.types";
import {
  buildFillBlankStep,
  buildLessonDrillPoolContext,
  formatFillBlankAnswer,
} from "@/features/learning/utils/exercise-steps";

function vocab(
  id: string,
  overrides: Partial<VocabularyLessonContent> = {},
): VocabularyLessonContent {
  return {
    type: "vocabulary",
    id,
    kana: "たべる",
    kanji: "食べる",
    romaji: "taberu",
    meaning: "to eat",
    partOfSpeech: "verb",
    audioUrl: null,
    examples: [
      {
        japaneseText: "私は寿司を食べる。",
        romaji: "watashi wa sushi wo taberu.",
        english: "I eat sushi.",
      },
    ],
    ...overrides,
  };
}

describe("buildFillBlankStep", () => {
  it("builds Japanese answer options with romaji instead of English meanings", () => {
    const primary = vocab("eat");
    const drink = vocab("drink", {
      kana: "のむ",
      kanji: "飲む",
      romaji: "nomu",
      meaning: "to drink",
      examples: [
        {
          japaneseText: "水を飲む。",
          romaji: "mizu wo nomu.",
          english: "I drink water.",
        },
      ],
    });

    const pool = buildLessonDrillPoolContext([primary, drink]);
    const step = buildFillBlankStep(primary, pool, 1, 1);

    expect(step).not.toBeNull();
    expect(step?.options.every((option) => /[\u3040-\u30FF\u4E00-\u9FFF]/.test(option.japanese))).toBe(
      true,
    );
    expect(step?.options.some((option) => option.japanese === primary.meaning)).toBe(false);

    const correct = step?.options[step.correctIndex];
    expect(correct?.japanese).toBe("食べる");
    expect(correct?.romaji).toBe("taberu");
    expect(correct?.reading).toBe("たべる");
  });

  it("alternates block taps and multiple choice interactions", () => {
    const primary = vocab("eat");
    const pool = buildLessonDrillPoolContext([primary]);

    const blocksStep = buildFillBlankStep(primary, pool, 2, 2);
    const choiceStep = buildFillBlankStep(primary, pool, 3, 2);

    expect(blocksStep?.interaction).toBe("blocks");
    expect(choiceStep?.interaction).toBe("choice");
  });

  it("formats answers with romaji for mistake feedback", () => {
    expect(
      formatFillBlankAnswer({
        japanese: "食べる",
        romaji: "taberu",
        reading: "たべる",
      }),
    ).toBe("食べる (taberu)");
  });

  it("includes sentence romaji and romaji on every answer option", () => {
    const student = vocab("student", {
      kana: "がくせい",
      kanji: "学生",
      romaji: "gakusei",
      meaning: "student",
      examples: [
        {
          japaneseText: "私は学生です。",
          romaji: "Watashi wa gakusei desu.",
          english: "I am a student.",
        },
      ],
    });
    const pool = buildLessonDrillPoolContext([student]);
    const step = buildFillBlankStep(student, pool, 2, 2);

    expect(step?.sentenceRomaji).toBe("Watashi wa gakusei desu.");
    expect(step?.options.every((option) => Boolean(option.romaji))).toBe(true);
  });

  it("adds reading and romaji when the blank is a verb stem kanji", () => {
    const come = vocab("come", {
      kana: "くる",
      kanji: "来る",
      romaji: "kuru",
      meaning: "to come",
      examples: [
        {
          japaneseText: "友達が来ます。",
          romaji: "Tomodachi ga kimasu.",
          english: "A friend is coming.",
        },
      ],
    });
    const pool = buildLessonDrillPoolContext([come]);
    const step = buildFillBlankStep(come, pool, 2, 2);
    const correct = step?.options[step.correctIndex];

    expect(correct?.japanese).toBe("来");
    expect(correct?.reading).toBe("くる");
    expect(correct?.romaji).toBe("kuru");
  });
});
