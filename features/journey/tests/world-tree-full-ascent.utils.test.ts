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
    expect(WORLD_TREE_REALMS.map((realm) => realm.id)).toEqual([
      "deep_roots",
      "root_frontier",
      "trunk_realm",
      "canopy_realm",
      "celestial_spire",
    ]);

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
});

describe("buildWorldTreeFullAscentLayout", () => {
  it("builds five realm layouts with continuous structural columns", () => {
    const layout = buildWorldTreeFullAscentLayout("light");

    expect(layout.realms).toHaveLength(5);
    expect(layout.realms[0]!.structural[0]!.src).toContain("14_underground_root_passages");
    expect(layout.realms.find((realm) => realm.id === "trunk_realm")!.structural.length).toBeGreaterThan(
      0,
    );
    expect(layout.realms.at(-1)!.structural.some((piece) => piece.role === "branches")).toBe(true);
  });

  it("includes underground backdrops in the deep roots realm", () => {
    const layout = buildWorldTreeFullAscentLayout("light");
    const deep = layout.realms.find((realm) => realm.id === "deep_roots")!;

    expect(deep.backdrops.length).toBeGreaterThan(0);
    expect(deep.backdrops[0]!.src).toContain("14_underground_root_passages");
  });

  it("places decor by legend category within each realm", () => {
    const layout = buildWorldTreeFullAscentLayout("light");
    const trunk = layout.realms.find((realm) => realm.id === "trunk_realm")!;

    expect(trunk.decor.some((piece) => piece.category === "camp")).toBe(true);
    expect(trunk.decor.some((piece) => piece.category === "shrine")).toBe(true);
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
    expect(WORLD_TREE_NODE_MIN_Y_GAP).toBeGreaterThanOrEqual(3.5);
  });
});
