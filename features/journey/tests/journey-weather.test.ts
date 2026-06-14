import { describe, expect, it } from "vitest";

import { resolveJourneyEnvironmentZone } from "@/features/journey/constants/journey-environment.constants";
import {
  resolveJourneyWeatherProfile,
  JOURNEY_WEATHER_BY_ZONE,
} from "@/features/journey/constants/journey-weather.constants";
import { resolveJourneyVisualSettings } from "@/features/journey/constants/journey-visual.constants";

describe("resolveJourneyWeatherProfile", () => {
  it("maps each environment zone to a weather profile", () => {
    for (const zone of Object.keys(JOURNEY_WEATHER_BY_ZONE) as Array<
      keyof typeof JOURNEY_WEATHER_BY_ZONE
    >) {
      const profile = resolveJourneyWeatherProfile(zone);
      expect(profile.particleCount).toBeGreaterThan(0);
      expect(profile.kind).toBeTruthy();
    }
  });

  it("uses snow at summit and embers at base", () => {
    expect(resolveJourneyWeatherProfile("summit").kind).toBe("snow");
    expect(resolveJourneyWeatherProfile("base").kind).toBe("embers");
  });

  it("derives weather zone from path position", () => {
    const zone = resolveJourneyEnvironmentZone(0.9);
    expect(resolveJourneyWeatherProfile(zone).kind).toBe("snow");
  });
});

describe("resolveJourneyVisualSettings phase 5", () => {
  it("enables fox interactions, weather, and sound on high tier", () => {
    const settings = resolveJourneyVisualSettings("high");
    expect(settings.weatherEffects).toBe(true);
    expect(settings.environmentLayers).toBe(true);
    expect(settings.foxInteractions).toBe(true);
    expect(settings.ambientSound).toBe(true);
  });

  it("disables immersive polish on low tier", () => {
    const settings = resolveJourneyVisualSettings("low");
    expect(settings.weatherEffects).toBe(false);
    expect(settings.ambientParticles).toBe(false);
    expect(settings.foxInteractions).toBe(false);
    expect(settings.ambientSound).toBe(false);
  });

  it("loads all visible trail art on medium tier", () => {
    const settings = resolveJourneyVisualSettings("medium");
    expect(settings.maxLoadedArtSections).toBe(0);
    expect(settings.foxInteractions).toBe(true);
  });
});
