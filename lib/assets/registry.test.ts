import { describe, expect, it } from "vitest";

import {
  getRegionArtPath,
  getTrailMapArtPath,
  getTrailScrollArtPath,
  hasTrailScrollArt,
} from "@/lib/assets/registry";

describe("trail art registry", () => {
  it("returns dedicated scroll art only for regions with scroll assets", () => {
    expect(hasTrailScrollArt("foothills")).toBe(true);
    expect(hasTrailScrollArt("forest-trail")).toBe(true);
    expect(hasTrailScrollArt(undefined)).toBe(false);

    expect(getTrailScrollArtPath("foothills", "dark")).toBe(
      "/ui/ui_trail_scroll_foothills_dark_v1.webp",
    );
    expect(getTrailScrollArtPath("forest-trail", "dark")).toBe(
      "/ui/ui_trail_scroll_forest-trail_dark_v1.webp",
    );
    expect(getTrailScrollArtPath(undefined, "dark")).toBeNull();
  });

  it("uses region hero art for trail maps when a slug is provided", () => {
    expect(getTrailMapArtPath("dark", "forest-trail")).toBe(
      getRegionArtPath("forest-trail"),
    );
    expect(getTrailMapArtPath("dark")).toBe("/ui/ui_trail_spine_dark_v1.webp");
  });
});
