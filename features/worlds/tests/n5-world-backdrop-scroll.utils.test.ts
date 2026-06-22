import { describe, expect, it } from "vitest";

import {
  computeN5BackdropScrollState,
  smoothstep,
} from "@/features/worlds/utils/n5-world-backdrop-scroll.utils";

describe("n5-world-backdrop-scroll.utils", () => {
  it("smoothsteps between edges", () => {
    expect(smoothstep(0, 10, -1)).toBe(0);
    expect(smoothstep(0, 10, 11)).toBe(1);
    expect(smoothstep(0, 10, 5)).toBeCloseTo(0.5, 1);
  });

  it("favors act I near journey start", () => {
    const state = computeN5BackdropScrollState(9000, 10000, 800);
    expect(state.acts[1].opacity).toBeGreaterThan(0.6);
    expect(state.acts[3].opacity).toBeLessThan(0.2);
  });

  it("favors act III near the summit", () => {
    const state = computeN5BackdropScrollState(0, 10000, 800);
    expect(state.acts[3].opacity).toBeGreaterThan(0.6);
    expect(state.acts[1].opacity).toBeLessThan(0.2);
  });

  it("crossfades acts in the overlap window", () => {
    const state = computeN5BackdropScrollState(6300, 10000, 800);
    const total =
      state.acts[1].opacity + state.acts[2].opacity + state.acts[3].opacity;
    expect(state.acts[1].opacity).toBeGreaterThan(0.15);
    expect(state.acts[2].opacity).toBeGreaterThan(0.15);
    expect(total).toBeGreaterThan(0.85);
    expect(total).toBeLessThan(1.35);
  });

  it("pans vertically through an act slice while scrolling", () => {
    const lower = computeN5BackdropScrollState(9000, 10000, 800).acts[1];
    const higher = computeN5BackdropScrollState(7000, 10000, 800).acts[1];
    expect(lower.objectYPercent).toBeGreaterThan(higher.objectYPercent);
    expect(lower.localProgress).toBeLessThan(higher.localProgress);
  });
});
