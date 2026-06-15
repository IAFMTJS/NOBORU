"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type TrailAnswerOption = {
  id: string;
  label: ReactNode;
  state?: "default" | "selected" | "correct" | "incorrect" | "disabled";
  shake?: boolean;
  onSelect?: () => void;
};

type TrailAnswerPadProps = {
  options: TrailAnswerOption[];
  columns?: 1 | 2;
  className?: string;
  ariaLabel?: string;
};

const STATE_CLASSES: Record<NonNullable<TrailAnswerOption["state"]>, string> = {
  default:
    "border-white/12 bg-black/35 hover:border-trail-glow/45 hover:bg-black/50",
  selected: "border-trail-glow/60 bg-trail-glow/12 shadow-[0_0_12px_hsl(var(--trail-glow)/0.15)]",
  correct: "border-trail-glow/65 bg-trail-glow/18 trail-glow-warm",
  incorrect: "border-destructive/55 bg-destructive/12",
  disabled: "border-white/8 bg-black/25 opacity-60",
};

/** Stone path answer tiles — replaces generic button stacks in lesson drills. */
export function TrailAnswerPad({
  options,
  columns = 1,
  className,
  ariaLabel = "Answer choices",
}: TrailAnswerPadProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={cn(
        "rounded-2xl border border-amber-900/30 bg-gradient-to-b from-black/55 to-black/70 p-3 shadow-inner",
        columns === 2 ? "grid gap-2 sm:grid-cols-2" : "space-y-2",
        className,
      )}
    >
      {options.map((option) => {
        const state = option.state ?? "default";
        const interactive = Boolean(option.onSelect) && state !== "disabled";

        return (
          <button
            key={option.id}
            type="button"
            role="listitem"
            disabled={!interactive}
            onClick={option.onSelect}
            className={cn(
              "focus-ring w-full rounded-xl border px-4 py-3 text-left text-body-sm font-medium transition-all duration-200 motion-reduce:transition-none",
              STATE_CLASSES[state],
              option.shake && "animate-[lesson-shake_0.42s_ease-in-out]",
              !interactive && "cursor-default",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
