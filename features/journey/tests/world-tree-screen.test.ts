import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("world tree screen", () => {
  it("composes overview canvas, realm backdrop, rail, legend, and continue fab", () => {
    const screen = readSource("features/journey/components/world-tree-screen.tsx");
    const canvas = readSource("features/journey/components/journey-world-canvas.tsx");

    expect(screen).toContain("WorldTreeScrollRail");
    expect(screen).toContain("WorldTreeRegionLegend");
    expect(screen).toContain('variant="overview"');
    expect(screen).toContain("WorldTreeMapFab");
    expect(canvas).toContain("WorldTreeRealmBackdrop");
    expect(canvas).toContain("data-world-tree-variant={variant}");
  });
});

describe("journey world canvas art isolation", () => {
  it("does not import sheet-remaster art layer", () => {
    const source = readSource("features/journey/components/journey-world-canvas.tsx");

    expect(source).not.toContain("JourneyWorldTreeArtLayer");
    expect(source).not.toContain("buildWorldTreeFullAscentLayout");
    expect(source).not.toContain("buildWorldTreeZonePieceLayout");
    expect(source).toContain("JourneySkeletonArtLayer");
    expect(source).toContain('data-journey-skeleton-mode="true"');
  });
});
