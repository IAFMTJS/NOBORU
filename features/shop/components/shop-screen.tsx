"use client";

import { useState } from "react";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { RewardChip } from "@/components/visual";
import { SecondaryScreenShell } from "@/components/visual/shells/secondary-screen-shell";
import { MerchantStand } from "@/components/visual/world/merchant-stand";
import { WorldDialogueBubble } from "@/components/visual/world-dialogue-bubble";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { ShopItemCard } from "@/features/shop/components/shop-item-card";
import { shopService } from "@/features/shop/services/shop.service";
import type { ShopCatalogViewModel } from "@/features/shop/types/shop.types";

type ShopScreenProps = {
  catalog: ShopCatalogViewModel;
};

export function ShopScreen({ catalog: initialCatalog }: ShopScreenProps) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [purchasing, setPurchasing] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const { wallet, items } = catalog;

  function handlePurchase(itemId: string) {
    setPurchasing(true);
    setFeedback(null);
    const result = shopService.purchase(itemId);
    setPurchasing(false);

    if (result.success) {
      setCatalog(result.catalog);
      setFeedback({
        tone: "success",
        message: `${result.itemName} is yours — stowed in your backpack.`,
      });
      return;
    }

    setFeedback({ tone: "error", message: result.error });
  }

  return (
    <SecondaryScreenShell
      title="Trail Merchant"
      backHref="/camp"
      backLabel="Camp"
      headerAction={
        <div className="flex flex-wrap items-center gap-2">
          <RewardChip variant="xp">
            <UiIconImage name="coins" size={14} />
            {wallet.gold.toLocaleString()}
          </RewardChip>
          <RewardChip variant="gem">
            <UiIconImage name="gem" size={14} />
            {wallet.gems}
          </RewardChip>
        </div>
      }
      contentClassName="flex flex-col justify-end pb-4"
    >
      <section aria-labelledby="shop-goods-heading" className="relative mx-auto w-full max-w-lg">
        <h2 id="shop-goods-heading" className="sr-only">
          Merchant goods on the counter
        </h2>

        <MerchantStand>
          <WorldDialogueBubble speaker="Noboru" className="mb-3">
            Welcome, traveler. I gathered these wares from the high trails — choose what will aid
            your climb.
          </WorldDialogueBubble>

          {feedback ? (
            <p
              role="status"
              className={
                feedback.tone === "success"
                  ? "mb-3 text-center text-caption text-trail-glow"
                  : "mb-3 text-center text-caption text-destructive"
              }
            >
              {feedback.message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            {items.length === 0 ? (
              <YamaEmptyState
                surface="generic"
                title="Wares await discovery"
                description="The merchant's counter will fill as new trails open and seasons turn."
                actionHref="/camp"
                actionLabel="Return to camp"
              />
            ) : (
              items.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  onPurchase={handlePurchase}
                  purchasing={purchasing}
                />
              ))
            )}
          </div>
        </MerchantStand>
      </section>
    </SecondaryScreenShell>
  );
}
