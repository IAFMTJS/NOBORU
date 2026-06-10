"use client";

import { YamaAvatar } from "@/features/yama/components/yama-avatar";
import { yamaService } from "@/features/yama/services/yama.service";
import { cn } from "@/lib/utils";

type YamaEncouragementProps = {
  result: "correct" | "incorrect" | null;
  message?: string;
  className?: string;
};

export function YamaEncouragement({
  result,
  message,
  className,
}: YamaEncouragementProps) {
  if (!result) return null;

  const presence = yamaService.resolveDrillFeedback(result);
  const displayMessage = message ?? presence.message;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors duration-200 motion-reduce:transition-none",
        result === "correct"
          ? "border-success/30 bg-success/10"
          : "border-destructive/30 bg-destructive/10",
        className,
      )}
      role="status"
      aria-label={`Yama: ${displayMessage}`}
    >
      <YamaAvatar
        expression={presence.expression}
        size="sm"
        alt=""
        className="mt-0.5"
      />
      <p
        className={cn(
          "text-body-sm",
          result === "correct" ? "text-success-foreground" : "text-destructive",
        )}
      >
        {displayMessage}
      </p>
    </div>
  );
}
