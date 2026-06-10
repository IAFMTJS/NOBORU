import { describe, expect, it } from "vitest";

import { getReleaseChannel } from "@/lib/release/launch.constants";
import { getStaticLaunchChecks } from "@/lib/release/launch-readiness";

describe("getStaticLaunchChecks", () => {
  it("includes release channel and core system checks", () => {
    const checks = getStaticLaunchChecks();
    const ids = checks.map((check) => check.id);

    expect(ids).toContain("release_channel");
    expect(ids).toContain("review_engine");
    expect(ids).toContain("analytics");
    expect(checks.length).toBeGreaterThan(8);
  });
});

describe("getReleaseChannel", () => {
  it("returns official when beta mode is not enabled", () => {
    expect(getReleaseChannel()).toBe("official");
  });
});
