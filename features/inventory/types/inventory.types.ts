import type { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

export type InventoryTab = "items" | "cosmetics" | "trails";

export type InventoryItemCategory = "consumable" | "cosmetic" | "trail" | "seasonal";

export type InventoryItemViewModel = {
  id: string;
  name: string;
  description: string;
  category: InventoryItemCategory;
  assetKey: keyof typeof INVENTORY_ITEM_ASSETS;
  quantity: number;
  equipped?: boolean;
};

export type InventoryViewModel = {
  items: InventoryItemViewModel[];
};
