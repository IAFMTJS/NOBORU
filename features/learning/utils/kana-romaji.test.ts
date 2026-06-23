import { describe, expect, it } from "vitest";

import { deriveKanaRomaji } from "@/features/learning/utils/kana-romaji";

describe("deriveKanaRomaji", () => {
  it("converts hiragana vocabulary to word-level romaji", () => {
    expect(deriveKanaRomaji("かぞく")).toBe("kazoku");
    expect(deriveKanaRomaji("たべる")).toBe("taberu");
  });

  it("converts katakana loanwords", () => {
    expect(deriveKanaRomaji("バス")).toBe("basu");
  });
});
