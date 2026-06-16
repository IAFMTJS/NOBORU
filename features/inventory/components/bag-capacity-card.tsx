"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type BagCapacityCardProps = {
  usedSlots: number;
  totalSlots: number;
  onUpgrade?: () => void;
};

export function BagCapacityCard({ usedSlots, totalSlots, onUpgrade }: BagCapacityCardProps) {
  const ratio = totalSlots > 0 ? Math.min(100, Math.round((usedSlots / totalSlots) * 100)) : 0;
  const nearFull = ratio >= 80;

  return (
    <div className="rounded-2xl border border-amber-900/35 bg-gradient-to-b from-stone-900/90 to-black/70 p-3">
      <div className="flex items-center justify-between">
        <p className="font-story text-sm text-amber-200">Backpack Capacity</p>
        <p className="text-caption text-white/80">
          {usedSlots} / {totalSlots}
        </p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className={cn(
            "h-2 rounded-full transition-all",
            nearFull ? "bg-primary" : "bg-amber-400",
          )}
          style={{ width: `${ratio}%` }}
          aria-hidden
        />
      </div>
      <p className="mt-2 text-caption text-muted-foreground">
        {nearFull
          ? "You're almost full. Upgrade your backpack or use consumables."
          : "You still have room for trail treasures."}
      </p>
      {nearFull ? (
        <Button
          type="button"
          className="mt-3 h-10 w-full rounded-xl"
          onClick={onUpgrade}
        >
          Upgrade Bag
        </Button>
      ) : null}
    </div>
  );
}
