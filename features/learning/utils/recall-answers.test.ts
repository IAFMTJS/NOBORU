import { describe, expect, it } from "vitest";

import {
  buildJapaneseSurfaceAcceptedAnswers,
  isJapaneseTextAnswerCorrect,
  isRecallAnswerCorrect,
  normalizeRomajiAnswer,
} from "@/features/learning/utils/recall-answers";

describe("isJapaneseTextAnswerCorrect", () => {
  it("accepts kana when kanji is the primary answer", () => {
    expect(
      isJapaneseTextAnswerCorrect("たべる", ["食べる", "たべる", "taberu"]),
    ).toBe(true);
  });

  it("accepts romaji when listed as an alternate answer", () => {
    expect(
      isJapaneseTextAnswerCorrect("taberu", ["食べる", "たべる", "taberu"]),
    ).toBe(true);
  });

  it("normalizes romaji spacing and macrons", () => {
    expect(
      isJapaneseTextAnswerCorrect("konnichiwa", ["こんにちは", "konnichiwa"]),
    ).toBe(true);
    expect(
      isJapaneseTextAnswerCorrect("ōkii", ["大きい", "ookii", "ōkii"]),
    ).toBe(true);
  });

  it("accepts hiragana character when romaji is expected", () => {
    expect(isJapaneseTextAnswerCorrect("あ", ["あ", "a"])).toBe(true);
  });
});

describe("buildJapaneseSurfaceAcceptedAnswers", () => {
  it("includes romaji for vocabulary recall", () => {
    const answers = buildJapaneseSurfaceAcceptedAnswers({
      type: "vocabulary",
      id: "v1",
      kana: "たべる",
      kanji: "食べる",
      romaji: "taberu",
      meaning: "to eat",
      partOfSpeech: null,
      audioUrl: null,
      examples: [],
    });

    expect(answers).toContain("食べる");
    expect(answers).toContain("たべる");
    expect(answers).toContain("taberu");
  });
});

describe("isRecallAnswerCorrect", () => {
  it("still handles English meaning recall", () => {
    expect(isRecallAnswerCorrect("to eat", ["to eat", "eat"])).toBe(true);
  });
});

describe("normalizeRomajiAnswer", () => {
  it("strips hyphens and spaces", () => {
    expect(normalizeRomajiAnswer("ko n-ni chi wa")).toBe("konnichiwa");
  });
});
