export type CollectibleCategory =
  | "lantern"
  | "spirit"
  | "relic"
  | "scroll"
  | "token"
  | "artifact";

export type CollectibleDefinitionRow = {
  id: string;
  slug: string;
  region_slug: string;
  name: string;
  description: string | null;
  category: CollectibleCategory;
  sort_order: number;
};

export type UserCollectibleRow = {
  id: string;
  user_id: string;
  collectible_id: string;
  earned_at: string;
  source_type: string;
  source_id: string | null;
};

export type CollectibleViewModel = {
  slug: string;
  name: string;
  category: CollectibleCategory;
  regionSlug: string;
  earned: boolean;
  earnedAt: string | null;
};

export type RegionCollectibleProgress = {
  regionSlug: string;
  earned: number;
  total: number;
  collectibles: CollectibleViewModel[];
};
