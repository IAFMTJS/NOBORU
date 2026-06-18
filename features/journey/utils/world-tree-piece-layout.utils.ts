import type { WorldTreeZoneId } from "@/features/journey/constants/world-tree-skeleton.constants";
import {
  WORLD_TREE_ZONE_ART,
  type WorldTreeArtLayerRole,
  type WorldTreeZoneArtLayer,
} from "@/features/journey/constants/world-tree-zone-art.constants";
import type { ArtLibraryTheme } from "@/lib/assets/art-library-paths";
import {
  listWorldTreeSheetPieces,
  sliceWorldTreeSheetPieces,
  worldTreeSheetRemasterUrl,
  type WorldTreeSheetRemaster,
} from "@/lib/assets/world-tree-sheet";

export type WorldTreePlacedPiece = {
  id: string;
  src: string;
  role: WorldTreeArtLayerRole;
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  zIndex: number;
};

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function pickPieces(
  layer: WorldTreeZoneArtLayer,
  theme: ArtLibraryTheme,
): WorldTreeSheetRemaster[] {
  const all = listWorldTreeSheetPieces(layer.section, theme);
  const start = Math.max(0, (layer.start ?? 1) - 1);
  if (layer.count != null) {
    return all.slice(start, start + layer.count);
  }
  return all.slice(start);
}

function stackTopPercent(index: number, total: number, role: WorldTreeArtLayerRole): number {
  if (total <= 1) return role === "background" ? 0 : 50;
  const usable = role === "background" ? 88 : 92;
  const offset = role === "background" ? 0 : 4;
  return offset + (index / (total - 1)) * usable;
}

function overlayPosition(id: string, index: number): { leftPercent: number; topPercent: number } {
  const hash = hashString(id);
  const lane = index % 2 === 0 ? 0.34 : 0.66;
  const jitter = ((hash % 17) - 8) / 100;
  return {
    leftPercent: Math.min(82, Math.max(18, lane * 100 + jitter * 100)),
    topPercent: 8 + (hash % 75),
  };
}

function widthForRole(role: WorldTreeArtLayerRole, piece: WorldTreeSheetRemaster): number {
  switch (role) {
    case "background":
      return 100;
    case "trunk":
    case "roots":
    case "branches":
      return 46;
    case "platform":
      return 34 + (hashString(piece.id) % 12);
    default:
      return 18 + (hashString(piece.id) % 14);
  }
}

function zIndexForRole(role: WorldTreeArtLayerRole): number {
  switch (role) {
    case "background":
      return 0;
    case "trunk":
    case "roots":
    case "branches":
      return 10;
    case "platform":
      return 20;
    default:
      return 30;
  }
}

function placeStackedPieces(
  pieces: WorldTreeSheetRemaster[],
  role: WorldTreeArtLayerRole,
): WorldTreePlacedPiece[] {
  return pieces.map((piece, index) => ({
    id: piece.id,
    src: worldTreeSheetRemasterUrl(piece),
    role,
    leftPercent: 50,
    topPercent: stackTopPercent(index, pieces.length, role),
    widthPercent: widthForRole(role, piece),
    zIndex: zIndexForRole(role),
  }));
}

function placeOverlayPieces(
  pieces: WorldTreeSheetRemaster[],
  role: WorldTreeArtLayerRole,
): WorldTreePlacedPiece[] {
  return pieces.map((piece, index) => {
    const position = overlayPosition(piece.id, index);
    return {
      id: piece.id,
      src: worldTreeSheetRemasterUrl(piece),
      role,
      leftPercent: position.leftPercent,
      topPercent: position.topPercent,
      widthPercent: widthForRole(role, piece),
      zIndex: zIndexForRole(role),
    };
  });
}

/** Deterministic puzzle-piece layout for one skeleton zone. */
export function buildWorldTreeZonePieceLayout(
  zoneId: WorldTreeZoneId,
  theme: ArtLibraryTheme,
): WorldTreePlacedPiece[] {
  const config = WORLD_TREE_ZONE_ART[zoneId];
  const placed: WorldTreePlacedPiece[] = [];

  for (const layer of config.layers) {
    const pieces = pickPieces(layer, theme);
    if (pieces.length === 0) continue;

    if (
      layer.role === "trunk" ||
      layer.role === "roots" ||
      layer.role === "branches" ||
      layer.role === "background"
    ) {
      placed.push(...placeStackedPieces(pieces, layer.role));
      continue;
    }

    placed.push(...placeOverlayPieces(pieces, layer.role));
  }

  return placed;
}

/** @internal test helper */
export function __testSlicePieces(
  section: string,
  theme: ArtLibraryTheme,
  start: number,
  count: number,
) {
  return sliceWorldTreeSheetPieces(section, theme, start, count);
}
