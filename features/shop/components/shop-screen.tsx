"use client";

import Link from "next/link";
import { ArrowLeft, Coins, Gem } from "lucide-react";

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
        <div className="h-full bg-gradient-to-b from-background via-card/80 to-background" />
      }
    >
      <PageContainer className="space-y-5">
        <Link
          href="/world"
          className="inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
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
              <Coins className="h-3.5 w-3.5" aria-hidden />
              {wallet.gold.toLocaleString()}
            </RewardChip>
            <RewardChip variant="gem">
              <Gem className="h-3.5 w-3.5" aria-hidden />
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
