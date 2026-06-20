import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("journey-world-canvas art isolation", () => {
  it("does not import sheet-remaster art layer", () => {
    const source = readFileSync(
      resolve(process.cwd(), "features/journey/components/journey-world-canvas.tsx"),
      "utf8",
    );

    expect(source).not.toContain("JourneyWorldTreeArtLayer");
    expect(source).not.toContain("buildWorldTreeFullAscentLayout");
    expect(source).not.toContain("buildWorldTreeZonePieceLayout");
    expect(source).toContain("JourneySkeletonArtLayer");
    expect(source).toContain('data-journey-skeleton-mode="true"');
  });
});
