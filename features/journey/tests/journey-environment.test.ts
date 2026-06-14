import { describe, expect, it } from "vitest";

import {
  resolveJourneyEnvironmentZone,
} from "@/features/journey/constants/journey-environment.constants";
import {
  resolveJourneyVisualSettings,
} from "@/features/journey/constants/journey-visual.constants";

describe("resolveJourneyEnvironmentZone", () => {
  it("maps low path positions to the base zone", () => {
    expect(resolveJourneyEnvironmentZone(0.1)).toBe("base");
  });

  it("maps high path positions to the summit zone", () => {
    expect(resolveJourneyEnvironmentZone(0.92)).toBe("summit");
  });

  it("maps mid ascent to the mid mountain zone", () => {
    expect(resolveJourneyEnvironmentZone(0.45)).toBe("mid");
  });
});

describe("resolveJourneyVisualSettings", () => {
  it("disables parallax and environment on low tier devices", () => {
    const settings = resolveJourneyVisualSettings("low");
    expect(settings.parallaxMultiplier).toBe(0);
    expect(settings.environmentLayers).toBe(false);
    expect(settings.maxLoadedArtSections).toBe(2);
  });

  it("enables full polish on high tier devices", () => {
    const settings = resolveJourneyVisualSettings("high");
    expect(settings.checkpointCelebration).toBe(true);
    expect(settings.weatherEffects).toBe(true);
    expect(settings.maxLoadedArtSections).toBe(0);
  });
});
