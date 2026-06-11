import { cn } from "@/lib/utils";

type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
};

export function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex flex-col items-center gap-2", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="motion-standard transition-[stroke-dashoffset]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={cn(
            "font-semibold",
            size <= 72 ? "text-body-sm" : "text-heading-3",
          )}
        >
          {clamped}%
        </span>
        {sublabel ? (
          <span className="text-[0.65rem] text-muted-foreground">{sublabel}</span>
        ) : null}
      </div>
      {label ? <p className="text-body-sm font-medium">{label}</p> : null}
    </div>
  );
}
