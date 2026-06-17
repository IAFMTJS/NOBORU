import { describe, expect, it } from "vitest";

import {
  computeSessionMixCounts,
  mixSessionItems,
} from "@/lib/learning/session-mixer.service";

describe("session mixer", () => {
  it("computes approximately 70/30 review vs new counts", () => {
    expect(computeSessionMixCounts(20)).toEqual({
      total: 20,
      review: 14,
      new: 6,
    });
    expect(computeSessionMixCounts(10)).toEqual({
      total: 10,
      review: 7,
      new: 3,
    });
  });

  it("mixes items with review-heavy interleaving", () => {
    const review = [
      { id: "r1", isReview: true },
      { id: "r2", isReview: true },
      { id: "r3", isReview: true },
    ];
    const fresh = [
      { id: "n1", isReview: false },
      { id: "n2", isReview: false },
    ];

    const mixed = mixSessionItems(review, fresh, 5);
    expect(mixed).toHaveLength(5);
    expect(mixed.filter((item) => item.isReview)).toHaveLength(3);
    expect(mixed.filter((item) => !item.isReview)).toHaveLength(2);
  });
});
