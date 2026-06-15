import type {
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";

const PLACEHOLDER_INVENTORY: InventoryItemViewModel[] = [
  {
    id: "lantern",
    name: "Lantern",
    description: "A warm light that reveals the path ahead.",
    category: "consumable",
    assetKey: "lantern",
    quantity: 3,
  },
  {
    id: "onigiri",
    name: "Onigiri",
    description: "Trail rations for a steady climb.",
    category: "consumable",
    assetKey: "onigiri",
    quantity: 5,
  },
  {
    id: "dango",
    name: "Dango",
    description: "Sweet reward after a long lesson.",
    category: "consumable",
    assetKey: "dango",
    quantity: 2,
  },
  {
    id: "daruma",
    name: "Daruma",
    description: "A charm for focused study sessions.",
    category: "consumable",
    assetKey: "daruma",
    quantity: 1,
  },
  {
    id: "fox-scarf",
    name: "Fox Scarf",
    description: "A cozy scarf for Yama on cold summits.",
    category: "cosmetic",
    assetKey: "scarf",
    quantity: 1,
    equipped: true,
  },
  {
    id: "summit-banner",
    name: "Summit Banner",
    description: "Profile banner celebrating your highest peak.",
    category: "cosmetic",
    assetKey: "scroll",
    quantity: 1,
  },
  {
    id: "shrine-bell",
    name: "Shrine Bell",
    description: "A gentle chime when you complete daily quests.",
    category: "cosmetic",
    assetKey: "stone_lantern",
    quantity: 1,
  },
  {
    id: "lantern-trail",
    name: "Lantern Trail",
    description: "Warm amber glow along your path at night.",
    category: "trail",
    assetKey: "lantern",
    quantity: 1,
    equipped: true,
  },
  {
    id: "sakura-trail",
    name: "Sakura Petals",
    description: "Soft petals drift along your climb during spring.",
    category: "trail",
    assetKey: "sakura",
    quantity: 1,
  },
  {
    id: "ember-trail",
    name: "Ember Path",
    description: "Glowing embers mark each completed step.",
    category: "trail",
    assetKey: "stone_lantern",
    quantity: 1,
  },
];

class InventoryService {
  private items: InventoryItemViewModel[] = PLACEHOLDER_INVENTORY.map((item) => ({
    ...item,
  }));

  getInventory(): InventoryViewModel {
    return { items: this.items.map((item) => ({ ...item })) };
  }

  grantFromShop(shopItem: {
    id: string;
    name: string;
    description: string;
    category: InventoryItemViewModel["category"] | "seasonal";
  }): void {
    const assetKey = mapShopCategoryToAssetKey(shopItem.id, shopItem.category);
    const existing = this.items.find((item) => item.id === shopItem.id);
    if (existing) {
      existing.quantity += 1;
      return;
    }

    this.items.push({
      id: shopItem.id,
      name: shopItem.name,
      description: shopItem.description,
      category:
        shopItem.category === "seasonal" ? "trail" : shopItem.category,
      assetKey,
      quantity: 1,
    });
  }
}

function mapShopCategoryToAssetKey(
  id: string,
  category: string,
): InventoryItemViewModel["assetKey"] {
  if (id.includes("lantern")) return "lantern";
  if (id.includes("scarf")) return "scarf";
  if (id.includes("sakura")) return "sakura";
  if (id.includes("tea")) return "onigiri";
  if (id.includes("banner")) return "scroll";
  if (id.includes("bell")) return "stone_lantern";
  if (category === "consumable") return "dango";
  if (category === "cosmetic") return "scarf";
  return "scroll";
}

export const inventoryService = new InventoryService();
