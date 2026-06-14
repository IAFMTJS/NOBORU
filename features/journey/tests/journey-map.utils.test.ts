import { describe, expect, it } from "vitest";

import {
  resolveNodeDiscoveryOpacity,
} from "@/features/journey/utils/journey-map.utils";

describe("resolveNodeDiscoveryOpacity", () => {
  it("returns full opacity for nodes near the viewport center", () => {
    expect(
      resolveNodeDiscoveryOpacity(50, 50, "available", "lesson"),
    ).toBe(1);
  });

  it("dims distant locked nodes", () => {
    const opacity = resolveNodeDiscoveryOpacity(
      12,
      72,
      "locked",
      "lesson",
    );
    expect(opacity).toBeLessThanOrEqual(0.42);
  });

  it("keeps distant trials partially visible ahead on the trail", () => {
    const opacity = resolveNodeDiscoveryOpacity(
      8,
      55,
      "locked",
      "trial",
    );
    expect(opacity).toBeGreaterThan(0.2);
    expect(opacity).toBeLessThanOrEqual(0.4);
  });

  it("keeps the current node area readable when centered", () => {
    expect(
      resolveNodeDiscoveryOpacity(48, 50, "in_progress", "lesson"),
    ).toBeGreaterThanOrEqual(0.92);
  });
});
