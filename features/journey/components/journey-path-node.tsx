"use client";

import Link from "next/link";

import { WorldBossNode } from "@/components/visual/world/world-boss-node";
import { WorldLessonNode } from "@/components/visual/world/world-lesson-node";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { JourneyCheckpointCelebration } from "@/features/journey/components/journey-checkpoint-celebration";
import type {
  JourneyNode,
  JourneyNodeKind,
  JourneyNodeState,
} from "@/features/journey/types/journey.types";
import type { TrailNodeKind } from "@/features/learning/types/trail.types";
import { resolveLessonNodeAsset } from "@/lib/assets/lesson-node-assets";
import { cn } from "@/lib/utils";

type JourneyPathNodeProps = {
  node: JourneyNode;
  isCurrent?: boolean;
  isSelected?: boolean;
  isPulsing?: boolean;
  discoveryOpacity?: number;
  checkpointCelebration?: boolean;
  trialTempleEffects?: boolean;
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
  const asset = resolveLessonNodeAsset({ state, nodeKind: "landmark" });

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full",
        state === "completed" && "trail-glow-success",
        state === "available" && "trail-glow-warning",
        state === "locked" && "opacity-50 grayscale",
      )}
    >
      <WorldArtImage
        asset={asset}
        alt=""
        width={44}
        height={44}
        className="drop-shadow-md"
      />
    </div>
  );
}

function CheckpointMarker({
  state,
  isCurrent,
  celebrationEnabled,
}: {
  state: JourneyNodeState;
  isCurrent: boolean;
  celebrationEnabled: boolean;
}) {
  const marker = (
    <WorldLessonNode
      state={state}
      nodeKind="checkpoint"
      isCurrent={isCurrent}
      size="lg"
    />
  );

  return (
    <JourneyCheckpointCelebration
      completed={state === "completed"}
      enabled={celebrationEnabled}
    >
      {marker}
    </JourneyCheckpointCelebration>
  );
}

function TrialMarker({
  state,
  isCurrent,
}: {
  state: JourneyNodeState;
  isCurrent: boolean;
  effectsEnabled: boolean;
}) {
  return (
    <div className="relative z-20 scale-110">
      <WorldBossNode state={state} isCurrent={isCurrent} />
    </div>
  );
}

export function JourneyPathNode({
  node,
  isCurrent = false,
  isSelected = false,
  isPulsing = false,
  discoveryOpacity = 1,
  checkpointCelebration = true,
  trialTempleEffects = true,
  onSelect,
}: JourneyPathNodeProps) {
  const isLandmark = node.kind === "landmark";
  const isCheckpoint = node.kind === "checkpoint";
  const isTrial = node.kind === "trial";
  const isInteractive =
    !isLandmark &&
    Boolean(onSelect) &&
    (node.kind === "lesson" || node.kind === "checkpoint");

  const ariaLabel = `${STATE_LABELS[node.state]} ${KIND_LABELS[node.kind]}: ${node.label}${
    node.subtitle ? `, ${node.subtitle}` : ""
  }`;

  const marker = isLandmark ? (
    <LandmarkMarker state={node.state} />
  ) : isCheckpoint ? (
    <CheckpointMarker
      state={node.state}
      isCurrent={isCurrent}
      celebrationEnabled={checkpointCelebration}
    />
  ) : isTrial ? (
    <TrialMarker
      state={node.state}
      isCurrent={isCurrent}
      effectsEnabled={trialTempleEffects}
    />
  ) : (
    <WorldLessonNode
      state={node.state}
      nodeKind={resolveTrailNodeKind(node.kind)}
      lessonType={node.lessonType}
      isCurrent={isCurrent || isSelected}
      size={isCurrent || isSelected ? "lg" : "md"}
    />
  );

  const content = (
    <div
      className={cn(
        "transition-all duration-300 motion-reduce:transition-none",
        isSelected && "scale-110",
        isPulsing && "motion-reward animate-[journey-node-pulse_1.6s_ease-in-out_3] motion-reduce:animate-none",
      )}
      style={{ opacity: discoveryOpacity }}
    >
      <div
        className={cn(
          "rounded-full transition-shadow duration-300 motion-reduce:transition-none",
          (isSelected || isPulsing) && "trail-glow-warm ring-2 ring-trail-glow/50 ring-offset-2 ring-offset-transparent",
        )}
      >
        {marker}
      </div>
    </div>
  );

  const focusRing =
    "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  if (isLandmark) {
    return (
      <div aria-label={ariaLabel} className="pointer-events-none">
        {content}
      </div>
    );
  }

  if (isTrial && node.href) {
    return (
      <Link
        href={node.href}
        aria-label={ariaLabel}
        className={cn(
          focusRing,
          "relative z-20 inline-flex transition-opacity",
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
        aria-pressed={isSelected}
        onClick={() => onSelect?.(node)}
        className={cn(
          focusRing,
          "inline-flex transition-opacity",
          node.state === "locked" && "opacity-75",
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      className={cn("inline-flex", node.state === "locked" && "opacity-60")}
    >
      {content}
    </div>
  );
}
