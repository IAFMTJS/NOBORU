import { describe, expect, it } from "vitest";

import { validateAnalyticsEvent } from "@/features/analytics/services/analytics-validation";

describe("validateAnalyticsEvent", () => {
  it("accepts a valid analytics payload", () => {
    const result = validateAnalyticsEvent({
      name: "lesson_completed",
      occurredAt: new Date().toISOString(),
      properties: {
        lessonId: "abc",
        score: 92,
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.event.name).toBe("lesson_completed");
    }
  });

  it("rejects unknown event names", () => {
    const result = validateAnalyticsEvent({
      name: "unknown_event",
      occurredAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
  });
});
