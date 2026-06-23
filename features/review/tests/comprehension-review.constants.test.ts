import { describe, expect, it } from "vitest";

import {
  COMPREHENSION_VOCAB_BY_LISTENING_SLUG,
  COMPREHENSION_VOCAB_BY_STORY_SLUG,
} from "@/features/review/constants/comprehension-review.constants";

describe("comprehension review constants", () => {
  it("maps every N5 story slug to at least one vocab kana key", () => {
    const storySlugs = [
      "tanaka-morning",
      "first-day-school",
      "weekend-plans",
      "rainy-day",
      "at-the-market",
      "train-commute",
      "birthday-surprise",
      "weekend-trip",
      "summer-festival",
      "first-part-time-job",
    ];

    for (const slug of storySlugs) {
      expect(COMPREHENSION_VOCAB_BY_STORY_SLUG[slug]?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("maps core listening slugs for comprehension SRS", () => {
    expect(COMPREHENSION_VOCAB_BY_LISTENING_SLUG["greeting-friend"]?.length).toBeGreaterThan(0);
    expect(Object.keys(COMPREHENSION_VOCAB_BY_LISTENING_SLUG).length).toBeGreaterThanOrEqual(20);
  });
});
