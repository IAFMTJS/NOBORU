"use client";

import Link from "next/link";

import { TrailNodeMarker } from "@/features/learning/components/trail/trail-node-marker";
import { cn } from "@/lib/utils";
import type {
  TrailNodeState,
  TrailNodeViewModel,
} from "@/features/learning/types/trail.types";

const STATE_LABELS: Record<TrailNodeState, string> = {
  completed: "Completed lesson",
  in_progress: "Continue lesson",
  available: "Next lesson",
  locked: "Locked lesson",
};

export function TrailPathNode({
  node,
  position,
  nodeIndex: _nodeIndex,
  compact,
  minimal,
  labelsBelow,
  immersive,
  anchored = false,
  onNodeSelect,
  labelTheme,
}: {
  node: TrailNodeViewModel;
  position: { x: number; y: number };
  nodeIndex: number;
  compact?: boolean;
  minimal?: boolean;
  labelsBelow?: boolean;
  immersive?: boolean;
  /** When true, the parent wrapper owns left/top placement along the trail. */
  anchored?: boolean;
  onNodeSelect?: (node: TrailNodeViewModel) => void;
  labelTheme?: string;
}) {
  const isCheckpoint = node.nodeKind === "checkpoint";
  const isCurrent = node.state === "in_progress";
  const labelSide =
    immersive || labelsBelow ? "right" : position.x < 48 ? "right" : "left";
  const usePillLabels = immersive && !labelsBelow;
  const ariaLabel = `${STATE_LABELS[node.state]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;
  const interactive = Boolean(onNodeSelect) || Boolean(node.href);

  const markerSize: "sm" | "md" | "lg" = isCheckpoint
    ? labelsBelow
      ? "lg"
      : "md"
    : labelsBelow && isCurrent
      ? "lg"
      : usePillLabels
        ? "md"
        : compact || minimal
          ? "sm"
          : "md";

  const labelOnLeft = !immersive && !labelsBelow && position.x >= 50;
  const hideLockedLabel =
    immersive && node.state === "locked" && (labelsBelow || usePillLabels);

  const marker = (
    <div className={cn("relative z-10 shrink-0", labelsBelow && "z-20")}>
      <TrailNodeMarker
        state={node.state}
        nodeKind={node.nodeKind}
        size={markerSize}
      />
      {labelsBelow && !hideLockedLabel ? (
        <span
          className={cn(
            "pointer-events-none absolute top-[calc(100%+0.35rem)] max-w-[5.5rem] truncate text-[0.6875rem] font-medium leading-tight",
            immersive ? "text-white/90 drop-shadow-sm" : "text-foreground",
            node.state === "locked" ? "text-muted-foreground/80" : null,
            labelOnLeft
              ? "right-full mr-1.5 text-right"
              : "left-full ml-1.5 text-left",
          )}
        >
          {node.label}
        </span>
      ) : null}
    </div>
  );

  const pillLabel = usePillLabels && !hideLockedLabel ? (
    <span
      className={cn(
        "pointer-events-none max-w-[9rem] truncate rounded-full border px-3 py-1.5",
        "text-body-sm font-medium shadow-sm backdrop-blur-md",
        labelTheme === "light"
          ? "border-border/60 bg-card/85 text-foreground"
          : "border-white/10 bg-black/55 text-white",
        node.state === "locked" &&
          (labelTheme === "light" ? "text-muted-foreground" : "text-white/75"),
      )}
    >
      {node.label}
    </span>
  ) : null;

  const card =
    minimal || labelsBelow || usePillLabels ? null : (
      <div
        className={cn(
          "pointer-events-none max-w-[7.5rem] rounded-lg border border-border/60 bg-card/92 p-2 shadow-elevation-1 backdrop-blur-md transition-colors sm:max-w-[9rem]",
          node.state === "locked" ? "opacity-75" : null,
          interactive ? "hover:bg-accent/35" : "cursor-not-allowed opacity-75",
          compact && "max-w-[6.5rem] p-1.5",
        )}
      >
        <p
          className={cn(
            "line-clamp-2 font-medium leading-tight",
            compact ? "text-[0.65rem]" : "text-caption",
          )}
        >
          {node.label}
        </p>
        {!compact && node.subtitle ? (
          <p className="mt-0.5 truncate text-[0.65rem] text-muted-foreground">
            {node.subtitle}
          </p>
        ) : null}
      </div>
    );

  const labelTransform =
    labelsBelow || minimal
      ? "translate(-50%, -50%)"
      : `translate(${labelSide === "right" ? "-12%" : "-88%"}, -50%)`;

  const touchTargetClass = cn(
    "inline-flex shrink-0 touch-manipulation items-center justify-center",
    "min-h-11 min-w-11 border-0 bg-transparent p-0",
    interactive && onNodeSelect ? "cursor-pointer" : null,
  );

  const interactiveMarker = interactive ? (
    onNodeSelect ? (
      <button
        type="button"
        className={touchTargetClass}
        aria-label={ariaLabel}
        onClick={() => onNodeSelect(node)}
      >
        {marker}
      </button>
    ) : node.href ? (
      <Link href={node.href} className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </Link>
    ) : (
      <div className={touchTargetClass} aria-label={ariaLabel}>
        {marker}
      </div>
    )
  ) : (
    <div aria-label={ariaLabel}>{marker}</div>
  );

  const anchoredLayout = (
    <div
      className={cn(
        "pointer-events-none",
        usePillLabels
          ? "flex items-center gap-2"
          : labelsBelow || minimal
            ? "flex flex-col items-center"
            : cn(
                "flex items-center gap-1.5",
                labelSide === "right" ? "flex-row" : "flex-row-reverse",
              ),
      )}
    >
      <div className="pointer-events-auto">{interactiveMarker}</div>
      {pillLabel}
      {card}
    </div>
  );

  const floatingLayout = (
    <div
      className={cn(
        "absolute",
        labelsBelow || minimal
          ? "flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          : cn(
              "flex -translate-y-1/2 items-center gap-1.5",
              labelSide === "right" ? "flex-row" : "flex-row-reverse",
            ),
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: labelTransform,
      }}
    >
      {interactiveMarker}
      {pillLabel}
      {card}
    </div>
  );

  return anchored ? anchoredLayout : floatingLayout;
}
