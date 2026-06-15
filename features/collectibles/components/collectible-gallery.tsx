import type { CollectibleViewModel } from "@/features/collectibles/types/collectible.types";
import { YamaEmptyState } from "@/features/yama/components/yama-empty-state";
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

function MuseumPedestal({ item }: { item: CollectibleViewModel }) {
  return (
    <div
      className={cn(
        "flex w-[6.5rem] shrink-0 flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center",
        item.earned
          ? "border-trail-glow/30 bg-black/40 shadow-[0_4px_14px_rgba(0,0,0,0.35)]"
          : "border-dashed border-white/15 bg-black/25 opacity-75",
      )}
      title={item.name}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border bg-black/45 text-2xl",
          item.earned ? "border-trail-glow/25" : "border-white/10",
        )}
        aria-hidden
      >
        {CATEGORY_EMOJI[item.category]}
      </span>
      <span className="line-clamp-2 text-caption font-medium leading-tight">
        {item.earned ? item.name : "???"}
      </span>
    </div>
  );
}

export function CollectibleGallery({
  collectibles,
  className,
}: CollectibleGalleryProps) {
  if (collectibles.length === 0) {
    return (
      <YamaEmptyState
        surface="generic"
        title="Artifacts await discovery"
        description="Hidden treasures remain in this region. Continue exploring the trail."
      />
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="list"
      aria-label="Artifact museum display"
    >
      {collectibles.map((item) => (
        <div key={item.slug} role="listitem">
          <MuseumPedestal item={item} />
        </div>
      ))}
    </div>
  );
}
