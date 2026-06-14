import Link from "next/link";

import { cn } from "@/lib/utils";
import type { KanjiListEntry } from "@/features/kanji/types/kanji.types";

type KanjiListRowProps = {
  entry: KanjiListEntry;
  href: string;
};

export function KanjiListRow({ entry, href }: KanjiListRowProps) {
  const masteryPercent = entry.masteryPercent;

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-elevation-1 transition-colors hover:border-primary/30 hover:bg-accent/20"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary/80 font-japanese text-heading-2">
        {entry.character}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        {entry.readingSummary ? (
          <p className="truncate text-caption text-muted-foreground">
            {entry.readingSummary}
          </p>
        ) : null}
        <p className="truncate text-body-sm font-medium">{entry.meaning}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-caption font-medium text-primary">
          {masteryPercent}%
          <span className="text-xs opacity-70" aria-hidden>↗</span>
        </div>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border",
            entry.learned
              ? "border-success/40 bg-success/15 text-success"
              : "border-border bg-muted/40 text-muted-foreground",
          )}
          aria-label={entry.learned ? "Learned" : "Not yet learned"}
        >
          {entry.learned ? <span aria-hidden>✓</span> : null}
        </div>
      </div>
    </Link>
  );
}
