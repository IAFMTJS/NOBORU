import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("world tree screen", () => {
  it("composes JLPT overview canvas, backdrop, rail, legend, and continue fab", () => {
    const screen = readSource("features/journey/components/world-tree-screen.tsx");
    const canvas = readSource("features/journey/components/journey-world-canvas.tsx");

    expect(screen).toContain("WorldTreeJlptScrollRail");
    expect(screen).toContain("WorldTreeJlptLegend");
    expect(screen).toContain('variant="overview"');
    expect(screen).toContain("WorldTreeMapFab");
    expect(canvas).toContain("WorldTreeRealmBackdrop");
    expect(canvas).toContain("WorldTreeJlptArtStack");
    expect(canvas).toContain("useJlptBands={isOverview}");
    expect(canvas).toContain("continuousTrail={isOverview}");
    expect(canvas).toContain("useArtNodes={isOverview}");
  });
});

describe("journey world canvas art isolation", () => {
  it("uses JLPT band art layer instead of sheet remasters", () => {
    const source = readSource("features/journey/components/journey-world-canvas.tsx");

    expect(source).not.toContain("JourneyWorldTreeArtLayer");
    expect(source).not.toContain("buildWorldTreeFullAscentLayout");
    expect(source).not.toContain("buildWorldTreeZonePieceLayout");
    expect(source).toContain("JourneySkeletonArtLayer");
    expect(source).toContain('data-journey-skeleton-mode="true"');
  });
});
