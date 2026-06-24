"use client";

import { JapaneseText } from "@/features/learning/components/japanese-text";
import type { LessonFillBlankOption } from "@/features/learning/types/lesson.types";
import { cn } from "@/lib/utils";

type FillBlankOptionTileProps = {
  option: LessonFillBlankOption;
  selected?: boolean;
  used?: boolean;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  isIncorrectSelection?: boolean;
  onClick: () => void;
  layout?: "row" | "chip";
};

export function FillBlankOptionTile({
  option,
  selected = false,
  used = false,
  disabled = false,
  showResult = false,
  isCorrect = false,
  isIncorrectSelection = false,
  onClick,
  layout = "row",
}: FillBlankOptionTileProps) {
  const isChip = layout === "chip";

  return (
    <button
      type="button"
      disabled={disabled || used}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "focus-ring transition-all duration-200 motion-reduce:transition-none",
        isChip
          ? "rounded-xl border px-3 py-2 text-left disabled:opacity-35"
          : "w-full rounded-xl border px-4 py-3 text-left",
        "border-white/10 bg-black/30 hover:border-trail-glow/40 hover:bg-black/45",
        selected && !showResult && "border-trail-glow/50 bg-trail-glow/10",
        showResult && isCorrect && "border-trail-glow/60 bg-trail-glow/15 trail-glow-warm",
        showResult &&
          isIncorrectSelection &&
          "border-destructive/50 bg-destructive/10 animate-[lesson-shake_0.42s_ease-in-out]",
        used && !selected && "opacity-35",
      )}
    >
      <JapaneseText
        text={option.japanese}
        reading={option.reading}
        romaji={option.romaji}
        size={isChip ? "sm" : "md"}
        className="text-foreground"
      />
    </button>
  );
}
