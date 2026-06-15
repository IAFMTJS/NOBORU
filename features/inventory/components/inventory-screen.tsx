"use client";

import { useMemo, useState } from "react";

import { SceneImage } from "@/components/media/scene-image";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import {
  GlassPanel,
  IllustratedScreen,
  StoryTitle,
} from "@/components/visual";
import type {
  InventoryItemViewModel,
  InventoryViewModel,
} from "@/features/inventory/types/inventory.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type InventoryScreenProps = {
  inventory: InventoryViewModel;
};

type PouchSection = {
  id: "consumable" | "cosmetic" | "trail";
  label: string;
  sign: string;
  filter: (item: InventoryItemViewModel) => boolean;
};

const POUCH_SECTIONS: PouchSection[] = [
  {
    id: "consumable",
    label: "Trail rations",
    sign: "Items pouch",
    filter: (item) => item.category === "consumable",
  },
  {
    id: "cosmetic",
    label: "Travel charms",
    sign: "Cosmetics pouch",
    filter: (item) => item.category === "cosmetic",
  },
  {
    id: "trail",
    label: "Path keepsakes",
    sign: "Trails pouch",
    filter: (item) => item.category === "trail" || item.category === "seasonal",
  },
];

function InventoryItemToken({
  item,
  selected,
  onSelect,
}: {
  item: InventoryItemViewModel;
  selected: boolean;
  onSelect: () => void;
}) {
  const asset = INVENTORY_ITEM_ASSETS[item.assetKey];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-xl border px-2.5 py-2 text-center transition-all",
        selected
          ? "border-trail-glow/60 bg-trail-glow/15 shadow-[0_0_14px_hsl(var(--trail-glow)/0.22)]"
          : "border-white/12 bg-black/45 hover:border-trail-glow/30",
      )}
      aria-pressed={selected}
      aria-label={`${item.name}, quantity ${item.quantity}`}
    >
      <WorldArtImage
        asset={asset}
        alt=""
        width={40}
        height={40}
        className="drop-shadow-md"
      />
      <span className="text-caption tabular-nums text-white/75">×{item.quantity}</span>
      {item.equipped ? (
        <span className="text-[9px] font-semibold uppercase tracking-wide text-trail-glow">
          Worn
        </span>
      ) : null}
    </button>
  );
}

function PouchSectionBlock({
  section,
  items,
  selectedId,
  onSelect,
}: {
  section: PouchSection;
  items: InventoryItemViewModel[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <WorldArtImage
            asset={INVENTORY_ITEM_ASSETS.scroll}
            alt=""
            width={24}
            height={24}
            className="opacity-70"
          />
          <p className="font-story text-sm text-trail-glow/90">{section.sign}</p>
        </div>
        <YamaEmptyState
          surface="generic"
          title="Pouch awaits treasures"
          description="Hidden items may appear in this pouch as you climb and trade along the trail."
          className="rounded-2xl border border-dashed border-white/15 bg-black/30 p-2"
        />
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <WorldArtImage
            asset={INVENTORY_ITEM_ASSETS.scroll}
            alt=""
            width={24}
            height={24}
          />
          <div>
            <p className="font-story text-sm text-trail-glow">{section.sign}</p>
            <p className="text-caption text-muted-foreground">{section.label}</p>
          </div>
        </div>
        <span className="text-caption text-white/50">{items.length} stowed</span>
      </div>
      <div className="rounded-2xl border border-amber-900/25 bg-gradient-to-b from-amber-950/30 to-black/50 p-3 shadow-inner">
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {items.map((item) => (
            <InventoryItemToken
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              onSelect={() => onSelect(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function InventoryScreen({ inventory }: InventoryScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sectionsWithItems = useMemo(
    () =>
      POUCH_SECTIONS.map((section) => ({
        section,
        items: inventory.items.filter(section.filter),
      })),
    [inventory.items],
  );

  const selectedItem =
    inventory.items.find((item) => item.id === selectedId) ??
    inventory.items[0] ??
    null;

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
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/75"
          aria-hidden
        />

        <header className="relative z-10 shrink-0 p-4 pt-3">
          <GlassPanel variant="header" className="space-y-1 rounded-card p-3">
            <StoryTitle as="h1" className="text-base">
              Backpack
            </StoryTitle>
            <p className="text-caption text-muted-foreground">
              Pouches laid open — inspect what you carry on the climb
            </p>
          </GlassPanel>
        </header>

        <main className="relative z-10 flex-1 space-y-5 overflow-y-auto px-4 py-2">
          {inventory.items.length === 0 ? (
            <YamaEmptyState
              surface="generic"
              title="Pouches await discovery"
              description="Hidden treasures will appear in your pack as you trade with merchants and climb the trail."
              actionHref="/shop"
              actionLabel="Visit the merchant"
            />
          ) : (
            sectionsWithItems.map(({ section, items }) => (
              <PouchSectionBlock
                key={section.id}
                section={section}
                items={items}
                selectedId={selectedItem?.id ?? null}
                onSelect={setSelectedId}
              />
            ))
          )}
        </main>

        <footer className="relative z-10 shrink-0 p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-2">
          {selectedItem ? (
            <GlassPanel className="mx-auto max-w-md space-y-2 rounded-card p-4">
              <div className="flex items-center gap-3">
                <WorldArtImage
                  asset={INVENTORY_ITEM_ASSETS[selectedItem.assetKey]}
                  alt=""
                  width={52}
                  height={52}
                  className="drop-shadow-md"
                />
                <div className="min-w-0 space-y-0.5">
                  <p className="font-story text-sm text-trail-glow">{selectedItem.name}</p>
                  <p className="text-caption text-muted-foreground">
                    ×{selectedItem.quantity} in your pack
                  </p>
                </div>
              </div>
              <p className="text-body-sm text-muted-foreground">{selectedItem.description}</p>
            </GlassPanel>
          ) : (
            <GlassPanel className="mx-auto max-w-md rounded-card p-3 text-center">
              <p className="text-caption text-muted-foreground">
                Lift an item from a pouch to inspect your gear
              </p>
            </GlassPanel>
          )}
        </footer>
      </div>
    </IllustratedScreen>
  );
}
