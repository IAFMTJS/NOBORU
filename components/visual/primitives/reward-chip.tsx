import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type RewardChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "xp" | "gem";
};

export function RewardChip({
  variant = "xp",
  className,
  children,
  ...props
}: RewardChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold",
        variant === "xp" && "text-xp-gold bg-trail-glow/10",
        variant === "gem" && "text-reward bg-reward/10",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
