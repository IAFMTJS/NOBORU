"use client";

import Link from "next/link";

import { WorldBossNode } from "@/components/visual/world/world-boss-node";
import { WorldLessonNode } from "@/components/visual/world/world-lesson-node";
import { WorldArtImage } from "@/components/visual/world/world-art-image";
import { JourneyCheckpointCelebration } from "@/features/journey/components/journey-checkpoint-celebration";
import { JOURNEY_MOCKUP } from "@/features/journey/constants/journey-mockup.constants";
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
      size={isCurrent ? "lg" : "md"}
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
  effectsEnabled,
}: {
  state: JourneyNodeState;
  isCurrent: boolean;
  effectsEnabled: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-20",
        isCurrent ? "scale-125" : "scale-110",
        effectsEnabled && state !== "locked" && "trail-glow-warning",
        state === "locked" && "opacity-75",
      )}
    >
      {effectsEnabled && state !== "locked" ? (
        <span
          className="pointer-events-none absolute -inset-4 rounded-full bg-red-600/20 blur-xl motion-safe:animate-pulse motion-reduce:animate-none"
          aria-hidden
        />
      ) : null}
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

  const nodeSize =
    isCurrent || isSelected ? "lg" : node.state === "locked" ? "sm" : "md";

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
      size={nodeSize}
    />
  );

  const content = (
    <div
      className={cn(
        "transition-all duration-300 motion-reduce:transition-none",
        isCurrent && `scale-[${JOURNEY_MOCKUP.node.currentScale}]`,
        isSelected && !isCurrent && `scale-[${JOURNEY_MOCKUP.node.selectedScale}]`,
        isPulsing && "motion-reward animate-[journey-node-pulse_1.6s_ease-in-out_3] motion-reduce:animate-none",
      )}
      style={{
        opacity: discoveryOpacity,
        transform: isCurrent
          ? `scale(${JOURNEY_MOCKUP.node.currentScale})`
          : isSelected
            ? `scale(${JOURNEY_MOCKUP.node.selectedScale})`
            : undefined,
      }}
    >
      <div
        className={cn(
          "rounded-full transition-shadow duration-300 motion-reduce:transition-none",
          isCurrent && cn(JOURNEY_MOCKUP.glow.warmHalo, JOURNEY_MOCKUP.glow.currentRing),
          (isSelected || isPulsing) && !isCurrent && "trail-glow-warm ring-2 ring-trail-glow/40",
          isTrial && node.state !== "locked" && "ring-2 ring-red-500/40",
        )}
      >
        {marker}
      </div>
      {isCurrent && !isLandmark ? (
        <p className="pointer-events-none absolute left-1/2 top-full mt-1 w-max max-w-[8rem] -translate-x-1/2 truncate rounded-full border border-trail-glow/30 bg-black/55 px-2 py-0.5 text-center text-[9px] font-medium uppercase tracking-wide text-trail-glow backdrop-blur-sm">
          You are here
        </p>
      ) : null}
    </div>
  );

  const focusRing =
    "rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  if (isLandmark) {
    return (
      <div aria-label={ariaLabel} className="pointer-events-none relative">
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
          "relative inline-flex transition-opacity",
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
      className={cn("relative inline-flex", node.state === "locked" && "opacity-60")}
    >
      {content}
    </div>
  );
}
