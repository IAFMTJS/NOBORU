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
    expect(ids).toContain("pwa_assets");
    expect(checks.length).toBeGreaterThan(8);
  });

  it("marks pwa_assets as pass when required files exist", () => {
    const checks = getStaticLaunchChecks();
    const pwaCheck = checks.find((check) => check.id === "pwa_assets");
    expect(pwaCheck?.status).toBe("pass");
  });
});

describe("getReleaseChannel", () => {
  it("returns official when beta mode is not enabled", () => {
    expect(getReleaseChannel()).toBe("official");
  });
});
