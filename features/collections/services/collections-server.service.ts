import { collectibleService } from "@/features/collectibles/services/collectible.service";
import type {
  CollectionArtifactCategory,
  CollectionArtifactViewModel,
  CollectionsMuseumViewModel,
} from "@/features/collections/types/collections.types";
import { getRegionVisuals } from "@/lib/design-system/region-tokens";
import { normalizeRegionSlug } from "@/lib/design-system/worlds";
import type { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

const COLLECTIBLE_CATEGORY_TO_MUSEUM: Record<string, CollectionArtifactCategory> = {
  lantern: "lanterns",
  spirit: "charms",
  token: "charms",
  scroll: "relics",
  relic: "relics",
  artifact: "relics",
};

const COLLECTIBLE_SLUG_TO_ASSET: Record<string, keyof typeof INVENTORY_ITEM_ASSETS> = {
  "foothills-lantern-1": "lantern",
  "foothills-lantern-2": "stone_lantern",
  "foothills-scroll-1": "scroll",
  "forest-spirit-1": "fox_mask",
  "forest-token-1": "omamori",
  "n5-relic-1": "daruma",
};

function resolveAssetKey(slug: string): keyof typeof INVENTORY_ITEM_ASSETS {
  return COLLECTIBLE_SLUG_TO_ASSET[slug] ?? "lantern";
}

function resolveRegionLabel(regionSlug: string): string {
  const world = normalizeRegionSlug(regionSlug);
  return getRegionVisuals(world).label;
}

class CollectionsServerService {
  async getMuseum(userId: string): Promise<CollectionsMuseumViewModel> {
    const collectibles = await collectibleService.listAll(userId);

    const artifacts: CollectionArtifactViewModel[] = collectibles.map((entry) => ({
      id: entry.slug,
      name: entry.name,
      description: entry.earned
        ? `Earned on the ${resolveRegionLabel(entry.regionSlug)} trail.`
        : "Still hidden along the path — keep climbing.",
      category: COLLECTIBLE_CATEGORY_TO_MUSEUM[entry.category] ?? "relics",
      assetKey: resolveAssetKey(entry.slug),
      discovered: entry.earned,
      discoveredAt: entry.earnedAt,
      regionLabel: resolveRegionLabel(entry.regionSlug),
    }));

    const discoveredCount = artifacts.filter((artifact) => artifact.discovered).length;

    return {
      artifacts,
      discoveredCount,
      totalCount: artifacts.length,
    };
  }
}

export const collectionsServerService = new CollectionsServerService();
