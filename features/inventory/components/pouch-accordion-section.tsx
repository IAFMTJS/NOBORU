"use client";

import { ChevronDown } from "lucide-react";

import { WorldArtImage } from "@/components/visual/art/world-art-image";
import { InventorySlotCard } from "@/features/inventory/components/inventory-slot-card";
import type { InventoryItemViewModel } from "@/features/inventory/types/inventory.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type PouchAccordionSectionProps = {
  title: string;
  subtitle: string;
  items: InventoryItemViewModel[];
  selectedId: string | null;
  expanded: boolean;
  onToggle: () => void;
  onSelectItem: (id: string) => void;
};

export function PouchAccordionSection({
  title,
  subtitle,
  items,
  selectedId,
  expanded,
  onToggle,
  onSelectItem,
}: PouchAccordionSectionProps) {
  return (
    <section className="material-pouch p-2">
      <button
        type="button"
        onClick={onToggle}
        className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <WorldArtImage
            asset={INVENTORY_ITEM_ASSETS.scroll}
            alt=""
            width={22}
            height={22}
            className="opacity-85"
          />
          <div>
            <p className="font-story text-sm uppercase tracking-wide text-amber-200">{title}</p>
            <p className="text-caption text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-white/70">{items.length} / 20 stored</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-amber-200/80 transition-transform",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </div>
      </button>

      {expanded ? (
        items.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 p-2">
            {items.map((item) => (
              <InventorySlotCard
                key={item.id}
                item={item}
                selected={selectedId === item.id}
                onSelect={() => onSelectItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/15 bg-black/35 p-3 text-center text-caption text-muted-foreground">
            This pouch is ready for new discoveries.
          </div>
        )
      ) : null}
    </section>
  );
}
