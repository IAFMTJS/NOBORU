import { GlassPanel } from "@/components/visual";
import type { MemoryBookEntryViewModel } from "@/features/memory-book/types/memory-book.types";
import { cn } from "@/lib/utils";

type MemoryBookEntryProps = {
  entry: MemoryBookEntryViewModel;
  variant?: "panel" | "page";
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function MemoryBookEntry({ entry, variant = "panel" }: MemoryBookEntryProps) {
  const content = (
    <div className="relative flex gap-3 px-2 py-3">
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center font-story text-lg",
          variant === "page"
            ? "rounded-full border border-amber-200/20 bg-amber-950/30"
            : "rounded-[var(--radius)] border border-white/12 bg-black/40",
        )}
        aria-hidden
      >
        {entry.iconLabel}
      </span>
      <div className="min-w-0 space-y-1">
        <time dateTime={entry.occurredAt} className="text-caption text-muted-foreground">
          {formatDate(entry.occurredAt)}
        </time>
        <p className={cn("font-semibold", variant === "page" ? "font-story text-sm" : "text-body-sm")}>
          {entry.title}
        </p>
        <p className="text-caption text-muted-foreground">{entry.description}</p>
      </div>
    </div>
  );

  if (variant === "page") {
    return content;
  }

  return (
    <GlassPanel className="relative overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-trail-glow/5 via-transparent to-transparent"
        aria-hidden
      />
      {content}
    </GlassPanel>
  );
}
