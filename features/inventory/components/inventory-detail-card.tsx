"use client";

import { Button } from "@/components/ui";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type { InventoryItemViewModel } from "@/features/inventory/types/inventory.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";

type InventoryDetailCardProps = {
  item: InventoryItemViewModel | null;
  onUse: () => void;
  onUseMultiple: () => void;
  onToggleEquip: () => void;
};

function toRarityLabel(rarity: InventoryItemViewModel["rarity"]): string {
  if (!rarity) return "Common";
  return `${rarity.charAt(0).toUpperCase()}${rarity.slice(1)}`;
}

export function InventoryDetailCard({
  item,
  onUse,
  onUseMultiple,
  onToggleEquip,
}: InventoryDetailCardProps) {
  if (!item) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/60 p-3 text-center text-caption text-muted-foreground">
        Select an item to inspect details and actions.
      </div>
    );
  }

  const canUse = Boolean(item.usable);
  const canUseMultiple = canUse && Boolean(item.stackable) && item.quantity > 1;

  return (
    <div className="rounded-2xl border border-amber-900/45 bg-gradient-to-b from-stone-900/95 to-black/80 p-3 shadow-[inset_0_1px_0_rgba(246,174,45,0.08)]">
      <div className="flex items-center gap-3">
        <WorldArtImage
          asset={INVENTORY_ITEM_ASSETS[item.assetKey]}
          alt=""
          width={56}
          height={56}
          className="drop-shadow-md"
        />
        <div className="min-w-0 flex-1">
          <p className="font-story text-sm text-amber-200">{item.name}</p>
          <p className="text-caption text-muted-foreground">{toRarityLabel(item.rarity)}</p>
          <p className="text-caption text-white/75">You own {item.quantity}</p>
        </div>
      </div>

      <p className="mt-3 text-body-sm text-muted-foreground">{item.description}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {canUse ? (
          <>
            <Button type="button" className="h-10 rounded-xl" onClick={onUse}>
              Use
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-10 rounded-xl"
              onClick={onUseMultiple}
              disabled={!canUseMultiple}
            >
              Use Multiple
            </Button>
          </>
        ) : (
          <>
            <Button type="button" className="h-10 rounded-xl" onClick={onToggleEquip}>
              {item.equipped ? "Unequip" : "Equip"}
            </Button>
            <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black/40 text-caption text-muted-foreground">
              {item.equipped ? "Currently worn" : "Not worn"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
