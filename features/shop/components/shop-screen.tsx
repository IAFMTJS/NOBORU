"use client";

import { useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import {
  GlassPanel,
  IllustratedScreen,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
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
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="shop_interior"
          alt="Trail merchant at a forest stall"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/80"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3">
          <GlassPanel variant="header" className="flex items-center justify-between gap-3 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              Trail Merchant
            </StoryTitle>
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
          </GlassPanel>
        </header>

        <main className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
          <section
            aria-labelledby="shop-goods-heading"
            className="relative mx-auto w-full max-w-lg"
          >
            <h2 id="shop-goods-heading" className="sr-only">
              Merchant goods on the counter
            </h2>

            <MerchantStand>
              <WorldDialogueBubble speaker="Noboru" className="mb-3">
                Welcome, traveler. I gathered these wares from the high trails — choose
                what will aid your climb.
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
                      className="w-full border-amber-900/30 bg-black/35"
                      onPurchase={handlePurchase}
                      purchasing={purchasing}
                    />
                  ))
                )}
              </div>
            </MerchantStand>
          </section>
        </main>
      </div>
    </IllustratedScreen>
  );
}
