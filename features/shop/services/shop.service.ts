import { inventoryService } from "@/features/inventory/services/inventory.service";
import type {
  ShopCatalogViewModel,
  ShopItemViewModel,
  ShopPurchaseResult,
} from "@/features/shop/types/shop.types";

const INITIAL_ITEMS: ShopItemViewModel[] = [
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
];

class ShopService {
  private wallet = { gold: 1240, gems: 18 };
  private items: ShopItemViewModel[] = INITIAL_ITEMS.map((item) => ({ ...item }));

  getCatalog(): ShopCatalogViewModel {
    return {
      wallet: { ...this.wallet },
      items: this.items.map((item) => ({ ...item })),
    };
  }

  purchase(itemId: string): ShopPurchaseResult {
    const item = this.items.find((entry) => entry.id === itemId);
    if (!item) {
      return { success: false, error: "The merchant does not carry that ware." };
    }
    if (item.owned) {
      return { success: false, error: "You already carry this on the trail." };
    }

    if (item.currency === "gold" && this.wallet.gold < item.price) {
      return { success: false, error: "Not enough gold — earn more on the trail." };
    }
    if (item.currency === "gems" && this.wallet.gems < item.price) {
      return { success: false, error: "Not enough gems for this treasure." };
    }

    if (item.currency === "gold") {
      this.wallet.gold -= item.price;
    } else {
      this.wallet.gems -= item.price;
    }

    item.owned = true;
    inventoryService.grantFromShop(item);

    return {
      success: true,
      itemName: item.name,
      catalog: this.getCatalog(),
    };
  }
}

export const shopService = new ShopService();
