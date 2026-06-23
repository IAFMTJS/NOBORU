import type {
  InventoryCapacityViewModel,
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";

class InventoryService {
  private readonly totalSlots = 20;

  private items: InventoryItemViewModel[] = [];

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
