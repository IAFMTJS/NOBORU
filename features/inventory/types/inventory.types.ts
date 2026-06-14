export type InventoryTab = "items" | "cosmetics" | "trails";

export type InventoryItemCategory = "consumable" | "cosmetic" | "trail" | "seasonal";

export type InventoryItemViewModel = {
  id: string;
  name: string;
  description: string;
  category: InventoryItemCategory;
  iconLabel: string;
  quantity: number;
  equipped?: boolean;
};

export type InventoryViewModel = {
  items: InventoryItemViewModel[];
};
