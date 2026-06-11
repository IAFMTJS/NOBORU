import { describe, expect, it } from "vitest";

import { GAME_SLUGS } from "@/features/games/constants/game.constants";
import { calculateKanjiHunterEp } from "@/features/games/constants/game.constants";

describe("game.service helpers", () => {
  it("calculates kanji hunter EP tiers from accuracy", () => {
    expect(calculateKanjiHunterEp(95)).toBe(25);
    expect(calculateKanjiHunterEp(75)).toBe(18);
    expect(calculateKanjiHunterEp(40)).toBe(10);
  });

  it("exposes kanji hunter slug", () => {
    expect(GAME_SLUGS.kanjiHunter).toBe("kanji-hunter");
  });
});
