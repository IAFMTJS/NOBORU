import type {
  CollectionArtifactCategory,
  CollectionArtifactViewModel,
  CollectionsMuseumViewModel,
} from "@/features/collections/types/collections.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

type MuseumSeed = {
  assetKey: keyof typeof INVENTORY_ITEM_ASSETS;
  name: string;
  description: string;
  category: CollectionArtifactCategory;
  regionLabel: string;
  discovered: boolean;
  discoveredAt: string | null;
};

const MUSEUM_SEED: MuseumSeed[] = [
  {
    assetKey: "lantern",
    name: "Paper Lantern",
    description: "A warm glow earned after your first night on the trail.",
    category: "lanterns",
    regionLabel: "Foothills",
    discovered: true,
    discoveredAt: "2026-05-12T18:00:00.000Z",
  },
  {
    assetKey: "stone_lantern",
    name: "Stone Lantern",
    description: "Carved granite that marks a shrine milestone along the climb.",
    category: "lanterns",
    regionLabel: "Forest Trail",
    discovered: true,
    discoveredAt: "2026-05-28T09:30:00.000Z",
  },
  {
    assetKey: "omamori",
    name: "Trail Omamori",
    description: "A protective charm tied to steady review practice.",
    category: "charms",
    regionLabel: "Foothills",
    discovered: true,
    discoveredAt: "2026-06-01T14:15:00.000Z",
  },
  {
    assetKey: "daruma",
    name: "Study Daruma",
    description: "One eye filled for each focused lesson week you complete.",
    category: "relics",
    regionLabel: "Mount N5",
    discovered: false,
    discoveredAt: null,
  },
  {
    assetKey: "scroll",
    name: "Grammar Scroll",
    description: "Ancient notes on patterns discovered in the temple halls.",
    category: "relics",
    regionLabel: "Forest Trail",
    discovered: true,
    discoveredAt: "2026-06-08T11:00:00.000Z",
  },
  {
    assetKey: "fox_mask",
    name: "Festival Mask",
    description: "A celebratory mask from a seasonal summit festival.",
    category: "seasonal",
    regionLabel: "Mount N5",
    discovered: false,
    discoveredAt: null,
  },
  {
    assetKey: "sakura",
    name: "Sakura Petal",
    description: "A pressed blossom from the spring event trail.",
    category: "seasonal",
    regionLabel: "Forest Trail",
    discovered: true,
    discoveredAt: "2026-04-03T16:45:00.000Z",
  },
  {
    assetKey: "fan",
    name: "Mountain Fan",
    description: "Painted with peaks you have already cleared.",
    category: "trail",
    regionLabel: "Foothills",
    discovered: true,
    discoveredAt: "2026-05-20T08:00:00.000Z",
  },
  {
    assetKey: "backpack",
    name: "Bamboo Pack",
    description: "Well-worn gear from long climbs between regions.",
    category: "trail",
    regionLabel: "Mount N5",
    discovered: false,
    discoveredAt: null,
  },
  {
    assetKey: "onigiri",
    name: "Summit Onigiri",
    description: "A trail ration commemorating a perfect recall session.",
    category: "charms",
    regionLabel: "Foothills",
    discovered: false,
    discoveredAt: null,
  },
  {
    assetKey: "dango",
    name: "Festival Dango",
    description: "Sweet reward from a community festival week.",
    category: "seasonal",
    regionLabel: "Mount N5",
    discovered: false,
    discoveredAt: null,
  },
  {
    assetKey: "scarf",
    name: "Crimson Scarf",
    description: "Companion warmth earned at a high-elevation camp.",
    category: "trail",
    regionLabel: "Mount N4",
    discovered: false,
    discoveredAt: null,
  },
];

function toArtifact(seed: MuseumSeed): CollectionArtifactViewModel {
  if (!INVENTORY_ITEM_ASSETS[seed.assetKey]) {
    throw new Error(`Missing museum asset mapping for ${seed.assetKey}`);
  }

  return {
    id: seed.assetKey,
    name: seed.name,
    description: seed.description,
    category: seed.category,
    assetKey: seed.assetKey,
    discovered: seed.discovered,
    discoveredAt: seed.discoveredAt,
    regionLabel: seed.regionLabel,
  };
}

class CollectionsService {
  getMuseum(): CollectionsMuseumViewModel {
    const artifacts = MUSEUM_SEED.map(toArtifact);
    const discoveredCount = artifacts.filter((artifact) => artifact.discovered).length;

    return {
      artifacts,
      discoveredCount,
      totalCount: artifacts.length,
    };
  }
}

export const collectionsService = new CollectionsService();
