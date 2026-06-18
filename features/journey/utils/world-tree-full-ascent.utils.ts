import {
  WORLD_TREE_GLOBAL_STRUCTURE,
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
  backdrops: WorldTreeBackdropSlice[];
  decor: WorldTreeDecorPiece[];
};

export type WorldTreeFullAscentLayout = {
  realms: WorldTreeRealmLayout[];
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

function collectGlobalStructural(theme: ArtLibraryTheme): WorldTreeStructuralPiece[] {
  const structural: WorldTreeStructuralPiece[] = [];

  for (const layer of WORLD_TREE_GLOBAL_STRUCTURE) {
    for (const piece of pickPieces(layer, theme)) {
      structural.push({
        id: piece.id,
        src: worldTreeSheetRemasterUrl(piece),
        role: layer.role,
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
      return 20 + (hashString(pieceId) % 6);
    case "bridge":
      return 26 + (hashString(pieceId) % 6);
    case "shrine":
      return 14 + (hashString(pieceId) % 4);
    case "camp":
      return 16 + (hashString(pieceId) % 4);
    default:
      return 12 + (hashString(pieceId) % 6);
  }
}

function decorLeftPercent(category: WorldTreeDecorCategory, index: number, hash: number): number {
  const jitter = ((hash % 9) - 4) * 1.5;

  switch (category) {
    case "shrine":
      return Math.min(56, Math.max(44, 50 + jitter));
    case "camp":
      return Math.min(72, Math.max(28, (index % 2 === 0 ? 40 : 60) + jitter));
    case "settlement":
      return Math.min(76, Math.max(24, (index % 2 === 0 ? 32 : 68) + jitter));
    default:
      return Math.min(70, Math.max(30, (index % 2 === 0 ? 36 : 64) + jitter));
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
  let slotIndex = 0;

  for (const spec of decorSpecs) {
    const pieces = pickPieces(spec, theme);
    pieces.forEach((piece) => {
      const hash = hashString(piece.id);
      slotIndex += 1;
      const verticalAnchor = band.yMin + span * (0.35 + (slotIndex % 3) * 0.2);

      decor.push({
        id: piece.id,
        src: worldTreeSheetRemasterUrl(piece),
        role: spec.role,
        category: spec.category,
        realmId,
        topPercent: verticalAnchor,
        leftPercent: decorLeftPercent(spec.category, slotIndex, hash),
        widthPercent: decorWidth(spec.category, piece.id),
      });
    });
  }

  return decor;
}

/** Five-realm atmosphere + one global trunk column. */
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
      backdrops: layoutBackdropsForRealm(realm.id, band, realm.backdrop, theme),
      decor: layoutDecorForRealm(realm.id, band, realm.decor, theme),
    };
  });

  const structural = collectGlobalStructural(theme);

  return {
    realms,
    structural,
    backdrops: realms.flatMap((realm) => realm.backdrops),
    decor: realms.flatMap((realm) => realm.decor),
  };
}

export { WORLD_TREE_STRUCTURAL_SPAN };
