import { describe, expect, it } from "vitest";

import { resolveRegionAccess } from "@/lib/learning/region-unlock";

describe("resolveRegionAccess", () => {
  it("allows regions without prerequisites", () => {
    const access = resolveRegionAccess("mount-n5", new Set());

    expect(access.availability).toBe("available");
    expect(access.lockReason).toBeNull();
  });

  it("locks mount-n4 until Final N5 Trial is passed", () => {
    const locked = resolveRegionAccess("mount-n4", new Set());
    expect(locked.availability).toBe("locked");
    expect(locked.lockReason).toContain("Final N5 Trial");

    const unlocked = resolveRegionAccess(
      "mount-n4",
      new Set(["n5-final-trial"]),
    );
    expect(unlocked.availability).toBe("available");
    expect(unlocked.lockReason).toBeNull();
  });
});
