import { GlassPanel } from "@/components/visual";
import { RewardChip } from "@/components/visual/reward-chip";
import type { LeaderboardEntryViewModel } from "@/features/social/types/social.types";
import { cn } from "@/lib/utils";

type FriendsLeaderboardRowProps = {
  entry: LeaderboardEntryViewModel;
};

export function FriendsLeaderboardRow({ entry }: FriendsLeaderboardRowProps) {
  const initial = entry.displayName.charAt(0).toUpperCase();

  return (
    <GlassPanel
      className={cn(
        "flex items-center gap-3 p-3",
        entry.isCurrentUser && "ring-1 ring-primary/40",
        entry.rank <= 3 && "ring-1 ring-trail-glow/25",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body-sm font-bold",
          entry.rank === 1 && "bg-trail-glow/20 text-trail-glow",
          entry.rank === 2 && "bg-muted text-foreground",
          entry.rank === 3 && "bg-muted/80 text-muted-foreground",
          entry.rank > 3 && "bg-muted/50 text-muted-foreground",
        )}
        aria-hidden
      >
        {entry.rank}
      </span>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-body-sm font-semibold text-primary"
        aria-hidden
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-semibold">
          {entry.displayName}
          {entry.isCurrentUser ? (
            <span className="sr-only"> (you)</span>
          ) : null}
        </p>
        <p className="truncate text-caption text-muted-foreground">
          {entry.regionLabel}
        </p>
      </div>
      <RewardChip variant="xp" className="shrink-0">
        {entry.weeklyEp} EP
      </RewardChip>
    </GlassPanel>
  );
}
