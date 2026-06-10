import { describe, expect, it } from "vitest";

import { validateSubmitFeedbackInput } from "@/features/feedback/services/feedback-validation";

describe("validateSubmitFeedbackInput", () => {
  it("accepts valid feedback", () => {
    const result = validateSubmitFeedbackInput({
      category: "lesson_ux",
      message: "The matching drill felt unclear on step three.",
      rating: 4,
      route: "/learn/lesson/abc",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.category).toBe("lesson_ux");
      expect(result.value.rating).toBe(4);
    }
  });

  it("rejects short messages", () => {
    const result = validateSubmitFeedbackInput({
      category: "bug",
      message: "bad",
    });

    expect(result.ok).toBe(false);
  });

  it("rejects invalid categories", () => {
    const result = validateSubmitFeedbackInput({
      category: "invalid",
      message: "Something went wrong on the trail map.",
    });

    expect(result.ok).toBe(false);
  });

  it("rejects invalid ratings", () => {
    const result = validateSubmitFeedbackInput({
      category: "audio",
      message: "Lesson audio did not play offline.",
      rating: 6,
    });

    expect(result.ok).toBe(false);
  });
});
