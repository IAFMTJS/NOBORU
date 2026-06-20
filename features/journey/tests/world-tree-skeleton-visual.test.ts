import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("world tree skeleton visuals", () => {
  it("renders a visible trunk shell with roots, rings, and crown", () => {
    const source = readSource("features/journey/components/world-tree-trunk-skeleton.tsx");

    expect(source).toContain("data-world-tree-trunk-shell");
    expect(source).toContain("data-world-tree-trunk-channel");
    expect(source).toContain("data-world-tree-roots");
    expect(source).toContain("data-world-tree-ring");
    expect(source).toContain("data-world-tree-crown");
    expect(source).toContain("data-world-tree-limb-stub");
    expect(source).toContain("listTrunkRingHubStubs");
    expect(source).toContain("data-hub-key");
    expect(source).toContain("border-x-[3px]");
  });

  it("draws a continuous main spine with pixel-scale stroke widths", () => {
    const source = readSource("features/journey/components/world-tree-spine-path.tsx");

    expect(source).toContain("buildTrunkColumnPath");
    expect(source).toContain("hubPositions");
    expect(source).toContain('strokeWidth={isMain ? 10 : 6}');
    expect(source).toContain('strokeWidth={isMain ? 3.5 : 2.25}');
    expect(source).toContain('vectorEffect="non-scaling-stroke"');
  });

  it("composes trunk skeleton and spine path in the art layer", () => {
    const source = readSource("features/journey/components/journey-skeleton-art-layer.tsx");

    expect(source).toContain("WorldTreeTrunkSkeleton");
    expect(source).toContain("WorldTreeSpinePath");
    expect(source).toContain("nodes={layout.nodes}");
  });
});
