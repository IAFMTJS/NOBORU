import { describe, expect, it } from "vitest";

import {
  assertGoldenContentRule,
  validateGoldenContentRule,
} from "@/lib/learning/golden-content.validator";

describe("validateGoldenContentRule", () => {
  const known = new Set(["v1", "v2", "v3"]);

  it("passes when all required content is known", () => {
    const result = validateGoldenContentRule(["v1", "v2"], known);
    expect(result.valid).toBe(true);
    expect(result.unknownContentIds).toEqual([]);
  });

  it("fails when unknown vocabulary is required", () => {
    const result = validateGoldenContentRule(["v1", "v9", "v10", "v9"], known);
    expect(result.valid).toBe(false);
    expect(result.unknownContentIds).toEqual(["v9", "v10"]);
  });

  it("throws on assert when rule is violated", () => {
    expect(() =>
      assertGoldenContentRule(["v1", "missing"], known, "story-1"),
    ).toThrow(/Golden content rule violated in story-1/);
  });
});
