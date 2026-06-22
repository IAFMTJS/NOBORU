import { describe, expect, it } from "vitest";

import {
  buildWorldTreeUndergroundLayout,
  resolveWorldTreeUndergroundHeightVh,
} from "@/features/journey/utils/world-tree-underground-layout.utils";

describe("buildWorldTreeUndergroundLayout", () => {
  it("places roots banner and underground sheet art", () => {
    const layout = buildWorldTreeUndergroundLayout("dark");

    expect(layout.rootsBannerSrc).toContain("01_roots/wt_roots_dark");
    expect(layout.pieces.length).toBeGreaterThan(8);
    expect(layout.pieces.some((piece) => piece.src.includes("underground_root_passages"))).toBe(
      true,
    );
    expect(layout.pieces.some((piece) => piece.role === "fungi")).toBe(true);
    expect(layout.pieces.some((piece) => piece.role === "crystal")).toBe(true);
  });

  it("stacks root passages vertically in the cavern", () => {
    const layout = buildWorldTreeUndergroundLayout("light");
    const passages = layout.pieces.filter((piece) => piece.role === "passage");

    expect(passages.length).toBeGreaterThanOrEqual(2);
    expect(passages.every((piece) => piece.widthPercent === 100)).toBe(true);
  });
});

describe("resolveWorldTreeUndergroundHeightVh", () => {
  it("reserves a meaningful sub-base block below the tree", () => {
    expect(resolveWorldTreeUndergroundHeightVh(600)).toBeGreaterThanOrEqual(100);
  });
});
