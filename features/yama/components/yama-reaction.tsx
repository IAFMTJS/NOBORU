import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import type { YamaPresenceViewModel } from "@/features/yama/types/yama.types";
import { cn } from "@/lib/utils";

type YamaReactionProps = {
  presence: YamaPresenceViewModel;
  className?: string;
};

export function YamaReaction({ presence, className }: YamaReactionProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-label={presence.ariaLabel}
    >
      <YamaAvatar expression={presence.expression} size="sm" alt="" />
      <p className="text-body-sm text-muted-foreground">{presence.message}</p>
    </div>
  );
}
