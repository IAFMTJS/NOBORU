import { describe, expect, it } from "vitest";

import {
  LOADING_STATUS_MESSAGES,
  LOADING_STORY_TITLES,
} from "@/features/yama/constants/loading.constants";
import { loadingService } from "@/features/yama/services/loading.service";

describe("loadingService", () => {
  it("maps pathnames to loading scene profiles", () => {
    expect(loadingService.resolveSceneProfile("/home")).toBe("home");
    expect(loadingService.resolveSceneProfile("/tree")).toBe("learn");
    expect(loadingService.resolveSceneProfile("/worlds/n5")).toBe("learn");
    expect(loadingService.resolveSceneProfile("/learn")).toBe("learn");
    expect(loadingService.resolveSceneProfile("/learn/lesson/abc")).toBe("lesson");
    expect(loadingService.resolveSceneProfile("/review")).toBe("review");
    expect(loadingService.resolveSceneProfile("/journey/region-transition")).toBe(
      "region-transition",
    );
  });

  it("resolves story titles and rotating status copy", () => {
    const first = loadingService.resolvePresentation({
      profile: "home",
      tick: 0,
      elapsedMs: 0,
    });
    const rotated = loadingService.resolvePresentation({
      profile: "home",
      tick: 8,
      elapsedMs: 4000,
    });

    expect(first.title).toBe(LOADING_STORY_TITLES.home);
    expect(first.statusMessage).toBe(LOADING_STATUS_MESSAGES[0]);
    expect(rotated.statusMessage).not.toBe(first.statusMessage);
  });

  it("maps synthetic progress to stage labels", () => {
    const starting = loadingService.resolvePresentation({
      profile: "default",
      percent: 0,
    });
    const mid = loadingService.resolvePresentation({
      profile: "default",
      percent: 55,
    });
    const almost = loadingService.resolvePresentation({
      profile: "default",
      percent: 85,
    });

    expect(starting.stageLabel).toBe("Starting");
    expect(starting.showSpinner).toBe(true);
    expect(mid.stageLabel).toBe("Mid");
    expect(almost.stageLabel).toBe("Almost there");
  });

  it("caps synthetic progress below completion", () => {
    expect(loadingService.resolveSyntheticPercent(120_000)).toBeLessThanOrEqual(92);
  });

  it("honors explicit overrides", () => {
    const presentation = loadingService.resolvePresentation({
      profile: "lesson",
      title: "Custom title",
      statusMessage: "Custom status",
      percent: 72,
      mode: "compact",
    });

    expect(presentation.title).toBe("Custom title");
    expect(presentation.statusMessage).toBe("Custom status");
    expect(presentation.percent).toBe(72);
    expect(presentation.mode).toBe("compact");
    expect(presentation.showCampfire).toBe(true);
  });
});
