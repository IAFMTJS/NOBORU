import { GlassPanel } from "@/components/visual";
import { UiIconImage } from "@/components/media/ui-icon-image";
import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { RewardChip } from "@/components/visual/reward-chip";
import { Badge } from "@/components/ui/badge";
import type { ShopItemViewModel } from "@/features/shop/types/shop.types";
import { cn } from "@/lib/utils";

type ShopItemCardProps = {
  item: ShopItemViewModel;
  className?: string;
  onPurchase?: (itemId: string) => void;
  purchasing?: boolean;
};

export function ShopItemCard({
  item,
  className,
  onPurchase,
  purchasing = false,
}: ShopItemCardProps) {
  const canBuy = !item.owned && onPurchase;

  return (
    <GlassPanel
      className={cn(
        "flex flex-col gap-2 p-3 motion-reward",
        item.featured && "ring-1 ring-trail-glow/30",
        item.owned && "opacity-75",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary/10 text-xl"
          aria-hidden
        >
          {item.iconLabel}
        </span>
        {item.owned ? (
          <Badge variant="secondary" className="text-caption">
            In pack
          </Badge>
        ) : item.featured ? (
          <Badge className="bg-trail-glow/20 text-trail-glow">Featured</Badge>
        ) : null}
      </div>
      <div className="space-y-0.5">
        <p className="text-body-sm font-semibold">{item.name}</p>
        <p className="line-clamp-2 text-caption text-muted-foreground">
          {item.description}
        </p>
      </div>
      {canBuy ? (
        <>
          <RewardChip
            variant={item.currency === "gems" ? "gem" : "xp"}
            className="w-fit"
          >
            {item.currency === "gems" ? (
              <UiIconImage name="gem" size={14} />
            ) : (
              <UiIconImage name="coins" size={14} />
            )}
            {item.price.toLocaleString()}
          </RewardChip>
          <PrimaryClimbButton
            size="sm"
            className="mt-auto w-full motion-button"
            disabled={purchasing}
            onClick={() => onPurchase(item.id)}
          >
            Take it
          </PrimaryClimbButton>
        </>
      ) : (
        <span className="mt-auto text-caption text-muted-foreground">
          {item.owned ? "Stowed in your backpack" : "Unavailable"}
        </span>
      )}
    </GlassPanel>
  );
}
