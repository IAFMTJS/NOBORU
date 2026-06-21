import { describe, expect, it } from "vitest";

import { parseLessonIdFromHref } from "@/lib/learning/lesson-preload";

describe("lesson-preload", () => {
  it("parses lesson ids from lesson hrefs", () => {
    expect(parseLessonIdFromHref("/learn/lesson/abc-123")).toBe("abc-123");
    expect(parseLessonIdFromHref("/learn/lesson/abc-123?review=1")).toBe("abc-123");
    expect(parseLessonIdFromHref("/tree")).toBeNull();
  });
});
