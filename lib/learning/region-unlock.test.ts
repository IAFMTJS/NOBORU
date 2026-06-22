import { describe, expect, it } from "vitest";

import { resolveRegionAccess } from "@/lib/learning/region-unlock";

describe("resolveRegionAccess", () => {
  it("allows n5 without prerequisites", () => {
    const access = resolveRegionAccess("n5", new Set());

    expect(access.availability).toBe("available");
    expect(access.lockReason).toBeNull();
  });

  it("locks n4 until Final N5 Trial is passed", () => {
    const locked = resolveRegionAccess("n4", new Set());
    expect(locked.availability).toBe("locked");
    expect(locked.lockReason).toContain("Final N5 Trial");

    const unlocked = resolveRegionAccess("n4", new Set(["n5-final-trial"]));
    expect(unlocked.availability).toBe("available");
    expect(unlocked.lockReason).toBeNull();
  });

  it("normalizes legacy mount-n4 slug", () => {
    const locked = resolveRegionAccess("mount-n4", new Set());
    expect(locked.availability).toBe("locked");
  });
});
