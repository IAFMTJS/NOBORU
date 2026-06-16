import type { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

export type InventoryTab = "items" | "cosmetics" | "trails";

export type InventoryItemCategory = "consumable" | "cosmetic" | "trail" | "seasonal";
export type InventoryItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type InventoryItemViewModel = {
  id: string;
  name: string;
  description: string;
  category: InventoryItemCategory;
  rarity?: InventoryItemRarity;
  assetKey: keyof typeof INVENTORY_ITEM_ASSETS;
  quantity: number;
  equipped?: boolean;
  usable?: boolean;
  stackable?: boolean;
};

export type InventoryCapacityViewModel = {
  usedSlots: number;
  totalSlots: number;
};

export type InventoryViewModel = {
  items: InventoryItemViewModel[];
  capacity: InventoryCapacityViewModel;
};
