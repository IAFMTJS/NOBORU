import { cn } from "@/lib/utils";

type WorldTreeCurrentNodeBadgeProps = {
  label: string;
  className?: string;
};

/** Floating callout for the active lesson node on the World Tree. */
export function WorldTreeCurrentNodeBadge({
  label,
  className,
}: WorldTreeCurrentNodeBadgeProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-9 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-0.5",
        className,
      )}
    >
      <span className="rounded-full border border-trail-glow/50 bg-black/75 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-trail-glow shadow-[0_0_12px_hsl(var(--trail-glow)/0.35)] backdrop-blur-sm">
        Next
      </span>
      <span className="max-w-[9rem] truncate text-center font-sans text-[10px] font-medium text-foreground/90">
        {label}
      </span>
      <span
        className="h-2 w-2 rotate-45 border-b border-r border-trail-glow/40 bg-black/75"
        aria-hidden
      />
    </div>
  );
}
