import { GlassPanel } from "@/components/visual";
import type { MemoryBookEntryViewModel } from "@/features/memory-book/types/memory-book.types";

type MemoryBookEntryProps = {
  entry: MemoryBookEntryViewModel;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function MemoryBookEntry({ entry }: MemoryBookEntryProps) {
  return (
    <GlassPanel className="relative overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-trail-glow/5 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative flex gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius)] border border-border/60 bg-card/60 font-story text-lg"
          aria-hidden
        >
          {entry.iconLabel}
        </span>
        <div className="min-w-0 space-y-1">
          <time dateTime={entry.occurredAt} className="text-caption text-muted-foreground">
            {formatDate(entry.occurredAt)}
          </time>
          <p className="text-body-sm font-semibold">{entry.title}</p>
          <p className="text-caption text-muted-foreground">{entry.description}</p>
        </div>
      </div>
    </GlassPanel>
  );
}
