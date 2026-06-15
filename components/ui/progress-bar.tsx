"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  /** When set, shown instead of percent when showValue is true. */
  valueLabel?: string;
  className?: string;
  indicatorClassName?: string;
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  valueLabel,
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const displayValue = valueLabel ?? `${percent}%`;

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-body-sm">
          {label ? (
            <span className="text-muted-foreground">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? <span className="font-medium">{displayValue}</span> : null}
        </div>
      )}
      <Progress
        value={percent}
        aria-label={label ?? "Progress"}
        className="h-2 bg-secondary"
        indicatorClassName={indicatorClassName}
      />
    </div>
  );
}
