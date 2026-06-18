import { describe, expect, it } from "vitest";

import {
  buildWorldTreeZonePieceLayout,
} from "@/features/journey/utils/world-tree-piece-layout.utils";
import {
  listWorldTreeSheetPieces,
  resolveWorldTreeSheetTheme,
} from "@/lib/assets/world-tree-sheet";

describe("resolveWorldTreeSheetTheme", () => {
  it("uses dark assets for underground sections", () => {
    expect(resolveWorldTreeSheetTheme("19_underground_fungi", "light")).toBe("dark");
  });

  it("uses light assets for surface trunk sections", () => {
    expect(resolveWorldTreeSheetTheme("01_trunk_segments", "dark")).toBe("light");
  });
});

describe("listWorldTreeSheetPieces", () => {
  it("returns themed trunk segments in index order", () => {
    const pieces = listWorldTreeSheetPieces("01_trunk_segments", "light");
    expect(pieces.length).toBeGreaterThan(0);
    expect(pieces[0]!.id).toContain("_01_");
    expect(pieces.at(-1)!.id).toContain(`_${String(pieces.length).padStart(2, "0")}_`);
  });
});

describe("buildWorldTreeZonePieceLayout", () => {
  it("places trunk and overlay pieces for foothills", () => {
    const layout = buildWorldTreeZonePieceLayout("n4_foothills", "light");
    expect(layout.some((piece) => piece.role === "trunk")).toBe(true);
    expect(layout.some((piece) => piece.role === "overlay")).toBe(true);
    expect(
      layout.every(
        (piece) =>
          piece.src.startsWith("/art-library/world-tree/sheet-remasters") &&
          piece.src.endsWith(".webp"),
      ),
    ).toBe(true);
  });

  it("keeps surface trunk URLs on light assets even when app theme is dark", () => {
    const layout = buildWorldTreeZonePieceLayout("n4_foothills", "dark");
    const trunk = layout.filter((piece) => piece.role === "trunk");
    expect(trunk.length).toBeGreaterThan(0);
    expect(trunk.every((piece) => piece.src.includes("_light_"))).toBe(true);
  });

  it("uses underground assets in the deep root zone", () => {
    const layout = buildWorldTreeZonePieceLayout("deep_roots", "light");
    expect(layout.length).toBeGreaterThan(0);
    expect(layout.every((piece) => piece.src.includes("_dark_"))).toBe(true);
  });
});
