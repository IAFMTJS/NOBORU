import { createClient } from "@/lib/supabase/server";

export type ShopItemRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  currency: "gold" | "gems";
  price: number;
  icon_label: string;
  collectible_slug: string | null;
  companion_outfit_slug: string | null;
  featured: boolean;
  sort_order: number;
};

export type UserShopPurchaseRow = {
  shop_item_id: string;
  gold_spent: number;
  gems_spent: number;
  purchased_at: string;
};

class ShopRepository {
  async listPublishedItems(): Promise<ShopItemRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("shop_items")
      .select(
        "id, name, description, category, currency, price, icon_label, collectible_slug, companion_outfit_slug, featured, sort_order",
      )
      .eq("status", "published")
      .order("sort_order");

    if (error) throw new Error(error.message);
    return (data ?? []) as ShopItemRow[];
  }

  async listUserPurchases(userId: string): Promise<UserShopPurchaseRow[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_shop_purchases")
      .select("shop_item_id, gold_spent, gems_spent, purchased_at")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return (data ?? []) as UserShopPurchaseRow[];
  }

  async countUserChestClaims(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("user_chest_claims")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  async recordPurchase(input: {
    userId: string;
    shopItemId: string;
    goldSpent: number;
    gemsSpent: number;
  }): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("user_shop_purchases").insert({
      user_id: input.userId,
      shop_item_id: input.shopItemId,
      gold_spent: input.goldSpent,
      gems_spent: input.gemsSpent,
    });

    if (error) throw new Error(error.message);
  }
}

export const shopRepository = new ShopRepository();
