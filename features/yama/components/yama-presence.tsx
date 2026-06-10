import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import type { YamaPresenceViewModel, YamaSize } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type YamaPresenceProps = {
  presence: YamaPresenceViewModel;
  size?: YamaSize;
  layout?: "horizontal" | "vertical";
  className?: string;
  bubbleClassName?: string;
  priority?: boolean;
};

export function YamaPresence({
  presence,
  size = "md",
  layout = "horizontal",
  className,
  bubbleClassName,
  priority,
}: YamaPresenceProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        layout === "vertical" ? "flex-col items-center text-center" : "items-start",
        className,
      )}
      aria-label={presence.ariaLabel}
    >
      <YamaAvatar
        expression={presence.expression}
        size={size}
        alt=""
        priority={priority}
      />
      <p
        className={cn(
          "rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-body-sm text-foreground",
          layout === "vertical" ? "max-w-xs" : "min-w-0 flex-1",
          bubbleClassName,
        )}
      >
        {presence.message}
      </p>
    </div>
  );
}
