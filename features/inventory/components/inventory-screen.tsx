"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { Button } from "@/components/ui";
import { GlassPanel, IllustratedScreen, StoryTitle } from "@/components/visual";
import { BagCapacityCard } from "@/features/inventory/components/bag-capacity-card";
import { InventoryDetailCard } from "@/features/inventory/components/inventory-detail-card";
import { PouchAccordionSection } from "@/features/inventory/components/pouch-accordion-section";
import { QuickUseSheet } from "@/features/inventory/components/quick-use-sheet";
import { inventoryService } from "@/features/inventory/services/inventory.service";
import type {
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";

type InventoryScreenProps = {
  inventory: InventoryViewModel;
};

type PouchSection = {
  id: "items" | "cosmetics" | "trails";
  label: string;
  subtitle: string;
  filter: (item: InventoryItemViewModel) => boolean;
};

const POUCH_SECTIONS: PouchSection[] = [
  {
    id: "items",
    label: "Items Pouch",
    subtitle: "Trail rations and key items",
    filter: (item) => item.category === "consumable",
  },
  {
    id: "cosmetics",
    label: "Cosmetics Pouch",
    subtitle: "Travel charms and keepsakes",
    filter: (item) => item.category === "cosmetic",
  },
  {
    id: "trails",
    label: "Trails Pouch",
    subtitle: "Path effects and milestones",
    filter: (item) => item.category === "trail" || item.category === "seasonal",
  },
];

export function InventoryScreen({ inventory }: InventoryScreenProps) {
  const [viewModel, setViewModel] = useState<InventoryViewModel>(inventory);
  const [selectedId, setSelectedId] = useState<string | null>(inventory.items[0]?.id ?? null);
  const [expandedSections, setExpandedSections] = useState<Record<PouchSection["id"], boolean>>({
    items: true,
    cosmetics: false,
    trails: false,
  });
  const [quickUseOpen, setQuickUseOpen] = useState(false);
  const [quickUseQuantity, setQuickUseQuantity] = useState(1);

  const sectionsWithItems = useMemo(
    () =>
      POUCH_SECTIONS.map((section) => ({
        section,
        items: viewModel.items.filter(section.filter),
      })),
    [viewModel.items],
  );

  useEffect(() => {
    inventoryService.hydrate(inventory);
    setViewModel(inventory);
    setSelectedId(inventory.items[0]?.id ?? null);
  }, [inventory]);

  const refreshFromService = useCallback((preferredId?: string | null) => {
    const next = inventoryService.getInventory();
    setViewModel(next);
    setSelectedId((currentId) => {
      const target = preferredId ?? currentId;
      if (target && next.items.some((item) => item.id === target)) return target;
      return next.items[0]?.id ?? null;
    });
  }, []);

  const selectedItem =
    viewModel.items.find((item) => item.id === selectedId) ??
    viewModel.items[0] ??
    null;

  const quickUseItem = selectedItem?.usable ? selectedItem : null;
  const nearCapacity = viewModel.capacity.usedSlots / viewModel.capacity.totalSlots >= 0.8;

  function toggleSection(sectionId: PouchSection["id"]) {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }

  function handleQuickUseOpen() {
    const firstQuickItem = inventoryService.getQuickUseItems()[0] ?? null;
    const nextSelectedId = quickUseItem?.id ?? firstQuickItem?.id ?? selectedItem?.id ?? null;
    if (nextSelectedId) setSelectedId(nextSelectedId);
    setQuickUseQuantity(1);
    setQuickUseOpen(true);
  }

  function useOne(item: InventoryItemViewModel | null) {
    if (!item) return;
    const used = inventoryService.useItem(item.id, 1);
    if (used) refreshFromService(item.id);
  }

  function toggleEquip(item: InventoryItemViewModel | null) {
    if (!item) return;
    const toggled = inventoryService.toggleEquip(item.id);
    if (toggled) refreshFromService(item.id);
  }

  function useMultiple(item: InventoryItemViewModel | null, amount: number) {
    if (!item) return;
    const used = inventoryService.useItem(item.id, amount);
    if (used) {
      refreshFromService(item.id);
      setQuickUseOpen(false);
      setQuickUseQuantity(1);
    }
  }

  return (
    <IllustratedScreen
      scrim="none"
      className="min-h-dvh"
      background={
        <SceneImage
          scene="inventory_backpack"
          alt="Open travel backpack on the trail"
          className="absolute inset-0 min-h-dvh rounded-none"
          priority
        />
      }
    >
      <div className="relative flex min-h-dvh flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/85"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3">
          <GlassPanel
            variant="header"
            className="space-y-2 rounded-card border-amber-900/40 bg-black/65 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <StoryTitle as="h1" className="text-base uppercase tracking-wide text-amber-200">
                  Backpack
                </StoryTitle>
                <p className="text-caption text-muted-foreground">
                  Pouches laid open - inspect what you carry on the climb
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-xl border border-white/10 bg-black/50 px-3 text-xs"
                onClick={handleQuickUseOpen}
              >
                Quick Use
              </Button>
            </div>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-2">
          {viewModel.items.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Pouches await discovery"
              description="Hidden treasures will appear in your pack as you trade with merchants and climb the trail."
              actionHref="/shop"
              actionLabel="Visit the merchant"
            />
          ) : (
            <>
              {sectionsWithItems.map(({ section, items }) => (
                <PouchAccordionSection
                  key={section.id}
                  title={section.label}
                  subtitle={section.subtitle}
                  items={items}
                  selectedId={selectedItem?.id ?? null}
                  expanded={expandedSections[section.id]}
                  onToggle={() => toggleSection(section.id)}
                  onSelectItem={setSelectedId}
                />
              ))}
              <BagCapacityCard
                usedSlots={viewModel.capacity.usedSlots}
                totalSlots={viewModel.capacity.totalSlots}
              />
            </>
          )}
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          <InventoryDetailCard
            item={selectedItem}
            onUse={() => useOne(selectedItem)}
            onUseMultiple={handleQuickUseOpen}
            onToggleEquip={() => toggleEquip(selectedItem)}
          />
        </footer>

        {nearCapacity ? (
          <div
            className="pointer-events-none absolute right-4 top-[5.5rem] z-20 rounded-lg border border-primary/30 bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary"
            aria-hidden
          >
            Almost Full
          </div>
        ) : null}
      </div>

      <QuickUseSheet
        open={quickUseOpen}
        item={quickUseItem}
        quantity={quickUseQuantity}
        onOpenChange={setQuickUseOpen}
        onDecrease={() => setQuickUseQuantity((quantity) => Math.max(1, quantity - 1))}
        onIncrease={() =>
          setQuickUseQuantity((quantity) =>
            Math.min(quickUseItem?.quantity ?? quantity, quantity + 1),
          )
        }
        onUse={() => useMultiple(quickUseItem, quickUseQuantity)}
      />
    </IllustratedScreen>
  );
}
