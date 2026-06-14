import type { TrailNodeKind, TrailNodeState } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

type TrailNodeMarkerIcon =
  | "completed"
  | "in_progress"
  | "available"
  | "locked"
  | "checkpoint"
  | "application";

type TrailNodeMarkerProps = {
  state: TrailNodeState;
  nodeKind?: TrailNodeKind;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES = {
  sm: { outer: "h-8 w-8", inner: "h-5 w-5", icon: "h-3 w-3" },
  md: { outer: "h-9 w-9", inner: "h-6 w-6", icon: "h-3.5 w-3.5" },
  lg: { outer: "h-12 w-12", inner: "h-8 w-8", icon: "h-4 w-4" },
} as const;

const RING_STYLES: Record<TrailNodeState, string> = {
  completed: "border-success bg-success/20 text-success trail-glow-success",
  in_progress: "border-trail-glow bg-trail-glow/20 text-heading-story trail-glow-warm",
  available: "border-warning bg-warning/20 text-warning trail-glow-warning",
  locked: "border-border/80 bg-background/70 text-muted-foreground",
};

const FILL_STYLES: Record<TrailNodeState, string> = {
  completed: "bg-success text-success-foreground",
  in_progress: "bg-primary text-primary-foreground",
  available: "bg-warning text-warning-foreground",
  locked: "bg-muted-foreground/60 text-background",
};

function resolveIcon(
  state: TrailNodeState,
  nodeKind: TrailNodeKind = "lesson",
): TrailNodeMarkerIcon {
  if (nodeKind === "checkpoint") return "checkpoint";
  if (nodeKind === "application") return "application";
  if (state === "locked") return "locked";
  if (state === "completed") return "completed";
  if (state === "in_progress") return "in_progress";
  return "available";
}

function MarkerGlyph({
  icon,
  className,
}: {
  icon: TrailNodeMarkerIcon;
  className?: string;
}) {
  switch (icon) {
    case "completed":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <path
            d="M3.5 8.25 6.5 11.25 12.5 4.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "in_progress":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <path d="M5.5 3.75 12.25 8 5.5 12.25Z" fill="currentColor" />
        </svg>
      );
    case "available":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <path d="M5.5 3.75 12.25 8 5.5 12.25Z" fill="currentColor" />
        </svg>
      );
    case "locked":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <rect
            x="4.25"
            y="7"
            width="7.5"
            height="5.75"
            rx="1.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5.75 7V5.5a2.25 2.25 0 0 1 4.5 0V7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "checkpoint":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <path
            d="M4 2.5V13.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 3.5h5.5l-1.25 2.25L9.5 8 4 8"
            fill="currentColor"
          />
        </svg>
      );
    case "application":
      return (
        <svg viewBox="0 0 16 16" className={className} aria-hidden>
          <path
            d="M8 2.5 9.35 6.15 13.25 6.2 10.1 8.55 11.2 12.35 8 10.2 4.8 12.35 5.9 8.55 2.75 6.2 6.65 6.15Z"
            fill="currentColor"
          />
        </svg>
      );
  }
}

export function TrailNodeMarker({
  state,
  nodeKind = "lesson",
  size = "md",
  className,
}: TrailNodeMarkerProps) {
  const sizes = SIZE_CLASSES[size];
  const icon = resolveIcon(state, nodeKind);
  const isCheckpoint = nodeKind === "checkpoint" && state !== "locked";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border-2 backdrop-blur-sm",
        sizes.outer,
        RING_STYLES[state],
        isCheckpoint && "border-warning/90 trail-glow-warning",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          sizes.inner,
          FILL_STYLES[state],
        )}
      >
        <MarkerGlyph icon={icon} className={sizes.icon} />
      </div>
    </div>
  );
}
