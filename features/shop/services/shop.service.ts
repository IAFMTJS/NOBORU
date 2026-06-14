import type { ShopCatalogViewModel } from "@/features/shop/types/shop.types";

const PLACEHOLDER_CATALOG: ShopCatalogViewModel = {
  wallet: { gold: 1240, gems: 18 },
  items: [
    {
      id: "lantern-trail-skin",
      name: "Lantern Trail",
      description: "Warm amber glow along your path at night.",
      category: "trail",
      currency: "gold",
      price: 800,
      iconLabel: "🏮",
      owned: false,
      featured: true,
    },
    {
      id: "fox-scarf-cosmetic",
      name: "Fox Scarf",
      description: "A cozy scarf for Yama on cold summits.",
      category: "cosmetic",
      currency: "gems",
      price: 12,
      iconLabel: "🧣",
      owned: false,
    },
    {
      id: "sakura-petals-trail",
      name: "Sakura Petals",
      description: "Soft petals drift along your climb during spring.",
      category: "seasonal",
      currency: "gems",
      price: 25,
      iconLabel: "🌸",
      owned: false,
      featured: true,
    },
    {
      id: "stamina-tea",
      name: "Mountain Tea",
      description: "Restore one review heart after a tough session.",
      category: "consumable",
      currency: "gold",
      price: 150,
      iconLabel: "🍵",
      owned: false,
    },
    {
      id: "summit-banner",
      name: "Summit Banner",
      description: "Profile banner celebrating your highest peak.",
      category: "cosmetic",
      currency: "gold",
      price: 600,
      iconLabel: "⛰️",
      owned: true,
    },
    {
      id: "shrine-bell-charm",
      name: "Shrine Bell Charm",
      description: "A gentle chime when you complete daily quests.",
      category: "cosmetic",
      currency: "gems",
      price: 8,
      iconLabel: "🔔",
      owned: false,
    },
  ],
};

class ShopService {
  getCatalog(): ShopCatalogViewModel {
    return PLACEHOLDER_CATALOG;
  }
}

export const shopService = new ShopService();
