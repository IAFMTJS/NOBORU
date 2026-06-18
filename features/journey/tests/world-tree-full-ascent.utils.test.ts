import { describe, expect, it } from "vitest";

import {
  WORLD_TREE_NODE_MIN_Y_GAP,
  WORLD_TREE_REALMS,
  buildWorldTreeRealmBands,
} from "@/features/journey/constants/world-tree-full-ascent.constants";
import { buildWorldTreeFullAscentLayout } from "@/features/journey/utils/world-tree-full-ascent.utils";

describe("WORLD_TREE_REALMS", () => {
  it("defines five vertical realms that cover the full canvas", () => {
    expect(WORLD_TREE_REALMS).toHaveLength(5);
    const totalHeight = WORLD_TREE_REALMS.reduce(
      (sum, realm) => sum + realm.heightPercent,
      0,
    );
    expect(totalHeight).toBe(100);
  });

  it("maps realm bands from base to crown", () => {
    const bands = buildWorldTreeRealmBands();
    expect(bands.deep_roots.yMax).toBe(100);
    expect(bands.celestial_spire.yMin).toBe(0);
  });

  it("keeps decor sparse per realm", () => {
    for (const realm of WORLD_TREE_REALMS) {
      expect(realm.decor.length).toBeLessThanOrEqual(2);
    }
  });
});

describe("buildWorldTreeFullAscentLayout", () => {
  it("builds one global structural column from underground through branches", () => {
    const layout = buildWorldTreeFullAscentLayout("light");

    expect(layout.structural.length).toBeGreaterThan(30);
    expect(layout.structural[0]!.src).toContain("14_underground_root_passages");
    expect(layout.structural.some((piece) => piece.role === "trunk")).toBe(true);
    expect(layout.structural.some((piece) => piece.role === "branches")).toBe(true);
  });

  it("uses realm bands for atmosphere only", () => {
    const layout = buildWorldTreeFullAscentLayout("light");
    expect(layout.realms).toHaveLength(5);
    expect(layout.realms.every((realm) => realm.backdrops.length >= 0)).toBe(true);
  });

  it("includes underground backdrops in the deep roots realm", () => {
    const layout = buildWorldTreeFullAscentLayout("light");
    const deep = layout.realms.find((realm) => realm.id === "deep_roots")!;

    expect(deep.backdrops.length).toBeGreaterThan(0);
    expect(deep.backdrops[0]!.src).toContain("14_underground_root_passages");
  });

  it("limits total decor to avoid clutter", () => {
    const layout = buildWorldTreeFullAscentLayout("light");
    expect(layout.decor.length).toBeLessThanOrEqual(10);
  });

  it("resolves published webp URLs without theme re-swapping surface trunk", () => {
    const layout = buildWorldTreeFullAscentLayout("dark");
    const trunk = layout.structural.filter((piece) => piece.role === "trunk");

    expect(
      trunk.every(
        (piece) =>
          piece.src.startsWith("/art-library/world-tree/sheet-remasters") &&
          piece.src.endsWith(".webp") &&
          piece.src.includes("_light_"),
      ),
    ).toBe(true);
  });
});

describe("WORLD_TREE_NODE_MIN_Y_GAP", () => {
  it("reserves enough vertical space for readable node spacing", () => {
    expect(WORLD_TREE_NODE_MIN_Y_GAP).toBeGreaterThanOrEqual(4);
  });
});
