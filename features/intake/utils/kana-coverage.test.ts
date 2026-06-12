import { describe, expect, it } from "vitest";

import {
  countUnknownKana,
  extractKanaCharacters,
  isWithinKnownKanaCoverage,
  listNewKanaInText,
} from "@/features/intake/utils/kana-coverage";

describe("kana-coverage", () => {
  const known = new Set(["あ", "い", "さ"]);

  it("extracts unique kana from text", () => {
    expect(extractKanaCharacters("あいさ")).toEqual(["あ", "い", "さ"]);
  });

  it("counts unknown kana", () => {
    expect(countUnknownKana("あさけ", known)).toBe(1);
    expect(countUnknownKana("あさけん", known)).toBe(2);
  });

  it("allows grow coverage with limited new kana", () => {
    expect(isWithinKnownKanaCoverage("あさけ", known, 1)).toBe(true);
    expect(isWithinKnownKanaCoverage("あさけん", known, 1)).toBe(false);
  });

  it("lists new kana characters", () => {
    expect(listNewKanaInText("あさけ", known)).toEqual(["け"]);
  });
});
