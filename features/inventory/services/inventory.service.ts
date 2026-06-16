import type {
  InventoryCapacityViewModel,
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";

const PLACEHOLDER_INVENTORY: InventoryItemViewModel[] = [
  {
    id: "lantern",
    name: "Lantern",
    description: "A warm light that reveals the path ahead.",
    category: "consumable",
    rarity: "common",
    assetKey: "lantern",
    quantity: 3,
    usable: true,
    stackable: true,
  },
  {
    id: "onigiri",
    name: "Onigiri",
    description: "Trail rations for a steady climb.",
    category: "consumable",
    rarity: "common",
    assetKey: "onigiri",
    quantity: 5,
    usable: true,
    stackable: true,
  },
  {
    id: "dango",
    name: "Dango",
    description: "Sweet reward after a long lesson.",
    category: "consumable",
    rarity: "uncommon",
    assetKey: "dango",
    quantity: 2,
    usable: true,
    stackable: true,
  },
  {
    id: "daruma",
    name: "Daruma",
    description: "A charm for focused study sessions.",
    category: "consumable",
    rarity: "rare",
    assetKey: "daruma",
    quantity: 1,
    usable: true,
    stackable: false,
  },
  {
    id: "fox-scarf",
    name: "Fox Scarf",
    description: "A cozy scarf for Yama on cold summits.",
    category: "cosmetic",
    rarity: "rare",
    assetKey: "scarf",
    quantity: 1,
    equipped: true,
    usable: false,
    stackable: false,
  },
  {
    id: "summit-banner",
    name: "Summit Banner",
    description: "Profile banner celebrating your highest peak.",
    category: "cosmetic",
    rarity: "uncommon",
    assetKey: "scroll",
    quantity: 1,
    usable: false,
    stackable: false,
  },
  {
    id: "shrine-bell",
    name: "Shrine Bell",
    description: "A gentle chime when you complete daily quests.",
    category: "cosmetic",
    rarity: "epic",
    assetKey: "stone_lantern",
    quantity: 1,
    usable: false,
    stackable: false,
  },
  {
    id: "lantern-trail",
    name: "Lantern Trail",
    description: "Warm amber glow along your path at night.",
    category: "trail",
    rarity: "rare",
    assetKey: "lantern",
    quantity: 1,
    equipped: true,
    usable: false,
    stackable: false,
  },
  {
    id: "sakura-trail",
    name: "Sakura Petals",
    description: "Soft petals drift along your climb during spring.",
    category: "trail",
    rarity: "epic",
    assetKey: "sakura",
    quantity: 1,
    usable: false,
    stackable: false,
  },
  {
    id: "ember-trail",
    name: "Ember Path",
    description: "Glowing embers mark each completed step.",
    category: "trail",
    rarity: "legendary",
    assetKey: "stone_lantern",
    quantity: 1,
    usable: false,
    stackable: false,
  },
];

class InventoryService {
  private readonly totalSlots = 20;

  private items: InventoryItemViewModel[] = PLACEHOLDER_INVENTORY.map((item) => ({
    ...item,
  }));

  getInventory(): InventoryViewModel {
    return {
      items: this.items.map((item) => ({ ...item })),
      capacity: this.getCapacity(),
    };
  }

  hydrate(inventory: InventoryViewModel): void {
    this.items = inventory.items.map((item) => ({ ...item }));
  }

  useItem(itemId: string, amount = 1): boolean {
    if (amount <= 0) return false;
    const item = this.items.find((candidate) => candidate.id === itemId);
    if (!item || !item.usable || item.quantity < amount) return false;

    item.quantity -= amount;

    if (item.quantity <= 0) {
      this.items = this.items.filter((candidate) => candidate.id !== itemId);
    }

    return true;
  }

  toggleEquip(itemId: string): boolean {
    const item = this.items.find((candidate) => candidate.id === itemId);
    if (!item || item.category === "consumable") return false;

    item.equipped = !item.equipped;
    return true;
  }

  getQuickUseItems(): InventoryItemViewModel[] {
    return this.items
      .filter((item) => item.usable && item.quantity > 0)
      .map((item) => ({ ...item }));
  }

  private getCapacity(): InventoryCapacityViewModel {
    return {
      usedSlots: this.items.length,
      totalSlots: this.totalSlots,
    };
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
      rarity: "common",
      assetKey,
      quantity: 1,
      usable: shopItem.category === "consumable",
      stackable: shopItem.category === "consumable",
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
