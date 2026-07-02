import { describe, expect, it } from "vitest";

import { applySrsRating, mapRatingForServerRpc } from "@/features/review/services/srs.service";

describe("applySrsRating", () => {
  const base = {
    state: "good" as const,
    masteryScore: 50,
    streakCount: 2,
    now: new Date("2026-06-14T12:00:00Z"),
  };

  it("schedules again in minutes with mastery penalty", () => {
    const result = applySrsRating({ ...base, rating: "again" });
    expect(result.intervalDays).toBe(0);
    expect(result.masteryScore).toBe(35);
    expect(result.streakCount).toBe(0);
  });

  it("schedules hard with shorter interval than good", () => {
    const hard = applySrsRating({ ...base, rating: "hard" });
    const good = applySrsRating({ ...base, rating: "good" });
    expect(hard.intervalDays).toBeLessThanOrEqual(good.intervalDays);
    expect(hard.masteryScore).toBe(54);
    expect(good.masteryScore).toBe(58);
  });

  it("schedules easy with longer interval than good", () => {
    const good = applySrsRating({ ...base, rating: "good" });
    const easy = applySrsRating({ ...base, rating: "easy" });
    expect(easy.intervalDays).toBeGreaterThanOrEqual(good.intervalDays);
    expect(easy.masteryScore).toBe(62);
  });

  it("treats legacy strong as easy", () => {
    const easy = applySrsRating({ ...base, rating: "easy" });
    const strong = applySrsRating({ ...base, rating: "strong" });
    expect(strong.intervalDays).toBe(easy.intervalDays);
    expect(strong.masteryScore).toBe(easy.masteryScore);
  });

  it("maps learner ratings to server RPC values", () => {
    expect(mapRatingForServerRpc("again")).toBe("again");
    expect(mapRatingForServerRpc("hard")).toBe("good");
    expect(mapRatingForServerRpc("good")).toBe("good");
    expect(mapRatingForServerRpc("easy")).toBe("strong");
    expect(mapRatingForServerRpc("strong")).toBe("strong");
  });
});
