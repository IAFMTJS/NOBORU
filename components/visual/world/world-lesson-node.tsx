"use client";

import type { LessonNodeVisualKind } from "@/lib/assets/lesson-node-assets";
import { resolveLessonNodeAsset } from "@/lib/assets/lesson-node-assets";
import type { TrailNodeKind, TrailNodeState } from "@/features/learning/types/trail.types";
import { cn } from "@/lib/utils";

import { WorldArtImage } from "./world-art-image";

type WorldLessonNodeProps = {
  state: TrailNodeState;
  nodeKind?: TrailNodeKind | LessonNodeVisualKind;
  lessonType?: string | null;
  isCurrent?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

const SIZE_PX = { sm: 36, md: 44, lg: 56 } as const;

const GLOW: Record<TrailNodeState, string> = {
  locked: "opacity-50 grayscale",
  available: "trail-glow-warning",
  in_progress: "trail-glow-warm scale-110",
  completed: "trail-glow-success",
};

/** Doc 11 Component 001 — lesson node as approved world art, not CSS circle. */
export function WorldLessonNode({
  state,
  nodeKind = "lesson",
  lessonType,
  isCurrent = false,
  size = "md",
  className,
  onClick,
}: WorldLessonNodeProps) {
  const px = SIZE_PX[size];
  const asset = resolveLessonNodeAsset({ state, nodeKind, lessonType });
  const interactive = state !== "locked" && onClick;

  const content = (
    <WorldArtImage
      asset={asset}
      alt=""
      width={px}
      height={px}
      className={cn(
        "drop-shadow-md transition-all duration-300 motion-reduce:transition-none",
        GLOW[state],
        isCurrent && "animate-[journey-node-pulse_2s_ease-in-out_infinite] motion-reduce:animate-none",
        className,
      )}
    />
  );

  if (!interactive) {
    return <div className="flex items-center justify-center">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex items-center justify-center rounded-full"
      aria-label="Open lesson"
    >
      {content}
    </button>
  );
}
