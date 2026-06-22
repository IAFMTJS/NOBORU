import {
  WORLD_TREE_UNDERGROUND_ATMOSPHERE,
  WORLD_TREE_UNDERGROUND_HEIGHT_RATIO,
  WORLD_TREE_UNDERGROUND_LAYERS,
  worldTreeRootsBannerPath,
} from "@/features/journey/constants/world-tree-underground.constants";
import { artLibraryPath } from "@/lib/assets/art-library-paths";
import {
  listWorldTreeSheetPieces,
  worldTreeSheetRemasterUrl,
} from "@/lib/assets/world-tree-sheet";

export type UndergroundPlacedPiece = {
  id: string;
  src: string;
  topPercent: number;
  heightPercent: number;
  widthPercent: number;
  leftPercent: number;
  zIndex: number;
  role: string;
};

export type WorldTreeUndergroundLayout = {
  atmosphere: string;
  rootsBannerSrc: string;
  pieces: UndergroundPlacedPiece[];
};

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function scatterPosition(id: string, index: number): { leftPercent: number; topPercent: number } {
  const hash = hashString(id);
  const lane = index % 2 === 0 ? 0.32 : 0.68;
  return {
    leftPercent: Math.min(84, Math.max(16, lane * 100 + ((hash % 13) - 6))),
    topPercent: 42 + (hash % 48),
  };
}

/** Layout for the sub-base underground block (local 0–100%). */
export function buildWorldTreeUndergroundLayout(
  theme: "light" | "dark",
): WorldTreeUndergroundLayout {
  const atmosphere = WORLD_TREE_UNDERGROUND_ATMOSPHERE[theme];
  const pieces: UndergroundPlacedPiece[] = [];
  let passageCursor = 8;

  for (const layer of WORLD_TREE_UNDERGROUND_LAYERS) {
    const sheetPieces = listWorldTreeSheetPieces(layer.section, theme).slice(0, layer.count);

    sheetPieces.forEach((piece, index) => {
      if (layer.role === "passage") {
        const height = 22;
        pieces.push({
          id: piece.id,
          src: worldTreeSheetRemasterUrl(piece),
          topPercent: passageCursor,
          heightPercent: height,
          widthPercent: 100,
          leftPercent: 50,
          zIndex: 2 + index,
          role: layer.role,
        });
        passageCursor += height - 4;
        return;
      }

      const position = scatterPosition(piece.id, index);
      const width =
        layer.role === "chamber" ? 38 : layer.role === "platform" ? 32 : 22 + (hashString(piece.id) % 8);

      pieces.push({
        id: piece.id,
        src: worldTreeSheetRemasterUrl(piece),
        topPercent: position.topPercent,
        heightPercent: layer.role === "chamber" ? 28 : 20,
        widthPercent: width,
        leftPercent: position.leftPercent,
        zIndex: layer.role === "platform" ? 12 : 16,
        role: layer.role,
      });
    });
  }

  return {
    atmosphere: `linear-gradient(to bottom, ${atmosphere.top} 0%, ${atmosphere.mid} 42%, ${atmosphere.bottom} 100%)`,
    rootsBannerSrc: artLibraryPath(worldTreeRootsBannerPath(theme)),
    pieces,
  };
}

export function resolveWorldTreeUndergroundHeightVh(canvasMinHeightVh: number): number {
  return Math.max(72, Math.round(canvasMinHeightVh * WORLD_TREE_UNDERGROUND_HEIGHT_RATIO));
}
