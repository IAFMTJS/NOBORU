import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildReviewRecommendations,
} from "@/features/trials/constants/trial.constants";
import { N5_TRIAL_DISPLAY_BY_LEGACY_TITLE } from "@/features/worlds/constants/n5-trial-display.constants";

const bossExamSql = readFileSync(
  join(process.cwd(), "supabase/migrations/20260617230000_n5_boss_examination_bible_steps.sql"),
  "utf8",
);

/** Ensures N5 trial display names and fail-state guidance stay aligned with JWorld spec. */
describe("trial pool audit", () => {
  it("maps legacy CMS trial titles to N5 learner display names", () => {
    expect(N5_TRIAL_DISPLAY_BY_LEGACY_TITLE["Foothills Guardian"]).toBe("Script Keeper");
    expect(N5_TRIAL_DISPLAY_BY_LEGACY_TITLE["Forest Spirit Challenge"]).toBe("Kana Warden");
    expect(N5_TRIAL_DISPLAY_BY_LEGACY_TITLE["Final N5 Trial"]).toBe(
      "Guardian of First Light",
    );
    expect(Object.keys(N5_TRIAL_DISPLAY_BY_LEGACY_TITLE).length).toBeGreaterThanOrEqual(6);
  });

  it("recommends N5 review paths when trial scores are low", () => {
    const recommendations = buildReviewRecommendations(65, "foothills");
    expect(recommendations.some((line) => line.includes("N5"))).toBe(true);
    expect(recommendations.some((line) => line.includes("character charts"))).toBe(true);
  });

  it("N5 Sentinel and Final trial steps resolve CMS content_id from content keys", () => {
    expect(bossExamSql).toContain("slug = 'n5-sentinel'");
    expect(bossExamSql).toContain("when 'story'");
    expect(bossExamSql).toContain("when 'listening'");
    expect(bossExamSql).toContain("when 'grammar'");
    expect(bossExamSql).toContain("when 'vocabulary'");
    expect(bossExamSql).toMatch(/content_key/);
  });
});
