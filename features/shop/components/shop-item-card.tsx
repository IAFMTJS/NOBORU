import { Gem, Coins } from "lucide-react";

import { GlassPanel } from "@/components/visual";
import { RewardChip } from "@/components/visual/reward-chip";
import { Badge } from "@/components/ui/badge";
import type { ShopItemViewModel } from "@/features/shop/types/shop.types";
import { cn } from "@/lib/utils";

type ShopItemCardProps = {
  item: ShopItemViewModel;
  className?: string;
};

export function ShopItemCard({ item, className }: ShopItemCardProps) {
  const affordable = !item.owned;

  return (
    <GlassPanel
      className={cn(
        "flex flex-col gap-2 p-3",
        item.featured && "ring-1 ring-trail-glow/30",
        item.owned && "opacity-70",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-muted/40 text-xl"
          aria-hidden
        >
          {item.iconLabel}
        </span>
        {item.owned ? (
          <Badge variant="secondary" className="text-caption">
            Owned
          </Badge>
        ) : item.featured ? (
          <Badge className="bg-trail-glow/20 text-trail-glow">Featured</Badge>
        ) : null}
      </div>
      <div className="space-y-0.5">
        <p className="text-body-sm font-semibold">{item.name}</p>
        <p className="text-caption text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
      {affordable ? (
        <RewardChip
          variant={item.currency === "gems" ? "gem" : "xp"}
          className="mt-auto w-fit"
        >
          {item.currency === "gems" ? (
            <Gem className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Coins className="h-3.5 w-3.5" aria-hidden />
          )}
          {item.price.toLocaleString()}
        </RewardChip>
      ) : (
        <span className="mt-auto text-caption text-muted-foreground">In inventory</span>
      )}
    </GlassPanel>
  );
}
