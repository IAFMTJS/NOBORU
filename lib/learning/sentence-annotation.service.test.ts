import { describe, expect, it } from "vitest";

import type { ComprehensionSupportContext } from "@/lib/learning/comprehension-support.types";
import {
  annotateJapaneseSentence,
  sentenceHasUnknownTokens,
} from "@/lib/learning/sentence-annotation.service";

const support: ComprehensionSupportContext = {
  knownVocabularyIds: ["v-thanks"],
  knownKanjiIds: ["k-person"],
  activeVocabularyPool: ["v-thanks"],
  masteredVocabularyIds: ["v-thanks"],
  vocabularyById: {
    "v-thanks": {
      id: "v-thanks",
      kana: "ありがとう",
      kanji: null,
      meaning: "thank you",
      surfaceForms: ["ありがとう"],
    },
    "v-goodbye": {
      id: "v-goodbye",
      kana: "さようなら",
      kanji: null,
      meaning: "goodbye",
      surfaceForms: ["さようなら"],
    },
    "v-student": {
      id: "v-student",
      kana: "がくせい",
      kanji: "学生",
      meaning: "student",
      surfaceForms: ["がくせい", "学生"],
    },
  },
  kanjiByCharacter: {
    学: {
      id: "k-learn",
      character: "学",
      meaning: "study",
      onyomi: ["ガク"],
      kunyomi: ["まな"],
    },
    生: {
      id: "k-life",
      character: "生",
      meaning: "life",
      onyomi: ["セイ"],
      kunyomi: ["い"],
    },
    人: {
      id: "k-person",
      character: "人",
      meaning: "person",
      onyomi: ["ジン"],
      kunyomi: ["ひと"],
    },
  },
};

describe("annotateJapaneseSentence", () => {
  it("marks unknown vocabulary tokens for glossing", () => {
    const segments = annotateJapaneseSentence("ありがとう。さようなら。", support);

    const goodbye = segments.find(
      (segment) => segment.kind === "token" && segment.annotation.surface === "さようなら",
    );
    expect(goodbye?.kind).toBe("token");
    if (goodbye?.kind !== "token") return;

    expect(goodbye.annotation.isKnown).toBe(false);
    expect(goodbye.annotation.shouldGloss).toBe(true);
    expect(goodbye.annotation.meaning).toBe("goodbye");
  });

  it("flags unknown kanji inside a token", () => {
    const segments = annotateJapaneseSentence("学生です。", support);
    const student = segments.find(
      (segment) =>
        segment.kind === "token" && segment.annotation.surface.includes("学生"),
    );

    expect(student?.kind).toBe("token");
    if (student?.kind !== "token") return;

    expect(student.annotation.shouldGloss).toBe(true);
    expect(student.annotation.showFurigana).toBe(true);
    expect(student.annotation.reading).toBe("がくせい");
    expect(student.annotation.unknownKanji).toHaveLength(2);
  });

  it("preserves punctuation as plain segments", () => {
    const segments = annotateJapaneseSentence("ありがとう！", support);
    expect(segments[0]?.kind).toBe("token");
    expect(segments[1]).toEqual({ kind: "plain", text: "！" });
  });

  it("detects unknown tokens in a sentence", () => {
    expect(sentenceHasUnknownTokens("ありがとう。", support)).toBe(false);
    expect(sentenceHasUnknownTokens("さようなら。", support)).toBe(true);
  });
});
