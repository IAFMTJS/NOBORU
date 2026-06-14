"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  GlassPanel,
  IllustratedScreen,
  StoryTitle,
} from "@/components/visual";
import type {
  InventoryItemViewModel,
  InventoryTab,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";
import { cn } from "@/lib/utils";

type InventoryScreenProps = {
  inventory: InventoryViewModel;
};

const TABS: Array<{ id: InventoryTab; label: string }> = [
  { id: "items", label: "Items" },
  { id: "cosmetics", label: "Cosmetics" },
  { id: "trails", label: "Trails" },
];

function tabMatchesItem(tab: InventoryTab, item: InventoryItemViewModel): boolean {
  if (tab === "items") return item.category === "consumable";
  if (tab === "cosmetics") return item.category === "cosmetic";
  return item.category === "trail" || item.category === "seasonal";
}

function InventoryItemCell({
  item,
  selected,
  onSelect,
}: {
  item: InventoryItemViewModel;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors",
        selected
          ? "border-trail-glow/50 bg-trail-glow/10"
          : "border-glass-border bg-background/30 hover:bg-background/50",
      )}
      aria-pressed={selected}
      aria-label={`${item.name}, quantity ${item.quantity}`}
    >
      <span className="text-3xl" aria-hidden>
        {item.iconLabel}
      </span>
      <span className="text-caption tabular-nums text-muted-foreground">
        ×{item.quantity}
      </span>
      {item.equipped ? (
        <span className="text-caption text-trail-glow">Equipped</span>
      ) : null}
    </button>
  );
}

export function InventoryScreen({ inventory }: InventoryScreenProps) {
  const [activeTab, setActiveTab] = useState<InventoryTab>("items");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredItems = useMemo(
    () => inventory.items.filter((item) => tabMatchesItem(activeTab, item)),
    [inventory.items, activeTab],
  );

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null;

  return (
    <IllustratedScreen
      scrim="full"
      background={
        <div className="h-full bg-gradient-to-b from-background via-card/70 to-background" />
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

        <header className="space-y-1">
          <StoryTitle as="h1">Backpack</StoryTitle>
          <p className="text-body-sm text-muted-foreground">
            Items, cosmetics, and trail skins for your climb.
          </p>
        </header>

        <div
          className="flex gap-1 rounded-full border border-glass-border bg-background/40 p-1"
          role="tablist"
          aria-label="Inventory categories"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedId(null);
              }}
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-caption font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-4 gap-2"
          role="tabpanel"
          aria-label={`${activeTab} inventory`}
        >
          {filteredItems.map((item) => (
            <InventoryItemCell
              key={item.id}
              item={item}
              selected={selectedItem?.id === item.id}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <GlassPanel className="p-4 text-center">
            <p className="text-body-sm text-muted-foreground">
              Nothing in this tab yet. Earn rewards on the trail.
            </p>
          </GlassPanel>
        ) : null}

        {selectedItem ? (
          <GlassPanel className="space-y-2 p-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                {selectedItem.iconLabel}
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="text-body font-medium">{selectedItem.name}</p>
                <p className="text-caption text-muted-foreground">
                  Quantity ×{selectedItem.quantity}
                </p>
              </div>
            </div>
            <p className="text-body-sm text-muted-foreground">
              {selectedItem.description}
            </p>
          </GlassPanel>
        ) : null}
      </PageContainer>
    </IllustratedScreen>
  );
}
