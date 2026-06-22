import { describe, expect, it } from "vitest";

import {
  resolveN5ActFromPathPosition,
  resolveN5ActLabelFromPathPosition,
} from "@/features/worlds/utils/n5-act.utils";

describe("n5-act.utils", () => {
  it("maps path positions to act indices", () => {
    expect(resolveN5ActFromPathPosition(0.1)).toBe(1);
    expect(resolveN5ActFromPathPosition(0.4)).toBe(2);
    expect(resolveN5ActFromPathPosition(0.8)).toBe(3);
  });

  it("returns HUD act labels", () => {
    expect(resolveN5ActLabelFromPathPosition(0.1)).toBe("Act I · Awakening");
    expect(resolveN5ActLabelFromPathPosition(0.5)).toBe("Act II · First steps");
    expect(resolveN5ActLabelFromPathPosition(0.9)).toBe("Act III · The climb begins");
  });
});
