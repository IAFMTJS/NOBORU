import type { CollectibleViewModel } from "@/features/collectibles/types/collectible.types";
import { cn } from "@/lib/utils";

type CollectibleGalleryProps = {
  collectibles: CollectibleViewModel[];
  className?: string;
};

const CATEGORY_EMOJI: Record<CollectibleViewModel["category"], string> = {
  lantern: "🏮",
  spirit: "✨",
  relic: "💎",
  scroll: "📜",
  token: "⛩",
  artifact: "🗿",
};

export function CollectibleGallery({
  collectibles,
  className,
}: CollectibleGalleryProps) {
  if (collectibles.length === 0) {
    return (
      <p className="text-body-sm text-muted-foreground">
        No collectibles in this region yet.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {collectibles.map((item) => (
        <div
          key={item.slug}
          className={cn(
            "flex flex-col items-center rounded-xl border p-3 text-center",
            item.earned
              ? "border-primary/30 bg-primary/5"
              : "border-border/50 bg-muted/30 opacity-50",
          )}
          title={item.name}
        >
          <span className="text-2xl" aria-hidden>
            {CATEGORY_EMOJI[item.category]}
          </span>
          <span className="mt-1 text-caption font-medium leading-tight">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
