"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui";
import { GlassSurfacePanel } from "@/components/visual/primitives/glass-surface";
import { TabScene } from "@/components/visual/shells/viewport-background";
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
    <TabScene className="flex min-h-full flex-col pb-nav-clearance">
      <header className="shrink-0 p-4 pt-3">
        <GlassSurfacePanel variant="hud" className="flex items-center justify-between gap-3 px-3 py-2">
          <div>
            <h1 className="font-sans text-section-header font-semibold tracking-tight">Bag</h1>
            <p className="text-caption text-muted-foreground">
              {viewModel.items.length} items · pouches on the trail
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-xl px-3 text-xs"
            onClick={handleQuickUseOpen}
          >
            Quick Use
          </Button>
        </GlassSurfacePanel>
      </header>

      <main className="flex-1 space-y-4 overflow-y-auto px-4 py-2">
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

      <footer className="shrink-0 p-4 pt-2">
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
    </TabScene>
  );
}
