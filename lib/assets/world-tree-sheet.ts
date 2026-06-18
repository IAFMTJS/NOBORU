import { artLibraryPath, type ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import remasterManifest from "../../Art Library/world-tree/sheet-remasters/manifest.json";

export type WorldTreeSheetRemaster = {
  id: string;
  section: string;
  sourceExtract: string;
  png: string;
  webp: string;
  remasteredAt: string;
};

export const WORLD_TREE_SHEET_REMASTERS =
  remasterManifest as WorldTreeSheetRemaster[];

const UNDERGROUND_SECTIONS = new Set([
  "14_underground_root_passages",
  "15_root_chambers_caverns",
  "16_underground_platforms",
  "17_underground_settlements",
  "18_underground_props",
  "19_underground_fungi",
  "20_underground_crystals",
  "21_underground_special",
]);

/** Surface sheet rows are light-only; underground rows are dark-only. */
export function resolveWorldTreeSheetTheme(
  section: string,
  appTheme: ArtLibraryTheme,
): ArtLibraryTheme {
  if (UNDERGROUND_SECTIONS.has(section)) return "dark";
  if (section.startsWith("0") || section.startsWith("1")) {
    const hasLight = WORLD_TREE_SHEET_REMASTERS.some(
      (entry) => entry.section === section && entry.id.includes("_light_"),
    );
    const hasDark = WORLD_TREE_SHEET_REMASTERS.some(
      (entry) => entry.section === section && entry.id.includes("_dark_"),
    );
    if (appTheme === "dark" && hasDark) return "dark";
    if (hasLight) return "light";
    if (hasDark) return "dark";
  }
  return appTheme;
}

export function worldTreeSheetRemasterRelativePath(entry: WorldTreeSheetRemaster): string {
  return `world-tree/sheet-remasters/${entry.section}/${entry.id}.png`;
}

export function worldTreeSheetRemasterUrl(entry: WorldTreeSheetRemaster): string {
  return artLibraryPath(worldTreeSheetRemasterRelativePath(entry));
}

function pieceIndexFromId(id: string): number {
  const match = id.match(/_(\d+)_(?:light|dark)_v\d+$/);
  return match ? Number.parseInt(match[1]!, 10) : 0;
}

export function listWorldTreeSheetPieces(
  section: string,
  theme: ArtLibraryTheme,
): WorldTreeSheetRemaster[] {
  const resolvedTheme = resolveWorldTreeSheetTheme(section, theme);
  const themed = WORLD_TREE_SHEET_REMASTERS.filter(
    (entry) =>
      entry.section === section &&
      entry.id.includes(`_${resolvedTheme}_`),
  );

  if (themed.length > 0) {
    return [...themed].sort(
      (a, b) => pieceIndexFromId(a.id) - pieceIndexFromId(b.id),
    );
  }

  return WORLD_TREE_SHEET_REMASTERS.filter((entry) => entry.section === section).sort(
    (a, b) => pieceIndexFromId(a.id) - pieceIndexFromId(b.id),
  );
}

export function sliceWorldTreeSheetPieces(
  section: string,
  theme: ArtLibraryTheme,
  startIndex: number,
  count: number,
): WorldTreeSheetRemaster[] {
  return listWorldTreeSheetPieces(section, theme).slice(startIndex, startIndex + count);
}
