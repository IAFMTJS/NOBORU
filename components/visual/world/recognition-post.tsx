import type { ReactNode } from "react";

import { RewardChip } from "@/components/visual/reward-chip";
import { cn } from "@/lib/utils";

type RecognitionPostProps = {
  rank?: number;
  displayName: string;
  titleLabel?: string;
  regionLabel?: string;
  achievementCount?: number;
  trailing?: ReactNode;
  highlight?: boolean;
  className?: string;
};

/** League hall recognition post — not a generic list row. */
export function RecognitionPost({
  rank,
  displayName,
  titleLabel,
  regionLabel,
  achievementCount,
  trailing,
  highlight = false,
  className,
}: RecognitionPostProps) {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-amber-900/30 bg-gradient-to-b from-amber-950/40 to-black/50 px-3 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]",
        highlight && "ring-1 ring-trail-glow/35",
        className,
      )}
    >
      {rank !== undefined ? (
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-body-sm font-bold",
            rank === 1 && "border-trail-glow/60 bg-trail-glow/15 text-trail-glow",
            rank === 2 && "border-white/20 bg-black/40 text-white",
            rank === 3 && "border-white/15 bg-black/35 text-white/80",
            rank > 3 && "border-white/10 bg-black/30 text-muted-foreground",
          )}
          aria-hidden
        >
          {rank}
        </span>
      ) : null}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-body-sm font-semibold text-primary"
        aria-hidden
      >
        {initial}
      </span>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate text-body-sm font-semibold">{displayName}</p>
        {titleLabel || regionLabel ? (
          <p className="truncate text-caption text-muted-foreground">
            {[titleLabel, regionLabel].filter(Boolean).join(" · ")}
          </p>
        ) : null}
        {achievementCount !== undefined ? (
          <p className="text-caption text-trail-glow/85">
            {achievementCount} shrine plaque{achievementCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
      {trailing ? (
        <div className="shrink-0 self-center">{trailing}</div>
      ) : typeof trailing === "undefined" && rank !== undefined ? (
        <RewardChip variant="xp" className="shrink-0 self-center">
          —
        </RewardChip>
      ) : null}
    </div>
  );
}
