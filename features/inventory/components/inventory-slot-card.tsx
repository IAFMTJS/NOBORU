"use client";

import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type { InventoryItemViewModel } from "@/features/inventory/types/inventory.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type InventorySlotCardProps = {
  item: InventoryItemViewModel;
  selected: boolean;
  onSelect: () => void;
};

function rarityClass(rarity: InventoryItemViewModel["rarity"]): string {
  switch (rarity) {
    case "legendary":
      return "border-amber-300/55";
    case "epic":
      return "border-fuchsia-300/45";
    case "rare":
      return "border-sky-300/45";
    case "uncommon":
      return "border-emerald-300/40";
    default:
      return "border-white/15";
  }
}

export function InventorySlotCard({ item, selected, onSelect }: InventorySlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative h-20 rounded-xl border bg-black/45 p-2 text-left transition-all",
        rarityClass(item.rarity),
        selected
          ? "border-amber-300/75 bg-amber-900/20 shadow-[0_0_20px_rgba(246,174,45,0.2)]"
          : "hover:border-amber-300/45 hover:bg-amber-950/15",
      )}
      aria-pressed={selected}
      aria-label={`${item.name}, quantity ${item.quantity}`}
    >
      <div className="absolute right-2 top-2 rounded-md border border-black/30 bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-white/85">
        x{item.quantity}
      </div>
      <div className="flex h-full items-center justify-center">
        <WorldArtImage
          asset={INVENTORY_ITEM_ASSETS[item.assetKey]}
          alt=""
          width={42}
          height={42}
          className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-105"
        />
      </div>
      {item.equipped ? (
        <span className="absolute bottom-2 left-2 rounded-md border border-amber-300/40 bg-amber-950/70 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-200">
          Worn
        </span>
      ) : null}
    </button>
  );
}
