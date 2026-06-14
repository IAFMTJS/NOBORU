"use client";

import Link from "next/link";

import { TrailNodeMarker } from "@/features/learning/components/trail/trail-node-marker";
import type {
  JourneyNode,
  JourneyNodeKind,
  JourneyNodeState,
} from "@/features/learning/types/journey.types";
import type { TrailNodeKind } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

type JourneyPathNodeProps = {
  node: JourneyNode;
  isCurrent?: boolean;
  onSelect?: (node: JourneyNode) => void;
};

const STATE_LABELS: Record<JourneyNodeState, string> = {
  completed: "Completed",
  in_progress: "Continue",
  available: "Next up",
  locked: "Locked",
};

const KIND_LABELS: Record<JourneyNodeKind, string> = {
  lesson: "Lesson",
  checkpoint: "Checkpoint",
  landmark: "Landmark",
  trial: "Trial",
};

function resolveTrailNodeKind(kind: JourneyNodeKind): TrailNodeKind {
  if (kind === "trial") return "application";
  if (kind === "checkpoint") return "checkpoint";
  return "lesson";
}

function LandmarkMarker({ state }: { state: JourneyNodeState }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed backdrop-blur-sm",
        state === "completed"
          ? "border-success/70 bg-success/15 text-success"
          : state === "available"
            ? "border-warning/70 bg-warning/10 text-warning"
            : "border-white/20 bg-black/30 text-white/50",
      )}
    >
      <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden>
        <path
          d="M8 2.5 9.5 6.5 13.5 7 10.25 9.5 11.25 13.5 8 11.25 4.75 13.5 5.75 9.5 2.5 7 6.5 6.5Z"
          fill="currentColor"
        />
        <path
          d="M8 11.25V14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function CheckpointMarker({
  state,
  isCurrent,
}: {
  state: JourneyNodeState;
  isCurrent: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-lg border-[3px] backdrop-blur-sm",
        state === "completed"
          ? "border-success bg-success/15 text-success"
          : state === "in_progress"
            ? "border-primary bg-primary/15 text-primary"
            : state === "available"
              ? "border-warning bg-warning/15 text-warning"
              : "border-white/25 bg-black/40 text-white/50",
        isCurrent && "scale-110 ring-2 ring-primary/60 ring-offset-2 ring-offset-transparent",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <path
          d="M4 4V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 6H14L11.5 10L15 14H4"
          fill="currentColor"
        />
        <path
          d="M4 14H14L11.5 18L15 22H4"
          fill="currentColor"
          opacity={0.55}
        />
      </svg>
    </div>
  );
}

export function JourneyPathNode({
  node,
  isCurrent = false,
  onSelect,
}: JourneyPathNodeProps) {
  const isLandmark = node.kind === "landmark";
  const isCheckpoint = node.kind === "checkpoint";
  const isInteractive =
    !isLandmark &&
    Boolean(onSelect) &&
    (node.kind === "lesson" || node.kind === "checkpoint");

  const ariaLabel = `${STATE_LABELS[node.state]} ${KIND_LABELS[node.kind]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;

  const label = (
    <span
      className={cn(
        "pointer-events-none max-w-[9rem] truncate rounded-full border px-3 py-1.5",
        "text-body-sm font-medium shadow-sm backdrop-blur-md",
        "border-white/10 bg-black/55 text-white",
        node.state === "locked" && "text-white/70",
        isLandmark && "border-dashed border-white/20 text-white/80",
      )}
    >
      {node.label}
    </span>
  );

  const marker = isLandmark ? (
    <LandmarkMarker state={node.state} />
  ) : isCheckpoint ? (
    <CheckpointMarker state={node.state} isCurrent={isCurrent} />
  ) : (
    <div
      className={cn(
        "relative transition-transform",
        isCurrent && "scale-110",
      )}
    >
      <TrailNodeMarker
        state={node.state}
        nodeKind={resolveTrailNodeKind(node.kind)}
        size={isCurrent ? "lg" : "md"}
        className={cn(isCurrent && "ring-2 ring-primary/70 ring-offset-2 ring-offset-transparent")}
      />
    </div>
  );

  const content = (
    <div className="flex items-center gap-2">
      {marker}
      {label}
    </div>
  );

  if (isLandmark) {
    return (
      <div aria-label={ariaLabel} className="pointer-events-none">
        {content}
      </div>
    );
  }

  if (node.kind === "trial" && node.href) {
    return (
      <Link
        href={node.href}
        aria-label={ariaLabel}
        className={cn(
          "rounded-full outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          node.state === "locked" && "pointer-events-none opacity-60",
        )}
      >
        {content}
      </Link>
    );
  }

  if (isInteractive) {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => onSelect?.(node)}
        className={cn(
          "rounded-full text-left outline-none transition-opacity",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          node.state === "locked" && "opacity-75",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div aria-label={ariaLabel} className={cn(node.state === "locked" && "opacity-60")}>
      {content}
    </div>
  );
}
