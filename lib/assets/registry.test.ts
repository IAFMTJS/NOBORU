import { describe, expect, it } from "vitest";

import {
  getTrailMapArtPath,
  getTrailScrollArtPath,
  getTrailSpineArtPath,
  hasTrailScrollArt,
} from "@/lib/assets/registry";

describe("trail art registry", () => {
  it("returns dedicated scroll art only for regions with scroll assets", () => {
    expect(hasTrailScrollArt("foothills")).toBe(true);
    expect(hasTrailScrollArt("forest-trail")).toBe(true);
    expect(hasTrailScrollArt(undefined)).toBe(false);

    expect(getTrailScrollArtPath("foothills", "dark")).toBe(
      "/ui/ui_trail_scroll_foothills_dark_v2.webp",
    );
    expect(getTrailScrollArtPath("forest-trail", "dark")).toBe(
      "/ui/ui_trail_scroll_forest-trail_dark_v1.webp",
    );
    expect(getTrailScrollArtPath(undefined, "dark")).toBeNull();
  });

  it("returns spine art for trail map node calibration", () => {
    expect(getTrailSpineArtPath("dark")).toBe("/ui/ui_trail_spine_dark_v1.webp");
    expect(getTrailSpineArtPath("light")).toBe("/ui/ui_trail_spine_light_v1.webp");
  });

  it("keeps legacy getTrailMapArtPath region hero behavior for non-trail callers", () => {
    expect(getTrailMapArtPath("dark", "forest-trail")).toBe(
      "/regions/region_forest_trail_v1.webp",
    );
  });
});
