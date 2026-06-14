"use client";

import Link from "next/link";

import { SceneImage } from "@/components/media/scene-image";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { PageContainer } from "@/components/layout/page-container";
import {
  GlassPanel,
  IllustratedScreen,
  PrimaryClimbButton,
  RewardChip,
  StoryTitle,
} from "@/components/visual";
import { ShopItemCard } from "@/features/shop/components/shop-item-card";
import type { ShopCatalogViewModel } from "@/features/shop/types/shop.types";

type ShopScreenProps = {
  catalog: ShopCatalogViewModel;
};

export function ShopScreen({ catalog }: ShopScreenProps) {
  const { wallet, items } = catalog;

  return (
    <IllustratedScreen
      scrim="full"
      background={
        <SceneImage scene="shop_interior" alt="" className="absolute inset-0 min-h-dvh rounded-none" />
      }
    >
      <PageContainer className="space-y-5">
        <Link
          href="/world"
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <UiIconImage name="map" size={16} />
          World
        </Link>

        <header className="space-y-2">
          <StoryTitle as="h1">Trail Shop</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Cosmetics and trail skins — earned, never required to learn.
          </p>
        </header>

        <GlassPanel variant="header" className="flex items-center justify-between gap-3 p-4">
          <span className="text-caption text-muted-foreground">Your balance</span>
          <div className="flex flex-wrap items-center gap-2">
            <RewardChip variant="xp">
              <UiIconImage name="trophy" size={14} />
              {wallet.gold.toLocaleString()}
            </RewardChip>
            <RewardChip variant="gem">
              <UiIconImage name="gem" size={14} />
              {wallet.gems}
            </RewardChip>
          </div>
        </GlassPanel>

        <section aria-labelledby="shop-grid-heading">
          <h2 id="shop-grid-heading" className="sr-only">
            Shop items
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <PrimaryClimbButton disabled aria-disabled="true">
          Browse featured — purchases coming soon
        </PrimaryClimbButton>
      </PageContainer>
    </IllustratedScreen>
  );
}
