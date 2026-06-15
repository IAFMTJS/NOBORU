import type { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

export type CollectionArtifactCategory =
  | "lanterns"
  | "charms"
  | "relics"
  | "trail"
  | "seasonal";

export type CollectionArtifactViewModel = {
  id: string;
  name: string;
  description: string;
  category: CollectionArtifactCategory;
  assetKey: keyof typeof INVENTORY_ITEM_ASSETS;
  discovered: boolean;
  discoveredAt: string | null;
  regionLabel: string;
};

export type CollectionsMuseumViewModel = {
  artifacts: CollectionArtifactViewModel[];
  discoveredCount: number;
  totalCount: number;
};
