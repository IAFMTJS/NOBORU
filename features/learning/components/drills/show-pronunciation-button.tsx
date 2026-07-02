"use client";

import { PrimaryClimbButton } from "@/components/visual/primary-climb-button";
import { cn } from "@/lib/utils";

type ShowPronunciationButtonProps = {
  visible: boolean;
  revealed: boolean;
  onReveal: () => void;
  className?: string;
};

export function ShowPronunciationButton({
  visible,
  revealed,
  onReveal,
  className,
}: ShowPronunciationButtonProps) {
  if (!visible || revealed) return null;

  return (
    <button
      type="button"
      className={cn(
        "focus-ring text-caption text-trail-glow underline-offset-2 hover:underline",
        className,
      )}
      onClick={onReveal}
    >
      Show pronunciation
    </button>
  );
}
