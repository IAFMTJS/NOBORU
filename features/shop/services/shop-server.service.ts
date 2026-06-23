import { collectibleService } from "@/features/collectibles/services/collectible.service";
import { elevationService } from "@/features/elevation/services/elevation.service";
import { shopRepository } from "@/features/shop/repositories/shop.repository";
import type {
  ShopCatalogViewModel,
  ShopItemViewModel,
  ShopPurchaseResult,
} from "@/features/shop/types/shop.types";

/** Spendable gold = floor(total EP / 10) minus gold already spent at the merchant. */
export function deriveGoldWallet(totalEp: number, goldSpent: number): number {
  return Math.max(0, Math.floor(totalEp / 10) - goldSpent);
}

/** Spendable gems = floor(chest claims / 2) + floor(level / 10) minus gems spent. */
export function deriveGemWallet(
  chestClaims: number,
  level: number,
  gemsSpent: number,
): number {
  return Math.max(0, Math.floor(chestClaims / 2) + Math.floor(level / 10) - gemsSpent);
}

class ShopServerService {
  async getCatalog(userId: string): Promise<ShopCatalogViewModel> {
    const [items, purchases, elevation, chestClaims] = await Promise.all([
      shopRepository.listPublishedItems(),
      shopRepository.listUserPurchases(userId),
      elevationService.getSummary(userId),
      shopRepository.countUserChestClaims(userId),
    ]);

    const purchasedIds = new Set(purchases.map((row) => row.shop_item_id));
    const goldSpent = purchases.reduce((sum, row) => sum + row.gold_spent, 0);
    const gemsSpent = purchases.reduce((sum, row) => sum + row.gems_spent, 0);

    const viewItems: ShopItemViewModel[] = items.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category as ShopItemViewModel["category"],
      currency: row.currency,
      price: row.price,
      iconLabel: row.icon_label,
      owned: purchasedIds.has(row.id),
      featured: row.featured,
    }));

    return {
      wallet: {
        gold: deriveGoldWallet(elevation.totalEp, goldSpent),
        gems: deriveGemWallet(chestClaims, elevation.currentLevel, gemsSpent),
      },
      items: viewItems,
    };
  }

  async purchase(userId: string, itemId: string): Promise<ShopPurchaseResult> {
    const [items, purchases, elevation, chestClaims] = await Promise.all([
      shopRepository.listPublishedItems(),
      shopRepository.listUserPurchases(userId),
      elevationService.getSummary(userId),
      shopRepository.countUserChestClaims(userId),
    ]);

    const item = items.find((entry) => entry.id === itemId);
    if (!item) {
      return { success: false, error: "The merchant does not carry that ware." };
    }

    if (purchases.some((row) => row.shop_item_id === itemId)) {
      return { success: false, error: "You already carry this on the trail." };
    }

    const goldSpent = purchases.reduce((sum, row) => sum + row.gold_spent, 0);
    const gemsSpent = purchases.reduce((sum, row) => sum + row.gems_spent, 0);
    const goldAvailable = deriveGoldWallet(elevation.totalEp, goldSpent);
    const gemsAvailable = deriveGemWallet(
      chestClaims,
      elevation.currentLevel,
      gemsSpent,
    );

    if (item.currency === "gold" && goldAvailable < item.price) {
      return { success: false, error: "Not enough gold — earn more on the trail." };
    }
    if (item.currency === "gems" && gemsAvailable < item.price) {
      return { success: false, error: "Not enough gems for this treasure." };
    }

    await shopRepository.recordPurchase({
      userId,
      shopItemId: item.id,
      goldSpent: item.currency === "gold" ? item.price : 0,
      gemsSpent: item.currency === "gems" ? item.price : 0,
    });

    if (item.collectible_slug) {
      await collectibleService.grantBySlug(
        userId,
        item.collectible_slug,
        "event",
        `shop:${item.id}`,
      );
    }

    const catalog = await this.getCatalog(userId);
    return { success: true, itemName: item.name, catalog };
  }
}

export const shopServerService = new ShopServerService();
