"use client";

import { UiIconImage } from "@/components/media/ui-icon-image";
import { cn } from "@/lib/utils";

type LessonHeartsProps = {
  remaining: number;
  max: number;
  className?: string;
};

export function LessonHearts({ remaining, max, className }: LessonHeartsProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${remaining} of ${max} hearts remaining`}
      role="status"
    >
      {Array.from({ length: max }).map((_, index) => {
        const filled = index < remaining;
        return (
          <span
            key={index}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full border transition-colors",
              filled
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-white/10 bg-black/25 text-white/25",
            )}
            aria-hidden
          >
            <UiIconImage
              name="flame"
              size={14}
              className={cn(!filled && "opacity-40 grayscale")}
            />
          </span>
        );
      })}
    </div>
  );
}
