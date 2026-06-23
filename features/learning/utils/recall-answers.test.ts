import { describe, expect, it } from "vitest";

import {
  buildJapaneseSurfaceAcceptedAnswers,
  isJapaneseTextAnswerCorrect,
  isRecallAnswerCorrect,
  normalizeRomajiAnswer,
  pickJapaneseAnswerCorrection,
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

  it("accepts romaji derived from kana when explicit romaji was omitted", () => {
    expect(
      isJapaneseTextAnswerCorrect("kazoku", ["家族", "かぞく"]),
    ).toBe(true);
    expect(isJapaneseTextAnswerCorrect("mi", ["み"])).toBe(true);
    expect(isJapaneseTextAnswerCorrect("taberu", ["食べる", "たべる"])).toBe(
      true,
    );
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

  it("derives word romaji from kana instead of sentence example romaji", () => {
    const answers = buildJapaneseSurfaceAcceptedAnswers({
      type: "vocabulary",
      id: "v2",
      kana: "かぞく",
      kanji: "家族",
      romaji: "Kazoku wa gonin desu.",
      meaning: "family",
      partOfSpeech: null,
      audioUrl: null,
      examples: [
        {
          japaneseText: "家族は五人です。",
          romaji: "Kazoku wa gonin desu.",
          english: "There are five people in my family.",
        },
      ],
    });

    expect(answers).toContain("kazoku");
    expect(answers).not.toContain("Kazoku wa gonin desu.");
  });

  it("includes romaji readings for kanji recall", () => {
    const answers = buildJapaneseSurfaceAcceptedAnswers({
      type: "kanji",
      id: "k1",
      character: "耳",
      meaning: "ear",
      strokeCount: 9,
      onyomi: ["ジ"],
      kunyomi: ["みみ"],
      examples: [],
    });

    expect(answers).toContain("耳");
    expect(answers).toContain("みみ");
    expect(answers).toContain("mimi");
  });
});

describe("pickJapaneseAnswerCorrection", () => {
  it("shows romaji when the learner typed latin input", () => {
    expect(
      pickJapaneseAnswerCorrection(["家族", "かぞく", "kazoku"], "kazoku"),
    ).toBe("kazoku");
    expect(pickJapaneseAnswerCorrection(["家族", "かぞく"], "kazoku")).toBe(
      "kazoku",
    );
  });

  it("keeps the primary japanese answer for japanese input", () => {
    expect(
      pickJapaneseAnswerCorrection(["家族", "かぞく", "kazoku"], "家族"),
    ).toBe("家族");
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
