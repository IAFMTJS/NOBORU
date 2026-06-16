"use client";

import { Minus, Plus } from "lucide-react";

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import type { InventoryItemViewModel } from "@/features/inventory/types/inventory.types";
import { INVENTORY_ITEM_ASSETS } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type QuickUseSheetProps = {
  open: boolean;
  item: InventoryItemViewModel | null;
  quantity: number;
  onOpenChange: (open: boolean) => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onUse: () => void;
};

export function QuickUseSheet({
  open,
  item,
  quantity,
  onOpenChange,
  onDecrease,
  onIncrease,
  onUse,
}: QuickUseSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl border-amber-900/40 bg-gradient-to-b from-stone-900 to-black p-4"
      >
        <SheetHeader>
          <SheetTitle className="font-story text-amber-200">Quick Use</SheetTitle>
          <SheetDescription>
            Use consumables from your pouch without leaving the bag.
          </SheetDescription>
        </SheetHeader>

        {item ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 p-3">
              <WorldArtImage
                asset={INVENTORY_ITEM_ASSETS[item.assetKey]}
                alt=""
                width={48}
                height={48}
                className="drop-shadow-md"
              />
              <div className="min-w-0">
                <p className="font-story text-sm text-amber-200">{item.name}</p>
                <p className="text-caption text-muted-foreground">You own {item.quantity}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={onDecrease}
                aria-label="Decrease use amount"
              >
                <Minus />
              </Button>
              <div className="min-w-14 rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-center text-lg font-semibold tabular-nums text-white">
                {quantity}
              </div>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={onIncrease}
                aria-label="Increase use amount"
                className={cn(quantity >= item.quantity && "opacity-70")}
              >
                <Plus />
              </Button>
            </div>

            <Button type="button" className="h-11 w-full rounded-xl" onClick={onUse}>
              Use
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-caption text-muted-foreground">
            Select a consumable item first.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
