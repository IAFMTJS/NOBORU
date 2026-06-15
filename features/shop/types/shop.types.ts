export type ShopCurrency = "gold" | "gems";

export type ShopItemCategory = "cosmetic" | "trail" | "consumable" | "seasonal";

export type ShopItemViewModel = {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  currency: ShopCurrency;
  price: number;
  iconLabel: string;
  owned: boolean;
  featured?: boolean;
};

export type ShopWalletViewModel = {
  gold: number;
  gems: number;
};

export type ShopCatalogViewModel = {
  items: ShopItemViewModel[];
  wallet: ShopWalletViewModel;
};

export type ShopPurchaseResult =
  | { success: true; itemName: string; catalog: ShopCatalogViewModel }
  | { success: false; error: string };
