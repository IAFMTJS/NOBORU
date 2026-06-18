import {
  WORLD_TREE_REALMS,
  WORLD_TREE_STRUCTURAL_SPAN,
  buildWorldTreeRealmBands,
  type WorldTreeAscentLayerSpec,
  type WorldTreeDecorCategory,
  type WorldTreeRealmId,
} from "@/features/journey/constants/world-tree-full-ascent.constants";
import type { WorldTreeArtLayerRole } from "@/features/journey/constants/world-tree-zone-art.constants";
import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import {
  listWorldTreeSheetPieces,
  worldTreeSheetRemasterUrl,
  type WorldTreeSheetRemaster,
} from "@/lib/assets/world-tree-sheet";

export type WorldTreeBackdropSlice = {
  id: string;
  src: string;
  topPercent: number;
  heightPercent: number;
  realmId: WorldTreeRealmId;
};

export type WorldTreeStructuralPiece = {
  id: string;
  src: string;
  role: WorldTreeArtLayerRole;
  realmId: WorldTreeRealmId;
};

export type WorldTreeDecorPiece = {
  id: string;
  src: string;
  role: WorldTreeArtLayerRole;
  category: WorldTreeDecorCategory;
  realmId: WorldTreeRealmId;
  topPercent: number;
  leftPercent: number;
  widthPercent: number;
};

export type WorldTreeRealmLayout = {
  id: WorldTreeRealmId;
  label: string;
  band: { yMin: number; yMax: number };
  structural: WorldTreeStructuralPiece[];
  backdrops: WorldTreeBackdropSlice[];
  decor: WorldTreeDecorPiece[];
};

export type WorldTreeFullAscentLayout = {
  realms: WorldTreeRealmLayout[];
  /** @deprecated Flat list — prefer `realms` */
  structural: WorldTreeStructuralPiece[];
  backdrops: WorldTreeBackdropSlice[];
  decor: WorldTreeDecorPiece[];
};

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function pickPieces(
  layer: WorldTreeAscentLayerSpec,
  theme: ArtLibraryTheme,
): WorldTreeSheetRemaster[] {
  const all = listWorldTreeSheetPieces(layer.section, theme);
  const start = Math.max(0, (layer.start ?? 1) - 1);
  if (layer.count != null) {
    return all.slice(start, start + layer.count);
  }
  return all.slice(start);
}

function collectStructuralForRealm(
  realmId: WorldTreeRealmId,
  layers: readonly WorldTreeAscentLayerSpec[],
  theme: ArtLibraryTheme,
): WorldTreeStructuralPiece[] {
  const structural: WorldTreeStructuralPiece[] = [];

  for (const layer of layers) {
    for (const piece of pickPieces(layer, theme)) {
      structural.push({
        id: piece.id,
        src: worldTreeSheetRemasterUrl(piece),
        role: layer.role,
        realmId,
      });
    }
  }

  return structural;
}

function layoutBackdropsForRealm(
  realmId: WorldTreeRealmId,
  band: { yMin: number; yMax: number },
  layers: readonly WorldTreeAscentLayerSpec[],
  theme: ArtLibraryTheme,
): WorldTreeBackdropSlice[] {
  const pieces = layers.flatMap((layer) => pickPieces(layer, theme));
  if (pieces.length === 0) return [];

  const span = band.yMax - band.yMin;
  const sliceHeight = span / pieces.length;

  return pieces.map((piece, index) => ({
    id: piece.id,
    src: worldTreeSheetRemasterUrl(piece),
    topPercent: band.yMin + index * sliceHeight,
    heightPercent: sliceHeight,
    realmId,
  }));
}

function decorWidth(category: WorldTreeDecorCategory, pieceId: string): number {
  switch (category) {
    case "settlement":
      return 24 + (hashString(pieceId) % 10);
    case "bridge":
      return 30 + (hashString(pieceId) % 8);
    case "shrine":
      return 16 + (hashString(pieceId) % 6);
    case "camp":
      return 18 + (hashString(pieceId) % 6);
    default:
      return 14 + (hashString(pieceId) % 8);
  }
}

function decorLeftPercent(
  category: WorldTreeDecorCategory,
  index: number,
  hash: number,
): number {
  const jitter = ((hash % 11) - 5) * 1.2;

  switch (category) {
    case "shrine":
      return Math.min(58, Math.max(42, 50 + jitter));
    case "bridge":
      return Math.min(68, Math.max(32, 50 + (index % 2 === 0 ? -12 : 12) + jitter));
    case "camp":
      return Math.min(76, Math.max(24, (index % 2 === 0 ? 38 : 62) + jitter));
    case "settlement":
      return Math.min(80, Math.max(20, (index % 2 === 0 ? 30 : 70) + jitter));
    default:
      return Math.min(78, Math.max(22, (index % 2 === 0 ? 34 : 66) + jitter));
  }
}

function layoutDecorForRealm(
  realmId: WorldTreeRealmId,
  band: { yMin: number; yMax: number },
  decorSpecs: readonly (WorldTreeAscentLayerSpec & { category: WorldTreeDecorCategory })[],
  theme: ArtLibraryTheme,
): WorldTreeDecorPiece[] {
  const decor: WorldTreeDecorPiece[] = [];
  const span = band.yMax - band.yMin;

  decorSpecs.forEach((spec, layerIndex) => {
    const pieces = pickPieces(spec, theme);
    pieces.forEach((piece, pieceIndex) => {
      const hash = hashString(piece.id);
      const verticalSlot = (pieceIndex + 1) / (pieces.length + 1);
      const layerOffset = layerIndex * 1.5;

      decor.push({
        id: piece.id,
        src: worldTreeSheetRemasterUrl(piece),
        role: spec.role,
        category: spec.category,
        realmId,
        topPercent: Math.min(
          band.yMax - 1.5,
          Math.max(band.yMin + 1.5, band.yMin + span * verticalSlot + layerOffset),
        ),
        leftPercent: decorLeftPercent(spec.category, pieceIndex + layerIndex, hash),
        widthPercent: decorWidth(spec.category, piece.id),
      });
    });
  });

  return decor;
}

/** Five-realm World Tree ascent using Noboru sheet-remaster puzzle pieces. */
export function buildWorldTreeFullAscentLayout(
  theme: ArtLibraryTheme,
): WorldTreeFullAscentLayout {
  const realmBands = buildWorldTreeRealmBands();

  const realms = WORLD_TREE_REALMS.map((realm) => {
    const band = realmBands[realm.id];
    return {
      id: realm.id,
      label: realm.label,
      band,
      structural: collectStructuralForRealm(realm.id, realm.structural, theme),
      backdrops: layoutBackdropsForRealm(realm.id, band, realm.backdrop, theme),
      decor: layoutDecorForRealm(realm.id, band, realm.decor, theme),
    };
  });

  return {
    realms,
    structural: realms.flatMap((realm) => realm.structural),
    backdrops: realms.flatMap((realm) => realm.backdrops),
    decor: realms.flatMap((realm) => realm.decor),
  };
}

export { WORLD_TREE_STRUCTURAL_SPAN };
